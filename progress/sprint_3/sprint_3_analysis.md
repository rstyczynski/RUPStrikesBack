# Sprint 3 - Analysis

Status: Complete

## Sprint Overview
Sprint 3 delivers a REST API exposing weather forecast data in JSON with CORS enabled for future WebUI consumption. The API is a separate process/binary (./weather-api) reusing the existing weather retrieval logic from the CLI module.

## Backlog Items Analysis

### RSB-4. Weather forecast exposes REST API

**Requirement Summary:**
- Provide a RESTful API to return:
  - Geocoded location for a given city
  - Current weather and 3‑day forecast
- JSON output
- CORS enabled (WebUI will call from different origin)
- Codebase organization: new ./weather-api component following ./weather-cli approach

**Technical Approach:**
- New Go module: ./weather-api
- HTTP server using net/http
- Endpoint: GET /weather?city={city}
  - Reuse weather-cli/weather:
    - GeocodeCity(city) -> Location
    - GetForecast(lat, lon) -> ForecastResponse
  - Response JSON structure:
    {
      "location": { name, latitude, longitude, country, admin1 },
      "forecast": { ...ForecastResponse... }
    }
- CORS: allow cross-origin requests (simple Access-Control-Allow-Origin: *)
- Port: 8080 (conventional; configurable via env var later if needed)
- Module integration:
  - Import weather-cli/weather
  - Use go.mod replace in weather-api to point to ../weather-cli during local dev

**Dependencies:**
- Internal: weather-cli module (types.go, api.go, client.go)
- External: Open-Meteo Geocoding and Forecast APIs
- Network access required

**Testing Strategy:**
- Functional tests (copy-paste-able):
  - curl "http://localhost:8080/weather?city=Berlin" → 200 JSON with location+forecast
  - curl "http://localhost:8080/weather?city=NoSuchCityXYZ" → 404 JSON error
  - curl without city → 400 JSON error
- Negative/network tests:
  - Simulate Open-Meteo failures (document behavior)
- CORS verification:
  - Check response headers include Access-Control-Allow-Origin: *

**Risks/Concerns:**
- Network timeouts/rate limits from Open-Meteo
- Ambiguity in city names (we return first match as in CLI)
- CORS policy may need tightening for production

**Compatibility Notes:**
- Reuse existing types (ForecastResponse, Location) to keep consistency with CLI
- No change required in weather-cli code
- Keep output stable for future WebUI consumption

## Overall Sprint Assessment

**Feasibility:** High  
Rationale: All building blocks exist in weather-cli; REST exposure is straightforward in Go.

**Estimated Complexity:** Moderate  
Rationale: New server module + wiring + tests + CORS headers.

**Prerequisites Met:** Yes  
Go toolchain present; CLI code provides reusable API client and types.

**Open Questions:**
None blocking for design. Default port = 8080, permissive CORS for now.

## Recommended Design Focus Areas
- Clear handler contract and error model (400 for missing city, 404 for not found, 502 for upstream errors)
- CORS middleware/header injection
- Module linkage with replace directive for local development

## Readiness for Design Phase
Confirmed Ready
