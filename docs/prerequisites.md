# Prerequisites - Weather Forecast Application (macOS)

## Overview

This document provides step-by-step setup instructions for developing and running the Weather Forecast Application on macOS. The application is built using Go and integrates with the Open-Meteo weather API.

**Platform Support:** macOS only (macOS 11.0 Big Sur or later recommended)

**Key Features:**
- CLI weather forecast tool
- REST API server
- Web-based user interface
- Map integration for location visualization

## macOS Requirements

### System Requirements

- **Operating System:** macOS 11.0 (Big Sur) or later
- **Package Manager:** Homebrew
- **Internet Connectivity:** Required for API access and package installation
- **Disk Space:** ~500MB for Go installation and dependencies

### Quick Setup Checklist

Use this checklist to track your progress:

- [ ] Homebrew installed
- [ ] Go language installed
- [ ] Go environment configured and verified
- [ ] Weather API tested and accessible
- [ ] Geocoding API tested and accessible

## Go Installation (Homebrew)

### Step 1: Install Homebrew (if not already installed)

Check if Homebrew is installed:

```bash
which brew
```

If Homebrew is not installed, install it:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Expected output:** Installation progress, then instructions to add Homebrew to PATH (if needed).

**Note:** Follow any post-installation instructions to add Homebrew to your shell PATH.

### Step 2: Install Go

Install Go using Homebrew:

```bash
brew install go
```

**Expected output:**

```
==> Downloading https://ghcr.io/v2/homebrew/core/go/manifests/...
==> Installing go
==> Pouring go--...
```

### Step 3: Verify Go Installation

Check Go version:

```bash
go version
```

**Expected output:**

```
go version go1.21.X darwin/amd64
```

(Version number may vary; Go 1.21+ recommended)

### Step 4: Verify Go Environment

Check Go environment configuration:

```bash
go env GOPATH
go env GOROOT
```

**Expected output:**

```
/Users/yourusername/go
/opt/homebrew/Cellar/go/1.21.X/libexec
```

(Paths will vary based on your username and Go version)

### Step 5: Configure GOPATH (Optional)

Homebrew typically configures Go correctly. If you need to customize GOPATH, add to your shell profile (~/.zshrc or ~/.bash_profile):

```bash
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
```

Then reload your shell:

```bash
source ~/.zshrc
```

## Weather Service Setup

### Selected Service: Open-Meteo

**Why Open-Meteo?**

Open-Meteo was selected for this project because:

✅ **No API key required** - Simplifies setup for MVP
✅ **Generous free tier** - Unlimited requests for non-commercial use
✅ **16-day forecast** - Exceeds our 3-day minimum requirement
✅ **GPS coordinate support** - Required for map integration features
✅ **Well-documented JSON API** - Easy to integrate with Go
✅ **Active maintenance** - Reliable and up-to-date service

### Weather Service Comparison

| Service | API Key Required | Free Tier | Forecast Days | GPS Support | City Name Support |
|---------|------------------|-----------|---------------|-------------|-------------------|
| **Open-Meteo** | No | Unlimited | 16 | Yes | Via geocoding API |
| OpenWeatherMap | Yes | 1,000,000/mo | 5 | Yes | Yes (direct) |
| WeatherAPI.com | Yes | 1,000,000/mo | 3 | Yes | Yes (direct) |
| WeatherStack | Yes | 1,000/mo | 0 (current only) | Yes | Yes (direct) |

### API Endpoints

#### Weather Forecast API

**Endpoint:** `https://api.open-meteo.com/v1/forecast`

**Method:** GET

**Parameters:**
- `latitude`: GPS latitude (required)
- `longitude`: GPS longitude (required)
- `daily`: Comma-separated list of daily parameters (e.g., `temperature_2m_max,temperature_2m_min,weathercode`)
- `timezone`: Timezone for results (optional, default: GMT)

**Example Request:**

```bash
curl "https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=America/Los_Angeles"
```

**Expected Response:**

```json
{
  "latitude": 37.78,
  "longitude": -122.42,
  "generationtime_ms": 0.123,
  "utc_offset_seconds": -28800,
  "timezone": "America/Los_Angeles",
  "timezone_abbreviation": "PST",
  "elevation": 28.0,
  "daily_units": {
    "time": "iso8601",
    "temperature_2m_max": "°C",
    "temperature_2m_min": "°C",
    "weathercode": "wmo code",
    "precipitation_sum": "mm"
  },
  "daily": {
    "time": ["2025-11-13", "2025-11-14", "2025-11-15", ...],
    "temperature_2m_max": [18.5, 19.2, 17.8, ...],
    "temperature_2m_min": [12.3, 13.1, 11.9, ...],
    "weathercode": [3, 2, 1, ...],
    "precipitation_sum": [0.0, 2.3, 0.5, ...]
  }
}
```

#### Geocoding API (City Name → Coordinates)

**Endpoint:** `https://geocoding-api.open-meteo.com/v1/search`

**Method:** GET

**Parameters:**
- `name`: City name (required)
- `count`: Number of results to return (default: 10)
- `language`: Response language (default: en)
- `format`: Response format (default: json)

**Example Request:**

