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

**Design language v2 (in progress).** The portfolio is mid-migration to a second visual language
sourced from Figma "Portfolio Site v2": IBM Plex Sans instead of Apple Garamond, a tighter
spacing/radius scale, and warm brown (`#613613`-based) card shadows instead of the neutral-black
ones below. Cards migrate one at a time rather than as a single cutover. **Certifications is the
first card fully migrated** (§9.8) — its font, radius, shadows, and modal chrome all read as v2.
Everything else in this document describes the v1 language still in effect for unmigrated cards,
including the "serif everywhere" rule in §13. Do not assume a token name is unchanged just because
it's documented here — `--card-radius` and `--modal-radius` in particular now point at v2 values
(§5) because they're shared across every card, migrated or not.

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
.project-action-btn-primary { background: var(--text-primary); color: var(--bg); }
```

Used by `.project-action-btn-primary`. Its reach narrowed when the projects split view and the
accordions were removed (see §11) — the pattern is unchanged, it simply has fewer consumers now.
**Keep doing this.**

### 2.3 Contrast

Measured against WCAG 2.1 AA (4.5:1 normal text, 3:1 large text ≥18.66px bold / ≥24px).

| Pair | Ratio | Verdict |
| --- | --- | --- |
| `--text-primary` on `--surface` | 19.2:1 | ✅ |
| `--text-secondary` on `--surface-subtle` | 7.1:1 | ✅ |
| `--accent-text` on `--surface` | 4.6:1 | ✅ |
| `--text-muted` on `--surface-subtle` | 4.8:1 | ✅ |

All four pass. `--accent-text` is used by `.timeline-company`, `.skill-category-label`,
`.project-detail-grade`, `.sub-timeline-division`, `.tag.is-primary`. (`.card-label`/
`.modal-label` — the small muted line above the heading — were removed entirely in the
single-text-per-card pass, see §9.1.) `--accent` (the fill color, unchanged) is not held to
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
| `--text-md` | `1.15rem` | 18.4 | Labels, dates, sub-roles, project index titles |
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
| `--leading-snug` | `1.3` | `.timeline-title-row` |
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
--card-radius: var(--radius-xs);  /* v2: was --radius-xl (12px) */
--modal-radius: var(--radius-xs); /* v2: was --radius-2xl (16px) */
```

Every `border-radius` in the file resolves to one of these seven values, including `.tag`, which
now uses `--radius-pill` (was a stray `18.5px`).

**v2 update:** both card-face aliases now point at `--radius-xs` (4px), sharper than the original
scale. `--card-radius` moved first (Figma nodes 14:86 / 13:138). `--modal-radius` moved to match —
"the open card now uses the same radius as the closed bento card" — so `.flip-back` (every open
card, every type) and `.about-image` picked up the change in one edit, since both key off this one
token. `--radius-2xl` (16px) survives the removal of the projects split view that used to be its main
consumer; it is kept as a scale step rather than deleted, since the reasoning above was about the
open-card container, not about this token.

---

## 6. Elevation

| Token | Value | Applied to |
| --- | --- | --- |
| `--shadow-card` | `0 0 16px rgba(97,54,19,.2)` | `.portfolio-card`, `.cert-card`, `.modal-close-cta` (idle) |
| `--card-shadow-hover` | `0 4px 24px 4px rgba(97,54,19,.75)` | `.portfolio-card:hover`, `.cert-card:hover`, `.modal-close-cta:hover` |
| `--shadow-modal` | `0 24px 64px rgba(0,0,0,.18)` | `.flip-back` |

`--shadow-card` is now applied to the grid tiles it's named for — they previously read as flat
white rectangles against `#eeeeee` (a 1.07:1 luminance step) with the token declared but unused.

