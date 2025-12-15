package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/rstyczynski/RUPStrikesBack/weather-cli/weather"
)

// ErrorResponse represents an error message in JSON format
type ErrorResponse struct {
	Error string `json:"error"`
}

// WeatherResponse combines location and forecast data
type WeatherResponse struct {
	Location *weather.Location        `json:"location"`
	Forecast *weather.ForecastResponse `json:"forecast"`
}

// corsMiddleware adds CORS headers to all responses
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

// weatherHandler handles GET /weather?city=cityname requests
func weatherHandler(w http.ResponseWriter, r *http.Request) {
	// Extract city parameter
	city := r.URL.Query().Get("city")
	if city == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "city parameter required"})
		return
	}

	// Get weather data using imported weather package
	forecast, location, err := weather.GetWeatherForCity(city)
	if err != nil {
		// Check if it's a geocoding error (city not found)
		if location == nil {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(ErrorResponse{Error: "city not found"})
			return
		}

		// Forecast retrieval error
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "failed to get forecast"})
		return
	}

	// Success - return weather data
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(WeatherResponse{
		Location: location,
		Forecast: forecast,
	})
}

func main() {
	// Register handler with CORS middleware
	http.HandleFunc("/weather", corsMiddleware(weatherHandler))

	// Start server
	log.Println("Weather API server starting on :8080")
	log.Println("Example: curl 'http://localhost:8080/weather?city=London'")

	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
