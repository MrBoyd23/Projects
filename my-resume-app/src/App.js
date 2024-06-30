// src/App.js
import React from 'react';
import './css/styles.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Skills from './components/Skills';
import Coding from './components/Coding'; // Adjust the path based on your project structure
import Applications from './components/Applications'; // Adjust the path based on your project structure
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
	      		<Route path="/Experience/*" element={<Skills />} />
			<Route path="/Education/*" element={<><Education /><Certifications /></>} />
			<Route path="/coding/*" element={<Coding />} />
			<Route path="/applications/*" element={<Applications />} />
			<Route path="/php/*" element={<><Coding /><PHP /></>} />
			<Route path="/css/*" element={<><Coding /><CSS /></>} />
			<Route path="/api/*" element={<><Coding /><API /></>} />
			<Route path="/seo/*" element={<><Applications /><SEO /></>} />
			<Route path="/aws/*" element={<><Coding /><AWS /></>} />
			<Route path="/html/*" element={<><Coding /><HTML /></>} />
			<Route path="/linux/*" element={<><Coding /><Linux /></>} />
			<Route path="/mysql/*" element={<><Coding /><MySQL /></>} />
			<Route path="/apache/*" element={<><Applications /><Apache /></>} />
			<Route path="/cpanel/*" element={<><Applications /><CPanel /></>} />
			<Route path="/plesk/*" element={<><Applications /><Plesk /></>} />
			<Route path="/ansible/*" element={<><Coding /><Ansible /></>} />
			<Route path="/python/*" element={<><Coding /><Python /></>} />
			<Route path="/node/*" element={<><Coding /><NodeJS /></>} />
			<Route path="/react/*" element={<><Coding /><ReactJS /></>} />
			<Route path="/javascript/*" element={<><Coding /><JavaScript /></>} />
			<Route path="/jira/*" element={<><Applications /><Jira /></>} />
			<Route path="/github/*" element={<><Applications /><GitHub /></>} />
			<Route path="/grafana/*" element={<><Applications /><Grafana /></>} />
			<Route path="/prometheus/*" element={<><Applications /><Prometheus /></>} />
			<Route path="/servicenow/*" element={<><Applications /><ServiceNow /></>} />
			<Route path="/liveperson/*" element={<><Applications /><LivePerson /></>} />
			<Route path="/wordpress/*" element={<><Applications /><WordPress /></>} />
			<Route path="/phpmyadmin/*" element={<><Coding /><PhpMyAdmin /></>} />
			<Route path="/e-commerce/*" element={<><Applications /><ECommerce /></>} />
			<Route path="/web_design/*" element={<><Coding /><WebDesign /></>} />
			<Route path="/linux_admin/*" element={<><Applications /><LinuxAdmin /></>} />
			<Route path="/node_package_name/*" element={<><Coding /><NodePackageName /></>} />
			<Route path="/website_analytics/*" element={<><Applications /><WebsiteAnalytics /></>} />
			<Route path="/online_marketing/*" element={<><Applications /><OnlineMarketing /></>} />
			<Route path="/online_advertising/*" element={<><Applications /><OnlineAdvertising /></>} />
			<Route path="/data_analytics/*" element={<><Applications /><DataAnalytics /></>} />
			<Route path="/digital_marketing/*" element={<><Applications /><DigitalMarketing /></>} />
			<Route path="/bash_scripting/*" element={<><Coding /><BashScripting /></>} />
	            </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;

