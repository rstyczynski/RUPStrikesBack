package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"weather-cli/weather"
)

// errorResponse sends a JSON error response
func errorResponse(w http.ResponseWriter, message string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

// healthHandler returns server health status
func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

// weatherHandler retrieves and returns weather data
func weatherHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	city := query.Get("city")
	latStr := query.Get("lat")
	lonStr := query.Get("lon")

	var forecast *weather.ForecastResponse
	var location *weather.Location
	var err error

	// Determine which lookup method to use
	if city != "" {
		// City-based lookup
		log.Printf("Weather request for city: %s", city)
		forecast, location, err = weather.GetWeatherForCity(city)
		if err != nil {
			log.Printf("Weather API error: %v", err)
			errorResponse(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else if latStr != "" && lonStr != "" {
		// Coordinate-based lookup
		lat, errLat := strconv.ParseFloat(latStr, 64)
		lon, errLon := strconv.ParseFloat(lonStr, 64)

		if errLat != nil || errLon != nil {
			errorResponse(w, "Invalid coordinates format", http.StatusBadRequest)
			return
		}

		log.Printf("Weather request for coordinates: lat=%f, lon=%f", lat, lon)
		forecast, err = weather.GetWeatherForCoordinates(lat, lon)
		if err != nil {
			log.Printf("Weather API error: %v", err)
			errorResponse(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		errorResponse(w, "Missing required parameters: city or (lat and lon)", http.StatusBadRequest)
		return
	}

	// Build response with location info if available
	response := map[string]interface{}{
		"forecast": forecast,
	}
	if location != nil {
		response["location"] = location
	}

	// Return successful response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
