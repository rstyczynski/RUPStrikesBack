# Sprint 3 - Functional Tests

## Test Environment Setup

### Prerequisites
- Go 1.21+
- Network access

## RSB-4 Tests

### Test 1: Health endpoint

**Purpose:** Verify service is up

**Expected Outcome:** 200 {"status":"ok"}

**Test Sequence:**
```bash
# Run server in one terminal
(cd weather-api/cmd/server && go run . &)
SERVER_PID=$!
sleep 2
# Health check
curl -s -i http://localhost:8080/health
kill $SERVER_PID
```

**Status:** PENDING

---

### Test 2: Weather by city

**Purpose:** Verify city query returns forecast and location

**Expected Outcome:** JSON with location.name and forecast.current

**Test Sequence:**
```bash
(cd weather-api/cmd/server && go run . &)
SERVER_PID=$!
sleep 2
curl -s "http://localhost:8080/v1/weather?city=London" | jq '.location.name, .forecast.current.temperature_2m'
kill $SERVER_PID
```

**Status:** PENDING

---

### Test 3: Weather by coordinates

**Purpose:** Verify lat/lon query returns forecast

**Expected Outcome:** JSON with forecast.current

**Test Sequence:**
```bash
(cd weather-api/cmd/server && go run . &)
SERVER_PID=$!
sleep 2
curl -s "http://localhost:8080/v1/weather?lat=52.52&lon=13.405" | jq '.forecast.current.temperature_2m'
kill $SERVER_PID
```

**Status:** PENDING

---

## Test Summary

| Backlog Item | Total Tests | Passed | Failed | Status |
|--------------|-------------|--------|--------|--------|
| RSB-4        | 3           | 0      | 0      | pending |

## Overall Test Results

**Total Tests:** 3
**Passed:** 0
**Failed:** 0
**Success Rate:** 0%

## Test Execution Notes
Pending execution
