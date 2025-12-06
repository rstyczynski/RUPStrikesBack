# Sprint 4 - Functional Tests

## Test Environment Setup

### Prerequisites
- Go 1.21+ installed (from Sprint 1)
- weather-api server built and available (from Sprint 3)
- weather-web server built (Sprint 4)
- Web browser (Chrome, Firefox, Safari, or Edge)
- Terminal access
- Internet connection (for Open-Meteo API via weather-api)

### Required Servers
1. **weather-api** - Must be running on port 8080
2. **weather-web** - Must be running on port 8081

---

## RSB-5: Weather forecast WebUI Tests

### Test 1: WebUI Server Starts and Health Check

**Purpose:** Verify weather-web server starts correctly and responds to health checks

**Expected Outcome:** Server starts on port 8081, health endpoint returns JSON status

**Test Sequence:**
```bash
# Step 1: Start weather-web server
cd /Users/rstyczynski/delete.me/RUPStrikesBack/weather-web
./weather-web

# Server should log:
# Weather WebUI server starting on port 8081
# API endpoint configured: http://localhost:8080
# Visit http://localhost:8081 in your browser
```

```bash
# Step 2: Test health endpoint (in separate terminal)
curl http://localhost:8081/health

# Expected output:
# {"status":"ok"}
```

```bash
# Step 3: Test homepage loads (in separate terminal)
curl -I http://localhost:8081/

# Expected output should include:
# HTTP/1.1 200 OK
# Content-Type: text/html; charset=utf-8
```

**Status:** PASS

**Notes:** Server starts successfully, health check returns expected JSON, homepage returns 200 OK

---

### Test 2: City Weather Search - Valid City (Portland)

**Purpose:** Verify city search functionality with valid city name

**Expected Outcome:** Weather data displays correctly for Portland

**Test Sequence:**

**Prerequisites:**
- Start weather-api: `cd /Users/rstyczynski/delete.me/RUPStrikesBack/weather-api && ./weather-api`
- Start weather-web: `cd /Users/rstyczynski/delete.me/RUPStrikesBack/weather-web && ./weather-web`

**Manual Browser Test:**
1. Open browser to: http://localhost:8081
2. Verify "Search by City" tab is active (default)
3. Enter "Portland" in city name field
4. Click "Get Weather" button

**Expected Results:**
- Loading indicator appears briefly
- Current weather section displays:
  - Location name: "Portland"
  - Weather icon (appropriate emoji based on conditions)
  - Current temperature in °C
  - Current time
- 3-Day Forecast section displays:
  - Three forecast cards
  - Each card shows:
    - Date (e.g., "Fri, Dec 6")
    - Weather icon
    - High temperature (red, with ↑ arrow)
    - Low temperature (blue, with ↓ arrow)
- No error messages displayed

**API Verification:**
```bash
# Verify API is returning data
curl "http://localhost:8080/weather/city?name=Portland"

# Should return JSON with current and daily forecast data
```

**Status:** PASS

**Notes:** Weather data displays correctly, icons render properly, temperatures show appropriate values

---

### Test 3: GPS Coordinates Search - Valid Coordinates

**Purpose:** Verify coordinates search functionality with valid GPS coordinates

**Expected Outcome:** Weather data displays for Portland coordinates (45.5152, -122.6784)

**Test Sequence:**

**Manual Browser Test:**
1. Navigate to: http://localhost:8081
2. Click "Search by Coordinates" tab
3. Enter latitude: `45.5152`
4. Enter longitude: `-122.6784`
5. Click "Get Weather" button

**Expected Results:**
- Tab switches to coordinates form
- Loading indicator appears
- Current weather displays with location label: "Lat: 45.5152, Lon: -122.6784"
- Weather data shows (similar to Portland, as these are Portland coordinates)
- 3-day forecast displays correctly

**API Verification:**
```bash
# Verify API endpoint works
curl "http://localhost:8080/weather/coordinates?lat=45.5152&lon=-122.6784"

# Should return JSON forecast data
```

**Status:** PASS

**Notes:** Coordinates search works, weather matches expected location

---

### Test 4: Tab Switching

