# Sprint 4 - Technical Design

**Date**: 2025-11-13
**Sprint**: 4 - REST API
**Mode**: YOLO (Autonomous)
**Status**: Accepted

---

## RSB-4: Weather Forecast Exposes REST API

**Status**: Accepted

---

### Requirement Summary

Create a RESTful API that exposes weather forecast functionality through HTTP endpoints. The API must:
- Accept weather requests via HTTP GET methods
- Support both city names and GPS coordinates as inputs
- Return current weather and 3-day forecast in JSON format
- Follow REST architectural principles
- Provide proper HTTP status codes for errors
- Enable multiple client types to consume the service
- Separate data logic from presentation (service-oriented architecture)

**Foundation**: Reuse Sprint 2 CLI packages (geocode, weather) - proven and tested

**Target**: Production-ready REST API suitable for browser clients, mobile apps, and other services

---

### Feasibility Analysis

**API Availability**: ✅ All Required

**Open-Meteo APIs** (from Sprint 2):
- **Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search`
  - Purpose: Convert city names to coordinates
  - Status: Integrated and tested in Sprint 2
  - Documentation: https://open-meteo.com/en/docs/geocoding-api

- **Forecast API**: `https://api.open-meteo.com/v1/forecast`
  - Purpose: Retrieve weather data by coordinates
  - Status: Integrated and tested in Sprint 2
  - Documentation: https://open-meteo.com/en/docs

**Go Standard Library**:
- `net/http`: HTTP server and client ✅
- `encoding/json`: JSON serialization/deserialization ✅
- `net/http/httptest`: HTTP testing ✅
- `log`: Request logging ✅

**Sprint 2 Packages** (ready for reuse):
- `weather-cli/geocode`: City → coordinates conversion ✅
- `weather-cli/weather`: Weather data fetching ✅
- Data structures with JSON tags ✅

**Technical Constraints**:
- Go 1.21+ required (available from Sprint 1)
- Internet connection required for API calls (same as CLI)
- No authentication/authorization in MVP (can be added later)
- No rate limiting in MVP (Open-Meteo provides 10,000 requests/day)

**Risk Assessment**:

**Low Risk**:
- ✅ HTTP server: Standard library `net/http` is robust and production-ready
- ✅ JSON serialization: Go's `encoding/json` is excellent
- ✅ Weather logic: Proven in Sprint 2 (100% test pass rate)
- ✅ API integration: Working and tested

**Medium Risk**:
- ⚠️ CORS configuration: Need to support browser clients (for Sprint 5 WebUI)
  - **Mitigation**: Include CORS middleware, document configuration
- ⚠️ Concurrent request handling: Go handles this well, but need proper testing
  - **Mitigation**: Use Go's built-in concurrency, test with concurrent requests

**Mitigation Strategies**:
- Start with MVP (core endpoints only)
- Use standard library (proven, no dependency risk)
- Comprehensive testing (unit + integration + API tests)
- Document production considerations (rate limiting, auth, caching - future work)

**Overall Feasibility**: ✅ **High** - All components available, clear technical path

---

### Design Overview

**Architecture**: Layered REST API

```
┌──────────────────────────────────────┐
│         HTTP Clients                  │
│  (curl, browsers, mobile apps, etc.)  │
└───────────────┬──────────────────────┘
                │ HTTP Requests (JSON)
                ▼
┌──────────────────────────────────────┐
│         REST API Server               │
│  ┌────────────────────────────────┐  │
│  │   HTTP Router (ServeMux)       │  │
│  └──────────┬─────────────────────┘  │
│             │                         │
│  ┌──────────▼─────────────────────┐  │
│  │   Middleware Stack             │  │
│  │  - Logging                     │  │
│  │  - CORS                        │  │
│  │  - Error Recovery              │  │
│  └──────────┬─────────────────────┘  │
│             │                         │
│  ┌──────────▼─────────────────────┐  │
│  │   API Handlers                 │  │
│  │  - weatherByCityHandler        │  │
│  │  - weatherByCoordinatesHandler │  │
│  │  - healthHandler               │  │
│  └──────────┬─────────────────────┘  │
│             │                         │
└─────────────┼─────────────────────────┘
              │
     ┌────────▼────────┐
     │  Sprint 2       │
     │  Packages       │
     │  ┌───────────┐  │
     │  │ geocode   │  │
     │  │ weather   │  │
     │  └───────────┘  │
     └────────┬────────┘
              │
     ┌────────▼────────┐
     │  Open-Meteo API │
     └─────────────────┘
```

**Key Components**:

1. **HTTP Server** (`main.go`)
   - Responsibilities: Server setup, routing configuration, middleware stack
   - Port: 8080 (configurable via environment variable)
   - Graceful shutdown support

2. **Router** (Standard library `http.ServeMux`)
   - Responsibilities: Route HTTP requests to appropriate handlers
   - Routes: /api/v1/weather/city/{city}, /api/v1/weather/coordinates, /api/v1/health

3. **Middleware**
   - **Logging Middleware**: Log all requests (method, path, status, duration)
   - **CORS Middleware**: Enable cross-origin requests for browser clients
   - **Recovery Middleware**: Catch panics, return 500 Internal Server Error

4. **API Handlers** (`handlers/` package)
   - **weatherByCityHandler**: Accept city name, call geocode + weather, return JSON
   - **weatherByCoordinatesHandler**: Accept lat/lon, call weather, return JSON
   - **healthHandler**: Return service status for monitoring

5. **Response Formatter** (`responses/` package)
   - **Success Responses**: Format WeatherData as JSON
   - **Error Responses**: Standardized error JSON structure
   - HTTP status code mapping

6. **Sprint 2 Package Integration**
   - Import and use existing `geocode` and `weather` packages
   - No modifications needed to existing packages
   - Direct function calls from handlers

**Data Flow**:

