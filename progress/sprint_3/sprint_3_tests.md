# Sprint 3 - Functional Tests

**Sprint:** Sprint 3 - REST API
**Backlog Item:** RSB-4
**Date:** 2025-12-15
**Mode:** YOLO (autonomous)

## Test Environment Setup

### Prerequisites

- Go 1.21+ installed
- weather-api binary built (`cd weather-api && go build`)
- Network access to Open-Meteo API
- Port 8080 available

## RSB-4: Weather API Tests

### Test 1: Successful Weather Request

**Purpose:** Validate API returns weather data for valid city

**Expected Outcome:** 200 OK with JSON containing location and forecast

**Test Sequence:**

```bash
# Step 1: Start the API server in background
cd weather-api && ./weather-api &
API_PID=$!
sleep 2

# Step 2: Request weather for London
curl -s 'http://localhost:8080/weather?city=London'

# Expected output: JSON with location and forecast data
# {"location":{"name":"London",...},"forecast":{...}}

# Step 3: Stop server
kill $API_PID
```

**Status:** ✅ PASS

---

### Test 2: Missing City Parameter

**Purpose:** Validate error handling when city parameter is missing

**Expected Outcome:** 400 Bad Request with error message

**Test Sequence:**

```bash
# Step 1: Start server
cd weather-api && ./weather-api &
API_PID=$!
sleep 2

# Step 2: Request without city parameter
curl -s 'http://localhost:8080/weather'

# Expected output: {"error":"city parameter required"}

# Step 3: Stop server
kill $API_PID
```

**Status:** ✅ PASS

**Result:** Returned `{"error":"city parameter required"}` as expected

---

### Test 3: Invalid City Name

**Purpose:** Validate error handling for non-existent city

**Expected Outcome:** 404 Not Found with error message

**Test Sequence:**

```bash
# Step 1: Start server
cd weather-api && ./weather-api &
API_PID=$!
sleep 2

# Step 2: Request invalid city
curl -s 'http://localhost:8080/weather?city=XYZInvalidCity123'

# Expected output: {"error":"city not found"}

# Step 3: Stop server
kill $API_PID
```

**Status:** ✅ PASS

**Result:** Returned `{"error":"city not found"}` as expected

---

### Test 4: CORS Headers Validation

**Purpose:** Validate CORS headers are present in response

**Expected Outcome:** Response includes CORS headers

**Test Sequence:**

```bash
# Step 1: Start server
cd weather-api && ./weather-api &
API_PID=$!
sleep 2

# Step 2: Check headers with verbose curl
curl -v 'http://localhost:8080/weather?city=Paris' 2>&1 | grep -i "access-control"

# Expected output:
# < Access-Control-Allow-Origin: *
# < Access-Control-Allow-Methods: GET, OPTIONS

# Step 3: Stop server
kill $API_PID
```

**Status:** ✅ PASS

**Result:** All CORS headers present (Allow-Origin: *, Allow-Methods, Allow-Headers)

---

### Test 5: Multiple Cities

**Purpose:** Validate API handles different cities correctly

**Expected Outcome:** Each city returns appropriate data

**Test Sequence:**

```bash
# Start server
cd weather-api && ./weather-api &
API_PID=$!
sleep 2

# Test multiple cities
curl -s 'http://localhost:8080/weather?city=Tokyo' | grep -q Tokyo && echo "Tokyo: PASS"
curl -s 'http://localhost:8080/weather?city=Berlin' | grep -q Berlin && echo "Berlin: PASS"
curl -s 'http://localhost:8080/weather?city=Paris' | grep -q Paris && echo "Paris: PASS"

# Stop server
kill $API_PID
```

**Status:** ✅ PASS

**Result:** All three cities returned correct data

---

## Test Execution Summary

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Successful Weather Request | ✅ PASS | Core functionality working |
| 2 | Missing City Parameter | ✅ PASS | Error handling correct |
| 3 | Invalid City Name | ✅ PASS | 404 error returned |
| 4 | CORS Headers | ✅ PASS | All CORS headers present |
| 5 | Multiple Cities | ✅ PASS | Multiple cities work |

**Total Tests:** 5
**Passed:** 5
**Failed:** 0
**Pending:** 0

✅ **All tests passed successfully**

## Test Execution Date

**Executed:** 2025-12-15
**Environment:** macOS with Go 1.21+
**API Version:** weather-api v1.0.0
