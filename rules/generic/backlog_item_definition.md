# Backlog Item Definition

A backlog item is a short description of something needed to improve the product. It states **what** is needed and **why it matters** — not how to build it.

---

## Format

```markdown
### <ID>. <Title> (one short sentence)

<2-4 sentences: what the feature/fix is, why it is needed, and any key constraint or acceptance signal.>

Test: <one line — how to know it works.>
```

---

## Constraints

| Rule | Rationale |
|------|-----------|
| No design decisions | Design belongs in elaboration phase |
| No architecture | Architecture belongs in elaboration phase |
| No implementation steps | Implementation belongs in construction phase |
| No tables | Keep it simple and scannable |
| No bullet lists of sub-tasks | Sub-tasks emerge during sprint planning |
| Small enough to hold in your head | If too complex, split into multiple items |

**If more detail is needed, it belongs in the sprint elaboration document, not the backlog.**

---

## ID Convention

Use project prefix + sequential number:

| Project | Format | Example |
|---------|--------|---------|
| Generic | `PBI-NNN` | PBI-001, PBI-002 |
| Project-specific | `<PREFIX>-NNN` | SLI-001, AUTH-042 |

Auto-detect prefix from existing items in BACKLOG.md.

---

## Source

Definition from [Scrum.org — What is a Product Backlog](https://www.scrum.org/resources/what-is-a-product-backlog):

> "An emergent, ordered list of what is needed to improve the product."
> Items are refined by "adding details, such as a description, order, and size" — not by writing designs.

---

## Examples

### Good Example

```markdown
### SLI-8. Test procedure execution log and OCI log capture

The integration test script leaves no durable artifact after a run. Save the full stdout/stderr to a timestamped log file and the raw OCI JSON response to a separate file, both printed at run end.

Test: both files exist after every run and paths are printed to stdout.
```

**Why it's good:**
- Clear title stating the need
- Description explains what and why
- Single acceptance criterion
- No implementation details

### Bad Example — Too Long, Contains Design

```markdown
### SLI-11. Split emit.sh into emit_oci.sh and emit_curl.sh

**Contract (shared by both scripts):**
| Variable | Description |
| --- | --- |
| SLI_OUTCOME | required — success / failure / cancelled |
...

Pure-function helpers live in emit_common.sh sourced by both backends... emit_curl.sh constructs PUT /20200831/logs/{logId}/actions/push and signs it using OCI API-key request signing (RSA-SHA256 HMAC over canonical (request-target) date host x-content-sha256 content-type content-length)...
```

**Why it's bad:**
- Contains tables (implementation contract)
- Specifies file structure (architecture)
- Details API signing (implementation)
- Too long to hold in your head

**How to fix:** Remove everything except the core need:

```markdown
### SLI-11. Alternative HTTP backend for emit.sh

The emit script currently requires OCI CLI. Provide an alternative that uses only curl for environments where OCI CLI cannot be installed.

Test: emit succeeds using curl backend when OCI CLI is not present.
```

---

## Validation Checklist

Before adding to BACKLOG.md, verify:

- [ ] Title is ≤80 characters
- [ ] Description is 2-4 sentences
- [ ] Test line is single line, starts with verb
- [ ] No tables present
- [ ] No bullet lists present
- [ ] No code blocks present
- [ ] No file paths mentioned
- [ ] No function names mentioned
- [ ] Could explain it verbally in 30 seconds