```
1. Client → HTTP GET /api/v1/weather/city/Berlin
2. Router → weatherByCityHandler
3. Handler → geocode.Geocode("Berlin")
4. Geocode Package → Open-Meteo Geocoding API
5. Geocode Package ← {lat: 52.52, lon: 13.41, ...}
6. Handler → weather.FetchWeather(52.52, 13.41)
7. Weather Package → Open-Meteo Forecast API
8. Weather Package ← WeatherData{current, forecast, ...}
9. Handler → JSON marshaling
10. Client ← JSON response with weather data
```

**Error Flow**:

```
1. Client → HTTP GET /api/v1/weather/city/InvalidCity123
2. Router → weatherByCityHandler
3. Handler → geocode.Geocode("InvalidCity123")
4. Geocode Package → Open-Meteo Geocoding API
5. Geocode Package ← error: "location not found"
6. Handler → Format error response
7. Client ← JSON error response (404 Not Found)
```

---

### Technical Specification

**API Endpoints**:

#### 1. GET /api/v1/weather/city/{city}

**Purpose**: Get weather forecast for a city by name

**Request**:
- Method: GET
- Path Parameter: `{city}` - City name (e.g., "Berlin", "New York")
- Headers: None required
- Body: None

**Example Requests**:
```bash
curl http://localhost:8080/api/v1/weather/city/Berlin
curl http://localhost:8080/api/v1/weather/city/New%20York
curl http://localhost:8080/api/v1/weather/city/Tokyo
```

**Success Response (200 OK)**:
```json
{
  "location": {
    "name": "Berlin",
    "country": "Germany",
    "latitude": 52.52,
    "longitude": 13.41
  },
  "current": {
    "temperature": 15.3,
    "condition": "Partly cloudy",
    "weather_code": 2,
    "wind_speed": 12.0,
    "wind_direction": 230,
    "time": "2025-11-13T14:00"
  },
  "forecast": [
    {
      "date": "2025-11-13",
      "max_temp": 17.2,
      "min_temp": 12.1,
      "condition": "Overcast",
      "weather_code": 3,
      "precipitation": 2.5
    },
    {
      "date": "2025-11-14",
      "max_temp": 16.8,
      "min_temp": 11.5,
      "condition": "Slight rain",
      "weather_code": 61,
      "precipitation": 5.2
    },
    {
      "date": "2025-11-15",
      "max_temp": 18.1,
      "min_temp": 13.3,
      "condition": "Partly cloudy",
      "weather_code": 2,
      "precipitation": 0.0
    }
  ]
}
```

**Error Responses**:

**404 Not Found** (City not found):
```json
{
  "error": {
    "code": "LOCATION_NOT_FOUND",
    "message": "Could not find location 'InvalidCity123'",
    "status": 404
  }
}
```

**500 Internal Server Error** (API failure):
```json
{
  "error": {
    "code": "WEATHER_API_ERROR",
    "message": "Failed to fetch weather data: API error",
    "status": 500
  }
}
```

---

#### 2. GET /api/v1/weather/coordinates

**Purpose**: Get weather forecast for GPS coordinates

**Request**:
- Method: GET
- Query Parameters:
  - `lat` (required): Latitude (-90 to 90)
  - `lon` (required): Longitude (-180 to 180)
- Headers: None required
- Body: None

**Example Requests**:
```bash
curl 'http://localhost:8080/api/v1/weather/coordinates?lat=52.52&lon=13.41'
curl 'http://localhost:8080/api/v1/weather/coordinates?lat=40.71&lon=-74.01'
curl 'http://localhost:8080/api/v1/weather/coordinates?lat=-33.87&lon=151.21'
```

**Success Response (200 OK)**:
```json
{
  "location": {
    "name": "",
    "country": "",
    "latitude": 52.52,
    "longitude": 13.41
  },
  "current": {
    "temperature": 15.3,
    "condition": "Partly cloudy",
    "weather_code": 2,
    "wind_speed": 12.0,
    "wind_direction": 230,
    "time": "2025-11-13T14:00"
  },
  "forecast": [
    // Same structure as city endpoint
  ]
}
```

**Error Responses**:

**400 Bad Request** (Missing parameters):
```json
{
  "error": {
    "code": "MISSING_PARAMETERS",
    "message": "Missing required parameters: lat and lon",
    "status": 400
  }
}
```

**400 Bad Request** (Invalid coordinates):
```json
{
  "error": {
    "code": "INVALID_COORDINATES",
    "message": "Invalid coordinates: latitude must be between -90 and 90, longitude between -180 and 180",
    "status": 400
  }
}
```

**500 Internal Server Error** (API failure):
```json
{
  "error": {
    "code": "WEATHER_API_ERROR",
    "message": "Failed to fetch weather data: API error",
    "status": 500
  }
}
```

---

#### 3. GET /api/v1/health

**Purpose**: Health check endpoint for monitoring

**Request**:
- Method: GET
- Parameters: None
- Headers: None
- Body: None

**Example Request**:
```bash
curl http://localhost:8080/api/v1/health
```

**Success Response (200 OK)**:
```json
{
  "status": "healthy",
  "service": "weather-api",
  "version": "1.0.0",
  "timestamp": "2025-11-13T14:00:00Z"
}
```

**Use Cases**:
- Container health checks (Docker, Kubernetes)
- Load balancer health monitoring
- Service discovery and registration
- Uptime monitoring

---

**Data Structures**:

**WeatherResponse** (JSON structure returned to clients):

```go
type LocationResponse struct {
    Name      string  `json:"name"`
    Country   string  `json:"country"`
    Latitude  float64 `json:"latitude"`
    Longitude float64 `json:"longitude"`
}

type CurrentWeatherResponse struct {
    Temperature   float64 `json:"temperature"`
    Condition     string  `json:"condition"`
    WeatherCode   int     `json:"weather_code"`
    WindSpeed     float64 `json:"wind_speed"`
    WindDirection int     `json:"wind_direction"`
    Time          string  `json:"time"`
}

type ForecastDayResponse struct {
    Date          string  `json:"date"`
    MaxTemp       float64 `json:"max_temp"`
    MinTemp       float64 `json:"min_temp"`
    Condition     string  `json:"condition"`
    WeatherCode   int     `json:"weather_code"`
    Precipitation float64 `json:"precipitation"`
}

type WeatherResponse struct {
    Location LocationResponse          `json:"location"`
    Current  CurrentWeatherResponse    `json:"current"`
    Forecast []ForecastDayResponse     `json:"forecast"`
}
```

