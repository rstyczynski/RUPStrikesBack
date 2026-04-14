# Sprint Definition

A sprint entry in `PLAN.md` describes a unit of work the team commits to delivering. It must state what will be tested and what must not regress — so the implementor knows the quality bar before writing a line of code.

---

## Format

```markdown
## Sprint <N> - <Title>

Status: Planned | Progress | Done
Mode: managed | YOLO
Test: <smoke | unit | integration | none>
Regression: <smoke | unit | integration | none>

<Optional: 1-2 sentences of context if the sprint is non-obvious.>

Backlog Items:

* <ID>. <Title>
```

---

## Fields

| Field | Required | Values | Description |
|-------|----------|--------|-------------|
| Status | Yes | `Planned`, `Progress`, `Done` | Current state of the sprint |
| Mode | Yes | `managed`, `YOLO` | `managed` = full RUP gates; `YOLO` = autonomous, minimal ceremony |
| Test | Yes | Comma-separated list | Which test levels to run for new code |
| Regression | Yes | Comma-separated list | Which existing tests to re-run after new-code gates pass |

### Test Parameter Values

| Value | Meaning |
|-------|---------|
| `smoke` | Quick critical checks in `tests/smoke/`. Fast gate to determine "is it testable?" |
| `unit` | Unit tests in `tests/unit/`. Tests individual functions. |
| `integration` | Integration tests in `tests/integration/`. End-to-end scenarios. |
| `none` | No new tests. For documentation-only or review-only sprints. |

**Defaults if omitted:** `Test: unit, integration`

### Regression Parameter Values

| Value | Meaning |
|-------|---------|
| `smoke` | Re-run smoke tests only. Fastest regression. |
| `unit` | Re-run all unit tests (old + new). Good balance. |
| `integration` | Re-run all integration tests. Slowest but most thorough. |
| `none` | Skip regression. Only for experimental/throwaway sprints. |

**Defaults if omitted:** `Regression: unit, integration`

### Optional: Regression Scope

Limit regression to specific component:

```markdown
Regression scope: emit
```

Available scopes map to `tests/manifests/component_<scope>.manifest`.

---

## Constraints

| Rule | Rationale |
|------|-----------|
| `Test` and `Regression` are required | They define exit criteria — no ambiguity |
| No design in sprint entry | Design belongs in elaboration document |
| No sub-tasks | Sub-tasks emerge during phases |
| No implementation notes | Implementation belongs in construction |
| One coherent deliverable | Bundle items only when tightly coupled |

---

## Status Transitions

```
Planned → Progress → Done
```

| Transition | Trigger |
|------------|---------|
| `Planned → Progress` | When `/rup-cycle` or Phase 1 starts |
| `Progress → Done` | When all quality gates pass and Phase 5 completes |
| `Progress → Failed` | When retries exhausted and gates fail |

---

## Examples

### Good Example

```markdown
## Sprint 8 - curl backend for emit.sh

Status: Planned
Mode: YOLO
Test: unit
Regression: unit

Backlog Items:

* SLI-11. Alternative HTTP backend for emit.sh
```

**Why it's good:**
- Clear title
- All required fields present
- Test and Regression specify quality bar
- Single focused backlog item

### Good Example — Full Suite

```markdown
## Sprint 7 - Critical security fix

Status: Progress
Mode: managed
Test: smoke, unit, integration
Regression: smoke, unit, integration

Security vulnerability requires thorough testing at all levels.

Backlog Items:

* SEC-42. Fix authentication bypass in API gateway
```

**Why it's good:**
- Context explains why full testing
- Mode is managed (human oversight for security)
- Maximum test coverage appropriate for risk

### Good Example — Documentation Only

```markdown
## Sprint 9 - API documentation update

Status: Planned
Mode: YOLO
Test: none
Regression: smoke

Backlog Items:

* DOC-15. Update API reference for v2 endpoints
```

**Why it's good:**
- `Test: none` is appropriate — no code changes
- `Regression: smoke` provides quick sanity check
- YOLO mode for documentation work

### Bad Example — Missing Test and Regression

```markdown
## Sprint 8 - curl backend for emit.sh

Status: Planned
Mode: YOLO

Backlog Items:

* SLI-11. Split emit.sh into emit_oci.sh and emit_curl.sh
```

**Why it's bad:**
- Missing `Test:` field — quality bar undefined
- Missing `Regression:` field — regression scope undefined
- Implementor doesn't know when they're done

---

## Validation Checklist

Before adding to PLAN.md, verify:

- [ ] Sprint number is sequential (no gaps)
- [ ] Status is one of: Planned, Progress, Done
- [ ] Mode is one of: managed, YOLO
- [ ] Test field is present with valid values
- [ ] Regression field is present with valid values
- [ ] All backlog item IDs exist in BACKLOG.md
- [ ] No item appears in multiple active sprints
- [ ] Title is concise and descriptive
