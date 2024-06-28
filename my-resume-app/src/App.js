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

// Import skill detail components from ./components/skills/
import PHP from './components/skills/php';
import CSS from './components/skills/css';
import API from './components/skills/api';
import SEO from './components/skills/seo';
import AWS from './components/skills/aws';
import HTML from './components/skills/html';
import Linux from './components/skills/linux';
import MySQL from './components/skills/mysql';
import Apache from './components/skills/apache';
import CPanel from './components/skills/cpanel';
import Plesk from './components/skills/plesk';
import Ansible from './components/skills/ansible';
import Python from './components/skills/python';
import NodeJS from './components/skills/node';
import ReactJS from './components/skills/react';
import JavaScript from './components/skills/javascript';
import Jira from './components/skills/jira';
import GitHub from './components/skills/github';
import Grafana from './components/skills/grafana';
import Prometheus from './components/skills/prometheus';
import ServiceNow from './components/skills/servicenow';
import LivePerson from './components/skills/liveperson';
import WordPress from './components/skills/wordpress';
import PhpMyAdmin from './components/skills/phpmyadmin';
import ECommerce from './components/skills/e-commerce';
import WebDesign from './components/skills/web_design';
import LinuxAdmin from './components/skills/linux_admin';
import NodePackageName from './components/skills/node_package_name';
import WebsiteAnalytics from './components/skills/website_analytics';
import OnlineMarketing from './components/skills/online_marketing';
import OnlineAdvertising from './components/skills/online_advertising';
import DataAnalytics from './components/skills/data_analytics';
import DigitalMarketing from './components/skills/digital_marketing';
import BashScripting from './components/skills/bash_scripting';


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
                        <Route path="/php" element={<><Skills /><PHP /></>} />
                        <Route path="/css" element={<><Skills /><CSS /></>} />
                        <Route path="/api" element={<><Skills /><API /></>} />
                        <Route path="/seo" element={<><Skills /><SEO /></>} />
                        <Route path="/aws" element={<><Skills /><AWS /></>} />
                        <Route path="/html" element={<><Skills /><HTML /></>} />
                        <Route path="/linux" element={<><Skills /><Linux /></>} />
                        <Route path="/mysql" element={<><Skills /><MySQL /></>} />
                        <Route path="/apache" element={<><Skills /><Apache /></>} />
                        <Route path="/cpanel" element={<><Skills /><CPanel /></>} />
                        <Route path="/plesk" element={<><Skills /><Plesk /></>} />
                        <Route path="/ansible" element={<><Skills /><Ansible /></>} />
                        <Route path="/python" element={<><Skills /><Python /></>} />
                        <Route path="/node" element={<><Skills /><NodeJS /></>} />
                        <Route path="/react" element={<><Skills /><ReactJS /></>} />
                        <Route path="/javascript" element={<><Skills /><JavaScript /></>} />
                        <Route path="/jira" element={<><Skills /><Jira /></>} />
                        <Route path="/github" element={<><Skills /><GitHub /></>} />
                        <Route path="/grafana" element={<><Skills /><Grafana /></>} />
                        <Route path="/prometheus" element={<><Skills /><Prometheus /></>} />
                        <Route path="/servicenow" element={<><Skills /><ServiceNow /></>} />
                        <Route path="/liveperson" element={<><Skills /><LivePerson /></>} />
                        <Route path="/wordpress" element={<><Skills /><WordPress /></>} />
                        <Route path="/phpmyadmin" element={<><Skills /><PhpMyAdmin /></>} />
                        <Route path="/e-commerce" element={<><Skills /><ECommerce /></>} />
                        <Route path="/web_design" element={<><Skills /><WebDesign /></>} />
                        <Route path="/linux_admin" element={<><Skills /><LinuxAdmin /></>} />
                        <Route path="/node_package_name" element={<><Skills /><NodePackageName /></>} />
                        <Route path="/website_analytics" element={<><Skills /><WebsiteAnalytics /></>} />
                        <Route path="/online_marketing" element={<><Skills /><OnlineMarketing /></>} />
                        <Route path="/online_advertising" element={<><Skills /><OnlineAdvertising /></>} />
                        <Route path="/data_analytics" element={<><Skills /><DataAnalytics /></>} />
                        <Route path="/digital_marketing" element={<><Skills /><DigitalMarketing /></>} />
                        <Route path="/bash_scripting" element={<><Skills /><BashScripting /></>} />	    	    
	            </Routes>
                    <Sidebar /> {/* Add Sidebar */}
                </div>
            </div>
        </Router>
    );
}

export default App;

