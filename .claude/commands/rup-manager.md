# RUP Cycle Manager - Complete Process Orchestration

Execute the complete Rational Unified Process cycle with fully automated orchestration.

## Overview

This manager orchestrates all RUP phases by executing specialized agent instructions in sequence:

- **Contractor Agent**: Establishes Agent Cooperation Specification (ACS)
- **Analyst Agent**: Reviews requirements and confirms readiness
- **Designer Agent**: Creates detailed design documents and diagrams
- **Constructor Agent**: Implements, tests, and delivers the product
- **Documentor Agent**: Updates project documentation

## Instructions

Execute all five phases in sequence. Each phase reads and executes its specialized agent's instructions. The manager handles transitions, git commits, and maintains flow continuity.

## Step 0: Detect Execution Mode

**Before starting any phases, determine the execution mode:**

1. **Read PLAN.md**
2. **Identify the active Sprint** (Sprint with `Status: Progress`)
3. **Check for "Mode:" field** in that Sprint section
   - If `Mode: YOLO` → **YOLO mode** (autonomous execution)
   - If `Mode: managed` → **Managed mode** (interactive execution)
   - If no Mode field → **Default to managed** (interactive execution)

4. **Display Mode Banner:**

If **YOLO Mode Detected**:
```
═══════════════════════════════════════════════
🚀 YOLO MODE: ACTIVE (You Only Live Once)
═══════════════════════════════════════════════

Autonomous Execution Enabled:
✓ Agents will make reasonable assumptions
✓ Minimal human interaction required
✓ All decisions logged in implementation docs
✓ Faster iteration cycles
✓ Audit trail preserved in git history

Safety: Critical failures still stop execution
═══════════════════════════════════════════════
```

If **Managed Mode** (default):
```
═══════════════════════════════════════════════
👤 MANAGED MODE: ACTIVE
═══════════════════════════════════════════════

Interactive Execution Enabled:
✓ Human-supervised at each phase
✓ Agents ask for clarification
✓ Explicit approvals required
✓ Recommended for complex/high-risk work

Mode: Collaborative human-AI partnership
═══════════════════════════════════════════════
```

**Note**: The detected mode applies to all agents throughout this cycle. Each agent will independently detect and apply the appropriate behaviors.

---

## Phase 1: Execute Contracting

Read `.claude/commands/agents/agent-contractor.md` and execute all its instructions.

**Important**: After completing this phase, commit all changes following semantic commit message conventions as described in `rules/generic/GIT_RULES*`. Push to remote after commit.

This phase establishes the Agent Cooperation Specification (ACS) and confirms understanding of technology constraints, coding standards, testing standards, and cooperation rules.

**Decision Point**: If any clarifications are needed, stop and request them before proceeding to Phase 2.

---

## Phase 2: Execute Inception

Read `.claude/commands/agents/agent-analyst.md` and execute all its instructions.

**Important**: After completing this phase, commit all changes following semantic commit message conventions as described in `rules/generic/GIT_RULES*`. Push to remote after commit.

This phase reviews the Backlog and Plan for the iteration, analyzes requirements, ensures compatibility with existing work, and confirms readiness to proceed to design.

**Decision Point**: If any clarifications are needed, stop and request them before proceeding to Phase 3.

---

## Phase 3: Execute Elaboration

**Note**: Wait 60 seconds for design acceptance. After that assume approval.

Read `.claude/commands/agents/agent-designer.md` and execute all its instructions.

**Important**: After completing this phase, commit all changes following semantic commit message conventions as described in `rules/generic/GIT_RULES*`. Push to remote after commit.

This phase creates detailed design documents, diagrams, class/data models, and verifies feasibility against available APIs for the product increment.

Once design is accepted (after 60 second wait or explicit approval), right away proceed to Phase 4.

---

## Phase 4: Execute Construction

Read `.claude/commands/agents/agent-constructor.md` and execute all its instructions.

