// Weather Web UI - Main Application
// Connects to weather-api REST API (localhost:8080)

const API_BASE_URL = 'http://localhost:8080';

// DOM Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const locationBtn = document.getElementById('location-btn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const weatherDisplay = document.getElementById('weather-display');
const apiStatus = document.getElementById('api-status');

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
    } catch (err) {
        if (err.message.includes('Failed to fetch')) {
            showError('Unable to connect to weather service. Make sure the API server is running on localhost:8080');
        } else {
            showError(err.message || 'Failed to fetch weather data');
        }
    }
}

// Display weather data in UI
function displayWeather(data) {
    hideElement(loading);
    hideElement(error);

    // Location info
    if (data.location) {
        document.getElementById('location-name').textContent =
            `${data.location.name}, ${data.location.country}`;
        document.getElementById('location-coords').textContent =
            `${data.location.latitude.toFixed(4)}°N, ${data.location.longitude.toFixed(4)}°E`;
    } else {
        document.getElementById('location-name').textContent = 'Weather Forecast';
        document.getElementById('location-coords').textContent = 'Location data unavailable';
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

// Initialize app
checkAPIHealth();
