package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"weather-api/handlers"
)

func main() {
	// Configure port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Register API routes
	http.HandleFunc("/api/weather/city", handlers.CityWeatherHandler)
	http.HandleFunc("/api/weather/coord", handlers.CoordWeatherHandler)
	http.HandleFunc("/api/health", handlers.HealthCheckHandler)

	// Serve static files from ./static directory
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	// Start server
	addr := fmt.Sprintf(":%s", port)
	log.Printf("Weather API server starting on %s", addr)
	log.Printf("API endpoints:")
	log.Printf("  - GET /api/weather/city?name={city}")
	log.Printf("  - GET /api/weather/coord?lat={lat}&lon={lon}")
	log.Printf("  - GET /api/health")
	log.Printf("WebUI available at http://localhost:%s", port)

	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
