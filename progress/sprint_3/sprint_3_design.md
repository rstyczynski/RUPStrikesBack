# Sprint 3 - Design

## RSB-4. Weather forecast exposes REST API

Status: Proposed

### Requirement Summary

Build a RESTful HTTP service in Go that exposes weather forecast data through standard HTTP methods. The API enables programmatic access to weather information in JSON format, allowing multiple client types to consume the service. This creates a service-oriented architecture that separates data logic from presentation layers. The product is kept in `./weather-api/` directory following the `./weather-cli/` approach established in Sprint 2.

### Feasibility Analysis

**API Availability:**

All required APIs confirmed available and tested:

1. **Open-Meteo Geocoding API** - `https://geocoding-api.open-meteo.com/v1/search`
   - Proven functional in Sprint 1 & 2 ✅
   - Converts city names to GPS coordinates
   - No API key required
   - Documentation: https://open-meteo.com/en/docs/geocoding-api

2. **Open-Meteo Forecast API** - `https://api.open-meteo.com/v1/forecast`
   - Proven functional in Sprint 1 & 2 ✅
   - Provides weather forecast data
   - No API key required
   - Documentation: https://open-meteo.com/en/docs

3. **Sprint 2 Reusable Package** - `weather-cli/weather`
   - Implemented and tested in Sprint 2 ✅
   - Contains all API client functions
   - Data structures with JSON tags ready
   - Zero code duplication architecture

**Go Standard Library Availability:**

All required functionality available:
- ✅ `net/http` - HTTP server and routing
- ✅ `encoding/json` - JSON encoding/decoding
- ✅ `os` - Environment variable access
- ✅ `log` - Logging
- ✅ `context` - Graceful shutdown
- ✅ `time` - Timeouts and durations
- ✅ `strconv` - String conversions

**Technical Constraints:**

- macOS platform (per Sprint 1 scope)
- Go language (established)
- Internet connectivity required (API-dependent)
- Port must not conflict with other services
- Sprint 2 `weather/` package must be importable

**Risk Assessment:**

- **HTTP Server Setup:** LOW - Standard Go patterns
- **Sprint 2 Package Import:** LOW - Go module system handles this
- **JSON Marshaling:** LOW - Structs already have JSON tags
- **Concurrent Requests:** LOW - Go HTTP server handles automatically
- **Port Conflicts:** LOW - Configurable via environment variable
- **Error Handling:** MEDIUM - Need HTTP-appropriate error responses

**Feasibility Conclusion:** HIGH - All components proven, straightforward HTTP server implementation

### Design Overview

**Architecture:**

```
                    HTTP Request
                         |
                    [Port 8080]
                         |
              ┌──────────┴──────────┐
              |   HTTP Server       |
              |   (net/http)        |
              └──────────┬──────────┘
                         |
              ┌──────────┴──────────────────┐
              |         Router              |
              |  (http.ServeMux)            |
              └────┬──────────┬─────────────┘
                   |          |
        ┌──────────┘          └─────────────┐
        |                                    |
[/weather/city]                  [/weather/coordinates]
        |                                    |
  HandleCityWeather                HandleCoordinatesWeather
        |                                    |
        └──────────┬──────────┬─────────────┘
                   ↓          ↓
           Import weather-cli/weather
                   ↓          ↓
        GetWeatherForCity()  GetWeatherForCoordinates()
                   ↓          ↓
           [Sprint 2 Reusable Package]
                   ↓          ↓
              Open-Meteo APIs
                   ↓
            JSON Response
```

**Key Components:**

1. **HTTP Server** (`main.go`)
   - Initialize HTTP server with configurable port
   - Register route handlers
   - Implement graceful shutdown
   - Environment-based configuration
   - Request logging

2. **Route Handlers** (`main.go` - inline or separate `handlers/` package)
   - `HandleCityWeather` - Process city name queries
   - `HandleCoordinatesWeather` - Process GPS coordinate queries
   - `HandleHealth` - Service health check endpoint
   - Error response formatting
   - JSON response encoding

3. **Imported Sprint 2 Package** (`import "weather-cli/weather"`)
   - `weather.GetWeatherForCity(cityName string)` - City to forecast
   - `weather.GetWeatherForCoordinates(lat, lon float64)` - Coordinates to forecast
   - `weather.ForecastResponse` - Response structure with JSON tags
   - `weather.Location` - Location structure with JSON tags
   - ALL API logic reused - ZERO duplication

