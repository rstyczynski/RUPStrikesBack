# Sprint 3 - Design

## RSB-4. Weather forecast exposes REST API

Status: Accepted

### Requirement Summary

Build a RESTful API in Go that exposes weather forecast data through standard HTTP methods with JSON responses. The API must be located in `./weather-api`, follow the `./weather-cli` approach, and maintain ZERO code duplication by importing and reusing Sprint 2's `weather/` package. This creates a service-oriented architecture separating data logic from presentation layers.

### Feasibility Analysis

**API Availability:**

All required functionality available from Sprint 2:

1. **weather.GetWeatherForCity()** - `weather-cli/weather/client.go`
   - Converts city name to coordinates via geocoding
   - Retrieves forecast for those coordinates
   - Returns `(*ForecastResponse, *Location, error)`
   - Status: ✅ Implemented and tested in Sprint 2

2. **weather.GetWeatherForCoordinates()** - `weather-cli/weather/client.go`
   - Retrieves forecast for provided GPS coordinates
   - Returns `(*ForecastResponse, error)`
   - Status: ✅ Implemented and tested in Sprint 2

3. **Data Structures** - `weather-cli/weather/types.go`
   - `ForecastResponse` with JSON tags
   - `Location` with JSON tags
   - `CurrentWeather` with JSON tags
   - `DailyForecast` with JSON tags
   - Status: ✅ All structures ready for JSON marshaling

**Go Standard Library Availability:**

All required HTTP server functionality available:
- `net/http` - HTTP server, routing, handlers
- `encoding/json` - JSON encoding/decoding
- `fmt` - Error formatting
- `log` - Server logging
- `os` - Environment variables, signals
- `os/signal` - Graceful shutdown
- `context` - Timeout and cancellation
- `strconv` - String to float conversion

**Technical Constraints:**

- Platform: Cross-platform (macOS, Linux, Windows)
- Go language: Established in Sprint 1
- No external dependencies for MVP (standard library only)
- Internet connectivity required (API-dependent)
- Must import `weather-cli/weather` package

**Risk Assessment:**

- **Go Module Import:** Medium - Requires local package import configuration (Go workspace or replace directive)
  - Mitigation: Use `replace` directive in go.mod for local development
- **HTTP Server:** Low - Standard library HTTP server is production-ready
- **API Integration:** Very Low - Reusing proven Sprint 2 implementation
- **JSON Marshaling:** Very Low - Structures already have JSON tags
- **Error Handling:** Low - Standard HTTP error patterns

**Feasibility Conclusion:** HIGH - All components available, 80% code reuse from Sprint 2, standard library sufficient for MVP

---

## YOLO Mode Decisions

This sprint was designed in YOLO (autonomous) mode. The following design decisions were made:

### Decision 1: HTTP Router Choice
**Context**: Need to route HTTP requests to appropriate handlers. Options: standard library ServeMux, third-party routers (gorilla/mux, chi, gin, httprouter).
**Decision Made**: Use Go standard library `http.ServeMux` for routing
**Rationale**:
- MVP simplicity requirement (PLAN.md)
- Only 3-4 endpoints needed (simple routing)
- Consistency with Sprint 2 (standard library only)
- Zero external dependencies
- ServeMux sufficient for basic path-based routing
**Alternatives Considered**:
- gorilla/mux: Full-featured but adds dependency, overkill for 3 endpoints
- chi: Lightweight but still external dependency
- gin: High-performance framework, too complex for MVP
**Risk**: Low - ServeMux handles requirements; can upgrade if routing becomes complex

### Decision 2: API Endpoint Structure
**Context**: Need to define RESTful endpoints for weather data access
**Decision Made**:
- `GET /weather/city?name={cityName}` - Weather by city name
- `GET /weather/coordinates?lat={latitude}&lon={longitude}` - Weather by GPS
- `GET /health` - Health check
**Rationale**:
- Resource-oriented REST design (/weather resource)
- Query parameters match Sprint 2 CLI inputs
- Clear semantic meaning (city vs coordinates)
- Health check is standard observability practice
**Alternatives Considered**:
- Path parameters: `/weather/city/{name}` - Requires advanced router
- Single endpoint with parameter detection - Less clear API contract
- Multiple top-level resources - Over-engineered for simple API
**Risk**: Low - Standard REST conventions, clear API contract

