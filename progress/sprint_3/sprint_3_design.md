# Sprint 3 - Design

## RSB-4. Weather forecast exposes REST API

Status: Proposed

### Requirement Summary
Expose weather forecast via REST in a separate service (./weather-api) returning JSON with CORS enabled. Reuse existing Go package from CLI for geocoding and forecast retrieval.

### Feasibility Analysis

**API Availability:**
- Open-Meteo Geocoding API: https://geocoding-api.open-meteo.com
- Open-Meteo Forecast API: https://api.open-meteo.com
- Existing code in weather-cli/weather provides:
  - GeocodeCity(city) -> Location
  - GetForecast(lat, lon) -> ForecastResponse

**Technical Constraints:**
- Network access to Open-Meteo
- Reasonable timeout handling (existing 10s)
- Keep REST outputs stable for future WebUI

**Risk Assessment:**
- Upstream rate limiting/timeouts → return 502 with error payload
- Ambiguous city names → return first match (documented behavior)
- CORS permissive for MVP; may need tightening later

### Design Overview

**Architecture:**
- Process: standalone Go HTTP server
- Port: 8080 (configurable later)
- Single endpoint for MVP: GET /weather?city={city}
- CORS: Allow-All header for simplicity

**Key Components:**
1. main.go
   - Boot HTTP server on :8080
   - Register handlers and middleware
2. handlers/weather.go
   - Handler for GET /weather
   - Validates query, calls weather package, serializes JSON
3. internal/cors/middleware.go
   - Adds Access-Control-Allow-Origin: *
4. go.mod
   - Module: weather-api
   - replace to import ../weather-cli for local dev

**Data Flow:**
Client → /weather?city=X → handler → GeocodeCity(X) → GetForecast(lat, lon) → JSON {location, forecast}

### Technical Specification

**Endpoint:**
- Path: /weather
- Method: GET
- Query: city (string, required)

**Success Response (200):**
```json
{
  "location": {
    "name": "Berlin",
    "latitude": 52.5200,
    "longitude": 13.4050,
    "country": "Germany",
    "admin1": "Berlin"
  },
  "forecast": {
    "latitude": 52.52,
    "longitude": 13.405,
    "timezone": "Europe/Berlin",
    "current": {
      "time": "2025-12-19T09:00:00Z",
      "temperature_2m": 5.1,
      "weather_code": 3
    },
    "daily": {
      "time": ["2025-12-19","2025-12-20","2025-12-21"],
      "temperature_2m_max": [6.2,5.9,4.1],
      "temperature_2m_min": [1.3,0.9,-0.2],
      "weather_code": [3,61,2]
    }
  }
}
```

**Error Responses:**
- 400 Bad Request (missing city)
```json
{ "error": "query parameter 'city' is required" }
```
- 404 Not Found (city not found)
```json
{ "error": "city not found: X" }
```
- 502 Bad Gateway (upstream failure)
```json
{ "error": "forecast API request failed" }
```

**Headers:**
- Access-Control-Allow-Origin: *

**CORS:**
- Simple middleware adds Allow-Origin: * for GET

### Implementation Approach

**Step 1:** Create module structure
- weather-api/
  - go.mod (module weather-api)
  - main.go
  - handlers/weather.go
  - internal/cors/middleware.go

**Step 2:** Dependency linkage
- In weather-api/go.mod:
  - require weather-cli v0.0.0
  - replace weather-cli => ../weather-cli
- In code: import "weather-cli/weather"

**Step 3:** Handler logic (handlers/weather.go)
- Read city from query
- city == "" → 400
- location, err := weather.GeocodeCity(city)
  - if city not found → 404
  - other error → 502
- forecast, err := weather.GetForecast(location.Latitude, location.Longitude)
  - on error → 502
- Encode combined {location, forecast} as JSON

**Step 4:** Server bootstrap (main.go)
- mux.HandleFunc("/weather", handler)
- wrap with cors middleware
- http.ListenAndServe(":8080", handler)

**Step 5:** Error model helper
- Small struct { error string } for error payloads

### Testing Strategy

**Functional Tests (copy-paste-able):**
1) Happy path
```bash
# Start server in another terminal first
curl -s "http://localhost:8080/weather?city=Berlin" | jq '.location.name,.forecast.current.temperature_2m' 
# Expect: "Berlin" and a numeric temperature
```

2) Missing city
```bash
curl -i -s "http://localhost:8080/weather" | head -n 1
# Expect: HTTP/1.1 400 Bad Request
```

3) Not found city
```bash
curl -i -s "http://localhost:8080/weather?city=NoSuchCityXYZ" | head -n 1
# Expect: HTTP/1.1 404 Not Found
```

4) CORS header
```bash
curl -i -s "http://localhost:8080/weather?city=Berlin" | grep -i access-control-allow-origin
# Expect: Access-Control-Allow-Origin: *
```

### Integration Notes

**Dependencies:**
- weather-cli/weather package (local replace)
- net/http, encoding/json, timeouts inherited from weather package

**Compatibility:**
- JSON fields mirror existing types.go
- No change to CLI

**Reusability:**
- weather package usable by both CLI and API

### Documentation Requirements

**User Documentation:**
- How to run server
- Endpoint usage examples
- Error codes and JSON shape
- Note on CORS

**Technical Documentation:**
- Module structure and replace directive
- Handler responsibilities and error mapping

### Design Decisions

**Decision 1:** Single endpoint /weather by city for MVP
- Rationale: Keep scope minimal; extend later for coordinates
- Alternatives: Add /weather/by-coords?lat&lon (postpone)

**Decision 2:** CORS Allow-All
- Rationale: Expedite WebUI integration; tighten later
- Alternatives: Configurable allowed origins

**Decision 3:** Import local package via replace
- Rationale: Simple monorepo dev
- Alternatives: Extract shared module

### Open Design Questions
None for MVP.

---

# Design Summary

## Overall Architecture
Single-process Go HTTP API leveraging existing weather package. Minimal surface: GET /weather with clear error mapping and permissive CORS.

## Shared Components
- weather-cli/weather reused: types, geocoding, forecast

## Design Risks
- Upstream instability; mitigated with error mapping (502) and timeouts

## Resource Requirements
- Go 1.21
- Internet access to Open-Meteo

## Design Approval Status
Awaiting Review
