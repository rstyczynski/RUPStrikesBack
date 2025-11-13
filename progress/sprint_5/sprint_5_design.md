# Sprint 5 - Design

**Date**: 2025-11-13
**Sprint**: 5 - WebUI
**Mode**: YOLO (Autonomous)
**Status**: Accepted

## RSB-5: Weather Forecast WebUI

Status: Accepted

### Requirement Summary
Web-based interface that consumes the Sprint 4 REST API to let users search weather by city or GPS coordinates, view current conditions plus a 3-day forecast, and experience a responsive, visually rich presentation. The UI must be self-contained, easy to serve locally, and align with existing CLI/API behavior.

### Feasibility Analysis

**API Availability:**
- `GET /api/v1/weather/city/{city}` and `GET /api/v1/weather/coordinates?lat={lat}&lon={lon}` from `weather-api` (Sprint 4) already return the full data model (see `progress/sprint_4/sprint_4_design.md` and `responses/types.go`).
- `GET /api/v1/health` already exists for readiness checks and can back a status indicator.
- CORS middleware is active, and we will also serve the UI from the same origin for simplicity.

**Technical Constraints:**
- Keep dependencies minimal (HTML/CSS/vanilla JS) to mirror earlier sprints' zero-dependency approach.
- Reuse Go 1.22 server to host static assets via `embed` to avoid an extra build toolchain.
- Support modern browsers (Chrome/Firefox/Safari/Edge latest 2 versions) using standards such as CSS Grid, Flexbox, Fetch API, and ES modules.
- Maintain copy-paste-able terminal workflows: running `go run ./weather-api` should provide both API and UI.

**Risk Assessment:**
- Low: API contract already proven; Fetch + vanilla JS is straightforward.
- Medium: Styling/visual polish and responsive layout—mitigated by predefined design tokens and layout grid in CSS.
- Low: Embedding static assets keeps distribution simple; Go's `embed` is stable.

### Architecture Overview
Layered architecture keeping backend and frontend loosely coupled but deployable together.

```
Browser UI (HTML/CSS/JS)
  ├─ App shell (header, search forms, panels)
  ├─ Network layer (fetch helpers)
  ├─ State module (in-memory store + render pipeline)
  └─ UI rendering helpers (current summary, forecast cards, status banners)
          ↓ Fetch requests (JSON)
Weather API (Go)
  ├─ REST endpoints (/api/v1/...)
  └─ Static file handler (serves /, /assets/* from embedded /webui)
          ↓
Sprint 2 packages (geocode, weather) → Open-Meteo APIs
```

Static assets live under `weather-api/webui/` and are embedded into the Go binary. `http.FileServer` backed by `embed.FS` exposes `/` so running the API automatically serves `index.html`, CSS, and JS.

### UI Composition
- **Global Header:** title + last refresh timestamp placeholder.
- **Status Banner:** contextual messages (loading, errors, empty state) colored via utility classes.
- **Search Panel:** two tabs (City Lookup, Coordinates). Each form validates input, disables submit while loading, and surfaces inline errors.
- **Weather Overview:**
  - Location card with city, country, coordinates, and health pill.
  - Current conditions card (icon, temperature, condition, wind, precip chance time stamp).
- **Forecast Grid:** three cards, each showing date, icon, highs/lows, precipitation bar, textual summary.
- **Activity Log:** lightweight list of the last three successful searches (memory only) to show persistence readiness.

Layout uses CSS Grid (`grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`) for cards and Flexbox for header/forms. Breakpoints at 768px and 1200px tailor spacing and typography.

### State Management & Data Flow
- Central `appState` object containing `mode`, `latestResult`, `recentSearches`, and `status`.
- Event handlers:
  - `handleCitySubmit(event)` → validate city → `fetchWeatherByCity(city)` → `updateState(result)`.
  - `handleCoordinateSubmit(event)` → validate floats → `fetchWeatherByCoordinates(lat, lon)` → `updateState`.
- `updateState` triggers `renderApp`, which delegates to renderer helpers: `renderStatus`, `renderLocation`, `renderCurrent`, `renderForecast`, `renderHistory`.
- Derived data helpers compute icon codes, gradient classes, and formatted strings in one place to keep templates clean.

### Network & Error Handling
- `apiClient.js` (inline in `app.js`) wraps Fetch with `timeoutSignal` and JSON parsing. All errors normalized to `{ message, code }` for consistent UI messaging.
- Uses relative URLs (`/api/v1/...`) so UI works regardless of host/port.
- Loading state toggles `aria-busy` and disables inputs to prevent duplicate submissions.
- Retry guidance shown for network failures; validation errors highlight fields with inline helper text.

### Styling & Responsiveness
- CSS variables define spacing, colors, shadows, breakpoints.
- Light/dark friendly palette with high-contrast text.
- Utility classes (`.hidden`, `.card`, `.pill`, `.grid`) keep markup readable.
- Animations limited to subtle transitions (hover, card entry) to avoid motion sickness.
- `prefers-reduced-motion` respected (transitions disabled).