4. **Configuration** (Environment Variables)
   - `PORT` - Server port (default: 8080)
   - Future: `LOG_LEVEL`, `TIMEOUT`, etc.

**Data Flow:**

1. Client sends HTTP GET request to `/weather/city?name=Tokyo` or `/weather/coordinates?lat=35.6&lon=139.7`
2. Server routes request to appropriate handler
3. Handler extracts query parameters
4. Handler calls Sprint 2 reusable function
5. Sprint 2 package calls Open-Meteo APIs (same as CLI)
6. Response parsed and returned by Sprint 2 package
7. Handler encodes response as JSON
8. Server returns JSON with appropriate HTTP status

### Technical Specification

**Project Structure:**

```
weather-api/
├── main.go              # HTTP server + handlers
├── go.mod               # Module definition with weather-cli dependency
├── go.sum               # Dependency checksums
└── README.md            # API documentation
```

**Minimal Structure** - Everything in `main.go` for MVP simplicity. Future: separate `handlers/` package if complexity grows.

**Go Module Setup:**

```go
// go.mod
module weather-api

go 1.21

require (
    weather-cli v0.0.0  // Local path: ../weather-cli
)
```

**Note:** Use `replace` directive to point to local Sprint 2 package during development.

**APIs Used:**

#### Endpoint 1: Get Weather by City Name

**Path:** `/weather/city`
**Method:** GET
**Query Parameters:**
- `name` (string, required) - City name

**Example Request:**
```bash
curl "http://localhost:8080/weather/city?name=San%20Francisco"
```

**Success Response (HTTP 200):**
```json
{
  "location": {
    "name": "San Francisco",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "country": "United States",
    "admin1": "California"
  },
  "forecast": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "timezone": "America/Los_Angeles",
    "current": {
      "time": "2025-12-07T10:00",
      "temperature_2m": 15.3,
      "weather_code": 3
    },
    "daily": {
      "time": ["2025-12-07", "2025-12-08", "2025-12-09"],
      "temperature_2m_max": [17.4, 15.2, 17.5],
      "temperature_2m_min": [12.7, 10.5, 9.9],
      "weather_code": [61, 61, 3]
    }
  }
}
```

**Error Response (HTTP 404):**
```json
{
  "error": "city not found",
  "message": "No results found for city: InvalidCity123"
}
```

**Error Response (HTTP 400):**
```json
{
  "error": "bad request",
  "message": "Missing required parameter: name"
}
```

#### Endpoint 2: Get Weather by GPS Coordinates

**Path:** `/weather/coordinates`
**Method:** GET
**Query Parameters:**
- `lat` (float64, required) - Latitude (-90 to 90)
- `lon` (float64, required) - Longitude (-180 to 180)

**Example Request:**
```bash
curl "http://localhost:8080/weather/coordinates?lat=37.7749&lon=-122.4194"
```

**Success Response (HTTP 200):**
```json
{
  "forecast": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "timezone": "America/Los_Angeles",
    "current": {
      "time": "2025-12-07T10:00",
      "temperature_2m": 15.3,
      "weather_code": 3
    },
    "daily": {
      "time": ["2025-12-07", "2025-12-08", "2025-12-09"],
      "temperature_2m_max": [17.4, 15.2, 17.5],
      "temperature_2m_min": [12.7, 10.5, 9.9],
      "weather_code": [61, 61, 3]
    }
  }
}
```

**Error Response (HTTP 400):**
```json
{
  "error": "bad request",
  "message": "Invalid latitude: must be between -90 and 90"
}
```

#### Endpoint 3: Health Check

**Path:** `/health`
**Method:** GET
**Query Parameters:** None

**Success Response (HTTP 200):**
```json
{
  "status": "healthy",
  "service": "weather-api",
  "version": "1.0.0"
}
```

**Data Structures:**

All data structures imported from Sprint 2 (zero duplication):

