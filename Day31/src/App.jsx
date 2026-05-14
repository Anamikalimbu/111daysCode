import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastSection from './components/ForecastSection';
import { 
  getWeatherByCity, 
  getWeatherByCoords, 
  getForecastByCity, 
  getForecastByCoords 
} from './services/weatherApi';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial load
  useEffect(() => {
    const lastCity = localStorage.getItem('lastSearchedCity');
    if (lastCity) {
      handleSearch(lastCity);
    } else {
      handleLocation();
    }
  }, []);

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const [current, forecast] = await Promise.all([
        getWeatherByCity(city),
        getForecastByCity(city)
      ]);
      setWeatherData(current);
      setForecastData(forecast);
      localStorage.setItem('lastSearchedCity', city);
    } catch (err) {
      setError(err.message || 'City not found');
      setWeatherData(null);
      setForecastData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const [current, forecast] = await Promise.all([
            getWeatherByCoords(latitude, longitude),
            getForecastByCoords(latitude, longitude)
          ]);
          setWeatherData(current);
          setForecastData(forecast);
          localStorage.setItem('lastSearchedCity', current.name);
        } catch (err) {
          setError('Failed to fetch weather for your location');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        // Fallback to a default city if location access is denied
        handleSearch('London');
      }
    );
  };

  // Determine background class based on weather condition
  const getBackgroundClass = () => {
    if (!weatherData) return 'bg-default';
    const condition = weatherData.weather[0].main.toLowerCase();
    
    if (condition.includes('clear')) return 'bg-clear';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'bg-rain';
    if (condition.includes('cloud')) return 'bg-clouds';
    if (condition.includes('snow')) return 'bg-snow';
    if (condition.includes('thunderstorm')) return 'bg-thunderstorm';
    
    return 'bg-default';
  };

  return (
    <div className={`app-container ${getBackgroundClass()}`}>
      <div className="overlay"></div>
      <div className="main-content">
        <header className="app-header">
          <h1>Weather Dashboard</h1>
        </header>

        <SearchBar onSearch={handleSearch} onLocation={handleLocation} />

        {loading && (
          <div className="shimmer-container">
            <div className="shimmer-card"></div>
            <div className="shimmer-row"></div>
          </div>
        )}

        {error && (
          <div className="error-message glass-panel">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && weatherData && (
          <>
            <WeatherCard data={weatherData} />
            <ForecastSection forecastData={forecastData} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
