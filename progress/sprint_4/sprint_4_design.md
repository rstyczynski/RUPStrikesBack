# Sprint 4 - Design

## RSB-5. Weather forecast WebUI

Status: Accepted

### Requirement Summary

Build a web-based graphical user interface in Go that provides an interactive weather forecast experience accessible through web browsers. The WebUI must be located in `./weather-web/`, consume the REST API from Sprint 3 via HTTP requests, and provide a modern interactive user experience with visual elements like weather icons. This creates the presentation tier in the three-tier architecture, separating user interface from data logic.

### Feasibility Analysis

**API Availability:**

All required functionality available from Sprint 3:

1. **GET /weather/city?name={city}** - `weather-api` REST endpoint
   - Retrieves weather forecast for a city name
   - Returns JSON: `ForecastResponse` structure
   - Status: ✅ Implemented and tested in Sprint 3
   - Documentation: `progress/sprint_3/sprint_3_design.md`

2. **GET /weather/coordinates?lat={lat}&lon={lon}** - `weather-api` REST endpoint
   - Retrieves weather forecast for GPS coordinates
   - Returns JSON: `ForecastResponse` structure
   - Status: ✅ Implemented and tested in Sprint 3
   - Documentation: `progress/sprint_3/sprint_3_design.md`

3. **GET /health** - `weather-api` health check
   - Verifies API availability
   - Returns JSON: `{"status": "ok"}`
   - Status: ✅ Implemented and tested in Sprint 3

**Go Standard Library Availability:**

All required HTTP server and templating functionality available:
- `net/http` - HTTP server, routing, handlers, file serving
- `html/template` - HTML template rendering with data injection
- `embed` - Embed static files in binary (optional for deployment)
- `encoding/json` - JSON decoding for API responses
- `io` - HTTP request/response reading
- `fmt` - String formatting
- `log` - Server logging
- `os` - Environment variables, signals
- `os/signal` - Graceful shutdown
- `context` - Timeout and cancellation
- `time` - Timeouts and durations

**Frontend Technology Availability:**

Browser-native technologies (no build tools required):
- HTML5 - Modern semantic markup
- CSS3 - Styling, responsive design, flexbox/grid layouts
- JavaScript ES6+ - Fetch API for HTTP requests, DOM manipulation
- Browser support: Chrome, Firefox, Safari, Edge (latest versions)

**Technical Constraints:**

- Platform: Cross-platform (macOS, Linux, Windows)
- Go language: Established in Sprint 1
- No external dependencies for MVP (standard library + static files)
- Internet connectivity required (REST API dependency)
- REST API must be running on localhost:8080
- No direct import of weather-cli package (architecture separation)

**Risk Assessment:**

- **REST API Dependency:** Low - API tested and stable from Sprint 3
  - Mitigation: Health check before operations, clear error messages if API unavailable
- **CORS Issues:** Medium - Browser may block cross-origin requests
  - Mitigation: Both servers on localhost (same origin), or add CORS headers to weather-api if needed
- **Browser Compatibility:** Low - Modern JavaScript ES6+ well-supported
  - Mitigation: Target modern browsers only (no IE11 support needed)
- **HTML Template Rendering:** Low - Go html/template is production-ready
  - Mitigation: Standard library, widely used in production
- **Static File Serving:** Very Low - Standard http.FileServer
  - Mitigation: Built-in functionality, well-tested

**Feasibility Conclusion:** HIGH - All components available, REST API proven, Go web server pattern established in Sprint 3, no external frontend dependencies needed for MVP

---

## YOLO Mode Decisions

This sprint was designed in YOLO (autonomous) mode. The following design decisions were made:

### Decision 1: Server Technology Choice
**Context**: Need to serve WebUI. Options: Go server with templates, Node.js + React, separate static server, etc.
**Decision Made**: Go HTTP server with html/template and static file serving
**Rationale**:
- Consistency with Sprint 1-3 (all Go)
- Single binary deployment (simple)
- No Node.js/npm build tools needed
- Server-side rendering for initial page load
- Can proxy API calls if CORS issues arise
- html/template provides security (auto-escaping)
**Alternatives Considered**:
- React/Vue/Svelte SPA: Requires build tools, npm dependencies, more complex setup
- Static HTML only: No template rendering, would need separate API proxy for CORS
- Node.js Express: Adds new technology to stack, breaks consistency
**Risk**: Low - Adequate for requirements, follows established patterns, can enhance later

### Decision 2: Frontend Framework Choice
**Context**: Need interactive JavaScript for API calls. Options: vanilla JS, React, Vue, Alpine.js, jQuery, etc.
**Decision Made**: Vanilla JavaScript (ES6+) with Fetch API
**Rationale**:
- Zero dependencies (no npm, no build step)
- Modern browsers support Fetch API natively
- Simple use case (form submission, API calls, DOM updates)
- No complex state management needed
- Fast page load (no framework download)
- Consistent with MVP simplicity requirement
**Alternatives Considered**:
- React: Overkill for simple form + display, requires build tools
- jQuery: Legacy, unnecessary with modern JavaScript
- Alpine.js: Minimal framework, but still external dependency
**Risk**: Very Low - Sufficient for requirements, no dependencies to manage

### Decision 3: CSS Approach
**Context**: Need responsive design. Options: CSS framework (Bootstrap, Tailwind), CSS-in-JS, hand-written CSS
**Decision Made**: Hand-written responsive CSS with mobile-first approach
**Rationale**:
- MVP simplicity (no framework overhead)
- Full control over styling
- No external dependencies
- CSS Grid and Flexbox sufficient for layout
- Media queries for responsive breakpoints
- Lightweight (faster load times)
**Alternatives Considered**:
- Bootstrap: Heavy framework for simple UI, external dependency
- Tailwind: Requires build step for production
- CSS-in-JS: Adds complexity, requires JavaScript framework
**Risk**: Low - Modern CSS features sufficient, can add framework later if needed

### Decision 4: Weather Icon Solution
**Context**: Requirements mention "visual elements like weather icons". Need to choose icon implementation.
**Decision Made**: Unicode weather symbols (☀️ ☁️ 🌧️ ⛈️ ❄️ 🌫️) with weather code mapping
**Rationale**:
- Zero dependencies (no icon library download)
- Universal browser support
- Visually clear and recognizable
- No licensing concerns
- Easy mapping from Open-Meteo weather codes
- Can upgrade to SVG/icon font later if needed
**Alternatives Considered**:
- Weather Icons font: External dependency, licensing check needed
- SVG icons: Would need to create or find free set
- Image files: Requires storage, loading overhead
- Font Awesome: Requires external library, limited weather icons
**Risk**: Very Low - Unicode provides adequate visual feedback, widely supported

### Decision 5: UI Layout Structure
**Context**: Need to organize input forms and weather display. Options: single-page tabs, separate pages, unified form, etc.
**Decision Made**: Single-page application with tab/toggle for city vs coordinates input
**Rationale**:
- Matches REST API's two endpoints (city, coordinates)
- Clear user mental model (choose search type)
- No page reloads (better UX)
- JavaScript controls tab switching
- Follows CLI pattern (two input modes)
**Alternatives Considered**:
- Separate pages for city/coordinates: More navigation, worse UX
- Auto-detect input type: Ambiguous, confusing for users
- Single unified field: Complex parsing logic
**Risk**: Low - Clear UX, matches API contract

### Decision 6: Weather Data Display Format
**Context**: Need to display current weather and 3-day forecast. Options: cards, table, list, chart, etc.
**Decision Made**: Card-based layout with current weather prominent, 3-day forecast as grid
**Rationale**:
- Visually clear separation (current vs forecast)
- Responsive grid for forecast days
- Industry standard pattern (weather apps)
- Easy to scan and read
- Flexible for mobile/desktop
**Alternatives Considered**:
- Table layout: Less visual, harder to make responsive
- List layout: Less scannable
- Chart/graph: Overkill for 3-day forecast, would defer to Sprint 6
**Risk**: Very Low - Standard weather app pattern

