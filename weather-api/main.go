package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"weather-cli/weather"
)

// Response structures
type CityWeatherResponse struct {
	Location *weather.Location        `json:"location"`
	Forecast *weather.ForecastResponse `json:"forecast"`
}

type CoordinatesWeatherResponse struct {
	Forecast *weather.ForecastResponse `json:"forecast"`
}

type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}

type HealthResponse struct {
	Status  string `json:"status"`
	Service string `json:"service"`
	Version string `json:"version"`
}

func main() {
	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Create router
	mux := http.NewServeMux()

	// Register routes
	mux.HandleFunc("/weather/city", HandleCityWeather)
	mux.HandleFunc("/weather/coordinates", HandleCoordinatesWeather)
	mux.HandleFunc("/health", HandleHealth)

	// Start server
	addr := ":" + port
	log.Printf("Starting weather API server on %s", addr)
	log.Printf("Endpoints:")
	log.Printf("  GET /weather/city?name=<city>")
	log.Printf("  GET /weather/coordinates?lat=<lat>&lon=<lon>")
	log.Printf("  GET /health")

	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

// HandleCityWeather handles requests for weather by city name
func HandleCityWeather(w http.ResponseWriter, r *http.Request) {
	// Extract query parameter
	cityName := r.URL.Query().Get("name")
	if cityName == "" {
		respondError(w, "bad request", "Missing required parameter: name", http.StatusBadRequest)
		return
	}

	log.Printf("City weather request: %s", cityName)

	// Call Sprint 2 reusable function (ZERO DUPLICATION)
	forecast, location, err := weather.GetWeatherForCity(cityName)
	if err != nil {
		// Determine appropriate HTTP status based on error
		status := http.StatusInternalServerError
		if strings.Contains(err.Error(), "not found") {
			status = http.StatusNotFound
		}
		respondError(w, "city not found", err.Error(), status)
		return
	}

	// Encode as JSON and return
	respondJSON(w, CityWeatherResponse{
		Location: location,
		Forecast: forecast,
	}, http.StatusOK)

	log.Printf("City weather response: %s (%.2f, %.2f)", location.Name, location.Latitude, location.Longitude)
}

// HandleCoordinatesWeather handles requests for weather by GPS coordinates
func HandleCoordinatesWeather(w http.ResponseWriter, r *http.Request) {
	// Extract and parse query parameters
	latStr := r.URL.Query().Get("lat")
	lonStr := r.URL.Query().Get("lon")

	if latStr == "" || lonStr == "" {
		respondError(w, "bad request", "Missing required parameters: lat and lon", http.StatusBadRequest)
		return
	}

	lat, err := strconv.ParseFloat(latStr, 64)
	if err != nil {
		respondError(w, "bad request", "Invalid latitude format", http.StatusBadRequest)
		return
	}

	lon, err := strconv.ParseFloat(lonStr, 64)
	if err != nil {
		respondError(w, "bad request", "Invalid longitude format", http.StatusBadRequest)
		return
	}

	// Validate ranges
	if lat < -90 || lat > 90 {
		respondError(w, "bad request", "Latitude must be between -90 and 90", http.StatusBadRequest)
		return
	}

	if lon < -180 || lon > 180 {
		respondError(w, "bad request", "Longitude must be between -180 and 180", http.StatusBadRequest)
		return
	}

	log.Printf("Coordinates weather request: lat=%.4f, lon=%.4f", lat, lon)

	// Call Sprint 2 reusable function (ZERO DUPLICATION)
	forecast, err := weather.GetWeatherForCoordinates(lat, lon)
	if err != nil {
		respondError(w, "api error", err.Error(), http.StatusInternalServerError)
		return
	}

	// Encode as JSON and return
	respondJSON(w, CoordinatesWeatherResponse{
		Forecast: forecast,
	}, http.StatusOK)

	log.Printf("Coordinates weather response: %.2f, %.2f", forecast.Latitude, forecast.Longitude)
}

// HandleHealth handles health check requests
func HandleHealth(w http.ResponseWriter, r *http.Request) {
	respondJSON(w, HealthResponse{
		Status:  "healthy",
		Service: "weather-api",
		Version: "1.0.0",
	}, http.StatusOK)
}

// respondJSON writes a JSON response with the given status code
func respondJSON(w http.ResponseWriter, data interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("Error encoding JSON: %v", err)
	}
}

// respondError writes an error response with the given status code
func respondError(w http.ResponseWriter, errorType, message string, statusCode int) {
	log.Printf("Error response: %s - %s (status: %d)", errorType, message, statusCode)
	respondJSON(w, ErrorResponse{
		Error:   errorType,
		Message: message,
	}, statusCode)
}
