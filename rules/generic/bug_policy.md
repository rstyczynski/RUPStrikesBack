# Bug Handling Policy

Lightweight policy for handling bugs discovered during sprints.

---

## Default Rule

Bugs discovered during a sprint are handled as part of the **current backlog item** (fold-in fix), unless they expand scope (see Promotion Criteria below).

---

## Where to Register a Bug

**Primary location:** Register bugs under the affected backlog item in:

```
progress/sprint_N/sprint_N_bugs.md
```

**Secondary locations** (only when needed):

| Location | When to Use |
|----------|-------------|
| `sprint_N_setup.md` (`## Analysis`) | Bug changes feasibility/compatibility assumptions |
| `sprint_N_design.md` | Fix materially changes architecture |
| `sprint_N_implementation.md` | Brief pointer to bugs.md (avoid duplicating) |

---

## Bug Entry Template

Register under the affected backlog item section:

```markdown
## BUG-<N>: <Short title>

**Item:** <PBI-ID>
**Severity:** low | medium | high | critical
**Status:** open | fixed | promoted

- **Symptom**: exact error + where observed (command/gate/log path)
- **Root cause**: minimal causal explanation
- **Fix**: what changed (file/function-level)
- **Verification**: which Quality Gate/log proves resolution
```

---

## Severity Levels

| Level | Response | Example |
|-------|----------|---------|
| Critical | Block sprint, fix immediately | Data loss, security hole |
| High | Fix before sprint close | Core feature broken |
| Medium | Fix if time permits | Edge case failure |
| Low | Can defer to next sprint | Cosmetic, minor UX |

---

## Bugs Found During Quality Gates (Phase 4)

Expected loop — this is normal:

```
Gate Fails → Record Bug → Fix Code → Re-run Gate → Pass
     ↑                                      │
     └──────────────────────────────────────┘
```

**Steps:**

1. Record bug in `sprint_N_bugs.md` using template above
2. Fix the code (Construction loop)
3. Re-run the **failing gate** (and downstream gates if required)
4. Log new gate run in `sprint_N_tests.md` under `## Artifacts`

---

## Promotion Criteria

Create a **new backlog item** in `BACKLOG.md` when ANY of these is true:

| Criterion | Description | Example |
|-----------|-------------|---------|
| Scope expansion | Fix requires work beyond current item's requirement | Bug fix needs new API endpoint |
| Cross-cutting impact | Fix touches multiple backlog items/areas | Shared utility function broken |
| Defer decision | Bug cannot be resolved in-sprint | Needs external dependency update |

**When promoting:**

1. Create new item in `BACKLOG.md` following backlog item format
2. Update `PROGRESS_BOARD.md` with new item
3. Mark bug status as `promoted` with link to new item
4. Continue current sprint without the promoted fix

---

## Fold-In vs Promote Decision Tree

```
Bug discovered
    │
    ▼
Does fix exceed current item's scope?
    │
    ├── YES → Does it touch multiple items/areas?
    │           │
    │           ├── YES → PROMOTE to new backlog item
    │           │
    │           └── NO → Can it be fixed in-sprint?
    │                     │
    │                     ├── YES → PROMOTE (scope expansion)
    │                     │
    │                     └── NO → PROMOTE (defer)
    │
    └── NO → FOLD-IN (fix as part of current item)
```

---

## Wrap-up Documentation (Phase 5)

In Phase 5:

1. Mention bug + fix briefly in sprint's `README.md` "Recent updates" section
2. Keep detailed narrative in sprint artifacts, not README
3. Ensure all bugs in `sprint_N_bugs.md` have status `fixed` or `promoted`

---

## Example: Fold-In Bug

```markdown
## BUG-1: JSON escaping fails for nested objects

**Item:** SLI-11
**Severity:** high
**Status:** fixed

- **Symptom**: `test_emit.sh:test_nested_json` fails with "invalid JSON at line 1"
- **Root cause**: `sli_escape_json()` doesn't recurse into nested objects
- **Fix**: Added recursive call in emit.sh:45-52
- **Verification**: Gate A2 Unit pass — test_run_A2_unit_20240115_143045.log
```

**Why fold-in:** Fix is within SLI-11 scope (emit functionality), single file change.

---

## Example: Promoted Bug

```markdown
## BUG-2: OCI CLI version incompatibility

**Item:** SLI-11
**Severity:** high
**Status:** promoted → SLI-15

- **Symptom**: `test_oci_push` fails on OCI CLI 3.x with "unknown flag --raw-output"
- **Root cause**: OCI CLI 3.x changed JSON output flag from `--raw-output` to `--raw`
- **Fix**: Requires version detection and conditional flag usage across all OCI scripts
- **Verification**: Deferred to SLI-15

**Promotion reason:** Cross-cutting — affects multiple scripts beyond emit.sh
```

**New backlog item created:**

```markdown
### SLI-15. OCI CLI 3.x compatibility

Several scripts use OCI CLI flags that changed in version 3.x. Detect CLI version and use appropriate flags for backward compatibility.

Test: All OCI operations pass on both CLI 2.x and 3.x.
```