```go
// Imported from weather-cli/weather package
import "weather-cli/weather"

// Used directly:
// - weather.Location
// - weather.ForecastResponse
// - weather.CurrentWeather
// - weather.DailyForecast

// Custom for API responses:
type CityWeatherResponse struct {
    Location *weather.Location       `json:"location"`
    Forecast *weather.ForecastResponse `json:"forecast"`
}

type CoordinatesWeatherResponse struct {
    Forecast *weather.ForecastResponse `json:"forecast"`
}

type ErrorResponse struct {
    Error   string `json:"error"`
    Message string `json:"message"`
}

type HealthResponse struct {
    Status  string `json:"status"`
    Service string `json:"service"`
    Version string `json:"version"`
}
```

**HTTP Handler Pseudocode:**

```go
func HandleCityWeather(w http.ResponseWriter, r *http.Request) {
    // 1. Extract query parameter
    cityName := r.URL.Query().Get("name")
    if cityName == "" {
        respondError(w, "bad request", "Missing required parameter: name", http.StatusBadRequest)
        return
    }

    // 2. Call Sprint 2 reusable function (ZERO DUPLICATION)
    forecast, location, err := weather.GetWeatherForCity(cityName)
    if err != nil {
        // Determine appropriate HTTP status based on error
        status := http.StatusInternalServerError
        if strings.Contains(err.Error(), "not found") {
            status = http.StatusNotFound
        }
        respondError(w, "city not found", err.Error(), status)
        return
    }

    // 3. Encode as JSON and return
    respondJSON(w, CityWeatherResponse{
        Location: location,
        Forecast: forecast,
    }, http.StatusOK)
}

func HandleCoordinatesWeather(w http.ResponseWriter, r *http.Request) {
    // 1. Extract and parse query parameters
    latStr := r.URL.Query().Get("lat")
    lonStr := r.URL.Query().Get("lon")

    if latStr == "" || lonStr == "" {
        respondError(w, "bad request", "Missing required parameters: lat and lon", http.StatusBadRequest)
        return
    }

    lat, err := strconv.ParseFloat(latStr, 64)
    if err != nil {
        respondError(w, "bad request", "Invalid latitude format", http.StatusBadRequest)
        return
    }

    lon, err := strconv.ParseFloat(lonStr, 64)
    if err != nil {
        respondError(w, "bad request", "Invalid longitude format", http.StatusBadRequest)
        return
    }

    // 2. Validate ranges (or let Sprint 2 package handle this)
    if lat < -90 || lat > 90 {
        respondError(w, "bad request", "Latitude must be between -90 and 90", http.StatusBadRequest)
        return
    }

    if lon < -180 || lon > 180 {
        respondError(w, "bad request", "Longitude must be between -180 and 180", http.StatusBadRequest)
        return
    }

    // 3. Call Sprint 2 reusable function (ZERO DUPLICATION)
    forecast, err := weather.GetWeatherForCoordinates(lat, lon)
    if err != nil {
        respondError(w, "api error", err.Error(), http.StatusInternalServerError)
        return
    }

    // 4. Encode as JSON and return
    respondJSON(w, CoordinatesWeatherResponse{
        Forecast: forecast,
    }, http.StatusOK)
}

func HandleHealth(w http.ResponseWriter, r *http.Request) {
    respondJSON(w, HealthResponse{
        Status:  "healthy",
        Service: "weather-api",
        Version: "1.0.0",
    }, http.StatusOK)
}
```

**Helper Functions:**

```go
func respondJSON(w http.ResponseWriter, data interface{}, statusCode int) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteStatus(statusCode)
    json.NewEncoder(w).Encode(data)
}

func respondError(w http.ResponseWriter, errorType, message string, statusCode int) {
    respondJSON(w, ErrorResponse{
        Error:   errorType,
        Message: message,
    }, statusCode)
}
```

**Error Handling:**

**HTTP Status Code Mapping:**

| Scenario | HTTP Status | Error Type |
|----------|-------------|------------|
| Missing parameters | 400 Bad Request | "bad request" |
| Invalid parameter format | 400 Bad Request | "bad request" |
| Out-of-range coordinates | 400 Bad Request | "bad request" |
| City not found | 404 Not Found | "city not found" |
| API network error | 500 Internal Server Error | "api error" |
| JSON encoding error | 500 Internal Server Error | "server error" |

**Error Response Format:**
```json
{
  "error": "error_type",
  "message": "Human-readable error description"
}
```

