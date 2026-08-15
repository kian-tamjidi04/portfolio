---
name: tag-milestone
description: >
  Tags a stable checkpoint on main during the portfolio's UX/UI overhaul. Use this
  whenever a redesign phase has just been merged to main and is presentable — the kind
  of point you'd want to roll back to or reference in a before/after case study. Trigger
  on phrases like "tag this", "tag a milestone", "checkpoint this", "mark this as a
  release", or right after merging a PR that represents a complete visual/UX phase (not
  every small commit). The baseline pre-overhaul state is already tagged v1.0.0 — never
  move or recreate that tag.
---

# Tag a milestone

## Why this exists

The portfolio is mid UX/UI overhaul. Tags are the mechanism for two things at once:
a rollback point if a phase turns out worse, and a chronological record of the
redesign for a before/after case study. See the "Versioning the overhaul" section in
the repo root `CLAUDE.md` for the full workflow this fits into.

## When to run this

After merging a PR into `main` that represents a complete, presentable phase of the
redesign (e.g. a typography pass, a layout rework, a motion overhaul) — not after every
commit. If you're not sure whether a merge counts as milestone-worthy, ask.

## Steps

1. **Make sure you're tagging the right commit.** `main` should be up to date and
   `git status` clean:
   ```bash
   git checkout main && git pull
   git status
   ```

2. **Make sure `docs/` matches the commit you're about to tag.** The tag should
   represent what's actually live, not just what's in `src/`. Compare the two:
   ```bash
   git log -1 --format=%H -- docs/
   git log -1 --format=%H -- src/
   ```
   If `src/` is newer, the `build-and-sync-docs` skill wasn't run before merging —
   run it, commit `docs/`, and tag that commit instead.

3. **Pick the tag name.** List existing tags first so the next one is obvious:
   ```bash
   git tag -l -n9 --sort=-v:refname
   ```
   - Bump the minor version for a new visible phase: `v1.1.0`, `v1.2.0`, …
   - Bump the patch version for a small fix within an already-tagged phase: `v1.1.1`.
   - Optionally suffix a short slug for readability in the case study, e.g.
     `v1.1.0-typography-pass`. Keep it short and kebab-case.
   - Never reuse or move `v1.0.0` — it's the fixed pre-overhaul baseline.

4. **Create an annotated tag** (not lightweight — the message is what makes the tag
   useful for the case study later):
   ```bash
   git tag -a vX.Y.Z -m "Short summary of the phase

   One or two sentences on what changed and why, written for someone skimming
   the case study later, not for someone reading the diff."
   ```

5. **Push it:**
   ```bash
   git push origin vX.Y.Z
   ```

6. **Confirm:**
   ```bash
   git tag -l -n9 --sort=-v:refname
   ```

## Notes

- Tags are additive and cheap — prefer tagging a real milestone over skipping it because
  it feels minor. A sparse tag history is less useful for both rollback and the case
  study than a slightly noisy one.
- Do not delete or force-move a pushed tag without explicit user confirmation; tags are
  the record this whole workflow depends on.
