// Package responses provides error response helpers
package responses

import (
	"encoding/json"
	"net/http"
)

// WriteError writes a standardized JSON error response
func WriteError(w http.ResponseWriter, code string, message string, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	errorResp := ErrorResponse{
		Error: ErrorDetail{
			Code:    code,
			Message: message,
			Status:  status,
		},
	}

	json.NewEncoder(w).Encode(errorResp)
}

// WriteBadRequest writes a 400 Bad Request error
func WriteBadRequest(w http.ResponseWriter, message string) {
	WriteError(w, "BAD_REQUEST", message, http.StatusBadRequest)
}

// WriteNotFound writes a 404 Not Found error
func WriteNotFound(w http.ResponseWriter, message string) {
	WriteError(w, "NOT_FOUND", message, http.StatusNotFound)
}

// WriteInternalError writes a 500 Internal Server Error
func WriteInternalError(w http.ResponseWriter, message string) {
	WriteError(w, "INTERNAL_ERROR", message, http.StatusInternalServerError)
}
