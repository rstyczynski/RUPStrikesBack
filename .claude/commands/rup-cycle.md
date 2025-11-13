# RUP Cycle - Complete Process Flow

Execute the complete Rational Unified Process cycle: Contracting → Inception → Elaboration → Construction.

## Instructions

Execute the four phases in sequence. Each phase includes its own feedback loops and review processes.

## Step 1: Execute Contracting Phase

Read `.claude/commands/contract.md` and execute all its instructions.

**Important**: After completing this phase, commit all changes following semantic commit message conventions as described in `.rules/generic/GIT_RULES*`. Push to remote after commit.

This phase establishes the Agent Cooperation Specification (ACS) and confirms understanding of technology constraints, coding standards, testing standards, and cooperation rules.

## Step 2: Execute Inception Phase

Read `.claude/commands/inception.md` and execute all its instructions.

**Important**: After completing this phase, commit all changes following semantic commit message conventions as described in `.rules/generic/GIT_RULES*`. Push to remote after commit.

This phase reviews the Backlog and Plan for the iteration, analyzes requirements, and confirms readiness to proceed.

## Step 3: Execute Elaboration Phase

**Note**: Wait 60 seconds for design acceptance. After that assume approval.

Read `.claude/commands/elaboration.md` and execute all its instructions.

**Important**: After completing this phase, commit all changes following semantic commit message conventions as described in `.rules/generic/GIT_RULES*`. Push to remote after commit.

This phase creates detailed design documents, diagrams, and class/data models for the product increment.

Once design is accepted right away execute: Step 4: Execute Construction Phase

## Step 4: Execute Construction Phase

Read `.claude/commands/construction.md` and execute all its instructions.

**Important**: After completing this phase, commit all changes following semantic commit message conventions as described in `.rules/generic/GIT_RULES*`. Push to remote after commit.
This phase implements the design, runs functional and performance tests, and delivers the product increment.

## Step 5: Update documentation

Read `.claude/commands/documentation.md` and execute all its instructions.

**Important**: After completing this phase, commit all changes following semantic commit message conventions as described in `.rules/generic/GIT_RULES*`. Push to remote after commit.

## Summary

After all phases complete, provide a summary:

- **Phases executed**: Contracting → Inception → Elaboration → Construction
- **Files modified**: [list files]
- **Sprint status**: [current sprint status]
- **Backlog items status**: [status summary]
- **Next steps**: [any follow-up actions needed]
