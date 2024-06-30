import React, { useEffect, useState } from 'react';

const cities = [
  { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'Tokyo', lat: 35.6895, lon: 139.6917 },
  { name: 'Washington DC', lat: 38.9072, lon: -77.0369 },
  { name: 'London', lat: 51.5074, lon: -0.1278 }
];

const WeatherDisplay = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          cities.map(city =>
            fetch(
              `https://weatherbit-v1-mashape.p.rapidapi.com/forecast/3hourly?lat=${city.lat}&lon=${city.lon}&units=imperial&lang=en`,
              {
                headers: {
                  'x-rapidapi-key': '32208c04f7msh695c92348977295p1c1a2djsn7bfb24a07b1c',
                  'x-rapidapi-host': 'weatherbit-v1-mashape.p.rapidapi.com'
                }
              }
            ).then(response => response.json().then(data => ({ city: city.name, data })))
          )
        );

        const newErrorMessages = {};
        const newWeatherData = responses.map(response => {
          if (response.data.message) {
            newErrorMessages[response.city] = response.data.message;
            return null;
          } else {
            return response;
          }
        }).filter(response => response !== null);

        setWeatherData(newWeatherData);
        setErrorMessages(newErrorMessages);
      } catch (error) {
        console.error('Fetch error:', error);
        setErrorMessages(cities.reduce((acc, city) => {
          acc[city.name] = 'An error occurred while fetching weather data.';
          return acc;
        }, {}));
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {cities.map(city => (
        <div key={city.name}>
          <h2>{city.name}</h2>
          {errorMessages[city.name] ? (
            <div style={{ color: 'red' }}>
              <p>{errorMessages[city.name]}</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Description</th>
                  <th>Temperature (&deg;F)</th>
                  <th>Wind Speed (mph)</th>
                  <th>Humidity (%)</th>
                  <th>Pressure (mb)</th>
                </tr>
              </thead>
              <tbody>
                {weatherData.find(data => data.city === city.name)?.data.data.map((item, index) => {
                  const date = new Date(item.timestamp_local);
                  return (
                    <tr key={index}>
                      <td>
                        {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td>{item.weather.description}</td>
                      <td>{item.temp}</td>
                      <td>{item.wind_spd}</td>
                      <td>{item.rh}</td>
                      <td>{item.pres}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
};

export default WeatherDisplay;

