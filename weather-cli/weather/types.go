// Package weather provides core weather data retrieval functionality.
// This package is designed to be reusable by both CLI and REST API implementations.
package weather

// GeocodingResponse represents the response from the geocoding API
type GeocodingResponse struct {
	Results []Location `json:"results"`
}

// Location represents a geographic location with coordinates
type Location struct {
	Name      string  `json:"name"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Country   string  `json:"country"`
	Admin1    string  `json:"admin1"` // State/Province
}

// ForecastResponse represents the complete weather forecast response
type ForecastResponse struct {
	Latitude  float64        `json:"latitude"`
	Longitude float64        `json:"longitude"`
	Timezone  string         `json:"timezone"`
	Current   CurrentWeather `json:"current"`
	Daily     DailyForecast  `json:"daily"`
}

// CurrentWeather represents current weather conditions
type CurrentWeather struct {
	Time          string  `json:"time"`
	Temperature2m float64 `json:"temperature_2m"`
	WeatherCode   int     `json:"weather_code"`
}

// DailyForecast represents daily forecast data
type DailyForecast struct {
	Time             []string  `json:"time"`
	Temperature2mMax []float64 `json:"temperature_2m_max"`
	Temperature2mMin []float64 `json:"temperature_2m_min"`
	WeatherCode      []int     `json:"weather_code"`
}