**ErrorResponse** (Standardized error structure):

```go
type ErrorDetail struct {
    Code    string `json:"code"`
    Message string `json:"message"`
    Status  int    `json:"status"`
}

type ErrorResponse struct {
    Error ErrorDetail `json:"error"`
}
```

**HealthResponse** (Health check response):

```go
type HealthResponse struct {
    Status    string `json:"status"`
    Service   string `json:"service"`
    Version   string `json:"version"`
    Timestamp string `json:"timestamp"`
}
```

**Data Transformation**:

Sprint 2 structures → API response structures:

```go
// Transform Sprint 2 weather.WeatherData to API WeatherResponse
func transformWeatherData(loc *geocode.GeoLocation, data *weather.WeatherData) WeatherResponse {
    response := WeatherResponse{
        Location: LocationResponse{
            Name:      loc.Name,      // From geocode (empty for coordinates endpoint)
            Country:   loc.Country,   // From geocode (empty for coordinates endpoint)
            Latitude:  data.Latitude,
            Longitude: data.Longitude,
        },
        Current: CurrentWeatherResponse{
            Temperature:   data.CurrentWeather.Temperature,
            Condition:     display.GetWeatherDescription(data.CurrentWeather.WeatherCode),
            WeatherCode:   data.CurrentWeather.WeatherCode,
            WindSpeed:     data.CurrentWeather.WindSpeed,
            WindDirection: data.CurrentWeather.WindDirection,
            Time:          data.CurrentWeather.Time,
        },
        Forecast: make([]ForecastDayResponse, len(data.Daily.Time)),
    }

    for i := 0; i < len(data.Daily.Time) && i < 3; i++ {
        response.Forecast[i] = ForecastDayResponse{
            Date:          data.Daily.Time[i],
            MaxTemp:       data.Daily.TempMax[i],
            MinTemp:       data.Daily.TempMin[i],
            Condition:     display.GetWeatherDescription(data.Daily.WeatherCode[i]),
            WeatherCode:   data.Daily.WeatherCode[i],
            Precipitation: data.Daily.Precipitation[i],
        }
    }

    return response
}
```

---

**Error Handling**:

**Error Categories and HTTP Status Codes**:

1. **Client Errors (4xx)**:
   - **400 Bad Request**: Missing or invalid parameters
     - Missing lat/lon
     - Invalid coordinate ranges
     - Malformed requests
   - **404 Not Found**: Resource not found
     - City not found
     - Invalid endpoint
   - **405 Method Not Allowed**: Wrong HTTP method (e.g., POST to GET endpoint)

2. **Server Errors (5xx)**:
   - **500 Internal Server Error**: Unexpected server errors
     - API connection failures
     - JSON marshaling errors
     - Panics (caught by recovery middleware)
   - **502 Bad Gateway**: External API issues
     - Open-Meteo API unavailable
     - Geocoding API timeout

**Error Handling Strategy**:

```go
// Centralized error response helper
func writeErrorResponse(w http.ResponseWriter, code string, message string, status int) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)

    errorResp := ErrorResponse{
        Error: ErrorDetail{
            Code:    code,
            Message: message,
            Status:  status,
        },
    }

    json.NewEncoder(w).Encode(errorResp)
}

// Example handler with error handling
func weatherByCityHandler(w http.ResponseWriter, r *http.Request) {
    city := r.PathValue("city")

    if city == "" {
        writeErrorResponse(w, "MISSING_CITY", "City name is required", http.StatusBadRequest)
        return
    }

    location, err := geocode.Geocode(city)
    if err != nil {
        if strings.Contains(err.Error(), "not found") {
            writeErrorResponse(w, "LOCATION_NOT_FOUND",
                fmt.Sprintf("Could not find location '%s'", city),
                http.StatusNotFound)
        } else {
            writeErrorResponse(w, "GEOCODING_ERROR",
                "Failed to geocode location",
                http.StatusInternalServerError)
        }
        return
    }

    weatherData, err := weather.FetchWeather(location.Latitude, location.Longitude)
    if err != nil {
        writeErrorResponse(w, "WEATHER_API_ERROR",
            "Failed to fetch weather data",
            http.StatusInternalServerError)
        return
    }

    response := transformWeatherData(location, weatherData)

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(response)
}
```

**Logging Strategy**:

```go
// Request logging middleware
func loggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()

        // Create response writer wrapper to capture status code
        lrw := &loggingResponseWriter{
            ResponseWriter: w,
            statusCode:     http.StatusOK,
        }

        next.ServeHTTP(lrw, r)

        duration := time.Since(start)
        log.Printf("[%s] %s %s - %d (%v)",
            r.Method,
            r.URL.Path,
            r.RemoteAddr,
            lrw.statusCode,
            duration,
        )
    })
}
```

---

**CORS Configuration**:

```go
// CORS middleware for browser clients
func corsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Development configuration (allow all origins)
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

        // Handle preflight OPTIONS requests
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r)
    })
}
```

**Production CORS Configuration** (documented for future):
```go
// Production: Restrict origins to specific domains
allowedOrigins := []string{
    "https://weather.example.com",
    "https://app.example.com",
}

// Check origin and set header accordingly
```

---

**Server Configuration**:

```go
// main.go structure
func main() {
    // Configuration
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    // Router setup
    mux := http.NewServeMux()

    // Register routes
    mux.HandleFunc("GET /api/v1/weather/city/{city}", weatherByCityHandler)
    mux.HandleFunc("GET /api/v1/weather/coordinates", weatherByCoordinatesHandler)
    mux.HandleFunc("GET /api/v1/health", healthHandler)

    // Middleware stack
    handler := loggingMiddleware(
        corsMiddleware(
            recoveryMiddleware(mux),
        ),
    )

    // Server setup with timeouts
    server := &http.Server{
        Addr:         ":" + port,
        Handler:      handler,
        ReadTimeout:  10 * time.Second,
        WriteTimeout: 10 * time.Second,
        IdleTimeout:  120 * time.Second,
    }

    // Graceful shutdown
    go func() {
        log.Printf("Starting server on port %s", port)
        if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("Server failed: %v", err)
        }
    }()

    // Wait for interrupt signal
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
    <-quit

    log.Println("Shutting down server...")
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    if err := server.Shutdown(ctx); err != nil {
        log.Fatalf("Server forced to shutdown: %v", err)
    }

    log.Println("Server stopped")
}
```

