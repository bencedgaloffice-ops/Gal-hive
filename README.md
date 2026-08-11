# Gál HIVE — Diósdi Méhes landing page

A single-page luxury landing site for **Diósdi Méhes** *(placeholder brand name)*, a
premium single-origin raw honey brand from Diósd, Hungary, selling into Hungary,
the USA and Japan.

Register: quiet luxury — brass-on-near-black, generous negative space, hairline
dividers, one recurring visual signature (a glowing amber **orb**). No frameworks,
no build step.

## Run

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Markup for all ten sections + the entrance gate |
| `styles.css` | Design tokens, layout, the orb motif, reveals, responsive rules |
| `main.js`    | Gate sequence, sticky nav, scroll reveals, front-end-only forms |

## Swapping the brand name

`Diósdi Méhes` is a placeholder. The name lives in **one place** — the `BRAND`
constant at the top of `main.js`:

```js
const BRAND = { first: "Diósdi", second: "Méhes" };
```

Every wordmark (gate, nav, footer) reads from it via `data-brand-*` attributes.
Edit those two strings and the whole page updates.

## Notes

- Primary language is Hungarian.
- Forms are front-end only — they validate, show an inline confirmation and reset;
  no data is sent anywhere yet.
- `prefers-reduced-motion` disables all animation and transition throughout.
- Fonts (Fraunces, Work Sans, IBM Plex Mono) load from Google Fonts.
