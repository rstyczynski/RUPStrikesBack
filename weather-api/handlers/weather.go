package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/rstyczynski/RUPStrikesBack/weather-cli/weather"
)

// ErrorResponse represents a JSON error response
type ErrorResponse struct {
	Error  string `json:"error"`
	Status int    `json:"status"`
}

// writeJSONError writes a JSON error response with the specified message and HTTP status code
func writeJSONError(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(ErrorResponse{
		Error:  message,
		Status: statusCode,
	})
	log.Printf("Error response: %d - %s", statusCode, message)
}

// HandleHealth handles GET /health endpoint
// Returns a simple JSON status response for health checking
func HandleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	log.Println("Health check: OK")
}

// HandleWeatherCity handles GET /weather/city?name={cityName} endpoint
// Retrieves weather forecast for a given city name using the weather package
func HandleWeatherCity(w http.ResponseWriter, r *http.Request) {
	// Parse city name parameter
	cityName := r.URL.Query().Get("name")
	if cityName == "" {
		writeJSONError(w, "missing required parameter: name", http.StatusBadRequest)
		return
	}

	// Call weather package to get forecast by city name
	forecast, location, err := weather.GetWeatherForCity(cityName)
	if err != nil {
		// Classify error type and return appropriate HTTP status
		if strings.Contains(err.Error(), "city not found") {
			writeJSONError(w, err.Error(), http.StatusNotFound)
		} else if strings.Contains(err.Error(), "API request failed") || strings.Contains(err.Error(), "request failed") {
			writeJSONError(w, err.Error(), http.StatusServiceUnavailable)
		} else {
			writeJSONError(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	// Write successful JSON response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(forecast); err != nil {
		log.Printf("Failed to encode JSON response: %v", err)
		writeJSONError(w, "failed to encode response", http.StatusInternalServerError)
		return
	}
	log.Printf("Weather retrieved for city: %s (%s)", location.Name, location.Country)
}

// HandleWeatherCoordinates handles GET /weather/coordinates?lat={lat}&lon={lon} endpoint
// Retrieves weather forecast for given GPS coordinates using the weather package
func HandleWeatherCoordinates(w http.ResponseWriter, r *http.Request) {
	// Parse latitude parameter
	latStr := r.URL.Query().Get("lat")
	if latStr == "" {
		writeJSONError(w, "missing required parameter: lat", http.StatusBadRequest)
		return
	}

	lat, err := strconv.ParseFloat(latStr, 64)
	if err != nil {
		writeJSONError(w, fmt.Sprintf("invalid latitude format: %s", latStr), http.StatusBadRequest)
		return
	}

	// Parse longitude parameter
	lonStr := r.URL.Query().Get("lon")
	if lonStr == "" {
		writeJSONError(w, "missing required parameter: lon", http.StatusBadRequest)
		return
	}

	lon, err := strconv.ParseFloat(lonStr, 64)
	if err != nil {
		writeJSONError(w, fmt.Sprintf("invalid longitude format: %s", lonStr), http.StatusBadRequest)
		return
	}

	// Call weather package to get forecast by coordinates
	// Note: GetWeatherForCoordinates validates coordinate ranges internally
	forecast, err := weather.GetWeatherForCoordinates(lat, lon)
	if err != nil {
		// Classify error type and return appropriate HTTP status
		if strings.Contains(err.Error(), "must be between") {
			// Coordinate validation error
			writeJSONError(w, err.Error(), http.StatusBadRequest)
		} else if strings.Contains(err.Error(), "API request failed") || strings.Contains(err.Error(), "request failed") {
			writeJSONError(w, err.Error(), http.StatusServiceUnavailable)
		} else {
			writeJSONError(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	// Write successful JSON response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(forecast); err != nil {
		log.Printf("Failed to encode JSON response: %v", err)
		writeJSONError(w, "failed to encode response", http.StatusInternalServerError)
		return
	}
	log.Printf("Weather retrieved for coordinates: %.4f, %.4f", lat, lon)
}
