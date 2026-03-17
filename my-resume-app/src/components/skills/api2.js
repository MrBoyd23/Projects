import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Visual Crossing Weather API — https://www.visualcrossing.com/account/
// Key stored in REACT_APP_WEATHER_API_KEY (.env)
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const cities = [
  { name: 'Phoenix,AZ',     display: 'Phoenix',      state: 'AZ' },
  { name: 'Los Angeles,CA', display: 'Los Angeles',  state: 'CA' },
  { name: 'Houston,TX',     display: 'Houston',      state: 'TX' },
  { name: 'Chicago,IL',     display: 'Chicago',      state: 'IL' },
  { name: 'New York,NY',    display: 'New York',     state: 'NY' },
];

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const promises = cities.map(city =>
          // Visual Crossing: unitGroup=us for Fahrenheit
          axios.get(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city.name)}/today?unitGroup=us&include=days&key=${API_KEY}&contentType=json`
          )
        );
        const responses = await Promise.all(promises);
        const data = responses.map((res, i) => ({
          display:    cities[i].display,
          state:      cities[i].state,
          timezone:   res.data.timezone,
          tempmax:    res.data.days[0]?.tempmax,
          tempmin:    res.data.days[0]?.tempmin,
          temp:       res.data.days[0]?.temp,
          conditions: res.data.days[0]?.conditions,
          icon:       res.data.days[0]?.icon,
        }));

        // Sort west to east (approximate by state order — already ordered above)
        setWeatherData(data);
      } catch (err) {
        console.error('Error fetching Visual Crossing weather data:', err);
        setError('Weather data unavailable.');
      }
    };

    fetchWeatherData();
  }, []);

  const iconEmoji = (icon) => {
    const map = {
      'clear-day': '☀️', 'clear-night': '🌙', 'cloudy': '☁️',
      'partly-cloudy-day': '⛅', 'partly-cloudy-night': '🌥️',
      'rain': '🌧️', 'snow': '❄️', 'wind': '💨',
      'fog': '🌫️', 'thunder-rain': '⛈️', 'thunder-showers-day': '⛈️',
    };
    return map[icon] || '🌡️';
  };

  if (error) {
    return <p style={{ color: '#cc3333', padding: '10px' }}>{error}</p>;
  }

  return (
    <div style={{
      backgroundColor: '#000',
      color: '#fff',
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '10px',
        maxWidth: '1200px',
        width: '100%',
      }}>
        {weatherData.map((city, index) => (
          <div key={index} style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #2d0000',
            borderTop: '3px solid #8b0000',
            padding: '12px',
            borderRadius: '8px',
            flex: '1 1 calc(20% - 10px)',
            boxSizing: 'border-box',
            minWidth: '160px',
          }}>
            <h2 style={{ margin: '0 0 2px', fontSize: '1rem', whiteSpace: 'nowrap' }}>
              {iconEmoji(city.icon)} {city.display}
            </h2>
            <p style={{ margin: '0 0 6px', fontSize: '0.72rem', color: '#888' }}>
              {city.state} · {city.conditions}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#ff6666' }}>↑ {city.tempmax}°F</span>
              <span style={{ color: '#66aaff' }}>↓ {city.tempmin}°F</span>
            </div>
            <div style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: '600', marginTop: '4px', color: '#40e0d0' }}>
              {city.temp}°F
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherComponent;
