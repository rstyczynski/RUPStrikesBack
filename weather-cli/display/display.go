// Package display provides weather data formatting and output
package display

import (
	"fmt"
	"strings"

	"github.com/rstyczynski/weather-cli/weather"
)

// Weather code descriptions (WMO Weather interpretation codes)
var weatherCodes = map[int]string{
	0:  "Clear sky",
	1:  "Mainly clear",
	2:  "Partly cloudy",
	3:  "Overcast",
	45: "Fog",
	48: "Depositing rime fog",
	51: "Light drizzle",
	61: "Slight rain",
	63: "Moderate rain",
	65: "Heavy rain",
	71: "Slight snow",
	73: "Moderate snow",
	75: "Heavy snow",
	80: "Slight rain showers",
	81: "Moderate rain showers",
	95: "Thunderstorm",
}

// GetWeatherDescription returns human-readable weather description
func GetWeatherDescription(code int) string {
	if desc, ok := weatherCodes[code]; ok {
		return desc
	}
	return fmt.Sprintf("Unknown (%d)", code)
}

// ShowWeather displays formatted weather information
func ShowWeather(data *weather.WeatherData) {
	// Current weather
	fmt.Println("Current Conditions:")
	fmt.Printf("Temperature: %.1f°C\n", data.CurrentWeather.Temperature)
	fmt.Printf("Condition: %s\n", GetWeatherDescription(data.CurrentWeather.WeatherCode))
	fmt.Printf("Wind: %.1f km/h\n", data.CurrentWeather.WindSpeed)
	fmt.Println()

	// 3-day forecast
	fmt.Println("3-Day Forecast:")
	fmt.Println(strings.Repeat("─", 70))
	fmt.Printf("%-12s  %-10s  %-10s  %-20s  %-10s\n",
		"Date", "Max Temp", "Min Temp", "Condition", "Precip")
	fmt.Println(strings.Repeat("─", 70))

	for i := 0; i < len(data.Daily.Time) && i < 3; i++ {
		fmt.Printf("%-12s  %7.1f°C  %7.1f°C  %-20s  %6.1f mm\n",
			data.Daily.Time[i],
			data.Daily.TempMax[i],
			data.Daily.TempMin[i],
			GetWeatherDescription(data.Daily.WeatherCode[i]),
			data.Daily.Precipitation[i])
	}
	fmt.Println(strings.Repeat("─", 70))
}
