# Sprint 7 - Functional Tests

## Test Environment Setup

### Prerequisites
- Go installed
- Python 3 installed

## RSB-6 and RSB-7 Tests

### Test 1: API coords echo location

```bash
cd weather-api && go build -o weather-api && ./weather-api &
API_PID=$!
sleep 1
curl -s "http://localhost:8080/v1/weather?lat=37.77&lon=-122.42" | grep -q '"location"' && echo LOCATION_OK
kill $API_PID || true
```

### Test 2: Web includes Leaflet assets

```bash
cd weather-web && python3 -m http.server 8000 &
WEB_PID=$!
sleep 1
curl -s http://localhost:8000 | grep -q "leaflet" && echo LEAFLET_OK
kill $WEB_PID || true
```

### Test 3: Map container exists

```bash
grep -q "id=\"map\"" weather-web/index.html && echo MAP_DIV_OK
```

## Test Summary

| Backlog Item | Total Tests | Passed | Failed | Status |
|--------------|-------------|--------|--------|--------|
| RSB-6        | 2           | 2      | 0      | PASS   |
| RSB-7        | 1           | 1      | 0      | PASS   |
