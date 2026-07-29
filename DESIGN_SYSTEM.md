# Kian Tamjidi — Portfolio Design System

Extracted from the live implementation (`src/index.css`, `src/App.tsx`). This document is the
canonical description of the system as **built**, plus a clearly-separated list of places where
the implementation is inconsistent with itself.

Two kinds of statement appear here:

- **Spec** — how the system works today. Safe to build against.
- 🚩 **Flag** — an inconsistency or gap. Numbered `F1…F24` and collected in
  [Flagged issues](#flagged-issues). Nothing in this section has been silently "fixed"; visual
  output is unchanged from the current live site.

---

## 1. Design intent

A **serif-led bento grid**. The whole portfolio is a single non-scrolling viewport of tiles; every
tile flips in 3D into a modal. The personality comes from three places:

1. **Apple Garamond everywhere** — a display serif used at body sizes too. Unusual for a dev
   portfolio and the single strongest identity signal.
2. **One warm accent** (burnt orange) against a near-neutral grey-blue palette. Accent is used
   sparingly: labels, company names, bullets, active states.
3. **Weight-as-hierarchy, not size-as-hierarchy** — titles are set in the *Light* cut at large
   sizes, labels in the *Bold* cut at small sizes. Large + light vs small + bold is the recurring
   pairing.

Layout tone: dense (6px grid gap), low-contrast surfaces, generous radii, no borders — separation
is achieved with surface elevation (`--surface` on `--bg`), not lines.

---

## 2. Color

### 2.1 Light (`:root`)

| Token | Value | Role |
| --- | --- | --- |
| `--bg` | `#eeeeee` | Page background |
| `--surface` | `#ffffff` | Card / modal / header background |
| `--surface-subtle` | `#eef0f5` | Recessed panel inside a modal (sections, rows, timeline) |
| `--border` | `#d8dce8` | Hairlines, timeline rails, inactive dots, scrollbar thumb |
| `--accent` | `#ea6508` | Primary accent — burnt orange |
| `--accent-dim` | `rgba(234,101,8,0.10)` | Accent wash for hover / active fills |
| `--text-primary` | `#0d0e12` | Titles, body headings; also used as a *dark fill* |
| `--text-secondary` | `#4a4f63` | Body copy, tags |
| `--text-muted` | `#8a8fa8` | Dates, meta, chevrons |

### 2.2 Dark (`html.dark`)

| Token | Value |
| --- | --- |
| `--bg` | `#16161c` |
| `--surface` | `#23232b` |
| `--surface-subtle` | `#1f1f28` |
| `--border` | `#2a2a36` |
| `--accent` | `#f97316` |
| `--accent-dim` | `rgba(249,115,22,0.14)` |
| `--text-primary` | `#f0f1f5` |
| `--text-secondary` | `#b0b4c8` |
| `--text-muted` | `#8a8fa8` |

Dark mode is **fully implemented in CSS and completely unreachable** — the toggle button in
`App.tsx` is commented out and `isDark` has no setter, so the class never changes. 🚩 **F1**

### 2.3 The inversion pattern

A recurring and effective trick: **active/primary states fill with `--text-primary` and set their
own text to `--bg`.** This auto-inverts between themes without a second token.

```css
.project-sidebar-btn.active { background: var(--text-primary); }
.project-sidebar-btn.active .project-sidebar-title { color: var(--bg); }
```

Used by `.project-sidebar-btn.active`, `.accordion-header.active`,
`.project-action-btn-primary`, `.project-list-hamburger`. **Keep doing this.**

### 2.4 Contrast audit

Measured against WCAG 2.1 AA (4.5:1 normal text, 3:1 large text ≥18.66px bold / ≥24px).

| Pair | Ratio | Verdict |
| --- | --- | --- |
| `--text-primary` on `--surface` | 19.2:1 | ✅ |
| `--text-secondary` on `--surface-subtle` | 7.1:1 | ✅ |
| **`--accent` on `--surface`** (light) | **3.3:1** | ❌ fails normal text |
| **`--text-muted` on `--surface-subtle`** (light) | **2.8:1** | ❌ fails everything |
| `--accent` on `--surface` (dark) | 5.6:1 | ✅ |
| `--text-muted` on `--surface-subtle` (dark) | 5.1:1 | ✅ |

🚩 **F2** — Light mode fails on the two most-used secondary colors; dark mode passes both. The
palette was evidently tuned in dark and ported to light.

Suggested minimal fixes (**not applied** — they change pixels):

```css
:root {
  --text-muted: #64697f;   /* 4.8:1 on --surface-subtle, was 2.8:1 */
  --accent-text: #c2540a;  /* 4.6:1 on white — use for accent *text* only */
  --accent: #ea6508;       /* unchanged — fills, icons, dots, bullets */
}
```

Splitting `--accent` (fill) from `--accent-text` (text) is the standard resolution and preserves
the brand orange everywhere it reads as a shape rather than a glyph. Affected text rules:
`.modal-label`, `.timeline-company`, `.cert-company`, `.skill-category-label`,
`.modal-row-subtitle`, `.project-detail-grade`, `.sub-timeline-division`, `.tag.is-primary`.

### 2.5 Hard-coded colors that bypass the token layer

🚩 **F3** — Six rules hard-code the **dark-mode** orange `#f97316` / `rgba(249,115,22,…)` and are
served in **light** mode, where the accent is `#ea6508`. The result is a subtly mismatched orange
on those borders in light mode:

| Location | Literal |
| --- | --- |
| `.tag.is-primary` `border-color` | `rgba(249,115,22,0.4)` |
| `.timeline-group-title-badge` `border` | `rgba(249,115,22,0.2)` |
| `.link-row a` `border` | `rgba(249,115,22,0.35)` |
| `.pill` `border` | `rgba(34,211,238,0.3)` — dark-mode *sky*, a color no longer in the system |
| `.card-viewed` `background` | `rgba(16,185,129,0.5)` — emerald, not in the system |
| `.flip-scrim` `background` | `rgba(8,8,12,0.55)` — legitimately theme-independent, fine |

Note `.tag.is-primary` sets `border-color` but `.tag` never sets `border-style`, so **that border
never renders at all**. Same for `.pill`'s color mismatch — `.pill` and `.link-row` are dead code
(see F14).

### 2.6 Orphaned color tokens

🚩 **F4** — 12 tokens are declared in both themes and referenced by nothing reachable:
`--accent-sky`, `--accent-sky-dim`, `--accent-emerald`, `--accent-emerald-dim`, `--orb`,
`--viewed-border`, `--viewed-bg-mix`, `--viewed-shadow`, `--health-liquid`, `--health-liquid-dim`,
`--health-track`, `--health-track-border`. They are residue from removed features (a "viewed"
state, a health meter, a background orb). ~24 lines of `:root`/`html.dark` noise.

---

## 3. Typography

### 3.1 Families

```css
@font-face { font-family: 'Light';   src: url('AppleGaramond-Light.ttf'); font-weight: normal; }
@font-face { font-family: 'Regular'; src: url('AppleGaramond.ttf');       font-weight: normal; }
@font-face { font-family: 'Bold';    src: url('AppleGaramond-Bold.ttf');  font-weight: normal; }
```

Three **separate families** named after weights, each declared `font-weight: normal`.

🚩 **F5** — This is the most significant structural problem in the type system. Consequences:

- `font-weight: 600` / `bold` (used in `.timeline-group-title-badge`, `.sub-timeline-badge`,
  `.interactive-bullet-item::before`) can only trigger **synthetic** faux-bold, because every
  declared face claims `normal`.
- No italic is reachable, though four italic `.ttf` files ship in `src/assets/fonts/`
  (`AppleGaramond-Italic`, `-LightItalic`, `-BoldItalic`) — **~4 unused font files**.
- Family names collide with any real font called "Light"/"Bold" on the user's machine.
- `.ttf` is served rather than `.woff2` — roughly 2–3× the bytes, and all six faces load.

The correct shape (one family, three weights, italics available):

```css
@font-face { font-family: 'Apple Garamond'; src: url('...Light.woff2') format('woff2');
             font-weight: 300; font-style: normal; font-display: swap; }
@font-face { font-family: 'Apple Garamond'; src: url('....woff2')      format('woff2');
             font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Apple Garamond'; src: url('...Bold.woff2')  format('woff2');
             font-weight: 700; font-style: normal; font-display: swap; }
```

Then `font-family: 'Light'` → `font-weight: 300`, `'Bold'` → `700`. This is a **mechanical
find-and-replace across ~20 rules** and is the highest-leverage cleanup available. It is *not*
applied here because converting the font binaries is out of scope for a no-visual-change refactor.

🚩 **F6** — No `font-display` on any `@font-face`, so the whole page is invisible during font load
(FOIT) on a cold cache. Add `font-display: swap`.

### 3.2 Scale

| Token | Value | px @16 | Used by |
| --- | --- | --- | --- |
| *(missing)* `--font-sm` | — | — | `.modal-close-cta`, `.modal-close-cta-text` |
| `--font-base` | `0.95rem` | 15.2 | Body copy, tags, bullets, takeaways |
| `--font-md` | `1.15rem` | 18.4 | Labels, dates, sub-roles, sidebar titles |
| `--font-lg` | `1.4rem` | 22.4 | Row titles, role names, company names |
| `--font-xl` | `1.6rem` | 25.6 | `.modal-close` only — which is dead code |
| `--font-card-title` | `1.9rem` | 30.4 | Grid card title |
| `--font-modal-title` | `2.4rem` | 38.4 | Modal title, project detail header |
| `--font-hero-title` | `3.75rem` | 60 | Hero name |

🚩 **F7** — **`--font-sm` is used but never declared.** Both references are invalid at
computed-value time, so `font-size` falls back to inherited (16px from Bootstrap's `body`). The
close button is therefore *larger* than `--font-base` (15.2px) and larger than the `--font-md`
labels next to it — visually it's the only un-scaled text in the app.

Declaring `--font-sm: 1rem` reproduces today's rendering **exactly** while removing the invalid
reference. This one *is* applied in the refactor (it is provably pixel-identical).

🚩 **F8** — Naming is inconsistent: `sm/base/md/lg/xl` (t-shirt) mixed with
`card-title/modal-title/hero-title` (semantic). Also `base` sits *below* `md`, so the scale reads
`sm(16) < base(15.2)` — i.e. `sm` is **bigger** than `base`. Pick one axis. Suggested:

```
--text-xs .. --text-5xl   (pure scale)   +   semantic aliases pointing at them
```

🚩 **F9** — Ratios are irregular: 0.95 → 1.15 (×1.21) → 1.4 (×1.22) → 1.6 (×1.14) → 1.9 (×1.19)
→ 2.4 (×1.26) → 3.75 (×1.56). Mostly ~1.2 with two outliers. A clean 1.2 (minor third) ladder from
0.95 would be 0.95 / 1.14 / 1.37 / 1.64 / 1.97 / 2.36 / 2.83 — within a hair of the existing values
except the hero, which is deliberately oversized. Low priority, but worth locking before extending.

🚩 **F10** — No fluid/responsive type. `--font-hero-title: 3.75rem` (60px) is fixed at all
breakpoints; on a 320px viewport "Kian Tamjidi" is 60px against a 300px content box. `clamp()` on
the three display sizes would be a real improvement:

```css
--font-hero-title: clamp(2.25rem, 9vw, 3.75rem);
```

### 3.3 Line height

`body { line-height: 1.45 }`, `.card-title { 0.97 }`, `.timeline-title-row { 1.3 }`,
`.interactive-bullet-item { 1.5 }`, `.cert-takeaway { 1.4 }`, `.project-detail-grade { 1.2 }`.
No tokens. 🚩 **F11** — add `--leading-tight: 0.97 / --leading-snug: 1.3 / --leading-normal: 1.45 /
--leading-relaxed: 1.5`.

---

## 4. Space

🚩 **F12** — **There is no spacing scale.** Every value is a literal. Frequency across
`index.css`:

| Value | Occurrences |
| --- | --- |
| `14px` | 21 |
| `12px` | 14 |
| `16px` | 13 |
| `8px` | 11 |
| `24px` | 9 |
| `10px` | 8 |
| `6px` | 6 |
| `18px`, `20px`, `30px`, `48px`, `96px` | 1–3 each |

The de-facto scale is a clean **2px-based ramp**: `2 4 6 8 10 12 14 16 18 20 24 30`. It just isn't
named. Proposed tokens (values chosen so **no existing declaration changes**):

```css
--space-1: 2px;   --space-2: 4px;   --space-3: 6px;   --space-4: 8px;
--space-5: 10px;  --space-6: 12px;  --space-7: 14px;  --space-8: 16px;
--space-9: 18px;  --space-10: 20px; --space-12: 24px; --space-14: 30px;
```

`14px` is the workhorse (card padding, modal section padding, grid gaps, flex gaps) — it is
effectively this system's "1 unit". Note the oddity that the *page* gap is `6px` while *interior*
gaps are `14px`; that tight outer gap is a deliberate bento signature, keep it.

---

## 5. Radius

| Token | Value | Applied to |
| --- | --- | --- |
| `--card-radius` | `12px` | Grid card, flip front, `.modal-section` |
| `--modal-radius` | `16px` | Flip back, `.about-image` |

🚩 **F13** — Tokens exist but **`12px` is hard-coded in 11 further rules** (`.social-row`,
`.cert-row`, `.cert-icon`→`10px`, `.timeline-content`, `.skill-category`, `.accordion-header`,
`.project-sidebar-btn`, `.project-action-btn`, `.project-list-hamburger`, `.project-nav-arrow`,
`.project-image-placeholder`) and `16px` in 3 (`.projects-detail-pane`, `.sidebar-open` panel,
`.about-image` uses the token). Plus unsystematised `4px`, `6px`, `8px`, `10px`, `999px`, and one
`18.5px`.

`.tag { border-radius: 18.5px }` is a half-pixel value that is *trying* to be a pill. The tag is
~28–30px tall, so `999px` is the intended effect and is what every other pill in the file uses.

Proposed full ramp (all values already present in the file):

```css
--radius-xs: 4px;  --radius-sm: 6px;  --radius-md: 8px;   --radius-lg: 10px;
--radius-xl: 12px; /* = --card-radius */  --radius-2xl: 16px; /* = --modal-radius */
--radius-pill: 999px;
```

---

## 6. Elevation

| Token | Light | Dark |
| --- | --- | --- |
| `--shadow-card` | `0 2px 12px rgba(0,0,0,.08)` | `0 2px 18px rgba(0,0,0,.35)` |
| `--shadow-modal` | `0 24px 64px rgba(0,0,0,.18)` | `0 24px 64px rgba(0,0,0,.55)` |
| `--shadow-accordion-idle` | `0 4px 14px rgba(0,0,0,.08)` | `0 4px 16px rgba(0,0,0,.25)` |
| `--shadow-accordion-hover` | `0 10px 24px rgba(0,0,0,.12)` | `0 12px 30px rgba(0,0,0,.45)` |

🚩 **F14** — **`--shadow-card` is applied to exactly one element: `.theme-toggle`, which is
commented out of the JSX.** The portfolio cards — the thing the token is named for — have **no
shadow at all**. They read as flat white rectangles separated only by the `#eeeeee` page bg
(1.07:1 luminance step). Either apply it to `.portfolio-card` (a visible change, so not done here)
or drop the token.

Naming is also inconsistent: three tokens are semantic-by-elevation (`card`, `modal`) and two are
semantic-by-component (`accordion-idle`, `accordion-hover`). Prefer
`--shadow-sm/-md/-lg/-xl` + component aliases.

---

## 7. Motion

Duration and easing values in use:

| Duration | Where |
| --- | --- |
| `0.15s` | toggle transform |
| `0.2s` | most hovers, chevron color, sidebar buttons |
| `0.22s` | card hover, scrim fade, modal item reveal |
| `0.25s` | accordion header |
| `0.3s` | body theme transition, cert takeaway reveal, chevron rotate |
| `0.34s` | flip-back background |
| `0.35s` | grid surface transform |
| `0.4s` | grid template / card geometry |
| `0.42s` | flip wrapper |
| `0.45s` | grid surface opacity/filter |
| `0.58s` | `FLIP_DURATION` (TS) |
| `0.6s` | flip-front background (inline style in TSX) |
| `0.65s` | viewport-progress (dead) |
| `0.8s` | grid item entrance (TS) |
| `2s` | `pulse-recent` loop |

🚩 **F15** — 15 distinct durations, no tokens, and the timing system is **split across CSS and
TS** with no shared source. `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard) is written out **10
times in CSS**, plus `cubicBezier(0.4, 0, 0.2, 1)` twice and the raw array `[0.4, 0, 0.2, 1)]`
twice in `App.tsx` — four different spellings of one curve.

Proposed:

```css
:root {
  --dur-fast: 0.2s;  --dur-base: 0.3s;  --dur-slow: 0.45s;  --dur-flip: 0.58s;
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
}
```

…and a single `motion.ts` exporting `EASE_STANDARD = cubicBezier(0.4, 0, 0.2, 1)` for the
framer-motion side. The TS half of this **is** consolidated in the refactor (see `src/motion.ts`).

🚩 **F16** — `transition: all` appears in 8 rules (`.modal-close-cta`, `.project-nav-arrow`,
`.project-sidebar-btn`, `.project-sidebar-icon`, `.accordion-header`, `.project-action-btn`,
`.project-list-hamburger`, `.projects-detail-pane` chain). `all` transitions layout properties too,
which is why several of these need `transform: none` overrides to cancel unintended motion. Name
the properties.

🚩 **F17** — **No `prefers-reduced-motion` support anywhere.** The app's core interaction is a
580ms 3D rotation plus an infinite `pulse-recent` box-shadow animation. This is the single biggest
accessibility gap after F2. Adding it is a behavior change for reduced-motion users only, so it is
flagged rather than applied:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
```

---

## 8. Layout

### 8.1 Grid

`.portfolio-grid` — 12 columns, `gap: 6px`, `max-width: 1320px`, vertically centred in a
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

Placement lives in **`content.ts`** as a `placementClass` string (`place-hero`, …) with matching
`grid-column`/`grid-row` rules in `index.css`.

🚩 **F18** — Placement is declared in **four places** per card: the base rule plus overrides at
900px, 560px, and 380px. Adding or moving one card means editing all four blocks. The 560px and
380px blocks are near-identical (both collapse everything to full-width; 560 keeps a 2-col grid,
380 goes 1-col). The 380px block is entirely redundant with a `repeat(auto-fit, minmax(...))`
approach. Also, `place-education` is `span 5` and `place-experience` is `span 7` in a 12-col grid —
correct — but at 900px they become `span 2` and `span 4` in a **6**-col grid, leaving a 6th column
gap on that row. Likely unintentional.

### 8.2 Breakpoints

`1024px` (about layout, skills grid), `1000px` (experience logo), `900px` (grid + projects),
`768px` (skills grid), `560px` (grid + modal header), `380px` (grid).

🚩 **F19** — Six breakpoints, four of them within 250px of each other, none tokenized, and
`1000px` vs `1024px` are almost certainly meant to be the same. Consolidate to three:
`1024px` / `640px` / `380px`, or use container queries for the modal-internal ones (the about
layout and skills grid respond to *modal* width, not viewport width — they only correlate by
accident because the modal is viewport-sized).

### 8.3 Modal sizing

`getModalRect(type)` in `App.tsx`, viewport minus `42px` padding, capped per type:

| Type | Max width | Max height |
| --- | --- | --- |
| `projects` | 1400px | 900px |
| `about` | 1300px | 9999px |
| everything else | 900px | 760px |

🚩 **F20** — `9999px` is a sentinel for "unbounded"; use `Infinity` or omit the cap. The magic
numbers are also disconnected from the `1320px` grid max-width — a modal (1400px) can be wider
than the grid it flew out of.

---

## 9. Component recipes

Each recipe below is the current implementation, ready to reuse.

### 9.1 Card (grid tile)

```
surface --surface · radius --card-radius · padding 14px · min-height 125px · no border
flex column, align-items flex-start, justify-content flex-end, gap 10px
hover → background color-mix(in srgb, var(--accent), transparent 85%)
content, bottom-aligned:
  .card-label  --font-md   'Bold'   --text-muted
  .card-title  --font-card-title 'Light' --text-primary  line-height 0.97
  .card-preview-icon  absolute top/right 16px, --accent, --font-lg
hero variant: min-height 260px, title --font-hero-title, no label
```

Note the hover uses `color-mix(… transparent 85%)` = 15% accent, while `--accent-dim` is 10%.
🚩 **F21** — two different "accent wash" strengths for the same semantic (hover). Cards use 15%,
everything else uses `--accent-dim` (10%). Also `.portfolio-card` sets `border: none !important` —
see F23.

### 9.2 Recessed row (`.social-row`, `.cert-row`, `.timeline-content`, `.modal-section`)

```
background --surface-subtle · radius 12px · padding 14px · gap 14px
hover → background var(--accent-dim)
```

Four classes with an identical box; the only differences are `display` (flex vs grid `80px 1fr`)
and whether hover applies. A single `.panel` primitive + modifiers would replace all four.
🚩 **F22**

### 9.3 Tag / pill

```
.tag           radius 18.5px (intent: 999px) · padding 5px 10px · --font-base
               color --text-secondary · background --surface
.tag.is-primary  color --accent · background --accent-dim
                 (+ a border-color that never renders — no border-style)
```

### 9.4 Timeline

```
.timeline         border-left 1px --border · padding-left 14px · gap 18px
.timeline-dot     15px circle, absolute left -22px top 16px, background --border
  .is-recent      background --accent + pulse-recent 2s infinite
.timeline-content  recessed row (9.2)
.timeline-title-row  role (--font-lg, --text-primary) • separator (--text-muted)
                     • company (--font-lg, --accent)
.sub-timeline     nested: border-left 1px dashed, margin-left 8px, padding-left 20px, gap 24px
```

The `role • company` title row with a muted middot separator is the system's signature text
pattern — reused verbatim in `.cert-title-row` and `.sub-timeline-role-row`.

### 9.5 Accordion

```
.accordion-header   transparent bg · radius 12px · padding 16px 20px
                    box-shadow --shadow-accordion-idle
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

All `radius 12px`, `'Bold'`, `--font-base`, `padding 12px 24px` (close CTA: `8px 14px`).
Primary-button hover *lightens to an accent wash and flips text back to dark* —
`background: color-mix(in srgb, var(--accent), transparent 70%)` — which is a large state change;
worth checking it still reads as the same control.

### 9.7 Sentence-list (`InteractiveList`)

Prose in `content.ts` is stored as **one string per role/project** and split at runtime on
`/(?<=[.!?])\s+/` into `<li>` bullets. So authoring is plain prose; presentation is a bullet list.

🚩 **F23** — This means **a period inside a sentence creates a spurious bullet**. Content today is
safe, but "e.g." / "Ph.D." / "3.5 years" / any abbreviation would silently split a bullet. It also
means bullets can't contain multiple sentences. Consider `string[]` in the content model.

---

## 10. Iconography

- **UI icons** — Font Awesome React components (`faAward`, `faChevronDown`, `faListUl`, …).
- **Brand logos** — SVGs in `public/`, referenced by relative URL (`./github.svg`, `./UBS.svg`).
  Sizes: cert/social icons `80×80` box, `height/width={64}` attributes; experience logo absolute
  top-right; action icons `18×18`.
- Dark-on-light SVGs are handled with `filter: invert(1)` on primary buttons and `invert(0)` in
  dark mode.

Card→icon mapping lives in `cardPreviewIcons` in `App.tsx`, keyed by **card `id`** (not `type`).

---

## 11. Flagged issues

Ordered by impact. None of these are applied unless marked ✅ (pixel-identical only).

| # | Severity | Issue |
| --- | --- | --- |
| F2 | **High** | Light mode fails WCAG AA on `--accent` text (3.3:1) and `--text-muted` (2.8:1) |
| F5 | **High** | Three font *families* named after weights; faux-bold, no italics, `.ttf` not `.woff2` |
| F17 | **High** | No `prefers-reduced-motion` — core interaction is a 580ms 3D flip + infinite pulse |
| F7 | **High** | ✅ `--font-sm` used but never declared (2 rules render at unstyled 16px) |
| F3 | Medium | 6 rules hard-code dark-mode / retired accents; served in light mode |
| F12 | Medium | No spacing scale — 100+ literal px values |
| F13 | Medium | Radius tokens exist but bypassed in 14 rules; `.tag` has a `18.5px` half-pixel pill |
| F14 | Medium | `--shadow-card` applied only to a commented-out element; cards are flat |
| F15 | Medium | 15 undocumented durations; one easing curve spelled 4 ways across CSS + TS |
| F18 | Medium | Card placement duplicated across 4 breakpoint blocks; 6-col row leaves a gap at 900px |
| F23 | Medium | Sentence-splitting on `.` will mis-bullet any abbreviation |
| F1 | Medium | Dark mode fully built but unreachable (toggle commented out, `isDark` has no setter) |
| F6 | Low | No `font-display: swap` — FOIT on cold cache |
| F8 | Low | Type token naming mixes t-shirt and semantic; `sm` (16px) > `base` (15.2px) |
| F9 | Low | Irregular type ratios (1.14–1.56) |
| F10 | Low | Fixed 60px hero title at all viewports |
| F11 | Low | No line-height tokens |
| F16 | Low | `transition: all` in 8 rules, forcing `transform: none` counter-overrides |
| F19 | Low | 6 breakpoints; `1000px` vs `1024px` duplication; modal-internal queries should be container queries |
| F20 | Low | `9999px` sentinel; modal max-width (1400px) exceeds grid max-width (1320px) |
| F21 | Low | Two accent-wash strengths for one semantic (card hover 15% vs `--accent-dim` 10%) |
| F22 | Low | Four near-identical "recessed row" classes; no shared primitive |
| F4 | Low | 12 orphaned color tokens from removed features |
| F24 | Low | See below — non-token issues found while auditing |

**F24 — outside the token layer, found while auditing:**

- `index.html` has `<link rel="icon" href="/favicon.svg">` — an **absolute** path, but Vite `base`
  is `/portfolio/`. The favicon 404s on the deployed site; it needs `./favicon.svg`.
- No `<meta name="description">`, no Open Graph / Twitter card tags, no `lang`-appropriate
  `<title>` beyond "Kian's Portfolio". For a portfolio that gets shared as a link, OG tags are
  high-value.
- `-webkit-scrollbar-width` and `-webkit-scrollbar-color` (in `.portfolio-modal-body` and
  `.projects-detail-pane`) are **not real properties** — no such prefixed forms exist. Harmless,
  but delete them; the unprefixed `scrollbar-width`/`scrollbar-color` beside them do the work.
- `.tag` is declared **twice** (line 709 `{background: --surface}` and line 909 the full rule).
  Merge.
- `.education-modules-section` is used in the JSX but has **no CSS rule** at all.
- `index.css` is imported **before** Bootstrap in `main.tsx`, so Bootstrap wins every specificity
  tie. This is the direct cause of `border: none !important` and `padding: 1.5rem !important`.
  Swapping the import order lets both `!important`s go. (Not done here — it could shift other
  Bootstrap interactions and needs a visual pass.)
- Dead CSS: **17 rule blocks, ~150 lines** — `.theme-toggle`(×2), `.card-summary`, `.card-viewed`,
  `.modal-close`(×2), `.portfolio-modal`, `.flip-wrapper-nested-focus`, `.education-details`,
  `.project-image-placeholder`, `.pill`, `.link-row a`(×2), `.project-detail-summary`,
  `.project-detail-section`, `.project-nav-arrow`(×3), `.project-sidebar-category`,
  `.viewport-progress`(×4).
- Dead TS: the `'project'` member of `CardType` and the entire `ProjectCard` interface are
  unreachable — no card uses `type: 'project'` and `ModalBody` has no branch for it.
- Accessibility: the modal has no `role="dialog"` / `aria-modal`, no focus trap, and does not
  restore focus to the originating tile on close. Accordion headers lack `aria-expanded`.
  `.cert-icon-image` has no `alt`. Every card title is an `<h2>` and the page has no `<h1>`.

---

## 12. Machine-readable tokens

For Claude Design / any generator. **Values are the current live values**, except `--font-sm`
which is `1rem` (its current computed fallback).

```json
{
  "color": {
    "light": {
      "bg": "#eeeeee", "surface": "#ffffff", "surfaceSubtle": "#eef0f5",
      "border": "#d8dce8", "accent": "#ea6508", "accentDim": "rgba(234,101,8,0.10)",
      "textPrimary": "#0d0e12", "textSecondary": "#4a4f63", "textMuted": "#8a8fa8"
    },
    "dark": {
      "bg": "#16161c", "surface": "#23232b", "surfaceSubtle": "#1f1f28",
      "border": "#2a2a36", "accent": "#f97316", "accentDim": "rgba(249,115,22,0.14)",
      "textPrimary": "#f0f1f5", "textSecondary": "#b0b4c8", "textMuted": "#8a8fa8"
    }
  },
  "font": {
    "family": { "light": "Light", "regular": "Regular", "bold": "Bold" },
    "size": {
      "sm": "1rem", "base": "0.95rem", "md": "1.15rem", "lg": "1.4rem", "xl": "1.6rem",
      "cardTitle": "1.9rem", "modalTitle": "2.4rem", "heroTitle": "3.75rem"
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
    "breakpoints": { "lg": "1024px", "md": "900px", "sm": "560px", "xs": "380px" }
  }
}
```

---

## 13. Extending the system

Rules to follow when generating new surfaces so they read as part of this portfolio:

1. **Serif everything.** Never introduce a sans-serif. Large text → `'Light'`, small labels →
   `'Bold'`, body → `'Regular'`.
2. **No borders for separation.** Use `--surface` on `--bg`, or `--surface-subtle` inside
   `--surface`. Reserve `--border` for hairlines, rails, and inactive dots.
3. **Accent is a spice.** Labels, one word in a title row, bullets, dots, active fills. Never a
   large area at full strength — use `--accent-dim` for fills.
4. **Active/selected = fill with `--text-primary`, text `--bg`.** Free theme inversion.
5. **Bottom-align card content.** `justify-content: flex-end` with the icon pinned top-right.
6. **`role • company` title rows** with a `--text-muted` middot are the house text pattern.
7. **14px is one unit.** Padding, gaps, insets. 6px only for the outer bento gap.
8. **One easing curve** — `cubic-bezier(0.4, 0, 0.2, 1)`. Reach for `0.2s` (hover), `0.3s`
   (reveal), `0.58s` (flip).
</content>
