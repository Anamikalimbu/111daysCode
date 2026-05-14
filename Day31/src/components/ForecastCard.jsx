import React from 'react';

const ForecastCard = ({ data }) => {
  const date = new Date(data.dt * 1000);
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  
  const temp = Math.round(data.main.temp);
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
  const condition = data.weather[0].main;

  return (
    <div className="forecast-card glass-panel">
      <h3 className="forecast-day">{dayName}</h3>
      <img src={iconUrl} alt={condition} className="forecast-icon" />
      <p className="forecast-temp">{temp}°C</p>
    </div>
  );
};

export default ForecastCard;
