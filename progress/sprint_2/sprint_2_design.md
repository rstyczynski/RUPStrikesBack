# Sprint 2 - Design

## RSB-2. Weather forecast CLI

Status: Proposed

### Requirement Summary

Build a command-line interface (CLI) application in Go that retrieves and displays weather forecasts. The CLI accepts either city names or GPS coordinates as input and displays current weather plus a 3-day forecast using the Open-Meteo APIs established in Sprint 1.

### Feasibility Analysis

**API Availability:**

All required APIs available and tested in Sprint 1:

1. **Open-Meteo Geocoding API:** `https://geocoding-api.open-meteo.com/v1/search`
   - Converts city names to GPS coordinates
   - Returns city information (name, country, coordinates)
   - Tested in Sprint 1 (100% success)

2. **Open-Meteo Forecast API:** `https://api.open-meteo.com/v1/forecast`
   - Provides weather forecast data
   - Requires GPS coordinates as input
   - Returns current weather and multi-day forecast
   - Tested in Sprint 1 (100% success)

**Go Standard Library Availability:**

All required functionality available in Go standard library:
- `net/http` - HTTP client for API calls
- `encoding/json` - JSON parsing
- `fmt` - Output formatting
- `os` - Command-line arguments, exit codes
- `strconv` - String to number conversion
- `strings` - String manipulation

**Technical Constraints:**

- macOS platform (per Sprint 1 scope)
- Go language (established in Sprint 1)
- No external dependencies for MVP
- Internet connectivity required (API-dependent)

**Risk Assessment:**

- **Go Compilation:** Low - Standard Go build process
- **API Integration:** Low - APIs proven functional in Sprint 1
- **Input Parsing:** Low - Well-established CLI patterns
- **Output Formatting:** Low - Simple text output
- **Error Handling:** Medium - Multiple failure points (network, API, parsing)

**Feasibility Conclusion:** HIGH - All components proven, standard Go patterns apply

### Design Overview

**Architecture:**

```
User Input (CLI args)
        ↓
Input Parser & Validator
        ↓
    ┌─────────┴─────────┐
    ↓                   ↓
City Name         GPS Coordinates
    ↓                   ↓
Geocoding API           |
    ↓                   |
GPS Coordinates ←───────┘
    ↓
Weather Forecast API
    ↓
Response Parser
    ↓
Output Formatter
    ↓
Terminal Display
```

**Key Components:**

**REUSABLE COMPONENTS (Sprint 3 REST API will import these):**

1. **Core Weather Client** (`weather/client.go`)
   - High-level weather retrieval functions
   - Coordinates geocoding + forecast fetching
   - Business logic layer
   - **REUSED BY:** REST API handlers in Sprint 3

2. **API Client** (`weather/api.go`)
   - Geocoding API caller
   - Weather Forecast API caller
   - HTTP request handling
   - Response parsing
   - **REUSED BY:** REST API in Sprint 3

3. **Data Structures** (`weather/types.go`)
   - API response types
   - Location data
   - Forecast data
   - **REUSED BY:** REST API JSON responses in Sprint 3

**CLI-SPECIFIC COMPONENTS (NOT reused by REST API):**

4. **Main Entry Point** (`main.go`)
   - Parse command-line arguments
   - Validate input
   - Call weather package functions
   - Handle errors and exit codes
   - **CLI-specific:** REST API will have HTTP server instead

5. **CLI Output Formatter** (`cli/format.go`)
   - Format weather data for terminal display
   - Create human-readable text
   - **CLI-specific:** REST API will use JSON encoding instead

**Data Flow:**

1. User runs: `./weather-cli "San Francisco"` or `./weather-cli 37.7749,-122.4194`
2. CLI detects input type
3. If city name: Call Geocoding API → Extract coordinates
4. Call Weather Forecast API with coordinates
5. Parse JSON response
6. Format and display weather data
7. Exit with code 0 (success) or 1 (error)

### Technical Specification

**Project Structure:**

**IMPORTANT: Designed for Reusability with Sprint 3 REST API**

This structure ensures **zero code duplication** when building the REST API in Sprint 3:

