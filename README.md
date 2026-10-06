# CEIT-SC

Website for the **College of Engineering and Information Technology Student
Council**, Cavite State University – Don Severino de las Alas Campus.

> **Status: landing page only.** The header, hero, and footer are built and
> verified. There is no router, no backend, and no content sections yet. See
> [Current state](#current-state) for what is real and what is still a
> placeholder.

## Quick start

All commands run from `frontend/`.

```bash
cd frontend
npm install
npm run dev        # vite dev server, http://localhost:5173
```

| Script              | Does                                      |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Vite dev server with HMR                  |
| `npm run build`     | `tsc -b` then production build to `dist/` |
| `npm run typecheck` | `tsc -b --noEmit`                         |
| `npm run lint`      | oxlint                                    |
| `npm run preview`   | Serve the built output                    |

Requires Node `^20.19.0 || >=22.12.0` (Vite 8's constraint).

## Repository layout

```
.
├── .gitignore
├── frontend/           # the one JS package — Vite + React 19 + Tailwind v4
│   ├── public/         # static assets served as-is
│   └── src/
│       ├── components/ # Header, Hero, Footer
│       ├── lib/site.ts # shared IA: nav, contact, socials, office hours
│       └── index.css   # design tokens (Tailwind v4 @theme)
└── supabase/           # data layer — empty; no migrations yet
```

**This is a single-package repository, not a monorepo.** There is no root
`package.json` and no `workspaces` field, so `npm install` runs per-package.

When a second package lands (likely `backend/`), promote the root to a
workspace. Note that `supabase/` should _not_ become a workspace member — the
Supabase CLI works on a directory of `.sql` migrations and needs no
`package.json`. A workspace would be `frontend` plus whatever JS packages exist.

## Stack

Vite 8 · React 19 · TypeScript 6 · Tailwind CSS v4 · oxlint · lucide-react ·
react-icons. Fonts self-hosted via Fontsource: Montserrat (UI), Inter (display).

No test suite and no CI yet.

## Design system

All tokens are declared once in `frontend/src/index.css` inside a Tailwind v4
`@theme` block. Nothing else defines a colour, size, or duration.

Two decisions worth knowing before you touch them:

- **Accent is `#ff8c47`, not the logo's `#fb6818`.** The logo orange is the
  brand colour, but at 3.98:1 on the surface colour it fails WCAG AA for body
  text. The lighter tint holds 5.10:1. Raw brand orange is used only as a fill
  behind dark ink.
- **`--duration-*` is not a Tailwind namespace.** Transition-duration lives on a
  fixed scale (`duration-150`), so a `--duration-fast` token emits a CSS variable
  and _no utility_. Call sites use the v4 variable shorthand instead:
  `duration-(--duration-fast)`. Writing `duration-fast` silently resolves to
  nothing and every transition falls back to the browser default.

## Current state

**Built and verified**

- Sticky header with section nav and a mobile disclosure panel
- Hero with responsive `srcset`, contrast-checked scrim, and a fixed height
  derived from the header's own measured bar heights
- Footer with live office-hours status, contact block, and social links
- Design tokens with measured contrast ratios documented inline

**Verified with** axe-core (zero violations across WCAG 2.0/2.1/2.2 AA and
best-practice), Chromium renders at 320/390/768/1440/1920, 200% text zoom, and a
keyboard walk including focus-visible rings and Escape-to-close on the mobile menu.

**Not built**

- Router — the six nav entries are fragment links to IDs that do not exist yet,
  so they currently do nothing. Per-page `<title>` and Open Graph tags are
  blocked on this.
- Backend or database. `supabase/` is empty.
- Real content. `Section 01`–`06` are placeholders; contact details are
  provisional; social URLs point at `example.com` on purpose so nothing looks
  real that isn't.

### Where the placeholders live

Everything provisional is declared in `frontend/src/lib/site.ts` and marked
`TODO` at the point of declaration, which is the intended single edit point.
Content that is _deliberately_ absent — there is no phone number — carries a
comment explaining why, so it doesn't get "fixed" back in with a fake value.
