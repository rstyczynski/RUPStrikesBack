# Sprint 3 - Design

## RSB-4. Weather forecast exposes REST API

Status: Accepted

### Requirement Summary

Build REST API HTTP server exposing weather forecast data via JSON endpoints. Reuses Sprint 2 `weather/` package for data retrieval logic.

### Feasibility Analysis

**API Availability:**

✓ All required from Sprint 2 `weather/` package:
- `weather.GetWeather(location string)` - City-based lookup
- `weather.GetWeatherByCoords(lat, lon float64)` - Coordinate-based lookup
- `weather.ForecastData` - Already has JSON tags

**Technical Constraints:**

- Go stdlib only (no external web frameworks)
- CORS required for Sprint 5 WebUI
- Port configurable (default 8080)

**Risk Assessment:**

| Risk | Level | Mitigation |
|------|-------|------------|
| CORS misconfiguration | Low | Standard headers, test with WebUI |
| Concurrent requests | Low | Go handles natively |
| Error marshaling | Low | Standard JSON error format |

### Design Overview

**Architecture:**

```
HTTP Request → Router → Handler → weather.GetWeather() → JSON Response
                  ↓
              CORS Middleware
```

**Key Components:**

1. **main.go** - HTTP server setup, routing, signal handling
2. **handlers.go** - Weather and health endpoint logic
3. **middleware.go** - CORS headers
4. **weather/ (Sprint 2)** - Imported as-is (ZERO duplication)

**Data Flow:**

1. Client sends GET /weather?city=London
2. CORS middleware adds headers
3. Handler parses query params
4. Call weather.GetWeather("London")
5. Marshal ForecastData to JSON
6. Return HTTP 200 + JSON

### Technical Specification

**API Endpoints:**

| Endpoint | Method | Query Params | Response | Status Codes |
|----------|--------|--------------|----------|--------------|
| /weather | GET | city=string | ForecastData JSON | 200, 400, 500 |
| /weather | GET | lat=float&lon=float | ForecastData JSON | 200, 400, 500 |
| /health | GET | none | {"status":"ok"} | 200 |

**Request Examples:**
- `/weather?city=London`
- `/weather?lat=51.5074&lon=-0.1278`

**Response Schema:**

Uses existing `weather.ForecastData` struct (already has JSON tags from Sprint 2):

```json
{
  "location": "London, GB",
  "current": { ... },
  "forecast": [ ... ]
}
```

**Error Response Format:**

```json
{
  "error": "error message here"
}
```

**CORS Headers:**

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

**Server Configuration:**

- Port: Flag `--port` (default 8080)
- Graceful shutdown: SIGINT/SIGTERM handling
- Logging: Stdlib `log` package

### Implementation Approach

**File Structure:**

```
weather-api/
├── main.go           (~80 lines: server, routing, config)
├── handlers.go       (~70 lines: weather + health handlers)
├── middleware.go     (~20 lines: CORS)
├── go.mod            (module + weather-cli dependency)
└── weather-api       (binary)
```

**Steps:**

1. Create go.mod with local weather-cli dependency
2. Implement CORS middleware
3. Implement /health handler (simple JSON response)
4. Implement /weather handler (parse params, call weather pkg, marshal)
5. Setup router and server in main()
6. Add graceful shutdown (signal.Notify)

### Testing Strategy

**Functional Tests:**

| Test | Command | Expected |
|------|---------|----------|
| Health check | curl /health | {"status":"ok"} |
| City weather | curl /weather?city=London | JSON with forecast |
| Coords weather | curl /weather?lat=51.5&lon=-0.1 | JSON with forecast |
| CORS headers | curl -i /weather?city=NY | Access-Control-* headers present |
| Missing params | curl /weather | 400 error JSON |
| Invalid coords | curl /weather?lat=invalid | 400 error JSON |
| Unknown city | curl /weather?city=ZZZZZ | 500 error JSON |

**Parallel Requests:**

- Test 10 concurrent curl requests (different cities)
- Verify all return correct data
- No correlation issues (Go handles natively)

**Success Criteria:**

- All endpoints return valid JSON
- Error cases return proper status codes
- CORS headers present on all responses
- Server starts/stops cleanly
- Sprint 2 tests still pass (no regression)

### Integration Notes

**Dependencies:**

- Sprint 2 weather-cli package (complete ✓)
- Open-Meteo APIs (validated Sprint 1 ✓)

**Compatibility:**

Import path: `import "weather-cli/weather"`

No modifications to Sprint 2 code. Read-only import.

**Reusability:**

Sprint 5 WebUI will call these REST endpoints from browser.

### Documentation Requirements

**User Documentation:**

- API endpoint reference (paths, params, responses)
- Example curl commands (copy-paste-able)
- CORS configuration notes
- Port configuration
- Error response format

**Technical Documentation:**

- go.mod setup with local dependency
- Build instructions
- Running the server
- Testing with curl

### YOLO Mode Decisions

**Decision 1: Port Configuration**
- **Context**: Port number not specified
- **Decision**: Default 8080, configurable via --port flag
- **Rationale**: Standard dev port, flexible deployment
- **Alternatives**: Env var (more complex), hardcode (inflexible)
- **Risk**: Low - common practice

**Decision 2: CORS Policy**
- **Context**: CORS details not specified beyond "support needed"
- **Decision**: Allow-Origin: * (wide open)
- **Rationale**: Simplifies Sprint 5 WebUI, MVP approach
- **Alternatives**: Specific origins (more secure, premature)
- **Risk**: Low - not production deployment

**Decision 3: Error Format**
- **Context**: Error JSON schema not specified
- **Decision**: Simple {"error": "message"} format
- **Rationale**: Minimalist, easy to parse, industry standard
- **Alternatives**: Detailed error objects (over-engineering for MVP)
- **Risk**: Low - can extend later if needed

### Open Design Questions

None - YOLO mode proceeding with decisions documented above.

---

# Design Summary

## Overall Architecture

Simple HTTP REST server wrapping Sprint 2 weather package. Three-file implementation (~170 LOC) plus go.mod.

## Shared Components

- Sprint 2 `weather/` package (100% reuse)
- Go stdlib: net/http, encoding/json, log, flag

## Design Risks

All low. Proven components, standard patterns, no external dependencies.

## Resource Requirements

- Go 1.x (already installed from Sprint 1)
- weather-cli package (Sprint 2 complete)
- No new tools or services

## Design Approval Status

**Proposed** (YOLO auto-approval active)

---

**Token Usage**: ~56K tokens for elaboration phase.
