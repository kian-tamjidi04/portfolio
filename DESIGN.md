---
name: Kian Tamjidi — Portfolio
description: A warm-neutral bento grid transitioning from an Apple Garamond serif identity to IBM Plex Sans, with warm-brown ambient card shadows and a single ember-orange accent.
colors:
  accent: "#ea6508"
  accent-text: "#c2540a"
  accent-dim: "rgba(234,101,8,0.10)"
  bg: "#eeeeee"
  surface: "#ffffff"
  surface-subtle: "#eef0f5"
  cert-card-surface: "#fafafa"
  pill-surface: "#fafafa"
  border: "#d8dce8"
  text-primary: "#0d0e12"
  text-secondary: "#4a4f63"
  text-muted: "#64697f"
  pill-text: "#000000"
  card-icon-color: "#613613"
  modal-close-idle-bg: "#e2e2e2"
typography:
  display:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "clamp(2.25rem, 9vw, 56px)"
    fontWeight: 400
    lineHeight: 0.97
    letterSpacing: "normal"
  headline:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "34px"
    fontWeight: 400
    lineHeight: 0.97
    letterSpacing: "normal"
  title:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 400
    lineHeight: 1.3
  body:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 300
    lineHeight: 1.4
  label:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 300
    lineHeight: 0.75
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "12px"
  2xl: "16px"
  pill: "999px"
spacing:
  1: "2px"
  2: "4px"
  3: "6px"
  4: "8px"
  5: "10px"
  6: "12px"
  7: "14px"
  8: "16px"
  9: "18px"
  10: "20px"
  12: "24px"
  14: "30px"
components:
  button-primary:
    backgroundColor: "{colors.text-primary}"
    textColor: "{colors.bg}"
    rounded: "{rounded.xl}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.accent-dim}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "12px 24px"
  tag:
    backgroundColor: "{colors.pill-surface}"
    textColor: "{colors.pill-text}"
    rounded: "{rounded.xl}"
    padding: "10px 12px"
    typography: "{typography.label}"
  tag-primary:
    backgroundColor: "{colors.accent-dim}"
    textColor: "{colors.accent-text}"
    rounded: "{rounded.xl}"
    padding: "10px 12px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xs}"
    padding: "6px 6px 8px 10px"
  modal-close-cta:
    backgroundColor: "{colors.modal-close-idle-bg}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.xl}"
    padding: "8px 14px"
---

# Design System: Kian Tamjidi — Portfolio

## Overview

**Creative North Star: "The Warm Plex Grid"**

A single non-scrolling bento grid where every tile flips in 3D into a modal. The
system is mid-transition: the original identity was Apple Garamond (a display serif
used even at body sizes) over a near-neutral grey-blue palette, with one warm ember
accent used sparingly. That serif identity is being retired card-by-card in favor of
IBM Plex Sans — **the forward direction for all new and touched surfaces** — paired
with warm-brown ambient card shadows and a sharper 4px card/modal radius. Certification
cards were the first fully migrated; card faces and modal headers (`.card-title` /
`.modal-title`) already read in IBM Plex Sans everywhere, and any remaining body copy
still in Apple Garamond is legacy, not a pattern to extend.

Across both eras the same structural habits hold: hierarchy comes from **weight
contrast, not size contrast** (large text set light, small labels set bold/medium);
separation between surfaces comes from elevation, never a border; and the ember-orange
accent is spent on small shapes — dots, bullets, icon fills — almost never as a large
flat area. Layout stays dense (6px outer grid gap, 14px interior rhythm), light-mode
only (dark mode was built once, never wired up, and was deleted rather than finished).

**Key Characteristics:**
- Weight-as-hierarchy: large + light vs. small + bold/medium, not size escalation.
- One ember-orange accent, spent sparingly, never as a large flat fill.
- No borders for separation — surfaces stack via elevation (`--surface` on `--bg`,
  `--surface-subtle` inside `--surface`).
- IBM Plex Sans is the system's forward identity; Apple Garamond is legacy and shrinking.
- Warm-brown ambient shadows (`rgba(97,54,19,…)`), not neutral black — depth reads warm.

## Colors

A near-neutral, cool-grey base (fog, paper, hairline slate) that makes the single warm
ember accent and the warm-brown shadow system feel deliberate rather than incidental.

### Primary
- **Ember Orange** (`#ea6508`): the accent as a *shape* — dots, bullets, icon fills,
  washes. Never carries body text on its own (it fails contrast at text weight).
- **Baked Ember** (`#c2540a`): the text-safe darkened variant of the accent — 4.6:1 on
  `--surface`, meets WCAG AA. Used for `.timeline-company`, `.skill-category-label`,
  `.tag.is-primary`, and anywhere the accent sits on readable text.
- **Ember Wash** (`rgba(234,101,8,0.10)`): a 10% accent tint for hover/active fills —
  the one hover-wash strength used system-wide.

