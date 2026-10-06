# frontend

The CEIT-SC web client. Vite + React 19 + TypeScript, styled with Tailwind CSS v4.

See the [root README](../README.md) for project status, design tokens, and the
repository layout. This file covers only what is specific to this package.

## Commands

Run from this directory:

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build
npm run typecheck  # tsc -b --noEmit
npm run lint       # oxlint
npm run preview
```

## Conventions

- **Tokens come from `src/index.css` only.** Do not hardcode a colour, font size,
  or duration in a component. If the theme lacks a value, add it to the
  `@theme` block in the same scale as its neighbours.
- **Tailwind utilities, not CSS files.** There is no `.css` file per component.
  The only stylesheet is `index.css`.
- **Shared content lives in `src/lib/site.ts`** — nav labels, contact details,
  social links, and the office-hours schedule. Components read from it so a
  content change is one edit.
- **Single quotes, no semicolons** in `.ts`/`.tsx`, matching the existing files.
  oxlint enforces the React and TypeScript rule sets but not formatting.
- Comments explain *why*, especially where a value looks wrong — contrast
  failures, tokens that do not generate utilities, magic numbers derived from
  other components' measurements.

## Adding a dependency

`react-icons` is imported from a per-family subpath (`react-icons/fa6`) so
tree-shaking keeps the bundle to the icons actually used. Importing from the
package root pulls in every icon family — the difference is roughly 5 kB versus
about 150 MB unpacked.