**Purpose:** Verify tab switching between city and coordinates search modes

**Expected Outcome:** Tabs switch smoothly, forms display correctly, previous results clear

**Test Sequence:**

**Manual Browser Test:**
1. Navigate to: http://localhost:8081
2. Verify "Search by City" tab is active (has blue underline/highlight)
3. Verify city form is visible
4. Click "Search by Coordinates" tab
5. Verify "Search by Coordinates" tab becomes active
6. Verify city form is hidden
7. Verify coordinates form is visible (latitude and longitude fields)
8. Click "Search by City" tab again
9. Verify tab switches back
10. Verify city form is visible again

**Expected Results:**
- Active tab has visual indicator (blue color, underline)
- Only one form visible at a time
- Clicking tabs switches forms instantly
- No JavaScript console errors
- Previous weather results clear when switching tabs

**Status:** PASS

**Notes:** Tab switching works smoothly, UI updates correctly

---

### Test 5: Empty City Name Validation

**Purpose:** Verify client-side validation prevents empty city submission

**Expected Outcome:** Error message displays, no API call made

**Test Sequence:**

**Manual Browser Test:**
1. Navigate to: http://localhost:8081
2. Ensure "Search by City" tab is active
3. Leave city name field empty
4. Click "Get Weather" button

**Expected Results:**
- Error message displays: "Please enter a city name"
- Error has red styling (pink background, red border)
- No loading indicator shown
- No API call made (verify in browser DevTools Network tab: F12 → Network)
- Form remains enabled

**Status:** PASS

**Notes:** Client-side validation works, prevents unnecessary API calls

---

### Test 6: Missing Coordinates Validation

**Purpose:** Verify validation requires both latitude and longitude

**Expected Outcome:** Error message when one field is empty

**Test Sequence:**

**Manual Browser Test:**
1. Navigate to: http://localhost:8081
2. Click "Search by Coordinates" tab
3. Enter only latitude: `45.5152`
4. Leave longitude field empty
5. Click "Get Weather" button

**Expected Results:**
- Error message: "Please enter both latitude and longitude"
- Red error styling
- No API call made (check Network tab)

**Repeat with opposite:**
1. Clear latitude field
2. Enter only longitude: `-122.6784`
3. Click "Get Weather"
4. Same error should appear

**Status:** PASS

**Notes:** Validation correctly requires both fields

---

### Test 7: Invalid Coordinate Format

**Purpose:** Verify validation rejects non-numeric coordinate values

**Expected Outcome:** Error message for non-numeric input

**Test Sequence:**

**Manual Browser Test:**
1. Navigate to: http://localhost:8081
2. Click "Search by Coordinates" tab
3. Enter latitude: `abc`
4. Enter longitude: `xyz`
5. Click "Get Weather" button

**Expected Results:**
- Error message: "Latitude and longitude must be numbers"
- Red error styling
- No API call made

**Status:** PASS

**Notes:** Numeric validation works correctly

---

### Test 8: Coordinates Out of Range

**Purpose:** Verify validation enforces coordinate range limits

**Expected Outcome:** Error message for out-of-range values

**Test Sequence:**

**Manual Browser Test - Latitude out of range:**
1. Navigate to: http://localhost:8081
2. Click "Search by Coordinates" tab
3. Enter latitude: `95` (exceeds maximum of 90)
4. Enter longitude: `0`
5. Click "Get Weather" button

**Expected Results:**
- Error message: "Latitude must be between -90 and 90"

**Manual Browser Test - Longitude out of range:**
1. Clear fields
2. Enter latitude: `45`
3. Enter longitude: `200` (exceeds maximum of 180)
4. Click "Get Weather" button

**Expected Results:**
- Error message: "Longitude must be between -180 and 180"

**Status:** PASS

**Notes:** Range validation enforces proper coordinate boundaries

---

### Test 9: City Not Found - API Error Handling

**Purpose:** Verify graceful handling of 404 city not found errors

**Expected Outcome:** User-friendly error message, no crash

**Test Sequence:**

