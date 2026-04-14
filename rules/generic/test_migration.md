# Test Migration Guide

One-time procedure for migrating existing tests to the centralized `tests/` directory structure.

---

## Target Structure

```
tests/
├── smoke/
│   └── test_*.sh           # Quick critical checks
├── unit/
│   └── test_*.sh           # Function-level tests
├── integration/
│   └── test_*.sh           # End-to-end tests
├── manifests/
│   └── component_*.manifest # Component test registries
└── run.sh                   # Test runner entry point
```

---

## Migration Procedure

### Step 1: Identify Existing Tests

Locate all test files in current locations:

| Pattern | Typical Locations |
|---------|-------------------|
| `test_*.sh` | `.github/actions/*/tests/` |
| `test_*.sh` | `progress/sprint_*/` |
| `*_test.sh` | Various |

### Step 2: Classify Each Test

| Test Type | Characteristics | Target Directory |
|-----------|-----------------|------------------|
| Smoke | Fast (<10s), critical path, no external deps | `tests/smoke/` |
| Unit | Tests single function, may mock externals | `tests/unit/` |
| Integration | End-to-end, requires infrastructure | `tests/integration/` |

### Step 3: Copy to Target Location

```bash
# Example: migrate unit test
cp .github/actions/sli-event/tests/test_emit.sh tests/unit/test_emit.sh
```

### Step 4: Verify Migrated Test Runs

```bash
# From repo root
tests/run.sh --unit
```

### Step 5: Create Backward-Compatible Wrapper

Replace original file with wrapper to preserve CI/script compatibility:

```bash
#!/usr/bin/env bash
# Migrated to tests/unit/test_emit.sh
exec "$(dirname "$0")/../../tests/unit/test_emit.sh" "$@"
```

### Step 6: Register in Component Manifest

Add to appropriate `tests/manifests/component_*.manifest`:

```text
unit:test_emit.sh
```

### Step 7: Commit Migration

```bash
git add tests/ .github/actions/*/tests/
git commit -m "test: migrate test_emit.sh to centralized tests/ structure"
```

---

## Migration Table Template

Track migration progress:

| Current Location | Target Location | Type | Status |
|------------------|-----------------|------|--------|
| `.github/actions/sli-event/tests/test_emit.sh` | `tests/unit/test_emit.sh` | unit | pending |
| `.github/actions/install-oci-cli/tests/test_install.sh` | `tests/unit/test_install.sh` | unit | pending |
| `progress/sprint_6/test_sli_integration.sh` | `tests/integration/test_sli.sh` | integration | pending |

Status values: `pending`, `migrated`, `verified`, `archived`

---

## Important Rules

### During Migration Period

1. **Quality gates run ONLY against `tests/`** — Old locations are not scanned
2. **Unmigrated tests are not part of any gate** — They don't run in regression
3. **Migration can be a dedicated sprint** — Use `Test: none, Regression: none`

### After Migration

1. **Remove wrappers** once all CI references are updated
2. **Archive old sprint test copies** — Keep only latest version in `tests/`
3. **One file per component** — Don't keep sprint-specific copies

---

## Sprint for Migration

Suggested PLAN.md entry:

```markdown
## Sprint M - Test Migration

Status: Planned
Mode: YOLO
Test: none
Regression: none

Migrate existing tests to centralized tests/ structure.

Backlog Items:

* TM-1. Migrate unit tests to tests/unit/
* TM-2. Migrate integration tests to tests/integration/
* TM-3. Create smoke tests in tests/smoke/
* TM-4. Verify run.sh executes all migrated tests
```
