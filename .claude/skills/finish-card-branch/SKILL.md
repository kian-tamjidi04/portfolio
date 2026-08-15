---
name: finish-card-branch
description: >
  Opens a pull request merging a finished card/feature branch (created by
  start-card-branch) back into the active bento-card redesign phase branch, and
  later — once the user confirms it's merged — deletes the card branch locally
  and remotely. Use when the user says "this card is done", "open a PR for
  this", "ship this card", "merge this into the redesign branch", "wrap up this
  branch", or once a merge is confirmed, "clean up this branch"/"delete the
  branch now it's merged".
---

# Finish a card branch

## Why this exists

Card branches (see [[start-card-branch]]) are meant to be short-lived: opened,
reviewed as a PR into the redesign phase branch, merged, then deleted — so the
phase branch's branch list never accumulates stale card branches. This skill is
the two-part back half of that lifecycle: **open the PR**, then later **clean up**
once the user says it's merged. Never merge the PR yourself unless the user
explicitly asks you to — merging is "at their discretion and guidance".

## Part 1 — Open the PR

1. **Find the target branch** (the redesign phase branch this card branch came
   from):
   ```bash
   cat .claude/redesign-phase-branch
   ```
   If the file is missing or looks stale, ask the user which branch this should
   merge into rather than guessing.

2. **Confirm you're on the card branch**, work is committed, and the tree is
   clean:
   ```bash
   git branch --show-current
   git status
   ```

3. **Sync `docs/` if this card touched site source.** Run the
   `build-and-sync-docs` skill (it already knows when it's safe to skip — e.g.
   docs-only or config-only changes).

4. **Push the branch:**
   ```bash
   git push -u origin <card-branch>
   ```

5. **Draft the PR description.** Use the `github-pr-description` (or
   `pr-description`) skill to write it from the branch's actual commits since it
   diverged from the phase branch:
   ```bash
   git log <phase-branch>..HEAD
   git diff <phase-branch>...HEAD
   ```

6. **Confirm title and body with the user**, then open the PR against the phase
   branch — **not `main`**:
   ```bash
   gh pr create --base <phase-branch> --head <card-branch> --title "..." --body "..."
   ```

7. Report the PR URL back to the user and stop. Merging is theirs to do (on
   GitHub, or by asking you explicitly) — do not run `gh pr merge` unprompted.

## Part 2 — Clean up after merge

Only run this once the user says the PR is merged (or if asked to check
first, in which case verify — don't just trust an assumption):

```bash
gh pr view <card-branch> --json state,mergedAt
```

If `state` isn't `MERGED`, stop and tell the user — don't delete an unmerged
branch's work.

Once confirmed merged:

1. **Switch back to the phase branch and update it:**
   ```bash
   git checkout <phase-branch>
   git pull
   ```

2. **Delete the card branch locally.** Use `-d` (safe delete — refuses if
   unmerged) rather than `-D`:
   ```bash
   git branch -d card/<slug>
   ```

3. **Delete the remote branch, if it still exists** (GitHub's merge UI often
   already deletes it — check first so this doesn't error on a branch that's
   already gone):
   ```bash
   git ls-remote --heads origin card/<slug>
   # only if that returned a match:
   git push origin --delete card/<slug>
   ```

## Notes

- The phase branch itself (`bento-card-redesign` or whatever succeeds it) is
  never deleted by this skill — only the card branches that merge into it. The
  phase branch's own PR-into-`main` lifecycle is a separate, larger-scale event
  covered by the "Versioning the overhaul" section of the repo root `CLAUDE.md`.
- If `.claude/redesign-phase-branch` doesn't exist yet, this workflow hasn't
  been started with `start-card-branch` — don't invent a target branch; ask.
