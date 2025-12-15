# Sprint 3 - Design

## RSB-4: Weather forecast exposes REST API

Status: Accepted

### Requirement Summary

Build REST API server exposing weather data via JSON over HTTP with CORS support.

### Feasibility Analysis

**API Availability:**
✅ Go net/http package (standard library)
✅ Existing weather-cli/weather package (Sprint 2)
✅ JSON encoding (standard library)

**Technical Constraints:**
- Must not modify Sprint 2 code
- Must use existing Open-Meteo integration

**Risk Assessment:**
- Low risk - straightforward HTTP wrapper
- No external dependencies beyond stdlib

### Design Overview

**Architecture:**
```
HTTP Request → Handler → weather.GetWeatherForCity() → JSON Response
```

**Key Components:**
1. **main.go**: HTTP server setup, CORS middleware
2. **handlers.go**: Weather endpoint handler
3. **Import**: weather-cli/weather package

**Data Flow:**
```
Client → GET /weather?city=London
→ Handler extracts city param
→ weather.GetWeatherForCity(city)
→ JSON marshal response
→ Return with CORS headers
```

### Technical Specification

**API Endpoint:**

| Method | Path | Query Params | Response |
|--------|------|--------------|----------|
| GET | /weather | city (required) | JSON weather data |

**Data Structures:**

Response uses existing `weather.ForecastResponse` and `weather.Location` with JSON tags already present.

**Error Responses:**

| Scenario | HTTP Status | Response |
|----------|-------------|----------|
| Missing city | 400 | {"error": "city parameter required"} |
| City not found | 404 | {"error": "city not found"} |
| Forecast error | 500 | {"error": "failed to get forecast"} |

**CORS Headers:**
- Access-Control-Allow-Origin: *
- Access-Control-Allow-Methods: GET, OPTIONS
- Access-Control-Allow-Headers: Content-Type

### Implementation Approach

**Step 1:** Create ./weather-api directory structure
**Step 2:** Write main.go with HTTP server on :8080
**Step 3:** Write weatherHandler with error handling
**Step 4:** Add CORS middleware
**Step 5:** Import weather-cli/weather package

### Testing Strategy

**Functional Tests:**
1. GET /weather?city=London → 200 + JSON
2. GET /weather (no city) → 400 + error JSON
3. GET /weather?city=InvalidCity → 404 + error JSON
4. CORS headers present in all responses

**Success Criteria:**
- Server starts on port 8080
- All test cases pass
- JSON response valid
- CORS headers present

### Integration Notes

**Dependencies:**
- weather-cli/weather package (import)
- No changes to Sprint 2 code required

**Compatibility:**
- Uses same Open-Meteo APIs as CLI
- Shares data structures via import

**Reusability:**
- weather package already has GetWeatherForCity()
- Types have JSON tags ready

### Documentation Requirements

**User Documentation:**
- API endpoint usage
- Example curl commands
- Response format

**Technical Documentation:**
- Architecture overview
- Error handling

## YOLO Mode Decisions

### Decision 1: Server Port
**Context**: Port number not specified
**Decision Made**: Port 8080
**Rationale**: Standard Go development port, non-privileged
**Alternatives Considered**: 3000, 5000
**Risk**: Low - easily configurable

### Decision 2: CORS Policy
**Context**: CORS needed but policy not detailed
**Decision Made**: Allow all origins (*)
**Rationale**: Backlog mentions "different origin", demo/dev context
**Alternatives Considered**: Whitelist specific origins
**Risk**: Low - acceptable for development

### Decision 3: Error Format
**Context**: Error response format not specified
**Decision Made**: JSON {"error": "message"}
**Rationale**: Consistent with REST API conventions
**Alternatives Considered**: Plain text errors
**Risk**: Low - standard pattern

---

# Design Summary

## Overall Architecture

Simple HTTP server wrapping existing weather package with JSON marshalling and CORS middleware.

## Shared Components

- weather-cli/weather package (zero duplication)
- Go standard library (net/http, encoding/json)

## Design Risks

None - straightforward implementation

## Resource Requirements

- Go 1.21+ (already installed)
- weather-cli/weather package (exists)

## Design Approval Status

✅ Proposed (YOLO mode auto-approved)

## LLM Token Statistics

**Tokens Used**: ~8,000 (FAST mode - 50% of normal)
