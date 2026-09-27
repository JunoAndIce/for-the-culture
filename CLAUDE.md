# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Next dev server (localhost:3000; falls back to 3001 if occupied — close it when done verifying)
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint (flat config: eslint-config-next core-web-vitals + typescript)
```

There is no test suite / test script configured in this repo.

## Stack

Next.js 16 (App Router) + React 19 + TypeScript, Tailwind CSS v4 (config lives in `app/globals.css` via `@theme inline`, not a `tailwind.config.js`), shadcn/ui (`components.json`: style `radix-nova`, base color `neutral`, icons from `lucide-react`), GSAP + ScrollTrigger for scroll-driven animation, `@react-three/fiber` / `@react-three/drei` / `three` for the WebGL globe, `next-themes` for dark/light.

## Architecture: one scrollytelling page, six panels, one sphere

`app/page.tsx` composes six full-viewport sections in order — `Home`, `Services`, `Projects`, `Testimonials`, `Globe`, `Careers` — each marked with a `data-panel` attribute. Behind all of them sits `<Scene />` (`components/Scene.tsx`): a `position: fixed` R3F `<Canvas>` that never scrolls, rendering a single `WireframeSphere`. The sections scroll *over* the fixed canvas, which is what lets one 3D globe serve every screen.

The sphere's pose (position, rotation, zoom, opacity, dust-ring shape) for each panel is data, not code: `lib/choreography.ts` exports `SPHERE_PATH`, a `{ desktop: SphereState[], mobile: SphereState[] }` pair where **array index must match panel document order 1:1**. `lib/useSphereScroll.ts` builds one GSAP timeline on one `ScrollTrigger` spanning from the first to the last `[data-panel]` element, and tweens the sphere's nodes between each pair of adjacent states as that stretch of the page scrolls by. **Adding, removing, or reordering a panel requires updating both the JSX in `app/page.tsx` and both arrays in `SPHERE_PATH` together** — the comment at the top of `choreography.ts` spells this out. `Footer` is deliberately *not* a `data-panel` (it would shift every later index) and carries a solid background to cap the fixed canvas.

`/overview` and `/affiliations` also render `<Scene />` for ambient texture but mark zero `data-panel` sections on purpose — `useSphereScroll`'s timeline builder bails out when fewer than two panels are found, so the sphere just holds its opening pose behind a `bg-background/85` scrim while those pages are read normally.

### Sphere node ownership (`components/WireframeSphere.tsx`)

The sphere is a chain of nested Three.js groups, each owned by exactly one piece of code so two animation systems never fight over the same property:

```text
frame (position/scale — useSphereScroll)
 └─ globe (user drag rotation — useGlobeDrag)
     └─ spin (scroll-driven rotation — useSphereScroll)
         └─ land mesh, wire mesh (masked fill + wireframe overlay)