### Decision 7: API Integration Method
**Context**: WebUI needs to call REST API. Options: direct fetch from browser, server-side proxy, hybrid approach
**Decision Made**: Direct browser Fetch API calls to http://localhost:8080, with fallback plan for server-side proxy
**Rationale**:
- Simplest approach (direct API consumption)
- Localhost requests typically allowed by browsers
- Reduces server load (client does API calls)
- Clear separation of concerns
- Can add proxy endpoint if CORS issues found during testing
**Alternatives Considered**:
- Server-side proxy for all API calls: More server code, single point of failure
- Server-side rendering with API calls: Slower UX, full page reloads
**Risk**: Medium - CORS could be issue, but mitigated by localhost same-origin and fallback plan

### Decision 8: Error Handling Strategy
**Context**: Need to handle API errors, network failures, validation errors. Options: simple alerts, inline messages, toast notifications, etc.
**Decision Made**: Inline error messages in dedicated error display area with appropriate styling
**Rationale**:
- Non-intrusive (no popups/alerts)
- Persistent (user can read at their pace)
- Accessible (screen reader compatible)
- Clear visual distinction (red border/background)
- Can show specific error messages from API
**Alternatives Considered**:
- Browser alert(): Intrusive, blocks UI, poor UX
- Toast notifications: Requires library or complex JS
- Console.log only: Not user-visible
**Risk**: Very Low - Standard error display pattern

### Decision 9: Port Configuration
**Context**: WebUI needs port, must avoid weather-api port (8080). Options: hardcode, environment variable, command line flag
**Decision Made**: Port 8081 (configurable via PORT environment variable)
**Rationale**:
- Sequential numbering (8080 → 8081) is intuitive
- Environment variable enables deployment flexibility
- Follows Sprint 3 pattern (PORT env var)
- Avoids conflict with weather-api
- Standard practice for multi-service development
**Alternatives Considered**:
- Hardcoded 8081: Less flexible
- Different port range (3000, 5000): Less clear relationship to API
- Command-line flag: More complex than env var
**Risk**: Very Low - Standard configuration pattern

### Decision 10: Loading State Indication
**Context**: API calls may take time, need to show progress. Options: spinner, loading text, skeleton screen, progress bar
**Decision Made**: Simple "Loading..." text with disabled form during API calls
**Rationale**:
- MVP simplicity (no spinner animation needed)
- Clear feedback to user
- Prevents duplicate submissions (disabled form)
- Easy to implement
- Accessible (screen readers announce text)
**Alternatives Considered**:
- Animated spinner: Requires CSS/SVG animation
- Skeleton screen: Complex to implement
- Progress bar: Overkill for simple API calls
**Risk**: Very Low - Adequate feedback for MVP

### Decision 11: Graceful Shutdown
**Context**: Server needs clean shutdown. Options: immediate termination, graceful shutdown with timeout
**Decision Made**: Graceful shutdown with 10-second timeout on SIGINT/SIGTERM (matching Sprint 3)
**Rationale**:
- Consistency with weather-api pattern
- Production best practice
- Allows in-flight requests to complete
- Prevents abrupt user experience
- Standard timeout duration
**Alternatives Considered**:
- Immediate termination: Poor UX, incomplete requests
- No shutdown handling: Unsafe
**Risk**: Very Low - Proven pattern from Sprint 3

### Decision 12: Template Structure
**Context**: Need to organize HTML templates. Options: single template, multiple partials, layout + content templates
**Decision Made**: Single index.html template with embedded CSS and minimal JavaScript bootstrap
**Rationale**:
- MVP simplicity (one page application)
- No template complexity needed
- Easy to understand and modify
- Faster rendering (no partial includes)
- Main JavaScript in separate static file for organization
**Alternatives Considered**:
- Multiple templates with partials: Overkill for single page
- No templates (static HTML): Can't inject server config
**Risk**: Very Low - Simple approach, can refactor if needed

---

### Design Overview

**Architecture:**

```
┌──────────────────────────────────────────────────────────┐
│                    User's Web Browser                     │
│  ┌────────────────────────────────────────────────────┐  │
│  │  HTML Page (index.html from template)             │  │
│  │  - City/Coordinates input tabs                     │  │
│  │  - Weather display area                            │  │
│  │  - Error message area                              │  │
│  └────────────────────────────────────────────────────┘  │
│                              │                            │
│                              │ User Interaction           │
│                              ▼                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │  JavaScript (static/js/app.js)                     │  │
│  │  - Form submission handler                         │  │
│  │  - Fetch API calls to weather-api                  │  │
│  │  - DOM manipulation for display                    │  │
│  │  - Error handling and UI updates                   │  │
│  └────────────────────────────────────────────────────┘  │
│                              │                            │
│                              │ HTTP Requests              │
└──────────────────────────────┼────────────────────────────┘
                               │
                               ▼
                  ┌────────────────────────┐
                  │   weather-api Server   │
                  │   (localhost:8080)     │
                  │  Sprint 3 REST API     │
                  └────────────────────────┘
                               │
                               ▼
                  ┌────────────────────────┐
                  │    Open-Meteo APIs     │
                  │  (via weather package) │
                  └────────────────────────┘

═══════════════════════════════════════════════════════════

Weather-Web Server Architecture (localhost:8081):

┌──────────────────────────────────────────────────────────┐
│                    weather-web Server                     │
│  ┌────────────────────────────────────────────────────┐  │
│  │         HTTP Server (net/http)                     │  │
│  │         Port: 8081 (configurable via PORT env)     │  │
│  └────────────────────────────────────────────────────┘  │
│                              │                            │
│                              │                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │         Router (http.ServeMux)                     │  │
│  │  - GET /                  → Template handler       │  │
│  │  - GET /static/*          → Static file handler    │  │
│  │  - GET /health            → Health check           │  │
│  └────────────────────────────────────────────────────┘  │
│                              │                            │
│                              │                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │         Handlers (main.go)                         │  │
│  │  - handleIndex()          → Render HTML template   │  │
│  │  - handleHealth()         → Return {"status":"ok"} │  │
│  │  (Static files served by http.FileServer)         │  │
│  └────────────────────────────────────────────────────┘  │
│                              │                            │
│                              │                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │         Templates (templates/index.html)           │  │
│  │  - HTML structure with {{.APIEndpoint}} injection  │  │
│  │  - Embedded CSS for styling                        │  │
│  │  - Links to static JavaScript/CSS files           │  │
│  └────────────────────────────────────────────────────┘  │
│                              │                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │         Static Assets (static/)                    │  │
│  │  - css/styles.css    → Responsive styling          │  │
│  │  - js/app.js         → API client logic            │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Key Components:**

1. **main.go** (HTTP Server Entry Point)
   - Purpose: Server initialization, routing setup, graceful shutdown
   - Responsibilities:
     - Read PORT environment variable (default 8081)
     - Create http.ServeMux and register routes
     - Configure HTTP server with timeouts
     - Handle SIGINT/SIGTERM for graceful shutdown
     - Serve HTML template with API endpoint injection
     - Serve static files (CSS, JavaScript)
     - Log server startup and requests

2. **templates/index.html** (HTML Template)
   - Purpose: Main web page structure
   - Responsibilities:
     - Input forms for city name and GPS coordinates
     - Tab/toggle UI for switching input modes
     - Weather display area (current + 3-day forecast)
     - Error message display area
     - Loading state indicators
     - Responsive layout structure
     - Template variable injection (e.g., {{.APIEndpoint}})

3. **static/css/styles.css** (Styling)
   - Purpose: Visual presentation and responsive design
   - Responsibilities:
     - Page layout (flexbox/grid)
     - Component styling (forms, cards, buttons)
     - Responsive breakpoints (mobile, tablet, desktop)
     - Color scheme and typography
     - Weather icon styling
     - Loading and error state styling
     - Accessibility (focus states, contrast)

4. **static/js/app.js** (Client-Side Logic)
   - Purpose: Interactive functionality and API integration
   - Responsibilities:
     - Form submission event handlers
     - Tab switching between city/coordinates modes
     - Input validation (required fields, coordinate ranges)
     - Fetch API calls to weather-api endpoints
     - JSON response parsing
     - DOM manipulation for weather display
     - Weather code to Unicode symbol mapping
     - Error handling and display
     - Loading state management

**Data Flow:**

1. **Initial Page Load**:
   - User navigates to http://localhost:8081
   - Server renders templates/index.html with API endpoint
   - Browser loads HTML, CSS (styles.css), and JavaScript (app.js)
   - Page displays input form (default: city search tab)

2. **City Weather Search**:
   - User enters city name in form field
   - User clicks "Get Weather" button
   - JavaScript validates input (non-empty)
   - JavaScript shows loading state, disables form
   - JavaScript calls `fetch('http://localhost:8080/weather/city?name=Portland')`
   - weather-api returns JSON ForecastResponse
   - JavaScript parses JSON
   - JavaScript updates DOM with weather data:
     - Current weather (temperature, condition icon)
     - 3-day forecast (dates, high/low temps, icons)
   - JavaScript hides loading state, enables form

3. **GPS Coordinates Search**:
   - User switches to "Coordinates" tab
   - User enters latitude and longitude
   - User clicks "Get Weather" button
   - JavaScript validates inputs (required, numeric, in range)
   - JavaScript shows loading state
   - JavaScript calls `fetch('http://localhost:8080/weather/coordinates?lat=45.5&lon=-122.6')`
   - weather-api returns JSON ForecastResponse
   - JavaScript updates DOM with weather data
   - JavaScript hides loading state

4. **Error Scenarios**:
   - API returns 404 (city not found):
     - JavaScript detects non-200 status
     - JavaScript parses error JSON: `{"error": "city not found: ...", "status": 404}`
     - JavaScript displays error message in error area
     - Weather display area remains hidden
   - Network error (API not running):
     - Fetch Promise rejects
     - JavaScript catch block handles error
     - Displays: "Unable to connect to weather service. Please ensure API is running."
   - Validation error (client-side):
     - JavaScript prevents API call
     - Displays inline validation message

**Response Flow:**

```
User Input → JavaScript Validation → Fetch Request
                     ↓                      ↓
              Validation Error          API Call
                     ↓                      ↓
              Display Error         JSON Response
                                           ↓
                                    Parse & Display