**Server Error Handling:**
- Log all errors to stdout/stderr
- Never expose internal error details to clients
- Return generic messages for unexpected errors

### Implementation Approach

**Step 1: Project Setup**

```bash
# Create weather-api directory (sibling to weather-cli)
mkdir weather-api
cd weather-api

# Initialize Go module
go mod init weather-api

# Add replace directive to point to local Sprint 2 package
echo 'replace weather-cli => ../weather-cli' >> go.mod

# Create main.go stub
touch main.go
```

**Step 2: Implement HTTP Server Skeleton**

```go
// main.go - initial structure
package main

import (
    "log"
    "net/http"
    "os"
)

func main() {
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    mux := http.NewServeMux()

    // Register routes (implement handlers next)
    mux.HandleFunc("/weather/city", HandleCityWeather)
    mux.HandleFunc("/weather/coordinates", HandleCoordinatesWeather)
    mux.HandleFunc("/health", HandleHealth)

    addr := ":" + port
    log.Printf("Starting weather API server on %s", addr)

    if err := http.ListenAndServe(addr, mux); err != nil {
        log.Fatalf("Server failed: %v", err)
    }
}
```

**Step 3: Implement Handler Functions**

```go
// Add Sprint 2 package import
import "weather-cli/weather"

// Implement HandleCityWeather (see pseudocode above)
// Implement HandleCoordinatesWeather (see pseudocode above)
// Implement HandleHealth (see pseudocode above)
// Implement respondJSON and respondError helpers
```

**Step 4: Test Sprint 2 Package Import**

```bash
# Verify import works
go mod tidy

# Should add weather-cli dependency
# Check go.mod for replace directive
```

**Step 5: Build and Test Server Startup**

```bash
# Build
go build -o weather-api

# Run server
./weather-api

# Verify server starts on port 8080
# Test health endpoint:
curl http://localhost:8080/health
```

**Step 6: Implement Error Handling**

- Add error response structures
- Implement error helpers
- Map errors to HTTP status codes
- Add logging

**Step 7: Test Endpoints**

- Test city endpoint with valid city
- Test coordinates endpoint with valid GPS
- Test all error scenarios
- Verify JSON responses

**Step 8: Add Graceful Shutdown** (Optional for MVP, recommended)

```go
// Use context and signal handling for graceful shutdown
// Allows in-flight requests to complete before stopping
```

### Testing Strategy

**Functional Tests:**

All tests documented in `sprint_3_tests.md` with copy-paste-able bash/curl commands.

**Test Cases:**

1. **TC-1: HTTP Server Startup**
   - Purpose: Verify server starts successfully
   - Expected: Server listens on configured port
   - Test: `curl http://localhost:8080/health`

2. **TC-2: Health Check Endpoint**
   - Purpose: Verify health endpoint works
   - Expected: HTTP 200 with JSON `{"status":"healthy"}`
   - Test: `curl http://localhost:8080/health`

3. **TC-3: City Weather - Valid City**
   - Purpose: Get weather for valid city name
   - Expected: HTTP 200 with location + forecast JSON
   - Test: `curl "http://localhost:8080/weather/city?name=Tokyo"`

4. **TC-4: City Weather - Invalid City**
   - Purpose: Handle non-existent city
   - Expected: HTTP 404 with error JSON
   - Test: `curl "http://localhost:8080/weather/city?name=InvalidCity12345"`

5. **TC-5: City Weather - Missing Parameter**
   - Purpose: Handle missing city name
   - Expected: HTTP 400 with error JSON
   - Test: `curl "http://localhost:8080/weather/city"`

6. **TC-6: Coordinates Weather - Valid Coordinates**
   - Purpose: Get weather for valid GPS coordinates
   - Expected: HTTP 200 with forecast JSON
   - Test: `curl "http://localhost:8080/weather/coordinates?lat=35.6762&lon=139.6503"`

7. **TC-7: Coordinates Weather - Invalid Latitude**
   - Purpose: Handle out-of-range latitude
   - Expected: HTTP 400 with error JSON
   - Test: `curl "http://localhost:8080/weather/coordinates?lat=999&lon=139.6503"`

8. **TC-8: Coordinates Weather - Missing Parameters**
   - Purpose: Handle missing lat/lon
   - Expected: HTTP 400 with error JSON
   - Test: `curl "http://localhost:8080/weather/coordinates?lat=35.6762"`

