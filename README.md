# Gál Örökség — Örökségbirtok

Static one-page Hungarian landing page for the Gál Örökség / Örökségbirtok vision.

## Local preview

```bash
npm run start
```

Then open <http://localhost:3000>.

## Build

```bash
npm run build
```

The build script copies `index.html` to `dist/index.html` for static hosting checks.

## Vercel

This project includes `vercel.json` configured as a static Vercel deployment. Vercel serves the root `index.html` directly and rewrites all paths back to the same single-page site.
