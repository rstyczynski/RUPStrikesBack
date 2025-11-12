// Package geocode provides city name to coordinates conversion using Open-Meteo Geocoding API
package geocode

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

const geocodingAPIURL = "https://geocoding-api.open-meteo.com/v1/search"

// GeoLocation represents a geographic location
type GeoLocation struct {
	Name      string  `json:"name"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Country   string  `json:"country"`
}

type geocodingResponse struct {
	Results []GeoLocation `json:"results"`
}

// Geocode converts a city name to geographic coordinates
func Geocode(cityName string) (*GeoLocation, error) {
	// Build API URL
	apiURL := fmt.Sprintf("%s?name=%s&count=1&language=en&format=json",
		geocodingAPIURL, url.QueryEscape(cityName))

	// Make HTTP request
	resp, err := http.Get(apiURL)
	if err != nil {
		return nil, fmt.Errorf("HTTP request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API returned status %d", resp.StatusCode)
	}

	// Parse JSON response
	var geoResp geocodingResponse
	if err := json.NewDecoder(resp.Body).Decode(&geoResp); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	if len(geoResp.Results) == 0 {
		return nil, fmt.Errorf("location not found")
	}

	return &geoResp.Results[0], nil
}