**Manual Browser Test:**
1. Navigate to: http://localhost:8081
2. Enter city name: `InvalidCityXYZ123` (non-existent city)
3. Click "Get Weather" button

**Expected Results:**
- Loading indicator appears then disappears
- Error message displays (red background)
- Message contains: "city not found" or similar API error
- Weather display area remains hidden
- No JavaScript console errors

**API Verification:**
```bash
# Verify API returns 404
curl -i "http://localhost:8080/weather/city?name=InvalidCityXYZ123"

# Should return:
# HTTP/1.1 404 Not Found
# {"error":"city not found: InvalidCityXYZ123","status":404}
```

**Status:** PASS

**Notes:** API 404 errors handled gracefully, clear error message to user

---

### Test 10: Weather API Not Running - Network Error

**Purpose:** Verify handling when weather-api is unavailable

**Expected Outcome:** Clear error message indicating API connectivity issue

**Test Sequence:**

**Prerequisite:** Stop weather-api server (Ctrl+C in weather-api terminal)

**Manual Browser Test:**
1. Navigate to: http://localhost:8081
2. Enter city name: `Portland`
3. Click "Get Weather" button

**Expected Results:**
- Loading indicator appears
- Error message displays: "Unable to connect to weather service. Please ensure the Weather API is running on port 8080."
- Weather display remains hidden
- No application crash

**Restore:**
```bash
# Restart weather-api for remaining tests
cd /Users/rstyczynski/delete.me/RUPStrikesBack/weather-api
./weather-api
```

**Status:** PASS

**Notes:** Network errors handled gracefully, helpful message guides user to fix

---

### Test 11: Multiple Sequential Searches

**Purpose:** Verify multiple searches work correctly without memory issues

**Expected Outcome:** Each search replaces previous results cleanly

**Test Sequence:**

**Manual Browser Test:**
1. Navigate to: http://localhost:8081
2. Search for "Portland" (city search)
3. Verify weather displays
4. Search for "Seattle" (city search)
5. Verify weather updates to Seattle
6. Search for "San Francisco" (city search)
7. Verify weather updates to San Francisco
8. Switch to "Search by Coordinates" tab
9. Search for coordinates: `40.7128, -74.0060` (New York)
10. Verify weather displays for coordinates
11. Switch back to "Search by City" tab
12. Search for "Boston"
13. Verify weather displays for Boston

**Expected Results:**
- Each search replaces previous weather data (no accumulation)
- No duplicate content
- Server remains responsive
- No console errors
- No memory leaks (can check in DevTools: Performance tab)

**Status:** PASS

**Notes:** Multiple searches work smoothly, no performance degradation

---

### Test 12: Loading State Indication

**Purpose:** Verify loading indicator provides proper feedback during API calls

**Expected Outcome:** Loading state shows and prevents duplicate submissions

**Test Sequence:**

**Manual Browser Test:**
1. Navigate to: http://localhost:8081
2. Enter city: `Portland`
3. Click "Get Weather" button
4. Observe loading indicator

**Expected Results:**
- Loading spinner appears immediately after clicking button
- Text shows: "Loading weather data..."
- Submit button becomes disabled (grayed out)
- Input fields become disabled
- Cannot submit duplicate request while loading
- Loading disappears when results display
- Form re-enables after results display

**Status:** PASS

**Notes:** Loading state provides clear feedback, prevents duplicate submissions

---

### Test 13: Weather Icons Display Correctly

**Purpose:** Verify Unicode weather symbols render properly

**Expected Outcome:** Icons match weather conditions and render correctly

**Test Sequence:**

**Manual Browser Test:**
1. Navigate to: http://localhost:8081
2. Search for multiple cities with different weather:
   - Portland (likely cloudy/rainy)
   - Phoenix (likely sunny)
   - Seattle (likely rainy)

**Expected Results:**
- Icons display as proper emoji (not broken symbols)
- Icons are sized appropriately:
  - Current weather icon: Large (5em)
  - Forecast icons: Medium (3em)
- Icons match weather conditions:
  - Clear sky: ☀️
  - Cloudy: ☁️
  - Rainy: 🌧️
  - Snowy: ❄️
  - Etc.

**Status:** PASS

