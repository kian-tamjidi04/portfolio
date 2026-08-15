---
name: rollback-release
description: >
  Rolls the portfolio back to a previously tagged milestone (see tag-milestone) when a
  UX/UI overhaul phase needs to be undone. Use when the user says "roll back", "revert
  to the last stable version", "undo this phase", "go back to vX.Y.Z", or when a merged
  redesign phase turns out broken or worse than what it replaced. This is a
  high-blast-radius action on shared history (main + the live GitHub Pages site) —
  always confirm the target tag and the rollback method with the user before pushing
  anything.
---

# Roll back to a tagged milestone

## Why this exists

Tags created by `tag-milestone` (and the `v1.0.0` pre-overhaul baseline) are the known-
good checkpoints for this repo. This skill is the safe, forward-only way back to one of
them — GitHub Pages serves the live site straight from the committed `docs/` directory,
so a rollback on `main` is a rollback of the live site, not just the code.

## Step 1 — Identify the target tag

```bash
git tag -l -n9 --sort=-v:refname
```

Confirm with the user which tag they mean if it's at all ambiguous. Do not guess.

## Step 2 — Decide the rollback method

Default to the **revert commit** method. Only use the hard-reset method if the user
explicitly asks for it.

### Revert commit (default — non-destructive, preserves history)

Makes `main`'s working tree match the tag exactly, as a new commit on top. Nothing is
rewritten or force-pushed, so it's safe even if others have pulled `main`.

```bash
git checkout main && git pull
git status   # must be clean before continuing

# Replace the working tree with the tagged state
git checkout vX.Y.Z -- .
git status --short   # sanity check the diff looks like "back to vX.Y.Z", not partial

git commit -m "Roll back to vX.Y.Z

Reverts main to the vX.Y.Z checkpoint. <one line on why>"
git push origin main
```

Because `docs/` is part of every tagged commit, this also restores the live site —
there's no separate `build-and-sync-docs` step needed here.

### Hard reset (only with explicit user confirmation — rewrites history)

Use only if the user explicitly wants history itself rewound, not just the content
reverted (e.g. cleaning up a burst of bad commits before anyone else has based work on
them). This requires a force-push to `main`, which can overwrite others' work — never
run it without the user confirming they understand that tradeoff, and never force-push
if anyone else may have pulled since the commits being discarded.

```bash
git checkout main && git pull
git reset --hard vX.Y.Z
git push --force-with-lease origin main
```

## Step 3 — Verify

```bash
git log -1 --format=%H -- docs/
git log -1 --format=%H -- src/
```
Both should point at the same commit (the new rollback commit), confirming the live
site and the source are in sync.

## Notes

- Inspecting a tag without touching `main` is always safe and doesn't need
  confirmation: `git diff vX.Y.Z main` or checking out the tag in a scratch worktree.
- Never delete or move the `v1.0.0` baseline tag as part of a rollback.
