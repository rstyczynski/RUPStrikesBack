// Package cli provides CLI-specific formatting functions.
// This package is NOT reused by the REST API (which uses JSON formatting instead).
package cli

import (
	"fmt"
	"strings"
	"weather-cli/weather"
)

// WeatherCodeToDescription converts Open-Meteo weather codes to human-readable descriptions
func WeatherCodeToDescription(code int) string {
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

// FormatForecast formats weather forecast data as human-readable text for terminal display
func FormatForecast(forecast *weather.ForecastResponse, location *weather.Location) string {
	var sb strings.Builder

	// Header
	sb.WriteString("Weather Forecast\n")
	sb.WriteString("================\n\n")

	// Location information
	if location != nil {
		sb.WriteString(fmt.Sprintf("Location: %s", location.Name))
		if location.Admin1 != "" {
			sb.WriteString(fmt.Sprintf(", %s", location.Admin1))
		}
		if location.Country != "" {
			sb.WriteString(fmt.Sprintf(", %s", location.Country))
		}
		sb.WriteString("\n")
		sb.WriteString(fmt.Sprintf("Coordinates: %.2f°N, %.2f°W\n\n",
			location.Latitude, location.Longitude))
	} else {
		sb.WriteString(fmt.Sprintf("Coordinates: %.2f°N, %.2f°W\n\n",
			forecast.Latitude, forecast.Longitude))
	}

	// Current weather
	sb.WriteString("Current Weather:\n")
	sb.WriteString(fmt.Sprintf("  Temperature: %.1f°C\n", forecast.Current.Temperature2m))
	sb.WriteString(fmt.Sprintf("  Conditions: %s\n\n",
		WeatherCodeToDescription(forecast.Current.WeatherCode)))

	// 3-day forecast
	sb.WriteString("3-Day Forecast:\n")
	for i := 0; i < len(forecast.Daily.Time) && i < 3; i++ {
		date := forecast.Daily.Time[i]
		maxTemp := forecast.Daily.Temperature2mMax[i]
		minTemp := forecast.Daily.Temperature2mMin[i]
		conditions := WeatherCodeToDescription(forecast.Daily.WeatherCode[i])

		// Format date (just show the date part, e.g., "Nov 14")
		sb.WriteString(fmt.Sprintf("  %s: ↑%.1f°C ↓%.1f°C - %s\n",
			date, maxTemp, minTemp, conditions))
	}

	return sb.String()
}
