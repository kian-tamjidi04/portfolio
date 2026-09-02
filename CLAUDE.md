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

## Versioning the overhaul

The site is mid a UX/UI overhaul, done as short-lived branches per redesign phase,
PR'd into `main`, then deleted — GitHub should only ever hold `main` plus whatever
branch is actively in flight. Each presentable phase that lands on `main` gets an
annotated git tag (`v1.0.0` is the pre-overhaul baseline). Tags double as rollback
points and as the chronological record for an eventual before/after case study. Two
skills automate this:

- **`tag-milestone`** — tags the current `main` after a redesign phase merges.
- **`rollback-release`** — reverts `main` (and therefore the live site, since `docs/`
  is committed) back to a previously tagged milestone.

Never delete or move the `v1.0.0` tag.

### Per-card branches within a phase

Within a phase branch (e.g. `bento-card-redesign`), individual cards/features get
their own short-lived `card/<slug>` branch off the phase branch, PR'd back into the
*phase branch* (not `main`), then deleted once merged. This keeps each card as its
own reviewable, revertible unit instead of one giant phase-long diff. Two skills
automate this, mirroring the phase-level pair above:

- **`start-card-branch`** — branches `card/<slug>` off the active phase branch.
- **`finish-card-branch`** — opens the PR into the phase branch, and later (once
  the user confirms the merge — this workflow never merges automatically) deletes
  the card branch locally and remotely.

The active phase branch name is tracked in `.claude/redesign-phase-branch` so this
survives across sessions without re-deriving it; `start-card-branch` keeps it
current.

## Working in the Figma design system

The companion Figma file ("Portfolio Site v2", key `aUFrP6SiYVQbXUd8opII68`) has a
"Design System 2" page that documents shipped components (Bento Card, Modal Header,
Pill, …) as live clones of the actual shipped nodes, grouped under a "02 · Components"
section.

**Every frame created or cloned in this Figma file — in the design system or
anywhere else — must have "Clip Content" turned off** (`clipsContent = false` in the
Plugin API). Cloning an existing node carries over whatever that node had, so check
and reset it explicitly rather than assuming a clone inherited the right value.

## Architecture

A single-viewport React 19 + Vite bento grid. Every tile flips in 3D into a modal.
Content is fully separated from presentation:

- **`src/content.ts`** — all site copy and data as typed exports. The single
  `portfolioCards: PortfolioCard[]` array is the source of truth for the page.
  `PortfolioCard` is a discriminated union on `type`
  (`hero | about | location | experience | education | certifications | skills | projects | vision`),
  each variant carrying its own payload (`ExperienceRole[]`, `CertItem[]`,
  `ProjectPreviewItem[]`, `EducationEntry[]`, `SkillCategory[]`, …). Content edits
  belong here, never in components. Prose fields (`impact`, `details`, `summary`,
  `challenges`) are authored as `string[]` — one array entry per bullet.
- **`src/App.tsx`** (~100 lines) — grid shell only: maps `portfolioCards` to tiles and
  owns the two pieces of flip state. All rendering lives in `src/components/`.
- **`src/motion.ts`** — the whole motion system: easings, durations, and the
  framer-motion `variants` objects. Don't inline transitions in components; add them here.
  `timelineEntryVariants` reads the step direction off framer-motion's `custom` prop
  (`+1` forward, `-1` back). The projects deck is deliberately **not** here: its cards
  move by depth, and depth is a CSS custom property (`--deck-depth`) that a step
  re-labels on cards which stay mounted, so the shuffle is a plain CSS transition.
  Framer-motion owned this once via per-depth `animate` targets and would not reliably
  re-resolve a target on an element that persisted through the change — the first
  `VISIBLE_STACK_DEPTH + 1` cards stayed stranded at the depth they mounted at. Don't
  move it back.