9. **TC-9: JSON Response Format**
   - Purpose: Verify proper JSON encoding
   - Expected: Valid JSON with correct structure
   - Test: All endpoints | `python -m json.tool`

10. **TC-10: Concurrent Requests**
    - Purpose: Verify server handles multiple clients
    - Expected: All requests succeed
    - Test: Parallel curl requests (5-10 simultaneous)

**Edge Cases:**

1. **City Name with Spaces:** `"San Francisco"` (URL encoded)
2. **Special Characters in City:** `"São Paulo"`
3. **Very Long City Name:** Test max length handling
4. **Decimal Precision:** Coordinates with many decimals
5. **Boundary Coordinates:** lat=90, lat=-90, lon=180, lon=-180

**Success Criteria:**

- ✅ Server starts without errors
- ✅ All health checks pass
- ✅ Valid city requests return HTTP 200 with correct JSON
- ✅ Invalid city requests return HTTP 404
- ✅ Missing parameters return HTTP 400
- ✅ Valid coordinates return HTTP 200
- ✅ Invalid coordinates return HTTP 400
- ✅ JSON responses are well-formed
- ✅ Concurrent requests handled correctly
- ✅ Error messages are informative
- ✅ Sprint 2 package imported successfully (zero duplication verified)

### Integration Notes

**Dependencies:**

1. **Sprint 1:** Go environment, Open-Meteo APIs ✅
2. **Sprint 2:** Reusable `weather/` package ✅

**Compatibility:**

**Sprint 2 Integration:**

```
Directory Structure:
  /project-root
    ├── weather-cli/         (Sprint 2)
    │   ├── weather/         ← IMPORTED by Sprint 3
    │   │   ├── types.go
    │   │   ├── api.go
    │   │   └── client.go
    │   └── ...
    └── weather-api/         (Sprint 3 - THIS)
        ├── main.go          ← Imports ../weather-cli/weather
        └── go.mod           ← Has replace directive
```

**Import Pattern:**

```go
// weather-api/main.go
import "weather-cli/weather"

// Use Sprint 2 functions directly:
forecast, location, err := weather.GetWeatherForCity(cityName)
forecast, err := weather.GetWeatherForCoordinates(lat, lon)
```

**Go Module Configuration:**

```go
// weather-api/go.mod
module weather-api

go 1.21

replace weather-cli => ../weather-cli

require weather-cli v0.0.0
```

**Reusability:**

| Sprint 2 Component | Sprint 3 Usage | Duplication |
|--------------------|----------------|-------------|
| weather/types.go | Imported types | ✅ ZERO |
| weather/api.go | Imported API calls | ✅ ZERO |
| weather/client.go | Imported business logic | ✅ ZERO |
| cli/format.go | NOT used (JSON instead) | ✅ ZERO |

**Result:** 80%+ code reuse from Sprint 2, zero API logic duplication

**Forward Compatibility:**

Sprint 4-5 (WebUI) will consume this REST API via HTTP requests.

### Documentation Requirements

**User Documentation (README.md):**

1. **Overview:** What the API does
2. **Prerequisites:** Go environment, Sprint 2 package
3. **Installation:** Build instructions
4. **Configuration:** PORT environment variable
5. **Running:** How to start the server
6. **Endpoints:** Complete API reference
   - /weather/city
   - /weather/coordinates
   - /health
7. **Examples:** curl commands with expected responses
8. **Error Codes:** HTTP status code reference
9. **Troubleshooting:** Common issues and solutions

**Technical Documentation:**

1. **Architecture:** Server design and Sprint 2 integration
2. **Code Structure:** File organization
3. **Handler Implementation:** How handlers work
4. **Error Handling:** Error mapping and responses
5. **Testing:** How to run tests
6. **Development:** Local development setup

### Design Decisions

**Decision 1: Endpoint Path Structure**

**Context:** Need to define URL paths for API endpoints

**Decision Made:** `/weather/city` and `/weather/coordinates` with query parameters

**Rationale:**
- RESTful pattern for resource access
- Query parameters standard for filters/search
- Clear semantic meaning
- Consistent with industry norms
- Extensible for future endpoints