**Important**: After completing this phase, commit all changes following semantic commit message conventions as described in `rules/generic/GIT_RULES*`. Push to remote after commit.

This phase implements the design, creates and runs functional and performance tests, creates comprehensive documentation, and delivers the product increment.

Proceed to Phase 5 regardless of test results (partial success is acceptable and will be documented).

---

## Phase 5: Execute Documentation

Read `.claude/commands/agents/agent-documentor.md` and execute all its instructions.

**Important**: After completing this phase, commit all changes following semantic commit message conventions as described in `rules/generic/GIT_RULES*`. Push to remote after commit.

This phase validates all Sprint documentation, ensures compliance with documentation standards, verifies code snippets are tested and copy-paste-able, and updates the README with recent developments.

---

## Step 6: Final Summary ⚠️ MANDATORY

**CRITICAL**: After all phases complete, you MUST provide a comprehensive summary using the template below.

**DO NOT SKIP THIS STEP** - Even if all phases succeeded, the Final Summary is required for audit trail and metrics tracking.

### RUP Cycle Completion Report

**Phases Executed:**

- ✓ Contracting → Inception → Elaboration → Construction → Documentation

**Sprint Information:**

- Sprint Number: [number]
- Sprint Status: [status]

**Backlog Items:**

- [List each Backlog Item with final status: implemented/tested/failed]

**Files Modified:**

- [List all modified/created files]

**Test Results:**

- Total Tests: [count]
- Passed: [count]
- Failed: [count]

**Commits Made:**

- [List commit messages with hashes]

**Next Steps:**

- [Recommended follow-up actions]
- [Any deferred items or issues to address]

**Quality Metrics:**

- Design Iterations: [count]
- Construction Iterations: [count]
- Overall Cycle Time: [if trackable]

---

## Orchestration Notes

### Automated Execution

This manager executes all phases automatically:
- Reads each agent's instruction file
- Executes all instructions from that agent
- Handles git commits after each phase
- Maintains flow continuity throughout
- Provides comprehensive final summary

### Error Handling

If any phase encounters issues:
- Stop execution at that phase
- Report the issue clearly
- Preserve partial progress via git commits
- Wait for Product Owner clarification
- Can resume by re-invoking this manager (it will continue from last checkpoint)

### State Management

- PROGRESS_BOARD.md tracks Sprint and Backlog Item states
- Each agent updates its respective sections
- Git commits serve as synchronization checkpoints
- State transitions follow project state machines

### Phase Independence

While manager executes all phases:
- Individual agents can still be invoked separately for iteration
- Useful for resuming after manual fixes
- Allows targeted phase re-execution

## Execution Checklist

**IMPORTANT**: The RUP Manager MUST complete ALL 6 steps. Use this checklist to verify:

- [ ] **Step 1: Phase 1 - Contracting** - Execute agent-contractor.md, commit, push
- [ ] **Step 2: Phase 2 - Inception** - Execute agent-analyst.md, commit, push
- [ ] **Step 3: Phase 3 - Elaboration** - Execute agent-designer.md, wait 60s for approval, commit, push
- [ ] **Step 4: Phase 4 - Construction** - Execute agent-constructor.md, commit, push
- [ ] **Step 5: Phase 5 - Documentation** - Execute agent-documentor.md, commit, push
- [ ] **Step 6: Final Summary** - Provide RUP Cycle Completion Report in the format specified above (lines 81-122)

**Reminder**: Step 6 is MANDATORY. Do not skip the Final Summary even if all phases completed successfully.

## Usage

To execute a complete automated RUP cycle:

1. Ensure BACKLOG.md has a Sprint marked as `Progress`
2. Invoke this manager: `@rup-manager.md`
3. Manager automatically executes all 6 steps (5 phases + final summary)
4. Verify all 6 checklist items above are completed

**Note**: For manual phase control, you can invoke individual agent commands directly (see `agents/README.md`).