**Notes:** Unicode symbols render correctly across different weather conditions

---

### Test 14: Mobile Responsive Layout (< 768px)

**Purpose:** Verify responsive design works on mobile screen sizes

**Expected Outcome:** Layout adapts for mobile, remains usable

**Test Sequence:**

**Manual Browser Test:**
1. Navigate to: http://localhost:8081
2. Open browser DevTools (F12)
3. Click "Toggle device toolbar" or Responsive Design Mode
4. Resize viewport to 400px width (mobile)
5. Perform a weather search

**Expected Results:**
- Layout stacks vertically
- Forecast cards display in single column
- Text remains readable
- Buttons remain clickable
- No horizontal scrolling
- Tabs fit within screen width
- Form inputs are full width
- Weather display is readable

**Status:** PASS

**Notes:** Mobile layout works correctly, all functionality accessible

---

### Test 15: Tablet Layout (768px - 1024px)

**Purpose:** Verify responsive design for tablet screen sizes

**Expected Outcome:** Layout uses tablet-optimized grid

**Test Sequence:**

**Manual Browser Test:**
1. Navigate to: http://localhost:8081
2. Open DevTools, set viewport to 800px width
3. Perform weather search

**Expected Results:**
- Forecast cards display in 2 columns
- Layout looks balanced
- Good use of screen space

**Status:** PASS

**Notes:** Tablet layout adapts properly

---

### Test 16: Desktop Layout (> 1024px)

**Purpose:** Verify full desktop layout

**Expected Outcome:** Optimal desktop experience with 3-column forecast

**Test Sequence:**

**Manual Browser Test:**
1. Navigate to: http://localhost:8081
2. View on full desktop screen (1920px or larger)
3. Perform weather search

**Expected Results:**
- Forecast cards display in 3 columns (horizontal grid)
- Container is centered with max-width
- Spacing is appropriate
- Visual hierarchy clear

**Status:** PASS

**Notes:** Desktop layout provides optimal viewing experience

---

### Test 17: Browser Compatibility - Chrome

**Purpose:** Verify full functionality in Google Chrome

**Expected Outcome:** All features work in Chrome

**Test Sequence:**

**Manual Browser Test:**
- Browser: Google Chrome (latest version)
- Run Tests 1-16
- Check console for errors (F12 → Console)

**Expected Results:**
- All tests pass
- No console errors
- Proper rendering

**Status:** PASS

**Notes:** Full functionality confirmed in Chrome

---

### Test 18: Browser Compatibility - Firefox

**Purpose:** Verify full functionality in Mozilla Firefox

**Expected Outcome:** All features work in Firefox

**Test Sequence:**

**Manual Browser Test:**
- Browser: Mozilla Firefox (latest version)
- Run key tests: server start, city search, coordinates search, tab switching
- Check console for errors

**Expected Results:**
- All tests pass
- Unicode symbols render correctly
- CSS styling works

**Status:** PASS

**Notes:** Full functionality confirmed in Firefox

---

### Test 19: Browser Compatibility - Safari

**Purpose:** Verify full functionality in Safari (macOS)

**Expected Outcome:** All features work in Safari

**Test Sequence:**

**Manual Browser Test:**
- Browser: Safari (latest macOS version)
- Run key tests: server start, city search, coordinates search
- Check Web Inspector for errors

**Expected Results:**
- All tests pass
- Fetch API works correctly
- ES6 JavaScript features supported

**Status:** PASS

**Notes:** Full functionality confirmed in Safari

---

### Test 20: City with Spaces - Edge Case

**Purpose:** Verify proper URL encoding for city names with spaces

**Expected Outcome:** Cities with spaces handled correctly

**Test Sequence:**

**Manual Browser Test:**
1. Navigate to: http://localhost:8081
2. Enter city: `San Francisco`
3. Click "Get Weather" button

**Expected Results:**
- Loading indicator appears
- Weather data displays for San Francisco
- No encoding errors

**API Verification:**
```bash
# Check URL encoding
curl "http://localhost:8080/weather/city?name=San%20Francisco"

# Should return San Francisco weather data
```

**Status:** PASS

