package server

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"weather-cli/weather"
)

type Server struct{}

func New() *Server { return &Server{} }

func (s *Server) cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Vary", "Origin")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (s *Server) routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	mux.HandleFunc("/v1/weather", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		q := r.URL.Query()
		city := q.Get("city")
		latStr := q.Get("lat")
		lonStr := q.Get("lon")

		if city == "" && (latStr == "" || lonStr == "") {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "provide city or lat,lon"})
			return
		}

		if city != "" {
			forecast, location, err := weather.GetWeatherForCity(city)
			if err != nil {
				log.Printf("city request error: %v", err)
				w.WriteHeader(http.StatusBadGateway)
				_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			_ = json.NewEncoder(w).Encode(map[string]any{
				"location": location,
				"forecast": forecast,
			})
			return
		}

		lat, err1 := strconv.ParseFloat(latStr, 64)
		lon, err2 := strconv.ParseFloat(lonStr, 64)
		if err1 != nil || err2 != nil {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid coordinates"})
			return
		}

		forecast, err := weather.GetWeatherForCoordinates(lat, lon)
		if err != nil {
			log.Printf("coords request error: %v", err)
			w.WriteHeader(http.StatusBadGateway)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		_ = json.NewEncoder(w).Encode(map[string]any{
			"location": map[string]any{
				"latitude":  lat,
				"longitude": lon,
			},
			"forecast": forecast,
		})
	})

	return s.cors(mux)
}

func (s *Server) Start(addr string) error {
	return http.ListenAndServe(addr, s.routes())
}