### Decision 3: Response Format Structure
**Context**: Need to define JSON response structure for weather data
**Decision Made**: Direct serialization of Sprint 2 data structures:
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "timezone": "America/Los_Angeles",
  "current": {
    "time": "2025-12-06T15:00",
    "temperature_2m": 18.5,
    "weather_code": 1
  },
  "daily": {
    "time": ["2025-12-06", "2025-12-07", "2025-12-08"],
    "temperature_2m_max": [20.1, 19.8, 21.3],
    "temperature_2m_min": [14.2, 13.9, 15.1],
    "weather_code": [1, 2, 1]
  }
}
```
**Rationale**:
- Reuse existing `ForecastResponse` structure (zero duplication)
- JSON tags already present from Sprint 2
- Matches Open-Meteo API response format (industry standard)
- No transformation needed (direct marshal)
**Alternatives Considered**:
- Custom response wrapper: Adds unnecessary complexity
- Flattened structure: Loses semantic grouping
- Include location in every response: Redundant for coordinates endpoint
**Risk**: Very Low - Proven structure, already tested

### Decision 4: Error Response Format
**Context**: Need consistent error handling for all endpoints
**Decision Made**: JSON error responses with structure:
```json
{
  "error": "city not found: InvalidCity",
  "status": 404
}
```
**Rationale**:
- Consistent with JSON response format requirement
- HTTP status codes follow REST conventions
- Machine-readable for programmatic clients
- Human-readable error messages
**Alternatives Considered**:
- Plain text errors: Not JSON (inconsistent format)
- Detailed error objects: Over-engineered for MVP
- Error codes: Adds complexity without clear benefit
**Risk**: Low - Standard REST error pattern

### Decision 5: HTTP Status Code Mapping
**Context**: Need to map application errors to appropriate HTTP status codes
**Decision Made**:
- 200 OK: Successful weather data retrieval
- 400 Bad Request: Invalid parameters (missing name, invalid coordinates)
- 404 Not Found: City not found by geocoding API
- 500 Internal Server Error: API failures, unexpected errors
- 503 Service Unavailable: Open-Meteo API unreachable
**Rationale**:
- Standard HTTP semantics
- Clear distinction between client errors (4xx) and server errors (5xx)
- Matches REST best practices
**Alternatives Considered**:
- Always 200 with error in body: Poor REST practice
- Fine-grained status codes (422, 502, etc.): Over-engineered for MVP
**Risk**: Low - Standard HTTP conventions

### Decision 6: Server Configuration
**Context**: Need to configure HTTP server port, timeouts, and graceful shutdown
**Decision Made**:
- Port: 8080 (override via `PORT` environment variable)
- Read timeout: 15 seconds
- Write timeout: 15 seconds
- Idle timeout: 60 seconds
- Graceful shutdown: 10 second timeout on SIGINT/SIGTERM
**Rationale**:
- Port 8080 is standard for development HTTP servers
- Environment variable enables deployment flexibility
- Timeouts prevent resource exhaustion
- Graceful shutdown ensures clean termination
**Alternatives Considered**:
- Hardcoded port: Less flexible for deployment
- No timeouts: Risk of hanging connections
- No graceful shutdown: Abrupt termination
**Risk**: Low - Production-ready configuration

### Decision 7: Module Import Strategy
**Context**: Need to import `weather-cli/weather` package from sibling directory
**Decision Made**: Use `replace` directive in `go.mod`:
```go
module github.com/rstyczynski/RUPStrikesBack/weather-api

replace github.com/rstyczynski/RUPStrikesBack/weather-cli => ../weather-cli