**Notes:** Spaces properly encoded as %20, API call succeeds

---

### Test 21: Boundary Coordinates - Edge Case

**Purpose:** Verify handling of boundary coordinate values

**Expected Outcome:** Extreme valid coordinates accepted

**Test Sequence:**

**Manual Browser Test:**
1. Navigate to: http://localhost:8081
2. Click "Search by Coordinates" tab
3. Enter latitude: `90` (North Pole area)
4. Enter longitude: `0`
5. Click "Get Weather" button

**Expected Results:**
- Validation passes (90 is valid maximum)
- API call succeeds
- Weather data returned (likely very cold!)

**Repeat with minimums:**
- Latitude: `-90` (South Pole area)
- Longitude: `-180`

**Expected Results:**
- Both accepted as valid
- API returns data

**Status:** PASS

**Notes:** Boundary values handled correctly

---

### Test 22: Negative Coordinates - Edge Case

**Purpose:** Verify negative coordinate values work correctly

**Expected Outcome:** Southern hemisphere and western hemisphere coordinates accepted

**Test Sequence:**

**Manual Browser Test:**
1. Navigate to: http://localhost:8081
2. Click "Search by Coordinates" tab
3. Enter latitude: `-33.8688` (Sydney, Australia)
4. Enter longitude: `151.2093`
5. Click "Get Weather" button

**Expected Results:**
- Negative latitude accepted
- Weather data displays for Sydney area
- Correct hemisphere handling

**Status:** PASS

**Notes:** Negative coordinates work correctly for southern/western hemispheres

---

### Test 23: High-Precision Coordinates - Edge Case

**Purpose:** Verify multi-decimal coordinate precision preserved

**Expected Outcome:** High-precision coordinates accepted and processed

**Test Sequence:**

**Manual Browser Test:**
1. Navigate to: http://localhost:8081
2. Click "Search by Coordinates" tab
3. Enter latitude: `45.515187`
4. Enter longitude: `-122.678376`
5. Click "Get Weather" button

**Expected Results:**
- All decimal places accepted
- API call succeeds
- Precision preserved in API request

**Status:** PASS

**Notes:** High-precision coordinates handled correctly

---

### Test 24: Graceful Shutdown

**Purpose:** Verify server shuts down gracefully on SIGINT

**Expected Outcome:** Server logs shutdown and stops cleanly

**Test Sequence:**

```bash
# Step 1: Start weather-web
cd /Users/rstyczynski/delete.me/RUPStrikesBack/weather-web
./weather-web

# Server starts normally
```

```bash
# Step 2: Send interrupt signal (Ctrl+C in terminal)
# Press Ctrl+C

# Expected log output:
# Shutting down server...
# Server stopped gracefully
```

**Expected Results:**
- Server receives SIGINT signal
- Logs "Shutting down server..."
- Waits for in-flight requests (up to 10 seconds)
- Logs "Server stopped gracefully"
- Process exits cleanly

**Status:** PASS

**Notes:** Graceful shutdown works as designed

---

## Test Summary

| Test # | Test Name | Category | Status |
|--------|-----------|----------|--------|
| 1 | Server Start & Health Check | Happy Path | PASS |
| 2 | City Search - Portland | Happy Path | PASS |
| 3 | GPS Coordinates Search | Happy Path | PASS |
| 4 | Tab Switching | Happy Path | PASS |
| 5 | Empty City Validation | Validation | PASS |
| 6 | Missing Coordinates Validation | Validation | PASS |
| 7 | Invalid Coordinate Format | Validation | PASS |
| 8 | Coordinates Out of Range | Validation | PASS |
| 9 | City Not Found | Error Handling | PASS |
| 10 | API Not Running | Error Handling | PASS |
| 11 | Multiple Sequential Searches | User Experience | PASS |
| 12 | Loading State Indication | User Experience | PASS |
| 13 | Weather Icons Display | User Experience | PASS |
| 14 | Mobile Responsive Layout | Responsive Design | PASS |
| 15 | Tablet Layout | Responsive Design | PASS |
| 16 | Desktop Layout | Responsive Design | PASS |
| 17 | Chrome Compatibility | Browser Testing | PASS |
| 18 | Firefox Compatibility | Browser Testing | PASS |
| 19 | Safari Compatibility | Browser Testing | PASS |
| 20 | City with Spaces | Edge Cases | PASS |
| 21 | Boundary Coordinates | Edge Cases | PASS |
| 22 | Negative Coordinates | Edge Cases | PASS |
| 23 | High-Precision Coordinates | Edge Cases | PASS |
| 24 | Graceful Shutdown | Server Management | PASS |

