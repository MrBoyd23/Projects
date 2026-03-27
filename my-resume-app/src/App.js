import React, { Suspense, lazy, useEffect } from 'react';
import './css/styles.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Experience from './components/Experience';
import NotFound from './components/NotFound';
import { allSkills, CUSTOM_SKILL_IDS } from './data/skillsConfig';

// Lazy-load non-homepage route components — only fetched when navigated to
const Skills = lazy(() => import('./components/Skills'));
const Coding = lazy(() => import('./components/Coding'));
const Software = lazy(() => import('./components/Software'));
const Education = lazy(() => import('./components/Education'));
const Certifications = lazy(() => import('./components/Certifications'));

// Lazy-load custom skill components — only fetched when that route is visited
const customComponents = {
  api:                lazy(() => import('./components/skills/api')),
  ansible:            lazy(() => import('./components/skills/ansible')),
  bash_scripting:     lazy(() => import('./components/skills/bash_scripting')),
  css:                lazy(() => import('./components/skills/css')),
  html:               lazy(() => import('./components/skills/html')),
  javascript:         lazy(() => import('./components/skills/javascript')),
  apache:             lazy(() => import('./components/skills/apache')),
  php:                lazy(() => import('./components/skills/php')),
  aws:                lazy(() => import('./components/skills/aws')),
  mysql:              lazy(() => import('./components/skills/mysql')),
  python:             lazy(() => import('./components/skills/python')),
  node:               lazy(() => import('./components/skills/node')),
  react:              lazy(() => import('./components/skills/react')),
  web_design:         lazy(() => import('./components/skills/web_design')),
  phpmyadmin:         lazy(() => import('./components/skills/phpmyadmin')),
  cpanel:             lazy(() => import('./components/skills/cpanel')),
  plesk:              lazy(() => import('./components/skills/plesk')),
  seo:                lazy(() => import('./components/skills/seo')),
  jira:               lazy(() => import('./components/skills/jira')),
  github:             lazy(() => import('./components/skills/github')),
  grafana:            lazy(() => import('./components/skills/grafana')),
  prometheus:         lazy(() => import('./components/skills/prometheus')),
  servicenow:         lazy(() => import('./components/skills/servicenow')),
  liveperson:         lazy(() => import('./components/skills/liveperson')),
  wordpress:          lazy(() => import('./components/skills/wordpress')),
  'e-commerce':       lazy(() => import('./components/skills/e-commerce')),
  linux_admin:        lazy(() => import('./components/skills/linux_admin')),
  website_analytics:  lazy(() => import('./components/skills/website_analytics')),
  online_marketing:   lazy(() => import('./components/skills/online_marketing')),
  data_analytics:     lazy(() => import('./components/skills/data_analytics')),
  ai_development:     lazy(() => import('./components/skills/ai_development')),
};

// Generic placeholder for skills without custom content yet
const SkillDetail = lazy(() => import('./components/skills/SkillDetail'));

// Google Analytics page-view tracker hook
const useGtagPageView = () => {
  const location = useLocation();
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-PCR1VN8WRP', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
};

const PageTracker = () => {
  useGtagPageView();
  return null;
};

// Main App — skill routes are auto-generated from skillsConfig
// To add a new skill: add an entry to src/data/skillsConfig.js only
function App() {
  return (
    <Router>
      <div className="App">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Header />
        <PageTracker />
        <main id="main-content" className="container">
          <Routes>
            {/* Top-level section routes */}
            <Route path="/"             element={<Experience />} />
            <Route path="/Experience/*" element={<Suspense fallback={<div style={{color:'#666',fontStyle:'italic',padding:'40px 0',textAlign:'center'}}>Loading…</div>}><Skills /></Suspense>} />
            <Route path="/Education/*"  element={<Suspense fallback={<div style={{color:'#666',fontStyle:'italic',padding:'40px 0',textAlign:'center'}}>Loading…</div>}><Education /><Certifications /></Suspense>} />
            <Route path="/coding/*"     element={<Suspense fallback={<div style={{color:'#666',fontStyle:'italic',padding:'40px 0',textAlign:'center'}}>Loading…</div>}><Coding /></Suspense>} />
            <Route path="/Software/*"   element={<Suspense fallback={<div style={{color:'#666',fontStyle:'italic',padding:'40px 0',textAlign:'center'}}>Loading…</div>}><Software /></Suspense>} />

            {/* Skill detail routes — generated from skillsConfig (no manual list needed) */}
            {allSkills.map(({ id, label, category }) => {
              const SkillComponent = CUSTOM_SKILL_IDS.has(id)
                ? customComponents[id]
                : SkillDetail;
              const CategoryNav = category === 'coding' ? Coding : Software;

              return (
                <Route
                  key={id}
                  path={`/${id}/*`}
                  element={
                    <Suspense fallback={<div style={{color:'#666',fontStyle:'italic',padding:'40px 0',textAlign:'center'}}>Loading…</div>}>
                      <CategoryNav />
                      <SkillComponent name={label} />
                    </Suspense>
                  }
                />
              );
            })}

            {/* 404 catch-all — must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

