# Sprint 5 - Design

## RSB-6. WebUI: Add map presentation for city location disambiguation

Status: Accepted

### Requirement Summary

Integrate interactive map into existing WebUI to display city location when searched, helping users confirm correct city from ambiguous names.

### Feasibility Analysis

**API Availability:**

✓ All required from Sprint 3 REST API:
- GET /weather?city={name} → JSON with location coordinates
- GET /weather?lat={lat}&lon={lon} → JSON forecast
- Location data includes latitude/longitude for map centering

**Technical Constraints:**

- Extend existing weather-web/ structure
- Use Leaflet.js (lightweight, open-source)
- OpenStreetMap tiles (free, no API key)
- Maintain responsive design patterns
- Zero build tools (vanilla JS approach)

**Risk Assessment:**

| Risk | Level | Mitigation |
|------|-------|------------|
| Map library complexity | Low | Leaflet.js well-documented, lightweight |
| Tile service limits | Low | OpenStreetMap generous, no authentication |
| Coordinate sync | Low | Use same API data source as weather display |
| Performance impact | Low | Lazy loading, simple map interactions |

### Design Overview

**Architecture:**

```
Existing WebUI
    └─ index.html (structure)
         ├─ style.css (responsive design)
         └─ app.js (weather logic + NEW map logic)

NEW: Map Integration
    └─ Leaflet.js map container
         ├─ OpenStreetMap tiles
         ├─ Click event handlers
         └─ Coordinate synchronization with weather data
```

**Key Components:**

1. **Map Container** - New section in index.html for map display
2. **Map Controller** - JavaScript module for Leaflet.js integration
3. **Coordinate Sync** - Logic to center map on weather API coordinates
4. **Event Handlers** - Map click events for RSB-7 foundation

### Technical Specification

**File Structure Updates:**

```
weather-web/
├── index.html     (+20 lines: map container, toggle button)
├── style.css      (+50 lines: map styling, responsive breakpoints)
└── app.js         (+100 lines: Leaflet integration, event handlers)
```

**HTML Elements:**

- Map toggle button: "Show/Hide Map"
- Map container: div#map-container (initially hidden)
- Map controls: zoom, pan (Leaflet default)
- Marker display: city location pin

**CSS Layout:**

- Map container: full-width below weather cards
- Responsive map height: 300px (mobile), 400px (tablet/desktop)
- Toggle button styling consistent with existing buttons
- Map overlay: semi-transparent when expanded

**JavaScript Functions:**

| Function | Purpose |
|----------|---------|
| initializeMap() | Setup Leaflet.js with OSM tiles |
| centerMapOnLocation(lat, lon) | Center map on city coordinates |
| toggleMap() | Show/hide map container |
| addLocationMarker(lat, lon) | Add pin marker for city |
| handleMapClick(lat, lon) | Foundation for RSB-7 |

**API Integration:**

```javascript
// Use existing coordinates from weather API response
if (data.location && data.location.latitude) {
    centerMapOnLocation(data.location.latitude, data.location.longitude);
    addLocationMarker(data.location.latitude, data.location.longitude);
}
```

**Map Configuration:**

- Tile URL: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
- Attribution: OpenStreetMap contributors
- Default zoom: 10
- Max zoom: 18
- Min zoom: 2

### Implementation Approach

**Step 1:** Update HTML structure
- Add map container below forecast section
- Add map toggle button to search section
- Maintain semantic structure

**Step 2:** Extend CSS
- Add map container styling
- Implement responsive map dimensions
- Style toggle button consistently
- Add map transition animations

**Step 3:** Integrate Leaflet.js
- Add Leaflet CDN link to index.html
- Implement map initialization
- Add OSM tile layer
- Implement coordinate centering

**Step 4:** Connect to Weather API
- Extract coordinates from existing API responses
- Center map when city search completes
- Add location marker
- Handle coordinate-only responses (no location name)

**Step 5:** Test and refine
- Test with ambiguous city names (Paris, London, etc.)
- Verify map coordinates match API coordinates
- Test responsive behavior
- Test map toggle functionality

### Testing Strategy

**Functional Tests:**

| Test | Input | Expected Output |
|------|-------|----------------|
| City search with map | "Paris" | Map shows Paris location with weather |
| Ambiguous city | "London" | Map helps confirm correct London |
| Coordinate search | lat/lon query | Map centers on coordinates |
| Map toggle | Click button | Map shows/hides smoothly |
| Responsive map | Resize browser | Map adapts to screen size |

**Success Criteria:**