**Alternatives Considered:**
- Path parameters: `/weather/city/:name` - Less flexible for multi-word cities
- Single endpoint with type parameter: `/weather?type=city&name=...` - Less RESTful
- Nested resources: `/weather/:type/:value` - Overly complex

**Risk:** Low - Standard pattern, easy to understand

---

**Decision 2: Port Configuration**

**Context:** Need to specify which port the server listens on

**Decision Made:** Default port 8080, configurable via `PORT` environment variable

**Rationale:**
- Port 8080 is standard development port
- Environment variable provides deployment flexibility
- Follows 12-factor app principles
- No hardcoded ports in source code

**Alternatives Considered:**
- Hardcoded port: Inflexible for deployment
- Command-line flag: More complex than env var
- Configuration file: Overkill for single setting

**Risk:** Low - Standard practice

---

**Decision 3: Error Response Format**

**Context:** Need consistent error response structure

**Decision Made:** JSON with `error` and `message` fields

**Rationale:**
- Consistent with JSON API responses
- Machine-readable error type
- Human-readable message
- HTTP status code provides additional context

**Alternatives Considered:**
- Plain text errors: Not consistent with JSON API
- Detailed error objects: Too complex for MVP
- Error codes instead of types: Less semantic

**Risk:** Low - Simple and clear

---

**Decision 4: Code Organization**

**Context:** Should handlers be in main.go or separate package?

**Decision Made:** All code in `main.go` for MVP

**Rationale:**
- Simplicity for MVP
- Fewer files to manage
- Easy to understand for small project
- Can refactor later if complexity grows

**Alternatives Considered:**
- Separate `handlers/` package: More structure but overhead for simple API
- Multiple files in main package: Unnecessary for ~300 lines of code

**Risk:** Low - Can refactor later if needed

---

**Decision 5: Sprint 2 Package Import Method**

**Context:** How to import Sprint 2's weather package

**Decision Made:** Use Go module replace directive to point to local path

**Rationale:**
- Standard Go approach for local dependencies
- No need to publish package to registry
- Easy to develop and test locally
- Maintains module independence

**Alternatives Considered:**
- Copy Sprint 2 code: Violates zero duplication principle
- Shared parent module: Overly complex for two components
- Git submodules: Unnecessary complexity

**Risk:** Low - Standard Go practice

---

**Decision 6: Logging Strategy**

**Context:** Need to log server activity and errors

**Decision Made:** Use Go standard library `log` package, output to stdout/stderr

**Rationale:**
- Standard library sufficient for MVP
- Stdout/stderr follow 12-factor app logging
- Easy to capture in production (Docker, systemd)
- No external dependencies

**Alternatives Considered:**
- Structured logging library: Overkill for MVP
- File-based logging: Less cloud-native
- No logging: Poor operational visibility

**Risk:** Low - Can enhance later

---

**Decision 7: Graceful Shutdown**

**Context:** Should server handle graceful shutdown?

**Decision Made:** Implement basic graceful shutdown (optional for MVP)

**Rationale:**
- Prevents abrupt termination of in-flight requests
- Standard practice for production services
- Simple to implement with Go's context package
- Better operational behavior

**Alternatives Considered:**
- No graceful shutdown: Simpler but less robust
- Complex shutdown logic: Unnecessary for simple API

**Risk:** Low - Standard pattern, minimal code

### YOLO Mode Decisions

This sprint was designed in YOLO (autonomous) mode. The following design decisions were made autonomously:

**YOLO Decision 1: Complete API Specification**

**Context:** Inception analysis left endpoint details as assumptions; design phase must finalize specifics

**Decision Made:**
- Finalized endpoint paths: `/weather/city`, `/weather/coordinates`, `/health`
- Defined query parameter names: `name`, `lat`, `lon`
- Specified JSON response structures with exact field names
- Documented all HTTP status codes

**Rationale:**
- Standard REST API patterns
- Consistent with Sprint 2 CLI dual-input approach
- Clear semantic meaning
- Industry best practices

**Alternatives Considered:**
- Different path structures (evaluated in Decision 1)
- Different parameter names - less clear semantics

**Risk:** LOW - Product Owner can request changes; implementation is flexible

---

**YOLO Decision 2: Code Organization in Single File**

**Context:** Project structure could be monolithic or modular

