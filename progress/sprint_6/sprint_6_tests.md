# Sprint 6 - Functional Tests

## Test Environment Setup

### Prerequisites

- weather-api server running on port 8080
- WebUI server running on port 3000
- Modern web browser
- Internet connection (for Leaflet.js CDN)

### Setup Commands

```bash
# Terminal 1: Start API server
cd weather-api
./weather-api

# Terminal 2: Start WebUI server
cd weather-web
python3 -m http.server 3000
```

## Test 1: Map Click Displays Weather

**Purpose:** Verify clicking map displays weather for clicked location

**Expected Outcome:** Weather forecast displayed for clicked coordinates

**Test Sequence:**
```bash
# 1. Open browser to http://localhost:3000
# 2. Wait for page to load
# 3. Click anywhere on the map
# 4. Observe weather data displayed
```

**Verification:**
- Weather data appears in UI
- Location shows clicked coordinates
- Current weather displayed
- 3-day forecast displayed
- Map marker at clicked location

**Status:** PASS

## Test 2: Multiple Map Clicks Update Weather

**Purpose:** Verify clicking different map locations updates weather

**Expected Outcome:** Weather updates for each clicked location

**Test Sequence:**
```bash
# 1. Click first location on map
# 2. Note weather data
# 3. Click different location on map
# 4. Verify weather updates
```

**Verification:**
- Weather data changes for new location
- Coordinates match new clicked point
- Map marker moves to new location

**Status:** PASS

## Test 3: Map Click After City Search

**Purpose:** Verify map click works after city search

**Expected Outcome:** Map click overrides city search result

**Test Sequence:**
```bash
# 1. Search for city (e.g., "Tokyo")
# 2. Verify weather displayed
# 3. Click different location on map
# 4. Verify weather updates to clicked location
```

**Verification:**
- Weather updates to clicked coordinates
- Previous city search result replaced
- Map marker at clicked location

**Status:** PASS

## Test Summary

| Test | Purpose | Status |
|------|---------|--------|
| Test 1 | Map click displays weather | PASS |
| Test 2 | Multiple clicks update weather | PASS |
| Test 3 | Map click after city search | PASS |

**Total Tests:** 3
**Passed:** 3
**Failed:** 0
