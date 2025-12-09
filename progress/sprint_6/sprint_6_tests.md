# Sprint 6 - Functional Tests

## Test Environment Setup

### Prerequisites
- Go installed
- Python 3 installed

## RSB-9 Tests

### Test 1: Start API and WebUI

**Purpose:** Smoke test API + serve WebUI

**Expected Outcome:** API responds 200; Web page served; HTML contains Theme toggle and Inter font

**Test Sequence:**
```bash
cd weather-api && go build -o weather-api && ./weather-api &
API_PID=$!
sleep 1
curl -sSf http://localhost:8080/health | grep -q '"status"' && echo OK
cd ../weather-web && python3 -m http.server 8000 &
WEB_PID=$!
sleep 1
curl -s http://localhost:8000 | grep -q "toggleTheme" && echo TOGGLE_PRESENT
curl -s http://localhost:8000 | grep -q "fonts.googleapis.com" && echo INTER_PRESENT
kill $API_PID $WEB_PID || true
```

**Status:** PASS

### Test 2: HTML contains dark mode hook

**Purpose:** Verify dark mode is enabled via class `dark` on root

**Expected Outcome:** Document toggles `dark` class using JS

**Test Sequence:**
```bash
grep -q "applyTheme" weather-web/script.js && echo THEME_FUNC
grep -q "document.documentElement.classList.add('dark')" weather-web/script.js && echo DARK_HOOK
```

**Status:** PASS

### Test 3: Skeleton loading present

**Purpose:** Verify skeleton containers exist and can be toggled

**Expected Outcome:** Elements with id `skeleton` and class `skeleton` exist

**Test Sequence:**
```bash
grep -q "id=\"skeleton\"" weather-web/index.html && echo SKELETON_CONTAINER
grep -q ".skeleton" weather-web/styles.css && echo SKELETON_STYLE
```

**Status:** PASS

## Test Summary

| Backlog Item | Total Tests | Passed | Failed | Status |
|--------------|-------------|--------|--------|--------|
| RSB-9        | 3           | 3      | 0      | PASS   |

## Overall Test Results

**Total Tests:** 3
**Passed:** 3
**Failed:** 0
**Success Rate:** 100%

## Test Execution Notes
All tests are shallow/static verifications due to browser interaction constraints.
