package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"weather-cli/weather"
)

// Weather handles GET /weather requests with city name or coordinates
func Weather(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	city := r.URL.Query().Get("city")
	latStr := r.URL.Query().Get("lat")
	lonStr := r.URL.Query().Get("lon")

	// Route based on query parameters
	if city != "" {
		handleCityRequest(w, city)
	} else if latStr != "" && lonStr != "" {
		handleCoordinatesRequest(w, latStr, lonStr)
	} else {
		respondError(w, http.StatusBadRequest, "missing city or coordinates parameters")
	}
}

// handleCityRequest processes city name queries
func handleCityRequest(w http.ResponseWriter, city string) {
	// Use Sprint 2 package function - ZERO CODE DUPLICATION!
	forecast, location, err := weather.GetWeatherForCity(city)
	if err != nil {
		respondError(w, http.StatusNotFound, "city not found: "+err.Error())
		return
	}

	// Return combined response with location and forecast
	response := map[string]interface{}{
		"location": location,
		"current":  forecast.Current,
		"daily":    forecast.Daily,
	}

	json.NewEncoder(w).Encode(response)
}

// handleCoordinatesRequest processes lat/lon queries
func handleCoordinatesRequest(w http.ResponseWriter, latStr, lonStr string) {
	lat, err := strconv.ParseFloat(latStr, 64)
	if err != nil {
		respondError(w, http.StatusBadRequest, "invalid latitude")
		return
	}

	lon, err := strconv.ParseFloat(lonStr, 64)
	if err != nil {
		respondError(w, http.StatusBadRequest, "invalid longitude")
		return
	}

	// Validate coordinate ranges
	if lat < -90 || lat > 90 {
		respondError(w, http.StatusBadRequest, "latitude must be between -90 and 90")
		return
	}
	if lon < -180 || lon > 180 {
		respondError(w, http.StatusBadRequest, "longitude must be between -180 and 180")
		return
	}

	// Use Sprint 2 package function - ZERO CODE DUPLICATION!
	forecast, err := weather.GetWeatherForCoordinates(lat, lon)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "failed to fetch weather: "+err.Error())
		return
	}

	json.NewEncoder(w).Encode(forecast)
}

// Health handles GET /health requests
func Health(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

// respondError sends JSON error response
func respondError(w http.ResponseWriter, code int, message string) {
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}
