// Package weather provides weather data fetching from Open-Meteo Forecast API
package weather

import (
	"encoding/json"
	"fmt"
	"net/http"
)

const forecastAPIURL = "https://api.open-meteo.com/v1/forecast"

// CurrentWeather represents current weather conditions
type CurrentWeather struct {
	Temperature   float64 `json:"temperature"`
	WindSpeed     float64 `json:"windspeed"`
	WindDirection int     `json:"winddirection"`
	WeatherCode   int     `json:"weathercode"`
	Time          string  `json:"time"`
}

// DailyForecast represents daily forecast data
type DailyForecast struct {
	Time          []string  `json:"time"`
	TempMax       []float64 `json:"temperature_2m_max"`
	TempMin       []float64 `json:"temperature_2m_min"`
	WeatherCode   []int     `json:"weathercode"`
	Precipitation []float64 `json:"precipitation_sum"`
}

// WeatherData represents complete weather information
type WeatherData struct {
	Latitude       float64        `json:"latitude"`
	Longitude      float64        `json:"longitude"`
	CurrentWeather CurrentWeather `json:"current_weather"`
	Daily          DailyForecast  `json:"daily"`
}

// FetchWeather retrieves weather data for given coordinates
func FetchWeather(lat, lon float64) (*WeatherData, error) {
	// Build API URL with parameters
	apiURL := fmt.Sprintf("%s?latitude=%.4f&longitude=%.4f&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=auto&forecast_days=3",
		forecastAPIURL, lat, lon)

	// Make HTTP request
	resp, err := http.Get(apiURL)
	if err != nil {
		return nil, fmt.Errorf("HTTP request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API returned status %d", resp.StatusCode)
	}

	// Parse JSON response
	var data WeatherData
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	return &data, nil
}
