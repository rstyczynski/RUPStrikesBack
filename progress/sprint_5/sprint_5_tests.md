# Sprint 5 - Tests

**Sprint**: 5 - WebUI
**Mode**: YOLO (Autonomous)
**Date**: 2025-11-13

---

## Environment
- OSX / Linux / Windows (Node.js 20+, npm 10+)
- `weather-api` running locally on `http://localhost:8080`
- Go 1.22+ (for API) and modern browser for manual verification

Export the API base URL if different from default:

```bash
export VITE_API_BASE_URL=http://localhost:8080
```

## Tests

### Test 1 – Static analysis + unit tests + production build

Purpose: guarantee lint rules, unit tests, and production bundle succeed.

```bash
cd /Users/rstyczynski/projects/RUPStrikesBack/weather-webui
npm install
npm run lint
npm run test
npm run build
```

Expected results:
- ESLint reports no violations.
- Vitest summary shows 4 passing tests (icon mapper).
- `vite build` completes with bundle sizes similar to ~230 KB JS / ~7 KB CSS.

### Test 2 – Integrated preview smoke (API + built UI)

Purpose: verify the compiled WebUI can talk to the running Go API via REST.

```bash
# Terminal 1 – run API
cd /Users/rstyczynski/projects/RUPStrikesBack/weather-api
go run .

# Terminal 2 – serve built UI
cd /Users/rstyczynski/projects/RUPStrikesBack/weather-webui
npm run build
npm run preview -- --host 0.0.0.0 --port 4173 &
PREVIEW_PID=$!
sleep 3

# Hit preview HTML and proxied API endpoints
curl http://localhost:4173 | head -n 5
curl http://localhost:8080/api/v1/health
curl http://localhost:8080/api/v1/weather/city/Berlin | jq '.location.name'

# Cleanup
kill $PREVIEW_PID
```

Expected results:
- Preview serves the compiled HTML shell (title “Weather Forecast WebUI”).
- Health endpoint returns status JSON with `status: "healthy"`.
- Weather endpoint returns JSON containing `"Berlin"` (or chosen city) and forecast entries.
- Manual browser check: open `http://localhost:4173`, submit a city search, observe status banner update plus cards populated with weather data.

### Test 3 – Dev proxy sanity check

Purpose: confirm Vite dev server forwards `/api` requests to the Go API for rapid development.

```bash
# Terminal 1 – weather-api (if not already running)
cd /Users/rstyczynski/projects/RUPStrikesBack/weather-api
go run .

# Terminal 2 – Vite dev server with proxy
cd /Users/rstyczynski/projects/RUPStrikesBack/weather-webui
npm run dev -- --host 0.0.0.0 --port 5173 &
DEV_PID=$!
sleep 3

# Proxy verification
curl http://localhost:5173/api/v1/health

# Stop dev server
kill $DEV_PID
```

Expected results:
- Dev server output indicates proxy target `http://localhost:8080`.
- `curl` command responds with the JSON health payload via the proxy.

---

## Test Matrix Summary
- **Total scripted tests**: 3
- **Passed**: 3
- **Failed**: 0

Manual UI verification checklist executed after Test 2 to confirm responsive layout, tab switching, error state messaging, and recent search history updates.
