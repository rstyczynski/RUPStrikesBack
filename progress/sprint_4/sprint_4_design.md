# Sprint 4 - Design

**Mode:** YOLO
**Speed:** FAST

## RSB-5: Weather forecast WebUI

Status: Accepted

### Requirement Summary

Web browser UI consuming Sprint 3 REST API. Interactive weather display with visual elements, responsive design.

### Feasibility Analysis

**API Availability:**
✅ Sprint 3 REST API: `http://localhost:8080/weather?city=X`
✅ Go net/http for static file serving
✅ HTML/CSS/JS (browser standard APIs)

**Technical Constraints:**
- Must not modify REST API (Sprint 3)
- CORS already enabled
- Separate binary: `./weather-web`

**Risk Assessment:**
- Low risk - standard web development
- REST API proven in Sprint 3

### Design Overview

**Architecture:**
```
Browser → Go HTTP Server (8081) → Static Files (HTML/CSS/JS)
           ↓
        Fetch API → REST API (8080) → Weather Data JSON
```

**Key Components:**
1. **Go HTTP Server**: Serves static files on port 8081
2. **index.html**: UI layout, city input form
3. **app.js**: Fetch API calls, DOM manipulation
4. **style.css**: Responsive design, weather icons

**Data Flow:**
```
User enters city → JS fetch('/weather?city=X') → REST API
→ JSON response → JS updates DOM → Display weather
```

### Technical Specification

**Project Structure:**
```
weather-web/
├── main.go           # HTTP server (port 8081)
├── static/
│   ├── index.html    # UI
│   ├── app.js        # Logic
│   └── style.css     # Styling
└── weather-web       # Binary
```

**API Integration:**

| Operation | Method | URL | Response |
|-----------|--------|-----|----------|
| Get weather | GET | http://localhost:8080/weather?city=London | JSON with location + forecast |

**UI Components:**

| Component | Purpose |
|-----------|---------|
| Search form | City input + submit button |
| Location display | City name, country, coordinates |
| Current weather | Temperature, conditions, weather icon/emoji |
| 3-day forecast | Daily temps, conditions, emojis |
| Error display | API errors, missing city |

**Data Structures:**

API response (from Sprint 3):
```json
{
  "location": {
    "name": "London",
    "country": "United Kingdom",
    "latitude": 51.5,
    "longitude": -0.1
  },
  "forecast": {
    "current": {...},
    "daily": {...}
  }
}
```

**Error Handling:**

| Scenario | Handling |
|----------|----------|
| API offline | Display error message |
| Invalid city | Show API 404 error |
| Empty input | Client-side validation |
| Network error | Retry suggestion |

### Implementation Approach

**Step 1:** Create `weather-web/` directory structure
**Step 2:** Write `main.go` HTTP server (port 8081, serve static/)
**Step 3:** Create `static/index.html` with form + display sections
**Step 4:** Write `static/app.js` with fetch logic
**Step 5:** Style `static/style.css` with responsive layout
**Step 6:** Build binary: `go build -o weather-web`

### Testing Strategy

**Functional Tests:**
1. Server starts on port 8081
2. Browser loads index.html successfully
3. Search for "London" → displays weather data
4. Search for invalid city → shows error
5. Responsive design works (desktop/mobile)
6. CORS works (different origins)

**Edge Cases:**
1. Empty city input
2. REST API offline
3. Slow API response
4. Special characters in city name

**Success Criteria:**
- Server runs and serves static files ✅
- Weather data displays correctly ✅
- Error handling works ✅
- Responsive UI ✅

### Integration Notes

**Dependencies:**
- Sprint 3 REST API (must be running)
- No Go dependencies (stdlib only)
- Browser with Fetch API support

**Compatibility:**
- Uses existing REST API unchanged
- Follows `weather-cli` → `weather-api` → `weather-web` pattern

**Reusability:**
- None (frontend is self-contained)

### Documentation Requirements

**User Documentation:**
- How to start WebUI server
- How to use the interface
- Example searches

**Technical Documentation:**
- Architecture overview
- File structure
- API integration

### Design Decisions

**Decision 1: Technology Stack**
**Choice:** Vanilla HTML/CSS/JS + Go static server
**Rationale:** Simple, no build step, follows Go pattern from previous sprints
**Alternatives:** React, Vue, Angular (too complex for MVP)

**Decision 2: Port Number**
**Choice:** 8081
**Rationale:** Sequential after REST API (8080), non-privileged
**Alternatives:** 3000, 5000 (less consistent)

**Decision 3: Visual Elements**
**Choice:** Weather emojis + basic CSS styling
**Rationale:** Simple, no external assets, maps deferred to Sprint 5 (RSB-6)
**Alternatives:** Icon fonts, SVGs (overkill for MVP)

### Open Design Questions

None

---

## YOLO Mode Decisions

### Decision 1: Frontend Framework
**Context:** Framework choice not specified
**Decision Made:** Vanilla HTML/CSS/JS (no framework)
**Rationale:** Keeps it simple, no build tools, consistent with Go backend approach
**Alternatives Considered:** React, Vue (rejected - too heavy for MVP)
**Risk:** Low - can add framework later if needed

### Decision 2: Visual Complexity
**Context:** "Visual elements like icons, maps, charts" mentioned but not detailed
**Decision Made:** Weather emojis + basic text display, defer maps to Sprint 5
**Rationale:** RSB-6 explicitly adds map feature, RSB-5 is foundation
**Alternatives Considered:** Full charts library (rejected - over-engineering)
**Risk:** Low - meets MVP requirements, Sprint 5 adds maps

### Decision 3: Static File Serving
**Context:** WebUI hosting approach not specified
**Decision Made:** Go HTTP server serving static files
**Rationale:** Consistent with CLI/API pattern, single binary distribution
**Alternatives Considered:** nginx, separate web server (rejected - adds complexity)
**Risk:** Low - Go stdlib is proven

---

# Design Summary

## Overall Architecture

Simple 3-tier architecture:
- **Tier 1**: Browser (HTML/CSS/JS)
- **Tier 2**: Go static file server (port 8081)
- **Tier 3**: REST API from Sprint 3 (port 8080)

## Shared Components

- REST API (Sprint 3) - unchanged
- No shared Go code (WebUI is self-contained)

## Design Risks

None - straightforward implementation

## Resource Requirements

- Go 1.21+ (already installed)
- Modern browser with Fetch API
- Sprint 3 REST API running

## Design Approval Status

✅ **Accepted (YOLO mode auto-approved)**

## LLM Token Statistics

**Tokens Used:** ~52K (cumulative to elaboration)
