# Test Procedures

Combined procedures for Test Architect (Phase 2) and Test Executor (Phase 4).

---

## Part 1: Test Architect Procedure

**When:** During Phase 2 (Design), after writing the design document.
**Input:** Design document with `### Testing Strategy` section, `Test:` parameter from PLAN.md.
**Output:** Test specifications embedded in design.md, test skeletons in `tests/`, `new_tests.manifest`.

### Step 1: Detect Test Scope

Read the `Test:` field from PLAN.md (or Phase 0 banner):

| Test: Value | Action |
|-------------|--------|
| `smoke` | Create smoke test specs and skeletons in `tests/smoke/` |
| `unit` | Create unit test specs and skeletons in `tests/unit/` |
| `integration` | Create integration test specs and skeletons in `tests/integration/` |
| `none` | Note "no new tests; regression only" — skip to Step 5 |

### Step 2: Write Test Specifications

Append `## Test Specification` section to `sprint_N_design.md`:

```markdown
## Test Specification

Sprint Test Configuration:
- Test: [value from PLAN.md]
- Mode: [value from PLAN.md]

### Smoke Tests (if applicable)

#### SM-1: [Critical Functionality Check]
- **What it verifies:** [most important behavior]
- **Pass criteria:** [expected result]
- **Why smoke:** [why critical for fast gate]
- **Target file:** tests/smoke/test_[name].sh

### Unit Tests (if applicable)

#### UT-1: [Function Under Test]
- **Input:** [defined input]
- **Expected Output:** [exact expected output]
- **Edge Cases:** [boundary conditions]
- **Isolation:** [mocks/stubs needed]
- **Target file:** tests/unit/test_[component].sh

### Integration Tests (if applicable)

#### IT-1: [End-to-End Scenario]
- **Preconditions:** [infrastructure, secrets, tools]
- **Steps:** [ordered sequence]
- **Expected Outcome:** [observable result]
- **Verification:** [how to assert]
- **Target file:** tests/integration/test_[domain].sh

### Traceability

| Backlog Item | Smoke | Unit Tests | Integration Tests |
|--------------|-------|------------|-------------------|
| PBI-N | SM-1 | UT-1, UT-2 | IT-1 |
```

### Step 3: Create Test Skeletons

For each test case, append to the appropriate file in `tests/`:

**Principles:**
- One file per component/domain, NOT per sprint
- New test cases are appended as functions to existing files
- Use `# TODO: implement` markers where code-under-test will be called
- Skeletons must be runnable — they fail (red) before implementation

**Skeleton template:**

```bash
test_UT1_function_name() {
    echo "=== UT-1: [Function Under Test] ==="

    # Setup
    local input="test input"
    local expected="expected output"

    # Execute
    # TODO: implement — call the function under test
    local actual=""

    # Assert
    if [[ "$actual" == "$expected" ]]; then
        echo "PASS: UT-1"
        return 0
    else
        echo "FAIL: UT-1 — expected '$expected', got '$actual'"
        return 1
    fi
}
```

### Step 4: Write New-Tests Manifest

Create `progress/sprint_N/new_tests.manifest`:

```text
# Sprint N new tests — used by tests/run.sh --new-only

# Smoke tests
smoke:test_critical.sh

# Unit tests (specific functions)
unit:test_emit.sh:test_UT1_function_name
unit:test_emit.sh:test_UT2_edge_cases

# Integration tests (specific functions)
integration:test_sli.sh:test_IT1_full_pipeline
```

Format: `suite:script[:function]`
- If no function specified, entire script is new
- Used by `--new-only` flag to run only sprint's new tests

### Step 5: Register in Component Manifest

Add new test entries to appropriate component manifest in `tests/manifests/`:

```text
# tests/manifests/component_emit.manifest
unit:test_emit.sh
integration:test_sli.sh
```

### Step 6: Verify Skeletons Run

```bash
tests/run.sh --unit    # Should report N failures, 0 passes for new tests
tests/run.sh --smoke   # Should pass (smoke tests may just check preconditions)
```

### Step 7: Update PROGRESS_BOARD.md

Set Backlog Item status to `test_specified`.

---

## Part 2: Test Executor Procedure

**When:** Phase 4 (Quality Gates), after construction is complete.
**Input:** Implementation code, test skeletons filled, `Test:` and `Regression:` parameters.
**Output:** Test logs, `sprint_N_tests.md`, PROGRESS_BOARD updates.

### Gate Execution Order

```
Phase A: New-Code Gates (per Test: parameter)
    A1 Smoke → A2 Unit → A3 Integration

Phase B: Regression Gates (per Regression: parameter, after Phase A passes)
    B1 Smoke → B2 Unit → B3 Integration
```

Each gate must pass before proceeding to the next.

### Mandatory Log Artifacts

**Every gate execution MUST produce a timestamped log file.**

