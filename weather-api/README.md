# Weather API

REST API exposing weather forecast data via HTTP with JSON responses.

## Overview

This API provides weather forecast data by city name or GPS coordinates. It wraps the Open-Meteo weather services and returns data in JSON format.

**Key Features:**
- Query weather by city name or coordinates
- JSON responses
- CORS enabled for WebUI access
- Health check endpoint

**Code Reuse:** Imports `weather-cli/weather` package (~80% code reuse from Sprint 2)

## Prerequisites

- Go 1.21 or later
- Sprint 2 `weather-cli` package (in parallel directory)
- Internet connectivity (for Open-Meteo APIs)

## Installation

```bash
# Build the API server
cd weather-api
go build -o weather-api

# Run the server
./weather-api
```

Server starts on port 8080 by default (configurable via `PORT` env var).

## API Endpoints

### GET /weather

Get weather forecast by city name or coordinates.

**Query Parameters:**
- `city` (string): City name (e.g., "London", "San Francisco")
- OR
- `lat` (float): Latitude (-90 to 90)
- `lon` (float): Longitude (-180 to 180)

**Examples:**

```bash
# Weather by city name
curl "http://localhost:8080/weather?city=London"

# Weather by coordinates
curl "http://localhost:8080/weather?lat=51.5074&lon=-0.1278"
```

**Success Response (200):**

```json
{
  "location": {
    "name": "London",
    "country": "United Kingdom",
    "latitude": 51.5074,
    "longitude": -0.1278
  },
  "current": {
    "time": "2025-12-07T15:00",
    "temperature_2m": 12.5,
    "weather_code": 2
  },
  "daily": {
    "time": ["2025-12-07", "2025-12-08", "2025-12-09"],
    "temperature_2m_max": [14.2, 13.8, 15.1],
    "temperature_2m_min": [8.1, 7.9, 9.5],
    "weather_code": [2, 3, 1]
  }
}
```

**Error Responses:**

- 400: Missing or invalid parameters
- 404: City not found
- 500: Server or external API error

### GET /health

Health check endpoint.

**Example:**

```bash
curl http://localhost:8080/health
```

**Response (200):**

```json
{"status":"ok"}
```

## CORS

CORS is enabled for all origins (`Access-Control-Allow-Origin: *`). This allows the WebUI (Sprint 4) to access the API from different origins.

**Note:** For production, restrict CORS to specific origins.

## Configuration

**Environment Variables:**

- `PORT`: Server port (default: 8080)

```bash
# Custom port
PORT=3000 ./weather-api
```

## Development

**Project Structure:**

```
weather-api/
├── main.go              # HTTP server setup
├── handlers/
│   └── weather.go       # Endpoint handlers
├── middleware/
│   └── cors.go          # CORS middleware
├── go.mod               # Go module (imports weather-cli)
└── README.md            # This file
```

**Testing:**

See `progress/sprint_3/sprint_3_tests.md` for comprehensive functional tests.

## Code Reuse from Sprint 2

This API reuses ~80% of code from Sprint 2 CLI:

| Component | Source | Reused |
|-----------|--------|--------|
| Geocoding API | `weather-cli/weather/api.go` | ✅ |
| Forecast API | `weather-cli/weather/api.go` | ✅ |
| Data structures | `weather-cli/weather/types.go` | ✅ |
| Core logic | `weather-cli/weather/client.go` | ✅ |

**Result:** Zero API logic duplication between CLI and REST API.

## License

Part of RUP Strikes Back demo project.
