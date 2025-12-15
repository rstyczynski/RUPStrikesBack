package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	// Serve static files from the static directory
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/", fs)

	port := ":8081"
	fmt.Printf("Weather WebUI server starting on %s\n", port)
	fmt.Println("Open http://localhost:8081 in your browser")
	fmt.Println("Make sure weather-api is running on port 8080")

	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal(err)
	}
}
