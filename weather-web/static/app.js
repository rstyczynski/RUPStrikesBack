// API configuration
const API_BASE_URL = 'http://localhost:8080';

// DOM elements
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const errorMessage = document.getElementById('errorMessage');
const loadingMessage = document.getElementById('loadingMessage');
const weatherDisplay = document.getElementById('weatherDisplay');

// Weather emoji mapping based on WMO codes
function getWeatherEmoji(code) {
    if (code === 0) return '☀️';  // Clear sky
    if (code <= 3) return '⛅';   // Partly cloudy
    if (code <= 48) return '🌫️';  // Fog
    if (code <= 67) return '🌧️';  // Rain
    if (code <= 77) return '❄️';  // Snow
    if (code <= 82) return '🌧️';  // Rain showers
    if (code <= 86) return '🌨️';  // Snow showers
    if (code <= 99) return '⛈️';  // Thunderstorm
    return '🌤️';  // Default
}

// Weather condition description based on WMO codes
function getWeatherDescription(code) {
    if (code === 0) return 'Clear sky';
    if (code === 1) return 'Mainly clear';
    if (code === 2) return 'Partly cloudy';
    if (code === 3) return 'Overcast';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 57) return 'Drizzle';
    if (code >= 61 && code <= 67) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Rain showers';
    if (code >= 85 && code <= 86) return 'Snow showers';
    if (code >= 95 && code <= 99) return 'Thunderstorm';
    return 'Unknown';
}

// Show/hide functions
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');
    loadingMessage.classList.add('hidden');
}

function showLoading() {
    loadingMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    weatherDisplay.classList.add('hidden');
}

function showWeather() {
    weatherDisplay.classList.remove('hidden');
    loadingMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');
}

// Fetch weather data
async function getWeather(city) {
    showLoading();

    try {
        const response = await fetch(`${API_BASE_URL}/weather?city=${encodeURIComponent(city)}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            }
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            showError('Unable to connect to weather API. Make sure the API server is running on port 8080.');
        } else {
            showError(error.message);
        }
    }
}

// Display weather data
function displayWeather(data) {
    const { location, forecast } = data;

    // Location info
    document.getElementById('cityName').textContent =
        `${location.name}, ${location.country}`;
    document.getElementById('coordinates').textContent =
        `${location.latitude.toFixed(2)}°N, ${location.longitude.toFixed(2)}°E`;

    // Current weather
    const currentTemp = forecast.current.temperature_2m;
    const currentCode = forecast.current.weather_code;

    document.getElementById('currentIcon').textContent = getWeatherEmoji(currentCode);
    document.getElementById('currentTemp').textContent = `${currentTemp}°C`;
    document.getElementById('currentConditions').textContent = getWeatherDescription(currentCode);

    // 3-day forecast
    const forecastDays = document.getElementById('forecastDays');
    forecastDays.innerHTML = '';

    for (let i = 0; i < 3 && i < forecast.daily.time.length; i++) {
        const date = new Date(forecast.daily.time[i]);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const tempMax = forecast.daily.temperature_2m_max[i];
        const tempMin = forecast.daily.temperature_2m_min[i];
        const weatherCode = forecast.daily.weather_code[i];

        const dayCard = document.createElement('div');
        dayCard.className = 'forecast-day';
        dayCard.innerHTML = `
            <div class="day-name">${dayName}</div>
            <div class="day-icon">${getWeatherEmoji(weatherCode)}</div>
            <div class="day-temp">
                <span class="temp-max">${tempMax}°</span>
                <span class="temp-min">${tempMin}°</span>
            </div>
        `;

        forecastDays.appendChild(dayCard);
    }

    showWeather();
}

// Form submit handler
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();

    if (city) {
        getWeather(city);
    }
});

// Initial message
window.addEventListener('load', () => {
    // Optionally load a default city
    // getWeather('London');
});