**Decision Made:** Implement everything in `main.go` (~300 lines total)

**Rationale:**
- MVP simplicity - entire API understandable in one file
- Sprint 2 followed similar single-file pattern for CLI
- Easy to refactor later if complexity grows
- Reduced file navigation during development

**Alternatives Considered:**
- Separate `handlers/` package - unnecessary for 3 handlers
- Multiple files in main package - adds complexity without benefit

**Risk:** LOW - Can refactor in future Sprint if API grows

---

**YOLO Decision 3: Error Response Detail Level**

**Context:** How much error detail should be exposed to clients

**Decision Made:** Simple error + message structure, no stack traces or internal details

**Rationale:**
- Security: Don't expose internal implementation
- Usability: Clear messages for common errors
- Simplicity: Easy to implement and document
- Extensibility: Can add error codes later if needed

**Alternatives Considered:**
- Detailed error objects - security risk, complexity
- Minimal errors - poor user experience

**Risk:** LOW - Balance of security and usability

---

**YOLO Decision 4: No Request Validation Middleware**

**Context:** Should validation be centralized or per-handler

**Decision Made:** Inline validation in each handler

**Rationale:**
- MVP simplicity - only 2 main handlers
- Each endpoint has different validation needs
- Middleware adds abstraction for minimal benefit
- Easy to test and understand

**Alternatives Considered:**
- Validation middleware - premature abstraction for 2 endpoints

**Risk:** LOW - Can add middleware later if validation patterns emerge

---

**YOLO Decision 5: Version in Health Endpoint**

**Context:** Should API version be exposed

**Decision Made:** Include version "1.0.0" in health check response

**Rationale:**
- Standard practice for APIs
- Useful for monitoring and debugging
- Minimal implementation cost
- Supports future versioning strategy

**Alternatives Considered:**
- No version - harder to track deployments
- Version in all responses - unnecessary overhead

**Risk:** LOW - Standard practice

### Open Design Questions

**None** - All design decisions made autonomously in YOLO mode.

YOLO mode assumptions cover all ambiguities. Product Owner can request changes to:
- Endpoint paths or parameter names
- Error response format
- Code organization approach
- Port configuration method

All are easily adjustable in construction phase.

---

# Design Summary

## Overall Architecture

Simple HTTP server with three endpoints importing Sprint 2's reusable weather package. Clear separation: HTTP layer in Sprint 3, weather logic in Sprint 2.

```
User → HTTP Request → weather-api (Sprint 3)
                           ↓
                      Import weather-cli/weather (Sprint 2)
                           ↓
                      Open-Meteo APIs (Sprint 1)
                           ↓
                      JSON Response
```

## Shared Components

1. **Sprint 2 Weather Package:** ALL business logic, API calls, data structures
2. **Go Standard Library:** HTTP server, JSON encoding
3. **Open-Meteo APIs:** Weather data source (from Sprint 1)

## Design Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Sprint 2 package import issues | Low | Use replace directive, test import first |
| Port conflicts | Low | Configurable via PORT env var |
| Concurrent request race conditions | Low | Go HTTP server handles concurrency |
| JSON encoding errors | Low | Use standard library, test responses |
| Error handling completeness | Medium | Map all error types to HTTP status codes |

## Resource Requirements

**Development:**
- Go 1.21+ (installed in Sprint 1)
- Sprint 2 `weather-cli/` directory available
- No external Go packages needed

**Runtime:**
- Internet connectivity (Open-Meteo APIs)
- Available port (default 8080)
- Sprint 2 package accessible

**External Services:**
- Open-Meteo Geocoding API (free, no key)
- Open-Meteo Forecast API (free, no key)

## Design Approval Status

**Status: Proposed**

Design complete and ready for Product Owner review.

**In YOLO Mode:** Auto-approve after creation (no 60-second wait). Proceed directly to Construction phase.

**Key Design Points:**
1. ✅ Zero code duplication (imports Sprint 2 package)
2. ✅ RESTful endpoint structure
3. ✅ JSON responses with proper HTTP status codes
4. ✅ Environment-based port configuration
5. ✅ Health check endpoint for monitoring
6. ✅ Simple single-file implementation
7. ✅ All error scenarios covered
8. ✅ Comprehensive testing strategy

**Ready for Construction Phase** ✅
