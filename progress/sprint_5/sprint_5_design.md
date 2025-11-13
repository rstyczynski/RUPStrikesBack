# Sprint 5 - Design

**Date**: 2025-11-13
**Sprint**: 5 - WebUI
**Mode**: YOLO (Autonomous)
**Status**: Accepted

## RSB-5: Weather Forecast WebUI

Status: Accepted

### Requirement Summary
Deliver a fully featured browser client as an independent module (`weather-webui/`) that communicates with the existing Sprint 4 REST API exclusively via HTTP. The WebUI must expose city and GPS lookups, show current conditions plus a three-day forecast, surface health information, and remain responsive across desktop/mobile. The front-end runs independently (Vite dev server or static hosting) yet targets the same REST contract already defined by `weather-api`.

### Feasibility Analysis

**API Availability:**
- `GET /api/v1/weather/city/{city}` and `GET /api/v1/weather/coordinates?lat={lat}&lon={lon}` return all weather data (ref: `progress/sprint_4/sprint_4_design.md`, `weather-api/responses/types.go`).
- `GET /api/v1/health` provides service health metadata for a header indicator.
- CORS headers are enabled inside `weather-api` (see `corsMiddleware`), allowing cross-origin calls from the WebUI dev server.

**Technical Constraints:**
- WebUI must live in `weather-webui/` as a self-contained Node/Vite project.
- Communicate over REST only; no shared packages or compilation with the API server.
- Provide environment-driven configuration for API base URL (`VITE_API_BASE_URL`, default `http://localhost:8080`).
- Keep dependencies modern but minimal; React + TypeScript via Vite chosen for developer velocity and component structure.

**Risk Assessment:**
- Low: REST contract proven, CORS already available.
- Medium: Coordinating dev/prod base URLs; mitigated via `.env` support and documentation.
- Medium: Ensuring accessibility and responsive behavior; mitigated with component library and CSS strategy described below.

### Architecture Overview
```
┌──────────────────────────────────────────┐
│             weather-webui               │
│  React + Vite + TypeScript front-end    │
│  ├─ App shell (layout, routing)         │
│  ├─ Feature modules (Search, Status)    │
│  ├─ Hooks (useWeatherQuery, useHealth)  │
│  ├─ API client (Fetch wrapper)          │
│  └─ Styling (CSS Modules + design tokens)│
└───────────────▲─────────────────────────┘
                │ REST (JSON)
┌───────────────┴─────────────────────────┐
│              weather-api                 │
│  Existing Go REST service from Sprint 4 │
│  (no changes beyond optional CORS tuning)│
└──────────────────────────────────────────┘
```
- Both modules run independently; during development Vite serves on `http://localhost:5173` and proxies to `http://localhost:8080`.
- Production build outputs static assets under `weather-webui/dist/` that can be hosted by any static server or a CDN.

