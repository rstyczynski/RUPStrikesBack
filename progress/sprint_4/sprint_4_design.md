# Sprint 4 - Design

## RSB-5. Weather forecast WebUI

Status: Accepted

### Requirement Summary

Browser-based WebUI consuming Sprint 3 REST API. Interactive UI with city search, 3-day forecast display, weather icons, and responsive design. Product location: `./weather-web`.

### Feasibility Analysis

**API Availability:**

Sprint 3 REST API confirmed functional (tested in Sprint 3):
- `GET /weather?city=<name>` - City weather with location data
- `GET /weather?lat=<lat>&lon=<lon>` - Coordinate weather
- `GET /health` - API health check
- CORS enabled (`Access-Control-Allow-Origin: *`)
- JSON responses documented

**Technical Constraints:**

- Go HTTP server for serving static files (standard library)
- HTML/CSS/JavaScript (no build process, no frameworks)
- Modern browser fetch() API (ES6+)
- Weather icons from CDN (Font Awesome) or inline SVG
- Responsive CSS (mobile-first, flexbox/grid)

**Risk Assessment:**

| Risk | Severity | Mitigation |
|------|----------|------------|
| CORS issues | Low | Verified in Sprint 3 tests |
| API unavailable | Low | Health check endpoint, error messages to user |
| Browser compatibility | Low | Use widely supported JS (fetch, ES6) |
| Weather code mapping | Low | Open-Meteo standard codes (0-99), simple lookup table |

**Feasibility:** HIGH - All APIs available, CORS verified, standard web tech

### Design Overview

**Architecture:**

```
User Browser
    ↓
weather-web:8081 (Go HTTP server, static files)
    ↓
index.html + style.css + app.js
    ↓
JavaScript fetch() → localhost:8080/weather (Sprint 3 API)
    ↓
Parse JSON → Update DOM with forecast data
```

**Key Components:**

1. **Backend (Go HTTP server)** - Serves static files (HTML/CSS/JS) on port 8081
2. **Frontend HTML** - UI structure (search form, forecast display area)
3. **Frontend CSS** - Responsive styling (mobile-first, grid layout)
4. **Frontend JavaScript** - API calls, JSON parsing, DOM manipulation, error handling

**Data Flow:**

1. User enters city name in form → Submit
2. JavaScript captures form submit → `fetch('http://localhost:8080/weather?city=London')`
3. Parse JSON response → Extract location, current, daily forecast
4. Map weather codes to icons/descriptions
5. Update DOM with results (location name, current temp, 3-day forecast)
6. Error handling: Display user-friendly message on API failure

### Technical Specification

**Project Structure:**

```
weather-web/
├── main.go              # HTTP server (port 8081, static file serving)
├── static/
│   ├── index.html       # Main UI
│   ├── style.css        # Responsive styling
│   └── app.js           # API integration, DOM updates
└── README.md            # Usage documentation
```

**Backend (main.go):**

- Go `net/http` server on port 8081 (env var `PORT`)
- Serve `static/` directory
- Route `/` → `static/index.html`
- ~30 lines of code

**Frontend (index.html):**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Weather Forecast</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Weather Forecast</h1>

        <!-- Search Form -->
        <form id="searchForm">
            <input type="text" id="cityInput" placeholder="Enter city name" required>
            <button type="submit">Get Forecast</button>
        </form>

        <!-- Results Display -->
        <div id="results" class="hidden">
            <div id="location"></div>
            <div id="current"></div>
            <div id="forecast"></div>
        </div>

        <!-- Error Message -->
        <div id="error" class="hidden"></div>
    </div>

    <script src="app.js"></script>
</body>
</html>
```

**Frontend (app.js):**

```javascript
const API_URL = 'http://localhost:8080';

document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = document.getElementById('cityInput').value;

    try {
        const response = await fetch(`${API_URL}/weather?city=${encodeURIComponent(city)}`);
        if (!response.ok) throw new Error('City not found');

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError(error.message);
    }
});