**v2 update:** `--shadow-card` moved from a neutral black shadow to a warm brown one (Figma "Card /
Default Shadow" effect style), and a matching `--card-shadow-hover` was added (Figma "Card / Hover
Shadow"). Hover feedback on v2 surfaces is now a shadow raise instead of the v1 `--accent-dim`
background wash — see §9.1.

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

The projects deck (`deckCardVariants`) steps at `TIMELINE_STEP_DURATION`, so it moves at the
same pace as the education/experience timelines. Forward and back are exact mirrors — forward
swipes the front card off to the right (`x: 115%`, `rotate: 6`) while the next is pushed forward
out of the stack (`y: -18`, `scale: 0.95`); back plays the same two positions the other way
round, which is what makes it read as an undo rather than as a second animation.

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
│                                 │  location │  rows 1–2
│  hero  (col 1–8, rows 1–2)      ├───────────┤
│                                 │  about    │
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
| `projects` | 1023px | 640px |
| `about` | 1300px | `Infinity` |
| everything else | 900px | 760px |

`projects` sizes to its Figma frames (168:4442 / 168:269, both 1023px wide) rather than filling
the grid's full 1320px — that width existed for the old split view's sidebar and stretched the
index cards to ~408px against a designed 309px. Its 640px height is deliberately above Figma's
~480–514px frames: those were drawn against placeholder copy, and the real cards carry more tags
and an action row the frames omit. Every width stays under `.portfolio-grid-surface`'s 1320px, so
a modal is still never wider than the grid it flew out of (F20). `Infinity` (not a numeric
sentinel) marks "no cap" for `about`.

---

## 9. Component recipes

Each recipe below is the current implementation, ready to reuse.

### 9.1 Card (grid tile)

```
surface --surface · radius --card-radius (v2: 4px) · shadow --shadow-card · padding var(--space-3) var(--space-3) var(--space-4) var(--space-5)
min-height 125px · no border
flex column, align-items flex-start, justify-content flex-end, gap var(--space-3)
hover → box-shadow --card-shadow-hover (v2; was background --accent-dim)
content, bottom-aligned — a single line of text, no separate label above it:
  .card-title  --font-card-title (34px)  weight 400  --font-card  --text-primary  line-height --leading-tight
  .card-preview-icon  absolute top/right var(--space-3), --card-icon-color, --text-lg
hero variant: min-height 260px, title --font-hero-title (fluid), gap --space-6
  (was --space-3) so the .hero-socials pill row (§9.3) sits 12px above the name
```

**One text per card** (Figma node 43:78): every clickable card shows only its `label` (the
category name — "About", "Certifications", …) rendered in the `.card-title` heading style;
`title` (the old descriptive line — "Who I am", "What I've earnt") is no longer displayed on
the grid face *or* the modal header, which now renders the same single `.modal-title` (label
text). The two non-clickable cards (`hero`, `location`) are the exception: they have no modal
to reveal more, so they keep showing their `title` (the actual content — "Kian Tamjidi",
"London, UK") instead of their `label` ("Intro", "Location"). `CardInner` picks the source via
`card.nonClickable ? card.title : card.label`. `.card-label`/`.modal-label` (the old small
muted line) were removed — `--font-card-label` (18px) survives only via `.cert-date` (§9.8).

### 9.2 Recessed-row primitive (`.panel`)

```css
.panel { background: var(--surface-subtle); border-radius: var(--radius-xl); padding: var(--space-7); }
.panel--roomy { padding: var(--space-8); }             /* .timeline-content's 16px */
```

`.timeline-content` and `.modal-section` compose `.panel` (plus modifiers) instead of repeating
the same background/radius/padding block. Genuine differences stay on the individual classes:
`.timeline-content`'s flex-column + tighter 5px internal gap. Certifications no longer composes
`.panel` — see §9.8, its v2 recipe is its own. (`.panel--interactive` and `.social-row`, formerly
the Social card's link rows, were removed along with the Social card itself — see §9.3.)

### 9.3 Tag / pill (v2 — Figma nodes 48:405 / 48:388)

```
.tag             radius --radius-xl (12px) · padding var(--space-5) var(--space-6) (10px/12px)
                 --font-pill (14px) weight 300 · color --pill-text (#000) · background --pill-surface (#fafafa)
                 shadow --shadow-card · hover → shadow --card-shadow-hover
.tag.is-primary  color --accent-text · background --accent-dim
```

Was `radius --radius-pill` (999px) · `padding 5px var(--space-5)` · `--text-xs` · `color
--text-secondary` · `background --surface`, with no hover state. The v2 redesign swaps the fully-
rounded pill for a 12px rounded rect on an off-white surface, and gives it the same
shadow-intensifies-on-hover treatment as the bento card itself (`--shadow-card` →
`--card-shadow-hover`) instead of a flat, static look.

**Hero social pills** (`.hero-social-pill`, Figma nodes 49:420 / 49:434 / 49:444 / 49:454) are a
variant of the same base recipe — same surface/radius/padding/font — used for the GitHub/LinkedIn/
Email links now embedded directly in the hero card (replacing the old modal-based Social card, see
§9.8). Each platform keeps its own brand-colored glow instead of the shared brown:

```
.hero-social-pill-github    shadow 0 0 16px 2px rgba(0,0,0,.4)        → hover 0 4px 24px 4px rgba(0,0,0,.75)
.hero-social-pill-linkedin  shadow 0 0 16px 2px rgba(10,102,194,.4)   → hover 0 4px 24px 4px rgba(10,102,194,.75)
.hero-social-pill-email     shadow 0 0 16px 2px rgba(97,54,19,.4)     → hover 0 4px 24px 4px rgba(97,54,19,.75)
```

Hover also flips the pill's font weight 300 → 500 (Medium) — the one property the generic `.tag`
hover doesn't touch.

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
pattern — reused verbatim in `.sub-timeline-role-row`. Certifications used to share it
(`.cert-title-row`) but dropped the inline separator when it migrated to v2 — see §9.8.

### 9.5 Projects deck (`ProjectDeck`)

The Projects modal holds two views. It opens on `.project-index`, a 3-column grid of every
project (title + first summary bullet, CSS line-clamped to 2 lines); picking one deals that
project to the front of a deck.

```
.project-deck-bar    back button + track, one row
.project-deck-back   ghost: 1px --border outline, transparent fill, --text-secondary
                     hover → --surface-subtle fill, --text-primary
.htimeline-track     dots spread space-between over a 1px --border rail at top 7px
.htimeline-dot       shares .vtimeline-track-dot's recipe (15px, --border, --accent when active)
.deck-nav            shares .vtimeline-nav's recipe (36px pill, --modal-close-idle-bg)
.project-deck-stack  position:relative; front card and ghosts are absolute inset:0
.project-deck-ghost  translateY(--deck-depth × -18px) scale(1 − --deck-depth × 0.05)
.project-deck-card   --cert-card-surface · --shadow-panel-elevated
                     padding var(--space-10) var(--space-9) · flat gap var(--space-6)
```

The stack is deliberately a fixed footprint: the front card is out of flow, so dealing the next
card cannot resize the stage. A height that moved mid-deal would fight the swipe it is carrying.
`projects` keeps `fillsHeight` in `modalRect.ts` for the same reason — this is the one modal
whose height is pinned rather than measured. Card body type follows the Certifications tiers
(§9.8), not a fourth scale.

Both arrows **wrap** rather than disabling at the ends — a deck has no start or end. This is the
one deliberate divergence from `.vtimeline-nav`, where a disabled arrow is precisely the signal
that you are at the first or last entry.

### 9.6 Button set

| Class | Fill | Text |
| --- | --- | --- |
| `.project-action-btn-primary` | `--text-primary` | `--bg` |
| `.project-action-btn-secondary` | transparent | `--text-primary` |
| `.modal-close-cta` | `--surface-subtle` | `--text-secondary` |

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

### 9.8 Certifications card (design language v2)

The first card fully migrated off the v1 language (Figma nodes 30:293 / 30:251). Content still
comes from `content.ts` (`CertItem[]`) — Figma supplied layout only, never copy.

```
.certs-grid   display grid · grid-template-columns repeat(2, minmax(0,1fr)) · gap var(--space-7)
              @container portfolio-modal (max-width: 640px) → 1 column
.cert-card    flex column · gap var(--space-4) · padding var(--space-7)
              background --cert-card-surface (#fafafa) · shadow --shadow-card
              hover/focus-visible → shadow --card-shadow-hover
              no border-radius (square corners, per Figma — deliberately not --card-radius)
  .cert-card-header  flex row · gap var(--space-8) · align-items center
    .cert-icon        64×64, no fixed wrapper size
    .cert-icon-image  radius --radius-sm
    .cert-info        flex column
      .cert-title    --text-lg  weight 400  --font-card  --text-primary  line 1.3
      .cert-date     --font-card-label (18px)  weight 300  --font-card  --text-muted  line --leading-normal
  .cert-takeaway  --text-sm (16px)  --font-card  --text-secondary  line 1.4
                  always visible — v1's hover-to-reveal behavior was dropped, not carried over
```

Grid order is DOM order (`card.certs` as authored), most-recent-first, filling left-to-right then
top-to-bottom — so the array's existing chronological order (newest first) is what puts the most
recent certification top-left and the oldest bottom-right with no extra sort step. Each `.cert-card`
is a direct child of `.portfolio-modal-body` (via the plain `.certs-grid` wrapper, same pattern as
`.skills-grid` in §9.3 above it structurally), so the existing `staggerChildren` entrance animation
still reaches each card individually — see `CONTENT_STAGGER` in `src/motion.ts`.

`--cert-card-surface` (`#fafafa`) is a new token, distinct from both `--surface` (#fff) and
`--surface-subtle` (#eef0f5) — see §12.

---

## 10. Iconography

- **UI icons** — Font Awesome React components (`faAward`, `faChevronDown`, `faListUl`, …).
- **Brand logos** — SVGs in `public/`, referenced by relative URL (`./github.svg`, `./UBS.svg`).
  Sizes: certification icons `64×64` with no outer box (v2, §9.8); experience logo absolute
  top-right; action icons `18×18`. The hero social pills (§9.3) are text-only — no icon glyph,
  per Figma.
  (`src/assets/icons/` — an unreferenced duplicate set — has been deleted; `public/` is the only
  live set.)
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
| **F25** | **In progress.** Design language v2 (Figma "Portfolio Site v2") is being rolled out card by card rather than as one cutover — IBM Plex Sans, a warm-brown shadow pair, and a 4px card/modal radius replace the v1 serif/neutral-shadow/12–16px-radius language. Certifications (§9.8) is the first card fully migrated, including dropping its old hover-to-reveal takeaway in favor of an always-visible one. `--card-radius` and `--modal-radius` moved to v2 values immediately for every card (open or closed) since those two tokens are shared; per-card *content* migrates independently. §13's "serif everywhere" rule is stale until the migration finishes — treat it as describing v1 only. |

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
- Accordions — **removed**: the Projects modal was their only consumer, and it hid the two things
  that most distinguish one project from another (technologies, challenges) behind a click. The
  redesign shows both outright, so `AccordionSection.tsx`, the `.accordion-*` rules, the
  `--shadow-accordion-*` tokens and `motion.ts`'s now-orphaned `collapseTransition` /
  `COLLAPSE_DURATION` all went with it. §9.5 is now the deck that replaced it.
- Projects split view — **replaced**: the sidebar + internally-scrolling detail pane (and its
  mobile hamburger/overlay overrides) gave way to the index grid + deck above. Projects was the
  last modal still on the pre-overhaul layout.

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
    "leading": { "tight": 0.97, "snug": 1.3, "normal": 1.45, "relaxed": 1.5 },
    "v2": {
      "note": "in-progress design language (F25) — card faces, modal headers, and Certifications body copy already use this; the rest of the system is still 'family' above",
      "family": "IBM Plex Sans",
      "weights": { "light": 300, "regular": 400, "medium": 500 },
      "cardLabel": "18px", "cardTitle": "34px", "pill": "14px", "leadingLabel": 0.75
    }
  },
  "space": { "1": "2px", "2": "4px", "3": "6px", "4": "8px", "5": "10px", "6": "12px",
             "7": "14px", "8": "16px", "9": "18px", "10": "20px", "12": "24px", "14": "30px" },
  "radius": { "xs": "4px", "sm": "6px", "md": "8px", "lg": "10px", "xl": "12px",
              "2xl": "16px", "pill": "999px" },
  "cardRadius": "4px", "modalRadius": "4px",
  "shadow": {
    "card": "0 0 16px rgba(97,54,19,0.2)",
    "cardHover": "0 4px 24px 4px rgba(97,54,19,0.75)",
    "modal": "0 24px 64px rgba(0,0,0,0.18)"
  },
  "certCard": { "surface": "#fafafa", "iconColor": "#613613", "modalCloseIdleBg": "#e2e2e2" },
  "pill": {
    "surface": "#fafafa", "text": "#000000",
    "heroSocialShadow": {
      "github": "#000000", "linkedin": "#0a66c2", "email": "#613613"
    }
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

1. **Serif everything — v1 only.** Unmigrated cards: never introduce a sans-serif; large text →
   weight 300, small labels → weight 700, body → weight 400, all `'Apple Garamond'`. A card being
   migrated to design language v2 (F25) instead uses `'IBM Plex Sans'` (`--font-card`) throughout,
   weight 300 for labels/small text and weight 400 for titles/body — see §9.8 for the reference
   implementation. Don't mix the two families within one card.
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
