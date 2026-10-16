# Performance Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the site use far less memory and stop freezing the main thread, on every device, with visuals and behaviour unchanged.

**Architecture:** Measure first, then fix the costs in order of size: the land mask is uploaded as one byte per pixel instead of four, decoded without blocking; the WebGL canvas moves into the root layout so page changes stop rebuilding it; high-density screens drop the 4x MSAA they do not need; per-frame work that draws or writes nothing visible is skipped; unused fonts and CSS stop shipping. Every task is gated by an A/B visual check against a frozen copy of today's build.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, three r185, @react-three/fiber 9, GSAP 3.15, Node 22 built-in test runner.

**Spec:** Juno's request (2026-10-16): "make sure our site runs optimally at any device on any memory size. Refactor the site, making code aim to make the site run smoother, and use less memory, while keeping visuals and functionality the same." No separate spec document; the baseline below is the evidence each task argues from.

## Baseline (production build, Brave on RTX 4070 SUPER, measured 2026-10-16)

| Measure | Desktop 1440×900 @1x | @2x | Phone 390×844 @3x | Source |
|---|---|---|---|---|
| Land mask, GPU | 171 MB (8192×4096 RGBA8 + 13 mips) | 171 MB | 43 MB (4k) | WebGL call tally |
| Default framebuffer, GPU | ~46 MB (4x MSAA) | ~185 MB (4x MSAA) | ~47 MB | estimate: w×h×(4 samples×8 B + 4 B) |
| Main-thread freeze at load | 212 ms (88 ms of it PNG decode) | 226 ms | 29 ms | long tasks + trace |
| Same, CPU throttled 4× | 840 ms max task, 984 ms blocking | | | |
| Per page change (/ ↔ /overview) | new WebGL context, 171 MB re-upload, 230–340 ms freeze | same | | 4 round trips: 9 contexts, 1.5 GB uploaded |
| JS heap after 4 round trips (after GC) | 7.9 → 10.8 MB | 8.0 → 10.8 MB | | |
| three + R3F + GSAP chunk | ~1.05 MB, bundled twice (one copy for /, one for /overview + /affiliations) | | | build output |
| Fonts preloaded | 7 families; Geist Sans, Alex Brush, Cochocib unused | | | grep + `.next/static/media` |

Frame rate on this GPU is pinned at the display (120 Hz) before and after, so it cannot show gains here; the wins are memory, freezes and work per frame.

## Global Constraints

- Visuals identical: every frozen view in `scripts/perf/visual.js` must report `changedPct: 0`; every live view must stay within the measured noise floor (`meanAbs ≤ 1.0`, `over24Pct ≤ 0.6`). Only Task 4 may differ, within `meanAbs ≤ 0.2` and `over24Pct ≤ 0.01` at 2x, and only after Juno signs off on its screenshots.
- Functionality identical: loader and intro, unfold builds, panel snap, globe drag and waypoints, service deck and its globe turn, `/overview#<slug>` deep links, theme toggle, reduced motion.
- No new runtime dependencies.
- Comments: one or two lines, never block comments (house style).
- Never start, stop or restart Juno's dev server on :3000. Verify against `next build` + `next start -p 3100`; the frozen baseline copy serves on :3101 (see Task 1).
- Before using any Next.js API, read the matching guide in `node_modules/next/dist/docs/` (AGENTS.md).
- Each task ends in its own commit on a branch cut from `feat/overview` after the overview deck work is committed. Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Keep CLAUDE.md true: any task that changes what it describes updates it in the same commit.

## Review Focus

1. Back/forward to `/` with a restored scroll position: the sphere must take that panel's pose directly, with no sweep from pose 0. Tested in Task 3.
2. Arriving on `/overview#search-seo` by client-side navigation after the canvas already exists: the deck opens on card 3 and the globe sits turned to it. Tested in Task 3.
3. Resizing across 768 px after a page change: the sphere switches desktop/mobile poses as before. Tested in Task 3.
4. A 404, then back to `/`: no canvas on the 404, and the home scene rebuilds with the loader and intro. Tested in Task 3.
5. A browser without `DecompressionStream`: the old PNG path still renders the same land. Tested in Task 2.