```bash
curl "https://geocoding-api.open-meteo.com/v1/search?name=San Francisco&count=5&language=en&format=json"
```

**Expected Response:**

```json
{
  "results": [
    {
      "id": 5391959,
      "name": "San Francisco",
      "latitude": 37.77493,
      "longitude": -122.41942,
      "elevation": 16.0,
      "feature_code": "PPLA2",
      "country_code": "US",
      "admin1_id": 5332921,
      "timezone": "America/Los_Angeles",
      "population": 873965,
      "country_id": 6252001,
      "country": "United States",
      "admin1": "California"
    },
    ...
  ],
  "generationtime_ms": 1.234
}
```

### Testing the APIs

#### Test 1: Weather Forecast API

Test the weather forecast API with San Francisco coordinates:

```bash
curl "https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto"
```

**Success Criteria:**
- HTTP 200 response
- JSON output with daily forecast data
- No error messages

#### Test 2: Geocoding API

Test the geocoding API with a city name:

```bash
curl "https://geocoding-api.open-meteo.com/v1/search?name=London&count=3"
```

**Success Criteria:**
- HTTP 200 response
- JSON output with city results including coordinates
- Multiple results for disambiguation (if applicable)

#### Test 3: Combined Workflow

Get weather for a city by name:

```bash
# Step 1: Get coordinates for Paris
curl "https://geocoding-api.open-meteo.com/v1/search?name=Paris&count=1"

# Step 2: Extract latitude/longitude from result (48.8566, 2.3522)
# Step 3: Get weather for those coordinates
curl "https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&daily=temperature_2m_max,temperature_2m_min&timezone=auto"
```

**Success Criteria:**
- Both API calls succeed
- Coordinate extraction possible from geocoding response
- Weather data returned for the coordinates

## Verification Checklist

Complete this checklist to verify your setup:

### Go Environment

- [ ] Run `go version` - returns Go 1.21+ version
- [ ] Run `go env GOPATH` - returns valid path (e.g., `/Users/username/go`)
- [ ] Run `go env GOROOT` - returns valid path (e.g., `/opt/homebrew/Cellar/go/...`)
- [ ] Create test file: `echo 'package main\nimport "fmt"\nfunc main() { fmt.Println("Hello") }' > test.go`
- [ ] Run test file: `go run test.go` - outputs "Hello"
- [ ] Remove test file: `rm test.go`

### Weather API Access

- [ ] Weather forecast API responds with valid JSON
- [ ] Geocoding API responds with valid JSON
- [ ] Both APIs return HTTP 200 status
- [ ] No authentication errors (no API key needed)
- [ ] Network connectivity confirmed

### System Configuration

- [ ] macOS version is 11.0 or later: `sw_vers`
- [ ] Homebrew installed: `brew --version`
- [ ] curl available: `which curl`
- [ ] Internet connectivity confirmed

## Troubleshooting

### Common Issues

#### Issue 1: Homebrew not found after installation

**Symptom:** `brew: command not found`

**Solution:**

Add Homebrew to your PATH. For M1/M2 Macs:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc
```

For Intel Macs:

```bash
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc
```

#### Issue 2: Go command not found after installation

**Symptom:** `go: command not found`

**Solution:**

Homebrew should add Go to PATH automatically. If not:

```bash
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Verify with: `which go`

#### Issue 3: API request timeout

**Symptom:** `curl: (28) Connection timed out`

**Solution:**

- Check internet connectivity: `ping 8.8.8.8`
- Verify firewall settings allow HTTP/HTTPS
- Try with a different network
- Check if corporate proxy requires configuration

#### Issue 4: API returns error or empty response

**Symptom:** API returns error JSON or empty results

**Solution:**

- Verify request parameters are correct
- Check API endpoint URL for typos
- Ensure coordinates are valid (latitude: -90 to 90, longitude: -180 to 180)
- Test with known-good coordinates (e.g., 51.5074, -0.1278 for London)

## Next Steps

Once prerequisites are complete, you're ready to proceed to **Sprint 2** - CLI implementation.

The CLI will:
- Accept city names or GPS coordinates as input
- Use the Geocoding API to convert city names to coordinates
- Query the Weather Forecast API for weather data
- Display current weather and 3-day forecast

## Additional Resources

### Official Documentation

- **Go Language:** https://golang.org/doc/
- **Open-Meteo API Docs:** https://open-meteo.com/en/docs
- **Open-Meteo Geocoding API:** https://open-meteo.com/en/docs/geocoding-api
- **Homebrew:** https://brew.sh/

### API Documentation

- **Forecast API Parameters:** https://open-meteo.com/en/docs#api-documentation
- **Weather Code Reference:** https://open-meteo.com/en/docs#weathervariables
- **Timezone List:** https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

### Alternative Weather Services (Fallback)

If Open-Meteo proves insufficient, consider:

- **OpenWeatherMap:** https://openweathermap.org/api (requires free API key)
- **WeatherAPI.com:** https://www.weatherapi.com/ (requires free API key)

## Support

For issues specific to this project, refer to the project repository documentation or contact the development team.

---

**Document Version:** 1.0
**Last Updated:** 2025-11-13
**Platform:** macOS only
**Sprint:** Sprint 1 - Prerequisites
