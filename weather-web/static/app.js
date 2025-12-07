const API_URL = 'http://localhost:8080';

// Global map instance and marker
let map = null;
let marker = null;

// Initialize map on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize map (hidden initially, world view)
    map = L.map('map').setView([0, 0], 2);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Add click event handler for RSB-7 (click-to-forecast)
    map.on('click', async (e) => {
        const lat = e.latlng.lat.toFixed(2);
        const lon = e.latlng.lng.toFixed(2);

        // Show loading state
        showLoading();

        try {
            const response = await fetch(`${API_URL}/weather?lat=${lat}&lon=${lon}`);

            if (!response.ok) {
                throw new Error('Failed to fetch weather for coordinates. Please try again.');
            }

            const data = await response.json();
            displayWeather(data);

        } catch (error) {
            showError(error.message);
        }
    });
});

// Form submission handler
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const city = document.getElementById('cityInput').value.trim();
    if (!city) return;

    // Show loading state
    showLoading();

    try {
        const response = await fetch(`${API_URL}/weather?city=${encodeURIComponent(city)}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
            } else if (response.status === 400) {
                throw new Error('Invalid request. Please enter a valid city name.');
            } else {
                throw new Error('Failed to fetch weather data. Please try again later.');
            }
        }

        const data = await response.json();
        displayWeather(data);

    } catch (error) {
        showError(error.message);
    }
});

// Display weather data
function displayWeather(data) {
    // Location (handle both city names and coordinate-only locations)
    const locationName = data.location.name || `${data.location.latitude.toFixed(2)}°, ${data.location.longitude.toFixed(2)}°`;
    const locationCountry = data.location.country || '';

    const locationHTML = `
        <h2>${locationName}${locationCountry ? ', ' + locationCountry : ''}</h2>
        <p>Coordinates: ${data.location.latitude.toFixed(2)}°, ${data.location.longitude.toFixed(2)}°</p>
    `;
    document.getElementById('location').innerHTML = locationHTML;

    // Current weather
    const currentHTML = `
        <div class="current-weather">
            <div class="temp">${Math.round(data.current.temperature_2m)}°C</div>
            <div class="icon">${getWeatherIcon(data.current.weather_code)}</div>
        </div>
        <div class="description">${getWeatherDescription(data.current.weather_code)}</div>
    `;
    document.getElementById('current').innerHTML = currentHTML;

    // 3-day forecast
    const forecastHTML = data.daily.time.map((date, i) => `
        <div class="day">
            <div class="date">${formatDate(date)}</div>
            <div class="icon">${getWeatherIcon(data.daily.weather_code[i])}</div>
            <div class="temps">
                <span class="high">${Math.round(data.daily.temperature_2m_max[i])}°</span>
                <span class="low">${Math.round(data.daily.temperature_2m_min[i])}°</span>
            </div>
        </div>
    `).join('');
    document.getElementById('forecast').innerHTML = forecastHTML;

    // RSB-6: Center map on location and add marker
    const lat = data.location.latitude;
    const lon = data.location.longitude;

    // Remove previous marker if exists
    if (marker) {
        map.removeLayer(marker);
    }

    // Center map and add new marker
    map.setView([lat, lon], 10);
    marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(locationName + (locationCountry ? ', ' + locationCountry : ''))
        .openPopup();

    // Show map and results, hide error and loading
    document.getElementById('map').classList.remove('hidden');
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
    document.getElementById('loading').classList.add('hidden');
}

// Weather icon mapping (Open-Meteo weather codes)
function getWeatherIcon(code) {
    const icons = {
        0: '☀️',   // Clear sky
        1: '🌤️',  // Mainly clear
        2: '⛅',   // Partly cloudy
        3: '☁️',   // Overcast
        45: '🌫️', // Foggy
        48: '🌫️', // Depositing rime fog
        51: '🌦️', // Light drizzle
        53: '🌦️', // Moderate drizzle
        55: '🌧️', // Dense drizzle
        56: '🌧️', // Light freezing drizzle
        57: '🌧️', // Dense freezing drizzle
        61: '🌧️', // Slight rain
        63: '🌧️', // Moderate rain
        65: '🌧️', // Heavy rain
        66: '🌧️', // Light freezing rain
        67: '🌧️', // Heavy freezing rain
        71: '🌨️', // Slight snow fall
        73: '🌨️', // Moderate snow fall
        75: '🌨️', // Heavy snow fall
        77: '🌨️', // Snow grains
        80: '🌦️', // Slight rain showers
        81: '🌧️', // Moderate rain showers
        82: '🌧️', // Violent rain showers
        85: '🌨️', // Slight snow showers
        86: '🌨️', // Heavy snow showers
        95: '⛈️',  // Thunderstorm
        96: '⛈️',  // Thunderstorm with slight hail
        99: '⛈️'   // Thunderstorm with heavy hail
    };
    return icons[code] || '🌡️';
}

// Weather description mapping
function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Severe thunderstorm'
    };
    return descriptions[code] || 'Unknown';
}

// Format date string
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}

// Show loading state
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('results').classList.add('hidden');
    document.getElementById('error').classList.add('hidden');
}

// Show error message
function showError(message) {
    document.getElementById('error').textContent = message;
    document.getElementById('error').classList.remove('hidden');
    document.getElementById('results').classList.add('hidden');
    document.getElementById('loading').classList.add('hidden');
}