- Map displays city location correctly
- Map coordinates match API coordinates
- Toggle functionality works
- Responsive design maintained
- No impact on existing weather functionality

### Integration Notes

**Dependencies:**

- Sprint 4 WebUI (complete ✓)
- Sprint 3 REST API (complete ✓)
- Leaflet.js library (CDN, zero build impact)
- OpenStreetMap tiles (free service)

**Compatibility:**

- Extends existing weather-web/ without breaking changes
- Uses same coordinate data from weather API
- Maintains Oracle Redwood theme consistency
- Preserves responsive design patterns

**Reusability:**

- Map module ready for RSB-7 click functionality
- Coordinate handling reusable for future features
- Toggle pattern can be applied to other UI sections

### Documentation Requirements

**User Documentation:**

- How to use map for location confirmation
- Map controls explanation (zoom, pan)
- Toggle functionality description
- Browser requirements (no additional needed)

**Technical Documentation:**

- Leaflet.js integration approach
- OpenStreetMap tile configuration
- Coordinate synchronization logic
- Responsive map design patterns

### YOLO Mode Decisions

**Decision 1: Leaflet.js vs Other Libraries**
**Context**: Map library choice not specified
**Decision Made**: Use Leaflet.js with OpenStreetMap
**Rationale**: Lightweight (40KB), no API key required, excellent documentation, widely adopted
**Alternatives**: Mapbox GL (requires API key), Google Maps (paid), OpenLayers (more complex)
**Risk**: Low - Leaflet.js is industry standard for web mapping

**Decision 2: Map Integration Approach**
**Context**: How to add map without disrupting existing UI
**Decision Made**: Add as expandable section below weather cards
**Rationale**: Progressive enhancement, maintains existing UX, toggle for users who don't want map
**Alternatives**: Replace entire UI (disruptive), separate map page (fragmented experience)
**Risk**: Low - incremental approach safer for existing functionality

**Decision 3: Tile Service Selection**
**Context**: Map tile provider choice affects cost and performance
**Decision Made**: OpenStreetMap (free, no authentication)
**Rationale**: Zero cost, reliable service, no API keys to manage, good global coverage
**Alternatives**: Mapbox (free tier limited), Stamen Maps (style limitations), commercial providers
**Risk**: Low - OSM is stable and widely used

### Open Design Questions

None - YOLO mode proceeding with decisions documented above.

---

## RSB-7. WebUI: User clicks on a map to get forecast for this point

Status: Accepted

### Requirement Summary

Enable users to click anywhere on the integrated map to instantly receive weather forecast for that specific geographic point.

### Feasibility Analysis

**API Availability:**

✓ All required from Sprint 3 REST API:
- GET /weather?lat={lat}&lon={lon} → JSON forecast for coordinates
- Existing coordinate search function in app.js
- No API modifications needed

**Technical Constraints:**

- Build on RSB-6 map foundation
- Use existing Leaflet.js integration
- Maintain same UI patterns for weather display
- Reuse coordinate-based API call logic

**Risk Assessment:**

| Risk | Level | Mitigation |
|------|-------|------------|
| Click precision | Low | Leaflet handles click coordinates accurately |
| User confusion | Low | Clear visual indicators for clicked vs searched location |
| Performance | Low | Single API call per click, map tiles cached |
| State management | Low | Simple state flag for clicked location |

### Design Overview

**Architecture:**

```
RSB-6 Foundation
    └─ Leaflet.js map with OSM tiles
         └─ City location marker

RSB-7 Extension
    └─ Click event handler
         ├─ Extract click coordinates
         ├─ Call existing coordinate API function
         ├─ Display weather for clicked point
         └─ Add clicked location marker
```

**Key Components:**

1. **Click Handler** - Map click event processing
2. **Coordinate API** - Reuse existing searchByCoordinates()
3. **Visual Feedback** - Different marker for clicked vs searched location
4. **State Management** - Track active search mode (city vs point)

### Technical Specification

**JavaScript Functions:**

| Function | Purpose |
|----------|---------|
| handleMapClick(e) | Extract coordinates from map click |
| getWeatherForPoint(lat, lon) | Call existing coordinate API |
| addClickMarker(lat, lon) | Add different marker for clicked location |
| updateLocationDisplay(mode) | Update UI to show city vs point mode |

**Click Event Flow:**

1. User clicks anywhere on map
2. Extract click coordinates (lat, lon)
3. Call searchByCoordinates(lat, lon) (existing function)
4. Display weather data in same format as city search
5. Add different colored marker for clicked location
6. Update UI to indicate "point-based" weather