```

`GlobeGlow` (the dust-ring shader) and `Waypoints` (DOM pin projector) are siblings inside `frame`, above `globe`, so the ring's tilt/color sweep never spins with the user's drag. This ordering is load-bearing — see the docblock on `useSphereScroll` in `lib/useGlobeDrag.ts` and `lib/useSphereScroll.ts` before changing it. Land and wireframe are two separate meshes (a material is either filled or wireframe, not both) sharing the mask texture (`public/earth-mask-{4k,8k}.png`, chosen by breakpoint via `maskUrlFor`).

The camera is a fourth single-owner node: `useIntroCamera` (`lib/useIntroCamera.ts`, mounted from `WireframeSphere`) is the only writer of its position and roll. The intro moves the camera and never the sphere — `useSphereScroll` sets the opening pose before its triggers capture it, so a second writer on those nodes would fight it.

### Intro and unfold

On `/`, `Loader` counts, then one shared GSAP timeline (`lib/intro.ts`) plays: the loader dissolves while the camera dollies and trucks from a pulled-back start, centred on the planet, to `CAMERA`'s rest view — exactly the view the scroll timeline assumes, so unlocking scroll never jumps — and `IntroWords` builds the hero copy, navbar and scroll cue, found by their `data-intro` marks. Every number is in `INTRO` in `lib/choreography.ts`. The loader, the camera and the words sit in different React trees, so `lib/intro.ts` bridges them with module state, like `lib/waypoints.ts`: `Loader` calls `beginIntro` first, each part `registerIntroPart`s, and `requestIntro` plays once both have. Scroll is locked by `html.intro-lock` while it plays; any input skips it; reduced motion, or a reload already scrolled past 8px, completes it at once. `whenIntroDone` holds `ScrambleWord`'s cycle until it ends.

Below Home, copy builds after scrolling stops. `data-unfold` on an element inside a `[data-panel]` hides it until its panel is at rest, then `useUnfold` builds the panel's marked elements in document order on a timer (`UNFOLD`), and resets them when the panel is fully off screen so it builds again on the next arrival. Unmarked value means rise; `slide` and `draw` are the other variants. It is deliberately not scrubbed: a scrubbed build ran during the snap's glide and was never seen. No panel is pinned; a pin was built and removed, so don't assume panels are taller than the viewport.

### Globe interaction

Dragging is scoped to the Globe panel by construction, not by a visibility check: `useGlobeDrag` (`lib/useGlobeDrag.ts`) attaches pointer listeners to whatever DOM element matches `[data-globe-stage]`, and only `components/Globe.tsx` renders that element. Fling/inertia decays frame-rate-independently in `useFrame`, and picking a city snaps into a separate "turn" state that a stale fling can't fight.

`GlobeKey` renders the DOM waypoint pins/buttons and the keyboard-accessible key panel (dragging can't be tabbed to, so the key is the only non-mouse way to reach the globe). Because the pins live in the regular DOM tree and the globe lives in a separate R3F reconciler, they can't share React context — `lib/waypoints.ts` bridges them with module-level mutable state (`registerPin`/`pinFor` for pin element refs, `requestWaypoint`/`takeWaypointRequest` and `setSpinTarget`/`takeSpinTarget` for click-to-rotate requests), read once per frame in `Waypoints.tsx`.

## Content model

Panel copy and its long-form expansion share one data source, keyed by `slug`, so the short and long versions can't drift apart:

- `lib/services.ts` (`SERVICES`, `STEPS`, `PROOF`) feeds both the `Services` panel and `/overview`.
- `lib/work.ts` (`PROJECTS`, `TESTIMONIALS`, `AFFILIATIONS`) feeds the `Projects`/`Testimonials` panels and `/affiliations`.
- `lib/nav.ts` (`NAV_ITEMS`) feeds both `Navbar` and `Footer`. `href: "#"` marks a destination with no route yet.

All body copy across these files, `Home.tsx`, `Careers.tsx`, etc. is placeholder text pending real copywriting — write it as final copy, don't caveat it in comments. `ImagePlaceholder` (dashed box) and `ProjectImage` (drawn line-art motif) are the deliberate stand-ins for real photography; swapping them for real assets means replacing the component usage, not the placeholder component itself.

## Theming and fonts

Dark is the default and only automatic theme (`ThemeProvider` in `app/layout.tsx`: `defaultTheme="dark"`, `enableSystem={false}`); `ThemeToggle` flips a `.dark` class by hand. The sphere's color follows suit via `SPHERE_COLOR` keyed on `resolvedTheme` in `WireframeSphere.tsx`.

Fonts are registered in `app/layout.tsx` via `next/font/google` (Geist, Geist Mono, Inter, Gelasio, Alex Brush, Italianno) plus one `next/font/local` (Cochocib Script, licence unconfirmed — see `CREDITS.md` before shipping it). Font CSS variables are set on `<html>` (shadcn's base layer applies `font-sans` there, which can't see variables scoped to `<body>`), and most are named with a `-sans`/`-serif`/`-script` suffix distinct from their Tailwind theme key (e.g. `--font-inter-sans` backs the Tailwind key `--font-inter`) because a `@theme inline` key can't reference a CSS variable of its own name — see the comments in `app/layout.tsx` and `app/globals.css`.

## Assets

`design/` holds source art not used at runtime (backgrounds, the `.blend` file, the 8k specular map). `public/earth-mask-{4k,8k}.png` are the only runtime-loaded sphere masks, generated from that source. `CREDITS.md` tracks licensing for everything third-party — check it before adding or shipping new assets.
