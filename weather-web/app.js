const API_BASE = 'http://localhost:8080';

// Map instance
let map = null;
let marker = null;

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        // Update tab buttons
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update search forms
        document.querySelectorAll('.search-form').forEach(f => f.classList.remove('active'));
        document.getElementById(`${tabName}-search`).classList.add('active');
    });
});

// Search by city
async function searchByCity() {
    const cityInput = document.getElementById('city-input');
    const cityName = cityInput.value.trim();
    
    if (!cityName) {
        showError('Please enter a city name');
        return;
    }
    
    hideError();
    showLoading();
    hideWeather();
    
    try {
        const response = await fetch(`${API_BASE}/weather/city?city=${encodeURIComponent(cityName)}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError(`Failed to get weather: ${error.message}`);
        hideLoading();
    }
}

// Search by coordinates
async function searchByCoordinates() {
    const latInput = document.getElementById('lat-input');
    const lonInput = document.getElementById('lon-input');
    const lat = parseFloat(latInput.value);
    const lon = parseFloat(lonInput.value);
    
    if (isNaN(lat) || isNaN(lon)) {
        showError('Please enter valid latitude and longitude');
        return;
    }
    
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        showError('Latitude must be between -90 and 90, longitude between -180 and 180');
        return;
    }
    
    hideError();
    showLoading();
    hideWeather();
    
    try {
        const response = await fetch(`${API_BASE}/weather/coord?lat=${lat}&lon=${lon}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError(`Failed to get weather: ${error.message}`);
        hideLoading();
    }
}

// Initialize or update map with coordinates
function updateMap(lat, lon) {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;
    
    // Initialize map if not exists
    if (!map) {
        map = L.map('map-container').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
    } else {
        map.setView([lat, lon], 10);
    }
    
    // Remove existing marker if any
    if (marker) {
        map.removeLayer(marker);
    }
    
    // Add marker at location
    marker = L.marker([lat, lon]).addTo(map);
    
    // Invalidate size to ensure map renders correctly after container becomes visible
    setTimeout(() => {
        if (map) {
            map.invalidateSize();
        }
    }, 100);
}

// Display weather data
function displayWeather(data) {
    hideLoading();
    
    // Location info
    let lat, lon;
    if (data.location) {
        document.getElementById('location-name').textContent = data.location.name;
        const details = [];
        if (data.location.admin1) details.push(data.location.admin1);
        if (data.location.country) details.push(data.location.country);
        document.getElementById('location-details').textContent = details.join(', ') || 
            `Lat: ${data.location.latitude.toFixed(2)}, Lon: ${data.location.longitude.toFixed(2)}`;
        lat = data.location.latitude;
        lon = data.location.longitude;
    } else if (data.forecast) {
        // Coordinate search returns only forecast with coordinates
        document.getElementById('location-name').textContent = 'Location';
        lat = data.forecast.latitude;
        lon = data.forecast.longitude;
        document.getElementById('location-details').textContent = 
            `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
    } else {
        document.getElementById('location-name').textContent = 'Location';
        document.getElementById('location-details').textContent = '';
    }
    
    // Current weather
    if (data.forecast && data.forecast.current) {
        const current = data.forecast.current;
        document.getElementById('current-temp').textContent = Math.round(current.temperature_2m);
        document.getElementById('current-conditions').textContent = getWeatherDescription(current.weather_code);
    }
    
    // Forecast
    if (data.forecast && data.forecast.daily) {
        const daily = data.forecast.daily;
        const forecastDays = document.getElementById('forecast-days');
        forecastDays.innerHTML = '';
        
        // Show first 3 days
        for (let i = 0; i < Math.min(3, daily.time.length); i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'forecast-day';
            
            const date = new Date(daily.time[i]);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const maxTemp = Math.round(daily.temperature_2m_max[i]);
            const minTemp = Math.round(daily.temperature_2m_min[i]);
            const weatherCode = daily.weather_code[i];
            
            dayDiv.innerHTML = `
                <h4>${dayName}</h4>
                <div>${dateStr}</div>
                <div class="temp">${maxTemp}°C</div>
                <div class="temp-range">Min: ${minTemp}°C</div>
                <div style="margin-top: 10px; color: #666; font-size: 14px;">${getWeatherDescription(weatherCode)}</div>
            `;
            
            forecastDays.appendChild(dayDiv);
        }
    }
    
    // Show weather display first (makes container visible)
    showWeather();
    
    // Update map with coordinates if available (after container is visible)
    if (lat && lon) {
        // Use setTimeout to ensure container is fully visible before initializing map
        setTimeout(() => {
            updateMap(lat, lon);
        }, 50);
    }
}

// Weather code descriptions (simplified)
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
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    return descriptions[code] || `Weather code ${code}`;
}

// UI helper functions
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    document.getElementById('error-message').classList.add('hidden');
}

function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

function showWeather() {
    document.getElementById('weather-display').classList.remove('hidden');
}

function hideWeather() {
    document.getElementById('weather-display').classList.add('hidden');
}

// Allow Enter key to trigger search
document.getElementById('city-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchByCity();
});

document.getElementById('lat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchByCoordinates();
});

document.getElementById('lon-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchByCoordinates();
});
