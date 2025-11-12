# Sprint 2 - Design

**Date**: 2025-11-12
**Mode**: Managed (Interactive)
**Sprint**: 2 - CLI

---

## RSB-2: Weather Forecast CLI

**Status**: Accepted

### Requirement Summary

Command-line application that accepts city names or GPS coordinates, retrieves weather data from Open-Meteo API, and displays current weather plus 3-day forecast in formatted text output.

### Feasibility Analysis

**API Availability:**
✅ All required APIs verified:
- Open-Meteo Forecast API: `https://api.open-meteo.com/v1/forecast`
- Open-Meteo Geocoding API: `https://geocoding-api.open-meteo.com/v1/search`
- Both tested and documented in Sprint 1

**Technical Constraints:**
- Go 1.20+ (from Sprint 1)
- Cross-platform support (OSX/Linux/Windows)
- No external dependencies (stdlib only)
- Network required for API calls

**Risk Assessment:**
- **Low Risk**: API integration (well-documented, tested in Sprint 1)
- **Low Risk**: CLI implementation (standard Go patterns)
- **Medium Risk**: Geocoding ambiguity (multiple cities with same name - mitigated by displaying coordinates)

### Design Overview

**Architecture:**

```
┌─────────────────────────────────────────┐
│          weather-cli binary             │
└─────────────────────────────────────────┘
             │
             ├─→ main.go (CLI entry, arg parsing)
             │
             ├─→ geocode/
             │    └─ geocode.go (city → lat/lon)
             │
             ├─→ weather/
             │    └─ weather.go (API client, data fetch)
             │
             └─→ display/
                  └─ display.go (output formatting)
```

**Key Components:**

1. **main.go** - CLI entry point
   - Parse command-line arguments
   - Coordinate workflow (geocode → fetch → display)
   - Handle top-level errors

2. **geocode package** - City name resolution
   - Call Open-Meteo Geocoding API
   - Parse JSON responses
   - Return lat/lon coordinates

3. **weather package** - Weather data retrieval
   - Call Open-Meteo Forecast API
   - Parse weather data
   - Return structured weather information

4. **display package** - Output formatting
   - Format current weather
   - Format 3-day forecast table
   - Weather code → text mapping

**Data Flow:**

```
User Input (city/coords)
    ↓
CLI Argument Parsing
    ↓
Geocode? (if city name)
    ↓
Fetch Weather Data
    ↓
Format Output
    ↓
Display to Terminal
```

### Technical Specification

#### CLI Interface

**Command Format:**

```bash
# By city name
weather-cli "Berlin"
weather-cli --city "New York"

# By coordinates
weather-cli --lat 52.52 --lon 13.41

# Help
weather-cli --help

# Version
weather-cli --version
```

**Flags:**
- `--city <name>` or positional arg: City name for geocoding
- `--lat <latitude>`: GPS latitude (-90 to 90)
- `--lon <longitude>`: GPS longitude (-180 to 180)
- `--help`: Display usage information
- `--version`: Display application version

**Validation:**
- If positional arg: treat as city name
- If `--lat` and `--lon`: use coordinates directly
- If `--city`: use city name
- Error if both city and coordinates provided
- Error if neither provided

#### Geocoding API Integration

**Endpoint:**
```
GET https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json
```

**Request Example:**
```bash
curl "https://geocoding-api.open-meteo.com/v1/search?name=Berlin&count=1"
```

**Response Structure:**
```json
{
  "results": [
    {
      "id": 2950159,
      "name": "Berlin",
      "latitude": 52.52437,
      "longitude": 13.41053,
      "country": "Germany",
      "admin1": "Berlin"
    }
  ]
}
```

**Implementation:**
```go
type GeoLocation struct {
    Name      string  `json:"name"`
    Latitude  float64 `json:"latitude"`
    Longitude float64 `json:"longitude"`
    Country   string  `json:"country"`
}

func Geocode(cityName string) (*GeoLocation, error)
```

#### Weather API Integration

**Endpoint:**
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}
  &longitude={lon}
  &current_weather=true
  &daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum
  &timezone=auto
  &forecast_days=3
```

**Response Structure (simplified):**
```json
{
  "latitude": 52.52,
  "longitude": 13.41,
  "timezone": "Europe/Berlin",
  "current_weather": {
    "temperature": 15.3,
    "windspeed": 12.0,
    "winddirection": 230,
    "weathercode": 3,
    "time": "2025-11-12T14:30"
  },
  "daily": {
    "time": ["2025-11-13", "2025-11-14", "2025-11-15"],
    "temperature_2m_max": [17.2, 16.8, 18.1],
    "temperature_2m_min": [12.1, 11.5, 13.3],
    "weathercode": [3, 61, 2],
    "precipitation_sum": [2.5, 5.2, 0.0]
  }
}
```

**Data Structures:**
```go
type CurrentWeather struct {
    Temperature   float64 `json:"temperature"`
    WindSpeed     float64 `json:"windspeed"`
    WindDirection int     `json:"winddirection"`
    WeatherCode   int     `json:"weathercode"`
    Time          string  `json:"time"`
}

type DailyForecast struct {
    Time            []string  `json:"time"`
    TempMax         []float64 `json:"temperature_2m_max"`
    TempMin         []float64 `json:"temperature_2m_min"`
    WeatherCode     []int     `json:"weathercode"`
    Precipitation   []float64 `json:"precipitation_sum"`
}

type WeatherData struct {
    Latitude       float64         `json:"latitude"`
    Longitude      float64         `json:"longitude"`
    CurrentWeather CurrentWeather  `json:"current_weather"`
    Daily          DailyForecast   `json:"daily"`
}

