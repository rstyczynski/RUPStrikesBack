# Option A vs Option B — Functional Comparison

## Purpose

Verify that Option A (rup_manager_simplified.md) preserves ALL functionality from Option B (rup_manager_patched.md + agent_qualitygate.md).

---

## Feature Matrix

| # | Feature | Option B (Patched) | Option A (Simplified) | Status |
|---|---------|-------------------|----------------------|--------|
| 1 | Mode detection | Step 0 per phase | Step 0 ONCE | ✅ Equivalent (more efficient) |
| 2 | Test: parameter | ✅ | ✅ | ✅ Same |
| 3 | Regression: parameter | ✅ | ✅ | ✅ Same |
| 4 | Regression scope: parameter | ❌ | ✅ | ✅ A is better (component-level) |
| 5 | Phase 1: Contracting | Separate phase | Merged into Setup | ✅ Output preserved |
| 6 | Phase 2: Inception | Separate phase | Merged into Setup | ✅ Output preserved |
| 7 | Phase 3: Elaboration | Separate phase | Part of Design | ✅ Output preserved |
| 8 | Phase 3.1: Test Spec | Separate phase + file | Embedded in design.md | ⚠️ See Gap 1 |
| 9 | Phase 4: Construction | Separate phase | Same | ✅ Same |
| 10 | Phase 4.1: Test Execution | Separate phase | Phase 4 Quality Gates | ✅ Same |
| 11 | Phase 5: Documentation | Separate phase | Phase 5 Wrap-up | ✅ Same |
| 12 | Testing Strategy template | §2.3 full template | "per §2.3 template" reference | ⚠️ See Gap 2 |
| 13 | Test Architect instructions | §3 full (150+ lines) | "Execute §3" reference | ⚠️ See Gap 3 |
| 14 | Test Executor instructions | §4a full (200+ lines) | "Execute §4a exactly" reference | ⚠️ See Gap 4 |
| 15 | Gate A1-A3 (new-code) | ✅ Full commands | ✅ Full commands | ✅ Same |
| 16 | Gate B1-B3 (regression) | ✅ Full commands | ✅ Full commands | ✅ Same |
| 17 | --new-only manifest | ✅ | ✅ | ✅ Same |
| 18 | Component manifests | ❌ | ✅ | ✅ A is better |
| 19 | Retry policy (10 max) | ✅ Full description | ✅ Brief | ⚠️ See Gap 5 |
| 20 | Human escalation at retry 5 | ✅ Detailed | ✅ Mentioned | ✅ Sufficient |
| 21 | YOLO ≥80% threshold | ✅ Detailed | ✅ Mentioned | ✅ Sufficient |
| 22 | Flaky vs broken distinction | ✅ Detailed | ❌ Not mentioned | ⚠️ See Gap 6 |
| 23 | Mandatory log artifacts | ✅ Full specification | ✅ Full specification | ✅ Same |
| 24 | PROGRESS_BOARD states | ✅ Full list | ✅ Full list | ✅ Same |
| 25 | Centralized tests/ structure | ✅ | ✅ | ✅ Same |
| 26 | Bug handling policy | ❌ Not referenced | ✅ References rup_bug_policy.md | ✅ A is better |
| 27 | Migration table | ✅ Detailed | ❌ Not included | ⚠️ See Gap 7 |
| 28 | Final Summary template | ✅ | ✅ | ✅ Same |

---

## Identified Gaps

### Gap 1: Test Spec as Separate Artifact

**Option B:** Creates `sprint_N_test_spec.md` as separate file
**Option A:** Embeds test spec as `## Test Specification` section in `sprint_N_design.md`

**Impact:** LOW — Content is same, just location differs. Option A is more compact.

**Recommendation:** Accept Option A approach. Document that test spec is in design.md.

---

### Gap 2: Testing Strategy Template Not Inline

**Option B (agent_qualitygate.md §2.3):**
```markdown
### Testing Strategy

#### Recommended Sprint Parameters
- Test: [smoke, unit, integration -- with rationale for each]
- Regression: [smoke, unit, integration -- with rationale]

#### Unit Test Targets
For each component modified or created:
- **Component:** [file path]
- **Functions to test:** [specific function names]
- **Key inputs and edge cases:** [concrete examples]
- **Isolation requirements:** [what to mock]

#### Integration Test Scenarios
For each end-to-end path affected:
- **Scenario:** [description]
- **Infrastructure dependencies:** [OCI tenancy, GitHub API, specific secrets]
- **Expected observable outcome:** [what to assert]
- **Estimated runtime:** [seconds/minutes]

#### Smoke Test Candidates
- **Candidate:** [test description]
- **Why it's critical:** [what breaks if this fails]
- **Expected runtime:** [must be fast]
```

