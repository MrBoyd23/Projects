import React from 'react';
import WeatherComponent from './api2.js';
import TheMovieDB from './api3.js';

const MainComponent = () => {
  return (
    <div>
      <WeatherComponent />	  
      <TheMovieDB />	  
    </div>
  );
};

export default MainComponent;
