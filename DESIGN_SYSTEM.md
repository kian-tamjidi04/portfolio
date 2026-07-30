# Kian Tamjidi — Portfolio Design System

Extracted from the live implementation (`src/index.css`, `src/App.tsx`, `src/components/`).
This document is the canonical description of the system as **built**.

Flags `F1…F24` were raised in an earlier audit of this system. All 24 have since been resolved
— fixed, deleted, or explicitly accepted with a stated reason — and the log of what happened to
each lives in [§11](#flagged-issues-resolution-log). Nothing below describes an unfixed problem;
where a past inconsistency shaped a decision (e.g. why dark mode is gone), it's noted inline.

---

## 1. Design intent

A **serif-led bento grid**. The whole portfolio is a single non-scrolling viewport of tiles; every
tile flips in 3D into a modal. The personality comes from three places:

1. **Apple Garamond everywhere** — a display serif used at body sizes too. Unusual for a dev
   portfolio and the single strongest identity signal.
2. **One warm accent** (burnt orange) against a near-neutral grey-blue palette. Accent is used
   sparingly: labels, company names, bullets, active states.
3. **Weight-as-hierarchy, not size-as-hierarchy** — titles are set at 300 (Light) at large sizes,
   labels at 700 (Bold) at small sizes. Large + light vs small + bold is the recurring pairing.

Layout tone: dense (6px grid gap), low-contrast surfaces, generous radii, no borders — separation
is achieved with surface elevation (`--surface` on `--bg`, plus `--shadow-card`), not lines.

Light mode only — dark mode was removed (see F1 in the resolution log).

---

## 2. Color

### 2.1 Tokens (`:root`)

| Token | Value | Role |
| --- | --- | --- |
| `--bg` | `#eeeeee` | Page background |
| `--surface` | `#ffffff` | Card / modal / header background |
| `--surface-subtle` | `#eef0f5` | Recessed panel inside a modal (sections, rows, timeline) |
| `--border` | `#d8dce8` | Hairlines, timeline rails, inactive dots, scrollbar thumb |
| `--accent` | `#ea6508` | Fill accent — shapes, dots, bullets, icons, washes |
| `--accent-text` | `#c2540a` | Text-only accent — 4.6:1 on `--surface`, meets WCAG AA |
| `--accent-dim` | `rgba(234,101,8,0.10)` | Accent wash for hover / active fills |
| `--text-primary` | `#0d0e12` | Titles, body headings; also used as a *dark fill* |
| `--text-secondary` | `#4a4f63` | Body copy, tags |
| `--text-muted` | `#64697f` | Dates, meta, chevrons — 4.8:1 on `--surface-subtle` |

`--accent` and `--accent-text` are a deliberate split: `--accent` stays the original brand orange
for anything read as a *shape* (dots, bullets, icon fills, washes), while `--accent-text` is a
darkened variant used only where the color sits on text, so body-size accent text clears WCAG AA
(was 3.3:1 on `--accent`, failing). `--text-muted` was similarly darkened from `#8a8fa8` (2.8:1,
failing) to `#64697f` (4.8:1).

### 2.2 The inversion pattern

A recurring and effective trick: **active/primary states fill with `--text-primary` and set their
own text to `--bg`.** This works because there's only one theme now — no second token needed.

```css
.project-sidebar-btn.active { background: var(--text-primary); }
.project-sidebar-btn.active .project-sidebar-title { color: var(--bg); }
```

Used by `.project-sidebar-btn.active`, `.accordion-header.active`,
`.project-action-btn-primary`, `.project-list-hamburger`. **Keep doing this.**

### 2.3 Contrast

Measured against WCAG 2.1 AA (4.5:1 normal text, 3:1 large text ≥18.66px bold / ≥24px).

| Pair | Ratio | Verdict |
| --- | --- | --- |
| `--text-primary` on `--surface` | 19.2:1 | ✅ |
| `--text-secondary` on `--surface-subtle` | 7.1:1 | ✅ |
| `--accent-text` on `--surface` | 4.6:1 | ✅ |
| `--text-muted` on `--surface-subtle` | 4.8:1 | ✅ |

All four pass. `--accent-text` is used by `.modal-label`, `.timeline-company`, `.cert-company`,
`.skill-category-label`, `.modal-row-subtitle`, `.project-detail-grade`,
`.sub-timeline-division`, `.tag.is-primary`. `--accent` (the fill color, unchanged) is not held to
the same bar — it never carries text on its own.

---

## 3. Typography

### 3.1 Family

One family, three real weights, italics included:

```css
@font-face { font-family: 'Apple Garamond'; src: url('...Light.woff2') format('woff2');
             font-weight: 300; font-style: normal; font-display: swap; }
@font-face { font-family: 'Apple Garamond'; src: url('...LightItalic.woff2') format('woff2');
             font-weight: 300; font-style: italic; font-display: swap; }
@font-face { font-family: 'Apple Garamond'; src: url('....woff2') format('woff2');
             font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Apple Garamond'; src: url('...Italic.woff2') format('woff2');
             font-weight: 400; font-style: italic; font-display: swap; }
@font-face { font-family: 'Apple Garamond'; src: url('...Bold.woff2') format('woff2');
             font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: 'Apple Garamond'; src: url('...BoldItalic.woff2') format('woff2');
             font-weight: 700; font-style: italic; font-display: swap; }
```

`font-weight: 300 / 400 / 700` selects the real face — no more synthetic faux-bold. All six faces
ship as `.woff2` (~22KB each, down from ~46KB `.ttf`) with `font-display: swap` so text is never
invisible during font load.

### 3.2 Scale

A pure ascending scale; semantic aliases point into it for the three display sizes.

| Token | Value | px @16 | Used by |
| --- | --- | --- | --- |
| `--text-xs` | `0.95rem` | 15.2 | Body copy, tags, bullets, takeaways |
| `--text-sm` | `1rem` | 16 | `.modal-close-cta` only |
| `--text-md` | `1.15rem` | 18.4 | Labels, dates, sub-roles, sidebar titles |
| `--text-lg` | `1.4rem` | 22.4 | Row titles, role names, company names |
| `--text-xl` (`--font-card-title`) | `1.9rem` | 30.4 | Grid card title |
| `--text-2xl` (`--font-modal-title`) | `2.4rem` | 38.4 | Modal title, project detail header |
| `--text-3xl` (`--font-hero-title`) | `clamp(2.25rem, 9vw, 3.75rem)` | 36–60 | Hero name, fluid |

The scale is a numeric ladder (`xs → 3xl`) rather than mixing t-shirt and semantic names, and it
ascends in the order the names suggest. Ratios stay irregular (~1.2 with the hero deliberately
oversized) — see the resolution log (F9) for why that's kept rather than "fixed".

### 3.3 Line height

| Token | Value | Used by |
| --- | --- | --- |
| `--leading-tight` | `0.97` | `.card-title` |
| `--leading-snug` | `1.3` | `.timeline-title-row`, `.cert-title-row` |
| `--leading-normal` | `1.45` | `body` |
| `--leading-relaxed` | `1.5` | `.interactive-bullet-item` |

`.cert-takeaway` (1.4) and `.project-detail-grade` (1.2) don't match any rung and stay literal
rather than be forced onto a nearby token.

---

## 4. Space

```css
--space-1: 2px;   --space-2: 4px;   --space-3: 6px;   --space-4: 8px;
--space-5: 10px;  --space-6: 12px;  --space-7: 14px;  --space-8: 16px;
--space-9: 18px;  --space-10: 20px; --space-12: 24px; --space-14: 30px;
```

A 2px-based ramp (numbered by px value, gaps at the odd numbers). `--space-7` (14px) is the
workhorse — card padding, modal section padding, most flex/grid gaps. The 6px outer bento gap
(`--space-3`) staying tighter than the 14px interior gaps is a deliberate signature, kept as-is.

Applied to padding, gap, and margin only. One-off positional values (`left: -22px`,
`top: 16px` on absolutely-positioned dots and icons) are geometry, not rhythm, and stay literal —
see the resolution log (F12) for why.

---

## 5. Radius

```css
--radius-xs: 4px;  --radius-sm: 6px;  --radius-md: 8px;   --radius-lg: 10px;
--radius-xl: 12px; --radius-2xl: 16px; --radius-pill: 999px;
--card-radius: var(--radius-xl);   /* alias, pre-existing call sites */
--modal-radius: var(--radius-2xl); /* alias, pre-existing call sites */
```

Every `border-radius` in the file resolves to one of these seven values, including `.tag`, which
now uses `--radius-pill` (was a stray `18.5px`).

---

## 6. Elevation

| Token | Value | Applied to |
| --- | --- | --- |
| `--shadow-card` | `0 2px 12px rgba(0,0,0,.08)` | `.portfolio-card` |
| `--shadow-modal` | `0 24px 64px rgba(0,0,0,.18)` | `.flip-back` |
| `--shadow-accordion-idle` | `0 4px 14px rgba(0,0,0,.08)` | `.accordion-header` |
| `--shadow-accordion-hover` | `0 10px 24px rgba(0,0,0,.12)` | `.accordion-header:hover` |

`--shadow-card` is now applied to the grid tiles it's named for — they previously read as flat
white rectangles against `#eeeeee` (a 1.07:1 luminance step) with the token declared but unused.

---

## 7. Motion

```css
--dur-fast: 0.2s;  --dur-base: 0.3s;  --dur-slow: 0.45s;  --dur-flip: 0.58s;
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
--ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
```

`--ease-standard` (the Material "standard" curve) is now written once and referenced everywhere,
including in `src/motion.ts` (`EASE_STANDARD = cubicBezier(0.4, 0, 0.2, 1)`) for the framer-motion
side — one curve, one spelling, both layers. Near-miss durations that don't exactly match the four
tokens above (`0.22s`, `0.25s`, `0.34s`, `0.35s`, `0.4s`, `0.42s`) stay literal rather than being
snapped onto the nearest token and silently changing timing.

`transition: all` has been replaced with explicit property lists everywhere it appeared
(`.modal-close-cta`, `.project-sidebar-btn`, `.project-sidebar-icon`, `.accordion-header`,
`.project-action-btn`, `.project-list-hamburger`), and dead transition properties (transitioning
`box-shadow`/`border-color` on elements that never set one) have been removed.

**Reduced motion is respected two ways:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
```

— covers plain CSS transitions and the `pulse-recent` keyframe animation. Framer-motion
(including the 3D flip) is covered separately by wrapping the app in
`<MotionConfig reducedMotion="user">` (`src/main.tsx`).

---

## 8. Layout

### 8.1 Grid

`.portfolio-grid-surface` — 12 columns, `gap: 6px`, `max-width: 1320px`, vertically centred in a
`100vh` non-scrolling page.

```
┌─────────────────────────────────┬───────────┐
│                                 │  about    │  rows 1–2
│  hero  (col 1–8, rows 1–2)      ├───────────┤
│                                 │  social   │
├──────────────────────┬──────────┴───────────┤
│  experience (1–7)    │  education (8–12)    │  row 3
├────────────────┬─────┴──────────────────────┤
│ certifications │                            │  row 4
├────────────────┤  projects (6–12, rows 4–5) │
│ skills         │                            │  row 5
├────────────────┴────────────────────────────┤
│  vision (1–12)                              │  row 6
└─────────────────────────────────────────────┘
```

Placement classes (`place-hero`, `place-projects`, …) are derived in `App.tsx` as
`` `place-${card.id}` `` — `content.ts` no longer carries a redundant `placementClass` field, since
it was always identical to `place-${id}` for all 9 cards. The `grid-column`/`grid-row` rules
themselves still live in `index.css`, with a comment diagramming the intended rows (~line 190).
Responsive overrides re-declare these rules at the `900px`, `560px`, and `380px` breakpoints —
adding or moving a card means touching the base rules *and* those three blocks. At 900px,
`place-education`/`place-experience` were resized so their columns sum to the 6-column grid
(previously left a stray empty 6th column on that row).

### 8.2 Breakpoints

Three viewport breakpoints (`900px`, `560px`, `380px`) plus two **container queries** scoped to
`.portfolio-modal-body` (named `portfolio-modal`) for the about layout and skills grid, which
respond to the *modal's* width, not the viewport's — they only used to correlate because the
modal happens to be viewport-sized. The former `1024px`/`1000px`/`768px` viewport breakpoints
either became these container queries or were merged into `900px`/`560px` where they were
duplicates of the same viewport band.

### 8.3 Modal sizing

`getModalRect(type)` in `src/lib/modalRect.ts`, viewport minus `42px` padding, capped per type:

| Type | Max width | Max height |
| --- | --- | --- |
| `projects` | 1320px | 900px |
| `about` | 1300px | `Infinity` |
| everything else | 900px | 760px |

`projects`' max width now matches `GRID_MAX_WIDTH` (1320px, the same constant `.portfolio-grid-
surface` uses) rather than exceeding the grid it flew out of (previously 1400px). `Infinity` (not
a numeric sentinel) marks "no cap" for `about`.

---

## 9. Component recipes

Each recipe below is the current implementation, ready to reuse.

### 9.1 Card (grid tile)

```
surface --surface · radius --card-radius · shadow --shadow-card · padding var(--space-7)
min-height 125px · no border
flex column, align-items flex-start, justify-content flex-end, gap var(--space-5)
hover → background var(--accent-dim)
content, bottom-aligned:
  .card-label  --text-md   weight 700   --text-muted
  .card-title  --font-card-title  weight 300  --text-primary  line-height --leading-tight
  .card-preview-icon  absolute top/right var(--space-8), --accent, --text-lg
hero variant: min-height 260px, title --font-hero-title (fluid), no label
```

### 9.2 Recessed-row primitive (`.panel`)

```css
.panel { background: var(--surface-subtle); border-radius: var(--radius-xl); padding: var(--space-7); }
.panel--roomy { padding: var(--space-8); }             /* .timeline-content's 16px */
.panel--interactive { transition: background var(--dur-fast) ease; }
.panel--interactive:hover { background: var(--accent-dim); }
```

`.social-row`, `.cert-row`, `.timeline-content`, and `.modal-section` all compose `.panel` (plus
modifiers) instead of repeating the same background/radius/padding block four times. Genuine
differences stay on the individual classes: `.cert-row`'s `grid-template-columns: 80px 1fr`,
`.social-row`'s flex + gap, `.timeline-content`'s flex-column + tighter 5px internal gap.

### 9.3 Tag / pill

```
.tag           radius --radius-pill · padding 5px var(--space-5) · --text-xs
               color --text-secondary · background --surface
.tag.is-primary  color --accent-text · background --accent-dim
```

### 9.4 Timeline

```
.timeline         border-left 1px --border · padding-left var(--space-7) · gap var(--space-9)
.timeline-dot     15px circle, absolute left -22px top 16px, background --border
  .is-recent      background --accent + pulse-recent 2s infinite (respects prefers-reduced-motion)
.timeline-content  .panel.panel--roomy (see 9.2)
.timeline-title-row  role (--text-lg, --text-primary) • separator (--text-muted)
                     • company (--text-lg, --accent-text)
.sub-timeline     nested: border-left 1px dashed, gap var(--space-12)
```

The `role • company` title row with a muted middot separator is the system's signature text
pattern — reused verbatim in `.cert-title-row` and `.sub-timeline-role-row`.

### 9.5 Accordion

```
.accordion-header   transparent bg · radius --radius-xl · padding var(--space-8) 20px
                    box-shadow --shadow-accordion-idle
                    aria-expanded + aria-controls wired to the content panel's id
  hover             background --accent-dim · box-shadow --shadow-accordion-hover
  .active           background --text-primary · label + chevron → --bg  (inversion pattern)
.accordion-chevron  --text-muted · rotate(180deg) when .rotated
```

### 9.6 Button set

| Class | Fill | Text |
| --- | --- | --- |
| `.project-action-btn-primary` | `--text-primary` | `--bg` |
| `.project-action-btn-secondary` | transparent | `--text-primary` |
| `.modal-close-cta` | `--surface-subtle` | `--text-secondary` |
| `.project-list-hamburger` | `--text-primary` | `--bg` |

All `radius --radius-xl`, weight 700, `--text-xs`, `padding var(--space-6) var(--space-12)`
(close CTA: `var(--space-4) var(--space-7)`). Primary-button hover lightens to `--accent-dim` and
flips text back to `--text-primary` — the same wash strength the card hover uses (see F21 in the
resolution log for why these were unified).

### 9.7 Bullet list (`InteractiveList`)

`content.ts` stores prose fields (`ExperienceRole.impact`, `EducationEntry.details`,
`ProjectPreviewItem.summary`/`challenges`) as `string[]` — one array entry per bullet, authored
directly rather than split from a single string at render time. `InteractiveList` just maps the
array to `<li>`s. There is no sentence-splitting regex anymore, so no abbreviation or decimal can
ever mis-bullet.

---

## 10. Iconography

- **UI icons** — Font Awesome React components (`faAward`, `faChevronDown`, `faListUl`, …).
- **Brand logos** — SVGs in `public/`, referenced by relative URL (`./github.svg`, `./UBS.svg`).
  Sizes: cert/social icons `80×80` box, `height/width={64}` attributes; experience logo absolute
  top-right; action icons `18×18`. (`src/assets/icons/` — an unreferenced duplicate set — has been
  deleted; `public/` is the only live set.)
- Dark-on-light SVGs are handled with `filter: invert(1)` on primary buttons (single theme now, so
  no conditional dark-mode counter-rule is needed).

Card→icon mapping lives in `cardPreviewIcons` in `src/components/CardInner.tsx`, keyed by
**card `id`** (not `type`).

---

## 11. Flagged issues (resolution log)

Every flag from the original audit, and what happened to it. Kept as a record — not deleted —
so the reasoning behind each decision survives past the fix itself.

| # | Resolution |
| --- | --- |
| **F1** | **Deleted.** Dark mode was fully built in CSS but unreachable (toggle commented out, no setter wired). Rather than wire it up, it was removed entirely: the `html.dark` token block, `useThemeClass.ts`, its `App.tsx` call site, the commented toggle JSX, and the `portfolio-theme` localStorage key are all gone. One theme, no dead-but-functional branch to maintain. |
| **F2** | **Fixed.** `--text-muted` darkened `#8a8fa8→#64697f` (2.8:1→4.8:1); a new `--accent-text` (`#c2540a`, 4.6:1) carries accent-colored *text*, while `--accent` stays the original brand orange for fills/shapes. See §2.3. |
| **F3** | **Fixed.** The one live leak — `.timeline-group-title-badge`'s hard-coded dark-mode-orange border — now uses `color-mix(in srgb, var(--accent), transparent 80%)`, so it tracks the real accent. (The other five occurrences the original audit listed — `.pill`, `.card-viewed`, `.link-row` — were already-dead code removed in an earlier pass.) |
| **F4** | **Doc correction; no code change needed.** All 12 orphaned tokens (`--accent-sky`, `--orb`, `--health-*`, `--viewed-*`) were already gone by the time this plan ran. |
| **F5** | **Fixed.** Collapsed three weight-named families into one `'Apple Garamond'` family at real weights 300/400/700 (+ italics), converted `.ttf` → `.woff2` (~46KB → ~22KB per face) with `fonttools`, added `font-display: swap`. See §3.1. |
| **F6** | **Fixed** as part of F5 — `font-display: swap` on all six faces. |
| **F7** | **Doc correction; no code change needed.** `--font-sm` (now `--text-sm`) was already declared. |
| **F8** | **Fixed.** Renamed to a numeric scale `--text-xs…3xl` with `--font-card-title`/`-modal-title`/`-hero-title` as semantic aliases into it. See §3.2. |
| **F9** | **Accepted, not fixed.** Retuning to a mathematically clean 1.2 ladder would change every text size in the app for tidiness nobody would perceive; the existing ratios already cluster near 1.2 and the hero's oversized jump is deliberate. Documented as intentional. |
| **F10** | **Fixed.** `--font-hero-title` is now `clamp(2.25rem, 9vw, 3.75rem)`. |
| **F11** | **Fixed.** Added `--leading-tight/-snug/-normal/-relaxed`; applied to the 5 of 7 line-heights that matched a rung exactly (see §3.3 for the two that stayed literal). |
| **F12** | **Fixed, scoped.** Added the `--space-1…14` ramp and applied it to padding/gap/margin (the "rhythm" values). One-off positional offsets (`left`/`top` on absolutely-positioned dots) were deliberately left literal — they're geometry, not spacing, and tokenizing them wouldn't make the CSS more readable. |
| **F13** | **Fixed.** Added the `--radius-xs…2xl`/`-pill` ramp; every `border-radius` in the file now uses a token, including `.tag`'s former `18.5px` → `--radius-pill`. |
| **F14** | **Fixed.** `--shadow-card` is now applied to `.portfolio-card` (previously it was declared but referenced by nothing). |
| **F15** | **Fixed, mostly.** Added `--dur-fast/-base/-slow/-flip` and `--ease-standard/-emphasized`; `cubic-bezier(0.4,0,0.2,1)` now has exactly one spelling shared by CSS and `src/motion.ts`. Near-miss durations (`0.22s`, `0.25s`, `0.34s`, `0.35s`, `0.4s`, `0.42s`) were deliberately left as literals rather than snapped to the nearest token, which would have silently changed timing. |
| **F16** | **Fixed.** All 6 `transition: all` rules now list explicit properties; dead transition properties (on elements with no matching visual property) were removed. |
| **F17** | **Fixed.** A `prefers-reduced-motion` media query covers CSS transitions/animations; `<MotionConfig reducedMotion="user">` in `main.tsx` covers framer-motion, including the flip. |
| **F18** | **Fixed.** `placementClass` removed from `content.ts` (it was always `` `place-${id}` ``, fully derivable); `App.tsx` now derives it. The 900px 6-column gap (`place-education`/`place-experience` not summing to 6) is corrected. The 380px single-column breakpoint was deliberately **not** replaced with `auto-fit`, as the original audit suggested — the hero's `span 8`/2-row shape and `place-projects`' 2-row span at other breakpoints are designed, not emergent, and `auto-fit` would discard that. |
| **F19** | **Fixed.** Consolidated to 3 viewport breakpoints (`900px`/`560px`/`380px`) plus container queries (`@container portfolio-modal`) for the about-layout and skills-grid rules, which respond to modal width, not viewport width. |
| **F20** | **Fixed.** `Infinity` was already in place (not `9999px`). The `projects` modal's max width was brought down to 1320px to match the grid's max width, so a modal can no longer be wider than the grid it flew out of. |
| **F21** | **Fixed.** Card hover now uses `--accent-dim` (10%) instead of a separate `color-mix(…transparent 85%)` (15%) — one wash strength for the "faint accent" semantic everywhere. |
| **F22** | **Fixed.** Added a `.panel`/`.panel--roomy`/`.panel--interactive` primitive; `.social-row`, `.cert-row`, `.timeline-content`, `.modal-section` all compose it. `.timeline-content` keeps its 16px padding via `--roomy` rather than being normalized to 14px — that would be a visible change beyond the scope of a de-duplication pass. |
| **F23** | **Fixed.** Prose fields (`impact`, `details`, `summary`, `challenges`) are now authored as `string[]` in `content.ts` directly; `InteractiveList` renders the array with no runtime splitting. The sentence-boundary regex is gone, so no abbreviation or decimal can ever mis-bullet. |
| **F24** | See below — each sub-item resolved individually. |

**F24 sub-items:**

- Favicon path, the bogus `-webkit-scrollbar-*` properties, the duplicate `.tag` rule, and all
  17 dead CSS rule blocks the original audit listed — **already resolved** by the time this pass
  started (doc correction only).
- `.education-modules-section` had no CSS rule — **fixed**, added one.
- `index.css` importing before Bootstrap in `main.tsx`, forcing 7 `!important`s — **fixed**, swap
  the import order (Bootstrap first, `index.css` last) and all 7 `!important`s were removed
  without any visual shift.
- Dead TS (`'project'` `CardType` member, `ProjectCard` interface) — **doc correction**; it never
  existed in the current tree.
- `<head>` metadata — **fixed**: added `<meta name="description">`, Open Graph and Twitter card
  tags. `og:image` was deliberately **not** added — no raster export of the portrait exists, and
  `public/Pic.svg` (2.3MB SVG) isn't crawler-safe; a real PNG export is future work.
- Accessibility — **fixed**: the modal now has `role="dialog"`, `aria-modal`, `aria-labelledby`,
  a focus trap, and focus restoration to the originating tile on close. Accordion headers have
  `aria-expanded`/`aria-controls`. `.cert-icon-image` has `alt=""`. The hero card is now the
  page's one `<h1>`; every other card title stays `<h2>`.

---

## 12. Machine-readable tokens

For Claude Design / any generator. Single theme (light only).

```json
{
  "color": {
    "bg": "#eeeeee", "surface": "#ffffff", "surfaceSubtle": "#eef0f5",
    "border": "#d8dce8", "accent": "#ea6508", "accentText": "#c2540a",
    "accentDim": "rgba(234,101,8,0.10)",
    "textPrimary": "#0d0e12", "textSecondary": "#4a4f63", "textMuted": "#64697f"
  },
  "font": {
    "family": "Apple Garamond",
    "weights": { "light": 300, "regular": 400, "bold": 700 },
    "size": {
      "xs": "0.95rem", "sm": "1rem", "md": "1.15rem", "lg": "1.4rem",
      "xl": "1.9rem", "2xl": "2.4rem", "3xl": "clamp(2.25rem, 9vw, 3.75rem)"
    },
    "leading": { "tight": 0.97, "snug": 1.3, "normal": 1.45, "relaxed": 1.5 }
  },
  "space": { "1": "2px", "2": "4px", "3": "6px", "4": "8px", "5": "10px", "6": "12px",
             "7": "14px", "8": "16px", "9": "18px", "10": "20px", "12": "24px", "14": "30px" },
  "radius": { "xs": "4px", "sm": "6px", "md": "8px", "lg": "10px", "xl": "12px",
              "2xl": "16px", "pill": "999px" },
  "shadow": {
    "card": "0 2px 12px rgba(0,0,0,0.08)",
    "modal": "0 24px 64px rgba(0,0,0,0.18)",
    "accordionIdle": "0 4px 14px rgba(0,0,0,0.08)",
    "accordionHover": "0 10px 24px rgba(0,0,0,0.12)"
  },
  "motion": {
    "duration": { "fast": "0.2s", "base": "0.3s", "slow": "0.45s", "flip": "0.58s" },
    "ease": { "standard": "cubic-bezier(0.4,0,0.2,1)", "emphasized": "cubic-bezier(0.2,0,0,1)" }
  },
  "layout": {
    "gridColumns": 12, "gridGap": "6px", "maxWidth": "1320px",
    "breakpoints": { "md": "900px", "sm": "560px", "xs": "380px" }
  }
}
```

---

## 13. Extending the system

Rules to follow when generating new surfaces so they read as part of this portfolio:

1. **Serif everything.** Never introduce a sans-serif. Large text → weight 300, small labels →
   weight 700, body → weight 400 — all `'Apple Garamond'`.
2. **No borders for separation.** Use `--surface` on `--bg`, or `--surface-subtle` inside
   `--surface` (reach for `.panel`). Reserve `--border` for hairlines, rails, and inactive dots.
3. **Accent is a spice.** Labels, one word in a title row, bullets, dots, active fills. Never a
   large area at full strength — use `--accent-dim` for fills, `--accent-text` for text.
4. **Active/selected = fill with `--text-primary`, text `--bg`.** The inversion pattern (§2.2).
5. **Bottom-align card content.** `justify-content: flex-end` with the icon pinned top-right.
6. **`role • company` title rows** with a `--text-muted` middot are the house text pattern.
7. **14px (`--space-7`) is one unit.** Padding, gaps, insets. 6px only for the outer bento gap.
8. **One easing curve** — `var(--ease-standard)`. Reach for `--dur-fast` (hover), `--dur-base`
   (reveal), `--dur-flip` (the 3D flip).
9. **Author bullet content as arrays**, not single strings — `InteractiveList` takes `string[]`
   directly; there's no sentence-splitting to lean on anymore.
