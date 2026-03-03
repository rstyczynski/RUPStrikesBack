# RUP Bug Fix Cycle

A streamlined correction cycle for sprints that consist entirely of bug fixes — no new
features. Replaces the full Contracting → Inception → Elaboration → Construction →
Documentation flow with a tighter Identify → Fix → Verify loop.

## When to Use

Use this cycle (instead of `rup-cycle.md`) when:

- The Sprint's PLAN.md entry contains a `Bug fixes:` section with only `GD-N-M` items
- No new Backlog Items are being introduced — only correcting identified defects
- The sprint was previously completed (Status: Done or tested) and bugs were found
  post-delivery

Indicator in PLAN.md:
```
Status: Progress
Bug fixes:
* GD-N-1. ...
* GD-N-2. ...
```

## Status Labels for Bug Fix Sprints

| Label | Meaning |
|-------|---------|
| `Progress` | Bug fixes are being worked on |
| `Fixed` | All listed bugs are corrected and verified |

> Note: `Done` marks a feature sprint as delivered; `Fixed` marks a bug-fix sprint as
> resolved. These are intentionally distinct labels.

## Progress Document

Create `progress/sprint_N/sprint_N_bugfixes.md` (not `sprint_N_implementation.md`) to
document the correction cycle. Template:

```markdown
# Sprint N — Bug Fixes

## Status: Fixed

## GD-N-M — <Short Title>

**Root cause:** <one sentence>

**Fix:** <what was changed>

**Files:** <changed files>

**Status:** Fixed

---

## Fix Summary

| Bug | Description | Files Changed | Status |
|-----|-------------|---------------|--------|
| GD-N-M | ... | ... | Fixed |
```

## Phase 1: Identify

For each bug item in PLAN.md:

1. Read the bug description
2. Locate the affected file(s) and reproduce the root cause by reading the code
3. Write a one-sentence root-cause statement in `sprint_N_bugfixes.md`
4. Confirm the fix approach is minimal (no refactoring beyond what is strictly needed)

**Decision point (managed mode):** If root cause is ambiguous, stop and ask before fixing.

## Phase 2: Fix

Apply the minimal code change that addresses the root cause:

- Edit only the files identified in Phase 1
- Do not refactor surrounding code
- Do not add features beyond the bug description
- If fixing one bug reveals another, add it to `sprint_N_bugfixes.md` as an additional
  entry (not to PLAN.md — PLAN.md is updated only at the end)

Document each fix in `sprint_N_bugfixes.md` with root cause, change description, and
files modified.

## Phase 3: Verify

For each fix:

1. Run the relevant validation command (schema validate, unit test, or manual check)
2. Record the result (PASS / FAIL) in `sprint_N_bugfixes.md`
3. If a fix introduces a regression, revert and reassess

Minimum verification per bug type:

| Bug type | Verification |
|----------|-------------|
| Data consistency (JSON) | `bash validate.sh <schema> <data>` |
| CLI DAL behavior | `TEST_DATA_DIR=tf_manager bash cli_client/test/run_tests.sh` |
| README / docs | Visual review of the changed section |
| Script logic | Offline smoke test with `TEST_DATA_DIR` and explicit overrides |

## Phase 4: Close

1. Update `sprint_N_bugfixes.md` Fix Summary table — all rows show `Fixed`
2. Update `PLAN.md`: change `Status: Progress` → `Status: Fixed`
3. Commit with message: `fix: (sprint-N) <brief summary of all bugs fixed>`

## Orchestration Notes

- No design phase needed — bugs by definition are deviations from an already-approved
  design
- No Elaboration wait — fixes are applied immediately after root cause is confirmed
- If a bug turns out to require a design change (scope creep), promote it to a new
  Backlog Item and a new Sprint instead of expanding this cycle
- Additional bugs discovered during fixing are documented here but do not change
  `PLAN.md` mid-cycle; `PLAN.md` is updated only once at the end (Phase 4)

## Example PLAN.md Entry (After Close)

```markdown
## Sprint 6 - Synthetic data sets review

Status: Fixed
Mode: managed

Backlog Items:

* GD-6. Synthetic data sets review

Bug fixes:

* GD-6-1. OCID unique-ID length
* GD-6-2. Private CIDR consistency
* GD-6-3. Realm / region consistency
* GD-6-4. README Quick Start gaps
* GD-6-5. demo_mapping.sh bin/ and auto-discovery
* GD-6-6. Bucket injection via tenancies_v1.demo.json
```
