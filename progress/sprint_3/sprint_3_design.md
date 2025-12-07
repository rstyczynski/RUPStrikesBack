# Sprint 3 - Design

## RSB-4. Weather forecast exposes REST API

Status: Accepted

### Requirement Summary

REST API exposing weather forecast data via HTTP with JSON responses. Enable CORS for WebUI. Product location: `./weather-api`. Reuse Sprint 2 `weather/` package for ~80% code reuse.

### Feasibility Analysis

**API Availability:**

All APIs available via Sprint 2 `weather/` package:
- Open-Meteo Geocoding API (via `weather.GeocodeCity()`)
- Open-Meteo Forecast API (via `weather.GetForecast()`)
- Data structures: `weather.ForecastResponse`, `weather.Location`

**Technical Constraints:**

- Go standard library (`net/http`) sufficient
- Sprint 2 package must be importable
- CORS required for WebUI (Sprint 4)
- JSON encoding (standard library)

**Risk Assessment:**

- **Import path:** Low - Go modules resolve correctly
- **CORS security:** Low - MVP permissive acceptable, document for production
- **Port conflicts:** Low - configurable port
- **API changes:** Low - reuses Sprint 2 stable client

**Feasibility:** HIGH - 80% code exists, standard HTTP patterns

### Design Overview

**Architecture:**

```
HTTP Request
    ↓
CORS Middleware
    ↓
Router (net/http ServeMux)
    ↓
Handler (weather.go)
    ↓
Sprint 2 Package Import
    ↓
weather.GetWeatherForCity() OR weather.GetWeatherForCoordinates()
    ↓
JSON Encoder
    ↓
HTTP Response (JSON)
```

**Key Components:**

1. **main.go** - HTTP server setup, port config, graceful shutdown
2. **handlers/weather.go** - Request handlers, query param parsing, error responses
3. **middleware/cors.go** - CORS headers for cross-origin WebUI access
4. **Sprint 2 Import** - `import "weather-cli/weather"` for ALL business logic

**Data Flow:**

1. HTTP GET /weather?city=London
2. CORS middleware adds headers
3. Handler parses query params
4. Calls `weather.GetWeatherForCity("London")` (Sprint 2 package)
5. Encodes result as JSON
6. Returns HTTP 200 + JSON body

### Technical Specification

**Project Structure:**

```
weather-api/
├── main.go            # HTTP server setup
├── handlers/
│   └── weather.go     # Endpoints: /weather, /health
├── middleware/
│   └── cors.go        # CORS headers
└── README.md          # API documentation

Dependencies:
  import "weather-cli/weather"  # Sprint 2 package (ALL API logic)
```

**REST Endpoints:**

| Endpoint | Method | Query Params | Response | Description |
|----------|--------|--------------|----------|-------------|
| `/weather` | GET | `city=<name>` | JSON forecast | Weather by city name |
| `/weather` | GET | `lat=<f>&lon=<f>` | JSON forecast | Weather by coordinates |
| `/health` | GET | - | `{"status":"ok"}` | Health check |

**Request Examples:**

```
GET /weather?city=San%20Francisco
GET /weather?lat=37.77&lon=-122.42
GET /health
```

**Response Structure (JSON):**

```json
{
  "location": {
    "name": "San Francisco",
    "country": "United States",
    "latitude": 37.77,
    "longitude": -122.42
  },
  "current": {
    "temperature_2m": 18.5,
    "weather_code": 2
  },
  "daily": {
    "time": ["2025-12-07", "2025-12-08", "2025-12-09"],
    "temperature_2m_max": [19.2, 17.8, 18.1],
    "temperature_2m_min": [13.1, 11.9, 12.5],
    "weather_code": [1, 3, 2]
  }
}
```

**Error Responses:**

| Status | Scenario | JSON Body |
|--------|----------|-----------|
| 400 | Missing params | `{"error":"missing city or coordinates"}` |
| 404 | City not found | `{"error":"city not found"}` |
| 500 | API error | `{"error":"failed to fetch weather"}` |

**CORS Configuration:**

```go
// middleware/cors.go
func CORS(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r)
    })
}
```

**Handler Implementation (IMPORTS SPRINT 2):**

```go
// handlers/weather.go
package handlers

import (
    "encoding/json"
    "net/http"
    "strconv"
    "weather-cli/weather"  // ← SPRINT 2 PACKAGE IMPORT
)

func Weather(w http.ResponseWriter, r *http.Request) {
    city := r.URL.Query().Get("city")
    latStr := r.URL.Query().Get("lat")
    lonStr := r.URL.Query().Get("lon")

    if city != "" {
        // Use Sprint 2 package function
        forecast, location, err := weather.GetWeatherForCity(city)
        if err != nil {
            respondError(w, 404, "city not found")
            return
        }
        respondJSON(w, map[string]interface{}{
            "location": location,
            "current": forecast.Current,
            "daily": forecast.Daily,
        })
    } else if latStr != "" && lonStr != "" {
        lat, _ := strconv.ParseFloat(latStr, 64)
        lon, _ := strconv.ParseFloat(lonStr, 64)

        // Use Sprint 2 package function
        forecast, err := weather.GetWeatherForCoordinates(lat, lon)
        if err != nil {
            respondError(w, 500, "failed to fetch weather")
            return
        }
        respondJSON(w, forecast)
    } else {
        respondError(w, 400, "missing city or coordinates")
    }
}
```

### Implementation Approach

