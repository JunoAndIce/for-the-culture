# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Next dev server (localhost:3000; falls back to 3001 if occupied — close it when done verifying)
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint (flat config: eslint-config-next core-web-vitals + typescript)
npm test         # Node's built-in test runner over *.test.mjs, with type stripping
```

Tests are few and sit next to the code they cover (`lib/greyPng.test.mjs`). `scripts/perf/` holds the perf and A/B visual checks, run through the Playwright MCP tool against `next start`; their headers say how.

## Stack

Next.js 16 (App Router) + React 19 + TypeScript, Tailwind CSS v4 (config lives in `app/globals.css` via `@theme inline`, not a `tailwind.config.js`), shadcn/ui (`components.json`: style `radix-nova`, base color `neutral`, icons from `lucide-react`), GSAP + ScrollTrigger for scroll-driven animation, `@react-three/fiber` / `@react-three/drei` / `three` for the WebGL globe, `next-themes` for dark/light.

## Architecture: one scrollytelling page, six panels, one sphere

`app/page.tsx` composes six full-viewport sections in order — `Home`, `Services`, `Projects`, `Testimonials`, `Globe`, `Careers` — each marked with a `data-panel` attribute. Behind all of them sits `<Scene />` (`components/Scene.tsx`), mounted once in `app/layout.tsx`: a `position: fixed` R3F `<Canvas>` that never scrolls and outlives page changes, rendering a single `WireframeSphere`. The sections scroll *over* the fixed canvas, which is what lets one 3D globe serve every screen.

The sphere's pose (position, rotation, zoom, opacity, dust-ring shape) for each panel is data, not code: `lib/choreography.ts` exports `SPHERE_PATH`, a `{ desktop: SphereState[], mobile: SphereState[] }` pair where **array index must match panel document order 1:1**. `lib/useSphereScroll.ts` builds one GSAP timeline on one `ScrollTrigger` spanning from the first to the last `[data-panel]` element, and tweens the sphere's nodes between each pair of adjacent states as that stretch of the page scrolls by. **Adding, removing, or reordering a panel requires updating both the JSX in `app/page.tsx` and both arrays in `SPHERE_PATH` together** — the comment at the top of `choreography.ts` spells this out. `Footer` is deliberately *not* a `data-panel` (it would shift every later index) and carries a solid background to cap the fixed canvas.

`/overview` and `/affiliations` also sit over the canvas for ambient texture but mark zero `data-panel` sections on purpose — `useSphereScroll`'s timeline builder bails out when fewer than two panels are found, so the sphere holds its opening pose behind a `bg-background/85` scrim while those pages are read normally. A page that marks `[data-sphere-turn]` gets the sphere turned a `SERVICE_TURN.step` per index it sends through `lib/sphereTurn.ts` (the same module-state bridge as `lib/waypoints.ts`), with a slow drift underneath (`turnWithDeck` in `useSphereScroll`). On `/overview` the index is the card in `ServiceDeck` (the five services as one deck: a row with side arrows from `md` up, its own vertically scrolling box below); on `/affiliations`, `SphereSteps` sends the index of whichever `[data-sphere-step]` section crosses the middle of the screen. All of the deck's motion is GSAP, including the glide between cards (`ScrollToPlugin`, with CSS scroll-snap switched off for the tween's length so it can't grab each frame); only hover colour fades stay CSS. Services link in as `/overview#<slug>`; the deck reads the hash itself, since its cards carry no ids (a `scroll-margin` on them would shift the snap points).

Page changes reach the canvas through `lib/sceneRoute.ts`: `Scene` calls `setSceneRoute` in a layout effect, so before the new page paints `useSphereScroll` reverts its build and sets pose 0, then rebuilds on the next frame (after Next's scroll) as a `gsap.context` inside one `gsap.matchMedia` that lives as long as the canvas (GSAP never removes a query's listener, so a `matchMedia` per page would leak them), and `useGlobeDrag` resets the drag node and re-attaches to the new page's stage, if it has one. Only `SCENE_ROUTES` get a canvas; a 404 renders none. Pages' root wrappers carry no background: the body paints it, and an opaque positioned wrapper would hide the layout's canvas.

### Sphere node ownership (`components/WireframeSphere.tsx`)

The sphere is a chain of nested Three.js groups, each owned by exactly one piece of code so two animation systems never fight over the same property:

```text
frame (position/scale — useSphereScroll)
 └─ globe (user drag rotation — useGlobeDrag)
     └─ spin (scroll-driven rotation — useSphereScroll)
         └─ land mesh, wire mesh (masked fill + wireframe overlay)
```

`GlobeGlow` (the dust-ring shader) and `Waypoints` (DOM pin projector) are siblings inside `frame`, above `globe`, so the ring's tilt/color sweep never spins with the user's drag. This ordering is load-bearing — see the docblock on `useSphereScroll` in `lib/useGlobeDrag.ts` and `lib/useSphereScroll.ts` before changing it. Land and wireframe are two separate meshes (a material is either filled or wireframe, not both) with the land's `alphaMap` as the mask (`public/earth-mask-{4k,8k}.png`, chosen by breakpoint and GPU texture limit via `maskUrlFor`). `MaskLoader` (`lib/maskLoader.ts`) decodes it with `lib/greyPng.ts` to one byte per pixel, a quarter of the RGBA a browser decodes an image to, so the land material reads alpha from `.r` rather than three's default `.g`.

