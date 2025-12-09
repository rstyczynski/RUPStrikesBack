// Weather Web UI - Main Application
// Connects to weather-api REST API (localhost:8080)

const API_BASE_URL = 'http://localhost:8080';

// DOM Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const locationBtn = document.getElementById('location-btn');
const mapToggleBtn = document.getElementById('map-toggle-btn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const weatherDisplay = document.getElementById('weather-display');
const apiStatus = document.getElementById('api-status');
const mapContainer = document.getElementById('map-container');
const locationName = document.getElementById('location-name');
const locationCoords = document.getElementById('location-coords');

// Map variables
let map = null;
let cityMarker = null;
let clickMarker = null;

// Global scope for clickMarker
window.clickMarker = null;

// Weather icon mapping (WMO weather codes → Unicode emoji)
const WEATHER_ICONS = {
    0: '☀️',    // Clear sky
    1: '🌤️',    // Mainly clear
    2: '⛅',    // Partly cloudy
    3: '☁️',    // Overcast
    45: '🌫️',   // Fog
    48: '🌫️',   // Depositing rime fog
    51: '🌦️',   // Drizzle light
    53: '🌦️',   // Drizzle moderate
    55: '🌧️',   // Drizzle dense
    61: '🌧️',   // Rain slight
    63: '🌧️',   // Rain moderate
    65: '🌧️',   // Rain heavy
    71: '❄️',   // Snow fall slight
    73: '❄️',   // Snow fall moderate
    75: '❄️',   // Snow fall heavy
    80: '🌦️',   // Rain showers slight
    81: '🌧️',   // Rain showers moderate
    82: '🌧️',   // Rain showers violent
    85: '🌨️',   // Snow showers slight
    86: '🌨️',   // Snow showers heavy
    95: '⛈️',   // Thunderstorm
    96: '⛈️',   // Thunderstorm with slight hail
    99: '⛈️'    // Thunderstorm with heavy hail
};

// Get weather icon for WMO code
function getWeatherIcon(code) {
    return WEATHER_ICONS[code] || '🌤️';
}

// Format date from YYYY-MM-DD to readable format
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Show/hide UI elements
function showElement(element) {
    element.classList.remove('hidden');
}

function hideElement(element) {
    element.classList.add('hidden');
}

// Show loading state
function showLoading() {
    hideElement(error);
    hideElement(weatherDisplay);
    showElement(loading);
}

// Show error message
function showError(message) {
    hideElement(loading);
    hideElement(weatherDisplay);
    error.textContent = message;
    showElement(error);
}

// Fetch weather by city name
async function searchCity(city) {
    showLoading();

    try {
        const response = await fetch(`${API_BASE_URL}/weather?city=${encodeURIComponent(city)}`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        displayWeather(data);
    } catch (err) {
        if (err.message.includes('Failed to fetch')) {
            showError('Unable to connect to weather service. Make sure the API server is running on localhost:8080');
        } else {
            showError(err.message || 'Failed to fetch weather data');
        }
    }
}

// Fetch weather by coordinates
async function searchByCoordinates(lat, lon) {
    showLoading();

    try {
        const response = await fetch(`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        displayWeather(data);
        
        // Update map for clicked location
        if (map && !mapContainer.classList.contains('hidden')) {
            centerMapOnLocation(lat, lon);
            addLocationMarker(lat, lon);
        }
    } catch (err) {
        if (err.message.includes('Failed to fetch')) {
            showError('Unable to connect to weather service. Make sure the API server is running on localhost:8080');
        } else {
            showError(err.message || 'Failed to fetch weather data');
        }
    }
}

// Handle map clicks
function handleMapClick(e) {
    if (map) {
        const { lat, lng } = e.latlng;
        getWeatherForPoint(lat, lng);
    }
}

// Get weather for clicked point
async function getWeatherForPoint(lat, lon) {
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Update location display for clicked point
        locationName.textContent = `Weather at ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`;
        locationCoords.textContent = `Clicked coordinates`;
        
        displayWeather(data);
        
        // Add red marker for clicked location
        if (map) {
            if (window.clickMarker) {
                map.removeLayer(window.clickMarker);
            }
            window.clickMarker = L.marker([lat, lon], {
                color: 'red'
            }).addTo(map);
        }
        
    } catch (err) {
        if (err.message.includes('Failed to fetch')) {
            showError('Unable to connect to weather service. Make sure the API server is running on localhost:8080');
        } else {
            showError(err.message || 'Failed to fetch weather data');
        }
    }
}

// Map functions
function initializeMap() {
    if (typeof L !== 'undefined') {
        map = L.map('map').setView([51.5074, -0.1278], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    }
}

function centerMapOnLocation(lat, lon) {
    if (map) {
        map.setView([lat, lon], 12);
        if (cityMarker) {
            map.removeLayer(cityMarker);
        }
        cityMarker = L.marker([lat, lon]).addTo(map);
    }
}

function addLocationMarker(lat, lon) {
    if (map) {
        if (window.clickMarker) {
            map.removeLayer(window.clickMarker);
        }
        window.clickMarker = L.marker([lat, lon], {
            color: 'red'
        }).addTo(map);
    }
}

function toggleMap() {
    if (mapContainer.classList.contains('hidden')) {
        showElement(mapContainer);
        mapToggleBtn.textContent = '🗺️ Hide Map';
        if (map && !map._container) {
            map.invalidateSize();
        }
    } else {
        hideElement(mapContainer);
        mapToggleBtn.textContent = '🗺️ Show Map';
    }
}

// Display weather data in UI
function displayWeather(data) {
    hideElement(loading);
    hideElement(error);

    // Location info
    if (data.location) {
        locationName.textContent = `${data.location.name}, ${data.location.country}`;
        locationCoords.textContent = `${data.location.latitude.toFixed(4)}°N, ${data.location.longitude.toFixed(4)}°E`;
        
        // Center map on city location if map is visible
        if (map && !mapContainer.classList.contains('hidden')) {
            centerMapOnLocation(data.location.latitude, data.location.longitude);
            addLocationMarker(data.location.latitude, data.location.longitude);
        }
    } else {
        locationName.textContent = 'Weather Forecast';
        locationCoords.textContent = 'Location data unavailable';
    }

    // Current weather
    if (data.forecast && data.forecast.current) {
        const currentIcon = getWeatherIcon(data.forecast.current.weather_code);
        document.getElementById('current-icon').textContent = currentIcon;
        document.getElementById('current-temp').textContent =
            `${Math.round(data.forecast.current.temperature_2m)}°C`;
        document.getElementById('current-desc').textContent =
            getWeatherDescription(data.forecast.current.weather_code);
        document.getElementById('current-time').textContent =
            `As of ${data.forecast.current.time}`;
    }

    // 3-day forecast
    if (data.forecast && data.forecast.daily) {
        const forecastGrid = document.getElementById('forecast-grid');
        forecastGrid.innerHTML = '';

        for (let i = 0; i < Math.min(3, data.forecast.daily.time.length); i++) {
            const card = document.createElement('div');
            card.className = 'forecast-card';

            const icon = getWeatherIcon(data.forecast.daily.weather_code[i]);
            const maxTemp = Math.round(data.forecast.daily.temperature_2m_max[i]);
            const minTemp = Math.round(data.forecast.daily.temperature_2m_min[i]);

            card.innerHTML = `
                <div class="date">${formatDate(data.forecast.daily.time[i])}</div>
                <div class="icon">${icon}</div>
                <div class="temps">${maxTemp}° / ${minTemp}°</div>
                <div class="temp-range">High / Low</div>
            `;

            forecastGrid.appendChild(card);
        }
    }

    showElement(weatherDisplay);
}

// Get human-readable weather description
function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Foggy',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        80: 'Rain showers',
        81: 'Rain showers',
        82: 'Violent rain showers',
        85: 'Snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Thunderstorm with heavy hail'
    };
    return descriptions[code] || 'Unknown';
}

// Handle search form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        searchCity(city);
    }
});

// Handle current location button
locationBtn.addEventListener('click', () => {
    if ('geolocation' in navigator) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                searchByCoordinates(latitude, longitude);
            },
            (err) => {
                showError(`Location access denied: ${err.message}. Please search by city name.`);
            }
        );
    } else {
        showError('Geolocation is not supported by your browser. Please search by city name.');
    }
});

// Handle map toggle button
mapToggleBtn.addEventListener('click', () => {
    toggleMap();
});

// Check API health on page load
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        if (data.status === 'ok') {
            apiStatus.textContent = '✓ Connected';
            apiStatus.style.color = '#4caf50';
        } else {
            apiStatus.textContent = '✗ API Error';
            apiStatus.style.color = '#f44336';
        }
    } catch (err) {
        apiStatus.textContent = '✗ Not connected';
        apiStatus.style.color = '#f44336';
    }
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure container is visible
    setTimeout(() => {
        initializeMap();
        
        // Add click handler to map
        if (map) {
            map.on('click', handleMapClick);
        }
    }, 100);
});

// Initialize app
checkAPIHealth();