---

### Implementation Approach

**Step 1: Project Setup** (30 minutes)
- Create `weather-api/` directory structure
- Initialize Go module: `go mod init github.com/rstyczynski/weather-api`
- Import Sprint 2 packages as dependencies
- Create basic main.go with HTTP server

**Directory Structure**:
```
weather-api/
├── main.go                 # Server entry point, routing
├── handlers/
│   ├── weather.go         # Weather endpoint handlers
│   └── health.go          # Health check handler
├── middleware/
│   ├── logging.go         # Request logging
│   ├── cors.go            # CORS headers
│   └── recovery.go        # Panic recovery
├── responses/
│   ├── types.go           # Response data structures
│   └── errors.go          # Error response helpers
├── go.mod                 # Module definition
├── go.sum                 # Dependency checksums
└── README.md              # API documentation
```

**Step 2: Response Structures** (30 minutes)
- Define WeatherResponse, ErrorResponse, HealthResponse types
- Add JSON tags for snake_case field names
- Create transformation functions (Sprint 2 data → API responses)
- Test JSON marshaling

**Step 3: Error Handling** (45 minutes)
- Implement centralized error response function
- Map error scenarios to HTTP status codes
- Create error response helpers
- Test error JSON formatting

**Step 4: Weather Endpoints** (2 hours)
- Implement weatherByCityHandler
  - Extract city from path parameter
  - Call geocode.Geocode()
  - Call weather.FetchWeather()
  - Transform to JSON response
  - Handle errors appropriately
- Implement weatherByCoordinatesHandler
  - Parse lat/lon query parameters
  - Validate coordinate ranges
  - Call weather.FetchWeather()
  - Transform to JSON response
  - Handle errors appropriately
- Test with curl

**Step 5: Health Endpoint** (30 minutes)
- Implement healthHandler
- Return service status, version, timestamp
- Test endpoint accessibility

**Step 6: Middleware** (1.5 hours)
- Implement logging middleware
  - Log request method, path, status, duration
  - Create response writer wrapper
- Implement CORS middleware
  - Set Access-Control headers
  - Handle OPTIONS preflight
- Implement recovery middleware
  - Catch panics
  - Return 500 Internal Server Error
- Test middleware stack

**Step 7: Server Configuration** (45 minutes)
- Add server timeouts (read, write, idle)
- Environment-based port configuration
- Implement graceful shutdown
- Test server startup and shutdown

**Step 8: Integration Testing** (2 hours)
- Create functional tests with httptest
- Test city endpoint (happy path)
- Test coordinates endpoint (happy path)
- Test error scenarios (404, 400, 500)
- Test concurrent requests
- Live API integration tests

**Step 9: Documentation** (1.5 hours)
- Create README.md with API documentation
- Document all endpoints with examples
- Provide curl examples for each endpoint
- Document error responses
- Include deployment instructions
- Document environment variables

**Step 10: Final Testing & Cleanup** (1 hour)
- Run all tests
- Test with Postman/curl
- Verify JSON responses
- Check HTTP status codes
- Code cleanup and comments
- Final verification

**Total Estimated Effort**: 10-12 hours

---

### Testing Strategy

**Unit Tests**:

1. **Response Transformation Tests**
   - Test transformWeatherData function
   - Verify JSON field mapping
   - Test condition text mapping
   - Validate date formatting

2. **Error Response Tests**
   - Test writeErrorResponse function
   - Verify JSON structure
   - Validate status codes
   - Test error message formatting

3. **Validation Tests**
   - Test coordinate range validation
   - Test parameter parsing
   - Test empty/missing parameter handling

**Integration Tests** (using `net/http/httptest`):

```go
func TestWeatherByCityEndpoint(t *testing.T) {
    req := httptest.NewRequest("GET", "/api/v1/weather/city/Berlin", nil)
    w := httptest.NewRecorder()

    weatherByCityHandler(w, req)

    resp := w.Result()
    defer resp.Body.Close()

    // Verify status code
    if resp.StatusCode != http.StatusOK {
        t.Errorf("Expected status 200, got %d", resp.StatusCode)
    }

    // Verify Content-Type
    if ct := resp.Header.Get("Content-Type"); ct != "application/json" {
        t.Errorf("Expected Content-Type application/json, got %s", ct)
    }

    // Parse JSON response
    var weatherResp WeatherResponse
    if err := json.NewDecoder(resp.Body).Decode(&weatherResp); err != nil {
        t.Fatalf("Failed to decode response: %v", err)
    }

    // Verify response structure
    if weatherResp.Location.Name != "Berlin" {
        t.Errorf("Expected location Berlin, got %s", weatherResp.Location.Name)
    }

    if len(weatherResp.Forecast) != 3 {
        t.Errorf("Expected 3-day forecast, got %d days", len(weatherResp.Forecast))
    }
}
```

**Test Cases**:

1. **Weather by City Endpoint**:
   - ✅ Valid city name → 200 OK with weather data
   - ✅ Invalid city name → 404 Not Found with error JSON
   - ✅ Empty city name → 400 Bad Request
   - ✅ City with spaces (e.g., "New York") → 200 OK

2. **Weather by Coordinates Endpoint**:
   - ✅ Valid coordinates → 200 OK with weather data
   - ✅ Missing lat or lon → 400 Bad Request
   - ✅ Invalid lat range (> 90 or < -90) → 400 Bad Request
   - ✅ Invalid lon range (> 180 or < -180) → 400 Bad Request
   - ✅ Non-numeric coordinates → 400 Bad Request

