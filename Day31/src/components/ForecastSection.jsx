import React from 'react';
import ForecastCard from './ForecastCard';

const ForecastSection = ({ forecastData }) => {
  if (!forecastData || forecastData.length === 0) return null;

  return (
    <div className="forecast-container">
      <h3 className="section-title">5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecastData.map((data, index) => (
          <ForecastCard key={index} data={data} />
        ))}
      </div>
    </div>
  );
};

export default ForecastSection;