```
weather-cli/
├── main.go           # Entry point, CLI handling (CLI-specific)
├── weather/          # ← REUSABLE CORE PACKAGE (Sprint 3 will import this!)
│   ├── client.go     # Core weather logic (REUSABLE)
│   ├── api.go        # API client functions (REUSABLE)
│   └── types.go      # Data structures for API responses (REUSABLE)
├── cli/
│   └── format.go     # CLI-specific text formatting (NOT reused by REST API)
└── README.md         # Build and usage instructions
```

**Reusability Strategy:**
- `weather/` package contains ALL business logic (API calls, data structures, core functions)
- `cli/format.go` contains ONLY CLI-specific text formatting
- Sprint 3 REST API will `import "weather-cli/weather"` and provide JSON formatting instead
- **Result:** ~80% code reuse, zero duplication of API logic

**APIs Used:**

#### Geocoding API

**Endpoint:** `https://geocoding-api.open-meteo.com/v1/search`

**Method:** GET

**Parameters:**
- `name`: City name (URL encoded)
- `count`: Number of results (default: 1)
- `language`: en
- `format`: json

**Example Request:**
```go
url := fmt.Sprintf("https://geocoding-api.open-meteo.com/v1/search?name=%s&count=1&language=en&format=json",
    url.QueryEscape(cityName))
```

**Response Structure:**
```go
type GeocodingResponse struct {
    Results []struct {
        Name      string  `json:"name"`
        Latitude  float64 `json:"latitude"`
        Longitude float64 `json:"longitude"`
        Country   string  `json:"country"`
        Admin1    string  `json:"admin1"`    // State/Province
    } `json:"results"`
}
```

#### Weather Forecast API

**Endpoint:** `https://api.open-meteo.com/v1/forecast`

**Method:** GET

**Parameters:**
- `latitude`: float
- `longitude`: float
- `current`: current weather parameters (comma-separated)
- `daily`: daily forecast parameters (comma-separated)
- `timezone`: auto
- `forecast_days`: 3

**Example Request:**
```go
url := fmt.Sprintf("https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=3",
    lat, lon)
```

**Response Structure:**
```go
type ForecastResponse struct {
    Latitude  float64 `json:"latitude"`
    Longitude float64 `json:"longitude"`
    Timezone  string  `json:"timezone"`
    Current   struct {
        Time          string  `json:"time"`
        Temperature2m float64 `json:"temperature_2m"`
        WeatherCode   int     `json:"weather_code"`
    } `json:"current"`
    Daily struct {
        Time             []string  `json:"time"`
        Temperature2mMax []float64 `json:"temperature_2m_max"`
        Temperature2mMin []float64 `json:"temperature_2m_min"`
        WeatherCode      []int     `json:"weather_code"`
    } `json:"daily"`
}
```

**Data Structures:**

**File: `weather/types.go` - REUSABLE by Sprint 3 REST API**

```go
// types.go - Shared data structures for CLI and REST API
package weather

type GeocodingResponse struct {
    Results []Location `json:"results"`
}

type Location struct {
    Name      string  `json:"name"`
    Latitude  float64 `json:"latitude"`
    Longitude float64 `json:"longitude"`
    Country   string  `json:"country"`
    Admin1    string  `json:"admin1"`
}

type ForecastResponse struct {
    Latitude  float64        `json:"latitude"`
    Longitude float64        `json:"longitude"`
    Timezone  string         `json:"timezone"`
    Current   CurrentWeather `json:"current"`
    Daily     DailyForecast  `json:"daily"`
}

type CurrentWeather struct {
    Time          string  `json:"time"`
    Temperature2m float64 `json:"temperature_2m"`
    WeatherCode   int     `json:"weather_code"`
}

type DailyForecast struct {
    Time             []string  `json:"time"`
    Temperature2mMax []float64 `json:"temperature_2m_max"`
    Temperature2mMin []float64 `json:"temperature_2m_min"`
    WeatherCode      []int     `json:"weather_code"`
}
```

**CLI Interface:**

**Command Syntax:**
```bash
# City name (positional argument)
./weather-cli "San Francisco"
./weather-cli "Tokyo"
./weather-cli "London, UK"

# GPS coordinates (latitude,longitude)
./weather-cli "37.7749,-122.4194"
./weather-cli "51.5074,-0.1278"

# Help
./weather-cli --help
./weather-cli -h
```