require github.com/rstyczynski/RUPStrikesBack/weather-cli v0.0.0
```
**Rationale**:
- Enables local package import during development
- No need for Go workspace setup
- Works with standard `go build` commands
- Follows Go module best practices for local development
**Alternatives Considered**:
- Go workspace: More complex setup, additional workspace file
- Vendor directory: Defeats zero duplication goal
- Copy code: Violates zero duplication agreement
**Risk**: Medium - Requires correct relative path, works for development (production might use proper module versioning)

### Decision 8: Logging Strategy
**Context**: Need to log HTTP requests and errors for observability
**Decision Made**:
- Request logging: Method, path, remote address
- Error logging: Full error details with context
- Startup logging: Server address and port
- Use standard library `log` package
**Rationale**:
- MVP simplicity (no structured logging framework)
- Sufficient for development and debugging
- No external dependencies
- Easy to upgrade to structured logging later
**Alternatives Considered**:
- No logging: Poor observability
- Structured logging (logrus, zap): Adds dependency for MVP
- Access log file: Over-engineered for MVP
**Risk**: Low - Sufficient for MVP, upgradeable later

---

### Design Overview

**Architecture:**

```
┌──────────────────────────────────────────────────────────┐
│                     Client (curl, browser, etc.)          │
└──────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Request
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│                    weather-api Server                     │
│  ┌────────────────────────────────────────────────────┐  │
│  │         HTTP Server (net/http)                     │  │
│  │         Port: 8080 (configurable via PORT env)     │  │
│  └────────────────────────────────────────────────────┘  │
│                              │                            │
│                              │                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │         Router (http.ServeMux)                     │  │
│  │  - /weather/city?name=...                          │  │
│  │  - /weather/coordinates?lat=...&lon=...            │  │
│  │  - /health                                          │  │
│  └────────────────────────────────────────────────────┘  │
│                              │                            │
│                              │                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │         Handlers (handlers/weather.go)             │  │
│  │  - handleWeatherCity()                             │  │
│  │  - handleWeatherCoordinates()                      │  │
│  │  - handleHealth()                                   │  │
│  │  - writeJSONError() (shared error handler)         │  │
│  └────────────────────────────────────────────────────┘  │
│                              │                            │
│                              │ Function Calls             │
│                              │                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │    Imported: weather-cli/weather package           │  │
│  │    (ZERO DUPLICATION - Sprint 2 Reuse)             │  │
│  │  - weather.GetWeatherForCity(cityName)             │  │
│  │  - weather.GetWeatherForCoordinates(lat, lon)      │  │
│  │  - weather.ForecastResponse (JSON marshaling)      │  │
│  │  - weather.Location (JSON marshaling)              │  │
│  └────────────────────────────────────────────────────┘  │
│                              │                            │
│                              │ HTTP Requests              │
└──────────────────────────────┼────────────────────────────┘
                               │
                               ▼
                  ┌──────────────────────────┐
                  │    Open-Meteo APIs       │
                  │  - Geocoding API         │
                  │  - Weather Forecast API  │
                  └──────────────────────────┘
```

**Key Components:**

1. **main.go** (HTTP Server Entry Point)
   - Purpose: Server initialization, routing setup, graceful shutdown
   - Responsibilities:
     - Read PORT environment variable (default 8080)
     - Create http.ServeMux and register routes
     - Configure HTTP server with timeouts
     - Handle SIGINT/SIGTERM for graceful shutdown
     - Log server startup and errors

2. **handlers/weather.go** (HTTP Handlers)
   - Purpose: HTTP request/response handling
   - Responsibilities:
     - Parse and validate request parameters
     - Call weather package functions
     - Marshal responses to JSON
     - Handle errors with appropriate HTTP status codes
     - Log requests and errors
   - Functions:
     - `handleWeatherCity(w http.ResponseWriter, r *http.Request)`
     - `handleWeatherCoordinates(w http.ResponseWriter, r *http.Request)`
     - `handleHealth(w http.ResponseWriter, r *http.Request)`
     - `writeJSONError(w http.ResponseWriter, message string, statusCode int)`

3. **weather-cli/weather package** (REUSED FROM SPRINT 2)
   - Purpose: Business logic and API integration
   - Location: `../weather-cli/weather/`
   - Components reused:
     - `types.go` - Data structures with JSON tags
     - `api.go` - Open-Meteo API client functions
     - `client.go` - High-level weather retrieval functions
   - Status: ✅ No modifications needed (100% reuse)

**Data Flow:**

1. Client sends HTTP GET request to `/weather/city?name=Portland`
2. Server routes request to `handleWeatherCity()`
3. Handler extracts `name` query parameter → `"Portland"`
4. Handler calls `weather.GetWeatherForCity("Portland")`
5. weather package:
   - Calls `GeocodeCity("Portland")` → gets coordinates
   - Calls `GetForecast(lat, lon)` → gets weather data
   - Returns `(ForecastResponse, Location, error)`
6. Handler marshals `ForecastResponse` to JSON
7. Handler writes JSON response with HTTP 200 OK
8. Client receives JSON weather data

**Error Data Flow:**

1. Client sends invalid request (e.g., missing parameter)
2. Handler detects validation error
3. Handler calls `writeJSONError(w, "missing name parameter", 400)`
4. Error response: `{"error": "missing name parameter", "status": 400}`
5. Client receives JSON error with HTTP 400 Bad Request

---

### Technical Specification

**APIs Used:**

**Imported from Sprint 2 (weather package):**

1. **weather.GetWeatherForCity(cityName string) (*ForecastResponse, *Location, error)**
   - Purpose: Get weather forecast for a city name
   - Source: `weather-cli/weather/client.go:9`
   - Internally calls:
     - `GeocodeCity()` → Open-Meteo Geocoding API
     - `GetForecast()` → Open-Meteo Forecast API
   - Returns: Forecast data, location information, error (if any)
   - Error cases: City not found, network errors, API failures

2. **weather.GetWeatherForCoordinates(lat, lon float64) (*ForecastResponse, error)**
   - Purpose: Get weather forecast for GPS coordinates
   - Source: `weather-cli/weather/client.go:25`
   - Internally calls:
     - `GetForecast()` → Open-Meteo Forecast API
   - Returns: Forecast data, error (if any)
   - Error cases: Invalid coordinates, network errors, API failures

**External APIs (accessed by weather package):**

3. **Open-Meteo Geocoding API** (via `weather.GeocodeCity()`)
   - Endpoint: `https://geocoding-api.open-meteo.com/v1/search`
   - Method: GET
   - Purpose: Convert city name to GPS coordinates
   - Documentation: See Sprint 1 prerequisites
   - Status: ✅ Tested in Sprint 1, used in Sprint 2

