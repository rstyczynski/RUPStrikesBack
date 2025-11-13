// Weather API - REST API for weather forecast service
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/rstyczynski/weather-api/responses"
	"github.com/rstyczynski/weather-cli/geocode"
	"github.com/rstyczynski/weather-cli/weather"
	"github.com/rstyczynski/weather-cli/display"
)

const version = "1.0.0"

func main() {
	// Configuration
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Router setup
	mux := http.NewServeMux()

	// Register routes
	mux.HandleFunc("GET /api/v1/weather/city/{city}", weatherByCityHandler)
	mux.HandleFunc("GET /api/v1/weather/coordinates", weatherByCoordinatesHandler)
	mux.HandleFunc("GET /api/v1/health", healthHandler)

	// Middleware stack
	handler := loggingMiddleware(
		corsMiddleware(
			recoveryMiddleware(mux),
		),
	)

	// Server setup
	server := &http.Server{
		Addr:         ":" + port,
		Handler:      handler,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// Graceful shutdown
	go func() {
		log.Printf("Starting Weather API on port %s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed: %v", err)
		}
	}()

	// Wait for interrupt
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server stopped")
}

// weatherByCityHandler handles GET /api/v1/weather/city/{city}
func weatherByCityHandler(w http.ResponseWriter, r *http.Request) {
	city := r.PathValue("city")

	if city == "" {
		responses.WriteBadRequest(w, "City name is required")
		return
	}

	// Geocode city
	location, err := geocode.Geocode(city)
	if err != nil {
		responses.WriteNotFound(w, fmt.Sprintf("Could not find location '%s'", city))
		return
	}

	// Fetch weather
	weatherData, err := weather.FetchWeather(location.Latitude, location.Longitude)
	if err != nil {
		responses.WriteInternalError(w, "Failed to fetch weather data")
		return
	}

	// Transform and return
	apiResponse := transformWeatherData(location, weatherData)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(apiResponse)
}

// weatherByCoordinatesHandler handles GET /api/v1/weather/coordinates?lat=X&lon=Y
func weatherByCoordinatesHandler(w http.ResponseWriter, r *http.Request) {
	// Parse query parameters
	latStr := r.URL.Query().Get("lat")
	lonStr := r.URL.Query().Get("lon")

	if latStr == "" || lonStr == "" {
		responses.WriteBadRequest(w, "Missing required parameters: lat and lon")
		return
	}

	// Parse coordinates (simplified - production would validate ranges)
	var lat, lon float64
	fmt.Sscanf(latStr, "%f", &lat)
	fmt.Sscanf(lonStr, "%f", &lon)

	// Fetch weather
	weatherData, err := weather.FetchWeather(lat, lon)
	if err != nil {
		responses.WriteInternalError(w, "Failed to fetch weather data")
		return
	}

	// Transform and return (no location name for coordinates)
	apiResponse := transformWeatherDataCoords(weatherData)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(apiResponse)
}

// healthHandler handles GET /api/v1/health
func healthHandler(w http.ResponseWriter, r *http.Request) {
	health := responses.HealthResponse{
		Status:    "healthy",
		Service:   "weather-api",
		Version:   version,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(health)
}

// transformWeatherData transforms Sprint 2 data to API response
func transformWeatherData(loc *geocode.GeoLocation, data *weather.WeatherData) responses.WeatherResponse {
	response := responses.WeatherResponse{
		Location: responses.LocationResponse{
			Name:      loc.Name,
			Country:   loc.Country,
			Latitude:  data.Latitude,
			Longitude: data.Longitude,
		},
		Current: responses.CurrentWeatherResponse{
			Temperature:   data.CurrentWeather.Temperature,
			Condition:     display.GetWeatherDescription(data.CurrentWeather.WeatherCode),
			WeatherCode:   data.CurrentWeather.WeatherCode,
			WindSpeed:     data.CurrentWeather.WindSpeed,
			WindDirection: data.CurrentWeather.WindDirection,
			Time:          data.CurrentWeather.Time,
		},
		Forecast: make([]responses.ForecastDayResponse, 0, 3),
	}

	for i := 0; i < len(data.Daily.Time) && i < 3; i++ {
		response.Forecast = append(response.Forecast, responses.ForecastDayResponse{
			Date:          data.Daily.Time[i],
			MaxTemp:       data.Daily.TempMax[i],
			MinTemp:       data.Daily.TempMin[i],
			Condition:     display.GetWeatherDescription(data.Daily.WeatherCode[i]),
			WeatherCode:   data.Daily.WeatherCode[i],
			Precipitation: data.Daily.Precipitation[i],
		})
	}

	return response
}

// transformWeatherDataCoords transforms weather data for coordinates endpoint
func transformWeatherDataCoords(data *weather.WeatherData) responses.WeatherResponse {
	response := responses.WeatherResponse{
		Location: responses.LocationResponse{
			Name:      "",
			Country:   "",
			Latitude:  data.Latitude,
			Longitude: data.Longitude,
		},
		Current: responses.CurrentWeatherResponse{
			Temperature:   data.CurrentWeather.Temperature,
			Condition:     display.GetWeatherDescription(data.CurrentWeather.WeatherCode),
			WeatherCode:   data.CurrentWeather.WeatherCode,
			WindSpeed:     data.CurrentWeather.WindSpeed,
			WindDirection: data.CurrentWeather.WindDirection,
			Time:          data.CurrentWeather.Time,
		},
		Forecast: make([]responses.ForecastDayResponse, 0, 3),
	}

	for i := 0; i < len(data.Daily.Time) && i < 3; i++ {
		response.Forecast = append(response.Forecast, responses.ForecastDayResponse{
			Date:          data.Daily.Time[i],
			MaxTemp:       data.Daily.TempMax[i],
			MinTemp:       data.Daily.TempMin[i],
			Condition:     display.GetWeatherDescription(data.Daily.WeatherCode[i]),
			WeatherCode:   data.Daily.WeatherCode[i],
			Precipitation: data.Daily.Precipitation[i],
		})
	}

	return response
}

// Middleware implementations

// loggingMiddleware logs all HTTP requests
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		log.Printf("[%s] %s from %s", r.Method, r.URL.Path, r.RemoteAddr)
		next.ServeHTTP(w, r)
		log.Printf("[%s] %s completed in %v", r.Method, r.URL.Path, time.Since(start))
	})
}

// corsMiddleware adds CORS headers for browser access
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// recoveryMiddleware recovers from panics
func recoveryMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("Panic recovered: %v", err)
				responses.WriteInternalError(w, "Internal server error")
			}
		}()
		next.ServeHTTP(w, r)
	})
}
