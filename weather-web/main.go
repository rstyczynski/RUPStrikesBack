// Weather WebUI - Go web server serving static files
// Serves HTML/CSS/JavaScript frontend that consumes weather-api REST API
package main

import (
	"log"
	"net/http"
)

const port = ":3000"

func main() {
	// Serve static files from current directory
	fs := http.FileServer(http.Dir("."))
	http.Handle("/", fs)

	log.Printf("Weather WebUI server starting on port %s", port)
	log.Printf("Open http://localhost%s in your browser", port)
	log.Printf("Make sure weather-api is running on port 8080")
	log.Fatal(http.ListenAndServe(port, nil))
}
