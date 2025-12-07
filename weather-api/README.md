# Weather API

RESTful HTTP service providing weather forecast data in JSON format.

## Overview

This REST API exposes weather forecast data for cities and GPS coordinates. Built in Go, it provides programmatic access to weather information from Open-Meteo APIs.

**Version:** 1.0.0
**Port:** 8080 (configurable via `PORT` environment variable)

## Prerequisites

- Go 1.21+ installed
- Internet connectivity (for Open-Meteo API access)
- Sprint 2 `weather-cli` package (in `../weather-cli/`)

## Installation

```bash
# Navigate to project directory
cd weather-api

# Build the server
go build -o weather-api

# The binary weather-api is now ready to run
```

## Configuration

**Port Configuration:**

Set the `PORT` environment variable to use a custom port:

```bash
PORT=9090 ./weather-api
```

Default port: 8080

## Running the Server

**Start the server:**

```bash
./weather-api
```

**Expected output:**
```
Starting weather API server on :8080
Endpoints:
  GET /weather/city?name=<city>
  GET /weather/coordinates?lat=<lat>&lon=<lon>
  GET /health
```

**Stop the server:**

Press `Ctrl+C` or send SIGTERM signal.

## API Endpoints

### 1. Health Check

Check if the API server is running.

**Endpoint:** `GET /health`

**Example:**
```bash
curl http://localhost:8080/health
```

**Response (HTTP 200):**
```json
{
  "status": "healthy",
  "service": "weather-api",
  "version": "1.0.0"
}
```

---

### 2. Get Weather by City Name

Retrieve weather forecast for a city by name.

**Endpoint:** `GET /weather/city`

**Query Parameters:**
- `name` (string, required) - City name

**Example:**
```bash
curl "http://localhost:8080/weather/city?name=Tokyo"
```

**Response (HTTP 200):**
```json
{
  "location": {
    "name": "Tokyo",
    "latitude": 35.6895,
    "longitude": 139.6917,
    "country": "Japan",
    "admin1": "Tokyo"
  },
  "forecast": {
    "latitude": 35.7,
    "longitude": 139.6875,
    "timezone": "Asia/Tokyo",
    "current": {
      "time": "2025-12-07T17:30",
      "temperature_2m": 10.7,
      "weather_code": 0
    },
    "daily": {
      "time": ["2025-12-07", "2025-12-08", "2025-12-09"],
      "temperature_2m_max": [14.2, 18.0, 11.4],
      "temperature_2m_min": [2.5, 4.5, 5.6],
      "weather_code": [0, 1, 2]
    }
  }
}
```

**Error Responses:**

*City Not Found (HTTP 404):*
```json
{
  "error": "city not found",
  "message": "No results found for city: InvalidCity"
}
```

*Missing Parameter (HTTP 400):*
```json
{
  "error": "bad request",
  "message": "Missing required parameter: name"
}
```

---

### 3. Get Weather by GPS Coordinates

Retrieve weather forecast for specific GPS coordinates.

**Endpoint:** `GET /weather/coordinates`

**Query Parameters:**
- `lat` (float, required) - Latitude (-90 to 90)
- `lon` (float, required) - Longitude (-180 to 180)

**Example:**
```bash
curl "http://localhost:8080/weather/coordinates?lat=35.6895&lon=139.6917"
```

**Response (HTTP 200):**
```json
{
  "forecast": {
    "latitude": 35.6895,
    "longitude": 139.6917,
    "timezone": "Asia/Tokyo",
    "current": {
      "time": "2025-12-07T17:30",
      "temperature_2m": 10.7,
      "weather_code": 0
    },
    "daily": {
      "time": ["2025-12-07", "2025-12-08", "2025-12-09"],
      "temperature_2m_max": [14.2, 18.0, 11.4],
      "temperature_2m_min": [2.5, 4.5, 5.6],
      "weather_code": [0, 1, 2]
    }
  }
}
```

**Error Responses:**

*Invalid Latitude (HTTP 400):*
```json
{
  "error": "bad request",
  "message": "Latitude must be between -90 and 90"
}
```

*Invalid Longitude (HTTP 400):*
```json
{
  "error": "bad request",
  "message": "Longitude must be between -180 and 180"
}
```

*Missing Parameters (HTTP 400):*
```json
{
  "error": "bad request",
  "message": "Missing required parameters: lat and lon"
}
```

*Invalid Format (HTTP 400):*
```json
{
  "error": "bad request",
  "message": "Invalid latitude format"
}
```

---

## HTTP Status Codes

