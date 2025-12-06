package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/rstyczynski/RUPStrikesBack/weather-api/handlers"
)

func main() {
	// Read port from environment variable (default 8080)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Setup routing with http.ServeMux
	mux := http.NewServeMux()
	mux.HandleFunc("/weather/city", handlers.HandleWeatherCity)
	mux.HandleFunc("/weather/coordinates", handlers.HandleWeatherCoordinates)
	mux.HandleFunc("/health", handlers.HandleHealth)

	// Configure HTTP server with timeouts
	server := &http.Server{
		Addr:         ":" + port,
		Handler:      mux,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in goroutine to enable graceful shutdown
	go func() {
		log.Printf("Weather API server starting on port %s", port)
		log.Printf("Endpoints:")
		log.Printf("  GET /weather/city?name={cityName}")
		log.Printf("  GET /weather/coordinates?lat={latitude}&lon={longitude}")
		log.Printf("  GET /health")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	<-stop

	log.Println("Shutting down server gracefully...")

	// Create shutdown context with 10 second timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Attempt graceful shutdown
	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server shutdown failed: %v", err)
	}

	log.Println("Server stopped gracefully")
}
