// Package weather provides core weather data retrieval functionality.
package weather

import "fmt"

// GetWeatherForCity is a high-level function that retrieves weather forecast for a city name.
// It handles geocoding the city name to coordinates and then fetching the forecast.
// This function is designed to be reused by both CLI and REST API implementations.
func GetWeatherForCity(cityName string) (*ForecastResponse, *Location, error) {
	// Geocode city name to coordinates
	location, err := GeocodeCity(cityName)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to geocode city: %w", err)
	}

	// Get forecast for coordinates
	forecast, err := GetForecast(location.Latitude, location.Longitude)
	if err != nil {
		return nil, location, fmt.Errorf("failed to get forecast: %w", err)
	}

	return forecast, location, nil
}

// GetWeatherForCoordinates is a high-level function that retrieves weather forecast for GPS coordinates.
// This function is designed to be reused by both CLI and REST API implementations.
func GetWeatherForCoordinates(lat, lon float64) (*ForecastResponse, error) {
	forecast, err := GetForecast(lat, lon)
	if err != nil {
		return nil, fmt.Errorf("failed to get forecast: %w", err)
	}

	return forecast, nil
}