**Option A:** Says "per §2.3 template" but doesn't include template.

**Impact:** MEDIUM — Designer won't know the template without reading agent_qualitygate.md.

**Recommendation:** Inline the template in Option A, or create a reference file `rules/generic/testing_strategy_template.md`.

---

### Gap 3: Test Architect Instructions Not Inline

**Option B:** 150+ lines of detailed Test Architect instructions (§3)

**Option A:** "execute the Test Architect instructions from agent_qualitygate.md §3"

**Impact:** MEDIUM — Requires reading a second file during execution.

**Recommendation:** Either:
- (a) Keep reference, ensure agent_qualitygate.md is always available
- (b) Create standalone `rules/generic/test_architect_procedure.md`
- (c) Inline critical steps into Option A

---

### Gap 4: Test Executor Instructions Not Inline

**Option B:** 200+ lines of detailed Test Executor instructions (§4a)

**Option A:** "Execute agent_qualitygate.md §4a (Test Executor) exactly"

**Impact:** MEDIUM — Same as Gap 3.

**Recommendation:** Same as Gap 3.

---

### Gap 5: Retry Policy Details

**Option B:**
```
Managed mode:
- Retries 1-4: automatic fix-and-rerun cycle
- Retry 5: human escalation — present decision to Product Owner:
  - Continue retrying (grant 5 more attempts)
  - Mark sprint `failed` and stop
  - Reclassify the failure (flaky vs broken)
- Retries 6-10: continue if approved at retry 5
- After retry 10: sprint is `failed`

YOLO mode:
- All 10 retries execute automatically
- Each failure logged with increasing detail
- Integration gates accept >=80% pass rate per attempt
```

**Option A:** "Managed: retries 1–4 auto, retry 5 human escalation, 6–10 if approved, after 10 → failed. YOLO: all 10 auto; integration gates accept ≥80%"

**Impact:** LOW — Option A has the key points, just less verbose.

**Recommendation:** Accept Option A wording. Details available in agent_qualitygate.md if needed.

---

### Gap 6: Flaky vs Broken Distinction

**Option B:**
```
Flaky vs broken distinction:
- Broken: test fails deterministically. Code has a bug. Fix required.
- Flaky: test fails intermittently (infrastructure timeout, race condition).
  Test Executor notes failure as flaky if re-running same code produces
  different results.

In managed mode, flaky failures can be deferred to known-issues list at
human escalation point (retry 5). In YOLO mode, flaky failures documented
but do not consume retry budget.
```

**Option A:** Not mentioned.

**Impact:** MEDIUM — Important for retry handling and escalation decisions.

**Recommendation:** Add brief flaky/broken distinction to Option A Phase 4 section, or create `rules/generic/test_failure_classification.md`.

---

### Gap 7: Migration Table

**Option B:** Detailed migration table for moving tests to centralized `tests/` tree.

**Option A:** Not included.

**Impact:** LOW — Migration is a one-time activity, not part of ongoing process.

**Recommendation:** Keep migration table in a separate document (e.g., `rules/generic/test_migration.md`) rather than in the manager itself.

---

## Summary

| Gap | Severity | Recommendation |
|-----|----------|----------------|
| 1: Test spec location | LOW | Accept Option A (embedded in design.md) |
| 2: Testing Strategy template | MEDIUM | Inline or create reference file |
| 3: Test Architect instructions | MEDIUM | Keep reference or create procedure file |
| 4: Test Executor instructions | MEDIUM | Keep reference or create procedure file |
| 5: Retry policy details | LOW | Accept Option A wording |
| 6: Flaky vs broken | MEDIUM | Add brief section or reference file |
| 7: Migration table | LOW | Move to separate document |

---

## Proposed Resolution

**Approach: Hybrid — Option A manager + extracted reference files**

Keep `rup_manager_simplified.md` as the main orchestrator, but:

1. **Create `rules/generic/testing_strategy_template.md`** — The §2.3 template
2. **Create `rules/generic/test_procedures.md`** — Combined Test Architect + Test Executor procedures (extracted from §3 + §4a)
3. **Add to Option A Phase 4:** Brief flaky/broken distinction
4. **Create `rules/generic/test_migration.md`** — Migration table (one-time reference)

This gives:
- Token-efficient main manager (~250 lines)
- Full functionality via on-demand reference files
- No loss of detail when needed

---

## Next Steps

1. Review this comparison
2. Decide on resolution approach
3. Create the reference files
4. Update rup_manager_simplified.md with references
5. Validate with test execution
