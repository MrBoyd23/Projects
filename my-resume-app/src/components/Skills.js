import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import '../css/Skills.css';

// Import skill detail components
import PHP from './skills/php';
import CSS from './skills/css';
import API from './skills/api';
import SEO from './skills/seo';
import AWS from './skills/aws';
import HTML from './skills/html';
import Linux from './skills/linux';
import MySQL from './skills/mysql';
import Apache from './skills/apache';
import CPanel from './skills/cpanel';
import Plesk from './skills/plesk';
import Ansible from './skills/ansible';
import Python from './skills/python';
import NodeJS from './skills/node';
import ReactJS from './skills/react';
import JavaScript from './skills/javascript';
import Jira from './skills/jira';
import GitHub from './skills/github';
import Grafana from './skills/grafana';
import Prometheus from './skills/prometheus';
import ServiceNow from './skills/servicenow';
import LivePerson from './skills/liveperson';
import WordPress from './skills/wordpress';
import PhpMyAdmin from './skills/phpmyadmin';
import ECommerce from './skills/e-commerce';
import WebDesign from './skills/web_design';
import LinuxAdmin from './skills/linux_admin';
import NodePackageName from './skills/node_package_name';
import WebsiteAnalytics from './skills/website_analytics';
import OnlineMarketing from './skills/online_marketing';
import OnlineAdvertising from './skills/online_advertising';
import DataAnalytics from './skills/data_analytics';
import DigitalMarketing from './skills/digital_marketing';
import BashScripting from './skills/bash_scripting';

const Skills = () => {
  return (
    <div className="skills-page">
      <div className="skills-list">
        <Link to="/php" className="skill-bubble">PHP</Link>
        <Link to="/css" className="skill-bubble">CSS</Link>
        <Link to="/api" className="skill-bubble">API</Link>
        <Link to="/seo" className="skill-bubble">SEO</Link>
        <Link to="/aws" className="skill-bubble">AWS</Link>
        <Link to="/html" className="skill-bubble">HTML</Link>
        <Link to="/linux" className="skill-bubble">Linux</Link>
        <Link to="/mysql" className="skill-bubble">MySQL</Link>
        <Link to="/apache" className="skill-bubble">Apache</Link>
        <Link to="/cpanel" className="skill-bubble">cPanel</Link>
        <Link to="/plesk" className="skill-bubble">Plesk</Link>
        <Link to="/ansible" className="skill-bubble">Ansible</Link>
        <Link to="/python" className="skill-bubble">Python</Link>
        <Link to="/node" className="skill-bubble">Node.js</Link>
        <Link to="/react" className="skill-bubble">React</Link>
        <Link to="/javascript" className="skill-bubble">JavaScript</Link>
        <Link to="/jira" className="skill-bubble">Jira</Link>
        <Link to="/github" className="skill-bubble">GitHub</Link>
        <Link to="/grafana" className="skill-bubble">Grafana</Link>
        <Link to="/prometheus" className="skill-bubble">Prometheus</Link>
        <Link to="/servicenow" className="skill-bubble">ServiceNow</Link>
        <Link to="/liveperson" className="skill-bubble">LivePerson</Link>
        <Link to="/wordpress" className="skill-bubble">WordPress</Link>
        <Link to="/phpmyadmin" className="skill-bubble">phpMyAdmin</Link>
        <Link to="/e-commerce" className="skill-bubble">ECommerce</Link>
        <Link to="/web_design" className="skill-bubble">Web Design</Link>
        <Link to="/linux_admin" className="skill-bubble">Linux Admin</Link>
        <Link to="/node_package_name" className="skill-bubble">Node Package Name</Link>
        <Link to="/website_analytics" className="skill-bubble">Website Analytics</Link>
        <Link to="/online_marketing" className="skill-bubble">Online Marketing</Link>
        <Link to="/online_advertising" className="skill-bubble">Online Advertising</Link>
        <Link to="/data_analytics" className="skill-bubble">Data Analytics</Link>
        <Link to="/digital_marketing" className="skill-bubble">Digital Marketing</Link>
        <Link to="/bash_scripting" className="skill-bubble">Bash Scripting</Link>         
      </div>

      <div className="skills-container">
        <Routes>
          <Route path="/php" element={<PHP />} />
          <Route path="/skills/css" element={<CSS />} />
          <Route path="/skills/api" element={<API />} />
          <Route path="/skills/seo" element={<SEO />} />
          <Route path="/skills/aws" element={<AWS />} />
          <Route path="/skills/html" element={<HTML />} />
          <Route path="/skills/linux" element={<Linux />} />
          <Route path="/skills/mysql" element={<MySQL />} />
          <Route path="/skills/apache" element={<Apache />} />
          <Route path="/skills/cpanel" element={<CPanel />} />
          <Route path="/skills/plesk" element={<Plesk />} />
          <Route path="/skills/ansible" element={<Ansible />} />
          <Route path="/skills/python" element={<Python />} />
          <Route path="/skills/node" element={<NodeJS />} />
          <Route path="/skills/react" element={<ReactJS />} />
          <Route path="/skills/javascript" element={<JavaScript />} />
          <Route path="/skills/jira" element={<Jira />} />
          <Route path="/skills/github" element={<GitHub />} />
          <Route path="/skills/grafana" element={<Grafana />} />
          <Route path="/skills/prometheus" element={<Prometheus />} />
          <Route path="/skills/servicenow" element={<ServiceNow />} />
          <Route path="/skills/liveperson" element={<LivePerson />} />
          <Route path="/skills/wordpress" element={<WordPress />} />
          <Route path="/skills/phpmyadmin" element={<PhpMyAdmin />} />
          <Route path="/skills/e-commerce" element={<ECommerce />} />
          <Route path="/skills/web_design" element={<WebDesign />} />
          <Route path="/skills/linux_admin" element={<LinuxAdmin />} />
          <Route path="/skills/node_package_name" element={<NodePackageName />} />
          <Route path="/skills/website_analytics" element={<WebsiteAnalytics />} />
          <Route path="/skills/online_marketing" element={<OnlineMarketing />} />
          <Route path="/skills/online_advertising" element={<OnlineAdvertising />} />
          <Route path="/skills/data_analytics" element={<DataAnalytics />} />
          <Route path="/skills/digital_marketing" element={<DigitalMarketing />} />
          <Route path="/skills/bash_scripting" element={<BashScripting />} />
        </Routes>
      </div>
    </div>
  );
};

export default Skills;