The camera never moves: `Scene` places it at `CAMERA` and nothing writes to it afterwards. The globe opens at `SPHERE_PATH[layout][0]`, which `useSphereScroll` sets before its triggers capture it, so the loader lifts onto exactly the pose the scroll timeline starts from.

### Intro and unfold

On `/`, `Loader` counts until the sphere has mounted (`markSphereReady` in `lib/intro.ts`; not on `useProgress` alone, since a cached mask, as on a client-side return to `/`, reports no progress), then one shared GSAP timeline (`lib/intro.ts`) plays: the loader dissolves over the globe, already at its opening pose, and `IntroWords` builds the hero copy, navbar and scroll cue, found by their `data-intro` marks. Every number is in `INTRO` in `lib/choreography.ts`. The loader and the words sit in different React trees, so `lib/intro.ts` bridges them with module state, like `lib/waypoints.ts`: `Loader` calls `beginIntro` first, `IntroWords` calls `registerIntroPart`, and `requestIntro` plays once it has. A camera move used to run here and was removed on request; don't add one back unprompted. Scroll is locked by `html.intro-lock` while it plays; any input skips it; reduced motion, or a reload already scrolled past 8px, completes it at once. `whenIntroDone` holds `ScrambleWord`'s cycle until it ends.

Below Home, copy builds after scrolling stops. `data-unfold` on an element inside a `[data-panel]` hides it until its panel is at rest, then `useUnfold` builds the panel's marked elements in document order on a timer (`UNFOLD`), and resets them when the panel is fully off screen so it builds again on the next arrival. Unmarked value means rise; `slide` and `draw` are the other variants. It is deliberately not scrubbed: a scrubbed build ran during the snap's glide and was never seen. No panel is pinned; a pin was built and removed, so don't assume panels are taller than the viewport.

### Globe interaction

Dragging is scoped to the Globe panel by construction, not by a visibility check: `useGlobeDrag` (`lib/useGlobeDrag.ts`) attaches pointer listeners to whatever DOM element matches `[data-globe-stage]`, and only `components/Globe.tsx` renders that element. Fling/inertia decays frame-rate-independently in `useFrame`, and picking a city snaps into a separate "turn" state that a stale fling can't fight.

`GlobeKey` renders the DOM waypoint pins/buttons and the keyboard-accessible key panel (dragging can't be tabbed to, so the key is the only non-mouse way to reach the globe). Because the pins live in the regular DOM tree and the globe lives in a separate R3F reconciler, they can't share React context — `lib/waypoints.ts` bridges them with module-level mutable state (`registerPin`/`pinFor` for pin element refs, `requestWaypoint`/`takeWaypointRequest` and `setSpinTarget`/`takeSpinTarget` for click-to-rotate requests), read once per frame in `Waypoints.tsx`.

## Content model

Panel copy and its long-form expansion share one data source, keyed by `slug`, so the short and long versions can't drift apart:

- `lib/services.ts` (`SERVICES`, `STEPS`, `PROOF`) feeds both the `Services` panel and `/overview`.
- `lib/work.ts` (`PROJECTS`, `TESTIMONIALS`, `AFFILIATIONS`, `BACKED`) feeds the `Projects`/`Testimonials` panels and `/affiliations`. `/affiliations` shows only work: Kyro & Bros. (the one brand FTC launched) and `BACKED`, HWY6 Studios, which FTC funds, with the two brands it launched on that funding. Its work frames (`WorkFrame`) tilt toward a mouse cursor in 3D.
- `lib/nav.ts` (`NAV_ITEMS`) feeds both `Navbar` and `Footer`. `href: "#"` marks a destination with no route yet.

All body copy across these files, `Home.tsx`, `Careers.tsx`, etc. is placeholder text pending real copywriting — write it as final copy, don't caveat it in comments. `ImagePlaceholder` (dashed box) and `ProjectImage` (drawn line-art motif) are the deliberate stand-ins for real photography; swapping them for real assets means replacing the component usage, not the placeholder component itself.

## Theming and fonts

Dark is the default and only automatic theme (`ThemeProvider` in `app/layout.tsx`: `defaultTheme="dark"`, `enableSystem={false}`); `ThemeToggle` flips a `.dark` class by hand. The sphere's color follows suit via `SPHERE_COLOR` keyed on `resolvedTheme` in `WireframeSphere.tsx`.

Fonts are registered in `app/layout.tsx` via `next/font/google` (Geist Mono, Inter, Gelasio, Italianno). Register only what something uses: `next/font` preloads every registered font on every page. Cochocib Script (`fonts/`, licence unconfirmed — see `CREDITS.md`), Geist Sans and Alex Brush were registered but unused, and were dropped. Font CSS variables are set on `<html>` (shadcn's base layer applies `font-sans` there, which can't see variables scoped to `<body>`), and most are named with a `-sans`/`-serif`/`-script` suffix distinct from their Tailwind theme key (e.g. `--font-inter-sans` backs the Tailwind key `--font-inter`) because a `@theme inline` key can't reference a CSS variable of its own name — see the comments in `app/layout.tsx` and `app/globals.css`.

## Assets

`design/` holds source art not used at runtime (backgrounds, the `.blend` file, the 8k specular map). `public/earth-mask-{4k,8k}.png` are the only runtime-loaded sphere masks, generated from that source. Keep them 8-bit greyscale, non-interlaced PNGs: anything else falls back to the browser's RGBA decode and four times the GPU memory. `CREDITS.md` tracks licensing for everything third-party — check it before adding or shipping new assets.