### Module Breakdown
**weather-webui/**
- `src/main.tsx`: React root with providers (QueryClient, Theme).
- `src/api/client.ts`: Fetch helper reading `import.meta.env.VITE_API_BASE_URL`.
- `src/api/types.ts`: TypeScript interfaces mirroring REST responses (LocationResponse, CurrentWeatherResponse, ForecastDayResponse, ErrorResponse, HealthResponse).
- `src/features/search/CitySearchForm.tsx` & `CoordinatesForm.tsx`: Controlled forms with validation, loading state binding, and accessible helper text.
- `src/features/weather/CurrentConditionsCard.tsx`, `ForecastCard.tsx`: Presentational components using inline SVG icons chosen via weather code mapping.
- `src/features/system/StatusBanner.tsx`: Surfaces errors/loading states (ARIA live region).
- `src/state/useWeatherQuery.ts`: Custom hook built on React Query for caching and retry/backoff (3 retries, 2s intervals) with stale-while-revalidate semantics.
- `src/state/useHealthHeartbeat.ts`: Polls `/api/v1/health` every 60s for header indicator.
- `src/components/Layout.tsx`: Responsive grid using CSS variables, clamps, and prefers-reduced-motion support.
- `src/styles/tokens.css`: Defines color palette, spacing scale, typography; imported globally via Vite.

**weather-api/**
- No structural changes, only documentation updates to reflect WebUI consumer and (if needed) CORS origin list instructions.

### Client–Server Contract
- All calls use HTTPS/HTTP with JSON; client attaches no auth headers.
- `WeatherApiClient` centralizes endpoints and error normalization so UI renders consistent `StatusBannerMessage` objects.
- Timeout (15s) enforced via `AbortController`. Network failures mapped to `code: "NETWORK_ERROR"`.
- City queries follow `GET ${baseUrl}/api/v1/weather/city/${encodeURIComponent(city)}`.
- Coordinate queries follow `GET ${baseUrl}/api/v1/weather/coordinates?lat=${lat}&lon=${lon}` with validation for numeric ranges.
- Health checks hit `/api/v1/health`; on failure UI downgrades to "Degraded" pill.

### UI Composition
- **Header**: App title, health pill, theme toggle placeholder, latest refresh timestamp.
- **Status Banner**: Renders info/success/error states with ARIA live region.
- **Search Workspace**: Tabbed interface (city vs coordinates) using accessible `role="tablist"` semantics; forms share submit CTA.
- **Current Snapshot**: Large card containing location metadata, temperature, condition text, wind, humidity/precip.
- **Forecast Grid**: 3 cards via CSS Grid (auto-fit, minmax 250px). Each shows date, icon, hi/lo, precipitation bar.
- **Recent Searches**: Local memory (max 5) listing query string + timestamp; future Sprints can persist.

### State Management & Data Flow
1. User submits form → `handleSubmit` builds query descriptor.
2. `useWeatherQuery` triggers React Query fetch, caches by descriptor key.
3. Successful payload updates `recentSearches` context and triggers `renderWeatherPanels`.
4. Errors raise `StatusBanner` with actionable text; invalid inputs flagged inline.
5. `useHealthHeartbeat` runs independently to keep header pill up-to-date.

### Styling & Responsiveness
- CSS Modules + design tokens provide theming; fallback global file ensures non-module elements styled.
- Layout uses CSS Grid at ≥1200px (two columns) and stacked Flexbox on mobile.
- Focus styles rely on `outline-offset: 4px` for keyboard navigation; forms include `aria-describedby`.
- Animations limited to opacity/transform transitions, disabled when `prefers-reduced-motion`.

### Accessibility & Performance
- Semantic HTML (header, main, section, form, button).
- `aria-live="polite"` for status, `aria-busy` on forms during fetch.
- Inputs labelled via `<label>` + `htmlFor`; numeric inputs enforce `step="0.01"`.
- Build output expected <50 KB gzipped due to code splitting and tree shaking.
- Lighthouse targets: Performance ≥90, Accessibility ≥95, Best Practices ≥95, SEO ≥90.

### Testing Strategy
1. **Unit/Integration (Vitest)**: cover helpers (`mapWeatherCodeToIcon`, validators, API client) plus React Testing Library snapshots for cards.
2. **E2E Smoke (Playwright or Cypress-lite)**: optional but planned for future; in this sprint rely on documented manual browser checklist due to time.
3. **CLI-Based Verification**: Provide shell script in `progress/sprint_5/sprint_5_tests.md` that starts both servers, runs `npm run check` (lint+typecheck), `npm run test`, `npm run build`, and executes curl smoke tests.
4. **Manual Browser Checklist**: Document expected interactions (city search, coordinates search, network failure message, responsive layout) to be executed after `npm run dev`.

### Build & Deployment
- Use Vite scripts: `npm run dev`, `npm run build`, `npm run preview`.
- Output served via `npm run preview` (static) or any static host (S3, Netlify). Document both the dev workflow (two terminals) and prod deployment linking to `dist/` bundle.
- Provide `.env.example` with `VITE_API_BASE_URL=http://localhost:8080` so developers configure remote endpoints easily.

## YOLO Mode Decisions
This iteration remains autonomous; new decisions logged below.

### Decision 1: React + Vite + TypeScript Stack
**Context:** Need a scalable component system for an independent module.
**Decision:** Scaffold `weather-webui` using `npm create vite@latest` with the React + TS template.
**Rationale:** React familiarity, strong ecosystem, first-class TypeScript support, Vite dev server with proxy.
**Alternatives Considered:** Plain HTML/JS (minimal but less structured), Vue/Svelte (excellent but less consistent with existing tooling). React chosen for long-term flexibility.
**Risk:** Medium—introduces Node toolchain, mitigated via clear documentation and lockfile.

### Decision 2: React Query for Data Fetching
**Context:** Need caching, refetch, and error handling for REST calls.
**Decision:** Integrate React Query (TanStack Query) to manage API requests.
**Rationale:** Handles caching, retries, loading states with minimal code; widely adopted.
**Alternatives:** Custom hooks with useState/useEffect; acceptable but more boilerplate. React Query reduces bugs.
**Risk:** Low—small dependency, tree-shakeable.

### Decision 3: CSS Modules + Design Tokens
**Context:** Need styling approach balancing modularity and zero runtime overhead.
**Decision:** Use CSS Modules for component-scoped styles plus global token file.
**Rationale:** Keeps bundle lean, avoids runtime CSS-in-JS, straightforward to theme.
**Alternatives:** Tailwind (faster but class-heavy), Styled Components (runtime cost). CSS Modules best fits simplicity.
**Risk:** Low—supported natively by Vite.

### Decision 4: Local Recent Search History
**Context:** Provide nod towards forthcoming preferences sprint without backend storage.
**Decision:** Keep last five searches in a React context persisted via `localStorage`.
**Rationale:** Offers UX continuity, demonstrates architecture for Sprint 3.
**Alternatives:** Skip feature; but simple to include and valuable.
**Risk:** Low—gracefully degrades if storage unavailable.

## Implementation Plan
1. `npx create-vite@latest weather-webui --template react-ts`; add ESLint, Prettier config aligning with repo style, and `.nvmrc` if needed.
2. Add `.env.example`, configure Vite proxy for `/api` during `npm run dev` (forward to `localhost:8080`).
3. Implement API client + type definitions; ensure error normalization.
4. Build feature components and hooks, wiring React Query provider with sensible defaults.
5. Add CSS Modules + token file, ensuring responsive layout and accessibility requirements.
6. Configure scripts (`npm run check` combines `tsc --noEmit` + `eslint --ext .ts,.tsx`).
7. Update documentation (README, sprint implementation doc) with new dev workflow.
8. Prepare tests (Vitest) and shell-based verification steps.
9. After implementation/test/documentation, mark statuses `tested` and update PROGRESS_BOARD accordingly.

## References
- `progress/sprint_5/sprint_5_analysis.md`
- `progress/sprint_4/sprint_4_design.md`
- `weather-api/responses/types.go`
- `rules/generic/GENERAL_RULES.md`