3. **Health Endpoint**:
   - ✅ GET /api/v1/health → 200 OK with status JSON
   - ✅ Response includes status, service, version, timestamp

4. **Error Handling**:
   - ✅ Invalid endpoint → 404 Not Found
   - ✅ Wrong HTTP method (POST to GET endpoint) → 405 Method Not Allowed
   - ✅ API failure (mock) → 500 Internal Server Error

5. **CORS**:
   - ✅ OPTIONS preflight → 200 OK with CORS headers
   - ✅ GET request includes CORS headers
   - ✅ Cross-origin requests allowed

6. **Middleware**:
   - ✅ Logging middleware logs requests
   - ✅ Recovery middleware catches panics

7. **Concurrent Requests** (load testing):
   - ✅ 10 concurrent requests → All succeed
   - ✅ No race conditions
   - ✅ Consistent response times

**Functional Tests** (Copy-paste-able curl examples):

```bash
# Test 1: Weather by city
curl http://localhost:8080/api/v1/weather/city/Berlin

# Test 2: Weather by coordinates
curl 'http://localhost:8080/api/v1/weather/coordinates?lat=52.52&lon=13.41'

# Test 3: Health check
curl http://localhost:8080/api/v1/health

# Test 4: Invalid city (expect 404)
curl http://localhost:8080/api/v1/weather/city/InvalidCity123

# Test 5: Missing coordinates (expect 400)
curl 'http://localhost:8080/api/v1/weather/coordinates?lat=52.52'

# Test 6: Invalid coordinates (expect 400)
curl 'http://localhost:8080/api/v1/weather/coordinates?lat=200&lon=13.41'

# Test 7: Wrong HTTP method (expect 405)
curl -X POST http://localhost:8080/api/v1/weather/city/Berlin

# Test 8: Invalid endpoint (expect 404)
curl http://localhost:8080/api/v1/invalid
```

**Success Criteria**:

✅ All unit tests pass
✅ All integration tests pass
✅ All functional curl examples work as documented
✅ JSON responses valid and well-formed
✅ HTTP status codes correct for all scenarios
✅ CORS headers present for cross-origin requests
✅ Server handles concurrent requests
✅ Graceful shutdown works
✅ Live API integration working (Open-Meteo)
✅ Error responses standardized and clear

---

### Integration Notes

**Dependencies**:

**Internal Dependencies** (from Sprint 2):
- `weather-cli/geocode` package
  - Function: `Geocode(cityName string) (*GeoLocation, error)`
  - Purpose: Convert city names to coordinates
  - Status: Available, tested, no modifications needed

- `weather-cli/weather` package
  - Function: `FetchWeather(lat, lon float64) (*WeatherData, error)`
  - Purpose: Fetch weather data from Open-Meteo API
  - Status: Available, tested, no modifications needed

- `weather-cli/display` package
  - Function: `GetWeatherDescription(code int) string`
  - Purpose: Convert weather codes to human-readable text
  - Status: Available, tested, reused for condition text

**External Dependencies**:
- Open-Meteo Geocoding API (tested in Sprint 2)
- Open-Meteo Forecast API (tested in Sprint 2)

**Compatibility**:

✅ **Perfect Compatibility with Sprint 2**:
- No modifications needed to existing packages
- Data structures have JSON tags (ready for serialization)
- Same API endpoints used (no integration changes)
- Error handling patterns can be adapted for HTTP

**Integration Approach**:

```go
// Import Sprint 2 packages
import (
    "github.com/rstyczynski/weather-cli/geocode"
    "github.com/rstyczynski/weather-cli/weather"
    "github.com/rstyczynski/weather-cli/display"
)

// Use in handler
func weatherByCityHandler(w http.ResponseWriter, r *http.Request) {
    city := r.PathValue("city")

    // Call Sprint 2 geocode package
    location, err := geocode.Geocode(city)
    if err != nil {
        // Handle error
        return
    }

    // Call Sprint 2 weather package
    weatherData, err := weather.FetchWeather(location.Latitude, location.Longitude)
    if err != nil {
        // Handle error
        return
    }

    // Transform and return JSON
    response := transformWeatherData(location, weatherData)
    json.NewEncoder(w).Encode(response)
}
```

**Reusability**:

**Can Reuse from Sprint 2**:
- ✅ Complete geocode package (no changes)
- ✅ Complete weather package (no changes)
- ✅ Weather code mapping (display.GetWeatherDescription)
- ✅ Data structures (with existing JSON tags)
- ✅ Error handling patterns (adapted for HTTP)

**New Code Needed**:
- HTTP server setup
- API handlers
- JSON response transformation
- HTTP error responses
- Middleware (logging, CORS, recovery)
- API documentation

**Sprint 5 (WebUI) Integration Preview**:
- REST API will be consumed by WebUI
- CORS already configured for browser access
- JSON responses ready for frontend consumption
- Health endpoint for service monitoring

---

### Documentation Requirements

**User Documentation** (README.md):

**Required Sections**:
1. **Overview**
   - What the API does
   - Key features
   - Target audience (developers, apps, services)

2. **Prerequisites**
   - Go 1.21+ (from Sprint 1)
   - Internet connection
   - Optional: Docker for containerized deployment

3. **Installation**
   - Clone repository
   - Build binary: `go build`
   - Run server: `./weather-api`

4. **Usage**
   - **Endpoint Documentation**:
     - GET /api/v1/weather/city/{city}
     - GET /api/v1/weather/coordinates?lat={lat}&lon={lon}
     - GET /api/v1/health
   - **Request/Response Examples** (curl)
   - **Error Handling** (status codes, error format)

5. **Configuration**
   - Environment variables (PORT, etc.)
   - CORS settings
   - Logging configuration

6. **Development**
   - Running tests: `go test ./...`
   - Development server: `go run main.go`
   - Code organization

7. **Deployment**
   - Binary deployment
   - Docker deployment (optional)
   - Production considerations (rate limiting, auth, caching)

8. **API Reference**
   - Full endpoint specifications
   - Request parameters
   - Response schemas
   - Error codes and meanings

**Technical Documentation**:

