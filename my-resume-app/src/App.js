// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar'; /* Import Sidebar */
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import Certifications from './components/Certifications';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <div className="container">
                    <Routes>
                        <Route exact path="/" element={<Experience />} />
                        <Route path="/Experience" element={<Skills />} />
                        <Route path="/Education" element={<><Education /><Certifications /></>} />
                    </Routes>
                    <Sidebar /> {/* Add Sidebar */}
                </div>
            </div>
        </Router>
    );
}

export default App;