### Neutral
- **Cool Fog** (`#eeeeee`): page background.
- **Paper White** (`#ffffff`): card, modal, and header surface.
- **Warm Off-White** (`#fafafa`): a slightly warmer surface reserved for the v2
  Certifications card and the tag/pill background — distinct from both Paper White and
  Recessed Mist.
- **Recessed Mist** (`#eef0f5`): the recessed-panel background inside a modal (section
  rows, timeline content) — one step darker than the surface it sits on.
- **Hairline Slate** (`#d8dce8`): the only place true borders appear — hairlines,
  timeline rails, inactive dots, scrollbar thumb.
- **Near-Black Ink** (`#0d0e12`): titles, body headings; doubles as a *fill* color in
  the inversion pattern (see Named Rules below).
- **Slate Blue** (`#4a4f63`): body copy, tags.
- **Muted Slate** (`#64697f`): dates, meta text, chevrons — darkened from an earlier
  `#8a8fa8` specifically to clear WCAG AA (4.8:1 on Recessed Mist).
- **True Black** (`#000000`): tag/pill text only.
- **Saddle Brown** (`#613613`): certification icon color and the warm hue the whole
  shadow system is keyed off.
- **Idle Grey** (`#e2e2e2`): the modal close CTA's idle fill.

### Named Rules
**The Inversion Rule.** Active/primary states fill with `--text-primary` and set their
own text to `--bg` — a single theme means no second token pair is needed. Keep doing
this for any new primary/selected state.

**The One Voice Rule.** The ember accent is spent on shapes, not surfaces: dots,
bullets, icon fills, a single word in a title row. It is never a large area at full
strength — use Ember Wash for fills and Baked Ember for text.

## Typography

**Display Font (forward direction):** IBM Plex Sans, sans-serif
**Display Font (legacy, shrinking):** Apple Garamond — three real weights (300/400/700)
plus italics, still present on unmigrated card body copy. Treat as anti-reference for
new work: don't extend its footprint.

**Character:** IBM Plex Sans reads quieter and more structural than the serif it's
replacing — the system's hierarchy trick (large+light vs. small+bold) survives the
migration unchanged, just re-keyed to Plex's 300/400/500 weights instead of Garamond's
300/400/700.

### Hierarchy
- **Display** (400, `clamp(2.25rem, 9vw, 56px)`, line-height 0.97): hero name, fluid.
- **Headline** (400, 34px, line-height 0.97): grid card title and modal title — one
  shared rule, since the modal header reuses the exact card-face type spec.
- **Title** (400, 1.4rem/22.4px, line-height 1.3): row titles, role names, company
  names, project index titles.
- **Body** (300, 1rem/16px–0.95rem/15.2px, line-height 1.4–1.45): body copy, tags,
  bullets, cert takeaways.
- **Label** (300→500 on hover, 14px, line-height 0.75): pills and tags; hover flips the
  one property the generic tag hover doesn't otherwise touch — font-weight, 300→500.

### Named Rules
**The Weight-Not-Size Rule.** Hierarchy comes from font-weight contrast (large set
light, small set bold/medium), not from an aggressive size ladder. The size scale
itself stays a modest, slightly irregular ~1.2 ratio on purpose.

## Layout

A 12-column CSS grid (`.portfolio-grid-surface`), `gap: 6px`, `max-width: 1320px`,
vertically centered in a non-scrolling `100vh` page. Card placement is derived
per-card (`place-${id}`) and re-declared at three viewport breakpoints — `900px`,
`560px`, `380px` — plus two container queries (`@container portfolio-modal`) scoped to
modal width rather than viewport width, for the about layout and skills grid. Modals
are sized per type via `getModalRect()`, capped so none ever exceeds the grid's own
1320px max-width; `projects` and `about` get bespoke bounds, everything else shares one
default. 14px (`--space-7`) is the interior rhythm unit for padding and gaps; 6px is
reserved for the outer grid gap only — that gap staying tighter than the interior
rhythm is a deliberate signature.

## Elevation & Depth

Ambient warmth, structural on demand: cards and pills carry a soft warm-brown glow
(`--shadow-card`, keyed off Saddle Brown, not neutral black) at rest as an identity
signal, and that glow intensifies sharply on hover/focus (`--card-shadow-hover`) as the
system's primary interactivity cue — the accent-wash hover treatment from the legacy
language is being replaced by this shadow-raise wherever a card migrates to v2. There
are no borders used for separation anywhere in this system; depth and grouping are
conveyed entirely through surface elevation and shadow.

### Shadow Vocabulary
- **Card / rest** (`box-shadow: 0 0 16px rgba(97,54,19,0.2)`): default state for any
  card-like surface (portfolio tile, cert card, modal close CTA).
- **Card / hover** (`box-shadow: 0 4px 24px 4px rgba(97,54,19,0.75)`): hover/focus-
  visible state for the same surfaces — the shadow raise *is* the feedback.