**Input Detection Logic:**
```go
func detectInputType(arg string) (isCoordinate bool, lat, lon float64, cityName string, err error) {
    // Check if input contains comma (coordinate format)
    if strings.Contains(arg, ",") {
        parts := strings.Split(arg, ",")
        if len(parts) != 2 {
            return false, 0, 0, "", fmt.Errorf("invalid coordinate format")
        }

        lat, err = strconv.ParseFloat(strings.TrimSpace(parts[0]), 64)
        if err != nil {
            return false, 0, 0, "", fmt.Errorf("invalid latitude")
        }

        lon, err = strconv.ParseFloat(strings.TrimSpace(parts[1]), 64)
        if err != nil {
            return false, 0, 0, "", fmt.Errorf("invalid longitude")
        }

        // Validate ranges
        if lat < -90 || lat > 90 {
            return false, 0, 0, "", fmt.Errorf("latitude must be between -90 and 90")
        }
        if lon < -180 || lon > 180 {
            return false, 0, 0, "", fmt.Errorf("longitude must be between -180 and 180")
        }

        return true, lat, lon, "", nil
    }

    // Otherwise, treat as city name
    return false, 0, 0, arg, nil
}
```

**Output Format:**

```
Weather Forecast
================

Location: San Francisco, CA, United States
Coordinates: 37.77°N, 122.42°W

Current Weather:
  Temperature: 18.5°C
  Conditions: Partly cloudy

3-Day Forecast:
  Thu, Nov 14: ↑19.2°C ↓13.1°C - Clear sky
  Fri, Nov 15: ↑17.8°C ↓11.9°C - Cloudy
  Sat, Nov 16: ↑18.1°C ↓12.5°C - Partly cloudy
```

**Weather Code Mapping:**
```go
func weatherCodeToDescription(code int) string {
    codes := map[int]string{
        0:  "Clear sky",
        1:  "Mainly clear",
        2:  "Partly cloudy",
        3:  "Overcast",
        45: "Foggy",
        48: "Rime fog",
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
        96: "Thunderstorm with hail",
        99: "Thunderstorm with heavy hail",
    }

    if desc, ok := codes[code]; ok {
        return desc
    }
    return "Unknown"
}
```

**Error Handling:**

```go
// Exit codes
const (
    ExitSuccess = 0
    ExitInvalidInput = 1
    ExitAPIError = 2
    ExitNetworkError = 3
)

// Error messages to stderr
func handleError(err error, exitCode int) {
    fmt.Fprintf(os.Stderr, "Error: %v\n", err)
    os.Exit(exitCode)
}

// Usage example
if err != nil {
    handleError(fmt.Errorf("failed to fetch weather data: %w", err), ExitAPIError)
}
```

### Implementation Approach

**REUSABILITY PRINCIPLE:** Implement core logic in `weather/` package for Sprint 3 reuse.

**Step 1: Project Setup**
- Create `weather-cli/` directory
- Initialize Go module: `go mod init weather-cli`
- Create package structure: `weather/` and `cli/`

**Step 2: Implement Reusable Data Types**
- Create `weather/types.go`
- Define structs matching API JSON responses
- **Note:** Sprint 3 REST API will reuse these exact types

**Step 3: Implement Reusable API Client**
- Create `weather/api.go`
- Implement `GeocodeCity(cityName string) (*Location, error)`
- Implement `GetForecast(lat, lon float64) (*ForecastResponse, error)`
- Add HTTP client with timeouts
- **Note:** Sprint 3 REST API will import and reuse these functions

**Step 4: Implement Reusable Core Logic**
- Create `weather/client.go`
- Implement `GetWeatherForCity(cityName string) (*ForecastResponse, *Location, error)`
- Implement `GetWeatherForCoordinates(lat, lon float64) (*ForecastResponse, error)`
- Coordinate geocoding + forecast calls
- **Note:** Sprint 3 REST API handlers will call these high-level functions

**Step 5: Implement CLI-Specific Formatter**
- Create `cli/format.go` (separate from reusable `weather/` package)
- Implement `FormatForecast(forecast *ForecastResponse, location *Location) string`
- Add weather code mapping
- Format temperatures and dates as text
- **Note:** Sprint 3 will NOT use this; it will use JSON encoding instead

