# Sprint 3 - Design

## RSB-4. Weather forecast exposes REST API

Status: Accepted

### Requirement Summary

RESTful API exposing weather forecast data through HTTP endpoints. Reuses weather-cli/weather package for zero code duplication.

### Feasibility Analysis

**API Availability:**
- Open-Meteo APIs: Confirmed available (Sprint 1)
- weather-cli/weather package: Available (Sprint 2)
- Go net/http: Standard library

**Technical Constraints:**
- Reuse weather-cli/weather package (import path)
- JSON responses only
- Standard HTTP methods

**Risk Assessment:**
- Low: HTTP server implementation
- Low: Package import/reuse
- Low: JSON encoding

### Design Overview

**Architecture:**
```
HTTP Request → Router → Handler → weather package → Open-Meteo API
                                    ↓
                              JSON Response
```

**Key Components:**
1. HTTP server (main.go)
2. Request handlers (city, coordinates)
3. weather package import (reuse from Sprint 2)

### Technical Specification

**APIs Used:**
- Endpoint: /weather/city?city={name}
  - Method: GET
  - Purpose: Get weather by city name
  - Returns: JSON ForecastResponse

- Endpoint: /weather/coord?lat={lat}&lon={lon}
  - Method: GET
  - Purpose: Get weather by coordinates
  - Returns: JSON ForecastResponse

**Data Structures:**
- Reuse ForecastResponse from weather-cli/weather/types.go
- Reuse Location from weather-cli/weather/types.go

**Scripts/Tools:**
- File: weather-api/main.go
  - Purpose: HTTP server entry point
  - Interface: HTTP handlers
  - Dependencies: weather-cli/weather package

**Error Handling:**
- 400: Invalid input (bad coordinates, missing params)
- 404: City not found
- 500: API/network errors

### Implementation Approach

**Step 1:** Create weather-api directory
**Step 2:** Initialize Go module
**Step 3:** Import weather-cli/weather package
**Step 4:** Implement HTTP handlers
**Step 5:** Add routing and server startup

### Testing Strategy

**Functional Tests:**
1. GET /weather/city?city=San+Francisco
2. GET /weather/coord?lat=37.77&lon=-122.42
3. Error: Missing parameters
4. Error: Invalid coordinates

**Success Criteria:**
- Server starts on port 8080
- JSON responses valid
- Error handling works

### Integration Notes

**Dependencies:**
- weather-cli/weather package (Sprint 2)

**Compatibility:**
- Direct import of weather package
- Same data structures
- JSON encoding instead of CLI formatting

### Design Decisions

**Decision 1:** Endpoint structure
- /weather/city and /weather/coord
- Query parameters for input
- Rationale: RESTful, clear separation

**Decision 2:** Port 8080
- Default HTTP port
- Rationale: Standard, non-privileged

**Decision 3:** JSON only
- No XML or other formats
- Rationale: Simple, standard

### Open Design Questions

None

---

# Design Summary

## Overall Architecture

HTTP server with two endpoints, reusing weather package from Sprint 2.

## Shared Components

- weather-cli/weather package (100% reuse)

## Design Risks

- Low: Standard HTTP patterns
- Low: Proven weather package

## Resource Requirements

- Go standard library (net/http, encoding/json)
- weather-cli/weather package

## Design Approval Status

Status: Proposed