function displayWeather(data) {
    // Update location
    document.getElementById('location').innerHTML =
        `<h2>${data.location.name}, ${data.location.country}</h2>`;

    // Update current weather
    document.getElementById('current').innerHTML =
        `<div class="current-weather">
            <div class="temp">${data.current.temperature_2m}°C</div>
            <div class="icon">${getWeatherIcon(data.current.weather_code)}</div>
        </div>`;

    // Update 3-day forecast
    const forecastHTML = data.daily.time.map((date, i) => `
        <div class="day">
            <div class="date">${formatDate(date)}</div>
            <div class="icon">${getWeatherIcon(data.daily.weather_code[i])}</div>
            <div class="temps">
                <span class="high">${data.daily.temperature_2m_max[i]}°C</span>
                <span class="low">${data.daily.temperature_2m_min[i]}°C</span>
            </div>
        </div>
    `).join('');

    document.getElementById('forecast').innerHTML = forecastHTML;

    // Show results, hide error
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
}

function getWeatherIcon(code) {
    // Open-Meteo weather codes: https://open-meteo.com/en/docs
    const icons = {
        0: '☀️',  // Clear sky
        1: '🌤', 2: '⛅', 3: '☁️',  // Partly cloudy
        45: '🌫', 48: '🌫',  // Fog
        51: '🌧', 53: '🌧', 55: '🌧',  // Drizzle
        61: '🌧', 63: '🌧', 65: '🌧',  // Rain
        71: '🌨', 73: '🌨', 75: '🌨',  // Snow
        95: '⛈', 96: '⛈', 99: '⛈'  // Thunderstorm
    };
    return icons[code] || '🌡';
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function showError(message) {
    document.getElementById('error').textContent = message;
    document.getElementById('error').classList.remove('hidden');
    document.getElementById('results').classList.add('hidden');
}
```

**Frontend (style.css):**

```css
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

h1 { text-align: center; color: #333; margin-bottom: 30px; }

#searchForm {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
}

#cityInput {
    flex: 1;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
}

button {
    padding: 12px 24px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

button:hover { background: #5568d3; }

.current-weather {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin: 20px 0;
}

.temp { font-size: 48px; font-weight: bold; }
.icon { font-size: 64px; }

#forecast {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin-top: 20px;
}

.day {
    background: #f5f5f5;
    padding: 15px;
    border-radius: 5px;
    text-align: center;
}

.hidden { display: none; }

#error {
    background: #fee;
    color: #c33;
    padding: 15px;
    border-radius: 5px;
    text-align: center;
}