**Step 6: Implement Main CLI**
- Create `main.go`
- Parse command-line arguments
- Implement input detection
- Call `weather.GetWeatherForCity()` or `weather.GetWeatherForCoordinates()`
- Use `cli.FormatForecast()` for text output
- Add error handling and exit codes

**Step 7: Build and Test**
- Build binary: `go build -o weather-cli`
- Test with various inputs
- Verify error handling
- Document reusable components for Sprint 3

**Step 8: Prepare for Sprint 3 Reuse**
- Document which packages are reusable (`weather/`)
- Note that `cli/` package is CLI-specific
- Sprint 3 will import `weather-cli/weather` package

### Testing Strategy

**Unit Tests (Go):**

```go
// weather/api_test.go
func TestGeocodeCity(t *testing.T) {
    // Test successful geocoding
    // Test city not found
    // Test network error
}

func TestGetForecast(t *testing.T) {
    // Test successful forecast retrieval
    // Test invalid coordinates
    // Test network error
}

// weather/format_test.go
func TestWeatherCodeToDescription(t *testing.T) {
    // Test known codes
    // Test unknown codes
}

func TestFormatForecast(t *testing.T) {
    // Test output formatting
}
```

**Functional Tests (Bash):**

Documented in `sprint_2_tests.md`:
- Test city name input
- Test GPS coordinate input
- Test invalid city name
- Test invalid coordinates
- Test help flag
- Test network error scenarios

**Success Criteria:**

- ✅ CLI builds successfully
- ✅ City name input works
- ✅ GPS coordinate input works
- ✅ Current weather displayed
- ✅ 3-day forecast displayed
- ✅ Error handling works
- ✅ Help text displays
- ✅ Exit codes correct

### Integration Notes

**Dependencies:**

- Sprint 1: Go environment, Open-Meteo APIs

**Compatibility:**

**Forward Compatibility - ZERO CODE DUPLICATION with Sprint 3:**

```
Sprint 2 (CLI) - Creates reusable core:
  weather-cli/
    ├── weather/           ← REUSABLE CORE
    │   ├── client.go      ← Sprint 3 imports this
    │   ├── api.go         ← Sprint 3 imports this
    │   └── types.go       ← Sprint 3 imports this
    └── cli/
        └── format.go      ← CLI-specific, NOT reused

Sprint 3 (REST API) - Imports Sprint 2 core:
  weather-api/
    ├── main.go            ← HTTP server
    └── handlers/
        └── weather.go     ← import "weather-cli/weather"
                              Calls weather.GetWeatherForCity()
                              Returns JSON instead of formatted text

Sprint 4-5 (WebUI) - Consumes Sprint 3 REST API
```

**Reusability Guarantee:**

| Component | Sprint 2 Implementation | Sprint 3 Reuse |
|-----------|------------------------|----------------|
| Geocoding API calls | weather/api.go | ✅ Imported directly |
| Forecast API calls | weather/api.go | ✅ Imported directly |
| Data structures | weather/types.go | ✅ Used for JSON responses |
| Core weather logic | weather/client.go | ✅ Called by HTTP handlers |
| HTTP client | weather/api.go | ✅ Reused |
| JSON parsing | weather/api.go | ✅ Reused |
| **Text formatting** | cli/format.go | ❌ Not reused (JSON instead) |

**Result:** ~80% code reuse, ZERO duplication of API logic!

### Documentation Requirements

**User Documentation:**

Create `weather-cli/README.md`:
- Installation instructions
- Build instructions
- Usage examples
- Troubleshooting

**Code Documentation:**

- Package documentation comments
- Function documentation
- Example code

### Design Decisions

**Decision 0: Code Reusability for Sprint 3 - CRITICAL ARCHITECTURAL DECISION**

**Decision Made:** Separate reusable core (`weather/`) from CLI-specific code (`cli/`)

**Rationale:**
- **Zero duplication:** Sprint 3 REST API will import `weather-cli/weather` package
- **Single source of truth:** API logic written once, used by both CLI and REST API
- **Maintainability:** Bug fixes in API logic automatically benefit both CLI and REST API
- **Consistency:** Both interfaces use identical weather data and logic

