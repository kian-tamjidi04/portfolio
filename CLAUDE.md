# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server
npm run build    # tsc -b && vite build  → outputs to dist/
npm run lint     # eslint .
npm run preview  # serve the production build
```

There is no test suite and no test runner configured.

## Deployment

GitHub Pages serves the site from the committed `docs/` directory, not from `dist/`.
`vite.config.ts` sets `base: '/portfolio/'`, so built asset paths are `/portfolio/...`.
>
`npm run build` writes to `dist/` (untracked). Publishing a change requires copying the
build output into `docs/` and committing it — recent history shows these as
"new build" commits. `dist/` alone is never deployed; if `docs/` isn't updated, the
live site does not change.

## Architecture

Three files hold essentially the whole app:

- **`src/content.ts`** — all site copy and data as typed exports. The single
  `portfolioCards: PortfolioCard[]` array is the source of truth for the page.
  `PortfolioCard` is a discriminated union on `type`
  (`hero | about | social | experience | education | certifications | skills | projects | vision`),
  each variant carrying its own payload (`ExperienceRole[]`, `CertItem[]`,
  `ProjectPreviewItem[]`, `EducationEntry[]`, …). Content edits belong here, not in `App.tsx`.
- **`src/App.tsx`** — the entire UI. Renders the bento grid, then a FLIP/flip-card
  modal animation on click.
- **`src/index.css`** — all styling; no CSS modules or utility framework beyond
  Bootstrap's stylesheet, imported globally in `main.tsx`.

### The card → modal interaction

`App` maps `portfolioCards` into grid `<button>`s (or `<div>`s when
`nonClickable`). Clicking captures the button's `getBoundingClientRect()` into
`flipState.fromRect`; `FlipCard` then animates a fixed-position wrapper from that
rect to a centered modal rect while rotating an inner `preserve-3d` element
0°→180°. The front face reuses `CardInner` (identical to the grid card); the back
face renders `ModalBody`, which switches on `card.type` to produce per-type layouts.

Timing constants at the top of `App.tsx` (`FLIP_DURATION`, `FLIP_EASE`,
`CONTENT_REVEAL_DELAY`, `CONTENT_STAGGER`) and the framer-motion `variants`
objects are shared across sections — change them there rather than inlining
per-component transitions.

`getModalRect(type)` hard-codes per-type modal sizing (`projects` and `about` get
wider/taller bounds). `closedCardId` + `AnimatePresence.onExitComplete` keep the
origin grid card hidden until the reverse flip finishes.

### Layout

`.portfolio-grid` is a 12-column CSS grid. Each card's position comes from its
`placementClass` in `content.ts` (`place-hero`, `place-projects`, …), with the
matching `grid-column` / `grid-row` rules in `index.css` (~line 180, with a
comment diagramming the intended rows). Responsive overrides re-declare these
`place-*` rules at the `900px`, `560px`, and `380px` breakpoints — adding or
moving a card means touching the base rules *and* those breakpoint blocks.

### Other notes

- Dark mode is fully implemented via `:root` / `.dark` CSS variables and a
  `portfolio-theme` localStorage key, but the toggle button in `App.tsx` is
  commented out — `isDark` currently has no setter.
- Google Analytics 4 loads from `index.html`; use `trackEvent()` from
  `src/utils/analytics.ts` (it no-ops when gtag is blocked). Tile clicks are
  tracked via the `tileMetadata` map in `App`.
- Icons come from Font Awesome React components; brand/company SVGs live in
  `public/` (referenced by URL) and are mirrored into `docs/` by the build copy.
- `concepts/` holds untracked standalone design experiments; it is not part of
  the deployed site.
