# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server
npm run build    # tsc -b && vite build  → outputs to dist/
npm run lint     # eslint .
npm run preview  # serve the production build
```

There is no test suite and no test runner configured. `npm run build` (which runs
`tsc -b` first) and `npm run lint` are the only automated checks.

## Deployment

GitHub Pages serves the site from the committed `docs/` directory, not from `dist/`.
`vite.config.ts` sets `base: '/portfolio/'`, so built asset paths are `/portfolio/...`.

`npm run build` writes to `dist/` (untracked). Publishing a change requires copying the
build output into `docs/` and committing it — history shows these as "new build" commits.
`dist/` alone is never deployed; if `docs/` isn't updated, the live site does not change.

## Architecture

A single-viewport React 19 + Vite bento grid. Every tile flips in 3D into a modal.
Content is fully separated from presentation:

- **`src/content.ts`** — all site copy and data as typed exports. The single
  `portfolioCards: PortfolioCard[]` array is the source of truth for the page.
  `PortfolioCard` is a discriminated union on `type`
  (`hero | about | social | experience | education | certifications | skills | projects | vision`),
  each variant carrying its own payload (`ExperienceRole[]`, `CertItem[]`,
  `ProjectPreviewItem[]`, `EducationEntry[]`, `SkillCategory[]`, …). Content edits
  belong here, never in components.
- **`src/App.tsx`** (~120 lines) — grid shell only: maps `portfolioCards` to tiles and
  owns the two pieces of flip state. All rendering lives in `src/components/`.
- **`src/motion.ts`** — the whole motion system: easings, durations, and the
  framer-motion `variants` objects. Don't inline transitions in components; add them here.
- **`src/index.css`** — all styling (~1400 lines). No CSS modules or utility framework
  beyond Bootstrap's stylesheet, imported globally in `main.tsx`; a few Bootstrap
  utility classes (`d-flex`, `gap-2`) are used inline.
- **`DESIGN_SYSTEM.md`** — canonical description of the design system *as built*
  (tokens, type scale, spacing, motion, component recipes), plus numbered flags
  `F1…F24` for places the implementation is inconsistent with itself. Read §7 before
  touching motion and §8 before touching layout. Code comments cite these flag numbers,
  so keep them in sync when fixing one.

### Component layout

```
src/components/
  CardInner.tsx          front face of a tile — shared by grid and flip card
  FlipCard.tsx           the flying/rotating wrapper + modal chrome
  ModalBody.tsx          switch on card.type → one section component
  AccordionSection.tsx   \
  DotListSection.tsx      | shared building blocks used by several sections
  InteractiveList.tsx     |
  TagList.tsx            /
  sections/              one file per card type (About, Certifications, Education,
                         Experience, Projects, Skills, Social, Vision)
src/hooks/useThemeClass.ts       <html class="dark"> + localStorage sync
src/lib/modalRect.ts             per-type modal sizing/centring
src/lib/groupExperienceRoles.ts  collapses consecutive roles at one company
src/lib/tileAnalytics.ts         GA4 labels per tile
src/utils/analytics.ts           trackEvent() wrapper (no-ops when gtag is blocked)
```

Adding a card type means: extend `CardType` and the `PortfolioCard` union in
`content.ts`, add a `sections/` component, and handle it in `ModalBody`. That switch is
exhaustive over the union, so a missing case is a type error.

### The card → modal interaction

`App` renders each card as a `<button>` (or a `<div>` when `nonClickable`, as with
`hero`). Clicking captures the button's `getBoundingClientRect()` into
`flipState.fromRect`; `FlipCard` animates a fixed-position wrapper from that rect to a
centered modal rect while rotating an inner `preserve-3d` element 0°→180°. The front
face reuses `CardInner` (identical to the grid tile, so the two match mid-flight); the
back face renders header chrome plus `ModalBody`.

Worth knowing before changing `FlipCard`:

- Modal height is **measured**, not fixed — it hugs its content via the last child's
  `offsetTop + offsetHeight + paddingBottom` (`scrollHeight` ignores the body's bottom
  padding). A `ResizeObserver` on header and body re-measures when accordions or hover
  reveals change size, and `getModalSizing().fillsHeight` opts a type out (only
  `projects`, whose split view scrolls internally).
- `closedCardId` + `AnimatePresence.onExitComplete` keep the origin tile hidden until
  the reverse flip finishes, so the card never appears in two places at once.
- Escape closes; so does clicking the scrim.
- `src/lib/modalRect.ts` holds per-type bounds (`projects` and `about` get wider);
  everything else uses the 900×760 default with 42px viewport padding.

### Layout

`.portfolio-grid` is a 12-column CSS grid. Each card's position comes from its
`placementClass` in `content.ts` (`place-hero`, `place-projects`, …), with the matching
`grid-column` / `grid-row` rules in `index.css` (~line 131, with a comment diagramming
the intended rows). Responsive overrides re-declare these `place-*` rules at the
`900px`, `560px`, and `380px` breakpoints — adding or moving a card means touching the
base rules *and* those breakpoint blocks.

### Other notes

- Dark mode is fully implemented via `:root` / `html.dark` CSS variables and a
  `portfolio-theme` localStorage key, but unreachable: the toggle button in `App.tsx` is
  commented out, so nothing calls the `setIsDark` returned by `useThemeClass`
  (DESIGN_SYSTEM.md F1). Re-enabling it is a one-line change.
- Google Analytics 4 loads from `index.html`; use `trackEvent()` from
  `src/utils/analytics.ts`. Tile clicks go through `trackTileClick()`, whose
  `TILE_METADATA` labels are deliberately decoupled from visible copy so analytics
  dimensions survive wording changes.
- Icons: Font Awesome React components for glyphs; brand/company SVGs live in `public/`
  and are referenced by relative URL from `content.ts` (`'./github.svg'`), then mirrored
  into `docs/` by the build copy. Note `src/assets/icons/` also holds SVGs but is
  referenced by nothing — `public/` is the live set.
- Fonts (Apple Garamond, in Light/Regular/Bold cuts) are `@font-face`-declared in
  `index.css` from `src/assets/fonts/`.
- `InteractiveList` splits authored prose into one bullet per sentence on a regex; any
  abbreviation containing a period ("e.g.") would split mid-sentence
  (DESIGN_SYSTEM.md F23).
- `concepts/` holds untracked standalone design experiments; it is not part of the
  deployed site.