4. **Open-Meteo Forecast API** (via `weather.GetForecast()`)
   - Endpoint: `https://api.open-meteo.com/v1/forecast`
   - Method: GET
   - Purpose: Retrieve weather forecast for coordinates
   - Documentation: See Sprint 1 prerequisites
   - Status: ✅ Tested in Sprint 1, used in Sprint 2

---

**REST API Endpoints (NEW - This Sprint):**

### Endpoint 1: Weather by City Name

**URL**: `/weather/city`
**Method**: GET
**Query Parameters**:
- `name` (required): City name (string)

**Request Example**:
```
GET /weather/city?name=Portland
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

Missing parameter (HTTP 400):
```json
{
  "error": "missing required parameter: name",
  "status": 400
}
```

City not found (HTTP 404):
```json
{
  "error": "city not found: InvalidCityName",
  "status": 404
}
```

API failure (HTTP 503):
```json
{
  "error": "forecast API request failed: ...",
  "status": 503
}
```

### Endpoint 2: Weather by GPS Coordinates

**URL**: `/weather/coordinates`
**Method**: GET
**Query Parameters**:
- `lat` (required): Latitude (float, -90 to 90)
- `lon` (required): Longitude (float, -180 to 180)

**Request Example**:
```
GET /weather/coordinates?lat=45.5152&lon=-122.6784
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

Missing parameters (HTTP 400):
```json
{
  "error": "missing required parameters: lat, lon",
  "status": 400
}
```

Invalid coordinate format (HTTP 400):
```json
{
  "error": "invalid latitude format: notanumber",
  "status": 400
}
```

Coordinates out of range (HTTP 400):
```json
{
  "error": "latitude must be between -90 and 90, got 95.000",
  "status": 400
}
```

### Endpoint 3: Health Check

**URL**: `/health`
**Method**: GET
**Query Parameters**: None

**Request Example**:
```
GET /health
```

**Success Response** (HTTP 200 OK):
```json
{
  "status": "ok"
}
```

---

**Data Structures (REUSED FROM SPRINT 2):**

All data structures defined in `weather-cli/weather/types.go`:

```go
// ForecastResponse - Main response structure
type ForecastResponse struct {
    Latitude  float64        `json:"latitude"`
    Longitude float64        `json:"longitude"`
    Timezone  string         `json:"timezone"`
    Current   CurrentWeather `json:"current"`
    Daily     DailyForecast  `json:"daily"`
}

// CurrentWeather - Current conditions
type CurrentWeather struct {
    Time          string  `json:"time"`
    Temperature2m float64 `json:"temperature_2m"`
    WeatherCode   int     `json:"weather_code"`
}

// DailyForecast - 3-day forecast arrays
type DailyForecast struct {
    Time             []string  `json:"time"`
    Temperature2mMax []float64 `json:"temperature_2m_max"`
    Temperature2mMin []float64 `json:"temperature_2m_min"`
    WeatherCode      []int     `json:"weather_code"`
}

// Location - Geographic location info
type Location struct {
    Name      string  `json:"name"`
    Latitude  float64 `json:"latitude"`
    Longitude float64 `json:"longitude"`
    Country   string  `json:"country"`
    Admin1    string  `json:"admin1"`
}
```

