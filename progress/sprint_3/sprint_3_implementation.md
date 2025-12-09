# Sprint 3 - Implementation Notes

## Implementation Overview

**Sprint Status:** under_construction

**Backlog Items:**
- RSB-4: under_construction

## RSB-4. REST API

Status: under_construction

### Implementation Summary
- New weather-api module with server exposing /health and /v1/weather (city or coordinates)
- CORS enabled with Access-Control-Allow-Origin: *

### Main Features
- Health check
- Forecast by city
- Forecast by coordinates

### Design Compliance
Matches approved design

### Code Artifacts

| Artifact | Purpose | Status | Tested |
|----------|---------|--------|--------|
| weather-api/cmd/server/main.go | Service entrypoint | Complete | Pending |
| weather-api/internal/server/server.go | HTTP handlers | Complete | Pending |
| weather-api/go.mod | Module config | Complete | N/A |

### Testing Results

**Functional Tests:** 0 / 3
**Edge Cases:** 0 / 2
**Overall:** PENDING

### Known Issues
None

### User Documentation

#### Overview
Simple REST API around weather package.

#### Prerequisites
- Go 1.21+

#### Usage

**Basic Usage:**
```bash
(cd weather-api/cmd/server && go run .)
```

**Examples:**

Example 1: Health
```bash
curl -s http://localhost:8080/health
```

Expected output:
```
{"status":"ok"}
```

Example 2: City query
```bash
curl -s "http://localhost:8080/v1/weather?city=London" | jq '.'
```

Example 3: Coordinates query
```bash
curl -s "http://localhost:8080/v1/weather?lat=52.52&lon=13.405" | jq '.'
```

#### Special Notes
- CORS header present for GET responses
