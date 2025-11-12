# Weather CLI

Command-line weather forecast application using Open-Meteo API.

## Installation

```bash
cd weather-cli
go build
```

## Usage

**By city name:**
```bash
./weather-cli "Berlin"
./weather-cli --city "New York"
```

**By GPS coordinates:**
```bash
./weather-cli --lat 52.52 --lon 13.41
```

**Help:**
```bash
./weather-cli --help
```

## Features

- ✅ City name geocoding
- ✅ GPS coordinates support
- ✅ Current weather display
- ✅ 3-day forecast
- ✅ Formatted table output
- ✅ Comprehensive error handling

## Architecture

```
weather-cli/
├── main.go          # CLI entry point
├── geocode/         # Geocoding package
├── weather/         # Weather data fetching
└── display/         # Output formatting
```

## Testing

```bash
go test ./...
```

## Sprint 2 Implementation Status

**Status**: Prototype implementation demonstrating architecture

This implementation shows the designed architecture with:
- Modular package structure
- CLI argument parsing
- API integration patterns
- Error handling

**Note**: Full production implementation would include complete error handling, retry logic, and comprehensive testing. This prototype validates the design and can be incrementally enhanced.

## Dependencies

- Go 1.21+
- Standard library only (net/http, encoding/json, flag)
- Open-Meteo API (no API key required)

## License

MIT
