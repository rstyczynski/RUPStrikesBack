// Package weather provides core weather data retrieval functionality.
package weather

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"
)

const (
	geocodingAPIURL = "https://geocoding-api.open-meteo.com/v1/search"
	forecastAPIURL  = "https://api.open-meteo.com/v1/forecast"
	httpTimeout     = 10 * time.Second
)

// httpClient is the shared HTTP client with timeout
var httpClient = &http.Client{
	Timeout: httpTimeout,
}

// GeocodeCity converts a city name to geographic coordinates using the Open-Meteo Geocoding API.
// Returns the first matching location or an error if the city is not found.
func GeocodeCity(cityName string) (*Location, error) {
	// Build request URL
	reqURL := fmt.Sprintf("%s?name=%s&count=1&language=en&format=json",
		geocodingAPIURL, url.QueryEscape(cityName))

	// Make HTTP request
	resp, err := httpClient.Get(reqURL)
	if err != nil {
		return nil, fmt.Errorf("geocoding API request failed: %w", err)
	}
	defer resp.Body.Close()

	// Check HTTP status
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("geocoding API returned status %d", resp.StatusCode)
	}

	// Parse JSON response
	var geoResp GeocodingResponse
	if err := json.NewDecoder(resp.Body).Decode(&geoResp); err != nil {
		return nil, fmt.Errorf("failed to parse geocoding response: %w", err)
	}

	// Check if city was found
	if len(geoResp.Results) == 0 {
		return nil, fmt.Errorf("city not found: %s", cityName)
	}

	return &geoResp.Results[0], nil
}

// GetForecast retrieves weather forecast data for the given coordinates from the Open-Meteo Forecast API.
// Returns forecast data including current weather and 3-day forecast.
func GetForecast(lat, lon float64) (*ForecastResponse, error) {
	// Validate coordinates
	if lat < -90 || lat > 90 {
		return nil, fmt.Errorf("latitude must be between -90 and 90, got %.4f", lat)
	}
	if lon < -180 || lon > 180 {
		return nil, fmt.Errorf("longitude must be between -180 and 180, got %.4f", lon)
	}

	// Build request URL
	reqURL := fmt.Sprintf("%s?latitude=%.4f&longitude=%.4f&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=3",
		forecastAPIURL, lat, lon)

	// Make HTTP request
	resp, err := httpClient.Get(reqURL)
	if err != nil {
		return nil, fmt.Errorf("forecast API request failed: %w", err)
	}
	defer resp.Body.Close()

	// Check HTTP status
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("forecast API returned status %d", resp.StatusCode)
	}

	// Parse JSON response
	var forecast ForecastResponse
	if err := json.NewDecoder(resp.Body).Decode(&forecast); err != nil {
		return nil, fmt.Errorf("failed to parse forecast response: %w", err)
	}

	return &forecast, nil
}
