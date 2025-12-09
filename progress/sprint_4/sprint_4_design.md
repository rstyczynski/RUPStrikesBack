# Sprint 4 - Design

## RSB-5. Weather forecast WebUI

Status: Accepted

### Requirement Summary

Web-based GUI for weather forecast. Single-page application consuming Sprint 3 REST API. Visual weather display with responsive layout.

### Feasibility Analysis

**API Availability:**

✓ All required from Sprint 3 REST API:
- GET /weather?city={name} → JSON (current + daily + location)
- GET /weather?lat={lat}&lon={lon} → JSON (forecast)
- GET /health → Status check
- CORS headers already configured

**Technical Constraints:**

- Vanilla HTML/CSS/JS (no build tools for MVP simplicity)
- Browser ES6+ support required
- API runs on localhost:8080 (hardcoded for MVP)
- Unicode weather symbols (no external icon dependencies)

**Risk Assessment:**

| Risk | Level | Mitigation |
|------|-------|------------|
| API URL hardcoded | Low | Document assumption, parameterize in future sprint |
| Browser compatibility | Low | Target modern browsers (ES6+), test Chrome/Firefox |
| No error retry logic | Low | Display clear error messages, user can retry manually |
| Layout on small screens | Low | Mobile-first CSS, test responsive breakpoints |

### Design Overview

**Architecture:**

```
Browser
  └─ index.html (structure)
       ├─ style.css (presentation)
       └─ app.js (behavior)
            └─ fetch() → localhost:8080/weather → display results
```

**Key Components:**

1. **index.html** - Page structure, input form, display containers
2. **style.css** - Responsive layout, weather card styling
3. **app.js** - API calls, DOM manipulation, error handling

**Data Flow:**

1. User enters city name or clicks current location
2. JavaScript validates input
3. Fetch API calls /weather endpoint
4. Parse JSON response
5. Update DOM with weather data
6. Display errors if API fails

### Technical Specification

**File Structure:**

```
weather-web/
├── index.html     (~80 lines: form, weather display, footer)
├── style.css      (~100 lines: layout, cards, responsive)
└── app.js         (~150 lines: API calls, DOM updates, error handling)
```

**HTML Elements:**

- Search form: text input + submit button
- Location button: "Use Current Location" (browser geolocation)
- Weather display: current conditions + 3-day forecast cards
- Error container: show API/network errors
- Loading spinner: display during fetch

**CSS Layout:**

- Mobile-first approach (min 320px width)
- Flexbox for form layout
- CSS Grid for forecast cards (responsive: 1/2/3 columns)
- Weather cards: icon, temp, description
- Breakpoints: 480px (tablet), 768px (desktop)

**JavaScript Functions:**

| Function | Purpose |
|----------|---------|
| searchCity(city) | Fetch weather by city name |
| getCurrentLocation() | Get browser geolocation, fetch by coords |
| displayWeather(data) | Update DOM with weather data |
| displayError(message) | Show error message to user |
| getWeatherIcon(code) | Map WMO weather code to Unicode symbol |
| formatDate(dateStr) | Format YYYY-MM-DD to readable date |

**API Integration:**

```javascript
// City search
fetch(`http://localhost:8080/weather?city=${encodeURIComponent(city)}`)
  .then(res => res.json())
  .then(data => displayWeather(data))
  .catch(err => displayError(err.message))

// Coordinate search
fetch(`http://localhost:8080/weather?lat=${lat}&lon=${lon}`)
  .then(res => res.json())
  .then(data => displayWeather(data))
  .catch(err => displayError(err.message))
