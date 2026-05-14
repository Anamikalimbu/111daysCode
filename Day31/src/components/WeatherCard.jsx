import React from 'react';
import { Droplets, Wind, Gauge } from 'lucide-react';

const WeatherCard = ({ data }) => {
  if (!data) return null;

  const { name, main, weather, wind, sys } = data;
  const temp = Math.round(main.temp);
  const condition = weather[0].main;
  const description = weather[0].description;
  const iconCode = weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  return (
    <div className="weather-card glass-panel">
      <div className="weather-main">
        <div className="weather-info">
          <h2 className="city-name">{name}, {sys.country}</h2>
          <p className="weather-desc">{description}</p>
          <h1 className="temperature">
            {temp}<span>°C</span>
          </h1>
        </div>
        <div className="weather-icon-container">
          <img src={iconUrl} alt={condition} className="weather-icon-main" />
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <Droplets className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{main.humidity}%</span>
          </div>
        </div>
        <div className="detail-item">
          <Wind className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Wind Speed</span>
            <span className="detail-value">{wind.speed} m/s</span>
          </div>
        </div>
        <div className="detail-item">
          <Gauge className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Pressure</span>
            <span className="detail-value">{main.pressure} hPa</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