- **`src/index.css`** — all styling (~1300 lines), single light theme, fully tokenized
  (`--space-*`, `--radius-*`, `--text-*`, `--dur-*`, `--ease-*`). No CSS modules or
  utility framework beyond Bootstrap's stylesheet, imported in `main.tsx` *before*
  `index.css` so this file wins specificity ties without needing `!important`.
- **`DESIGN_SYSTEM.md`** — canonical description of the design system as built (tokens,
  type scale, spacing, motion, component recipes), plus a resolution log (§11) of every
  past inconsistency and how it was resolved or deliberately left alone. Read §7 before
  touching motion and §8 before touching layout.

### Component layout

`src/lib/groupExperienceRoles.ts` collapses consecutive roles at one company — unused
since Experience moved to `VerticalTimeline`.

Adding a card type means: extend `CardType` and the `PortfolioCard` union in
`content.ts`, add a `sections/` component, and handle it in `ModalBody`. That switch is
exhaustive over the union, so a missing case is a type error.

### The card → modal interaction

`App` renders each card as a `<button>` (or a `<div>` when `nonClickable`, as with
`hero`, which is also the page's only `<h1>`). Clicking captures the button's
`getBoundingClientRect()` into `flipState.fromRect`; `FlipCard` animates a
fixed-position wrapper from that rect to a centered modal rect while rotating an inner
`preserve-3d` element 0°→180°. The front face reuses `CardInner` (identical to the grid
tile, so the two match mid-flight); the back face renders header chrome plus
`ModalBody`, with `role="dialog"`, a focus trap, and focus restored to the originating
tile on close.

Worth knowing before changing `FlipCard`:

- Modal height is **measured**, not fixed — it hugs its content via the last child's
  `offsetTop + offsetHeight + paddingBottom` (`scrollHeight` ignores the body's bottom
  padding). A `ResizeObserver` on header and body re-measures when hover reveals or a
  timeline step change size, and `getModalSizing().fillsHeight` opts a type out (only
  `projects`, whose deck needs a footprint that does not move as cards are dealt).
- `closedCardId` + `AnimatePresence.onExitComplete` keep the origin tile hidden until
  the reverse flip finishes, so the card never appears in two places at once.
- Escape closes; so does clicking the scrim.
- `src/lib/modalRect.ts` holds per-type bounds (`projects` and `about` get wider); all
  widths are capped to the grid's own max-width so no modal exceeds the grid it flew
  out of.
- The whole app is wrapped in `<MotionConfig reducedMotion="user">` (`main.tsx`), so
  every framer-motion animation — including the flip — respects
  `prefers-reduced-motion` automatically.

### Layout

`.portfolio-grid` is a 12-column CSS grid. Each card's position comes from a
`place-${card.id}` class derived in `App.tsx` (`content.ts` doesn't carry a separate
placement field — it was always identical to the id), with the `grid-column` /
`grid-row` rules living in `index.css` (comment diagramming the intended rows).
Responsive overrides re-declare these `place-*` rules at the `900px`, `560px`, and
`380px` breakpoints — adding or moving a card means touching the base rules *and*
those breakpoint blocks. The about-layout and skills-grid rules use **container
queries** (`@container portfolio-modal`) instead, since they respond to modal width,
not viewport width.

### Other notes

- Google Analytics 4 loads from `index.html`; use `trackEvent()` from
  `src/utils/analytics.ts`. Tile clicks go through `trackTileClick()`, whose
  `TILE_METADATA` labels (`src/lib/tileAnalytics.ts`) are deliberately decoupled from
  visible copy so analytics dimensions survive wording changes.
- Icons: Font Awesome React components for glyphs; brand/company SVGs live in `public/`
  and are referenced by relative URL from `content.ts` (`'./github.svg'`), then mirrored
  into `docs/` by the build copy.
- Fonts: one `'Apple Garamond'` family at weights 300/400/700 (+ italics), `.woff2`,
  declared in `index.css` from `src/assets/fonts/`.
- `concepts/` holds untracked standalone design experiments; it is not part of the
  deployed site.
