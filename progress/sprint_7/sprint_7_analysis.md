# Sprint 7 - Analysis

Status: Complete

## Sprint Overview
WebUI map extension: show map for selected city and allow click-to-query by coordinates. API must return coordinates.

## Backlog Items Analysis

### RSB-6. WebUI: Add map presentation for city location disambiguation
**Requirement Summary:** Display a map centered on the searched city's coordinates alongside weather data.
**Technical Approach:** Use Leaflet.js + OpenStreetMap tiles via CDN; center/marker from API-provided location.
**Dependencies:** weather-api must include location coords in city flow (already returns for city; extend coords response to echo lat/lon location block for consistency).
**Testing Strategy:** Visual verification and simple DOM checks; static greps for assets.
**Risks/Concerns:** External CDN dependencies.
**Compatibility Notes:** No breaking API change; add location in coords response.

### RSB-7. WebUI: User clicks on a map to get forecast for this point
**Requirement Summary:** Clicking map sends lat/lon query to API and updates UI.
**Technical Approach:** Leaflet click handler -> request(/v1/weather?lat=..&lon=..), place marker, update panels.
**Dependencies:** Same as above.
**Testing Strategy:** Manual click test; static presence checks.
**Risks/Concerns:** CORS already enabled; ensure error handling.

## Overall Sprint Assessment
**Feasibility:** High
**Estimated Complexity:** Moderate
**Prerequisites Met:** Yes
**Open Questions:** None

## YOLO Mode Decisions
- Use Leaflet + OSM via CDN for speed.
- Echo location for coordinate queries with {latitude,longitude} to unify UI.
- Keep no-build toolchain.
