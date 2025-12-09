# Sprint 7 - Design

## RSB-6. WebUI: Add map presentation for city location disambiguation

Status: Proposed

### Requirement Summary
Show a Leaflet map centered on the selected location (from city search) with a marker.

### Feasibility Analysis
**API Availability:** City path already returns location {latitude,longitude}. Coords path will be extended to include location echo.
**Technical Constraints:** No build; use Leaflet CDN and OSM tiles. CORS already enabled.
**Risk Assessment:** External CDN; minimal.

### Design Overview
**Architecture:** Extend weather-web to load Leaflet CSS/JS and render a map container. Update API server to add {location:{latitude,longitude}} in coords response.
**Key Components:** Map container, marker management, click handler.
**Data Flow:** Search -> request -> render panels -> center map; click map -> request by lat/lon -> update panels and marker.

### Technical Specification
- Frontend: Add <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"> and <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
- Add <div id="map" style="height: 320px"></div>
- JS: initialize map once; setView([lat, lon]); add/update marker; handle map.on('click', ...)
- API: For coords queries, return {location:{latitude:lat, longitude:lon}}

### Testing Strategy
Static checks for assets; manual click test; ensure JSON shape consistent.

### Implementation Approach
1) Update API response for coords.
2) Update index.html to include Leaflet and map container.
3) Update script.js to initialize and handle city/coords flows.

### Documentation Requirements
Update tests and implementation docs.

### Design Decisions
- Use Leaflet CDN; unify location structure across paths.

### Open Design Questions
None

---

## RSB-7. WebUI: User clicks on a map to get forecast for this point

Status: Proposed

### Requirement Summary
Click to query forecast for clicked coordinates; update marker and panels.

### Feasibility Analysis
Same stack as RSB-6.

### Design Overview
Use map click event; construct URL; reuse render functions.

### Technical Specification
- JS: map.on('click', ({latlng})) -> request(`/v1/weather?lat=..&lon=..`)

### Testing Strategy
Manual validation.

# Design Summary
Overall Architecture: Leaflet map integrated into existing SPA; unified location handling.
Design Approval Status: Approved
