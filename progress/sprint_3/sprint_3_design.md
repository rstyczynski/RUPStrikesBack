# Sprint 3 - Design

## RSB-4. Weather forecast exposes REST API

Status: Proposed

### Requirement Summary
Expose HTTP API for weather forecast with city or coordinates; JSON output; CORS enabled.

### Feasibility Analysis

**API Availability:**
- Use standard library net/http and encoding/json
- Reuse existing weather-cli/weather package for data

**Technical Constraints:**
- Keep no external dependencies

**Risk Assessment:**
- Low risk; straightforward wrappers

### Design Overview

**Architecture:**
- Separate module ./weather-api providing HTTP server using existing weather logic

**Key Components:**
1. cmd/server/main.go: entrypoint (go run ./weather-api/cmd/server)
2. internal/server/server.go: http handlers and router
3. go.mod in weather-api using module name weather-api and require ../weather-cli as replace path

**Data Flow:**
- HTTP request -> handler -> call weather.GetWeatherForCity/GetWeatherForCoordinates -> JSON response

### Technical Specification

**APIs Used:**
- GET /health -> 200 {"status":"ok"}
- GET /v1/weather?city=London -> 200 ForecastResponse+Location
- GET /v1/weather?lat=..&lon=.. -> 200 ForecastResponse

**Data Structures:**
- Response schema mirrors weather-cli/weather types; for city include {location: Location, forecast: ForecastResponse}

**Scripts/Tools:**
- Makefile targets: run, build (optional later)

**Error Handling:**
- 400 for missing/invalid params; 502 for upstream errors

### Implementation Approach

**Step 1:** Scaffold weather-api module and files
**Step 2:** Implement handlers and CORS middleware (Allow-Origin: *)
**Step 3:** Wire routes and start server on :8080
**Step 4:** Minimal tests via curl documented in tests.md

### Testing Strategy

**Functional Tests:**
1. GET /health returns ok
2. GET /v1/weather?city=London returns JSON with fields
3. GET /v1/weather?lat=52.52&lon=13.405 returns JSON

**Edge Cases:**
1. Missing params -> 400
2. Invalid coords -> 400

**Success Criteria:**
All endpoints respond with expected JSON and CORS header.

### Integration Notes

**Dependencies:**
- weather-cli/weather local module via replace directive

**Compatibility:**
- Shared data types ensure consistent fields

**Reusability:**
- Handlers usable in future web UI integration

### Documentation Requirements

**User Documentation:**
- How to run server and example curls

**Technical Documentation:**
- Endpoint list and parameters

### Design Decisions

**Decision 1:** Separate module weather-api to decouple CLI and API
**Rationale:** Clean boundaries and reuse
**Alternatives Considered:** Integrate into weather-cli; rejected for clarity

### Open Design Questions
None
