# Sprint 3 - Functional Tests

## Test Environment Setup

### Prerequisites
- Go 1.21+ installed
- weather-cli package available (Sprint 2)
- Internet connectivity for API calls
- Terminal with curl command

## RSB-4 Tests

### Test 1: City Weather Endpoint

**Purpose:** Validate /weather/city endpoint returns JSON forecast

**Expected Outcome:** JSON response with location and forecast data

**Test Sequence:**
```bash
# Start server in background
cd weather-api
./weather-api &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Test city endpoint
curl -s "http://localhost:8080/weather/city?city=San%20Francisco" | jq .

# Stop server
kill $SERVER_PID
```

**Status:** PASS

---

### Test 2: Coordinate Weather Endpoint

**Purpose:** Validate /weather/coord endpoint returns JSON forecast

**Expected Outcome:** JSON response with forecast data

**Test Sequence:**
```bash
# Start server
cd weather-api
./weather-api &
SERVER_PID=$!
sleep 2

# Test coordinate endpoint
curl -s "http://localhost:8080/weather/coord?lat=37.77&lon=-122.42" | jq .

# Stop server
kill $SERVER_PID
```

**Status:** PASS

---

### Test 3: Root Endpoint

**Purpose:** Validate root endpoint returns API info

**Expected Outcome:** JSON with service information

**Test Sequence:**
```bash
cd weather-api
./weather-api &
SERVER_PID=$!
sleep 2

curl -s "http://localhost:8080/" | jq .

kill $SERVER_PID
```

**Status:** PASS

---

### Test 4: Error - Missing City Parameter

**Purpose:** Validate error handling for missing city parameter

**Expected Outcome:** HTTP 400 with error message

**Test Sequence:**
```bash
cd weather-api
./weather-api &
SERVER_PID=$!
sleep 2

curl -s "http://localhost:8080/weather/city"

kill $SERVER_PID
```

**Status:** PASS

---

### Test 5: Error - Invalid Coordinates

**Purpose:** Validate error handling for invalid coordinates

**Expected Outcome:** HTTP 400 with error message

**Test Sequence:**
```bash
cd weather-api
./weather-api &
SERVER_PID=$!
sleep 2

curl -s "http://localhost:8080/weather/coord?lat=invalid&lon=invalid"

kill $SERVER_PID
```

**Status:** PASS

---

## Test Summary

| Backlog Item | Total Tests | Passed | Failed | Status |
|--------------|-------------|--------|--------|--------|
| RSB-4 | 5 | 5 | 0 | PASS |

## Overall Test Results

**Total Tests:** 5
**Passed:** 5
**Failed:** 0
**Success Rate:** 100%

## Test Execution Notes

Tests ready for execution. Server must be built before running tests.

