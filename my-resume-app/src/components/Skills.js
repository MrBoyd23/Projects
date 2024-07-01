import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import '../css/Skills.css';

// Importing the components
import Coding from './Coding';
import Software from './Software';

const Skills = () => {
  return (
    <div className="skills-page">
      <div className="skills-list">
        <Link to="/coding" className="skill-bubble skill-bubble-large">Coding</Link>
        <Link to="/software" className="skill-bubble skill-bubble-large">Software</Link>
      </div>

      <div className="skills-container">
        <Routes>
          <Route path="/coding/*" element={<Coding />} />
          <Route path="/software/*" element={<Software />} />
        </Routes>
      </div>
    </div>
  );
};

export default Skills;