```bash
TS="$(date -u '+%Y%m%d_%H%M%S')"
LOG="progress/sprint_N/test_run_<gate>_${TS}.log"
tests/run.sh --<level> [flags] 2>&1 | tee "$LOG"
echo "Test log: $LOG"
```

Gate names: `A1_smoke`, `A2_unit`, `A3_integration`, `B1_smoke`, `B2_unit`, `B3_integration`

### Phase A: New-Code Gates

Run only new tests from `new_tests.manifest`:

**Gate A1 — Smoke** (if `Test:` includes `smoke`):
```bash
TS="$(date -u '+%Y%m%d_%H%M%S')"
LOG="progress/sprint_N/test_run_A1_smoke_${TS}.log"
tests/run.sh --smoke --new-only progress/sprint_N/new_tests.manifest 2>&1 | tee "$LOG"
```

**Gate A2 — Unit** (if `Test:` includes `unit`):
```bash
TS="$(date -u '+%Y%m%d_%H%M%S')"
LOG="progress/sprint_N/test_run_A2_unit_${TS}.log"
tests/run.sh --unit --new-only progress/sprint_N/new_tests.manifest 2>&1 | tee "$LOG"
```

**Gate A3 — Integration** (if `Test:` includes `integration`):
```bash
TS="$(date -u '+%Y%m%d_%H%M%S')"
LOG="progress/sprint_N/test_run_A3_integration_${TS}.log"
tests/run.sh --integration --new-only progress/sprint_N/new_tests.manifest 2>&1 | tee "$LOG"
```

### Phase B: Regression Gates

Run full suite (or scoped by `Regression scope:`):

**Gate B1 — Smoke Regression** (if `Regression:` includes `smoke`):
```bash
TS="$(date -u '+%Y%m%d_%H%M%S')"
LOG="progress/sprint_N/test_run_B1_smoke_${TS}.log"
tests/run.sh --smoke [--component <scope>] 2>&1 | tee "$LOG"
```

**Gate B2 — Unit Regression** (if `Regression:` includes `unit`):
```bash
TS="$(date -u '+%Y%m%d_%H%M%S')"
LOG="progress/sprint_N/test_run_B2_unit_${TS}.log"
tests/run.sh --unit [--component <scope>] 2>&1 | tee "$LOG"
```

**Gate B3 — Integration Regression** (if `Regression:` includes `integration`):
```bash
TS="$(date -u '+%Y%m%d_%H%M%S')"
LOG="progress/sprint_N/test_run_B3_integration_${TS}.log"
tests/run.sh --integration [--component <scope>] 2>&1 | tee "$LOG"
```

### Retry Policy

| Mode | Retries 1-4 | Retry 5 | Retries 6-10 | After 10 |
|------|-------------|---------|--------------|----------|
| Managed | Auto fix-and-rerun | Human escalation | Continue if approved | Sprint `failed` |
| YOLO | Auto fix-and-rerun | Auto | Auto | Sprint `failed` |

**Human escalation options (retry 5, managed mode):**
1. Continue retrying (grant 5 more attempts)
2. Mark sprint `failed` and stop
3. Reclassify failure (see `test_failure_classification.md`)

### YOLO Mode Thresholds

| Test Level | Required Pass Rate |
|------------|-------------------|
| Smoke | 100% (no exceptions) |
| Unit | 100% (no exceptions) |
| Integration | ≥80% with failures documented |

### On Failure

1. Capture failure details (test name, error, stack trace)
2. Hand failure report to Constructor
3. Constructor fixes the code
4. Test Executor re-runs the failing gate
5. Repeat until pass or retries exhausted

### Output: sprint_N_tests.md

```markdown
# Sprint N — Test Execution Results

## Summary

| Gate | Result | Retries | Pass Rate |
|------|--------|---------|-----------|
| A1 Smoke | PASS | 0 | 100% |
| A2 Unit | PASS | 1 | 100% |
| A3 Integration | PASS | 0 | 100% |
| B2 Unit | PASS | 0 | 100% |
| B3 Integration | PASS | 0 | 100% |

## Artifacts

| Gate | Log File |
|------|----------|
| A1 Smoke | `test_run_A1_smoke_20240115_143022.log` |
| A2 Unit | `test_run_A2_unit_20240115_143045.log` |
| ... | ... |

## Failures (if any)

### Retry 1 — A2 Unit
- **Test:** test_emit.sh:test_UT1_function_name
- **Error:** Expected 'success', got 'error'
- **Fix:** Corrected return value handling in emit.sh:45
- **Result:** Pass on retry 2
```

### Update PROGRESS_BOARD.md

After each gate:
- `smoke_passed` — A1 passed
- `unit_tested` — A2 passed
- `integration_tested` — A3 passed
- `tested` — All Phase A + Phase B passed
- `failed` — Retries exhausted
