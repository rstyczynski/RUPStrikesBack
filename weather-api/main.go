// Weather REST API - HTTP server exposing weather forecast data
// Reuses weather-cli/weather package for zero code duplication
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"weather-cli/weather"
)

const port = ":8080"

// CORS middleware to allow requests from WebUI
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/weather/city", corsMiddleware(handleCityWeather))
	mux.HandleFunc("/weather/coord", corsMiddleware(handleCoordWeather))
	mux.HandleFunc("/", corsMiddleware(handleRoot))

	log.Printf("Weather API server starting on port %s", port)
	log.Fatal(http.ListenAndServe(port, mux))
}

// handleRoot provides API information
func handleRoot(w http.ResponseWriter, r *http.Request) {
	info := map[string]interface{}{
		"service":   "Weather Forecast REST API",
		"version":   "1.0",
		"endpoints": []string{"/weather/city", "/weather/coord"},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(info)
}

// handleCityWeather handles GET /weather/city?city={name}
func handleCityWeather(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	cityName := r.URL.Query().Get("city")
	if cityName == "" {
		http.Error(w, "Missing required parameter: city", http.StatusBadRequest)
		return
	}

	// Reuse weather package from Sprint 2 - ZERO CODE DUPLICATION
	forecast, location, err := weather.GetWeatherForCity(cityName)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to get weather: %v", err), http.StatusBadRequest)
		return
	}

	// Return JSON response
	w.Header().Set("Content-Type", "application/json")
	response := map[string]interface{}{
		"location": location,
		"forecast": forecast,
	}
	json.NewEncoder(w).Encode(response)
}

// handleCoordWeather handles GET /weather/coord?lat={lat}&lon={lon}
func handleCoordWeather(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	latStr := r.URL.Query().Get("lat")
	lonStr := r.URL.Query().Get("lon")

	if latStr == "" || lonStr == "" {
		http.Error(w, "Missing required parameters: lat and lon", http.StatusBadRequest)
		return
	}

	lat, err := strconv.ParseFloat(latStr, 64)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid latitude: %v", err), http.StatusBadRequest)
		return
	}

	lon, err := strconv.ParseFloat(lonStr, 64)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid longitude: %v", err), http.StatusBadRequest)
		return
	}

	// Reuse weather package from Sprint 2 - ZERO CODE DUPLICATION
	forecast, err := weather.GetWeatherForCoordinates(lat, lon)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to get weather: %v", err), http.StatusBadRequest)
		return
	}

	// Return JSON response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(forecast)
}