1. **Architecture**
   - System diagram
   - Component descriptions
   - Data flow

2. **Design Decisions**
   - Framework choice (stdlib net/http)
   - Routing approach
   - Error handling strategy
   - CORS configuration

3. **Code Organization**
   - Package structure
   - File organization
   - Responsibilities

4. **Testing**
   - Test structure
   - Running tests
   - Test coverage goals

5. **Sprint 2 Integration**
   - Package imports
   - Function usage
   - Data transformation

---

### Design Decisions

**Decision 1: Standard Library (net/http) vs Web Framework**

**Context**: Need to choose HTTP server implementation

**Decision Made**: Use standard library `net/http` + `http.ServeMux` for routing

**Rationale**:
- ✅ Zero external dependencies (aligns with Sprint 2 approach)
- ✅ Sufficient for simple REST API (3 endpoints)
- ✅ Production-ready and robust (used by Google, etc.)
- ✅ Go 1.22+ ServeMux supports path parameters natively
- ✅ Reduces complexity and attack surface
- ✅ Easier maintenance (no framework version updates)

**Alternatives Considered**:
- **Gin Web Framework**: Popular, fast, feature-rich
  - Pros: Faster routing, middleware ecosystem, better developer experience
  - Cons: External dependency, more complex, may be overkill for 3 endpoints
- **Echo Framework**: Lightweight, performant
  - Pros: Good performance, clean API
  - Cons: Still an external dependency, adds complexity
- **Gorilla Mux**: Enhanced router
  - Pros: Better routing features than stdlib
  - Cons: Archived project (no longer maintained)

**Risk**: Low
- Standard library is stable and well-tested
- If routing becomes complex, can migrate to framework later
- Current requirements well within stdlib capabilities

---

**Decision 2: Direct Struct Marshaling for JSON**

**Context**: How to transform Sprint 2 data structures to JSON responses

**Decision Made**: Create API-specific response structs, transform from Sprint 2 data, use Go's `encoding/json` for marshaling

**Rationale**:
- ✅ Clean separation (API responses != internal data structures)
- ✅ Control over JSON field names (snake_case for JSON convention)
- ✅ Can add/remove fields without changing Sprint 2 packages
- ✅ Standard library `encoding/json` is excellent
- ✅ Type safety with compile-time checks

**Alternatives Considered**:
- **Direct Marshaling of Sprint 2 Structs**:
  - Pros: No transformation needed, simpler
  - Cons: Ties API to internal structures, less flexibility
- **Third-party JSON libraries (jsoniter, easyjson)**:
  - Pros: Slightly faster performance
  - Cons: External dependencies, not needed for MVP

**Risk**: Very Low
- Transformation logic is straightforward
- Performance impact negligible for weather API scale

---

**Decision 3: Error Response Standardization**

**Context**: How to format error responses

**Decision Made**: Standardized ErrorResponse struct with code, message, and status fields

**Rationale**:
- ✅ Consistent error format across all endpoints
- ✅ Machine-readable error codes (CLIENT_ERROR, LOCATION_NOT_FOUND)
- ✅ Human-readable error messages
- ✅ Includes HTTP status code for clarity
- ✅ Common REST API pattern (easy for clients to parse)

**Alternatives Considered**:
- **Simple string error messages**:
  - Pros: Simpler
  - Cons: Harder for clients to handle programmatically
- **Problem Details (RFC 7807)**:
  - Pros: Standard format
  - Cons: More complex, overkill for simple API

**Risk**: Very Low
- Standardized format improves client experience
- Easy to extend with additional fields if needed

---

**Decision 4: CORS Middleware Configuration**

**Context**: API needs to support browser-based clients (for Sprint 5 WebUI)

**Decision Made**: Include CORS middleware with permissive development configuration (`Access-Control-Allow-Origin: *`)

**Rationale**:
- ✅ Required for Sprint 5 WebUI browser access
- ✅ Development-friendly (allows testing from any origin)
- ✅ Simple to tighten for production (change `*` to specific domains)
- ✅ Standard practice for REST APIs consumed by browsers

**Alternatives Considered**:
- **No CORS (defer to Sprint 5)**:
  - Pros: Simpler now
  - Cons: Blocks Sprint 5 integration, requires retrofitting
- **Strict CORS from Start**:
  - Pros: More secure
  - Cons: Don't know WebUI domain yet, makes development harder

**Risk**: Medium (Security)
- Permissive CORS is development configuration only
- **Mitigation**: Document production recommendation in README
- Production deployment should restrict to specific domains

---

**Decision 5: API Versioning with /api/v1/ Prefix**

**Context**: Need to plan for future API changes

**Decision Made**: Include `/api/v1/` prefix in all endpoint paths

**Rationale**:
- ✅ Enables future API changes without breaking existing clients
- ✅ Standard REST API practice
- ✅ Clear separation from potential future web UI routes
- ✅ Low implementation cost now, high future flexibility
- ✅ Professional API design

**Alternatives Considered**:
- **No versioning (flat routes like /weather/city)**:
  - Pros: Simpler paths
  - Cons: Cannot evolve API without breaking clients
- **Header-based versioning (Accept: application/vnd.api.v1+json)**:
  - Pros: Cleaner URLs
  - Cons: More complex, harder to test, less discoverable

**Risk**: Very Low
- Standard practice with proven benefits
- Easy to implement (just path prefix)

---

**Decision 6: Middleware Stack Order**

**Context**: Need to apply logging, CORS, and recovery to all requests

**Decision Made**: Middleware order: Logging → CORS → Recovery → Handlers

**Rationale**:
- ✅ Logging outermost (logs all requests including CORS preflight)
- ✅ CORS before recovery (ensure CORS headers on panic responses)
- ✅ Recovery innermost (catches panics from handlers)
- ✅ Standard middleware ordering pattern

**Alternatives Considered**:
- **Different orders**:
  - Each has specific implications for behavior
  - Chosen order ensures comprehensive logging and proper CORS

**Risk**: Very Low
- Well-established pattern
- Easy to test and verify

---

**Decision 7: Port Configuration**

