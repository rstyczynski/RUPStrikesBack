# Sprint 5 - Design

## RSB-8. WebUI: make up look&feel

Status: Proposed

### Requirement Summary
Modern minimalistic styling via Tailwind CDN; keep current functionality.

### Feasibility Analysis

**API Availability:**
- No API changes; WebUI continues calling /v1/weather endpoints.

**Technical Constraints:**
- No build tool; use Tailwind CDN (<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">)
- Keep vanilla JS; no framework.

**Risk Assessment:**
- CDN outage risk (Low). Fallback = basic readability with minimal inline styles.

### Design Overview

**Architecture:**
Static HTML styled with Tailwind utility classes; script.js unchanged.

**Key Components:**
1. index.html: add Tailwind link; refactor markup to utility classes.
2. script.js: keep existing IDs and rendering.
3. Remove styles.css usage beyond resets; optional minimal overrides.

**Data Flow:**
Unchanged.

### Technical Specification

**Files:**
- weather-web/index.html: Tailwind structure
- weather-web/script.js: unchanged
- weather-web/styles.css: optional overrides (can be kept empty or minimal)

**Error Handling:**
Unchanged; error banner uses Tailwind classes (bg-red-100 text-red-700 border border-red-200).

### Implementation Approach

- Add Tailwind CDN to head
- Replace container/layout with Tailwind classes
- Style buttons, inputs, cards, table
- Keep IDs and semantics stable

### Testing Strategy

- Manual visual tests for city/coords/error states
- Verify responsive behavior

### Documentation Requirements

- Update usage instructions (no change to flow)

### Design Decisions

- Tailwind CDN over local build for zero tooling

### Open Design Questions
None

# Design Summary

## Overall Architecture
Three-tier unchanged; WebUI aesthetics improved via Tailwind.

## Shared Components
Script logic reused.

## Design Risks
CDN dependency.

## Resource Requirements
Browser, internet for CDN.

## Design Approval Status
Accepted
