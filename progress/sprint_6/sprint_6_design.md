# Sprint 6 - Design

## RSB-9. WebUI: Pro-level look&feel and UX (one sprint)

Status: Proposed

### Requirement Summary
Apply a premium visual system to weather-web with Tailwind: theme tokens (colors/spacing/typography with Inter), dark mode, component set, micro-interactions, a11y, performance.

### Feasibility Analysis

**API Availability:**
No new API. Uses existing /v1/weather endpoints.

**Technical Constraints:**
No build tooling; use CDN Tailwind + minimal CSS; load Inter font; prefer CSS variables for tokens.

**Risk Assessment:**
- Visual quality subjective — mitigate by systematized tokens
- Performance — purge limited with CDN; mitigate by minimizing utility use

### Design Overview

**Architecture:**
Static HTML pages using Tailwind CDN; JS for interactions; CSS variables for theme; localStorage for dark mode.

**Key Components:**
1. Header with brand, theme toggle
2. Search card (city, coords)
3. Result cards: location, current, forecast table
4. Buttons, inputs, cards, alerts, skeletons

**Data Flow:**
User input -> build URL -> fetch -> render sections

### Technical Specification

**APIs Used:**
- GET /v1/weather?city=
- GET /v1/weather?lat=&lon=

**Data Structures:**
Front-end uses fields: location.{name,country,admin1,latitude,longitude}, forecast.current.{temperature_2m,weather_code}, forecast.daily.{time,temperature_2m_max,temperature_2m_min}

**Scripts/Tools:**
- weather-web/index.html: layout and components
- weather-web/script.js: fetch and render
- weather-web/styles.css: minimal customizations

**Error Handling:**
Show alert box with message; handle non-JSON responses; display invalid JSON snippet.

### Implementation Approach

Step 1: Add Inter font and tokens; add dark mode toggle and persistence.
Step 2: Style components with Tailwind classes and transitions.
Step 3: Add skeleton loading.
Step 4: A11y: focus rings, labels, ARIA for errors, keyboard nav.
Step 5: Optimize: defer scripts, preconnect fonts, Lighthouse checks.

### Testing Strategy
- Keyboard-only navigation path
- Dark mode toggle persists across reload
- Lighthouse >=95

### Integration Notes

**Dependencies:** Tailwind CDN, Inter font CDN, Lucide icons CDN.

**Compatibility:** No API changes.

**Reusability:** Reuse current structure.

### Documentation Requirements
- Update README recent updates
- Implementation and tests docs for sprint 6

### Design Decisions

Decision 1: Use CSS variables for theme tokens; Tailwind utilities apply var() values.
Decision 2: Use prefers-color-scheme and manual toggle; persist in localStorage.
Decision 3: Keep no-build flow; avoid Tailwind config.

### Open Design Questions
None

---

# Design Summary

## Overall Architecture
Single-page static site with Tailwind and minimal JS.

## Shared Components
Buttons, inputs, cards, alerts, skeletons reused across forms.

## Design Risks
Subjectivity of "pro-level"; mitigate with consistency and a11y.

## Resource Requirements
Tailwind CDN, Inter font CDN, Lucide icons CDN.

## Design Approval Status
Approved
