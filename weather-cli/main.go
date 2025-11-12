package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/rstyczynski/weather-cli/display"
	"github.com/rstyczynski/weather-cli/geocode"
	"github.com/rstyczynski/weather-cli/weather"
)

const version = "0.1.0"

func main() {
	// CLI flags
	var (
		cityName = flag.String("city", "", "City name for weather forecast")
		lat      = flag.Float64("lat", 0, "Latitude for weather forecast")
		lon      = flag.Float64("lon", 0, "Longitude for weather forecast")
		showVer  = flag.Bool("version", false, "Show version")
	)

	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, "Weather CLI - Get weather forecasts from the command line\n\n")
		fmt.Fprintf(os.Stderr, "Usage:\n")
		fmt.Fprintf(os.Stderr, "  weather-cli [city]              Get weather for a city\n")
		fmt.Fprintf(os.Stderr, "  weather-cli --city \"Berlin\"     Get weather for a city\n")
		fmt.Fprintf(os.Stderr, "  weather-cli --lat 52.52 --lon 13.41  Get weather for coordinates\n\n")
		fmt.Fprintf(os.Stderr, "Flags:\n")
		flag.PrintDefaults()
	}

	flag.Parse()

	// Handle version flag
	if *showVer {
		fmt.Printf("weather-cli version %s\n", version)
		return
	}

	// Get positional argument as city name if no flags provided
	if *cityName == "" && *lat == 0 && *lon == 0 && len(flag.Args()) > 0 {
		*cityName = flag.Args()[0]
	}

	// Validate input
	hasCity := *cityName != ""
	hasCoords := *lat != 0 || *lon != 0

	if !hasCity && !hasCoords {
		fmt.Fprintln(os.Stderr, "Error: Please provide either a city name or coordinates")
		flag.Usage()
		os.Exit(1)
	}

	if hasCity && hasCoords {
		fmt.Fprintln(os.Stderr, "Error: Please provide either city name OR coordinates, not both")
		os.Exit(1)
	}

	// Geocode if city name provided
	if hasCity {
		loc, err := geocode.Geocode(*cityName)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error: Could not find location \"%s\": %v\n", *cityName, err)
			os.Exit(1)
		}
		*lat = loc.Latitude
		*lon = loc.Longitude
		fmt.Printf("Location: %s, %s (%.2f°N, %.2f°E)\n\n", loc.Name, loc.Country, *lat, *lon)
	}

	// Fetch weather data
	data, err := weather.FetchWeather(*lat, *lon)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: Could not fetch weather data: %v\n", err)
		os.Exit(1)
	}

	// Display weather
	display.ShowWeather(data)
}
