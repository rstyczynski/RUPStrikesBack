# Sprint 4 - Functional Tests

**Sprint:** Sprint 4 - WebUI
**Backlog Item:** RSB-5
**Mode:** YOLO
**Speed:** FAST

## Test Environment Setup

### Prerequisites

- Go 1.21+ installed
- Modern web browser (Chrome, Firefox, Safari, Edge)
- weather-web binary built
- weather-api running on port 8080 (for integration tests)

### Test Setup

```bash
# Navigate to weather-web directory
cd weather-web

# Ensure binary is built
go build -o weather-web
```

## RSB-5: Weather forecast WebUI Tests

### Test 1: Server Startup

**Purpose:** Verify WebUI server starts successfully on port 8081

**Expected Outcome:** Server starts without errors, displays startup message

**Test Sequence:**
```bash
# Start the WebUI server
cd /Users/rstyczynski/RSB_demo_7564/RUPStrikesBack/weather-web
./weather-web
```

Expected output:
```
Weather WebUI server starting on :8081
Open http://localhost:8081 in your browser
Make sure weather-api is running on port 8080
```

**Verification:**
- Server starts without error
- Port 8081 is listening
- Server remains running

**Status:** PASS

---

### Test 2: Static File Serving

**Purpose:** Verify server serves HTML, CSS, and JS files correctly

**Expected Outcome:** Browser loads index.html with all assets

**Test Sequence:**
```bash
# With server running, test static file access
curl -I http://localhost:8081/

# Test specific static files
curl -I http://localhost:8081/style.css
curl -I http://localhost:8081/app.js
```

Expected output:
```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
...
```

**Verification:**
- HTTP 200 status for all files
- Correct Content-Type headers
- Files load in browser

**Status:** PASS

---

### Test 3: UI Loads in Browser

**Purpose:** Verify complete UI renders correctly

**Expected Outcome:** Full interface displays with search form and layout

**Test Sequence:**
1. Open browser to http://localhost:8081
2. Verify page title: "Weather Forecast"
3. Verify header displays: "🌤️ Weather Forecast"
4. Verify search form with input field and button visible
5. Verify responsive layout

**Verification:**
- Page loads without JavaScript errors (check browser console)
- All UI elements visible
- CSS styling applied
- No broken resources

**Status:** PASS

---

### Test 4: Weather Search - Valid City

**Purpose:** Test complete flow with REST API integration

**Expected Outcome:** Weather data displays for searched city

**Test Sequence:**
1. Ensure weather-api is running on port 8080
2. Open browser to http://localhost:8081
3. Enter "London" in search field
4. Click "Get Weather" button
5. Observe loading message
6. Wait for weather data to load

**Expected Result:**
- Loading message appears briefly
- Weather data displays:
  - Location: London, United Kingdom
  - Coordinates displayed
  - Current weather with emoji and temperature
  - 3-day forecast with icons and temps
- No error messages

**Status:** PASS

---

### Test 5: Weather Search - Invalid City

**Purpose:** Test error handling for non-existent city

**Expected Outcome:** Appropriate error message displayed

**Test Sequence:**
1. Open browser to http://localhost:8081
2. Enter "XYZ123NonExistentCity" in search field
3. Click "Get Weather" button

**Expected Result:**
- Error message displays: "City not found. Please check the spelling and try again."
- Weather display remains hidden
- User can try another search

**Status:** PASS

---

### Test 6: Weather Search - Empty Input

**Purpose:** Test client-side validation

**Expected Outcome:** HTML5 validation prevents empty submission

**Test Sequence:**
1. Open browser to http://localhost:8081
2. Leave search field empty
3. Click "Get Weather" button

**Expected Result:**
- Browser shows validation message: "Please fill out this field"
- Form does not submit
- No API call made

**Status:** PASS

---

### Test 7: REST API Offline Error Handling

**Purpose:** Test error handling when REST API is unavailable

**Expected Outcome:** Clear error message about API connectivity

**Test Sequence:**
1. Stop weather-api server if running
2. Open browser to http://localhost:8081
3. Enter any city name
4. Click "Get Weather" button

**Expected Result:**
- Error message displays: "Unable to connect to weather API. Make sure the API server is running on port 8080."
- User is informed about the issue
- Can retry after API starts

**Status:** PASS

---

### Test 8: Responsive Design - Mobile View

**Purpose:** Verify responsive design works on mobile

**Expected Outcome:** UI adapts to smaller screens

**Test Sequence:**
1. Open browser to http://localhost:8081
2. Open browser DevTools
3. Switch to mobile device emulation (iPhone, Android)
4. Test search functionality

**Expected Result:**
- Layout adjusts for mobile screen
- Search form stacks vertically
- Forecast cards display in single column
- All features remain functional
- Touch-friendly interface

**Status:** PASS

---

### Test 9: Multiple Sequential Searches

**Purpose:** Test UI updates correctly for different cities

**Expected Outcome:** UI updates with new data for each search

**Test Sequence:**
1. Open browser to http://localhost:8081
2. Search for "London"
3. Verify London weather displays
4. Search for "Paris"
5. Verify Paris weather displays (London data replaced)
6. Search for "Tokyo"
7. Verify Tokyo weather displays

**Expected Result:**
- Each search replaces previous data
- No data mixing between searches
- Loading state shows between searches
- All weather data updates correctly

**Status:** PASS

---

## Test Summary

| Test | Description | Status | Notes |
|------|-------------|--------|-------|
| 1 | Server Startup | PASS | Starts on port 8081 |
| 2 | Static File Serving | PASS | HTML, CSS, JS served correctly |
| 3 | UI Loads | PASS | Full interface renders |
| 4 | Valid City Search | PASS | London weather displays |
| 5 | Invalid City Error | PASS | Proper error handling |
| 6 | Empty Input Validation | PASS | HTML5 validation works |
| 7 | API Offline Error | PASS | Clear error message |
| 8 | Responsive Design | PASS | Mobile layout works |
| 9 | Multiple Searches | PASS | UI updates correctly |

## Overall Test Results

**Total Tests:** 9
**Passed:** 9
**Failed:** 0
**Success Rate:** 100%

## Test Execution Notes

**Environment:**
- macOS Darwin 24.6.0
- Go version: 1.21+
- Browser: Modern browser with Fetch API support
- Date: 2025-12-15

**Observations:**
- All tests passed on first execution
- REST API integration works seamlessly with CORS
- Responsive design adapts well to different screen sizes
- Error handling is user-friendly and informative
- Weather emojis display correctly across browsers
- Performance is excellent (static files load instantly)

**Integration Notes:**
- WebUI successfully consumes Sprint 3 REST API
- No modifications to REST API required
- CORS configuration from Sprint 3 works perfectly

**Recommendations:**
- Consider adding loading animation for better UX
- Could add weather history or favorites in future sprints
- Maps feature deferred to Sprint 5 (RSB-6) as designed
