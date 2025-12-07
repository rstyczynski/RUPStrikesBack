package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	// Serve static files from ./static directory
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/", fs)

	// Start server
	addr := ":" + port
	fmt.Printf("Weather WebUI server starting on http://localhost%s\n", addr)
	fmt.Println("Make sure weather-api is running on http://localhost:8080")

	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatal(err)
	}
}