```

---

### Technical Specification

**APIs Consumed (from Sprint 3):**

### API 1: Weather by City Name

**Endpoint**: `http://localhost:8080/weather/city`
**Method**: GET
**Query Parameters**:
- `name` (required): City name (string)
**Purpose**: Retrieve weather forecast for a city
**Documentation**: `progress/sprint_3/sprint_3_design.md`

**Request Example**:
```javascript
fetch('http://localhost:8080/weather/city?name=Portland')
```

**Success Response** (HTTP 200 OK):
```json
{
  "latitude": 45.5152,
  "longitude": -122.6784,
  "timezone": "America/Los_Angeles",
  "current": {
    "time": "2025-12-06T15:00",
    "temperature_2m": 12.5,
    "weather_code": 3
  },
  "daily": {
    "time": ["2025-12-06", "2025-12-07", "2025-12-08"],
    "temperature_2m_max": [14.2, 13.8, 15.1],
    "temperature_2m_min": [8.1, 7.9, 9.2],
    "weather_code": [3, 61, 3]
  }
}
```

**Error Response Examples**:

City not found (HTTP 404):
```json
{
  "error": "city not found: InvalidCity",
  "status": 404
}
```

Missing parameter (HTTP 400):
```json
{
  "error": "missing required parameter: name",
  "status": 400
}
```

### API 2: Weather by GPS Coordinates

**Endpoint**: `http://localhost:8080/weather/coordinates`
**Method**: GET
**Query Parameters**:
- `lat` (required): Latitude (float, -90 to 90)
- `lon` (required): Longitude (float, -180 to 180)
**Purpose**: Retrieve weather forecast for GPS coordinates
**Documentation**: `progress/sprint_3/sprint_3_design.md`

**Request Example**:
```javascript
fetch('http://localhost:8080/weather/coordinates?lat=45.5152&lon=-122.6784')
```

**Success Response**: Same structure as city endpoint

**Error Response Examples**:

Invalid coordinates (HTTP 400):
```json
{
  "error": "latitude must be between -90 and 90, got 95.000",
  "status": 400
}
```

### API 3: Health Check

**Endpoint**: `http://localhost:8080/health`
**Method**: GET
**Purpose**: Verify weather-api availability
**Response** (HTTP 200):
```json
{
  "status": "ok"
}
```

---

**Data Structures:**

### Weather Code to Icon Mapping

JavaScript implementation in app.js:

```javascript
function getWeatherIcon(weatherCode) {
  // Open-Meteo WMO Weather interpretation codes
  const weatherIcons = {
    0: '☀️',   // Clear sky
    1: '🌤️',   // Mainly clear
    2: '⛅',   // Partly cloudy
    3: '☁️',   // Overcast
    45: '🌫️',  // Fog
    48: '🌫️',  // Depositing rime fog
    51: '🌦️',  // Drizzle: Light
    53: '🌦️',  // Drizzle: Moderate
    55: '🌧️',  // Drizzle: Dense
    61: '🌧️',  // Rain: Slight
    63: '🌧️',  // Rain: Moderate
    65: '🌧️',  // Rain: Heavy
    71: '🌨️',  // Snow fall: Slight
    73: '🌨️',  // Snow fall: Moderate
    75: '❄️',  // Snow fall: Heavy
    77: '🌨️',  // Snow grains
    80: '🌦️',  // Rain showers: Slight
    81: '🌧️',  // Rain showers: Moderate
    85: '🌨️',  // Snow showers: Slight
    86: '❄️',  // Snow showers: Heavy
    95: '⛈️',  // Thunderstorm
    96: '⛈️',  // Thunderstorm with slight hail
    99: '⛈️'   // Thunderstorm with heavy hail
  };

  return weatherIcons[weatherCode] || '🌡️'; // Default thermometer if unknown
}
```

### Template Data Structure

Go struct for template rendering:

```go
type PageData struct {
    APIEndpoint string // Injected API base URL (configurable)
    Version     string // WebUI version (optional)
}
```

---

**Scripts/Tools:**

### File: weather-web/main.go
**Purpose**: HTTP server entry point
**Interface**: `./weather-web [PORT env var optional]`
**Dependencies**: Go standard library only (net/http, html/template, log, os, os/signal, context, time)
**Responsibilities**:
  - Configure and start HTTP server on port 8081
  - Setup routing with http.ServeMux
  - Render HTML template with API endpoint injection
  - Serve static files (CSS, JavaScript)
  - Handle graceful shutdown (SIGINT/SIGTERM)
  - Log server events and requests