### Accessibility & Performance
- Semantic HTML elements (forms, fieldsets, buttons, lists) with `aria-live` region for status updates and `aria-pressed` for tab buttons.
- All interactive controls have keyboard focus outlines and `aria-controls` attributes.
- Icons delivered as inline SVGs with `aria-hidden` to avoid screen reader noise; textual equivalents provided.
- Lighthouse baseline > 90 expected because bundle is tiny (<25 KB) and no blocking assets.

### Testing Strategy
1. **Server smoke tests:** verify UI assets served and API endpoints reachable by the same server instance.
2. **City search flow:** script hits `/api/v1/weather/city/{city}` directly plus curl request to `/` to ensure HTML is served (documented in `progress/sprint_5/sprint_5_tests.md`).
3. **Coordinates flow:** call coordinates endpoint and check JSON shape.
4. **Error flows:** request invalid city and ensure 404 JSON; UI surfaces error banner (document manual observation + curl precondition).
5. **Health indicator:** poll `/api/v1/health` and ensure UI toggles status pill (wired through JS).

While UI rendering is verified manually in browsers, all setup/test commands remain copy-paste-able shell sequences per cooperation rules.

### Deployment & Build
- `weather-api` gains embedded static assets via Go's `embed` (no npm step).
- `go run ./weather-api` or compiled binary automatically hosts both API and UI.
- Production deploys simply redeploy the Go binary; no extra artifacts.
- Optional `make webui-watch` instructions (documented) let developers auto-refresh using `air` or `fresh`, but not required.

## YOLO Mode Decisions
This sprint proceeds autonomously; the following design decisions were made and logged.

### Decision 1: Vanilla JS + Embedded Assets
**Context:** Need a frontend framework choice.
**Decision:** Use plain HTML/CSS/ES modules bundled via Go `embed` instead of React/Vite stack.
**Rationale:** Keeps toolchain identical to previous sprints, no npm install required, deterministic binaries.
**Alternatives Considered:** React (powerful but adds build step), Vue/Svelte (similar). These were rejected to minimize overhead.
**Risk:** Low – codebase small; future migrations possible by swapping `webui` directory.

### Decision 2: Dual Search Forms with In-Memory History
**Context:** Requirements demand both city and GPS inputs plus UX cues.
**Decision:** Provide two dedicated forms with quick toggle buttons and maintain last three searches in-memory to reinforce preference story leading into Sprint 3.
**Alternatives:** Single form with radio buttons; more complex persistent storage. Deferred to keep UI uncluttered.
**Risk:** Low – history resets per refresh but demonstrates architecture for future persistence.

### Decision 3: Inline SVG Icon System
**Context:** Need weather visuals without asset pipeline.
**Decision:** Generate icons via SVG paths (sun, cloud, rain, snow, storm) selected by weather code ranges.
**Alternatives:** External icon fonts or images (heavier, licensing). Inline SVG ensures zero network fetches and easy theming.
**Risk:** Low – limited icon set covers Open-Meteo codes; fallback text remains available.

### Decision 4: Testing via Shared Server Harness
**Context:** UI typically requires browser automation; environment discourages heavy dependencies.
**Decision:** Provide shell-based smoke/regression tests that start the Go server once, hit both HTML and JSON endpoints, and rely on documented manual verification for visual aspects.
**Alternatives:** Introduce Playwright or Cypress; rejected due to network lockdown and large downloads.
**Risk:** Medium – automated visual tests absent. Mitigated by deterministic API responses and detailed manual checklist in tests doc.

## Implementation Plan
1. Create `weather-api/webui/` with `index.html`, `styles.css`, `app.js`, and SVG sprite definitions.
2. Embed assets via `//go:embed webui` in `weather-api/main.go` and register `mux.Handle("/", ...)` to serve them.
3. Build UI shell (header, status banner, forms, result sections) with semantic markup.
4. Implement `app.js` (state store, Fetch helpers, rendering functions, weather icon mapper, history tracking).
5. Style components with modern CSS, light/dark aware variables, responsive grid, and accessible focus states.
6. Update `PROGRESS_BOARD.md` to reflect `designed` status so Sprint 5 transitions to construction after acceptance.
7. Document design summary in `progress/sprint_5/sprint_5_elaboration_review_1.md` once status flips to Accepted (YOLO auto-approval).
8. Prepare to implement, test, and document according to construction and documentation agent instructions.

## References
- `progress/sprint_5/sprint_5_analysis.md` – requirement analysis and assumptions
- `progress/sprint_4/sprint_4_design.md` & `weather-api/responses/types.go` – REST API contract
- `rules/generic/GENERAL_RULES.md` – documentation and status conventions
