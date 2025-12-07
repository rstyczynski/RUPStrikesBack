package handlers

import (
	"encoding/json"
	"net/http"
)

// HealthResponse represents health check response
type HealthResponse struct {
	Status  string `json:"status"`
	Service string `json:"service"`
	Version string `json:"version"`
}

// HealthCheckHandler handles GET /api/health
func HealthCheckHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(HealthResponse{
		Status:  "healthy",
		Service: "weather-api",
		Version: "1.0.0",
	})
}
