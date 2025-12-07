// Weather WebUI - Go web server serving static files
// Serves HTML/CSS/JavaScript frontend that consumes weather-api REST API
package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

const port = ":3000"

func main() {
	// Get the directory where the executable is located
	exePath, err := os.Executable()
	if err != nil {
		log.Fatal("Failed to get executable path:", err)
	}
	exeDir := filepath.Dir(exePath)

	// Create file server that only serves files from the executable's directory
	// and disables directory listings
	fs := http.FileServer(http.Dir(exeDir))

	// Wrap with handler that:
	// 1. Serves index.html for root path
	// 2. Disables directory listings
	// 3. Only serves files that exist in the weather-web directory
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// If root path, serve index.html
		if r.URL.Path == "/" {
			http.ServeFile(w, r, filepath.Join(exeDir, "index.html"))
			return
		}

		// For other paths, check if file exists before serving
		requestedPath := filepath.Join(exeDir, r.URL.Path)

		// Security: Ensure the requested path is within exeDir (prevent directory traversal)
		relPath, err := filepath.Rel(exeDir, requestedPath)
		if err != nil || relPath == ".." || len(relPath) > 0 && relPath[:2] == ".." {
			http.NotFound(w, r)
			return
		}

		// Check if file exists
		if _, err := os.Stat(requestedPath); os.IsNotExist(err) {
			http.NotFound(w, r)
			return
		}

		// Serve the file
		fs.ServeHTTP(w, r)
	})

	log.Printf("Weather WebUI server starting on port %s", port)
	log.Printf("Serving files from: %s", exeDir)
	log.Printf("Open http://localhost%s in your browser", port)
	log.Printf("Make sure weather-api is running on port 8080")
	log.Fatal(http.ListenAndServe(port, nil))
}
