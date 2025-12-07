// Weather code to emoji + description mapping
const WEATHER_CODES = {
    0: { emoji: '☀️', description: 'Clear sky' },
    1: { emoji: '🌤️', description: 'Mainly clear' },
    2: { emoji: '⛅', description: 'Partly cloudy' },
    3: { emoji: '☁️', description: 'Overcast' },
    45: { emoji: '🌫️', description: 'Foggy' },
    48: { emoji: '🌫️', description: 'Rime fog' },
    51: { emoji: '🌦️', description: 'Light drizzle' },
    53: { emoji: '🌦️', description: 'Moderate drizzle' },
    55: { emoji: '🌧️', description: 'Dense drizzle' },
    61: { emoji: '🌧️', description: 'Slight rain' },
    63: { emoji: '🌧️', description: 'Moderate rain' },
    65: { emoji: '🌧️', description: 'Heavy rain' },
    71: { emoji: '🌨️', description: 'Slight snow' },
    73: { emoji: '🌨️', description: 'Moderate snow' },
    75: { emoji: '❄️', description: 'Heavy snow' },
    77: { emoji: '❄️', description: 'Snow grains' },
    80: { emoji: '🌦️', description: 'Slight rain showers' },
    81: { emoji: '🌧️', description: 'Moderate rain showers' },
    82: { emoji: '⛈️', description: 'Violent rain showers' },
    85: { emoji: '🌨️', description: 'Slight snow showers' },
    86: { emoji: '❄️', description: 'Heavy snow showers' },
    95: { emoji: '⛈️', description: 'Thunderstorm' },
    96: { emoji: '⛈️', description: 'Thunderstorm with hail' },
    99: { emoji: '⛈️', description: 'Thunderstorm with heavy hail' }
};

// Global map and marker references
let map = null;
let marker = null;

// Get weather code info
function getWeatherInfo(code) {
    return WEATHER_CODES[code] || { emoji: '❓', description: 'Unknown' };
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format time
function formatTime(timeString) {
    const date = new Date(timeString);
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleTimeString('en-US', options);
}

// Show loading state
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
    document.getElementById('weather-display').classList.add('hidden');
    document.querySelector('button[type="submit"]').disabled = true;
}

// Hide loading state
function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
    document.querySelector('button[type="submit"]').disabled = false;
}

// Show error message
function showError(message) {
    const errorEl = document.getElementById('error');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    document.getElementById('weather-display').classList.add('hidden');
}

// Initialize Leaflet map
function initializeMap(lat, lon, locationName, country) {
    // Create map centered on coordinates
    map = L.map('map').setView([lat, lon], 10);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
    }).addTo(map);

    // Add marker
    marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(`<b>${locationName}</b><br>${country}`).openPopup();

    console.log('Map initialized:', locationName);
}

// Update existing map with new location
function updateMap(lat, lon, locationName, country) {
    if (!map) {
        // First time - initialize map
        initializeMap(lat, lon, locationName, country);
    } else {
        // Update existing map
        map.setView([lat, lon], 10, {
            animate: true,
            duration: 1 // 1 second smooth pan
        });

        // Update marker position and popup
        marker.setLatLng([lat, lon]);
        marker.bindPopup(`<b>${locationName}</b><br>${country}`).openPopup();

        console.log('Map updated:', locationName);
    }
}

// Display weather data
function displayWeather(data) {
    const { location, forecast } = data;

    // Update location info
    document.getElementById('location-name').textContent =
        `${location.name}, ${location.country}`;
    document.getElementById('location-coords').textContent =
        `${location.latitude.toFixed(4)}°N, ${Math.abs(location.longitude).toFixed(4)}°${location.longitude >= 0 ? 'E' : 'W'}`;

    // Update current weather
    const currentWeather = getWeatherInfo(forecast.current.weather_code);
    document.getElementById('current-icon').textContent = currentWeather.emoji;
    document.getElementById('current-temp').textContent =
        `${forecast.current.temperature_2m.toFixed(1)}°C`;
    document.getElementById('current-description').textContent =
        currentWeather.description;
    document.getElementById('current-time').textContent =
        `Updated: ${formatTime(forecast.current.time)}`;

    // Update 3-day forecast
    const forecastGrid = document.getElementById('forecast-grid');
    forecastGrid.innerHTML = '';

    for (let i = 0; i < forecast.daily.time.length; i++) {
        const weather = getWeatherInfo(forecast.daily.weather_code[i]);
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-date">${formatDate(forecast.daily.time[i])}</div>
            <div class="forecast-icon">${weather.emoji}</div>
            <div class="forecast-temps">
                <span class="temp-high">↑${forecast.daily.temperature_2m_max[i].toFixed(1)}°C</span>
                <span class="temp-low">↓${forecast.daily.temperature_2m_min[i].toFixed(1)}°C</span>
            </div>
            <div class="forecast-description">${weather.description}</div>
        `;
        forecastGrid.appendChild(card);
    }

    // Update map with city location (Sprint 5 integration)
    updateMap(
        location.latitude,
        location.longitude,
        location.name,
        location.country
    );

    // Show weather display
    document.getElementById('weather-display').classList.remove('hidden');

    // Store coordinates for future reference
    window.currentLocation = {
        lat: location.latitude,
        lon: location.longitude,
        name: location.name,
        country: location.country
    };
}

// Fetch weather data
async function fetchWeather(cityName) {
    showLoading();

    try {
        const response = await fetch(`/api/weather/city?name=${encodeURIComponent(cityName)}`);

        if (!response.ok) {
            // Handle HTTP errors
            if (response.status === 404) {
                const errorData = await response.json();
                throw new Error(`City not found. Try being more specific (e.g., "Paris, France")`);
            } else if (response.status === 400) {
                throw new Error('Please enter a valid city name');
            } else {
                throw new Error('Weather service temporarily unavailable. Please try again.');
            }
        }

        const data = await response.json();
        displayWeather(data);

    } catch (error) {
        console.error('Error fetching weather:', error);

        // User-friendly error messages
        if (error.message.includes('Failed to fetch')) {
            showError('Unable to connect. Please check your internet connection.');
        } else {
            showError(error.message);
        }
    } finally {
        hideLoading();
    }
}

// Form submission handler
document.getElementById('weather-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const cityInput = document.getElementById('city-input');
    const cityName = cityInput.value.trim();

    if (cityName) {
        fetchWeather(cityName);
    }
});

// Optional: Load default city on page load
// window.addEventListener('load', () => {
//     fetchWeather('Tokyo');
// });