**NEW Error Response Structure:**

```go
// ErrorResponse - JSON error response
type ErrorResponse struct {
    Error  string `json:"error"`
    Status int    `json:"status"`
}
```

---

**Scripts/Tools:**

**File: weather-api/main.go**
- Purpose: HTTP server entry point
- Interface: `./weather-api [PORT env var optional]`
- Dependencies: weather-cli/weather package, standard library
- Responsibilities:
  - Configure and start HTTP server
  - Setup routing with http.ServeMux
  - Handle graceful shutdown
  - Log server events

**File: weather-api/handlers/weather.go**
- Purpose: HTTP request handlers
- Interface: http.HandlerFunc signature
- Dependencies: weather-cli/weather package, encoding/json
- Functions:
  - handleWeatherCity - Parse city name, call weather.GetWeatherForCity(), return JSON
  - handleWeatherCoordinates - Parse lat/lon, call weather.GetWeatherForCoordinates(), return JSON
  - handleHealth - Return {status: "ok"}
  - writeJSONError - Format and write JSON error responses

**File: weather-api/go.mod**
- Purpose: Go module definition with local package import
- Contents:
  ```
  module github.com/rstyczynski/RUPStrikesBack/weather-api

  go 1.21

  replace github.com/rstyczynski/RUPStrikesBack/weather-cli => ../weather-cli

  require github.com/rstyczynski/RUPStrikesBack/weather-cli v0.0.0
  ```

---

**Error Handling:**

**Client Error Scenarios (HTTP 4xx):**

1. **Missing Required Parameter**:
   - Scenario: Request to `/weather/city` without `name` parameter
   - HTTP Status: 400 Bad Request
   - Response: `{"error": "missing required parameter: name", "status": 400}`

2. **Invalid Parameter Format**:
   - Scenario: `/weather/coordinates?lat=notanumber&lon=123`
   - HTTP Status: 400 Bad Request
   - Response: `{"error": "invalid latitude format: notanumber", "status": 400}`

3. **Coordinates Out of Range**:
   - Scenario: `/weather/coordinates?lat=95&lon=200`
   - HTTP Status: 400 Bad Request
   - Response: `{"error": "latitude must be between -90 and 90, got 95.000", "status": 400}`

4. **City Not Found**:
   - Scenario: Geocoding API returns no results for city name
   - HTTP Status: 404 Not Found
   - Response: `{"error": "city not found: InvalidCityName", "status": 404}`

**Server Error Scenarios (HTTP 5xx):**

5. **Forecast API Failure**:
   - Scenario: Open-Meteo API returns non-200 status or network error
   - HTTP Status: 503 Service Unavailable
   - Response: `{"error": "forecast API request failed: [details]", "status": 503}`

6. **Unexpected Internal Error**:
   - Scenario: JSON marshaling fails, unexpected panic recovery
   - HTTP Status: 500 Internal Server Error
   - Response: `{"error": "internal server error", "status": 500}`

**Error Handling Implementation:**

```go
func writeJSONError(w http.ResponseWriter, message string, statusCode int) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(statusCode)
    json.NewEncoder(w).Encode(ErrorResponse{
        Error:  message,
        Status: statusCode,
    })
    log.Printf("Error response: %d - %s", statusCode, message)
}
```

**Error Classification:**

- weather.GeocodeCity errors → Check for "city not found" → 404
- Coordinate validation errors → 400
- Parameter parsing errors → 400
- Open-Meteo API network errors → 503
- Unexpected errors → 500

---

### Implementation Approach

**Step 1: Project Setup**

```bash
# Create project directory
mkdir weather-api
cd weather-api

# Initialize Go module
go mod init github.com/rstyczynski/RUPStrikesBack/weather-api

# Add replace directive for local package import
go mod edit -replace github.com/rstyczynski/RUPStrikesBack/weather-cli=../weather-cli

# Add require directive
go mod edit -require github.com/rstyczynski/RUPStrikesBack/weather-cli@v0.0.0

# Create handlers directory
mkdir handlers
```

**Step 2: Create Error Response Type**

File: `handlers/weather.go`

```go
package handlers

type ErrorResponse struct {
    Error  string `json:"error"`
    Status int    `json:"status"`
}
```

**Step 3: Implement Error Handler**

File: `handlers/weather.go`

