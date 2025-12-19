package main

import (
	"log"
	"net/http"
	"time"

	"weather-api/handlers"
	"weather-api/internal/cors"
)

func main() {
	mux := http.NewServeMux()
	mux.Handle("/weather", handlers.NewWeatherHandler())

	// Wrap with CORS middleware
	handler := cors.Middleware(mux)

	srv := &http.Server{
		Addr:              ":8080",
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Println("weather-api: starting HTTP server on :8080")
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server failed: %v", err)
	}
}
