# Sprint 5 - Design

## RSB-6. WebUI: Add map presentation for city location disambiguation

Status: Accepted

### Requirement Summary

Add map visualization to WebUI showing city location coordinates from weather API response for location disambiguation.

### Feasibility Analysis

**API Availability:**
- Weather API `/weather/city` endpoint returns `location` object with `latitude` and `longitude` fields
- Coordinates already available in existing API response
- No API changes required

**Technical Constraints:**
- Leaflet.js requires CDN or local files
- Map container needs defined height/width
- Browser must support JavaScript

**Risk Assessment:**
- Low: Standard library integration
- Low: Coordinates already available
- Low: Frontend-only change

### Design Overview

**Architecture:**
- Add map container div to HTML
- Include Leaflet.js CSS/JS from CDN
- Initialize map in JavaScript when weather data displayed
- Update map center on new searches

**Key Components:**
1. Map container in HTML layout
2. Leaflet.js library integration
3. Map initialization function
4. Map update in displayWeather function

**Data Flow:**
1. User searches city
2. API returns location with coordinates
3. displayWeather extracts lat/lon
4. Map initialized/updated with coordinates
5. Map displays centered on city location

### Technical Specification

**APIs Used:**
- Leaflet.js CDN: https://unpkg.com/leaflet@1.9.4/dist/leaflet.css
- Leaflet.js JS: https://unpkg.com/leaflet@1.9.4/dist/leaflet.js

**Data Structures:**
- Location object: `{ latitude: number, longitude: number }`
- Map instance: Leaflet map object

**Scripts/Tools:**
- File: index.html
  - Purpose: Add map container div and Leaflet CDN links
- File: app.js
  - Purpose: Initialize and update map with coordinates
  - Interface: initMap(lat, lon), updateMap(lat, lon)
  - Dependencies: Leaflet.js library

**Error Handling:**
- Missing coordinates: Skip map display, show weather only
- Map initialization failure: Log error, continue with weather display

### Implementation Approach

**Step 1:** Add Leaflet CSS/JS to index.html head
**Step 2:** Add map container div to HTML layout
**Step 3:** Create initMap function in app.js
**Step 4:** Call initMap/updateMap in displayWeather function
**Step 5:** Extract coordinates from location object

### Testing Strategy

**Functional Tests:**
1. Map displays after city search
2. Map shows correct location coordinates
3. Map updates on new city search
4. Map works with coordinate search

**Edge Cases:**
1. Missing coordinates in API response
2. Invalid coordinate values
3. Map container not found

**Success Criteria:**
- Map displays city location after search
- Map updates dynamically with new searches
- Map visible alongside weather data

### Integration Notes

**Dependencies:**
- Sprint 4: weather-web WebUI structure
- Sprint 3: weather-api location response

**Compatibility:**
- Extends existing displayWeather function
- No changes to existing weather display
- Map added as additional visual element

**Reusability:**
- Leaflet.js map initialization reusable pattern
- Coordinate extraction from location object

### Documentation Requirements

**User Documentation:**
- Map shows city location for disambiguation
- Map updates with search results

**Technical Documentation:**
- Leaflet.js integration approach
- Map initialization and update logic

### Design Decisions

**Decision 1:** Use Leaflet.js from CDN
**Rationale:** Standard open-source library, easy integration, no build step
**Alternatives Considered:** OpenLayers (more complex), Google Maps (requires API key)

### Open Design Questions

None