### File: weather-web/templates/index.html
**Purpose**: HTML template for main page
**Interface**: Go html/template syntax
**Dependencies**: None (pure HTML + template directives)
**Template Variables**:
  - `{{.APIEndpoint}}` - Weather API base URL (default: http://localhost:8080)
**Responsibilities**:
  - Page structure (header, input forms, display areas)
  - Tab UI for city vs coordinates
  - Form fields with proper labels and placeholders
  - Weather display structure (current + forecast cards)
  - Error message container
  - Loading indicator container
  - Semantic HTML for accessibility

### File: weather-web/static/css/styles.css
**Purpose**: Responsive styling
**Interface**: CSS loaded via <link> tag
**Dependencies**: None (pure CSS)
**Responsibilities**:
  - Page layout (centered container, max-width)
  - Form styling (inputs, buttons, spacing)
  - Tab UI styling (active/inactive states)
  - Weather card layout (flexbox/grid)
  - Responsive breakpoints:
    - Mobile: < 768px (stacked layout)
    - Tablet: 768px - 1024px (2-column forecast)
    - Desktop: > 1024px (3-column forecast)
  - Color scheme (consistent palette)
  - Typography (readable fonts, sizes, line-heights)
  - Loading state styling
  - Error message styling (red border, background)

### File: weather-web/static/js/app.js
**Purpose**: Client-side application logic
**Interface**: Loaded via <script> tag
**Dependencies**: None (vanilla JavaScript, Fetch API)
**Functions**:
  - `initApp()` - Initialize event listeners
  - `handleCitySearch(event)` - City form submission handler
  - `handleCoordinatesSearch(event)` - Coordinates form submission handler
  - `validateCityInput(cityName)` - Validate city name (non-empty)
  - `validateCoordinates(lat, lon)` - Validate coordinate ranges
  - `fetchWeatherByCity(cityName)` - Call city weather API
  - `fetchWeatherByCoordinates(lat, lon)` - Call coordinates weather API
  - `displayWeather(data)` - Update DOM with weather data
  - `displayError(message)` - Show error message
  - `showLoading()` - Show loading state
  - `hideLoading()` - Hide loading state
  - `getWeatherIcon(code)` - Map weather code to Unicode symbol
  - `formatDate(dateString)` - Format date for display
  - `switchTab(tabName)` - Switch between city/coordinates tabs

### File: weather-web/go.mod
**Purpose**: Go module definition
**Contents**:
```
module github.com/rstyczynski/RUPStrikesBack/weather-web

go 1.21
```
**Note**: No external dependencies or replace directives needed (unlike Sprint 3)

---

**Error Handling:**

**Client-Side Validation Errors:**

1. **Empty City Name**:
   - Scenario: User submits city form without entering name
   - Handling: JavaScript prevents API call, displays inline message
   - Message: "Please enter a city name"
   - Color: Red text below input field

2. **Empty Coordinates**:
   - Scenario: User submits coordinates form with missing lat or lon
   - Handling: JavaScript prevents API call, validates both fields
   - Message: "Please enter both latitude and longitude"

3. **Invalid Coordinate Format**:
   - Scenario: User enters non-numeric value in lat/lon field
   - Handling: JavaScript parseFloat validation
   - Message: "Latitude and longitude must be numbers"

4. **Coordinates Out of Range**:
   - Scenario: User enters lat > 90 or lon > 180, etc.
   - Handling: JavaScript range validation before API call
   - Message: "Latitude must be between -90 and 90, Longitude must be between -180 and 180"

**API Error Scenarios:**

5. **City Not Found (HTTP 404)**:
   - Scenario: weather-api cannot geocode city name
   - Response: `{"error": "city not found: InvalidCity", "status": 404}`
   - Handling: Parse error JSON, display user-friendly message
   - Display: "City not found: InvalidCity. Please check the spelling and try again."

6. **Invalid API Parameters (HTTP 400)**:
   - Scenario: Client-side validation missed, or API rejects parameters
   - Response: `{"error": "missing required parameter: name", "status": 400}`
   - Handling: Display API error message directly
   - Display: Error message from API response

7. **Weather API Service Unavailable (HTTP 503)**:
   - Scenario: Open-Meteo API is down or unreachable
   - Response: `{"error": "forecast API request failed: ...", "status": 503}`
   - Handling: User-friendly message with retry suggestion
   - Display: "Weather service temporarily unavailable. Please try again in a moment."

8. **Internal Server Error (HTTP 500)**:
   - Scenario: Unexpected error in weather-api
   - Response: `{"error": "internal server error", "status": 500}`
   - Handling: Generic error message
   - Display: "An unexpected error occurred. Please try again."

**Network Error Scenarios:**

9. **Weather API Not Running**:
   - Scenario: fetch() to localhost:8080 fails (connection refused)
   - Handling: Catch fetch Promise rejection
   - Display: "Unable to connect to weather service. Please ensure the Weather API is running on port 8080."

10. **CORS Error (if applicable)**:
    - Scenario: Browser blocks cross-origin request
    - Handling: Catch fetch error, check for CORS-related message
    - Display: "Cross-origin request blocked. Please ensure both servers are running correctly."
    - Note: Should not occur with localhost, but handled for completeness

11. **Network Timeout**:
    - Scenario: API request takes too long
    - Handling: Fetch with timeout (e.g., 15 seconds)
    - Display: "Request timed out. Please check your connection and try again."

**Error Display Implementation:**

JavaScript error display function:
```javascript
function displayError(message) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';

  // Hide weather display
  document.getElementById('weather-display').style.display = 'none';

  // Hide loading state
  hideLoading();
}

function clearError() {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = '';
  errorDiv.style.display = 'none';
}
```

CSS error styling:
```css
#error-message {
  display: none;
  padding: 1rem;
  margin: 1rem 0;
  background-color: #fee;
  border: 1px solid #fcc;
  border-left: 4px solid #f44;
  border-radius: 4px;
  color: #c33;
}
```

---

### Implementation Approach

**Step 1: Project Setup**

```bash
# Create project directory
mkdir -p weather-web/templates weather-web/static/css weather-web/static/js
cd weather-web

# Initialize Go module
go mod init github.com/rstyczynski/RUPStrikesBack/weather-web

# Verify directory structure
ls -la
# Expected: go.mod, templates/, static/
```

**Step 2: Create HTML Template**

File: `templates/index.html`

Create HTML structure:
- DOCTYPE and html/head/body skeleton
- meta tags (viewport for responsive, charset)
- title: "Weather Forecast WebUI"
- link to static/css/styles.css
- header with application title
- tab navigation (City / Coordinates)
- city search form (input for city name, submit button)
- coordinates search form (inputs for lat/lon, submit button)
- loading indicator div (hidden by default)
- error message div (hidden by default)
- weather display div (hidden by default):
  - current weather section (icon, temp, time)
  - 3-day forecast section (cards for each day)
- script tag loading static/js/app.js
- template variable {{.APIEndpoint}} in JavaScript constant

Template example structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather Forecast WebUI</title>
    <link rel="stylesheet" href="/static/css/styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Weather Forecast</h1>
        </header>

        <div class="tabs">
            <button class="tab-button active" data-tab="city">Search by City</button>
            <button class="tab-button" data-tab="coordinates">Search by Coordinates</button>
        </div>

        <div class="tab-content">
            <form id="city-form" class="tab-panel active">
                <label for="city-input">City Name:</label>
                <input type="text" id="city-input" placeholder="e.g., Portland">
                <button type="submit">Get Weather</button>
            </form>

            <form id="coordinates-form" class="tab-panel">
                <label for="lat-input">Latitude:</label>
                <input type="text" id="lat-input" placeholder="e.g., 45.5152">
                <label for="lon-input">Longitude:</label>
                <input type="text" id="lon-input" placeholder="e.g., -122.6784">
                <button type="submit">Get Weather</button>
            </form>
        </div>

        <div id="loading" style="display: none;">Loading...</div>
        <div id="error-message" style="display: none;"></div>

        <div id="weather-display" style="display: none;">
            <div id="current-weather"></div>
            <div id="forecast"></div>
        </div>
    </div>

    <script>
        const API_ENDPOINT = '{{.APIEndpoint}}';
    </script>
    <script src="/static/js/app.js"></script>
</body>
</html>
```

**Step 3: Create CSS Stylesheet**

File: `static/css/styles.css`

Implement styling:
- CSS reset/normalization
- Container layout (centered, max-width, padding)
- Header styling (title, alignment)
- Tab navigation styling (button group, active state)
- Form styling (labels, inputs, buttons, spacing)
- Loading indicator (centered, prominent)
- Error message (red theme, border, padding)
- Weather display layout:
  - Current weather (large icon, temperature)
  - Forecast grid (responsive 1-3 columns)
  - Weather cards (border, shadow, padding)
- Responsive breakpoints:
  - @media (max-width: 768px) - mobile
  - @media (min-width: 769px) - tablet/desktop
- Accessibility (focus states, sufficient contrast)

**Step 4: Create JavaScript Application Logic**

File: `static/js/app.js`

Implement functions:

1. **Initialization**:
```javascript
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Setup tab switching
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', handleTabSwitch);
  });

  // Setup form submissions
  document.getElementById('city-form').addEventListener('submit', handleCitySearch);
  document.getElementById('coordinates-form').addEventListener('submit', handleCoordinatesSearch);
}
```

2. **Tab Switching**:
```javascript
function handleTabSwitch(event) {
  const tabName = event.target.dataset.tab;

  // Update button states
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // Update panel visibility
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  document.getElementById(`${tabName}-form`).classList.add('active');

  // Clear previous results and errors
  clearError();
  hideWeatherDisplay();
}
```

3. **City Search Handler**:
```javascript
async function handleCitySearch(event) {
  event.preventDefault();

  const cityInput = document.getElementById('city-input');
  const cityName = cityInput.value.trim();

  if (!validateCityInput(cityName)) {
    return;
  }

  clearError();
  showLoading();

  try {
    const response = await fetch(`${API_ENDPOINT}/weather/city?name=${encodeURIComponent(cityName)}`);
    const data = await response.json();

    if (!response.ok) {
      displayError(data.error || 'Failed to retrieve weather data');
      return;
    }

    displayWeather(data, cityName);
  } catch (error) {
    displayError('Unable to connect to weather service. Please ensure the Weather API is running on port 8080.');
  } finally {
    hideLoading();
  }
}
```

4. **Coordinates Search Handler**: Similar structure to city search

5. **Validation Functions**:
```javascript
function validateCityInput(cityName) {
  if (!cityName) {
    displayError('Please enter a city name');
    return false;
  }
  return true;
}

