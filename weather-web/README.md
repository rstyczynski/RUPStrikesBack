# Weather Forecast WebUI

Browser-based user interface for viewing weather forecasts. Consumes the Weather REST API (Sprint 3) to display current weather and 3-day forecasts for cities worldwide.

## Features

- **City Search**: Search weather by city name
- **Current Weather**: Display current temperature and conditions
- **3-Day Forecast**: View daily high/low temperatures with weather icons
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Weather Icons**: Visual representation of weather conditions using emojis
- **Error Handling**: User-friendly error messages for invalid cities or API issues

## Prerequisites

- Go 1.21 or higher
- Weather REST API running on http://localhost:8080 (from Sprint 3)
  - Start the API first: `cd ../weather-api && ./weather-api`
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation

```bash
# Build the WebUI server
cd weather-web
go build -o weather-web
```

## Usage

### Start the WebUI Server

```bash
# Default port 8081
./weather-web

# Custom port
PORT=3000 ./weather-web
```

The server will start and display:
```
Weather WebUI server starting on http://localhost:8081
Make sure weather-api is running on http://localhost:8080
```

### Access the WebUI

1. Open your browser to http://localhost:8081
2. Enter a city name (e.g., "London", "Paris", "Tokyo")
3. Click "Get Forecast" or press Enter
4. View current weather and 3-day forecast

### Example Searches

- **Major Cities**: London, Paris, New York, Tokyo
- **Multi-word Cities**: San Francisco, Los Angeles, Rio de Janeiro
- **International**: München, São Paulo, 北京 (Beijing)

## Architecture

```
User Browser
    ↓
weather-web:8081 (Go HTTP server)
    ↓
static/index.html + style.css + app.js
    ↓
JavaScript fetch() → localhost:8080/weather (Sprint 3 API)
    ↓
Display forecast data
```

## File Structure

```
weather-web/
├── main.go              # HTTP server (serves static files)
├── static/
│   ├── index.html       # UI structure
│   ├── style.css        # Responsive styling
│   └── app.js           # API integration
├── go.mod               # Go module definition
└── README.md            # This file
```

## API Integration

The WebUI calls Sprint 3 REST API endpoints:

**Get Weather by City:**
```javascript
GET http://localhost:8080/weather?city=London
```

**Response:**
```json
{
  "location": {
    "name": "London",
    "country": "United Kingdom",
    "latitude": 51.51,
    "longitude": -0.13
  },
  "current": {
    "temperature_2m": 12.5,
    "weather_code": 2
  },
  "daily": {
    "time": ["2025-12-07", "2025-12-08", "2025-12-09"],
    "temperature_2m_max": [14.2, 13.8, 15.1],
    "temperature_2m_min": [8.1, 7.9, 9.5],
    "weather_code": [1, 2, 3]
  }
}
```

## Weather Codes

The UI maps Open-Meteo weather codes to emojis:

| Code | Icon | Description |
|------|------|-------------|
| 0 | ☀️ | Clear sky |
| 1-3 | 🌤️⛅☁️ | Partly cloudy to overcast |
| 45-48 | 🌫️ | Foggy |
| 51-67 | 🌧️ | Drizzle and rain |
| 71-77 | 🌨️ | Snow |
| 80-86 | 🌦️🌧️ | Rain/snow showers |
| 95-99 | ⛈️ | Thunderstorm |

Full codes: https://open-meteo.com/en/docs

## Error Handling

The WebUI handles common errors gracefully:

- **City not found (404)**: "City 'XYZ' not found. Please check the spelling and try again."
- **Invalid request (400)**: "Invalid request. Please enter a valid city name."
- **API unavailable (500)**: "Failed to fetch weather data. Please try again later."
- **Network error**: "Failed to fetch weather data. Please try again later."

## Browser Compatibility

- **Chrome/Edge**: Full support (latest versions)
- **Firefox**: Full support (latest versions)
- **Safari**: Full support (latest versions)
- **Mobile**: Responsive design works on iOS and Android browsers

## Troubleshooting

**WebUI won't load:**
- Check that weather-web server is running on port 8081
- Check browser console for errors (F12 → Console)

**API errors:**
- Ensure weather-api is running on port 8080: `curl http://localhost:8080/health`
- Check CORS is enabled in weather-api (Sprint 3)

**City not found:**
- Try different spellings (e.g., "Munich" vs "München")
- Use English city names for best results
- Check Open-Meteo geocoding database limitations

## Development

### Technology Stack
- **Backend**: Go standard library (`net/http`)
- **Frontend**: Pure HTML/CSS/JavaScript (no frameworks)
- **API Client**: Fetch API (ES6)
- **Styling**: CSS Grid, Flexbox, Gradients

### Local Development
1. Make changes to files in `static/`
2. Refresh browser (no rebuild needed for static files)
3. Rebuild only if you change `main.go`: `go build -o weather-web`

## Integration with Sprint 3

This WebUI depends on Sprint 3 REST API:

- **Dependency**: Weather API must be running (localhost:8080)
- **CORS**: Enabled in Sprint 3 (verified in tests)
- **Endpoints**: `/weather?city=X`, `/health`
- **Data Format**: JSON responses from Sprint 3

To run both services:
```bash
# Terminal 1: Start API
cd ../weather-api
./weather-api

# Terminal 2: Start WebUI
cd ../weather-web
./weather-web

# Terminal 3: Open browser
open http://localhost:8081
```

## Future Enhancements

Planned for upcoming sprints:

- **Sprint 6**: Map integration for city location visualization
- **Sprint 7**: Click on map to get weather for coordinates
- Hourly forecast display
- Weather alerts and warnings
- Favorite locations

## License

Part of the Weather Forecast application demo project.
