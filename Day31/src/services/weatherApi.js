const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.warn("API Key is missing. Please add VITE_OPENWEATHER_API_KEY to your .env file.");
}

/**
 * Fetch current weather by city name
 */
export const getWeatherByCity = async (city) => {
  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
  );
  if (!response.ok) {
    throw new Error('City not found');
  }
  return response.json();
};

/**
 * Fetch current weather by coordinates
 */
export const getWeatherByCoords = async (lat, lon) => {
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  if (!response.ok) {
    throw new Error('Unable to fetch weather data for your location');
  }
  return response.json();
};

/**
 * Fetch 5-day forecast by city name
 */
export const getForecastByCity = async (city) => {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
  );
  if (!response.ok) {
    throw new Error('Unable to fetch forecast data');
  }
  const data = await response.json();
  return processForecastData(data);
};

/**
 * Fetch 5-day forecast by coordinates
 */
export const getForecastByCoords = async (lat, lon) => {
  const response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  if (!response.ok) {
    throw new Error('Unable to fetch forecast data');
  }
  const data = await response.json();
  return processForecastData(data);
};

/**
 * Helper function to extract one reading per day (closest to 12:00 PM)
 * The OpenWeatherMap free forecast API returns data every 3 hours.
 */
const processForecastData = (data) => {
  const dailyData = [];
  const addedDays = new Set();

  data.list.forEach((reading) => {
    // reading.dt_txt format: "YYYY-MM-DD HH:mm:ss"
    const date = reading.dt_txt.split(' ')[0];
    const time = reading.dt_txt.split(' ')[1];

    // Try to get the reading closest to midday, or if it's a new day, just take the first one we see
    if (!addedDays.has(date)) {
      // If we find a reading at 12:00:00, use it and mark the day as added.
      // If we don't, we will fall back to using whichever comes around that time.
      // A simple approach is taking the first reading for the day that is >= 12:00:00
      if (time >= '12:00:00' || data.list.indexOf(reading) === data.list.length - 1) {
        dailyData.push(reading);
        addedDays.add(date);
      }
    }
  });

  // Ensure we only return 5 days max
  return dailyData.slice(0, 5);
};
