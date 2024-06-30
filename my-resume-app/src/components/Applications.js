import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import '../css/Skills.css';

// Import skill detail components
import Apache from './skills/apache';
import CPanel from './skills/cpanel';
import Plesk from './skills/plesk';
import Jira from './skills/jira';
import GitHub from './skills/github';
import SEO from './skills/seo';
import Grafana from './skills/grafana';
import Prometheus from './skills/prometheus';
import ServiceNow from './skills/servicenow';
import LivePerson from './skills/liveperson';
import WordPress from './skills/wordpress';
import ECommerce from './skills/e-commerce';
import LinuxAdmin from './skills/linux_admin';
import WebsiteAnalytics from './skills/website_analytics';
import OnlineMarketing from './skills/online_marketing';
import OnlineAdvertising from './skills/online_advertising';
import DataAnalytics from './skills/data_analytics';
import DigitalMarketing from './skills/digital_marketing';

const Applications = () => {
  return (
    <div className="skills-page">
      <div className="skills-list">
        <Link to="/apache" className="skill-bubble">Apache</Link>
        <Link to="/cpanel" className="skill-bubble">cPanel</Link>
        <Link to="/plesk" className="skill-bubble">Plesk</Link>
        <Link to="/seo" className="skill-bubble">SEO</Link>	  
        <Link to="/jira" className="skill-bubble">Jira</Link>
        <Link to="/github" className="skill-bubble">GitHub</Link>
        <Link to="/grafana" className="skill-bubble">Grafana</Link>
        <Link to="/prometheus" className="skill-bubble">Prometheus</Link>
        <Link to="/servicenow" className="skill-bubble">ServiceNow</Link>
        <Link to="/liveperson" className="skill-bubble">LivePerson</Link>
        <Link to="/wordpress" className="skill-bubble">WordPress</Link>
        <Link to="/e-commerce" className="skill-bubble">ECommerce</Link>
        <Link to="/linux_admin" className="skill-bubble">Linux Admin</Link>
        <Link to="/website_analytics" className="skill-bubble">Website Analytics</Link>
        <Link to="/online_marketing" className="skill-bubble">Online Marketing</Link>
        <Link to="/online_advertising" className="skill-bubble">Online Advertising</Link>
        <Link to="/data_analytics" className="skill-bubble">Data Analytics</Link>
        <Link to="/digital_marketing" className="skill-bubble">Digital Marketing</Link>
      </div>

      <div className="skills-container">
        <Routes>
          <Route path="/apache" element={<Apache />} />
          <Route path="/cpanel" element={<CPanel />} />
          <Route path="/plesk" element={<Plesk />} />
          <Route path="/seo" element={<SEO />} />	  
          <Route path="/jira" element={<Jira />} />
          <Route path="/github" element={<GitHub />} />
          <Route path="/grafana" element={<Grafana />} />
          <Route path="/prometheus" element={<Prometheus />} />
          <Route path="/servicenow" element={<ServiceNow />} />
          <Route path="/liveperson" element={<LivePerson />} />
          <Route path="/wordpress" element={<WordPress />} />
          <Route path="/e-commerce" element={<ECommerce />} />
          <Route path="/linux_admin" element={<LinuxAdmin />} />
          <Route path="/website_analytics" element={<WebsiteAnalytics />} />
          <Route path="/online_marketing" element={<OnlineMarketing />} />
          <Route path="/online_advertising" element={<OnlineAdvertising />} />
          <Route path="/data_analytics" element={<DataAnalytics />} />
          <Route path="/digital_marketing" element={<DigitalMarketing />} />
        </Routes>
      </div>
    </div>
  );
};

export default Applications;