func FetchWeather(lat, lon float64) (*WeatherData, error)
```

#### Weather Code Mapping

**WMO Weather interpretation codes:**
```go
var weatherCodes = map[int]string{
    0:  "Clear sky",
    1:  "Mainly clear",
    2:  "Partly cloudy",
    3:  "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
}

func GetWeatherDescription(code int) string {
    if desc, ok := weatherCodes[code]; ok {
        return desc
    }
    return fmt.Sprintf("Unknown (%d)", code)
}
```

#### Output Formatting

**Format Specification:**

```
Weather for [City] ([lat]°N/S, [lon]°E/W)

Current Conditions ([date] [time]):
Temperature: [temp]°C
Condition: [description]
Wind: [speed] km/h from [direction]

3-Day Forecast:
┌────────────┬──────────┬──────────┬──────────────┬──────────────┐
│    Date    │ Max Temp │ Min Temp │  Condition   │ Precipitation│
├────────────┼──────────┼──────────┼──────────────┼──────────────┤
│ 2025-11-13 │  17.2°C  │  12.1°C  │ Overcast     │    2.5 mm    │
│ 2025-11-14 │  16.8°C  │  11.5°C  │ Slight rain  │    5.2 mm    │
│ 2025-11-15 │  18.1°C  │  13.3°C  │ Partly cloudy│    0.0 mm    │
└────────────┴──────────┴──────────┴──────────────┴──────────────┘
```

**Table Drawing:**
```go
// Simple ASCII table formatter
func FormatForecastTable(daily *DailyForecast) string {
    // Build table with box-drawing characters
    // Handle column alignment
    // Format numbers with proper precision
}
```

#### Error Handling

**Error Scenarios:**

1. **Invalid Arguments**
   ```
   Error: Please provide either a city name or coordinates (--lat and --lon)
   Usage: weather-cli [city] OR weather-cli --lat [lat] --lon [lon]
   ```

2. **Geocoding Failure**
   ```
   Error: Could not find location "XYZ123"
   Please check the city name and try again.
   ```

3. **Network Error**
   ```
   Error: Could not connect to weather service
   Please check your internet connection and try again.
   ```

4. **API Error**
   ```
   Error: Weather service temporarily unavailable (HTTP 503)
   Please try again later.
   ```

5. **Invalid Coordinates**
   ```
   Error: Invalid coordinates (latitude must be between -90 and 90)
   ```

### Implementation Approach

**Step 1:** Project setup
- Create `weather-cli` directory
- Initialize Go module: `go mod init github.com/rstyczynski/weather-cli`
- Create package structure

**Step 2:** Implement geocode package
- HTTP client for geocoding API
- JSON parsing
- Error handling
- Unit tests with mock responses

**Step 3:** Implement weather package
- HTTP client for forecast API
- JSON parsing
- Weather code mapping
- Unit tests with mock responses

**Step 4:** Implement display package
- Current weather formatter
- Forecast table formatter
- Helper functions for number formatting

**Step 5:** Implement main.go
- CLI argument parsing with `flag`
- Workflow coordination
- Error handling and user messages

**Step 6:** Integration testing
- Test with real API calls
- Test various cities and coordinates
- Test error scenarios

**Step 7:** Build and package
- Build for multiple platforms
- Create installation instructions
- Update README.md

### Testing Strategy

**Unit Tests:**
1. Geocode function (mocked HTTP responses)
2. Weather fetch function (mocked HTTP responses)
3. Weather code mapping
4. Output formatting
5. Argument parsing

**Integration Tests:**
1. End-to-end with real APIs
2. Various city names
3. GPS coordinates
4. Invalid inputs

**Manual Tests:**
1. Cross-platform (OSX/Linux/Windows)
2. Network failure scenarios
3. Various locations worldwide

**Test Coverage Target:** 80%+

### Integration Notes

**Dependencies:**
- Sprint 1 (Go environment, Open-Meteo API selection)
- Standard library only (net/http, encoding/json, flag, fmt)

**Compatibility:**
- Builds foundation for Sprint 3 (add user preferences)
- Weather fetching logic reusable in Sprint 4 (REST API)

**Reusability:**
- `weather` package → can be used by REST API (Sprint 4)
- `geocode` package → reusable across all interfaces
- Data structures → shared types for future sprints

### Documentation Requirements

**User Documentation:**
- Installation instructions
- Usage examples (city name, coordinates)
- Example outputs
- Troubleshooting

**Technical Documentation:**
- Package documentation (godoc)
- API integration notes
- Build instructions

### Design Decisions

**Decision 1:** Standard library `flag` vs third-party CLI framework
**Rationale:** Simplicity, no dependencies, sufficient for requirements
**Alternatives:** Cobra (rejected: too heavy), urfave/cli (rejected: unnecessary complexity)

**Decision 2:** Open-Meteo Geocoding API
**Rationale:** Same provider as weather API, no additional API key
**Alternatives:** Nominatim (rejected: additional service), coordinates-only (rejected: poor UX)

**Decision 3:** ASCII table formatting
**Rationale:** Universal compatibility, readable in all terminals
**Alternatives:** Unicode box-drawing (considered but may have compatibility issues on Windows)

### Open Design Questions

**None** - All decisions approved in contracting phase

---

## Design Approval Status

**Status**: ✅ Accepted

**Design Completed**: 2025-11-12
**Approved**: 2025-11-12 by Product Owner

Ready for Construction phase.