/* Responsive */
@media (max-width: 600px) {
    .container { padding: 15px; }
    #forecast { grid-template-columns: 1fr; }
}
```

### Implementation Approach

**Step 1:** Create `weather-web/` directory structure
**Step 2:** Initialize Go module: `go mod init weather-web`
**Step 3:** Create `main.go` - HTTP server serving `static/` directory on port 8081
**Step 4:** Create `static/index.html` - UI structure
**Step 5:** Create `static/style.css` - Responsive styling
**Step 6:** Create `static/app.js` - API integration logic
**Step 7:** Test in browser (city search, forecast display, error handling)
**Step 8:** Document usage in README.md

### Testing Strategy

**Functional Tests (Browser):**

| Test | Input | Expected Output | Verification |
|------|-------|----------------|--------------|
| Valid city | "London" | Location + current + 3-day forecast displayed | Manual browser check |
| Invalid city | "InvalidCity123" | Error message displayed | Manual browser check |
| Empty input | "" | Form validation prevents submit | Manual browser check |
| API health | Browse to localhost:8081 | WebUI loads | Manual browser check |
| Responsive | Resize browser | Layout adapts | Manual browser check |

**Edge Cases:**

1. API unavailable (Sprint 3 not running) → Error message shown
2. Network error → Error message shown
3. Special characters in city name → URL encoding via `encodeURIComponent()`

**Success Criteria:**

- ✅ WebUI loads on localhost:8081
- ✅ City search returns forecast data
- ✅ Invalid city shows error message
- ✅ 3-day forecast displayed with icons and temps
- ✅ Responsive design works on mobile/desktop
- ✅ CORS functional (API calls succeed)

### Integration Notes

**Dependencies:**

- **Sprint 3 (CRITICAL):** REST API must be running on localhost:8080
  - Verified: CORS enabled, JSON responses documented
- **Go runtime:** Sprint 1 (Go 1.21+)

**Compatibility:**

- Consumes Sprint 3 API endpoints (`/weather`, `/health`)
- Uses Sprint 3 JSON response structure (no transformation needed)
- Forward compatible: Sprint 6 will add map integration to this UI

**Reusability:**

- Weather icon mapping function reusable for future features
- Fetch wrapper can be extended for coordinate search
- CSS responsive patterns reusable

### Documentation Requirements

**User Documentation (README.md):**

- Prerequisites (Sprint 3 API running)
- Starting WebUI server
- Using city search
- Browser compatibility notes

**Technical Documentation:**

- API integration details
- Weather code mapping reference
- File structure overview

## YOLO Mode Decisions

**Decision 1: Pure HTML/CSS/JS vs Framework**
**Context:** Could use React/Vue/Svelte for richer interactivity
**Decision Made:** Pure HTML/CSS/JavaScript (no framework, no build)
**Rationale:** MVP simplicity, no dependencies, fast iteration, sufficient for current requirements
**Alternatives Considered:** React (rejected - adds build complexity, over-engineering)
**Risk:** Low - standard web tech, easy to upgrade later if needed

**Decision 2: Weather Icon Strategy**
**Context:** Need visual weather representation for codes 0-99
**Decision Made:** Unicode emoji icons (☀️🌧🌨⛈) with simple lookup table
**Rationale:** No external dependencies, work everywhere, sufficient for MVP, fast rendering
**Alternatives Considered:** Font Awesome CDN (rejected - unnecessary dependency for MVP)
**Risk:** Low - emojis universally supported in modern browsers

**Decision 3: WebUI Server Port**
**Context:** Port number not specified
**Decision Made:** Port 8081 (API on 8080, WebUI on 8081)
**Rationale:** Sequential ports logical, avoids conflict with Sprint 3 API, configurable via env
**Alternatives Considered:** Same port 8080 (rejected - would conflict with API)
**Risk:** Low - separate processes per requirements, well-documented

---

# Design Summary

## Overall Architecture

Simple 3-tier web app: Go static file server (8081) → HTML/CSS/JS frontend → Sprint 3 REST API (8080) → Open-Meteo APIs. Pure client-side rendering with fetch() API calls.

## Shared Components

- Sprint 3 REST API (reused, no changes)
- Weather code mapping (new, reusable for future features)
- Responsive CSS patterns (reusable)

## Design Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| API dependency | Low | Health check, error handling, user messaging |
| Browser compatibility | Low | Stick to ES6 widely supported features |
| CORS issues | Low | Verified in Sprint 3, tested in construction |

## Resource Requirements

**Tools:**
- Go 1.21+ (Sprint 1)
- Modern browser (Chrome, Firefox, Safari, Edge)

**External Services:**
- Sprint 3 REST API (localhost:8080)
- Open-Meteo APIs (via Sprint 3)

## Design Approval Status

**Status: Accepted**

YOLO mode: Auto-approved. Design complete, all requirements addressed, Sprint 3 integration verified. Ready for Construction.

---

**Design Complete**
**Mode:** YOLO (auto-approved)
**New Code:** ~350 lines (30 Go + 50 HTML + 120 CSS + 150 JS)
**Reused:** Sprint 3 API (100% reuse, no changes)
