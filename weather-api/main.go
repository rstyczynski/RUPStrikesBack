package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"weather-api/handlers"
	"weather-api/internal/cors"
)

func main() {
	mux := http.NewServeMux()
	mux.Handle("/weather", handlers.NewWeatherHandler())

	// Wrap with CORS middleware
	handler := cors.Middleware(mux)

	// Determine port from environment (default 8080)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	addr := ":" + port

	srv := &http.Server{
		Addr:              addr,
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("weather-api: starting HTTP server on %s (override with PORT env var)", addr)
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server failed: %v", err)
	}
}
