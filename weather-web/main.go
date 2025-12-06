package main

import (
	"context"
	"html/template"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
)

// PageData holds data for template rendering
type PageData struct {
	APIEndpoint string
}

func main() {
	// Read port from environment (default 8081)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	// Read API endpoint from environment (default localhost:8080)
	apiEndpoint := os.Getenv("API_ENDPOINT")
	if apiEndpoint == "" {
		apiEndpoint = "http://localhost:8080"
	}

	// Parse template
	tmpl := template.Must(template.ParseFiles("templates/index.html"))

	// Setup routing
	mux := http.NewServeMux()

	// Root handler - render template
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}

		data := PageData{
			APIEndpoint: apiEndpoint,
		}

		if err := tmpl.Execute(w, data); err != nil {
			log.Printf("Template error: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		log.Printf("Served index page to %s", r.RemoteAddr)
	})

	// Static files handler
	fs := http.FileServer(http.Dir("static"))
	mux.Handle("/static/", http.StripPrefix("/static/", fs))

	// Health check handler
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok"}`))
	})

	// Configure server
	server := &http.Server{
		Addr:         ":" + port,
		Handler:      mux,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in goroutine
	go func() {
		log.Printf("Weather WebUI server starting on port %s", port)
		log.Printf("API endpoint configured: %s", apiEndpoint)
		log.Printf("Visit http://localhost:%s in your browser", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	// Graceful shutdown
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	<-stop

	log.Println("Shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server shutdown failed: %v", err)
	}

	log.Println("Server stopped gracefully")
}
