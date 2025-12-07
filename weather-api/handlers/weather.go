package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"weather-cli/weather"
)

// CityWeatherResponse combines location and forecast for city queries
type CityWeatherResponse struct {
	Location *weather.Location        `json:"location"`
	Forecast *weather.ForecastResponse `json:"forecast"`
}

// CoordWeatherResponse wraps forecast for coordinate queries
type CoordWeatherResponse struct {
	Forecast *weather.ForecastResponse `json:"forecast"`
}

// ErrorResponse represents API error responses
type ErrorResponse struct {
	Error string `json:"error"`
}

// CityWeatherHandler handles GET /api/weather/city?name={city}
func CityWeatherHandler(w http.ResponseWriter, r *http.Request) {
	// Only accept GET
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extract city name from query params
	cityName := r.URL.Query().Get("name")
	if cityName == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "city name is required"})
		return
	}

	// Call reused weather package
	forecast, location, err := weather.GetWeatherForCity(cityName)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")

		// Check if city not found (contains "city not found")
		if strings.Contains(err.Error(), "city not found") {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(ErrorResponse{
				Error: err.Error(),
			})
			return
		}

		// Other errors are 500
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error: "failed to fetch weather data",
		})
		return
	}

	// Success response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(CityWeatherResponse{
		Location: location,
		Forecast: forecast,
	})
}

// CoordWeatherHandler handles GET /api/weather/coord?lat={lat}&lon={lon}
func CoordWeatherHandler(w http.ResponseWriter, r *http.Request) {
	// Only accept GET
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extract and validate coordinates
	latStr := r.URL.Query().Get("lat")
	lonStr := r.URL.Query().Get("lon")

	if latStr == "" || lonStr == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error: "latitude and longitude are required",
		})
		return
	}

	// Parse floats
	var lat, lon float64
	if _, err := fmt.Sscanf(latStr, "%f", &lat); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error: "invalid latitude format",
		})
		return
	}
	if _, err := fmt.Sscanf(lonStr, "%f", &lon); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error: "invalid longitude format",
		})
		return
	}

	// Call reused weather package
	forecast, err := weather.GetWeatherForCoordinates(lat, lon)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error: err.Error(),
		})
		return
	}

	// Success response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(CoordWeatherResponse{
		Forecast: forecast,
	})
}