```

**Weather Icons Mapping:**

WMO weather codes → Unicode symbols:
- 0-1 (Clear/Mainly clear): ☀️
- 2-3 (Partly cloudy/Overcast): ⛅
- 45-48 (Fog): 🌫️
- 51-67 (Rain): 🌧️
- 71-77 (Snow): ❄️
- 80-99 (Thunderstorm): ⛈️

**Error Handling:**

- Network errors: "Unable to connect to weather service"
- API errors (response.error field): Display message from API
- Invalid city: API returns 500, show "City not found"
- Geolocation denied: "Location access denied. Please search by city."

### Implementation Approach

**Step 1:** Create index.html with semantic structure
- Form with city input
- Weather display containers
- Error/loading elements

**Step 2:** Create style.css
- CSS reset/normalize
- Mobile-first base styles
- Flexbox form layout
- Grid forecast cards
- Responsive breakpoints

**Step 3:** Create app.js skeleton
- Event listeners (form submit, location button)
- Fetch function stubs
- DOM manipulation functions

**Step 4:** Implement API integration
- City search function
- Coordinate search function
- Error handling

**Step 5:** Implement display logic
- Parse JSON response
- Map weather codes to icons
- Update DOM elements
- Loading states

**Step 6:** Test and refine
- Test various cities
- Test error cases
- Test responsive layout
- Browser compatibility check

### Testing Strategy

**Functional Tests:**

| Test | Input | Expected Output |
|------|-------|----------------|
| City search | "London" | Display London weather + location |
| Invalid city | "ZZZZZZZ" | Error message displayed |
| Current location | Click button | Geolocation → coords → weather |
| Location denied | Deny permission | Error message displayed |
| API down | Stop API server | Network error displayed |
| Responsive layout | Resize browser | Layout adapts (1/2/3 columns) |

**Success Criteria:**

- Weather displayed correctly for valid cities
- Error messages shown for failures
- Responsive layout works on 320px+ screens
- All browsers (Chrome, Firefox, Safari) work
- Loading state visible during fetch

### Integration Notes

**Dependencies:**

- Sprint 3 REST API (✓ complete, tested, CORS ready)
- Browser geolocation API (standard, widely supported)

**Compatibility:**

- API response format documented in Sprint 3
- No modifications to API needed
- WebUI is pure client-side (no server requirements)

**Reusability:**

- CSS can be extended for future features (maps - Sprint 5)
- JavaScript modular enough to add new endpoints

### Documentation Requirements

**User Documentation:**

- How to open the application (open index.html in browser)
- How to search for a city
- How to use current location
- What weather codes mean
- API server must be running (localhost:8080)

**Technical Documentation:**

- File structure
- API endpoint usage
- Weather code mappings
- Browser requirements
- Development setup (no build step)

### YOLO Mode Decisions

**Decision 1: Vanilla JS (No Framework)**
**Context**: RSB-5 mentions "modern frontend framework"
**Decision Made**: Use vanilla HTML/CSS/JS without React/Vue/etc.
**Rationale**: MVP simplicity. No build tools, zero dependencies, faster development. Frameworks add complexity without clear MVP benefit.
**Alternatives**: React (overkill for single page), Vue (adds npm/webpack), Svelte (same issue)
**Risk**: Low - can migrate to framework in future sprint if needed

**Decision 2: Hardcoded API URL**
**Context**: No configuration mechanism specified
**Decision Made**: Hardcode `http://localhost:8080` in app.js
**Rationale**: Dev MVP scope. Matches Sprint 3 default. Easy to find/change later.
**Alternatives**: Environment variable (requires build), config file (over-engineering)
**Risk**: Low - clearly documented, trivial to parameterize

**Decision 3: Unicode Weather Symbols**
**Context**: "Visual elements" requirement, icon source unspecified
**Decision Made**: Use Unicode emoji weather symbols (☀️🌧️❄️⛈️)
**Rationale**: Zero external dependencies, works everywhere, sufficient for MVP. Accessible.
**Alternatives**: Icon library (adds dependency), SVG (more work), images (more assets)
**Risk**: Low - looks good on modern systems, can upgrade to icon library later

### Open Design Questions

None. YOLO mode auto-approval proceeding.

---

# Design Summary

## Overall Architecture

Single-page application (SPA) with three files. Pure client-side, no server component. Consumes Sprint 3 REST API via fetch(). Mobile-first responsive design.

## Shared Components

- Sprint 3 REST API (complete reuse, no modifications)
- Browser geolocation API (standard)
- Unicode emoji (built-in)

## Design Risks

All low. Standard web technologies, proven patterns, minimal dependencies.

## Resource Requirements

- Browser with ES6+ support (Chrome 51+, Firefox 54+, Safari 10+)
- Sprint 3 API running on localhost:8080
- No build tools or npm required

## Design Approval Status

**Proposed** (YOLO auto-approval follows)

---

**Token Usage**: ~57K tokens for elaboration phase.
