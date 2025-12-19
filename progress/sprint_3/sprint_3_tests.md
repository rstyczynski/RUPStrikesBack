# Sprint 3 - Functional Tests

## Test Environment Setup

### Prerequisites
- Go 1.21+
- Internet access (calls Open-Meteo APIs)
- jq installed (for JSON inspection)
- This repository checked out locally

### Start/Stop Helper (inline commands)
Tests below start the server in the background, run requests, then stop it.

## RSB-4 Tests — Weather forecast exposes REST API

### Test 1: Happy path — GET /weather?city=Berlin

**Purpose:** Verify endpoint returns location+forecast for a valid city

**Expected Outcome:** HTTP 200; JSON includes .location.name == "Berlin" and .forecast fields

**Test Sequence:**
```bash
# Build and run the server in background
cd weather-api
go build -o weather-api .
./weather-api & SERVER_PID=$!
sleep 3

# Call endpoint and check basics
HTTP_CODE=$(curl -s -o response.json -w "%{http_code}" "http://localhost:8080/weather?city=Berlin")
echo "HTTP_CODE=$HTTP_CODE"
cat response.json | jq '.location.name, .forecast.current.temperature_2m, .forecast.daily.time' | head -n 10

# Stop server
kill $SERVER_PID
cd ..

# Verification:
# - Expect HTTP_CODE=200
# - response.json should contain "location", "forecast", etc.
```

**Status:** PENDING

---

### Test 2: Missing city — GET /weather (no query)

**Purpose:** Validate 400 Bad Request when city is missing

**Expected Outcome:** HTTP 400; error JSON with message about missing city

**Test Sequence:**
```bash
cd weather-api
./weather-api & SERVER_PID=$!
sleep 3

# Call without city
curl -i -s "http://localhost:8080/weather" | head -n 1

# Stop server
kill $SERVER_PID
cd ..

# Verification:
# - First status line should be "HTTP/1.1 400 Bad Request"
```

**Status:** PENDING

---

### Test 3: City not found — GET /weather?city=NoSuchCityXYZ

**Purpose:** Validate 404 Not Found when city cannot be geocoded

**Expected Outcome:** HTTP 404; error JSON mentioning "city not found"

**Test Sequence:**
```bash
cd weather-api
./weather-api & SERVER_PID=$!
sleep 3

# Call with non-existing city
curl -i -s "http://localhost:8080/weather?city=NoSuchCityXYZ" | head -n 1

# Stop server
kill $SERVER_PID
cd ..

# Verification:
# - First status line should be "HTTP/1.1 404 Not Found"
```

**Status:** PENDING

---

### Test 4: CORS header present

**Purpose:** Validate CORS is enabled

**Expected Outcome:** Response includes "Access-Control-Allow-Origin: *"

**Test Sequence:**
```bash
cd weather-api
./weather-api & SERVER_PID=$!
sleep 3

# Check headers for CORS
curl -i -s "http://localhost:8080/weather?city=Berlin" | grep -i "^Access-Control-Allow-Origin:"

# Stop server
kill $SERVER_PID
cd ..

# Verification:
# - Output should be exactly: Access-Control-Allow-Origin: *
```

**Status:** PENDING

---

## Test Summary

| Backlog Item | Total Tests | Passed | Failed | Status  |
|--------------|-------------|--------|--------|---------|
| RSB-4        | 4           | 0      | 0      | PENDING |

## Overall Test Results

**Total Tests:** 4  
**Passed:** 0  
**Failed:** 0  
**Success Rate:** 0%

## Test Execution Notes

- Network failures or upstream API issues may cause transient errors; re-run if necessary.
- Server startup uses a simple sleep. If running on a slow machine, increase sleep duration slightly.