---

### Task 1: Measurement scripts in the repo

**Files:**
- Create: `scripts/perf/measure.js` (from `.playwright-mcp/perf/measure.js`)
- Create: `scripts/perf/visual.js` (from `.playwright-mcp/perf/visual.js`)

**Interfaces:**
- Produces: two Playwright MCP snippets, each `async (page) => result`, run with the `browser_run_code_unsafe` tool and `filename: "scripts/perf/<name>.js"`. `measure.js` targets `http://localhost:3100` and returns `{ dpr1, dpr2, cpu4x, phone, renderer }` with the fields in the baseline table. `visual.js` compares `:3101` (baseline) with `:3100` (working) and returns, per view, `{ compared, changedPct, over24Pct, meanAbs }`.

- [ ] **Step 1:** Copy both files, and add a two-line header to each saying what it measures and how to run it (`npx next build && npx next start -p 3100`, baseline copy on `:3101`).
- [ ] **Step 2: Baseline copy.** Build today's tree once and copy `.next` (minus `dev/` and `cache/`), `public/`, `package.json` and `next.config.ts` into the session scratchpad with `node_modules` linked by junction, then serve it with `node node_modules/next/dist/bin/next start -p 3101`. Already running in this session; recreate it only if it is gone.
- [ ] **Step 3: Verify.** Run `visual.js` with both servers serving the same build. Expected: all frozen views `changedPct: 0`; live views within the noise floor.
- [ ] **Step 4: Commit** `chore: add perf and visual check scripts`.

### Task 2: One-byte land mask, decoded off the critical path

**Files:**
- Create: `lib/greyPng.ts`
- Create: `lib/greyPng.test.mjs`
- Create: `lib/maskLoader.ts`
- Modify: `components/WireframeSphere.tsx` (mask load, anisotropy, land material)
- Modify: `components/Scene.tsx:9-11` (preload)
- Modify: `lib/choreography.ts` (`maskUrlFor`)
- Modify: `package.json` (add `"test": "node --experimental-strip-types --test"`)
- Modify: `CLAUDE.md` (Assets and sphere paragraphs; no-test-suite line)

**Interfaces:**
- Produces: `decodeGreyPng(png: ArrayBuffer, options?: { flipY?: boolean; yieldEvery?: number }): Promise<{ width: number; height: number; data: Uint8Array }>` and `class UnsupportedPngError extends Error` in `lib/greyPng.ts`. No imports, so Node can run it directly.
- Produces: `class MaskLoader extends Loader<Texture>` in `lib/maskLoader.ts`, used as `useLoader(MaskLoader, url)` and `useLoader.preload(MaskLoader, url)`.
- Produces: `maskUrlFor(width: number, maxTextureSize?: number): string` (8k only when width ≥ 768 and `maxTextureSize ≥ 8192`).

- [ ] **Step 1: Write the failing tests** in `lib/greyPng.test.mjs` with `node:test` and `node:zlib`. The fixtures are PNGs the test encodes itself: an IHDR plus a zlib IDAT whose rows apply a forward filter.
  - `decodes every filter type`: a 5×5 greyscale image whose rows use filters 0, 1, 2, 3, 4 in turn decodes to exactly the source bytes.
  - `flipY reverses rows`: with `{ flipY: true }`, row 0 of `data` equals the image's last row.
  - `concatenates split IDAT chunks`: the same image with its IDAT split into three chunks decodes identically.
  - `rejects what it cannot read`: colour type 6 (RGBA) and interlace 1 each reject with `UnsupportedPngError`.
  - `reads the shipped mask`: `public/earth-mask-4k.png` decodes to `width 4096`, `height 2048`, `data.length 8388608`.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL, module not found.
