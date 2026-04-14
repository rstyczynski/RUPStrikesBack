# RUP Strikes Back - Implementation Plan

This plan organizes execution of RSB Backlog Items specified in `RSB_BACKLOG.md` in a form of iterations - Sprints. This document tracks the evolution of the RUP Strikes Back methodology itself as it is developed alongside the GitHub Tricks project.

## RSB Sprint 0 - Lifecycle Foundation

Status: Done

Establish dedicated lifecycle management for RUP Strikes Back methodology, separating its development tracking from the host GitHub Tricks project.

Backlog Items:

* RSB-1. RUP Strikes Back method has own life-cycle tools

## RSB Sprint 1 - Rules Organization

Status: Done

Reorganize rules directory to separate generic methodology from technology-specific implementations, enabling true technology-agnostic agent operation.

Backlog Items:

* RSB-6. Rules directory has subdirectories to keep generic and technology specific rules
* RSB-7. Remove v99 tag from names in rules directory

## RSB Sprint 2 - Progress Organization

Status: Done

Reorganize progress directory to eliminate file accumulation and improve traceability through sprint-based organization and symbolic linking.

Backlog Items:

* RSB-4. Progress directory contains sprint subdirectories that collects sprint related file together
* RSB-5. Progress directory contains backlog subdirectory that has symbolic links to sprint documents

## RSB Sprint 3 - Verify that agents are technology agnostic

Status: Done

Agents are technology agnostic i.e. may process any technology. Detailed requirements for certain technology are defined in rules/{{technology}} file.

Backlog Items:

* RSB-2. Agents are technology agnostic

## RSB Sprint 4 - Agent Enhancements

Status: Done

Enhance agents with autonomous capabilities and technology agnosticism, enabling full lifecycle processing with minimal human intervention.

Backlog Items:

* RSB-3. YOLO mode - agent process full life cycle in autonomous mode

---

## Version 2.0 - Sprint and Backlog Management

## RSB Sprint 5 - Sprint and Backlog Management Commands

Status: Done

Add structured management commands for sprints, backlog items, and bugs. Includes sprint lifecycle (create, start, close), backlog item definition constraints, and bug handling policy with fold-in/promote decision tree.

Backlog Items:

* RSB-8. Sprint management command
* RSB-9. Backlog management command
* RSB-10. Bug management with fold-in/promote policy
* RSB-11. Sprint archiving
* RSB-12. Testing rules and procedures documentation
* RSB-13. AGENTS.md documents all management commands
