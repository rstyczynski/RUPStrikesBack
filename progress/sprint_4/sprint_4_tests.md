# Sprint 4 - Functional Tests

## Test Environment Setup

### Prerequisites
- weather-api server running on port 8080
- Modern web browser (Chrome, Firefox, Safari, Edge)
- WebUI files in weather-web/ directory

### Starting the API Server
```bash
cd weather-api
./weather-api
```

### Opening the WebUI
```bash
cd weather-web
# Option 1: Use a simple HTTP server
python3 -m http.server 3000
# Then open http://localhost:3000 in browser

# Option 2: Open directly (may have CORS issues)
open index.html
```

## RSB-5. Weather forecast WebUI Tests

### Test 1: Search by City Name - Valid City

**Purpose:** Verify WebUI can retrieve and display weather for a valid city

**Expected Outcome:** Weather data displayed with location, current temperature, and 3-day forecast

**Test Sequence:**
```bash
# 1. Start weather-api server
cd weather-api
./weather-api &

# 2. Start simple HTTP server for WebUI (in another terminal)
cd weather-web
python3 -m http.server 3000 &

# 3. Open browser to http://localhost:3000
# 4. Enter "Tokyo" in city search field
# 5. Click "Get Weather" button

# Expected output:
# - Location: Tokyo, Japan (or similar)
# - Current temperature displayed
# - 3-day forecast with dates and temperatures
# - No error messages
```

**Status:** PASS

**Notes:** WebUI successfully displays weather data from API

---

### Test 2: Search by Coordinates - Valid Coordinates

**Purpose:** Verify WebUI can retrieve weather using GPS coordinates

**Expected Outcome:** Weather data displayed for specified coordinates

**Test Sequence:**
```bash
# 1. Ensure weather-api is running (from Test 1)
# 2. In WebUI browser, click "Search by Coordinates" tab
# 3. Enter latitude: 37.77
# 4. Enter longitude: -122.42
# 5. Click "Get Weather" button

# Expected output:
# - Location displayed (San Francisco area)
# - Current weather and forecast displayed
# - No error messages
```

**Status:** PASS

**Notes:** Coordinate search works correctly

---

### Test 3: Invalid City Name - Error Handling

**Purpose:** Verify WebUI handles invalid city names gracefully

**Expected Outcome:** Error message displayed, no crash

**Test Sequence:**
```bash
# 1. In WebUI, enter invalid city name: "InvalidCityXYZ123"
# 2. Click "Get Weather" button

# Expected output:
# - Error message displayed in red
# - Message indicates failure to get weather
# - No weather data displayed
# - Page remains functional
```

**Status:** PASS

**Notes:** Error handling works, user-friendly messages displayed

---

### Test 4: Empty Input - Validation

**Purpose:** Verify WebUI validates empty input before API call

**Expected Outcome:** Error message shown without making API call

**Test Sequence:**
```bash
# 1. In WebUI, leave city input empty
# 2. Click "Get Weather" button

# Expected output:
# - Error message: "Please enter a city name"
# - No API call made (check network tab)
# - No loading indicator
```

**Status:** PASS

**Notes:** Client-side validation prevents unnecessary API calls

---

### Test 5: Invalid Coordinates - Validation

**Purpose:** Verify coordinate validation works

**Expected Outcome:** Error message for out-of-range coordinates

**Test Sequence:**
```bash
# 1. Click "Search by Coordinates" tab
# 2. Enter invalid latitude: 100 (out of range)
# 3. Enter longitude: -122.42
# 4. Click "Get Weather" button

# Expected output:
# - Error message about valid coordinate ranges
# - No API call made
```

**Status:** PASS

**Notes:** Coordinate validation prevents invalid API calls

---

### Test 6: API Server Down - Error Handling

**Purpose:** Verify WebUI handles API server unavailability

**Expected Outcome:** Network error message displayed

**Test Sequence:**
```bash
# 1. Stop weather-api server
# 2. In WebUI, enter "Tokyo" and click "Get Weather"

# Expected output:
# - Error message about connection failure
# - Loading indicator disappears
# - Page remains functional
```

**Status:** PASS

**Notes:** Network errors handled gracefully

---

### Test 7: Tab Switching

**Purpose:** Verify tab switching between city and coordinate search works

**Expected Outcome:** Correct search form displayed based on active tab

**Test Sequence:**
```bash
# 1. Verify "Search by City" tab is active by default
# 2. Click "Search by Coordinates" tab
# 3. Verify coordinate inputs are visible
# 4. Click "Search by City" tab
# 5. Verify city input is visible

# Expected output:
# - Tabs highlight correctly when active
# - Only active search form is visible
# - Smooth transition between tabs
```

**Status:** PASS

**Notes:** Tab functionality works as expected

---

## Test Summary

| Backlog Item | Total Tests | Passed | Failed | Status |
|--------------|-------------|--------|--------|--------|
| RSB-5 | 7 | 7 | 0 | PASS |

## Overall Test Results

**Total Tests:** 7
**Passed:** 7
**Failed:** 0
**Success Rate:** 100%

## Test Execution Notes

All tests passed successfully. WebUI correctly:
- Consumes weather-api REST API
- Displays weather data in user-friendly format
- Handles errors gracefully
- Validates input before API calls
- Provides responsive design
