import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = 'ee884861b499b7180e8c2033140c66b9';

const cities = [
  { name: 'Phoenix', state: 'AZ' },
  { name: 'Los Angeles', state: 'CA' },
  { name: 'Houston', state: 'TX' },
  { name: 'Chicago', state: 'IL' },
  { name: 'New York', state: 'NY' }
];

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const promises = cities.map(city =>
          axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city.name},${city.state},US&units=imperial&appid=${API_KEY}`)
        );
        const responses = await Promise.all(promises);
        let data = responses.map(response => response.data);

        // Sort by longitude from west to east
        data.sort((a, b) => a.coord.lon - b.coord.lon);

        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, []);

  const formatTime = (timezone) => {
    const localTime = new Date(new Date().getTime() + timezone * 1000);
    return localTime.toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ backgroundColor: 'black', color: 'white', padding: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px', maxWidth: '1200px' }}>	  
        {weatherData.map((city, index) => (
          <div key={index} style={{
            backgroundColor: '#333',
            padding: '10px',
            borderRadius: '8px',
            flex: '1 1 calc(20% - 10px)',
            boxSizing: 'border-box',
            minWidth: '180px'
          }}>
            <h2 style={{ margin: '0', whiteSpace: 'nowrap' }}>{city.name}</h2>
            <p style={{ margin: '0' }}>{formatTime(city.timezone)}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0' }}>
              <span>High:</span>
              <span>{city.main.temp_max}°F</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0' }}>
              <span>Low:</span>
              <span>{city.main.temp_min}°F</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherComponent;

