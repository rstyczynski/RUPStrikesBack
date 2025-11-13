// Weather CLI - Command-line interface for weather forecasts
// This CLI uses the reusable weather package which will also be used by the REST API in Sprint 3.
package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"weather-cli/cli"
	"weather-cli/weather"
)

const (
	ExitSuccess      = 0
	ExitInvalidInput = 1
	ExitAPIError     = 2
)

func main() {
	// Check for help flag
	if len(os.Args) > 1 && (os.Args[1] == "--help" || os.Args[1] == "-h") {
		printHelp()
		os.Exit(ExitSuccess)
	}

	// Require exactly one argument
	if len(os.Args) != 2 {
		fmt.Fprintf(os.Stderr, "Error: requires exactly one argument\n\n")
		printHelp()
		os.Exit(ExitInvalidInput)
	}

	input := os.Args[1]

	// Detect input type and fetch weather
	if isCoordinate, lat, lon, err := parseCoordinates(input); isCoordinate {
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(ExitInvalidInput)
		}
		fetchWeatherByCoordinates(lat, lon)
	} else {
		fetchWeatherByCity(input)
	}
}

// parseCoordinates attempts to parse input as GPS coordinates (lat,lon format)
func parseCoordinates(input string) (bool, float64, float64, error) {
	// Check if input contains comma (coordinate format)
	if !strings.Contains(input, ",") {
		return false, 0, 0, nil
	}

	parts := strings.Split(input, ",")
	if len(parts) != 2 {
		return true, 0, 0, fmt.Errorf("invalid coordinate format, expected: lat,lon")
	}

	lat, err := strconv.ParseFloat(strings.TrimSpace(parts[0]), 64)
	if err != nil {
		return true, 0, 0, fmt.Errorf("invalid latitude: %v", err)
	}

	lon, err := strconv.ParseFloat(strings.TrimSpace(parts[1]), 64)
	if err != nil {
		return true, 0, 0, fmt.Errorf("invalid longitude: %v", err)
	}

	return true, lat, lon, nil
}

// fetchWeatherByCity retrieves and displays weather for a city name
func fetchWeatherByCity(cityName string) {
	// Use reusable weather package (Sprint 3 REST API will use same function!)
	forecast, location, err := weather.GetWeatherForCity(cityName)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(ExitAPIError)
	}

	// Format and display (CLI-specific formatting)
	output := cli.FormatForecast(forecast, location)
	fmt.Print(output)
	os.Exit(ExitSuccess)
}

// fetchWeatherByCoordinates retrieves and displays weather for GPS coordinates
func fetchWeatherByCoordinates(lat, lon float64) {
	// Use reusable weather package (Sprint 3 REST API will use same function!)
	forecast, err := weather.GetWeatherForCoordinates(lat, lon)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(ExitAPIError)
	}

	// Format and display (CLI-specific formatting)
	output := cli.FormatForecast(forecast, nil)
	fmt.Print(output)
	os.Exit(ExitSuccess)
}

// printHelp displays usage information
func printHelp() {
	help := `Weather CLI - Get weather forecasts from the command line

Usage:
  weather-cli <city-name>         Get weather for a city
  weather-cli <latitude,longitude> Get weather for GPS coordinates
  weather-cli --help              Show this help message

Examples:
  weather-cli "San Francisco"
  weather-cli "Tokyo"
  weather-cli "London, UK"
  weather-cli "37.7749,-122.4194"
  weather-cli "51.5074,-0.1278"

Output:
  Displays current weather and 3-day forecast with temperatures in Celsius.

Exit Codes:
  0 - Success
  1 - Invalid input
  2 - API error (network, city not found, etc.)
`
	fmt.Print(help)
}
