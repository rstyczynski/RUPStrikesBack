# Weather API - REST Service

REST API server exposing weather forecast functionality via HTTP endpoints with JSON responses.

## Quick Start

```bash
# Build and run
go build
./weather-api

# Test
curl http://localhost:8080/api/v1/health
curl http://localhost:8080/api/v1/weather/city/Berlin
```

## Endpoints

- `GET /api/v1/weather/city/{city}` - Weather by city name
- `GET /api/v1/weather/coordinates?lat={lat}&lon={lon}` - Weather by GPS coordinates
- `GET /api/v1/health` - Health check

## Documentation

See `progress/sprint_4/sprint_4_implementation.md` for complete documentation including:
- API endpoint specifications
- Request/response examples
- Error handling
- Architecture overview
- Integration with Sprint 2 packages

## Features

- JSON responses (snake_case fields)
- HTTP status codes (200, 400, 404, 500)
- CORS support for browsers
- Graceful shutdown
- Request logging
- Panic recovery

## Dependencies

- Go 1.22+
- Sprint 2 packages (geocode, weather, display)
- Open-Meteo APIs (no API key required)

## Configuration

- `PORT` environment variable (default: 8080)

## Testing

See `progress/sprint_4/sprint_4_tests.md` for comprehensive test documentation.

## Sprint Information

- **Sprint**: 4 - REST API
- **Status**: implemented
- **Backlog Item**: RSB-4
- **Mode**: YOLO (autonomous)

## WebUI Integration (Sprint 5)

The `weather-webui/` module (Sprint 5) consumes this REST API via the following endpoints:

- `GET /api/v1/weather/city/{city}`
- `GET /api/v1/weather/coordinates?lat={lat}&lon={lon}`
- `GET /api/v1/health`

Ensure the API is reachable (default `http://localhost:8080`) before running `npm run dev` inside `weather-webui/`. Review `.env.example` in that module to override the base URL for remote deployments.
