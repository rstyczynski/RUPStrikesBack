# Sprint 6 - Design

## RSB-7. WebUI: User clicks on a map to get forecast for this point

Status: Accepted

### Requirement Summary

Add click handler to map that extracts coordinates and requests weather forecast for clicked location.

### Feasibility Analysis

**API Availability:**
- `/weather/coord?lat={lat}&lon={lon}` endpoint exists (Sprint 3)
- Leaflet.js click event API available
- No API changes required

**Technical Constraints:**
- Leaflet.js map already initialized
- Click event provides lat/lon directly

**Risk Assessment:**
- Low: Standard Leaflet.js feature
- Low: API endpoint exists

### Design Overview

**Architecture:**
- Add click event listener to map
- Extract coordinates from event
- Call existing API endpoint
- Use existing displayWeather() function

**Key Components:**
1. Map click handler: Extract lat/lon from Leaflet click event
2. API call: Use existing searchByCoordinates() pattern
3. Display: Reuse displayWeather() function

**Data Flow:**
1. User clicks map
2. Leaflet fires click event with lat/lon
3. Handler extracts coordinates
4. Call `/weather/coord?lat={lat}&lon={lon}`
5. Display weather using displayWeather()

### Technical Specification

**APIs Used:**
- Leaflet.js: `map.on('click', handler)` - Map click event
- REST API: `GET /weather/coord?lat={lat}&lon={lon}` - Weather by coordinates

**Data Structures:**
- Click event: `{ latlng: { lat: number, lng: number } }`

**Scripts/Tools:**
- File: app.js
  - Purpose: Add map click handler
  - Interface: `map.on('click', handleMapClick)`
  - Dependencies: Leaflet.js, existing API functions

**Error Handling:**
- API errors: Use existing error handling
- Invalid coordinates: Leaflet validates automatically

### Implementation Approach

**Step 1:** Add click event listener to map after initialization
**Step 2:** Extract lat/lon from click event
**Step 3:** Call API with coordinates
**Step 4:** Display weather using existing function

### Testing Strategy

**Functional Tests:**
1. Click map, verify weather displayed
2. Click different locations, verify updates
3. Verify coordinates match clicked point

**Edge Cases:**
1. Click outside map bounds (should not trigger)

**Success Criteria:**
- Clicking map displays weather for clicked location
- Coordinates match clicked point

### Integration Notes

**Dependencies:**
- Sprint 5: Map display
- Sprint 3: API endpoint
- Sprint 4: Display function

**Compatibility:**
- Extends existing map functionality
- No breaking changes

**Reusability:**
- Reuses existing API call pattern
- Reuses existing display function

### Design Decisions

**Decision 1:** Use existing searchByCoordinates() pattern
**Rationale:** Consistency with existing code
**Alternatives Considered:** New function (rejected - unnecessary duplication)

### Open Design Questions

None
