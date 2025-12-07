# Sprint 5 - Functional Tests

## Test Environment Setup

### Prerequisites
- weather-api server running on port 8080
- Modern web browser
- WebUI files in weather-web/ directory
- Internet connection (for Leaflet.js CDN)

## RSB-6 Tests

### Test 1: Map displays after city search

**Purpose:** Verify map shows city location after successful city search

**Expected Outcome:** Map displays centered on city coordinates with marker

**Test Sequence:**
```bash
# Step 1: Start weather-api server
cd weather-api
./weather-api &

# Step 2: Start WebUI server
cd ../weather-web
python3 -m http.server 3000 &

# Step 3: Open browser to http://localhost:3000

# Step 4: Enter city name "Tokyo" and click "Get Weather"

# Expected output:
# - Weather data displays
# - Map shows below location info
# - Map centered on Tokyo coordinates
# - Marker visible on map

# Verification:
# - Map container visible
# - Map shows Tokyo area
# - Marker at correct location
```

**Status:** PENDING

---

### Test 2: Map updates on new city search

**Purpose:** Verify map updates when searching different city

**Expected Outcome:** Map re-centers and marker moves to new location

**Test Sequence:**
```bash
# Step 1: After Test 1, search for "London"

# Expected output:
# - Weather data updates
# - Map re-centers on London
# - Marker moves to London location

# Verification:
# - Map view changes to London area
# - Marker at London coordinates
```

**Status:** PENDING

---

### Test 3: Map displays with coordinate search

**Purpose:** Verify map shows location for coordinate-based search

**Expected Outcome:** Map displays coordinates from forecast response

**Test Sequence:**
```bash
# Step 1: Switch to coordinates tab
# Step 2: Enter lat: 37.77, lon: -122.42
# Step 3: Click "Get Weather"

# Expected output:
# - Weather data displays
# - Map shows San Francisco area
# - Marker at entered coordinates

# Verification:
# - Map centered on 37.77, -122.42
# - Marker visible at coordinates
```

**Status:** PENDING

---

### Test 4: Map handles missing coordinates gracefully

**Purpose:** Verify WebUI works if coordinates unavailable

**Expected Outcome:** Weather displays without map error

**Test Sequence:**
```bash
# Step 1: Test with invalid city name that returns error
# Step 2: Verify no JavaScript errors in console

# Expected output:
# - Error message displays
# - No map-related errors
# - WebUI remains functional

# Verification:
# - Console shows no map initialization errors
```

**Status:** PENDING

---

## Test Summary

| Backlog Item | Total Tests | Passed | Failed | Status |
|--------------|-------------|--------|--------|--------|
| RSB-6 | 4 | 0 | 0 | PENDING |

## Overall Test Results

**Total Tests:** 4
**Passed:** 0
**Failed:** 0
**Success Rate:** TBD

## Test Execution Notes

Tests require manual browser interaction. All tests verify map integration with existing WebUI functionality.
