# Weather WebUI

Modern React + TypeScript single-page application that consumes the Sprint 4 weather REST API. This module lives alongside the Go services and communicates **exclusively** over HTTP.

## Prerequisites

- Node.js 20+
- npm 10+
- `weather-api` running locally on `http://localhost:8080` (or provide a different base URL via environment variable)

## Environment

Create a `.env` file (see `.env.example`):

```
VITE_API_BASE_URL=http://localhost:8080
```

## Scripts

| Command           | Description                                          |
|-------------------|------------------------------------------------------|
| `npm install`     | Install dependencies                                 |
| `npm run dev`     | Start Vite dev server with API proxy                 |
| `npm run build`   | Type-check and produce production build              |
| `npm run preview` | Serve the `dist/` bundle locally                     |
| `npm run lint`    | Run ESLint                                           |
| `npm run test`    | Execute Vitest suite                                 |
| `npm run check`   | Lint → unit tests → production build (CI parity)     |

## Development Flow

1. Start the Go API: `cd weather-api && go run .`
2. In another terminal: `cd weather-webui && npm run dev`
3. Visit `http://localhost:5173` (proxy forwards `/api` calls to the API).

## Production Build

```
npm run build
npm run preview  # optional smoke test
```

Contents of `dist/` may be deployed to any static host (Netlify, S3, GitHub Pages, etc.). Configure `VITE_API_BASE_URL` accordingly during build.

## Architecture Highlights

- React + TypeScript + Vite
- TanStack Query for caching/retries
- CSS Modules with shared design tokens
- Accessible forms and live status banner
- Local storage backed recent-search history
- Unit tests for deterministic helpers with Vitest

## Sprint Context

- Sprint: 5 – WebUI
- Backlog Item: RSB-5
- Mode: YOLO (autonomous)
