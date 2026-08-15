---
name: start-card-branch
description: >
  Creates a new branch for work on a single card or feature within the active
  bento-card redesign phase, branching off the current redesign phase branch
  (e.g. bento-card-redesign) rather than main. Use when the user says "let's
  start on the X card", "new branch for Y", "start work on Z", "create a card
  branch", or otherwise signals they're beginning a scoped, mergeable chunk of
  work within the current redesign phase.
---

# Start a card branch

## Why this exists

The redesign is done as one long-lived phase branch (e.g. `bento-card-redesign`)
PR'd into `main` when the whole phase is presentable (see "Versioning the overhaul"
in the repo root `CLAUDE.md`). Within that phase, individual cards/features get
their own short-lived branch off the phase branch, PR'd back into it, so each card
lands as a reviewable, revertible unit instead of one giant phase-long diff. See
[[finish-card-branch]] for the other half of this workflow.

## Steps

1. **Confirm the phase branch.** This is normally whatever branch you're currently
   on — check:
   ```bash
   git branch --show-current
   ```
   If the current branch is itself a `card/*` branch (i.e. you're already inside
   a card branch), stop and ask the user which phase branch this new branch
   should come off — don't stack card branches on top of card branches.

2. **Make sure the tree is clean and the phase branch is current:**
   ```bash
   git status
   git pull
   ```
   If `git status` isn't clean, ask the user whether to commit, stash, or abandon
   before branching.

3. **Record the phase branch** so `finish-card-branch` can find it later without
   guessing, even in a future session:
   ```bash
   mkdir -p .claude
   echo "<phase-branch-name>" > .claude/redesign-phase-branch
   ```
   If this file's content is already correct, skip the write. If it changes (i.e.
   a new phase has started since it was last written), stage and commit it by
   itself with a short message like `Track bento-card-redesign as the active
   redesign phase branch` before continuing — don't let it ride silently inside
   an unrelated card's diff.

4. **Pick the branch name.** Ask the user for a short kebab-case slug for the
   card/feature if they haven't given one (e.g. `hero`, `projects-modal`,
   `skills-tags`). The branch is named `card/<slug>`.

5. **Create and switch to it:**
   ```bash
   git checkout -b card/<slug>
   ```

6. **Push it so it's backed up remotely** (ask first — this is a real remote
   action, just a low-risk one since it's a brand-new branch nothing depends on):
   ```bash
   git push -u origin card/<slug>
   ```

## Notes

- Never branch card branches off `main` — always off the current redesign phase
  branch, so the card PR's diff is scoped to just that card's work.
- If the user wants to work on more than one card at once, each gets its own
  `card/<slug>` branch off the same phase branch — don't nest them.