**Step 1:** Create `weather-api/` directory structure
**Step 2:** Initialize Go module: `go mod init weather-api`
**Step 3:** Add dependency: `go get ../weather-cli` (Sprint 2 package)
**Step 4:** Implement CORS middleware (`middleware/cors.go`)
**Step 5:** Implement handlers (`handlers/weather.go`) - import Sprint 2 package
**Step 6:** Implement main server (`main.go`) - port 8080, graceful shutdown
**Step 7:** Build and test with curl
**Step 8:** Document API in README.md

### Testing Strategy

**Functional Tests (curl):**

1. City name: `curl http://localhost:8080/weather?city=London`
2. Coordinates: `curl http://localhost:8080/weather?lat=51.5&lon=-0.1`
3. Invalid city: `curl http://localhost:8080/weather?city=InvalidCity123`
4. Missing params: `curl http://localhost:8080/weather`
5. Health check: `curl http://localhost:8080/health`
6. CORS headers: `curl -H "Origin: http://example.com" -I http://localhost:8080/weather?city=Paris`

**Success Criteria:**

- ✅ REST API serves JSON responses
- ✅ City endpoint works (200 + JSON)
- ✅ Coordinates endpoint works (200 + JSON)
- ✅ Errors return proper status codes (400, 404, 500)
- ✅ CORS headers present (`Access-Control-Allow-Origin: *`)
- ✅ Health check returns 200 + `{"status":"ok"}`
- ✅ Sprint 2 package imported successfully

### Integration Notes

**Dependencies:**

- **Sprint 2 (CRITICAL):** Imports `weather-cli/weather` package
  - `weather.GetWeatherForCity(city string)`
  - `weather.GetWeatherForCoordinates(lat, lon float64)`
  - `weather.ForecastResponse`, `weather.Location` types

**Compatibility:**

- **Forward:** Sprint 4 WebUI will consume this REST API
- **Backward:** Reuses Sprint 2 API client logic (zero duplication)

**Code Reuse:**

| Component | Sprint 2 Source | Sprint 3 Usage |
|-----------|----------------|----------------|
| Geocoding API | `weather/api.go` | ✅ Imported via `weather.GetWeatherForCity()` |
| Forecast API | `weather/api.go` | ✅ Imported via `weather.GetWeatherForCoordinates()` |
| Data types | `weather/types.go` | ✅ Used for JSON responses |
| HTTP client | `weather/api.go` | ✅ Reused internally |

**Result:** ~600 lines reused, ~150 lines new (HTTP server + handlers)

### Documentation Requirements

**User Documentation (README.md):**

- API endpoints table
- Request/response examples (curl)
- Error codes
- CORS configuration
- Running the server

**Technical Documentation:**

- Sprint 2 package dependency
- Code reuse strategy
- Handler architecture

### Design Decisions

**Decision 1: Import Sprint 2 vs Duplicate Code**
**Decision Made:** Import `weather-cli/weather` package
**Rationale:** Zero code duplication, single source of truth for API logic, maintainability
**Alternatives:** Copy/paste code (rejected - violates DRY)

**Decision 2: HTTP Framework**
**Decision Made:** Go standard library `net/http`
**Rationale:** Consistent with Sprint 2 (no external deps), sufficient for MVP, simple
**Alternatives:** Gin/Echo frameworks (rejected - adds dependencies, over-engineering for MVP)

**Decision 3: CORS Policy**
**Decision Made:** Allow all origins (`*`) for MVP
**Rationale:** Simplifies WebUI development (Sprint 4), standard MVP practice, documented for production lockdown
**Alternatives:** Specific origins (rejected - premature for MVP)

## YOLO Mode Decisions

**YOLO Decision 1: Default Port 8080**
**Context:** Port number not specified in requirements
**Decision Made:** Use port 8080 as default (configurable via env var)
**Rationale:** Standard HTTP alternative port, commonly used for dev servers, easy to remember
**Risk:** Low - configurable, well-documented

**YOLO Decision 2: Health Endpoint Path**
**Context:** Health check endpoint not specified
**Decision Made:** `/health` returning `{"status":"ok"}`
**Rationale:** Standard pattern, simple, WebUI can verify API availability
**Risk:** Low - common convention

**YOLO Decision 3: JSON Response Structure**
**Context:** Exact JSON format not specified
**Decision Made:** Mirror Sprint 2 `weather.ForecastResponse` structure
**Rationale:** Consistency with Sprint 2 types, no transformation needed, straightforward
**Risk:** Low - uses established data structures

### Open Design Questions

**None** - All design decisions made autonomously (YOLO mode)

---

# Design Summary

## Overall Architecture

Simple HTTP server wrapping Sprint 2 `weather/` package. CORS middleware enables WebUI access. Handlers parse query params, call Sprint 2 functions, encode JSON responses.

## Shared Components

- **Sprint 2 Package:** ALL API logic (geocoding, forecast, data types)
- **CORS Middleware:** Reusable for all endpoints
- **JSON Encoding:** Standard library

## Design Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Import path issues | Low | Test immediately, Go modules |
| CORS too permissive | Low | Document, restrict in production |
| Port conflicts | Low | Configurable port |

## Resource Requirements

**Tools:**
- Go 1.21+ (Sprint 1)
- Sprint 2 `weather-cli/weather` package

**External Services:**
- Open-Meteo APIs (via Sprint 2 package)

## Design Approval Status

**Status: Accepted**

YOLO mode: Auto-approving design after documentation (no 60s wait).

Design complete, all requirements addressed, Sprint 2 reuse maximized (~80%). Ready for Construction.

---

**Design Complete**
**Mode:** YOLO (auto-approved)
**Code Reuse:** 80% from Sprint 2
**New Code:** ~150 lines (HTTP server + handlers)
