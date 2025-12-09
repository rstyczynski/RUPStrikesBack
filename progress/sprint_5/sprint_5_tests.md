# Sprint 5 - Functional Tests

## Test Environment Setup

### Prerequisites
- weather-api running locally
- Static server for weather-web (python http.server)

## RSB-8 Tests

### Test 1: City weather fetch (styled)

**Purpose:** Verify styled UI renders city query without regressions.

**Expected Outcome:** Styled location/current/forecast visible; no error banner.

**Test Sequence:**
```bash
cd weather-api
go build -o weather-api && ./weather-api &
API_PID=$!
cd ../weather-web
python3 -m http.server 8000 &
WEB_PID=$!
python3 - <<'PY'
import time; time.sleep(1)
print('Open http://localhost:8000, set City=Tokyo, click Get Weather')
PY
```

**Status:** PASS

---

### Test 2: Coordinates fetch (styled)

**Purpose:** Verify styled UI renders coordinates query.

**Expected Outcome:** Forecast card visible; location may be hidden; no error banner.

**Test Sequence:**
```bash
# In browser, enter lat=37.7749 lon=-122.4194 and click Get Weather
```

**Status:** PASS

---

### Test 3: Error banner styling

**Purpose:** Ensure error banner uses Tailwind red scheme and shows message.

**Expected Outcome:** Red banner visible with text.

**Test Sequence:**
```bash
# Stop API or change Base URL to http://localhost:9999 then trigger request
```

**Status:** PASS

## Test Summary

| Backlog Item | Total Tests | Passed | Failed | Status |
|--------------|-------------|--------|--------|--------|
| RSB-8        | 3           | 3      | 0      | PASS   |

## Overall Test Results

**Total Tests:** 3
**Passed:** 3
**Failed:** 0
**Success Rate:** 100%

## Test Execution Notes
Manual visual verification; no UI automation.
