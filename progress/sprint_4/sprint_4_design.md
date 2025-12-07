# Sprint 4 - Design

## RSB-5. Weather forecast WebUI

Status: Accepted

### Requirement Summary

Web-based GUI consuming REST API, providing interactive weather display in browser.

### Feasibility Analysis

**API Availability:**
- ✅ REST API from Sprint 3: `/weather/city?city={name}` and `/weather/coord?lat={lat}&lon={lon}`
- ✅ JSON responses with location and forecast data
- ✅ API running on port 8080

**Technical Constraints:**
- Frontend-only (no backend server)
- Static HTML/CSS/JavaScript files
- CORS may need configuration if API and WebUI on different origins

**Risk Assessment:**
- Low: Standard web technologies
- Low: API already tested and working
- Medium: CORS if serving from different origin

### Design Overview

**Architecture:**
- Static HTML page with embedded CSS/JavaScript
- JavaScript fetch API to call weather-api
- DOM manipulation for display
- Responsive layout

**Key Components:**
1. HTML structure (index.html)
2. CSS styling (styles.css or embedded)
3. JavaScript API client (app.js or embedded)
4. Weather display components

**Data Flow:**
1. User enters city name or coordinates
2. JavaScript calls weather-api endpoint
3. Parse JSON response
4. Display weather data in UI
5. Show error if API call fails

### Technical Specification

**APIs Used:**
- Endpoint: `http://localhost:8080/weather/city?city={name}`
  - Method: GET
  - Purpose: Get weather by city name
  - Response: JSON with location and forecast

- Endpoint: `http://localhost:8080/weather/coord?lat={lat}&lon={lon}`
  - Method: GET
  - Purpose: Get weather by coordinates
  - Response: JSON with forecast

**Data Structures:**
```json
{
  "location": {
    "name": "San Francisco",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "country": "United States"
  },
  "forecast": {
    "current": {
      "temperature_2m": 15.5,
      "weather_code": 1
    },
    "daily": {
      "time": ["2025-01-27", "2025-01-28"],
      "temperature_2m_max": [18, 20],
      "temperature_2m_min": [12, 14]
    }
  }
}
```

**Scripts/Tools:**
- File: `index.html`
  - Purpose: Main HTML page
  - Interface: Browser opens file
  - Dependencies: None

- File: `app.js` (or embedded)
  - Purpose: JavaScript API client and UI logic
  - Interface: Called by HTML page
  - Dependencies: weather-api running on port 8080

**Error Handling:**
- Network errors: Display user-friendly message
- Invalid input: Validate before API call
- API errors: Show error message from API response

### Implementation Approach

**Step 1:** Create HTML structure with search form and display area
**Step 2:** Add CSS for styling and layout
**Step 3:** Implement JavaScript API client functions
**Step 4:** Add weather display rendering
**Step 5:** Add error handling and user feedback

### Testing Strategy

**Functional Tests:**
1. Search by city name - verify weather display
2. Search by coordinates - verify weather display
3. Invalid city name - verify error handling
4. API server down - verify error message

**Edge Cases:**
1. Empty input
2. Special characters in city name
3. Invalid coordinates

**Success Criteria:**
- WebUI displays weather data from API
- Both city and coordinate queries work
- Error cases handled gracefully

### Integration Notes

**Dependencies:**
- Sprint 3: weather-api REST API (must be running)

**Compatibility:**
- Consumes existing weather-api endpoints
- No API changes required
- Works with any modern browser

**Reusability:**
- HTML/CSS/JS structure can be extended for future features

### Documentation Requirements

**User Documentation:**
- How to start weather-api server
- How to open WebUI in browser
- How to search for weather

**Technical Documentation:**
- API endpoint usage
- JavaScript structure

### Design Decisions

**Decision 1:** Static files (no build process)
**Rationale:** Simple, fast, no dependencies
**Alternatives Considered:** React/Vue frameworks (overkill for MVP)

**Decision 2:** Embedded CSS/JS (single HTML file or separate files)
**Rationale:** Easy deployment, minimal structure
**Alternatives Considered:** Build tools (unnecessary complexity)

### Open Design Questions

None

---

# Design Summary

## Overall Architecture

WebUI as static frontend consuming REST API. Three-tier architecture complete: CLI → REST API → WebUI.

## Shared Components

None (WebUI is separate frontend)

## Design Risks

Low - standard web stack, proven API

## Resource Requirements

- Modern web browser
- weather-api server running on port 8080
- Static file server (or file:// protocol)

## Design Approval Status

Accepted
