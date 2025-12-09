# Sprint 4 - Design

## RSB-5. Weather forecast WebUI

Status: Proposed

### Requirement Summary
Minimal Web UI page with inputs for city or coordinates, calling REST API and rendering location, current, 3-day forecast; display errors.

### Feasibility Analysis

**API Availability:**
- GET /v1/weather?city={name} → location + forecast
- GET /v1/weather?lat={lat}&lon={lon} → forecast

**Technical Constraints:**
- CORS allowed by API
- No build tooling; static assets only

**Risk Assessment:**
- API base mismatch with README – mitigate by configurable base URL field
- Network failures – show user-friendly error box

### Design Overview

**Architecture:**
Single-page static app with index.html and script.js using fetch.

**Key Components:**
1. index.html: form inputs, results containers
2. script.js: API calls, DOM update, error handling

**Data Flow:**
User enters input → fetch JSON → render sections (location, current, forecast table)

### Technical Specification

**APIs Used:**
- Endpoint: /v1/weather
  - Method: GET
  - Params: city or lat+lon

**Data Structures:**
Expect JSON: { location?: {name,country,admin1,latitude,longitude}, forecast: {current:{temperature_2m,weather_code}, daily:{time[],temperature_2m_max[],temperature_2m_min[]}} }

**Scripts/Tools:**
- file: weather-web/index.html – UI
- file: weather-web/script.js – logic
- file: weather-web/styles.css – minimal styling

**Error Handling:**
Render error banner with API error message or network error; validate inputs.

### Implementation Approach

**Step 1:** Create weather-web/ with index.html, script.js, styles.css
**Step 2:** Implement fetch for city and coords
**Step 3:** Render results and errors
**Step 4:** Manual tests with running API

### Testing Strategy

Functional tests: manual curl and browser checks for city and coords; error for invalid inputs.

### Integration Notes

**Dependencies:** weather-api must run at base URL provided by user (default http://localhost:8080)
**Compatibility:** Uses existing API contract and CORS.
**Reusability:** None needed beyond fetch.

### Documentation Requirements

**User Documentation:**
- How to run weather-api and open index.html
- Examples for city and coords

**Technical Documentation:**
- File list and responsibilities

### Design Decisions

**Decision 1:** Vanilla JS SPA; rationale: speed, zero tooling; alternatives: React/Vue; risk: minimal.

### Open Design Questions
None

# Design Summary

## Overall Architecture
Three-tier: CLI, REST API, WebUI.

## Shared Components
API contract reused.

## Design Risks
Base URL mismatch; mitigated via input.

## Resource Requirements
Browser only.

## Design Approval Status
Accepted
