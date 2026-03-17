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
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
    return (
      <div style={{
        background: '#1a0000',
        border: '1px solid #3d0000',
        borderLeft: '3px solid #8b0000',
        borderRadius: '8px',
        padding: '14px 18px',
        color: '#ff4444',
        fontSize: '0.9rem',
        maxWidth: '400px',
      }}>
        {error}
      </div>
    );
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
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
        gap: '14px',
        padding: '10px',
        maxWidth: '1200px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {weatherData.map((city, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              background: '#0d0d0d',
              border: '1px solid #1e1e1e',
              borderTop: '3px solid #8b0000',
              borderLeft: hoveredIndex === index ? '3px solid #40e0d0' : '1px solid #1e1e1e',
              borderRadius: '10px',
              padding: '20px',
              boxSizing: 'border-box',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>
              {iconEmoji(city.icon)}
            </div>
            <h2 style={{
              margin: '0 0 4px',
              fontSize: '1.15rem',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              color: '#ffffff',
              whiteSpace: 'nowrap',
            }}>
              {city.display}
            </h2>
            <p style={{
              margin: '0 0 12px',
              fontSize: '0.65rem',
              color: '#888',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              {city.state} · {city.conditions}
            </p>
            <div style={{
              textAlign: 'center',
              fontSize: '1.6rem',
              fontWeight: '700',
              color: '#40e0d0',
              marginBottom: '6px',
            }}>
              {city.temp}°F
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
            }}>
              <span style={{ color: '#ff6666' }}>↑ {city.tempmax}°F</span>
              <span style={{ color: '#66aaff' }}>↓ {city.tempmin}°F</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherComponent;