**Context**: Server needs to listen on a port

**Decision Made**: Default to port 8080, allow override via `PORT` environment variable

**Rationale**:
- ✅ 8080 is standard development port for HTTP services
- ✅ Environment variable enables deployment flexibility
- ✅ Works with Docker, Kubernetes, cloud platforms
- ✅ Non-privileged port (doesn't require root)

**Alternatives Considered**:
- **Fixed port (no configuration)**:
  - Pros: Simpler
  - Cons: Inflexible for deployment
- **Command-line flag**:
  - Pros: Explicit
  - Cons: Less common for containerized deployments

**Risk**: Very Low
- Standard approach for modern web services

---

### Open Design Questions

**None** - All design decisions made autonomously in YOLO mode (documented above).

**For Product Owner Review** (post-implementation):
1. CORS configuration - Approve development settings, confirm production domain restrictions
2. API versioning - Confirm /api/v1/ approach acceptable
3. Error response format - Verify error code and message style
4. Framework choice - Validate stdlib decision (can switch if needed)

---

## YOLO Mode Decisions

This sprint was designed in YOLO (autonomous) mode. The following design decisions were made:

### Decision 1: Framework Selection

**Context**: Choose between standard library net/http and web frameworks (Gin, Echo, Fiber)

**Decision Made**: Use standard library `net/http` with native `http.ServeMux` router

**Rationale**:
- Maintains zero-dependency approach from Sprint 2
- Sufficient for simple REST API (3 endpoints)
- Go 1.22+ ServeMux supports path parameters (e.g., `/city/{city}`)
- Production-ready and maintained by Go core team
- Reduces complexity and potential security issues

**Alternatives Considered**:
- Gin Web Framework: Excellent performance, rich features, but adds dependency
- Echo Framework: Lightweight and fast, but still external dependency
- Gorilla Mux: Good routing, but archived (no longer maintained)

**Trade-offs**:
- Standard library requires more manual setup (middleware, error handling)
- Frameworks provide features like auto-validation, middleware ecosystem
- Decision: Prefer simplicity and zero dependencies for MVP

**Risk**: Low
- Standard library is proven and reliable
- Can migrate to framework if complexity grows
- Current requirements easily met with stdlib

### Decision 2: JSON Response Structure

**Context**: How to structure JSON responses and whether to create new types or reuse Sprint 2 structs

**Decision Made**: Create API-specific response structs (WeatherResponse, ErrorResponse) with snake_case JSON fields

**Rationale**:
- Clean separation of API contract from internal data structures
- Follows JSON naming conventions (snake_case standard)
- Allows API evolution without changing internal packages
- Type-safe transformation with compile-time checking
- Standard REST API practice

**Alternatives Considered**:
- Direct marshaling of Sprint 2 structs: Simpler but less flexible
- Dynamic JSON generation: More flexible but error-prone

**Trade-offs**:
- Requires transformation code (Sprint 2 data → API response)
- More boilerplate but better maintainability
- Decision: Type safety and flexibility worth the extra code

**Risk**: Very Low
- Transformation is straightforward
- Performance impact negligible for weather API scale

### Decision 3: Error Handling Approach

**Context**: How to handle and format errors in REST API

**Decision Made**: Centralized error response function + standardized ErrorResponse JSON structure

**Rationale**:
- Consistent error format across all endpoints
- Machine-readable error codes + human-readable messages
- Proper HTTP status code mapping
- Common REST API pattern (easy for clients)
- Single point of change for error format

**Alternatives Considered**:
- Simple string errors: Easy but not machine-parseable
- RFC 7807 Problem Details: Standard but complex for simple API

**Trade-offs**:
- Requires defining error codes (LOCATION_NOT_FOUND, etc.)
- More structured than simple strings
- Decision: Better client experience worth the structure

**Risk**: Very Low
- Standardized approach improves API usability
- Easy to extend with additional fields if needed

### Decision 4: CORS Configuration

**Context**: API needs to support browser clients for future Sprint 5 WebUI

**Decision Made**: Include CORS middleware with permissive development configuration (allow all origins)

**Rationale**:
- Required for Sprint 5 WebUI to call API from browser
- Development-friendly (easy testing from any origin)
- Simple to tighten for production (change `*` to specific domains)
- Standard practice for REST APIs consumed by browsers

**Alternatives Considered**:
- No CORS (defer to Sprint 5): Would block WebUI integration
- Strict CORS now: Don't know WebUI domain yet

**Trade-offs**:
- Permissive CORS is less secure
- But required for development and testing
- Decision: Use permissive for MVP, document production recommendations

**Risk**: Medium (Security consideration)
- Open CORS could allow unauthorized cross-origin requests
- Mitigation: Document clearly as development configuration
- Recommend production configuration in README
- Low risk for weather data (public information)

### Decision 5: Middleware Stack

**Context**: Need logging, CORS, and panic recovery for all requests

**Decision Made**: Implement middleware stack: Logging → CORS → Recovery → Handlers

**Rationale**:
- Logging outermost (capture all requests including CORS preflight)
- CORS before recovery (ensure CORS headers even on panics)
- Recovery innermost (catch panics from handlers)
- Standard middleware ordering pattern

**Alternatives Considered**:
- Different middleware orders have different behavior
- Chose order that maximizes observability and robustness

**Trade-offs**:
- Manual middleware composition (stdlib doesn't provide chain helper)
- More verbose than framework approach
- Decision: Full control worth the verbosity

**Risk**: Very Low
- Well-established pattern
- Easy to test

### Decision 6: Testing Strategy

**Context**: How to test HTTP handlers and API integration

**Decision Made**: Combination of httptest unit tests + copy-paste-able curl functional tests

**Rationale**:
- httptest allows testing handlers without running server
- Curl examples match Sprint 2 documentation style
- Both unit and functional testing for comprehensive coverage
- Maintains copy-paste-able documentation requirement

**Alternatives Considered**:
- Only httptest: Good for CI but no real-world testing
- Only curl: Real-world but harder to automate

**Trade-offs**:
- Both approaches require maintenance
- Decision: Comprehensive testing worth the effort

**Risk**: Very Low
- Standard Go testing approach (httptest)
- Proven pattern from Sprint 2 (curl examples)

### Decision 7: Project Structure

**Context**: How to organize REST API code

**Decision Made**: Separate `weather-api/` directory with packages: handlers/, middleware/, responses/

**Rationale**:
- Clean separation from CLI (weather-cli/ vs weather-api/)
- Package-based organization (Go best practice)
- Reuses Sprint 2 packages as imports
- Supports future growth (easy to add packages)

**Alternatives Considered**:
- Extend weather-cli with api/ subdirectory: Couples CLI and API
- Monolithic main.go: Doesn't scale, hard to test

**Trade-offs**:
- More directories and imports
- Decision: Organization benefits worth the structure

**Risk**: Very Low
- Standard Go project layout
- Clear separation of concerns

---

## Design Summary

### Overall Architecture

**Layered REST API Architecture**:
- **Presentation Layer**: HTTP endpoints, JSON responses, error formatting
- **Business Logic Layer**: Sprint 2 packages (geocode, weather)
- **Data Layer**: Open-Meteo APIs

**Key Characteristics**:
- **Stateless**: No session management, each request independent
- **Service-Oriented**: Separates data logic (Sprint 2) from presentation (REST API)
- **Scalable**: Go's concurrency handles multiple requests efficiently
- **Extensible**: Easy to add new endpoints, middleware, or features

**Integration Points**:
- **Inbound**: HTTP clients (curl, browsers, mobile apps, services)
- **Outbound**: Sprint 2 packages → Open-Meteo APIs
- **Future**: Sprint 5 WebUI will consume this API

---

### Shared Components

**From Sprint 2** (no modifications needed):
- `geocode` package: City name → coordinates
- `weather` package: Coordinates → weather data
- `display` package: Weather codes → condition text
- Data structures: GeoLocation, WeatherData, CurrentWeather, DailyForecast

**New Shared Components**:
- **Error Response Helper**: Centralized error formatting
- **Logging Middleware**: Request logging for all endpoints
- **CORS Middleware**: Cross-origin support for all endpoints
- **Recovery Middleware**: Panic handling for all endpoints
- **Response Transformation**: Sprint 2 data → API JSON

**Benefits of Component Reuse**:
- ✅ Reduces code duplication
- ✅ Maintains consistency across CLI and API
- ✅ Leverages tested and proven code
- ✅ Simplifies maintenance

---

### Design Risks

**Low Risk Items**:
- HTTP server implementation (standard library proven)
- JSON serialization (excellent stdlib support)
- Sprint 2 package integration (clean interfaces)
- Testing approach (httptest + curl examples)

**Medium Risk Items**:

1. **CORS Configuration**
   - Risk: Permissive CORS could allow unauthorized access
   - Mitigation: Document as development config, recommend production restrictions
   - Impact: Low (weather data is public)

2. **Concurrent Request Handling**
   - Risk: Race conditions or resource contention
   - Mitigation: Go handles concurrency well, test with concurrent requests
   - Impact: Medium (could affect availability)

3. **External API Dependency**
   - Risk: Open-Meteo API availability or rate limits
   - Mitigation: Same as Sprint 2 (handle errors gracefully), document limitations
   - Impact: Medium (blocks functionality if API unavailable)

**Mitigation Strategies**:
- Comprehensive testing (unit, integration, load)
- Clear error handling and logging
- Documentation of production considerations
- Monitoring via health endpoint

**Overall Risk Level**: **Low** - Solid foundation, proven components, clear architecture

---

### Resource Requirements

**Development Tools** (from Sprint 1):
- Go 1.21+ ✅
- Development environment (VSCode, GoLand, etc.) ✅
- Git ✅

**External Services**:
- Open-Meteo Geocoding API ✅ (tested in Sprint 2)
- Open-Meteo Forecast API ✅ (tested in Sprint 2)

**Go Packages** (all standard library):
- `net/http` - HTTP server and client
- `encoding/json` - JSON marshaling/unmarshaling
- `net/http/httptest` - HTTP testing
- `log` - Logging
- `os` - Environment variables
- `context` - Graceful shutdown
- `os/signal` - Signal handling
- `syscall` - System calls
- `time` - Timeouts and timestamps

**Sprint 2 Packages** (import as dependencies):
- `github.com/rstyczynski/weather-cli/geocode`
- `github.com/rstyczynski/weather-cli/weather`
- `github.com/rstyczynski/weather-cli/display`

**Testing Tools**:
- Go testing package (stdlib)
- httptest (stdlib)
- curl (command-line HTTP client)

**Deployment Resources** (future):
- Docker (optional, for containerized deployment)
- Cloud platform (AWS, GCP, Azure, Heroku, etc.)

**No External Dependencies** - Maintains zero-dependency approach from Sprint 2 ✅

---

### Design Approval Status

**Status**: ✅ **Accepted** (YOLO Mode Auto-Approval)

**YOLO Mode Note**: Design auto-approved after creation per YOLO mode rules. All design decisions documented with rationale for Product Owner review.

**Approval Criteria Met**:
- ✅ All requirements addressed (REST API, JSON, HTTP methods)
- ✅ Feasibility confirmed (all APIs available, stdlib sufficient)
- ✅ Sprint 2 integration verified (packages compatible)
- ✅ Testing strategy defined (httptest + curl examples)
- ✅ Documentation requirements identified
- ✅ Design decisions documented with rationale
- ✅ Risks assessed and mitigated

**Ready For**: Construction Phase (Implementation)

**Design Quality**: High
- Comprehensive coverage of all requirements
- Clear architectural decisions
- Detailed specifications
- Thorough testing strategy
- Documented trade-offs and risks

**Next Steps**: Proceed to Construction phase for implementation

---

## Design Approval

**YOLO Mode**: Auto-approved after completion

**Timestamp**: 2025-11-13

**Ready for Construction**: ✅ Yes

**All YOLO decisions documented for Product Owner review in post-implementation review**

---

**Design Phase Complete** - Proceeding to Construction immediately (YOLO mode)
