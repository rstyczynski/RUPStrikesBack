# Testing Strategy Template

This template is used by the Designer in Phase 2 (Design) to specify the testing approach. The Test Architect uses this section to create test specifications and skeletons.

## Template

Include this section in `sprint_N_design.md`:

```markdown
### Testing Strategy

#### Recommended Sprint Parameters

- **Test:** [smoke, unit, integration — with rationale for each level]
- **Regression:** [smoke, unit, integration — with rationale]
- **Regression scope:** [component name or omit for full suite]

#### Unit Test Targets

For each component modified or created:

| Component | Functions to Test | Key Inputs & Edge Cases | Isolation (Mocks) |
|-----------|-------------------|-------------------------|-------------------|
| `path/to/file.sh` | `function_name` | Valid input, empty input, special chars | Mock external API calls |

#### Integration Test Scenarios

For each end-to-end path affected:

| Scenario | Infrastructure Dependencies | Expected Outcome | Est. Runtime |
|----------|----------------------------|------------------|--------------|
| Full pipeline execution | OCI tenancy, secrets | Event visible in OCI logs | 2-3 min |

#### Smoke Test Candidates

Which tests are critical enough for the fast gate:

| Candidate | Why Critical | Expected Runtime |
|-----------|--------------|------------------|
| Basic emit validation | If this fails, nothing works | < 5 sec |
```

## Field Descriptions

### Test Parameter Values

| Value | When to Use |
|-------|-------------|
| `smoke` | Always include for quick "is it buildable" check |
| `unit` | Pure logic changes, function-level testing |
| `integration` | End-to-end paths, infrastructure interaction |
| `none` | Documentation-only sprints |

### Regression Parameter Values

| Value | When to Use |
|-------|-------------|
| `smoke` | Fastest — just critical paths |
| `unit` | Good balance of speed and safety |
| `integration` | Maximum safety, slowest |
| `none` | Experimental/throwaway sprints only |

### Regression Scope

Optional. Limits regression to a specific component's manifest:

| Scope Value | Manifest File |
|-------------|---------------|
| `router` | `tests/manifests/component_router.manifest` |
| `emit` | `tests/manifests/component_emit.manifest` |
| `oci-setup` | `tests/manifests/component_oci_setup.manifest` |
| `sli-metrics` | `tests/manifests/component_sli_metrics.manifest` |
| `install` | `tests/manifests/component_install.manifest` |

Omit `Regression scope:` to run full suite regression.

## Example (Good)

```markdown
### Testing Strategy

#### Recommended Sprint Parameters

- **Test:** smoke, unit, integration — New emit backend requires all levels
- **Regression:** unit — Unit regression sufficient for isolated change
- **Regression scope:** emit — Only emit component affected

#### Unit Test Targets

| Component | Functions to Test | Key Inputs & Edge Cases | Isolation (Mocks) |
|-----------|-------------------|-------------------------|-------------------|
| `emit.sh` | `sli_build_json` | Valid SLI data, missing fields, special chars in values | None (pure function) |
| `emit.sh` | `sli_emit_event` | Success response, API error, timeout | Mock OCI CLI |

#### Integration Test Scenarios

| Scenario | Infrastructure Dependencies | Expected Outcome | Est. Runtime |
|----------|----------------------------|------------------|--------------|
| Emit to OCI Logging | OCI tenancy, API key, log OCID | Event in OCI console | 30 sec |

#### Smoke Test Candidates

| Candidate | Why Critical | Expected Runtime |
|-----------|--------------|------------------|
| JSON output validation | Malformed JSON breaks everything downstream | < 2 sec |
```

## Example (Bad — Missing Details)

```markdown
### Testing Strategy

We should test the emit function.
```

This lacks:
- Specific Test/Regression parameters
- Concrete test targets with inputs/outputs
- Integration scenarios with dependencies
- Smoke candidates with rationale
