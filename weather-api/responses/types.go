// Package responses provides API response types and formatting
package responses

// LocationResponse represents location information in API responses
type LocationResponse struct {
	Name      string  `json:"name"`
	Country   string  `json:"country"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

// CurrentWeatherResponse represents current weather conditions
type CurrentWeatherResponse struct {
	Temperature   float64 `json:"temperature"`
	Condition     string  `json:"condition"`
	WeatherCode   int     `json:"weather_code"`
	WindSpeed     float64 `json:"wind_speed"`
	WindDirection int     `json:"wind_direction"`
	Time          string  `json:"time"`
}

// ForecastDayResponse represents a single day's forecast
type ForecastDayResponse struct {
	Date          string  `json:"date"`
	MaxTemp       float64 `json:"max_temp"`
	MinTemp       float64 `json:"min_temp"`
	Condition     string  `json:"condition"`
	WeatherCode   int     `json:"weather_code"`
	Precipitation float64 `json:"precipitation"`
}

// WeatherResponse is the complete API response for weather queries
type WeatherResponse struct {
	Location LocationResponse          `json:"location"`
	Current  CurrentWeatherResponse    `json:"current"`
	Forecast []ForecastDayResponse     `json:"forecast"`
}

// ErrorDetail contains error information
type ErrorDetail struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Status  int    `json:"status"`
}

// ErrorResponse is the standard error response format
type ErrorResponse struct {
	Error ErrorDetail `json:"error"`
}

// HealthResponse is returned by the health check endpoint
type HealthResponse struct {
	Status    string `json:"status"`
	Service   string `json:"service"`
	Version   string `json:"version"`
	Timestamp string `json:"timestamp"`
}