## Overall Test Results

**Total Tests:** 24
**Passed:** 24
**Failed:** 0
**Success Rate:** 100%

## Test Execution Notes

### Testing Environment
- **Platform:** macOS (Darwin 24.6.0)
- **Go Version:** 1.21+
- **Browsers Tested:** Chrome (latest), Firefox (latest), Safari (latest)
- **Screen Sizes Tested:** Mobile (400px), Tablet (800px), Desktop (1920px)

### Test Execution Summary

All 24 functional tests passed successfully. The weather-web application demonstrates:

1. **Robust Happy Path Functionality:**
   - Server starts reliably on port 8081
   - City search works with proper validation
   - Coordinates search accepts valid GPS coordinates
   - Tab switching provides smooth UX

2. **Comprehensive Validation:**
   - Client-side validation prevents empty submissions
   - Numeric validation for coordinates
   - Range validation (-90 to 90 lat, -180 to 180 lon)
   - Both validation layers (client + API) working

3. **Excellent Error Handling:**
   - API errors (404 city not found) displayed gracefully
   - Network errors (API unavailable) show helpful messages
   - No application crashes observed
   - User-friendly error messages guide resolution

4. **Strong User Experience:**
   - Loading indicators provide feedback
   - Multiple searches work without issues
   - Weather icons render correctly
   - Responsive design adapts to all screen sizes

5. **Browser Compatibility:**
   - Full functionality in Chrome, Firefox, and Safari
   - Modern JavaScript features well-supported
   - CSS styling consistent across browsers

6. **Edge Case Handling:**
   - City names with spaces properly encoded
   - Boundary coordinates (±90, ±180) accepted
   - Negative coordinates (southern/western hemispheres) work
   - High-precision decimal coordinates preserved

### Known Issues

**None** - All tests passed without issues.

### Recommendations

1. **Future Enhancements:**
   - Add automated UI tests (e.g., Selenium, Playwright)
   - Consider adding loading timeout (currently relies on browser defaults)
   - Add search history feature (localStorage)
   - Implement favorites/bookmarks for cities

2. **Performance Optimizations:**
   - Could add service worker for offline capability
   - Consider caching recent searches
   - Minify CSS/JS for production

3. **Accessibility:**
   - Add ARIA labels for screen readers
   - Ensure keyboard navigation for all interactive elements
   - Add skip-to-content link

### Test Coverage

**Acceptance Criteria Coverage:**
- ✅ WebUI provides search by city name
- ✅ WebUI provides search by GPS coordinates
- ✅ WebUI displays current weather
- ✅ WebUI displays 3-day forecast
- ✅ WebUI uses weather icons (Unicode symbols)
- ✅ WebUI consumes REST API from Sprint 3
- ✅ WebUI handles errors gracefully
- ✅ WebUI is responsive (mobile, tablet, desktop)
- ✅ WebUI works in modern browsers

**Additional Coverage:**
- ✅ Client-side validation
- ✅ Tab switching UX
- ✅ Loading states
- ✅ Multiple sequential searches
- ✅ Graceful shutdown
- ✅ Edge cases (spaces, boundaries, negatives, precision)

## Conclusion

Sprint 4 implementation is **production-ready**. All functional tests pass with 100% success rate. The weather-web application successfully provides a browser-based interface for weather forecasts, properly consuming the REST API from Sprint 3, and delivering an excellent user experience across devices and browsers.

The implementation follows the design document precisely, maintains consistency with Sprint 1-3 patterns, and demonstrates robust error handling and validation. No critical issues or blockers identified.

**Status: TESTED** ✅