**Implementation:**
```
weather/           ← Core business logic (REUSABLE)
  ├── client.go    ← High-level functions (GetWeatherForCity, etc.)
  ├── api.go       ← API calls (GeocodeCity, GetForecast)
  └── types.go     ← Data structures

cli/               ← CLI-specific (NOT reused)
  └── format.go    ← Text formatting only

main.go            ← CLI entry point (NOT reused)
```

**Sprint 3 Reuse Pattern:**
```go
// Sprint 3 REST API handler
import "weather-cli/weather"

func WeatherHandler(w http.ResponseWriter, r *http.Request) {
    city := r.URL.Query().Get("city")

    // Reuse Sprint 2 core logic - NO CODE DUPLICATION!
    forecast, location, err := weather.GetWeatherForCity(city)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // Different output format (JSON vs text)
    json.NewEncoder(w).Encode(forecast)
}
```

**Benefit:** ~80% code reuse, zero API logic duplication between CLI and REST API

---

**Decision 1: Positional Arguments vs Flags**

**Decision Made:** Positional arguments (simpler)

**Rationale:**
- MVP-level simplicity
- Single input parameter
- Easier for quick usage: `./weather-cli "Tokyo"`
- Flags add complexity for minimal benefit at this stage

**Alternatives Considered:**
- Flags: `./weather-cli --city "Tokyo"` or `./weather-cli --coords "35.6,139.7"`
- More flexible but less simple for MVP

**Decision 2: Temperature Units**

**Decision Made:** Display Celsius only

**Rationale:**
- API returns Celsius by default
- International standard
- Simplifies output
- Future enhancement can add Fahrenheit

**Alternatives Considered:**
- Both units: Adds complexity
- Fahrenheit only: Requires conversion, less international
- User choice: Requires flags, adds complexity

**Decision 3: Single City vs Multiple Results**

**Decision Made:** Display first result only

**Rationale:**
- MVP simplicity
- Most searches are unambiguous
- User can be more specific if needed
- Future enhancement can show multiple options

**Alternatives Considered:**
- Interactive selection: Requires complex CLI interaction
- Show all matches: Confusing for simple queries

**Decision 4: Output Format**

**Decision Made:** Simple text format with clear sections

**Rationale:**
- Terminal-friendly
- Easy to read
- No external dependencies (no tables library)
- Straightforward to test

**Alternatives Considered:**
- JSON output: Not user-friendly for CLI
- Table format: Requires external library or complex formatting

**Decision 5: HTTP Client Configuration**

**Decision Made:** 10-second timeout, no retries

**Rationale:**
- Standard timeout reasonable for API calls
- Retries add complexity
- User can re-run command if needed
- Fast failure better than hanging

**Alternatives Considered:**
- Longer timeout: Frustrating to wait
- Automatic retries: Complicates error handling

### Open Design Questions

**None** - All design decisions made for MVP implementation.

---

# Design Summary

## Overall Architecture

Simple, straightforward CLI with clear separation of concerns:

```
main.go (CLI interface)
    ↓
weather/api.go (API client)
    ↓
weather/types.go (Data structures)
    ↓
weather/format.go (Output formatting)
```

## Shared Components

- HTTP client (net/http)
- JSON parser (encoding/json)
- Weather code mapping (shared lookup table)

## Design Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| API response changes | Low | Version response structures, handle parsing errors |
| Network timeouts | Low | Clear error messages, 10s timeout |
| Ambiguous city names | Medium | Display full location, first result only for MVP |
| Build complexity | Low | Simple `go build`, document in README |

## Resource Requirements

**Tools:**
- Go 1.21+ (installed in Sprint 1)
- No external Go packages
- Internet connectivity for API calls

**External Services:**
- Open-Meteo Geocoding API (free, no key)
- Open-Meteo Forecast API (free, no key)

## Design Approval Status

**Status: Proposed**

Design complete and ready for Product Owner review. Awaiting approval to proceed to Construction phase.

**Key Points for Review:**
1. Positional argument syntax (simple, MVP-appropriate)
2. Celsius-only temperature display
3. First result only for city searches
4. No external Go dependencies
5. Simple text output format
6. 10-second HTTP timeout
