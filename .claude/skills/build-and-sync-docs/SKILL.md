---
name: build-and-sync-docs
description: >
  Builds the site and syncs the production build into docs/ before any PR is opened
  or commit is finalized in this portfolio repo. GitHub Pages serves the site from
  the committed docs/ directory, NOT from dist/ — if docs/ isn't refreshed and
  committed, code changes never actually go live even after merging, and the GitHub
  Pages pipeline can end up out of sync with main. Use this skill whenever: opening,
  creating, or preparing a pull request in this repo; finishing a task that touched
  src/, content.ts, index.css, public/, or any other source file; or the user asks to
  "ship", "deploy", "publish", or "push" a change. Also use it any time you're about
  to commit changes and docs/ hasn't been refreshed since the last source edit — check
  even if the user didn't explicitly mention building or deploying, since forgetting
  this step is the most common way this repo's Pages deployment breaks.
---

# Build and sync docs/

## Why this exists

`vite.config.ts` builds to `dist/`, but GitHub Pages is configured to serve from the
committed `docs/` directory (see repo root `CLAUDE.md`). `dist/` is untracked build
output — committing it does nothing for deployment. If `docs/` isn't refreshed and
committed alongside a source change, the live site silently stays on the old version
even though main looks up to date. Recent history shows this was missed repeatedly
after Claude-authored changes, which is why this step needs to be explicit and
run every time, not left to memory.

## When to run this

Run this before opening a PR, and before any commit that is meant to be the final
step of a task that touched site source (`src/`, `index.html`, `public/`, etc.).
If you're unsure whether docs/ is stale, check `git log -1 --format=%H -- docs/` vs
`git log -1 --format=%H -- src/` — if src/ has a newer commit than docs/, docs/ is stale.

Skip it only for changes that can't affect the built output (e.g. editing `.md` docs,
CI config, or files outside the Vite build).

## Steps

1. **Build.** From the repo root:
   ```bash
   npm run build
   ```
   This runs `tsc -b && vite build`. If it errors, stop and fix the underlying issue —
   do not sync a stale or partial `dist/` into `docs/`, and do not bypass the type
   check.

2. **Sync `dist/` into `docs/`, mirroring deletions.** Files removed from the build
   (renamed hashed assets, deleted icons, etc.) must also disappear from `docs/`, or
   stale unreferenced files accumulate. Preserve any files in `docs/` that aren't part
   of the Vite build output, such as `CNAME` or `.nojekyll`, by excluding them:
   ```bash
   rsync -av --delete --exclude='CNAME' --exclude='.nojekyll' dist/ docs/
   ```
   Check `ls docs/` first if you're unsure whether either file is present — only
   exclude what actually exists; excluding a nonexistent file is harmless.

3. **Stage `docs/`.**
   ```bash
   git add docs/
   ```
   Verify with `git status --short docs/` that the diff looks like a normal build
   (asset hash renames, index.html diff) and not something unexpected like an empty
   directory or a huge unrelated deletion.

4. **Do not stage or commit `dist/`.** It's build output and stays untracked (per this
   repo's `CLAUDE.md`). If `git status` shows `dist/` as untracked, that's correct —
   leave it alone. If it somehow shows as staged, unstage it with `git reset dist/`.

5. Commit `docs/` together with (or immediately after) the source change, following
   this repo's existing convention of a "new build" commit message when docs/ is the
   only thing changing, or folding it into the feature commit if source and docs/
   change together.