**Visual Differentiation:**

- City search: Blue marker (existing)
- Map click: Red marker (new)
- Location text: "Weather at [coordinates]" vs "[City, Country]"
- Clear visual distinction between search modes

**Error Handling:**

- Invalid coordinates (unlikely): Show generic error
- API failures: Reuse existing error handling
- Network issues: Reuse existing connection error logic

### Implementation Approach

**Step 1:** Extend Click Handler
- Add Leaflet click event listener
- Implement coordinate extraction
- Connect to existing API client logic

**Step 2:** Visual Differentiation
- Create red marker style for clicked locations
- Update location display text format
- Add mode indicators in UI

**Step 3:** State Management
- Add flag to track current search mode
- Update UI elements based on mode
- Handle mode switching seamlessly

**Step 4:** Integration Testing
- Test clicks at various global locations
- Verify weather displays correctly
- Test mode switching between city/point searches
- Test error handling

### Testing Strategy

**Functional Tests:**

| Test | Input | Expected Output |
|------|-------|----------------|
| Map click | Click ocean near Australia | Weather for that ocean point |
| Mode switch | City search → map click | UI updates to show point-based weather |
| Multiple clicks | Click different locations | Each click updates weather independently |
| Invalid area | Click on map edge | Graceful error or retry option |

**Success Criteria:**

- Click anywhere on map works
- Weather displays for clicked coordinates
- Visual distinction between city/point searches
- Seamless mode switching
- No impact on existing city search functionality

### Integration Notes

**Dependencies:**

- RSB-6 map integration (prerequisite ✓)
- Existing coordinate API function (reused ✓)
- Current weather display components (reused ✓)

**Compatibility:**

- Builds directly on RSB-6 foundation
- Uses same API endpoint for coordinate queries
- Maintains consistent UI patterns
- No breaking changes to existing functionality

**Reusability:**

- Click handler pattern for future map interactions
- Coordinate API integration reusable
- Visual differentiation system for other location types

### Documentation Requirements

**User Documentation:**

- How to click on map for weather
- Visual difference between city/point searches
- Map controls and interaction
- Expected behavior for different click scenarios

**Technical Documentation:**

- Click event handling patterns
- Coordinate extraction and validation
- State management approach
- Integration with existing API client

### YOLO Mode Decisions

**Decision 1: Visual Differentiation Strategy**
**Context**: Need to distinguish clicked vs searched locations
**Decision Made**: Blue marker for cities, red marker for clicked points
**Rationale**: Clear visual distinction, intuitive color coding, minimal UI changes
**Alternatives**: Different icons (more complex), animations (performance impact), labels (clutter)
**Risk**: Low - simple color differentiation is standard practice

**Decision 2: State Management Approach**
**Context**: Track whether user is searching by city or clicking map
**Decision Made**: Simple mode flag with UI text updates
**Rationale**: Minimal complexity, clear user feedback, easy to implement
**Alternatives**: Complex state machine (overkill), separate views (fragmented), URL routing (unnecessary)
**Risk**: Low - simple flag approach sufficient for this use case

**Decision 3: Error Handling for Clicks**
**Context**: How to handle invalid coordinates or API failures from map clicks
**Decision Made**: Reuse existing error handling, add click-specific context
**Rationale**: Consistent user experience, minimal code duplication, proven patterns
**Alternatives**: Separate error system (complex), silent failures (bad UX), custom error types (over-engineering)
**Risk**: Low - leveraging existing, tested error handling

### Open Design Questions

None - YOLO mode proceeding with decisions documented above.

---

# Design Summary

## Overall Architecture

Extension of existing WebUI with interactive Leaflet.js map. Two-phase implementation: RSB-6 establishes map display with city location markers, RSB-7 adds click-to-get-weather functionality. Maintains all existing weather functionality while adding geographic interaction capabilities.

## Shared Components

- Sprint 4 WebUI (complete foundation)
- Sprint 3 REST API (coordinate endpoints)
- Leaflet.js mapping library
- OpenStreetMap tile service
- Existing coordinate search logic

## Design Risks

All low. Proven technologies (Leaflet.js, OSM), building on tested foundation, incremental feature addition.

## Resource Requirements

- Leaflet.js library (CDN, ~40KB)
- OpenStreetMap tile access (free)
- No API keys or authentication required
- No additional build tools or dependencies

## Design Approval Status

**Proposed** (YOLO auto-approval follows)

---

**Token Usage**: ~85K tokens for elaboration phase.