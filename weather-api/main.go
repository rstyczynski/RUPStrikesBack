package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"weather-api/handlers"
	"weather-api/middleware"
)

func main() {
	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Create router
	mux := http.NewServeMux()

	// Register endpoints
	mux.HandleFunc("/weather", handlers.Weather)
	mux.HandleFunc("/health", handlers.Health)

	// Wrap with CORS middleware
	handler := middleware.CORS(mux)

	// Start server
	addr := ":" + port
	fmt.Printf("Weather API server starting on http://localhost%s\n", addr)
	fmt.Println("Endpoints:")
	fmt.Println("  GET /weather?city=<name>")
	fmt.Println("  GET /weather?lat=<lat>&lon=<lon>")
	fmt.Println("  GET /health")

	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