- **Panel elevated** (`box-shadow: 0 0 16px 2px rgba(97,54,19,0.5)`): the projects deck
  card, a step between rest and hover intensity.
- **Modal** (`box-shadow: 0 24px 64px rgba(0,0,0,0.18)`): the one neutral-black shadow
  in the system, reserved for the modal sheet itself lifting off the page.

### Named Rules
**The Warm Shadow Rule.** Every card-level shadow is keyed off Saddle Brown
(`rgba(97,54,19,…)`), never neutral black — black is reserved for the single modal
elevation shadow that lifts the whole sheet off the page.

## Shapes

A sharp, consistent radius scale (`4px → 16px`, plus a `999px` pill step) where every
`border-radius` in the system resolves to one named step — nothing floats free as a
literal value. Both shared card-face aliases (`--card-radius`, `--modal-radius`) now
point at the sharpest step (4px) rather than the softer 12–16px the legacy language
used — "the open card uses the same radius as the closed bento card" is the governing
rule, so a flipped modal and its originating tile always match. Certification cards are
a deliberate exception: square corners, no radius token at all, per their source design.
Pills/tags use a 12px rounded rect (not the fully-round 999px pill step, despite the
name) on the v2 surface; the 999px step survives for other rounded-pill uses.

## Components

### Buttons
- **Shape:** 12px rounded rect (`--radius-xl`), weight 700, small text
  (`--text-xs`/15.2px), padding 12px/24px (close CTA: 8px/14px).
- **Primary:** fills `--text-primary`, text `--bg` — the inversion pattern. Hover
  lightens to Ember Wash and flips text back to `--text-primary`.
- **Secondary:** transparent fill, `--text-primary` text — ghost treatment.
- **Modal close CTA:** Idle Grey fill, Slate Blue text; idle state uses the same
  Card/rest shadow as any other card, intensifying to Card/hover on interaction.

### Chips / Tags
- **Style (v2):** 12px rounded rect, Warm Off-White background, True Black text,
  Card/rest shadow intensifying to Card/hover — the same shadow-raise language as the
  bento card itself, not a flat static pill.
- **Primary variant:** Ember Wash background, Baked Ember text.
- **Hero social pills:** same base recipe, each platform keeping its own brand-colored
  glow (GitHub black, LinkedIn blue, email Saddle Brown) instead of the shared warm
  shadow; hover also flips weight 300→500.

### Cards / Containers
- **Corner style:** 4px (`--card-radius`) for the standard bento tile and its opened
  modal face; square corners (no radius) for the v2 Certifications card by design.
- **Background:** Paper White for the standard tile; Warm Off-White for the
  Certifications card; Recessed Mist for panels nested *inside* a modal.
- **Shadow strategy:** see Elevation & Depth — Card/rest at idle, Card/hover on
  hover/focus-visible.
- **Border:** none. Separation is elevation-only.
- **Internal padding:** 14px (`--space-7`) is the workhorse; modal section padding
  matches. Content bottom-aligns (`justify-content: flex-end`) with the preview icon
  pinned top-right.

### Navigation
Vertical timeline nav and the projects deck's horizontal nav share one 36px pill
recipe (`--modal-close-idle-bg` fill). Timeline arrows disable at the first/last entry;
the projects deck's arrows instead wrap, since a deck has no start or end — the one
deliberate divergence between the two.

## Do's and Don'ts

### Do:
- **Do** build new or touched UI in IBM Plex Sans (`--font-card`) at weights
  300/400/500 — this is the system's forward identity.
- **Do** use Card/rest (warm-brown ambient) at idle and Card/hover on
  hover/focus-visible for any card-like surface.
- **Do** fill active/primary UI with `--text-primary` and set its text to `--bg` (the
  Inversion Rule) rather than inventing a second accent-fill treatment.
- **Do** spend the ember accent on shapes — dots, bullets, icon fills, one word in a
  title row — never as a large flat area.
- **Do** bottom-align card content with the preview icon pinned top-right.
- **Do** use `var(--ease-standard)` as the one easing curve; reach for `--dur-fast`
  (hover), `--dur-base` (reveal), `--dur-flip` (the 3D flip).

### Don't:
- **Don't** introduce new Apple Garamond usage. It is the outgoing identity — extend
  `--font-card` (IBM Plex Sans) into any card or component still on the legacy family
  instead of adding more serif.
- **Don't** add borders for visual separation. Reach for `--surface`-on-`--bg` or
  `--surface-subtle`-inside-`--surface` instead; `--border` is reserved for hairlines,
  rails, and inactive dots only.
- **Don't** use a neutral-black shadow on a card-level surface — the warm-brown shadow
  keyed off Saddle Brown is the system's depth signal; neutral black is reserved for
  the single modal-lift shadow.
- **Don't** size a modal wider than the grid's own 1320px max-width — a flipped card
  never exceeds the grid it flew out of.
