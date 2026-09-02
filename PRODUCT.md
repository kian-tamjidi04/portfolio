# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers screening for a specific role, and general
networking/curious visitors browsing background and work. No specific
freelance-client or engineering-peer-review audience — the site is a personal
career/portfolio site, not a product marketing page.

## Product Purpose

A single-viewport personal portfolio for Kian Tamjidi: a bento grid of tiles
(hero, about, location, experience, education, certifications, skills,
projects, vision) that each flip into a modal with more detail. Success means
a visitor quickly forms an accurate, credible impression of his experience,
skills, and projects — enough to decide to reach out or move him forward in a
hiring process.

## Positioning

The differentiator is the hybrid identity: he ships product-quality code AND
designs it himself. The site should read as evidence of that hybrid — not
just claim it in copy, but demonstrate it through the quality of its own
UI/UX craft, since the site itself is a work sample.

## Operating Context

Deployed as a static site on GitHub Pages, served from the committed `docs/`
directory (see project CLAUDE.md for the build/publish mechanics). Single
light theme, no auth, no backend.

## Capabilities and Constraints

- Content lives entirely in `src/content.ts` as typed data (`PortfolioCard`
  discriminated union) — a design task should treat this file as the complete
  and accurate record of real experience, projects, education, and
  certifications; nothing here should be embellished or fabricated.
- No test suite; `npm run build` (tsc + vite build) and `npm run lint` are the
  only automated checks.
- Site is a single page — no routing, no separate pages per section.

## Evidence on Hand

Real, current employment history, education, certifications, and project
case studies as authored in `src/content.ts`. Company/brand SVGs for past
employers live in `public/`. No testimonials, press, or third-party
benchmarks exist or should be invented.

## Product Principles

1. The site is itself a work sample — its own craft is part of the pitch, not
   just decoration around the content.
2. Content truth lives in `content.ts`; design work must never alter or
   embellish factual claims (roles, dates, project outcomes) without the
   user's explicit say-so.
3. Optimize for a visitor forming an accurate impression fast — this is a
   screening artifact, not a persuasion funnel with a single conversion goal.
4. Demonstrate the hybrid engineer/designer identity through execution
   quality (motion, layout, typography, interaction detail), not through
   copy alone.
