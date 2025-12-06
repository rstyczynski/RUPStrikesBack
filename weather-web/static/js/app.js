// Weather WebUI Application Logic

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Setup tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', handleTabSwitch);
    });

    // Setup form submissions
    document.getElementById('city-form').addEventListener('submit', handleCitySearch);
    document.getElementById('coordinates-form').addEventListener('submit', handleCoordinatesSearch);
}

// Tab Switching Handler
function handleTabSwitch(event) {
    const tabName = event.target.dataset.tab;

    // Update button states
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update panel visibility
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`${tabName}-form`).classList.add('active');

    // Clear previous results and errors
    clearError();
    hideWeatherDisplay();
}

// City Search Handler
async function handleCitySearch(event) {
    event.preventDefault();

    const cityInput = document.getElementById('city-input');
    const cityName = cityInput.value.trim();

    if (!validateCityInput(cityName)) {
        return;
    }

    clearError();
    showLoading();
    disableForm('city-form');

    try {
        const response = await fetch(`${API_ENDPOINT}/weather/city?name=${encodeURIComponent(cityName)}`);
        const data = await response.json();

        if (!response.ok) {
            displayError(data.error || 'Failed to retrieve weather data');
            return;
        }

        displayWeather(data, cityName);
    } catch (error) {
        displayError('Unable to connect to weather service. Please ensure the Weather API is running on port 8080.');
    } finally {
        hideLoading();
        enableForm('city-form');
    }
}

// Coordinates Search Handler
async function handleCoordinatesSearch(event) {
    event.preventDefault();

    const latInput = document.getElementById('lat-input');
    const lonInput = document.getElementById('lon-input');
    const lat = latInput.value.trim();
    const lon = lonInput.value.trim();

    if (!validateCoordinates(lat, lon)) {
        return;
    }

    clearError();
    showLoading();
    disableForm('coordinates-form');

    try {
        const response = await fetch(`${API_ENDPOINT}/weather/coordinates?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
        const data = await response.json();

        if (!response.ok) {
            displayError(data.error || 'Failed to retrieve weather data');
            return;
        }

        displayWeather(data, `Lat: ${lat}, Lon: ${lon}`);
    } catch (error) {
        displayError('Unable to connect to weather service. Please ensure the Weather API is running on port 8080.');
    } finally {
        hideLoading();
        enableForm('coordinates-form');
    }
}

// Validation Functions
function validateCityInput(cityName) {
    if (!cityName) {
        displayError('Please enter a city name');
        return false;
    }
    return true;
}

function validateCoordinates(lat, lon) {
    if (!lat || !lon) {
        displayError('Please enter both latitude and longitude');
        return false;
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
        displayError('Latitude and longitude must be numbers');
        return false;
    }

    if (latitude < -90 || latitude > 90) {
        displayError('Latitude must be between -90 and 90');
        return false;
    }

    if (longitude < -180 || longitude > 180) {
        displayError('Longitude must be between -180 and 180');
        return false;
    }

    return true;
}

// Weather Display Function
function displayWeather(data, locationName) {
    const currentWeatherDiv = document.getElementById('current-weather');
    const forecastDiv = document.getElementById('forecast');

    // Display current weather
    const currentIcon = getWeatherIcon(data.current.weather_code);
    currentWeatherDiv.innerHTML = `
        <h2>${locationName ? locationName : 'Current Weather'}</h2>
        <div class="current-details">
            <span class="weather-icon-large">${currentIcon}</span>
            <span class="temperature">${data.current.temperature_2m}°C</span>
            <span class="time">${formatTime(data.current.time)}</span>
        </div>
    `;

    // Display 3-day forecast
    let forecastHTML = '<h2>3-Day Forecast</h2><div class="forecast-grid">';
    for (let i = 0; i < 3 && i < data.daily.time.length; i++) {
        const icon = getWeatherIcon(data.daily.weather_code[i]);
        forecastHTML += `
            <div class="forecast-card">
                <div class="date">${formatDate(data.daily.time[i])}</div>
                <div class="weather-icon">${icon}</div>
                <div class="temps">
                    <span class="temp-high">↑ ${data.daily.temperature_2m_max[i]}°C</span>
                    <span class="temp-low">↓ ${data.daily.temperature_2m_min[i]}°C</span>
                </div>
            </div>
        `;
    }
    forecastHTML += '</div>';
    forecastDiv.innerHTML = forecastHTML;

    // Show weather display
    document.getElementById('weather-display').style.display = 'block';
}

// Weather Code to Icon Mapping
function getWeatherIcon(weatherCode) {
    // Open-Meteo WMO Weather interpretation codes
    const weatherIcons = {
        0: '☀️',   // Clear sky
        1: '🌤️',   // Mainly clear
        2: '⛅',   // Partly cloudy
        3: '☁️',   // Overcast
        45: '🌫️',  // Fog
        48: '🌫️',  // Depositing rime fog
        51: '🌦️',  // Drizzle: Light
        53: '🌦️',  // Drizzle: Moderate
        55: '🌧️',  // Drizzle: Dense
        61: '🌧️',  // Rain: Slight
        63: '🌧️',  // Rain: Moderate
        65: '🌧️',  // Rain: Heavy
        71: '🌨️',  // Snow fall: Slight
        73: '🌨️',  // Snow fall: Moderate
        75: '❄️',  // Snow fall: Heavy
        77: '🌨️',  // Snow grains
        80: '🌦️',  // Rain showers: Slight
        81: '🌧️',  // Rain showers: Moderate
        85: '🌨️',  // Snow showers: Slight
        86: '❄️',  // Snow showers: Heavy
        95: '⛈️',  // Thunderstorm
        96: '⛈️',  // Thunderstorm with slight hail
        99: '⛈️'   // Thunderstorm with heavy hail
    };

    return weatherIcons[weatherCode] || '🌡️'; // Default thermometer if unknown
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatTime(timeString) {
    const date = new Date(timeString);
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    return date.toLocaleTimeString('en-US', options);
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
    hideWeatherDisplay();
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function displayError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    // Hide weather display
    hideWeatherDisplay();

    // Hide loading state
    hideLoading();
}

function clearError() {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
}

function hideWeatherDisplay() {
    document.getElementById('weather-display').style.display = 'none';
}

function disableForm(formId) {
    const form = document.getElementById(formId);
    const button = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input');

    button.disabled = true;
    inputs.forEach(input => input.disabled = true);
}

function enableForm(formId) {
    const form = document.getElementById(formId);
    const button = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input');

    button.disabled = false;
    inputs.forEach(input => input.disabled = false);
}
