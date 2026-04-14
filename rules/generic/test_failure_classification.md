# Test Failure Classification

When a test fails, the Test Executor must classify it as **broken** or **flaky**. This affects retry handling and escalation decisions.

---

## Definitions

### Broken

**Definition:** The test fails deterministically. Running the same code produces the same failure every time.

**Cause:** The code has a bug.

**Action:** Fix required. Constructor must correct the implementation.

**Example:**
```
test_emit_json() fails with:
  Expected: {"status":"success"}
  Got: {"status":"sucess"}   # typo in code
```

### Flaky

**Definition:** The test fails intermittently. Running the same code produces different results.

**Causes:**
- Infrastructure timeout
- Race condition
- Network glitch
- Expired credential
- Clock drift
- Resource contention

**Detection:** Re-run the exact same code. If it passes on re-run without changes, it's flaky.

**Example:**
```
test_oci_push() fails with:
  Error: Connection timeout to OCI endpoint

Re-run (no code changes): PASS
```

---

## Classification Procedure

```
Test Fails
    │
    ▼
Re-run same code (no changes)
    │
    ├── Still fails → BROKEN → Fix code → Re-run gate
    │
    └── Now passes → FLAKY → Document → See handling below
```

---

## Flaky Test Handling

### Managed Mode

At **retry 5 (human escalation)**, Product Owner can choose:

1. **Continue retrying** — Grant 5 more attempts, flaky test may stabilize
2. **Defer to known-issues** — Add to `known_flaky_tests.md`, continue sprint
3. **Mark sprint failed** — If flaky test indicates real instability

**Known-issues format:**
```markdown
# Known Flaky Tests

| Test | Failure Mode | First Seen | Status |
|------|--------------|------------|--------|
| test_oci_push | Connection timeout | Sprint 5 | Monitoring |
```

### YOLO Mode

- Flaky failures are **documented** but do not consume retry budget
- Only first occurrence of a flaky failure counts toward the 10 retries
- Subsequent identical flaky failures are noted but don't increment retry count

**Documentation in sprint_N_tests.md:**
```markdown
## Flaky Failures

| Test | Occurrences | Passed After |
|------|-------------|--------------|
| test_oci_push | 2 | Retry 3 (no code change) |
```

---

## Impact on Gates

| Classification | Pass Rate Calculation | Retry Budget |
|----------------|----------------------|--------------|
| Broken | Counts as failure | Consumes 1 retry |
| Flaky (managed) | Deferred if approved | Consumes 1 retry until deferred |
| Flaky (YOLO) | Documented only | First occurrence only |

---

## Examples

### Example 1: Broken Test

```
Gate A2 Unit — Attempt 1
  test_emit.sh:test_build_json FAIL
    Expected: valid JSON
    Got: syntax error at line 1

Re-run same code: FAIL (same error)

Classification: BROKEN
Action: Constructor fixes JSON generation in emit.sh
```

### Example 2: Flaky Test

```
Gate A3 Integration — Attempt 1
  test_sli.sh:test_oci_logging FAIL
    Error: OCI API rate limit exceeded

Re-run same code: PASS

Classification: FLAKY
Action: Document, note "rate limit during CI peak hours"
```

### Example 3: Borderline Case

```
Gate A2 Unit — Attempt 1
  test_parser.sh:test_large_input FAIL
    Error: Killed (out of memory)

Re-run same code: FAIL (but different memory threshold)
Re-run again: PASS

Classification: FLAKY (infrastructure-dependent)
Action: Consider increasing test timeout or memory limit
```

---

## Best Practices

1. **Always re-run before classifying** — Don't assume broken vs flaky
2. **Document flaky patterns** — Track recurring flaky tests for later fix
3. **Fix flaky tests eventually** — Deferring is temporary, not permanent
4. **Don't mask broken as flaky** — If code changed and test still fails, it's broken