```go
func writeJSONError(w http.ResponseWriter, message string, statusCode int) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(statusCode)
    json.NewEncoder(w).Encode(ErrorResponse{
        Error:  message,
        Status: statusCode,
    })
    log.Printf("Error: %d - %s", statusCode, message)
}
```

**Step 4: Implement Health Check Handler**

File: `handlers/weather.go`

```go
func HandleHealth(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
```

**Step 5: Implement City Weather Handler**

File: `handlers/weather.go`

```go
func HandleWeatherCity(w http.ResponseWriter, r *http.Request) {
    // Parse city name parameter
    cityName := r.URL.Query().Get("name")
    if cityName == "" {
        writeJSONError(w, "missing required parameter: name", http.StatusBadRequest)
        return
    }

    // Call weather package
    forecast, location, err := weather.GetWeatherForCity(cityName)
    if err != nil {
        // Classify error type
        if strings.Contains(err.Error(), "city not found") {
            writeJSONError(w, err.Error(), http.StatusNotFound)
        } else if strings.Contains(err.Error(), "API request failed") {
            writeJSONError(w, err.Error(), http.StatusServiceUnavailable)
        } else {
            writeJSONError(w, err.Error(), http.StatusInternalServerError)
        }
        return
    }

    // Write JSON response
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(forecast)
    log.Printf("Weather retrieved for city: %s (%s)", location.Name, location.Country)
}
```

**Step 6: Implement Coordinates Weather Handler**

File: `handlers/weather.go`

```go
func HandleWeatherCoordinates(w http.ResponseWriter, r *http.Request) {
    // Parse latitude parameter
    latStr := r.URL.Query().Get("lat")
    if latStr == "" {
        writeJSONError(w, "missing required parameter: lat", http.StatusBadRequest)
        return
    }

    lat, err := strconv.ParseFloat(latStr, 64)
    if err != nil {
        writeJSONError(w, fmt.Sprintf("invalid latitude format: %s", latStr), http.StatusBadRequest)
        return
    }

    // Parse longitude parameter
    lonStr := r.URL.Query().Get("lon")
    if lonStr == "" {
        writeJSONError(w, "missing required parameter: lon", http.StatusBadRequest)
        return
    }

    lon, err := strconv.ParseFloat(lonStr, 64)
    if err != nil {
        writeJSONError(w, fmt.Sprintf("invalid longitude format: %s", lonStr), http.StatusBadRequest)
        return
    }

    // Call weather package (validates coordinates internally)
    forecast, err := weather.GetWeatherForCoordinates(lat, lon)
    if err != nil {
        if strings.Contains(err.Error(), "must be between") {
            writeJSONError(w, err.Error(), http.StatusBadRequest)
        } else if strings.Contains(err.Error(), "API request failed") {
            writeJSONError(w, err.Error(), http.StatusServiceUnavailable)
        } else {
            writeJSONError(w, err.Error(), http.StatusInternalServerError)
        }
        return
    }

    // Write JSON response
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(forecast)
    log.Printf("Weather retrieved for coordinates: %.4f, %.4f", lat, lon)
}
```

**Step 7: Create HTTP Server**

File: `main.go`

```go
package main

import (
    "context"
    "log"
    "net/http"
    "os"
    "os/signal"
    "time"

    "github.com/rstyczynski/RUPStrikesBack/weather-api/handlers"
)

func main() {
    // Read port from environment variable (default 8080)
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    // Setup routing
    mux := http.NewServeMux()
    mux.HandleFunc("/weather/city", handlers.HandleWeatherCity)
    mux.HandleFunc("/weather/coordinates", handlers.HandleWeatherCoordinates)
    mux.HandleFunc("/health", handlers.HandleHealth)

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
        log.Printf("Weather API server starting on port %s", port)
        if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("Server failed to start: %v", err)
        }
    }()

    // Graceful shutdown on SIGINT/SIGTERM
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

**Step 8: Build and Test**

```bash
# Build
go build -o weather-api

# Test (separate terminal)
./weather-api