| Code | Description | When Used |
|------|-------------|-----------|
| 200 | OK | Request successful, data returned |
| 400 | Bad Request | Missing/invalid parameters |
| 404 | Not Found | City not found in geocoding |
| 500 | Internal Server Error | API failure or server error |

---

## Examples

### City Weather with Spaces

```bash
# URL encode city names with spaces
curl "http://localhost:8080/weather/city?name=San%20Francisco"

# Or use quotes (curl handles encoding)
curl "http://localhost:8080/weather/city?name=New York"
```

### Pretty-Print JSON

```bash
# Use jq for formatted output
curl -s "http://localhost:8080/weather/city?name=Tokyo" | jq .
```

### Extract Specific Fields

```bash
# Get current temperature only
curl -s "http://localhost:8080/weather/city?name=Tokyo" | jq '.forecast.current.temperature_2m'

# Get location name
curl -s "http://localhost:8080/weather/city?name=London" | jq -r '.location.name'
```

### Check HTTP Status Code

```bash
# Show status code only
curl -w "%{http_code}\n" -s -o /dev/null "http://localhost:8080/health"
```

---

## Weather Code Reference

The `weather_code` field uses Open-Meteo weather codes:

| Code | Description |
|------|-------------|
| 0 | Clear sky |
| 1 | Mainly clear |
| 2 | Partly cloudy |
| 3 | Overcast |
| 45, 48 | Foggy |
| 51, 53, 55 | Drizzle |
| 61, 63, 65 | Rain |
| 71, 73, 75 | Snow |
| 95, 96, 99 | Thunderstorm |

See [Open-Meteo documentation](https://open-meteo.com/en/docs) for complete list.

---

## Architecture

**Zero Code Duplication Design:**

This API imports the `weather-cli/weather` package from Sprint 2, achieving zero duplication of weather logic:

```go
import "weather-cli/weather"

// Reuse Sprint 2 functions:
forecast, location, err := weather.GetWeatherForCity(cityName)
forecast, err := weather.GetWeatherForCoordinates(lat, lon)
```

**Components:**
- **Sprint 3 (this API):** HTTP server, routing, JSON encoding (~300 lines)
- **Sprint 2 (imported):** Weather logic, API calls, data structures (~150 lines)
- **Result:** 80%+ code reuse, zero API logic duplication

---

## Testing

See `../progress/sprint_3/sprint_3_tests.md` for comprehensive test documentation.

**Quick Smoke Test:**

```bash
# Start server
./weather-api &
SERVER_PID=$!

# Test health check
curl -s http://localhost:8080/health

# Test city weather
curl -s "http://localhost:8080/weather/city?name=Tokyo" | jq .

# Stop server
kill $SERVER_PID
```

---

## Troubleshooting

**Port Already in Use:**

```bash
# Use custom port
PORT=9090 ./weather-api
```

**Cannot Connect:**

Verify server is running:
```bash
curl http://localhost:8080/health
```

If no response, check server logs for errors.

**City Not Found:**

Try:
- Different spelling (e.g., "München" vs "Munich")
- Include country (e.g., "Paris, France")
- Use coordinates endpoint instead

**API Errors (HTTP 500):**

Check:
- Internet connectivity
- Open-Meteo API is accessible: `curl https://api.open-meteo.com/v1/forecast`

---

## Development

**Project Structure:**

```
weather-api/
├── main.go      # HTTP server + handlers
├── go.mod       # Module definition
├── go.sum       # Dependency checksums
└── README.md    # This file
```

**Dependencies:**

- Go standard library only
- Sprint 2 `weather-cli/weather` package (local import)

**Build:**

```bash
go build -o weather-api
```

**Run Tests:**

```bash
# Execute tests from test documentation
bash ../progress/sprint_3/sprint_3_tests.md
```

---

## Future Enhancements

Recommended improvements for production:

1. **Caching:** Add response caching to reduce API calls
2. **Rate Limiting:** Protect against request flooding
3. **Metrics:** Add Prometheus metrics endpoint
4. **Logging:** Structured JSON logging
5. **Graceful Shutdown:** Handle SIGTERM/SIGINT properly
6. **CORS:** Enable cross-origin requests for web clients
7. **API Versioning:** Add `/v1` prefix to endpoints
8. **Authentication:** Optional API key support

---

## License

Part of RUP Strikes Back demo project.

---

## Related Documentation

- **Sprint 2 CLI:** `../weather-cli/README.md`
- **Design:** `../progress/sprint_3/sprint_3_design.md`
- **Tests:** `../progress/sprint_3/sprint_3_tests.md`
- **Implementation:** `../progress/sprint_3/sprint_3_implementation.md`

---

## Support

For issues or questions, see project documentation in `../progress/sprint_3/`.