function validateCoordinates(lat, lon) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || isNaN(longitude)) {
    displayError('Latitude and longitude must be numbers');
    return false;
  }

  if (latitude < -90 || latitude > 90) {
    displayError('Latitude must be between -90 and 90');
    return false;
  }

  if (longitude < -180 || longitude > 180) {
    displayError('Longitude must be between -180 and 180');
    return false;
  }

  return true;
}
```

6. **Weather Display Function**:
```javascript
function displayWeather(data, locationName) {
  const currentWeatherDiv = document.getElementById('current-weather');
  const forecastDiv = document.getElementById('forecast');

  // Display current weather
  const currentIcon = getWeatherIcon(data.current.weather_code);
  currentWeatherDiv.innerHTML = `
    <h2>Current Weather${locationName ? ' - ' + locationName : ''}</h2>
    <div class="current-details">
      <span class="weather-icon-large">${currentIcon}</span>
      <span class="temperature">${data.current.temperature_2m}°C</span>
      <span class="time">${formatTime(data.current.time)}</span>
    </div>
  `;

  // Display 3-day forecast
  let forecastHTML = '<h2>3-Day Forecast</h2><div class="forecast-grid">';
  for (let i = 0; i < 3; i++) {
    const icon = getWeatherIcon(data.daily.weather_code[i]);
    forecastHTML += `
      <div class="forecast-card">
        <div class="date">${formatDate(data.daily.time[i])}</div>
        <div class="weather-icon">${icon}</div>
        <div class="temps">
          <span class="temp-high">${data.daily.temperature_2m_max[i]}°C</span>
          <span class="temp-low">${data.daily.temperature_2m_min[i]}°C</span>
        </div>
      </div>
    `;
  }
  forecastHTML += '</div>';
  forecastDiv.innerHTML = forecastHTML;

  // Show weather display
  document.getElementById('weather-display').style.display = 'block';
}
```

7. **Utility Functions**: getWeatherIcon(), formatDate(), formatTime(), showLoading(), hideLoading(), etc.

**Step 5: Create Go HTTP Server**

File: `main.go`

```go
package main

import (
    "context"
    "html/template"
    "log"
    "net/http"
    "os"
    "os/signal"
    "time"
)

// PageData holds data for template rendering
type PageData struct {
    APIEndpoint string
}

func main() {
    // Read port from environment (default 8081)
    port := os.Getenv("PORT")
    if port == "" {
        port = "8081"
    }

    // Read API endpoint from environment (default localhost:8080)
    apiEndpoint := os.Getenv("API_ENDPOINT")
    if apiEndpoint == "" {
        apiEndpoint = "http://localhost:8080"
    }

    // Parse template
    tmpl := template.Must(template.ParseFiles("templates/index.html"))

    // Setup routing
    mux := http.NewServeMux()

    // Root handler - render template
    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        if r.URL.Path != "/" {
            http.NotFound(w, r)
            return
        }

        data := PageData{
            APIEndpoint: apiEndpoint,
        }

        if err := tmpl.Execute(w, data); err != nil {
            log.Printf("Template error: %v", err)
            http.Error(w, "Internal server error", http.StatusInternalServerError)
            return
        }

        log.Printf("Served index page to %s", r.RemoteAddr)
    })

    // Static files handler
    fs := http.FileServer(http.Dir("static"))
    mux.Handle("/static/", http.StripPrefix("/static/", fs))

    // Health check handler
    mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte(`{"status":"ok"}`))
    })

    // Configure server
    server := &http.Server{
        Addr:         ":" + port,
        Handler:      mux,
        ReadTimeout:  15 * time.Second,
        WriteTimeout: 15 * time.Second,
        IdleTimeout:  60 * time.Second,
    }

    // Start server in goroutine
    go func() {
        log.Printf("Weather WebUI server starting on port %s", port)
        log.Printf("API endpoint configured: %s", apiEndpoint)
        log.Printf("Visit http://localhost:%s in your browser", port)
        if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("Server failed to start: %v", err)
        }
    }()

    // Graceful shutdown
    stop := make(chan os.Signal, 1)
    signal.Notify(stop, os.Interrupt)
    <-stop

    log.Println("Shutting down server...")
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    if err := server.Shutdown(ctx); err != nil {
        log.Fatalf("Server shutdown failed: %v", err)
    }

    log.Println("Server stopped gracefully")
}
```

**Step 6: Build and Initial Test**

```bash
# Build binary
go build -o weather-web

# Verify binary created
ls -l weather-web

# Test server starts
./weather-web

# Expected log output:
# Weather WebUI server starting on port 8081
# API endpoint configured: http://localhost:8080
# Visit http://localhost:8081 in your browser

# In separate terminal: test health endpoint
curl http://localhost:8081/health
# Expected: {"status":"ok"}

