import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import '../css/Skills.css';

// Import skill detail components
import PHP from './skills/php';
import CSS from './skills/css';
import API from './skills/api';
import AWS from './skills/aws';
import HTML from './skills/html';
import Linux from './skills/linux';
import MySQL from './skills/mysql';
import Ansible from './skills/ansible';
import Python from './skills/python';
import NodeJS from './skills/node';
import ReactJS from './skills/react';
import JavaScript from './skills/javascript';
import WebDesign from './skills/web_design';
import PhpMyAdmin from './skills/phpmyadmin';
import NodePackageName from './skills/node_package_name';
import BashScripting from './skills/bash_scripting';

const Coding = () => {
  return (
    <div className="skills-page">
      <div className="skills-list">
        <Link to="/php" className="skill-bubble">PHP</Link>
        <Link to="/css" className="skill-bubble">CSS</Link>
        <Link to="/api" className="skill-bubble">API</Link>
        <Link to="/aws" className="skill-bubble">AWS</Link>
        <Link to="/html" className="skill-bubble">HTML</Link>
        <Link to="/linux" className="skill-bubble">Linux</Link>
        <Link to="/mysql" className="skill-bubble">MySQL</Link>
        <Link to="/ansible" className="skill-bubble">Ansible</Link>
        <Link to="/python" className="skill-bubble">Python</Link>
        <Link to="/node" className="skill-bubble">Node.js</Link>
        <Link to="/react" className="skill-bubble">React</Link>
        <Link to="/javascript" className="skill-bubble">JavaScript</Link>
        <Link to="/web_design" className="skill-bubble">Web Design</Link>
        <Link to="/phpmyadmin" className="skill-bubble">phpMyAdmin</Link>
        <Link to="/node_package_name" className="skill-bubble">Node Package Name</Link>
        <Link to="/bash_scripting" className="skill-bubble">Bash Scripting</Link>
      </div>

      <div className="skills-container">
        <Routes>
          <Route path="/php" element={<PHP />} />
          <Route path="/css" element={<CSS />} />
          <Route path="/api" element={<API />} />
          <Route path="/aws" element={<AWS />} />
          <Route path="/html" element={<HTML />} />
          <Route path="/linux" element={<Linux />} />
          <Route path="/mysql" element={<MySQL />} />
          <Route path="/ansible" element={<Ansible />} />
          <Route path="/python" element={<Python />} />
          <Route path="/node" element={<NodeJS />} />
          <Route path="/react" element={<ReactJS />} />
          <Route path="/javascript" element={<JavaScript />} />
          <Route path="/web_design" element={<WebDesign />} />
          <Route path="/phpmyadmin" element={<PhpMyAdmin />} />
          <Route path="/node_package_name" element={<NodePackageName />} />
          <Route path="/bash_scripting" element={<><Coding /><BashScripting /></>} />
        </Routes>
      </div>
    </div>
  );
};

export default Coding;

