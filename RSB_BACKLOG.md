# RUP Strikes Back - backlog

RUP Strikes Back method is developed as piggy back on top on GitHub Tricks project. As it getting complex it must has own backlog and traceability boards.

## Backlog

### RSB-1. RUP Strikes Back method has own life-cycle tools

RUP Strikes Back method has own life-cycle tools:

* backlog: RSB_BACKLOG
* plan: RSB_PLAN
* progress board: RSB_PROGRESS_BOARD

### RSB-2. Agents are technology agnostic

RUP Strikes Back command and agents are universal working for all technologies. Specific technology used by a project is driven by best practices and rules collected in `rules/<technology>/` directory (e.g., `rules/github_actions/`, `rules/ansible/`).

### RSB-3. YOLO mode - agent process full life cycle in autonomous mode

YOLO means that agent process full life cycle in autonomous mode. Makes assumptions for weak problems. Tries not to disturb human if not really needed. YOLO is a parameter of `rup-manager` command and by default is enabled for this command. `agent-*` specific commands have YOLO by default disabled and may be enable by a command from `rup-manager` invocation. Operator may of course invoke agent with YOLO argument. Work in YOLO m ode is manifested by visible ASCII graphics presented at start of each agent.

### RSB-4. progress directory contains sprint subdirectories that collects sprint related file together

Goal is to eliminate accumulation of files in progress directory. Having specific files in own sprint directory will distribute abd better organize files.

### RSB-5. progress directory contains backlog subdirectory that has symbolic links to sprint documents

progress/backlogs directory has backlog id subdirectory with symbolic links to documents in various progress/sprint directories

### RSB-6. rules directory has subdirectories to keep generic and technology specific rules

Rules directory has subdirectories to keep generic and technology specific rules:

* `rules/generic/` - RUP Strikes Back universal rules that apply to any tech stack (GENERAL_RULES, GIT_RULES, PRODUCT_OWNER_GUIDE)
* `rules/github_actions/` - GitHub Actions specific rules (GitHub_DEV_RULES)
* `rules/ansible/` - Ansible specific rules (future)
* `rules/images/` - Shared visual assets

Each technology subdirectory contains rules specific to that technology, while generic rules establish the foundation for all projects.

### RSB-7. Remove v99 tag from names in rules directory

Rules in rules directory are tracked by github and does not need _v99 tags in the name. Existing tags must be removed.

---

## Version 2.0 - Sprint and Backlog Management

### RSB-8. Sprint management command

Sprint management command `/sprint` allows creating, starting, closing and checking status of sprints. Sprints are defined in `PLAN.md` with structured format including status, mode, test and regression requirements.

Test: `/sprint create`, `/sprint start`, `/sprint status`, `/sprint close` commands work as specified.

### RSB-9. Backlog management command

Backlog management command `/backlog` allows adding, listing and prioritizing backlog items. Items follow a constrained format: title (max 80 chars), description (2-4 sentences), and single-line test criterion.

Test: `/backlog add`, `/backlog list`, `/backlog prioritize` commands work as specified.

### RSB-10. Bug management with fold-in/promote policy

Bug management command `/bug` handles bugs discovered during sprints. Default policy is fold-in (fix as part of current item) unless bug expands scope, is cross-cutting, or must be deferred - then it promotes to a new backlog item.

Test: `/bug report`, `/bug triage`, `/bug list` commands work and follow bug policy.

### RSB-11. Sprint archiving

Archive sprint command `/archive-sprint` moves completed sprint artifacts to `docs/archive/` directory while maintaining backlog symbolic links for traceability.

Test: Completed sprints are archived with proper symlink preservation.

### RSB-12. Testing rules and procedures documentation

Generic rules directory contains comprehensive testing documentation: testing strategy template, test procedures, test failure classification, and test migration guidelines.

Test: All testing documents exist in `rules/generic/` and are referenced by agents.

### RSB-13. AGENTS.md documents all management commands

AGENTS.md must document all available commands including Version 2.0 management commands: `/backlog`, `/sprint`, `/bug`, and `/archive-sprint`.

Test: AGENTS.md lists all commands with usage examples.

### RSB-14. HUMANS.md documents all management commands

HUMANS.md (Product Owner guide) must document Version 2.0 management commands and updated sprint fields (Test, Regression) to keep it synchronized with AGENTS.md.

Test: HUMANS.md lists all management commands and sprint configuration options.