# Stop server with Ctrl+C
# Expected: Graceful shutdown messages
```

**Step 7: Integration Testing**

Prerequisites:
1. Start weather-api server (Sprint 3) on port 8080
2. Start weather-web server on port 8081
3. Open browser to http://localhost:8081

Test sequence:
1. Verify page loads
2. Test city search with valid city
3. Test coordinates search with valid coords
4. Test error handling (invalid city, out of range coords)
5. Test tab switching
6. Test responsive design (resize browser window)

**Step 8: Refinement**

Based on testing:
- Adjust CSS styling for visual polish
- Improve error messages
- Add loading animations (optional)
- Verify accessibility (keyboard navigation, screen reader)
- Test on different browsers (Chrome, Firefox, Safari)

---

### Testing Strategy

**Functional Tests:**

All tests require:
- weather-api running on localhost:8080 (from Sprint 3)
- weather-web running on localhost:8081
- Web browser (Chrome, Firefox, Safari, or Edge)

**Test Category 1: Happy Path Tests**

**Test 1: WebUI Server Starts and Serves Homepage**
- Action: Start weather-web server (`./weather-web`)
- Navigate to: http://localhost:8081
- Expected Result:
  - Page loads successfully
  - Title: "Weather Forecast WebUI"
  - Two tabs visible: "Search by City" and "Search by Coordinates"
  - City search form visible (default tab)
  - No error messages displayed
- Success Criteria: ✅ Page renders with all elements visible

**Test 2: City Weather Search - Valid City**
- Prerequisite: weather-api running on port 8080
- Action:
  1. Enter "Portland" in city name field
  2. Click "Get Weather" button
- Expected Result:
  - Loading indicator appears briefly
  - Current weather displays:
    - Weather icon (appropriate for conditions)
    - Temperature value in °C
    - Current time
  - 3-day forecast displays:
    - Three forecast cards
    - Dates for next 3 days
    - Weather icons for each day
    - High and low temperatures
  - No error messages
- Success Criteria: ✅ Weather data displays correctly, matches API response structure

**Test 3: GPS Coordinates Search - Valid Coordinates**
- Prerequisite: weather-api running
- Action:
  1. Click "Search by Coordinates" tab
  2. Enter "45.5152" in latitude field
  3. Enter "-122.6784" in longitude field
  4. Click "Get Weather" button
- Expected Result:
  - Loading indicator appears
  - Weather data displays (current + 3-day forecast)
  - Weather matches Portland area (same as Test 2 approximately)
- Success Criteria: ✅ Coordinates search works, displays weather data

**Test 4: Tab Switching**
- Action:
  1. Start on "Search by City" tab
  2. Click "Search by Coordinates" tab
  3. Verify coordinates form displays
  4. Click "Search by City" tab again
- Expected Result:
  - Tab buttons highlight active tab
  - Form visibility switches correctly
  - Previous results clear when switching tabs
  - No JavaScript errors in console
- Success Criteria: ✅ Tab switching works smoothly

**Test Category 2: Validation Tests**

**Test 5: Empty City Name Validation**
- Action:
  1. Leave city name field empty
  2. Click "Get Weather" button
- Expected Result:
  - Error message displays: "Please enter a city name"
  - No API call made (check browser Network tab)
  - Form remains enabled
- Success Criteria: ✅ Client-side validation prevents empty submission

**Test 6: Missing Coordinates Validation**
- Action:
  1. Switch to Coordinates tab
  2. Enter only latitude (leave longitude empty)
  3. Click "Get Weather"
- Expected Result:
  - Error message: "Please enter both latitude and longitude"
  - No API call made
- Success Criteria: ✅ Validates both fields required

**Test 7: Invalid Coordinate Format**
- Action:
  1. Enter "abc" in latitude field
  2. Enter "123" in longitude field
  3. Click "Get Weather"
- Expected Result:
  - Error message: "Latitude and longitude must be numbers"
  - No API call made
- Success Criteria: ✅ Validates numeric input

**Test 8: Coordinates Out of Range**
- Action:
  1. Enter "95" in latitude (> 90)
  2. Enter "200" in longitude (> 180)
  3. Click "Get Weather"
- Expected Result:
  - Error message: "Latitude must be between -90 and 90, Longitude must be between -180 and 180"
  - No API call made
- Success Criteria: ✅ Range validation works

**Test Category 3: API Error Handling**

**Test 9: City Not Found**
- Prerequisite: weather-api running
- Action:
  1. Enter "InvalidCityXYZ123" in city field
  2. Click "Get Weather"
- Expected Result:
  - Loading indicator shows, then hides
  - Error message displays (red background)
  - Message contains "City not found" or "not found"
  - Weather display area remains hidden
- Success Criteria: ✅ API 404 error handled gracefully

**Test 10: Weather API Not Running**
- Prerequisite: Stop weather-api server (port 8080)
- Action:
  1. Enter "Portland" in city field
  2. Click "Get Weather"
- Expected Result:
  - Loading indicator appears, then timeout or immediate error
  - Error message: "Unable to connect to weather service. Please ensure the Weather API is running on port 8080."
  - Weather display hidden
- Success Criteria: ✅ Network error handled with clear message

**Test 11: API Returns Server Error (500)**
- Note: This test requires manually stopping Open-Meteo or simulating API error
- Expected Result: Generic error message displayed
- Success Criteria: ✅ Server errors don't crash WebUI

**Test Category 4: User Experience Tests**

**Test 12: Multiple Sequential Searches**
- Action:
  1. Search for "Portland"
  2. Verify results display
  3. Search for "Seattle"
  4. Verify results update
  5. Repeat with 3 more cities
- Expected Result:
  - Each search replaces previous results
  - No accumulated content
  - No memory leaks (check browser DevTools Memory)
  - Server remains responsive
- Success Criteria: ✅ Multiple searches work without issues

**Test 13: Loading State Indication**
- Action:
  1. Search for a city
  2. Observe loading indicator during API call
- Expected Result:
  - Loading message appears immediately on submit
  - Form disabled during loading
  - Loading message disappears when results display
  - Cannot submit duplicate requests while loading
- Success Criteria: ✅ Loading state provides feedback

**Test 14: Weather Icons Display Correctly**
- Action:
  1. Search for multiple cities (different weather conditions)
  2. Observe weather icons
- Expected Result:
  - Icons match weather conditions (sunny, cloudy, rainy, etc.)
  - Icons display properly (not broken symbols)
  - Icons sized appropriately
- Success Criteria: ✅ Unicode weather symbols render correctly

**Test Category 5: Responsive Design Tests**

**Test 15: Mobile Layout (< 768px)**
- Action:
  1. Resize browser window to 400px width
  2. Perform weather search
- Expected Result:
  - Layout stacks vertically
  - Forecast cards stack (1 column)
  - Text remains readable
  - Buttons remain clickable
  - No horizontal scrolling
- Success Criteria: ✅ Mobile layout works correctly

**Test 16: Tablet Layout (768px - 1024px)**
- Action:
  1. Resize to 800px width
  2. Perform search
- Expected Result:
  - Forecast cards in 2 columns or responsive grid
  - Layout looks balanced
- Success Criteria: ✅ Tablet layout adapts properly

**Test 17: Desktop Layout (> 1024px)**
- Action: View on full desktop screen
- Expected Result:
  - Forecast cards in 3 columns (or horizontal grid)
  - Container centered with max-width
  - Spacing appropriate
- Success Criteria: ✅ Desktop layout optimal

**Test Category 6: Browser Compatibility Tests**

**Test 18: Chrome**
- Browser: Google Chrome (latest)
- Action: Run Tests 1-14
- Expected: All tests pass
- Success Criteria: ✅ Full functionality in Chrome

**Test 19: Firefox**
- Browser: Mozilla Firefox (latest)
- Action: Run Tests 1-14
- Expected: All tests pass
- Success Criteria: ✅ Full functionality in Firefox

**Test 20: Safari**
- Browser: Safari (latest, macOS)
- Action: Run Tests 1-14
- Expected: All tests pass
- Success Criteria: ✅ Full functionality in Safari

**Test 21: Edge**
- Browser: Microsoft Edge (latest)
- Action: Run Tests 1-14
- Expected: All tests pass
- Success Criteria: ✅ Full functionality in Edge

**Edge Cases:**

**Edge Case 1: City with Special Characters**
- Test: City name "São Paulo" or "Zürich"
- Expected: Proper URL encoding, successful API call
- Success Criteria: ✅ Special characters handled

**Edge Case 2: City with Spaces**
- Test: City name "San Francisco" or "New York"
- Expected: Spaces encoded as %20, successful search
- Success Criteria: ✅ Spaces handled correctly

**Edge Case 3: Boundary Coordinates**
- Test: lat=90, lon=180 (North Pole area)
- Expected: Valid API call, weather data returned
- Success Criteria: ✅ Boundary values accepted

**Edge Case 4: High-Precision Coordinates**
- Test: lat=45.515187, lon=-122.678376 (many decimal places)
- Expected: API accepts, returns weather
- Success Criteria: ✅ Precision preserved

**Edge Case 5: Negative Coordinates**
- Test: lat=-33.8688, lon=-151.2093 (Sydney, Australia)
- Expected: Successful search, correct weather
- Success Criteria: ✅ Negative values work

**Success Criteria Summary:**

- ✅ All 21 functional tests pass
- ✅ All 5 edge cases handled correctly
- ✅ No JavaScript console errors during normal operation
- ✅ No browser console warnings (except for API failures)
- ✅ Server logs show appropriate request logging
- ✅ Graceful shutdown works (Ctrl+C)
- ✅ No memory leaks during extended use
- ✅ Responsive design works at all breakpoints
- ✅ Accessibility: keyboard navigation works, screen reader compatible
- ✅ Weather data accuracy matches API responses

---

### Integration Notes

**Dependencies:**

**On Sprint 3 (weather-api):**
- ✅ Requires weather-api running on localhost:8080 (configurable via API_ENDPOINT env var)
- ✅ Consumes REST endpoints:
  - GET /weather/city?name={city}
  - GET /weather/coordinates?lat={lat}&lon={lon}
  - GET /health
- ✅ Expects JSON responses in ForecastResponse format
- ✅ Handles error responses with status codes (400, 404, 503, 500)
- ✅ Status: All endpoints tested and documented in Sprint 3

**On Sprint 1 (Prerequisites):**
- ✅ Go development environment (builds Go HTTP server)
- ✅ Web browser (Chrome, Firefox, Safari, or Edge)

**No Direct Code Dependencies:**
- ❌ Does NOT import weather-cli package (architecture separation)
- ❌ Does NOT import weather-api code (separate binary)
- ✅ Only dependency: HTTP API contract (JSON over HTTP)

**Compatibility:**

**With Sprint 2 (CLI):**
- ✅ Independent interfaces to weather data
- ✅ CLI and WebUI can run simultaneously
- ✅ No conflicts (different user interfaces)
- ✅ Both ultimately consume same weather data (via API in Sprint 3)

**With Sprint 3 (REST API):**
- ✅ **Critical Integration**: WebUI is primary consumer of REST API
- ✅ **API Contract**: Relies on exact JSON response format from Sprint 3
- ✅ **Error Handling**: Expects specific HTTP status codes (400, 404, 503)
- ✅ **Port Coordination**: API on 8080, WebUI on 8081 (no conflicts)
- ✅ **Same Origin**: Both on localhost (CORS should not be issue)
- ✅ **Independent Processes**: Can start/stop independently
- ✅ **Health Check**: WebUI can verify API availability via /health endpoint

**With Sprint 5-6 (Future):**
- ✅ WebUI provides foundation for map integration (Sprint 5 RSB-6)
- ✅ Can add interactive map component to existing page structure
- ✅ JavaScript architecture supports adding new features
- ✅ CSS structure allows adding map container

**Reusability:**

**From Sprint 3 (Consumed):**
- REST API endpoints (100% reused via HTTP calls)
- JSON data structures (ForecastResponse format)
- Error response format ({"error": "...", "status": 404})

**From Sprint 2 (Indirect):**
- Weather package functionality (via Sprint 3 API)
- Same weather data source (Open-Meteo)
- Same validation rules (coordinate ranges)

**For Sprint 5-6 (Will provide):**
- HTML template structure (can add map elements)
- JavaScript app.js (can extend with map libraries)
- CSS styling framework (can add map styles)
- Server infrastructure (can add map tile endpoints)

**Deployment Compatibility:**

**Development:**
- Both API and WebUI run on localhost
- Simple startup: `./weather-api` and `./weather-web`
- No reverse proxy needed

**Production Considerations (Future):**
- Single binary deployment (Go compiled executable)
- Can embed static files in binary (using go:embed)
- Environment variables for configuration (PORT, API_ENDPOINT)
- Can deploy behind reverse proxy (nginx, Caddy)
- API_ENDPOINT env var allows API on different host

---

### Documentation Requirements

**User Documentation** (to be created in sprint_4_implementation.md):

1. **WebUI Overview**:
   - Purpose: Browser-based weather forecast interface
   - Features: City search, GPS coordinates search, visual weather display
   - Browser requirements (modern browsers)

2. **Getting Started**:
   - Prerequisites:
     - Sprint 1: Go installation
     - Sprint 3: weather-api built and running on port 8080
   - Building the WebUI: `go build -o weather-web`
   - Starting the server: `./weather-web`
   - Accessing the UI: http://localhost:8081
   - Environment variables: PORT, API_ENDPOINT

3. **Usage Guide**:
   - How to search by city name
   - How to search by GPS coordinates
   - Understanding weather display (current + forecast)
   - Weather icon meanings (map of symbols)
   - Error messages and troubleshooting

4. **Configuration**:
   - Port configuration: `PORT=3000 ./weather-web`
   - API endpoint configuration: `API_ENDPOINT=http://api.example.com ./weather-web`
   - Default values (8081, http://localhost:8080)

5. **Troubleshooting**:
   - "Unable to connect to weather service" → Ensure weather-api is running
   - "City not found" → Check spelling, try different city
   - Blank page → Check browser console for errors
   - CORS errors → Verify both servers on localhost

**Technical Documentation** (to be created in sprint_4_implementation.md):

1. **Architecture**:
   - Three-tier architecture diagram
   - Client-server flow (browser → web server → API server)
   - Static file serving strategy
   - Template rendering approach

2. **Code Structure**:
   - Directory layout:
     ```
     weather-web/
     ├── main.go              (Server entry point)
     ├── go.mod               (Go module)
     ├── weather-web          (Compiled binary)
     ├── templates/
     │   └── index.html       (HTML template)
     └── static/
         ├── css/
         │   └── styles.css   (Responsive styling)
         └── js/
             └── app.js       (Client application logic)
     ```
   - File purposes and responsibilities

3. **Frontend Architecture**:
   - HTML template structure
   - CSS organization (layout, components, responsive)
   - JavaScript modules:
     - Initialization and event setup
     - Form handling and validation
     - API client (fetch calls)
     - UI updates and DOM manipulation
     - Error handling
   - Weather code to icon mapping

4. **API Integration**:
   - Endpoint consumption patterns
   - Request/response handling
   - Error response parsing
   - Timeout and retry strategy

5. **Server Configuration**:
   - HTTP server settings (timeouts)
   - Routing strategy (template, static files, health)
   - Template rendering process
   - Static file serving
   - Graceful shutdown implementation

6. **Testing**:
   - Browser-based testing approach
   - Test categories and coverage
   - Manual testing procedures
   - Browser compatibility testing
   - Responsive design testing

7. **Deployment**:
   - Building for production
   - Embedding static files (optional go:embed)
   - Environment variable configuration
   - Reverse proxy setup (nginx example)
   - HTTPS considerations

8. **Security Considerations**:
   - Template auto-escaping (XSS prevention)
   - Input validation (client and server)
   - CORS policy
   - Content-Type headers
   - Future enhancements (authentication, rate limiting)

---

### Design Decisions

**Decision 1: Go Template Server vs Static Files**
**Rationale**: Template rendering allows injecting API endpoint at runtime (flexibility for different environments), while maintaining simplicity of single-page application. Static server would require hardcoded API endpoint or complex environment variable injection in JavaScript.
**Alternatives Considered**: Pure static HTML with hardcoded endpoint, client-side environment detection
**Chosen**: Go html/template with server-side rendering

**Decision 2: Single Page Application vs Multiple Pages**
**Rationale**: Single page provides better UX (no page reloads), simpler state management, and aligns with modern web application patterns. Weather search is a single-purpose tool that doesn't need multiple pages.
**Alternatives Considered**: Separate pages for city/coordinates search, traditional multi-page app
**Chosen**: Single page with client-side tab switching

**Decision 3: Embedded CSS vs Separate Stylesheet**
**Rationale**: Separate stylesheet allows browser caching, easier development (IDE syntax highlighting), and separation of concerns. Template becomes cleaner.
**Alternatives Considered**: Embedded <style> in template, inline styles
**Chosen**: Separate static/css/styles.css

**Decision 4: Fetch API vs XMLHttpRequest**
**Rationale**: Fetch API is modern, Promise-based (cleaner async/await syntax), and widely supported in target browsers. XMLHttpRequest is legacy.
**Alternatives Considered**: XMLHttpRequest, third-party HTTP libraries (axios, superagent)
**Chosen**: Native Fetch API

**Decision 5: Unicode Symbols vs Icon Library**
**Rationale**: Unicode requires zero dependencies, universal browser support, and adequate visual clarity for MVP. Icon library would add download overhead and dependency management.
**Alternatives Considered**: Font Awesome, Weather Icons font, custom SVG set
**Chosen**: Unicode weather symbols

**Decision 6: CSS Grid/Flexbox vs Framework**
**Rationale**: Modern CSS provides sufficient layout capabilities for simple responsive design. Bootstrap/Tailwind adds significant overhead for minimal benefit in MVP.
**Alternatives Considered**: Bootstrap, Tailwind CSS, Foundation
**Chosen**: Hand-written CSS with Grid/Flexbox

**Decision 7: Template Variable Injection vs JavaScript Config**
**Rationale**: Server-side template injection provides type-safe configuration and centralized setup. JavaScript config file would require separate endpoint or hardcoded values.
**Alternatives Considered**: JavaScript config.js file, /api/config endpoint
**Chosen**: Template variable {{.APIEndpoint}}

**Decision 8: Error Display Area vs Modals**
**Rationale**: Inline error display is more accessible, doesn't interrupt user flow, and simpler to implement. Modals require JavaScript libraries or complex markup.
**Alternatives Considered**: Modal dialogs, browser alert(), toast notifications
**Chosen**: Inline error message div

**Decision 9: Client-Side Validation + API Validation**
**Rationale**: Client-side provides immediate feedback (better UX), but API validation ensures security and data integrity. Defense in depth.
**Alternatives Considered**: Client-side only, API only
**Chosen**: Both layers of validation

**Decision 10: Mobile-First Responsive Design**
**Rationale**: Mobile-first ensures good experience on smallest screens, then enhances for larger. Aligns with modern web development best practices.
**Alternatives Considered**: Desktop-first, separate mobile site
**Chosen**: Mobile-first responsive CSS

### Open Design Questions

**None** - All design decisions made autonomously in YOLO mode. Assumptions documented in "YOLO Mode Decisions" section are reasonable for MVP and aligned with Sprint 1-3 patterns. Design can proceed to implementation.

---

# Design Summary

## Overall Architecture

**Three-Tier Web Application Architecture:**

```
Tier 1: Presentation (Sprint 4 - THIS SPRINT)
  ↓ Browser-based WebUI
  ↓ HTML + CSS + JavaScript
  ↓ Interactive forms and visual display

Tier 2: Application Logic (Sprint 3 - REST API)
  ↓ HTTP REST API
  ↓ JSON request/response
  ↓ Business logic delegation

Tier 3: Data/Business Logic (Sprint 2 - Weather Package)
  ↓ Weather data retrieval
  ↓ API integration
  ↓ External service communication
```

**Key Architectural Principles:**

1. **Separation of Concerns**: WebUI only handles presentation, delegates all logic to REST API
2. **Zero Code Duplication**: No business logic in WebUI, all via API calls
3. **Technology Consistency**: Go backend (Sprint 1-4), standard library focus
4. **MVP Simplicity**: No unnecessary frameworks or dependencies
5. **Responsive Design**: Mobile-first, works on all screen sizes
6. **Graceful Degradation**: Clear error messages when dependencies unavailable

## Shared Components

**Between Sprint 3 API and Sprint 4 WebUI:**

**REST API Contract (HTTP/JSON):**
- API endpoints (city, coordinates, health)
- JSON response format (ForecastResponse structure)
- Error response format ({"error": "...", "status": 404})
- HTTP status codes (200, 400, 404, 503, 500)

**Data Structures (via JSON):**
- ForecastResponse: latitude, longitude, timezone, current, daily
- CurrentWeather: time, temperature_2m, weather_code
- DailyForecast: time[], temperature_2m_max[], temperature_2m_min[], weather_code[]

**Weather Codes:**
- WMO weather interpretation codes (0-99)
- Unicode symbol mapping (shared understanding)

**Validation Rules:**
- Coordinate ranges: lat (-90 to 90), lon (-180 to 180)
- Required parameters: city name, lat/lon
- Error messages (consistent between API and UI)

**Benefits of Shared Contract:**
- Loose coupling (API and WebUI can evolve independently)
- Clear interface boundary
- Easy testing (can mock API responses)
- Technology agnostic (API could be reimplemented in different language)

## Design Risks

**Low Risks:**

1. **Go Template Rendering** (Low):
   - Risk: Template syntax errors or rendering failures
   - Mitigation: Simple template with minimal logic, standard library html/template
   - Impact: Compile-time template parsing catches most errors

2. **Static File Serving** (Low):
   - Risk: Files not found or incorrect MIME types
   - Mitigation: Standard http.FileServer, well-tested functionality
   - Impact: Easy to debug, clear error messages

3. **Browser Compatibility** (Low):
   - Risk: JavaScript features not supported in older browsers
   - Mitigation: Target modern browsers only, use widely-supported features (Fetch API is ~2015+)
   - Impact: Limited audience reduction (modern browsers >95% market share)

4. **Unicode Weather Symbols** (Low):
   - Risk: Symbols not rendering on some systems
   - Mitigation: Unicode emoji widely supported, fallback symbol (🌡️) for unknown codes
   - Impact: Visual feedback still present, can upgrade to icon font later

**Medium Risks:**

5. **CORS Issues** (Medium):
   - Risk: Browser blocks cross-origin requests between localhost:8081 and localhost:8080
   - Mitigation: Modern browsers allow localhost cross-origin, fallback: add CORS headers to API or implement server-side proxy
   - Impact: Could require weather-api modification or WebUI proxy implementation
   - Likelihood: Low (localhost typically permissive)

6. **API Availability Dependency** (Medium):
   - Risk: WebUI unusable if weather-api is down
   - Mitigation: Clear error messages, health check on startup, documentation emphasizes prerequisite
   - Impact: User experience degraded but gracefully handled

7. **Client-Side Validation Bypass** (Medium):
   - Risk: Malicious user bypasses JavaScript validation
   - Mitigation: API has server-side validation (defense in depth), WebUI only needs to protect normal users from mistakes
   - Impact: No security issue (API validates), but poor UX if bypassed

**Risk Mitigation Summary:**
- All high-severity risks mitigated to medium or low
- No blocking risks for MVP
- Clear upgrade paths for identified risks
- Consistent with YOLO mode tolerance for MVP-acceptable trade-offs

## Resource Requirements

**Development Tools:**
- ✅ Go 1.21+ (from Sprint 1)
- ✅ Text editor or IDE (any, for HTML/CSS/JavaScript editing)
- ✅ Web browser (Chrome, Firefox, Safari, or Edge latest version)
- ✅ curl or browser DevTools (for testing)
- ✅ git (for version control)

**Go Standard Library Packages:**
- ✅ net/http - HTTP server, routing, file serving
- ✅ html/template - Template rendering with auto-escaping
- ✅ log - Server logging
- ✅ os - Environment variables, signals
- ✅ os/signal - Graceful shutdown
- ✅ context - Timeout and cancellation
- ✅ time - Durations and timeouts

**Frontend Technologies (Browser-Native):**
- ✅ HTML5 - Semantic markup
- ✅ CSS3 - Styling, Grid, Flexbox, Media Queries
- ✅ JavaScript ES6+ - Fetch API, async/await, arrow functions, template literals
- ✅ Unicode - Weather symbols (emoji)

**External Services:**
- ✅ weather-api (Sprint 3) - Must be running on localhost:8080
- ✅ Open-Meteo APIs - Accessed indirectly via weather-api

**External Dependencies:**
- ❌ None - Zero external dependencies for MVP
- ✅ All functionality from standard library and browser-native APIs

**Development Environment:**
- ✅ Platform: macOS, Linux, or Windows (Go cross-platform)
- ✅ Internet connection: Required (for API calls to Open-Meteo via weather-api)
- ✅ Ports available: 8081 (WebUI), 8080 (API from Sprint 3)

**Testing Requirements:**
- ✅ Multiple browsers for compatibility testing (Chrome, Firefox, Safari, Edge)
- ✅ Browser DevTools (Network tab, Console, responsive design mode)
- ✅ Screen sizes: Mobile (< 768px), Tablet (768-1024px), Desktop (> 1024px)

**No Additional Resources Required** - All tools and technologies already available from Sprint 1-3

## Design Approval Status

Status: **Accepted** (YOLO Mode - Auto-Approved)

**YOLO Mode**: This design was created in YOLO (autonomous) mode per PLAN.md Sprint 4 configuration. All design decisions were made autonomously based on:
- Established patterns from Sprint 1-3
- MVP simplicity requirements
- Technology consistency (Go + standard library)
- Analysis recommendations from sprint_4_analysis.md

**Design Confidence**: High
- All requirements from RSB-5 addressed
- Feasibility confirmed (APIs available, technology proven)
- Consistent with established project patterns
- 12 design decisions documented with rationale
- Clear implementation path defined
- Testing strategy comprehensive

**Design Completeness**:
- ✅ All Backlog Items (RSB-5) covered
- ✅ Feasibility confirmed for each requirement
- ✅ APIs and technical approach documented
- ✅ Error handling specified
- ✅ Testing strategy defined (21 tests + 5 edge cases)
- ✅ Integration points identified (Sprint 3 dependency)
- ✅ Documentation requirements listed
- ✅ Implementation approach detailed (8 steps)
- ✅ YOLO mode decisions documented (12 decisions)

**Next Phase**: Construction (Implementation)

**Implementation Readiness**: Ready to proceed immediately. Constructor Agent has all information needed:
- Exact file structure defined
- Code structure outlined
- API integration patterns specified
- HTML/CSS/JavaScript architecture detailed
- Testing procedures comprehensive
- No blocking questions or dependencies
