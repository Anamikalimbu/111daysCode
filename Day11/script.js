const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');
const loader = document.getElementById('loader');

// Weather DOM Elements
const cityNameEl = document.getElementById('city-name');
const tempEl = document.getElementById('temperature');
const weatherIconEl = document.getElementById('weather-icon');
const weatherDescEl = document.getElementById('weather-desc');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');

// Using Open-Meteo API which is free and requires no API key
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

// WMO Weather interpretation codes (https://open-meteo.com/en/docs)
const weatherCodeMap = {
    0: { desc: 'Clear sky', icon: 'ph-sun' },
    1: { desc: 'Mainly clear', icon: 'ph-cloud-sun' },
    2: { desc: 'Partly cloudy', icon: 'ph-cloud-sun' },
    3: { desc: 'Overcast', icon: 'ph-cloud' },
    45: { desc: 'Fog', icon: 'ph-cloud-fog' },
    48: { desc: 'Depositing rime fog', icon: 'ph-cloud-fog' },
    51: { desc: 'Light drizzle', icon: 'ph-cloud-rain' },
    53: { desc: 'Moderate drizzle', icon: 'ph-cloud-rain' },
    55: { desc: 'Dense drizzle', icon: 'ph-cloud-rain' },
    56: { desc: 'Light freezing drizzle', icon: 'ph-cloud-snow' },
    57: { desc: 'Dense freezing drizzle', icon: 'ph-cloud-snow' },
    61: { desc: 'Slight rain', icon: 'ph-cloud-rain' },
    63: { desc: 'Moderate rain', icon: 'ph-cloud-rain' },
    65: { desc: 'Heavy rain', icon: 'ph-cloud-rain' },
    66: { desc: 'Light freezing rain', icon: 'ph-cloud-snow' },
    67: { desc: 'Heavy freezing rain', icon: 'ph-cloud-snow' },
    71: { desc: 'Slight snow fall', icon: 'ph-snowflake' },
    73: { desc: 'Moderate snow fall', icon: 'ph-snowflake' },
    75: { desc: 'Heavy snow fall', icon: 'ph-snowflake' },
    77: { desc: 'Snow grains', icon: 'ph-snowflake' },
    80: { desc: 'Slight rain showers', icon: 'ph-cloud-showers' },
    81: { desc: 'Moderate rain showers', icon: 'ph-cloud-showers' },
    82: { desc: 'Violent rain showers', icon: 'ph-cloud-lightning' },
    85: { desc: 'Slight snow showers', icon: 'ph-cloud-snow' },
    86: { desc: 'Heavy snow showers', icon: 'ph-cloud-snow' },
    95: { desc: 'Thunderstorm', icon: 'ph-cloud-lightning' },
    96: { desc: 'Thunderstorm with slight hail', icon: 'ph-cloud-lightning' },
    99: { desc: 'Thunderstorm with heavy hail', icon: 'ph-cloud-lightning' }
};

async function getWeatherData(city) {
    try {
        // Show loader, hide elements
        loader.classList.add('show');
        weatherInfo.style.opacity = '0';
        errorMessage.classList.remove('show');

        // 1. Get Coordinates for City
        const geoResponse = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found');
        }

        const location = geoData.results[0];
        const { latitude, longitude, name, country } = location;

        // 2. Get Weather for Coordinates
        const weatherResponse = await fetch(`${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`);
        const weatherData = await weatherResponse.json();

        const current = weatherData.current;
        
        // Update DOM
        cityNameEl.textContent = `${name}, ${country}`;
        tempEl.textContent = `${Math.round(current.temperature_2m)}°C`;
        humidityEl.textContent = `${current.relative_humidity_2m}%`;
        windSpeedEl.textContent = `${current.wind_speed_10m} km/h`;

        // Update Weather Icon and Description
        const weatherInfoCode = weatherCodeMap[current.weather_code] || { desc: 'Unknown', icon: 'ph-cloud' };
        weatherDescEl.textContent = weatherInfoCode.desc;
        
        // Replace existing icon class
        weatherIconEl.className = `ph ${weatherInfoCode.icon}`;

        // Hide loader, show info
        loader.classList.remove('show');
        weatherInfo.style.opacity = '1';

    } catch (error) {
        console.error('Error fetching weather:', error);
        loader.classList.remove('show');
        errorMessage.classList.add('show');
    }
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});

// Default city on load
getWeatherData('Dharan');
