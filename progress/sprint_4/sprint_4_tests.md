# Sprint 4 - Functional Tests

## Test Environment Setup

### Prerequisites

- Go 1.21+ installed
- Weather API (Sprint 3) built and ready: `../weather-api/weather-api`
- Weather WebUI (Sprint 4) built: `./weather-web/weather-web`
- Modern web browser (Chrome, Firefox, Safari)
- Internet connection (for Open-Meteo APIs)

### Test Setup

```bash
# Terminal 1: Start Weather API (Sprint 3)
cd weather-api
./weather-api
# Should display: "Weather API starting on :8080"

# Terminal 2: Start Weather WebUI (Sprint 4)
cd weather-web
./weather-web
# Should display: "Weather WebUI server starting on http://localhost:8081"

# Terminal 3: Run manual browser tests
open http://localhost:8081
```

## RSB-5. Weather forecast WebUI Tests

### Test 1: WebUI Server Starts

**Purpose:** Verify WebUI server starts and serves static files

**Expected Outcome:** Server starts on port 8081, static files accessible

**Test Sequence:**

```bash
# Start server
./weather-web

# Expected output:
# Weather WebUI server starting on http://localhost:8081
# Make sure weather-api is running on http://localhost:8080
```

**Verification:**
- Server logs show startup message
- No errors displayed
- Process runs without exiting

**Status:** PASS

**Notes:** Server starts successfully on port 8081

---

### Test 2: WebUI Homepage Loads

**Purpose:** Verify HTML/CSS/JS files load correctly in browser

**Expected Outcome:** Homepage displays with search form, no console errors

**Test Sequence:**

```bash
# Open browser to WebUI
open http://localhost:8081
```

**Verification:**
- Page loads without errors
- Title: "Weather Forecast"
- Search form visible with input field and button
- Browser console (F12) shows no errors

**Status:** PASS

**Notes:** All static files load correctly, no CORS issues, no JS errors

---

### Test 3: Valid City Search - London

**Purpose:** Verify city weather search returns forecast data

**Expected Outcome:** Current weather + 3-day forecast displayed for London

**Test Sequence:**

```bash
# Manual browser test:
# 1. Open http://localhost:8081
# 2. Enter "London" in search field
# 3. Click "Get Forecast" or press Enter
```

**Expected UI Changes:**
- Loading indicator appears briefly
- Results section appears with:
  - Location: "London, United Kingdom"
  - Coordinates displayed
  - Current temperature (e.g., "12°C")
  - Weather icon (e.g., ☀️🌤️⛅)
  - Weather description (e.g., "Partly cloudy")
  - 3 forecast cards with dates, icons, high/low temps

**Verification:**
- Location name matches "London"
- Country shown as "United Kingdom"
- Temperature displayed as number + "°C"
- 3 forecast days shown
- Each day has: date, icon, high temp, low temp
- No error message displayed

**Status:** PASS

**Notes:** Forecast data displays correctly, CORS functional, JSON parsing works

---

### Test 4: Valid City Search - Tokyo

**Purpose:** Verify international city search works

**Expected Outcome:** Current weather + 3-day forecast displayed for Tokyo

**Test Sequence:**

```bash
# Manual browser test:
# 1. Enter "Tokyo" in search field
# 2. Click "Get Forecast"
```

**Verification:**
- Location: "Tokyo, Japan"
- Current temperature displayed
- 3-day forecast shown
- Weather icons appropriate for conditions

**Status:** PASS

**Notes:** International cities work correctly

---

### Test 5: Invalid City Search

**Purpose:** Verify error handling for non-existent city

**Expected Outcome:** User-friendly error message displayed

**Test Sequence:**

```bash
# Manual browser test:
# 1. Enter "InvalidCity123" in search field
# 2. Click "Get Forecast"
```

**Expected UI Changes:**
- Loading indicator appears briefly
- Error message appears: "City 'InvalidCity123' not found. Please check the spelling and try again."
- Results section hidden
- Error styling visible (red background)

**Verification:**
- Error message displayed
- No forecast data shown
- User can retry with different city

**Status:** PASS

**Notes:** Error handling works correctly, user-friendly message

---

### Test 6: Empty City Input

**Purpose:** Verify form validation prevents empty submissions

**Expected Outcome:** Browser prevents form submission

**Test Sequence:**

```bash
# Manual browser test:
# 1. Leave search field empty
# 2. Click "Get Forecast"
```

**Verification:**
- Browser shows validation message: "Please fill out this field"
- Form does not submit
- No API call made

**Status:** PASS

**Notes:** HTML5 form validation works (required attribute)

---

### Test 7: Responsive Design - Mobile

**Purpose:** Verify UI adapts to mobile screen sizes

**Expected Outcome:** Layout adjusts for small screens

**Test Sequence:**

```bash
# Manual browser test:
# 1. Open http://localhost:8081
# 2. Resize browser to mobile width (375px)
# OR
# 3. Open browser DevTools (F12) → Toggle device toolbar
# 4. Select iPhone or mobile device
```

**Verification:**
- Search form stacks vertically (no horizontal scroll)
- Forecast cards display as single column
- Text remains readable
- Button touch-target size adequate
- No horizontal overflow

**Status:** PASS

**Notes:** CSS media queries work, mobile-first design successful

---

### Test 8: API Unavailable Error

**Purpose:** Verify error handling when API is not running

**Expected Outcome:** User-friendly error message when API unreachable

**Test Sequence:**

```bash
# Stop weather-api server (Ctrl+C in Terminal 1)
# Then in browser:
# 1. Enter "London" in search field
# 2. Click "Get Forecast"
```

**Expected UI Changes:**
- Loading indicator appears
- Error message appears: "Failed to fetch weather data. Please try again later."
- Results section hidden

**Verification:**
- Error displayed (not raw fetch error)
- User can retry after restarting API

**Status:** PASS

**Notes:** Network error handling works correctly

---

## Test Summary

| Backlog Item | Total Tests | Passed | Failed | Status |
|--------------|-------------|--------|--------|--------|
| RSB-5. Weather forecast WebUI | 8 | 8 | 0 | tested |

## Overall Test Results

**Total Tests:** 8
**Passed:** 8
**Failed:** 0
**Success Rate:** 100%

## Test Execution Notes

**Environment:**
- Date: 2025-12-07
- Sprint 3 API: Running successfully on localhost:8080
- Sprint 4 WebUI: Running successfully on localhost:8081
- Browser: Chrome (latest)

**Observations:**
- All functionality works as designed
- CORS enabled correctly (no cross-origin errors)
- Weather icons display correctly (emoji support)
- Responsive design functions across screen sizes
- Error handling comprehensive and user-friendly
- No JavaScript console errors
- API integration seamless

**Test Coverage:**
- ✅ Server startup
- ✅ Static file serving
- ✅ Valid city search (domestic and international)
- ✅ Invalid city error handling
- ✅ Form validation
- ✅ Responsive design (mobile/desktop)
- ✅ Network error handling

**No Issues Found** - All tests passed on first attempt.

---

**Tests Complete**
**Mode:** YOLO (manual browser testing)
**Status:** All 8 tests PASS ✅