# Verify server started
# Expected log: "Weather API server starting on port 8080"
```

---

### Testing Strategy

**Functional Tests:**

All tests will be copy-paste-able curl commands documented in `progress/sprint_3/sprint_3_tests.md`.

**Test Categories:**

1. **Happy Path Tests**:
   - Test 1: Weather by valid city name (Portland)
   - Test 2: Weather by valid GPS coordinates (Portland coords)
   - Test 3: Health check endpoint

2. **Parameter Validation Tests**:
   - Test 4: Missing city name parameter
   - Test 5: Missing latitude parameter
   - Test 6: Missing longitude parameter
   - Test 7: Invalid latitude format (not a number)
   - Test 8: Invalid longitude format (not a number)

3. **Business Logic Error Tests**:
   - Test 9: City not found (invalid city name)
   - Test 10: Latitude out of range (> 90)
   - Test 11: Longitude out of range (< -180)

4. **Integration Tests**:
   - Test 12: Multiple sequential requests (no resource leaks)
   - Test 13: JSON response structure validation
   - Test 14: HTTP headers validation (Content-Type: application/json)

**Edge Cases:**

1. **City Name Edge Cases**:
   - Test: City with special characters ("São Paulo")
   - Test: City with spaces ("San Francisco")
   - Test: City with ambiguous name (multiple results - use first)

2. **Coordinates Edge Cases**:
   - Test: Boundary values (lat=90, lat=-90, lon=180, lon=-180)
   - Test: High precision coordinates (lat=45.515187, lon=-122.678376)
   - Test: Ocean coordinates (no land, but valid API call)

3. **Concurrent Requests**:
   - Test: 10 parallel requests (verify all succeed)

**Success Criteria:**

- ✅ All happy path tests return HTTP 200 with valid JSON
- ✅ All error tests return correct HTTP status codes (400, 404, 503)
- ✅ All error responses have consistent JSON structure
- ✅ JSON response matches ForecastResponse structure
- ✅ Server handles graceful shutdown (Ctrl+C)
- ✅ No resource leaks (can run indefinitely)
- ✅ Logs show request activity

---

### Integration Notes

**Dependencies:**

**On Sprint 2 (weather-cli):**
- ✅ Requires `weather/` package from `../weather-cli/`
- ✅ Imports: weather.GetWeatherForCity, weather.GetWeatherForCoordinates
- ✅ Uses: ForecastResponse, Location, CurrentWeather, DailyForecast
- ✅ Status: All components available and tested

**On Sprint 1 (Prerequisites):**
- ✅ Go development environment
- ✅ Open-Meteo API endpoints (accessed via weather package)

**Compatibility:**

**With Sprint 2 (CLI):**
- ✅ Same business logic (zero duplication)
- ✅ Same data structures (JSON tags enable API responses)
- ✅ Same error messages (consistent UX)
- ✅ Same validation rules (lat/lon ranges, etc.)
- ✅ Independent executables (CLI and API are separate binaries)

**With Sprint 4 (WebUI - Future):**
- ✅ REST API provides JSON endpoints for WebUI consumption
- ✅ No CORS restrictions (all origins allowed for MVP)
- ✅ WebUI will make HTTP GET requests to this API
- ✅ Decoupled architecture (WebUI doesn't call Open-Meteo directly)

**Reusability:**

**From Sprint 2 (Reused):**
- `weather/types.go` - 100% reused (no changes)
- `weather/api.go` - 100% reused (no changes)
- `weather/client.go` - 100% reused (no changes)

**For Sprint 4 (Will be consumed):**
- All REST endpoints will be called by WebUI
- JSON responses ready for JavaScript consumption
- Health check enables WebUI to verify API availability

---

### Documentation Requirements

**User Documentation** (to be created in sprint_3_implementation.md):

1. **API Overview**:
   - Purpose of the REST API
   - Base URL (http://localhost:8080)
   - Response format (JSON)

2. **Endpoint Documentation**:
   - URL, method, parameters for each endpoint
   - Request examples (curl commands)
   - Success response examples with descriptions
   - Error response examples with status codes

3. **Getting Started**:
   - Prerequisites (Sprint 1 Go installation, Sprint 2 weather-cli)
   - Building the API (`go build`)
   - Running the API (`./weather-api`)
   - Environment variables (PORT)

4. **Usage Examples**:
   - Copy-paste-able curl commands
   - Expected responses
   - Error scenarios

5. **Configuration**:
   - Port configuration via environment variable
   - Default values
   - Server timeouts

**Technical Documentation** (to be created in sprint_3_implementation.md):

1. **Architecture**:
   - Component diagram
   - Data flow description
   - Error handling patterns

2. **Code Structure**:
   - Directory layout
   - File purposes
   - Package dependencies

3. **Module Configuration**:
   - go.mod setup with replace directive
   - Local package import strategy
   - Build process

4. **Testing**:
   - Test categories
   - Test execution instructions
   - Expected results

5. **Deployment Notes**:
   - Building for production
   - Environment variables
   - Graceful shutdown behavior

---

### Design Decisions

**Decision 1: Standard Library vs Framework**
**Rationale**: MVP simplicity requirement, only 3 endpoints, no complex routing needs
**Alternatives Considered**: Gin (high-performance framework), gorilla/mux (full-featured router)
**Chosen**: Standard library http.ServeMux

**Decision 2: Direct Structure Reuse**
**Rationale**: Zero code duplication agreement, structures already have JSON tags, matches API format
**Alternatives Considered**: Custom response wrapper, transformed/flattened structure
**Chosen**: Direct serialization of ForecastResponse from Sprint 2

**Decision 3: Query Parameters for Input**
**Rationale**: RESTful convention for filtering/input, matches CLI argument patterns
**Alternatives Considered**: Path parameters (requires advanced router), POST body (not RESTful for reads)
**Chosen**: Query parameters (?name=..., ?lat=...&lon=...)

**Decision 4: HTTP Status Code Mapping**
**Rationale**: Standard HTTP semantics, clear 4xx vs 5xx distinction
**Alternatives Considered**: Always 200 with error in body (poor REST practice)
**Chosen**: 200 success, 400 client errors, 404 not found, 503 service unavailable, 500 internal errors

**Decision 5: Environment Variable Configuration**
**Rationale**: Deployment flexibility, follows 12-factor app principles
**Alternatives Considered**: Command-line flags, configuration file
**Chosen**: PORT environment variable (default 8080)

**Decision 6: Graceful Shutdown**
**Rationale**: Production best practice, clean termination of in-flight requests
**Alternatives Considered**: Immediate termination (abrupt)
**Chosen**: 10-second graceful shutdown timeout on SIGINT/SIGTERM

### Open Design Questions

**None** - All design decisions made autonomously in YOLO mode. Assumptions documented above are reasonable for MVP and can be validated during 60-second approval timeout or in Construction phase if issues arise.

---

# Design Summary

## Overall Architecture

**Three-Tier Service Architecture:**

1. **Client Layer**: HTTP clients (curl, browsers, WebUI in Sprint 4)
2. **REST API Layer** (NEW - This Sprint): HTTP server, routing, handlers, JSON responses
3. **Business Logic Layer** (REUSED - Sprint 2): Weather data retrieval, API integration

**Key Architectural Principle**: Separation of concerns with zero duplication. REST API layer handles HTTP concerns only, delegates all business logic to proven Sprint 2 implementation.

## Shared Components

**Between Sprint 2 CLI and Sprint 3 REST API:**
- `weather/types.go` - Data structures (40 lines)
- `weather/api.go` - API client functions (90 lines)
- `weather/client.go` - Business logic (35 lines)
- **Total shared code: ~165 lines (80% of core logic)**

**Benefits of Code Sharing:**
- Zero duplication maintained
- Consistent behavior across CLI and REST API
- Bug fixes in one place benefit both interfaces
- Reduced testing burden (business logic already tested)

## Design Risks

**Medium Risks:**
1. **Go Module Import Configuration** (Medium):
   - Risk: Replace directive might cause issues in different environments
   - Mitigation: Document clearly, test build process, consider Go workspace for complex scenarios
   - Impact: Build-time only, doesn't affect runtime

**Low Risks:**
2. **No CORS/Auth for MVP** (Low for demo, Medium for production):
   - Risk: Open access to API
   - Mitigation: Acceptable for demo/local development, document need for future enhancement
   - Impact: Security concern for public deployment

3. **Standard Library Routing** (Low):
   - Risk: May need upgrade if routing becomes complex
   - Mitigation: Sufficient for MVP, can add router library later without major refactoring
   - Impact: Development velocity only

## Resource Requirements

**Tools:**
- ✅ Go 1.21+ (from Sprint 1)
- ✅ git (for version control)
- ✅ curl (for testing)

**Libraries:**
- ✅ Go standard library only (net/http, encoding/json, log, os, os/signal, context, strconv)
- ✅ weather-cli/weather package (local import via replace directive)

**External Services:**
- ✅ Open-Meteo Geocoding API (via weather package)
- ✅ Open-Meteo Forecast API (via weather package)

**No New Dependencies Required**

## Design Approval Status

**Status**: Proposed (awaiting auto-approval in YOLO mode)

**YOLO Mode**: Design will be auto-approved after creation per YOLO mode rules. No 60-second wait required.

**Next Phase**: Construction (Implementation)
