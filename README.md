# Gál HIVE — Diósdi Méhes

A luxury single-page site for **Diósdi Méhes** *(placeholder brand)*, a premium
single-origin raw honey brand from Diósd, Hungary. The landing page opens on a
**living apiary** — a real-time WebGL environment (hives, bees, wind-blown
grass, wildflowers, drifting pollen, a cinematic drifting camera) rendered
behind the content, with graceful fallbacks.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **React Three Fiber / Three.js / drei** for the apiary scene
- **@react-three/postprocessing** for the cinematic grade (DoF, bloom, vignette, grain)
- Hand-authored CSS design system (`app/globals.css`) — the original luxury
  visual language, preserved exactly
- Tailwind is available but the design intentionally lives in plain CSS

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the build
npm run typecheck
npm run lint
```

## Structure

```
app/
  layout.tsx            fonts + metadata
  page.tsx              composition: apiary + gate + content
  globals.css           the luxury design system
components/
  Gate / Nav / Footer / Reveal
  sections/             Hero, Story, Process, Products, Markets, Signup, Contact
  apiary/
    ApiaryBackground    picks live scene / static frame / CSS fallback
    Scene               the R3F canvas + world composition
    CameraRig, Ground, Hills, TreeLine, Grass, Flowers,
    Hives, Bees, Pollen, Effects, StaticFallback
lib/
  brand.ts              swap the placeholder name here (one place)
  world.ts              deterministic hive/flower layout shared by bees
  quality.ts            device-tier detection + adaptive settings
  textures.ts           procedural wood + ground CanvasTextures
  usePointerNDC.ts      pointer for parallax + hive picking
  useReducedMotion.ts
```

## Swapping the brand name

`Diósdi Méhes` is a placeholder. It lives in **one place** — the `BRAND`
constant in `lib/brand.ts`. Edit those strings and every wordmark updates.

## The living apiary

- **Depth layers:** sky + haze → hills → fogged tree line → field → hives
  (midground) → grass/flowers → bees + pollen (foreground).
- **Bees:** hundreds of GPU-instanced bees with per-bee anchors, radii, speeds
  and phases — orbiting real hive entrances (with a swelling radius so they
  approach and leave), hovering flowers, or crossing the foreground near the
  camera. No two paths match; bees never follow the cursor.
- **Grass:** thousands of instanced blades with wind entirely in a vertex-shader
  injection (one time uniform), so it costs almost nothing per frame.
- **Camera:** a heavily-lerped drift + breathing motion with subtle pointer
  parallax — "expensive documentary camera", not a game camera.
- **Hives:** procedurally weathered wood; hovering one very subtly lifts it (a
  future entry point into a Gál Hive command centre).

## Performance & fallbacks

- Three quality tiers (`lib/quality.ts`) chosen from pointer type, viewport,
  CPU cores and device memory — they scale bee/grass/flower/tree counts, DPR,
  shadows, post-processing and depth-of-field.
- DPR is clamped; the scene is code-split (`ssr:false`) so the initial route
  ships almost no JS; the render loop **pauses** when the hero scrolls away.
- **Reduced motion** → the scene renders a single static frame (zero animation).
- **No WebGL / low-end** → a warm layered CSS apiary background.

Forms are front-end only (validate → inline confirmation → reset).