- [ ] **Step 3: Implement `decodeGreyPng`.** Walk the chunks, concatenating every IDAT. Require bit depth 8, colour type 0 and interlace 0, otherwise throw `UnsupportedPngError`. Inflate with `new DecompressionStream("deflate")`, then unfilter in place over the stride `width + 1`, with Paeth for bpp 1. Write rows into the output bottom-up when `flipY` is set. Every `yieldEvery` rows (default 256), `await` a macrotask so no single task runs long.
- [ ] **Step 4:** Run `npm test`. Expected: 5 passing.
- [ ] **Step 5: Implement `MaskLoader.load(url, onLoad, onProgress, onError)`.**
  - Call `this.manager.itemStart(url)`, then fetch, then `decodeGreyPng(buffer, { flipY: true })`.
  - Build `new DataTexture(data, width, height, RedFormat, UnsignedByteType)` with `minFilter LinearMipmapLinearFilter`, `magFilter LinearFilter`, `generateMipmaps true`, `colorSpace NoColorSpace` and `needsUpdate true`.
  - Then call `onLoad` and `itemEnd(url)`.
  - If `DecompressionStream` is missing, or the decode throws `UnsupportedPngError`, delegate to `new TextureLoader(this.manager).load(...)` (today's path), setting `colorSpace NoColorSpace` there too.
  - On any other error, call `itemError` and `onError`.

  Why it matches today: today's upload uses `UNPACK_COLORSPACE_CONVERSION NONE` for a `NoColorSpace` texture, so the GPU already receives the raw samples. The same raw samples go up as R8.
- [ ] **Step 6: Wire it in.**
  - Swap `useTexture` for `useLoader(MaskLoader, url)` in `WireframeSphere`, and set `anisotropy` in a `useLayoutEffect` on `[mask, gl]`.
  - Give the land material an `onBeforeCompile` that replaces `#include <alphamap_fragment>` with `diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).r;`, plus a `customProgramCacheKey` that returns `"alphamap-r"`. `.r` equals `.g` for the greyscale fallback, so both paths sample the same value.
  - Switch the preload in `Scene` to `useLoader.preload(MaskLoader, …)`.
  - Pass `gl.capabilities.maxTextureSize` to `maskUrlFor` where the sphere picks its URL.
- [ ] **Step 7: Fallback check (Review Focus 5).** On `:3100`, add an init script that deletes `window.DecompressionStream`, load `/affiliations?freeze`, and diff its canvas against `:3101`. Expected: `changedPct: 0`.
- [ ] **Step 8: Verify.** Run `npm run lint`, `npx tsc --noEmit -p .` and `npx next build`, then restart `:3100`.
  - `visual.js`: all frozen views `changedPct: 0`; live views within the noise floor.
  - `measure.js`: `home.gpuTexMB ≈ 43` at 1x and 2x and `phone.gpuTexMB ≈ 11`; no `Decode Image` on the main thread; `home.maxTask` at least 50% below 212 ms; `cpu4x.maxTask` at least 50% below 840 ms.
- [ ] **Step 9: Commit** `perf: upload the land mask as one byte per pixel`.

### Task 3: One canvas for the whole visit

**Files:**
- Create: `lib/sceneRoute.ts`
- Modify: `components/Scene.tsx` (route gate, route signal)
- Modify: `app/layout.tsx` (render `<Scene />` before `{children}`)
- Modify: `app/page.tsx`, `app/overview/page.tsx`, `app/affiliations/page.tsx`: drop `<Scene />`, and drop `bg-background` from each page's root `div`. A positioned opaque wrapper would now cover the layout's canvas; the body already paints the same colour.
- Modify: `lib/useSphereScroll.ts` (rebuild per route, snap included)
- Modify: `lib/useGlobeDrag.ts` (re-attach per route, reset the drag node)
- Modify: `lib/choreography.ts` (`SCENE_ROUTES`)
- Modify: `CLAUDE.md` (architecture section: the canvas lives in the layout)

**Interfaces:**
- Produces: `setSceneRoute(path: string): void` and `onSceneRoute(fn: (path: string) => void): () => void` in `lib/sceneRoute.ts`. The subscription fires at once with the current path, the same module-state bridge pattern as `lib/sphereTurn.ts`.
- Produces: `SCENE_ROUTES: readonly string[] = ["/", "/overview", "/affiliations"]` in `lib/choreography.ts`.
- Consumes: `MaskLoader` from Task 2 (unchanged here).

- [ ] **Step 1: Route signal.** `Scene` reads `usePathname()`. It calls `setSceneRoute(pathname)` in a `useLayoutEffect`, which runs in the same commit as the new page's DOM, so the sphere re-poses before the first paint. It renders `null` for any path not in `SCENE_ROUTES`.
- [ ] **Step 2: Sphere rebuild.** `useSphereScroll` subscribes with `onSceneRoute`. On each path:
  1. Revert the current `gsap.matchMedia` (timeline, triggers, deck turn and snap all go with it).
  2. `gsap.set` pose 0 at once.
  3. On the next `requestAnimationFrame`, after Next has applied its scroll, create the new `matchMedia` that builds the timeline, the deck turn and the panel snap, as today.

  `usePanelSnap` moves inside that build, under the same `prefers-reduced-motion: no-preference` condition.
- [ ] **Step 3: Drag rebuild.** `useGlobeDrag` subscribes with `onSceneRoute`. On each path it removes the old stage listeners, zeroes the drag node's rotation, fling and turn (a fresh page used to mean a fresh node), and attaches to `[data-globe-stage]` if the new page has one.
- [ ] **Step 4: Move the canvas.** Make the layout, page and wrapper edits listed under Files.
- [ ] **Step 5: Verify.** Run lint, tsc and build, then restart `:3100`.
  - `visual.js`: all views pass, including `home_to_overview_clientnav`.
  - `measure.js`, `navLoop`: `contexts === 1`; `gpuTexMBTotalUploaded` equals the single-load figure; no nav long task over 50 ms; `heapAfter − heapBefore ≤ 0.5`.
  - Build output: one three/R3F/GSAP chunk, listed by all three `server/app/**/*client-reference-manifest.js`.
- [ ] **Step 6: Review Focus 1–4.** Run each with Playwright on `:3100`, against the same steps on `:3101`:
  - **(1)** Scroll home to panel 4, client-navigate to `/overview`, then `page.goBack()`, wait 2.6 s, and compare grey pixels. Expected: within the noise floor of the same steps on `:3101`.
  - **(2)** From home, click the Services link to `/overview#search-seo`. Expected: `aria-current` on tab 3, the deck top at `128`, and a canvas grey-pixel diff within noise against `:3101` doing the same.
  - **(3)** Go to `/overview`, back to `/`, then resize to 600 px wide, wait, and compare against `:3101`. Expected: within noise.
  - **(4)** Go to `/nope`. Expected: no `canvas` element. Then click the FTC mark. Expected: the loader runs and the intro completes (`intro-lock` added, then removed).
- [ ] **Step 7: If the heap check fails.** Take heap snapshots (`HeapProfiler.takeHeapSnapshot`) before and after four round trips, list the constructors whose retained counts grew, trace each to the listener or module state holding it, fix it at the source, and re-run Step 5.
- [ ] **Step 8: Commit** `perf: keep one WebGL canvas across page changes`.

### Task 4: No MSAA where the pixels are already small (needs Juno's sign-off)

**Files:**
- Modify: `components/Scene.tsx` (`gl` prop)
- Modify: `CLAUDE.md` (one line in the Scene description)

**Interfaces:**
- Consumes: `Scene` from Task 3.

- [ ] **Step 1:** Compute `antialias = window.devicePixelRatio < 2` once, in a `useState` initialiser (`true` on the server), and pass `gl={{ powerPreference: "low-power", antialias }}`.
- [ ] **Step 2: Verify.** Run `visual.js`. Expected: 1x views `changedPct: 0`; 2x frozen views within `meanAbs ≤ 0.2` and `over24Pct ≤ 0.01`. The planning experiment measured `meanAbs 0.114` with 2 pixels over 24, against `0.42` and 3,848 pixels at 1x, which is why 1x keeps it. `measure.js` dpr2 should show `antialias: false`.
- [ ] **Step 3:** Show Juno the 2x before/after canvas screenshots side by side. Commit only on a yes.
- [ ] **Step 4: Commit** `perf: skip MSAA on high-density screens`. Estimated saving at 1440×900@2x: about 145 MB of framebuffer, more on 4K and 5K displays.

### Task 5: Skip per-frame work nobody can see

**Files:**
- Modify: `components/GlobeGlow.tsx` (`useFrame`)
- Modify: `components/Waypoints.tsx` (`useFrame`)
- Modify: `scripts/perf/measure.js` (two counters)

**Interfaces:** none new.

- [ ] **Step 1: Add counters to `measure.js`.**
  - `drawsPerFrame` on home panel 3: wrap `drawArrays` and `drawElements`, and count per `requestAnimationFrame` over 1 s.
  - `pinWritesPerSecond` on home panel 4: count `MutationObserver` `style` mutations on the waypoint pin over 1 s, with the page idle.
- [ ] **Step 2:** Run it on today's build. Record the baseline counts. Expected: the ring's draw is present on panel 3 (glow 0), and pin writes run at about the frame rate.
- [ ] **Step 3: Skip the hidden draws.**
  - **Ring:** `GlobeGlow` sets the points' `visible` to `uOpacity > 0.001` every frame. It becomes the sole writer of `visible`; drift is skipped when hidden, as today.
  - **Pins:** `Waypoints` keeps the last transform string and back-face flag per pin, and writes `style.transform` or `data-back` only when they change.
- [ ] **Step 4: Verify.** `visual.js` all pass. Panel 3 draws one fewer call per frame. Pin writes while idle are 0.
- [ ] **Step 5: Commit** `perf: skip ring draws and pin writes that change nothing`.

### Task 6: Stop shipping fonts and CSS nothing uses

**Files:**
- Modify: `app/layout.tsx`: remove `Geist` (sans), `Alex_Brush` and the `Cochocib` `localFont`, along with their variables.
- Modify: `app/globals.css`: remove the `--font-cochocib` and `--font-alex` theme keys, the `@import "./typeset.css"`, and the `.typeset-ftc` block.
- Delete: `app/typeset.css`
- Modify: `CLAUDE.md` (fonts paragraph), `CREDITS.md` (Cochocib no longer shipped; the file stays in `fonts/`)

**Interfaces:** none.

- [ ] **Step 1:** Re-run `grep -rn "font-alex\|font-cochocib\|geist-sans\|typeset" app components lib`. Expected: matches only in the files being edited.
- [ ] **Step 2:** Make the edits.
- [ ] **Step 3: Verify.**
  - `visual.js`: all frozen full-page views `changedPct: 0`.
  - `.next/static/media`: 4 preloaded (`.p.`) fonts instead of 7, and no `Cochocib` file.
  - The CSS chunk is smaller than today's `16671ef629344300.css`.
- [ ] **Step 4: Commit** `perf: stop shipping unused fonts and the typeset stylesheet`.

---

## Considered and left out

These would change what people see or how motion feels, so they stay out unless Juno asks:
- Capping the render rate while only the slow drifts move.
- Dropping the frosted blur behind the service cards and navbar.
- Lowering the dust-ring count on phones.
- Pausing the logo ticker and the pin ping off-screen. They are compositor-only and cost little.

## Final check

Run `measure.js` and `visual.js` one last time, and put a before/after table of the baseline rows in the PR. Stop the `:3100` and `:3101` servers this session started, by their own PIDs, never :3000.
