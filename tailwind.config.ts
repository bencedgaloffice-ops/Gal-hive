import type { Config } from "tailwindcss";

/**
 * Tailwind is available for layout convenience, but the luxury design system
 * lives in `app/globals.css` as hand-authored CSS (custom properties + BEM-ish
 * classes) so the original visual language is preserved exactly. The tokens are
 * mirrored here so utility classes can reach them if needed.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0b0907",
        char: "#151109",
        ivory: "#f3ede0",
        parch: "#dcd2ba",
        brass: "#c9a34c",
        "brass-dim": "#8a713a",
        wine: "#3d1610",
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        body: ['"Work Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
