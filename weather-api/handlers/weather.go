package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	weather "weather-cli/weather"
)

// ErrorResponse models a simple JSON error payload
type ErrorResponse struct {
	Error string `json:"error"`
}

// WeatherResponse combines location and forecast in a single response
type WeatherResponse struct {
	Location weather.Location           `json:"location"`
	Forecast *weather.ForecastResponse  `json:"forecast"`
}

// writeJSON writes value v as JSON with given status code
func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

// NewWeatherHandler returns an http.HandlerFunc for GET /weather
func NewWeatherHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Only allow GET
		if r.Method != http.MethodGet {
			writeJSON(w, http.StatusMethodNotAllowed, ErrorResponse{Error: "method not allowed"})
			return
		}

		city := strings.TrimSpace(r.URL.Query().Get("city"))
		if city == "" {
			writeJSON(w, http.StatusBadRequest, ErrorResponse{Error: "query parameter 'city' is required"})
			return
		}

		// Geocode city to coordinates
		loc, err := weather.GeocodeCity(city)
		if err != nil {
			// Distinguish "not found" from other errors
			if strings.Contains(strings.ToLower(err.Error()), "city not found") {
				writeJSON(w, http.StatusNotFound, ErrorResponse{Error: err.Error()})
				return
			}
			writeJSON(w, http.StatusBadGateway, ErrorResponse{Error: "geocoding API request failed"})
			return
		}

		// Fetch forecast
		fc, err := weather.GetForecast(loc.Latitude, loc.Longitude)
		if err != nil {
			writeJSON(w, http.StatusBadGateway, ErrorResponse{Error: "forecast API request failed"})
			return
		}

		writeJSON(w, http.StatusOK, WeatherResponse{
			Location: *loc,
			Forecast: fc,
		})
	}
}
