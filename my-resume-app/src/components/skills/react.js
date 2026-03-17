import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const appJsCode = `// App.js — This resume's actual routing and GA4 tracking architecture
import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { skillsConfig } from './data/skillsConfig';

// GA4 page-view hook — fires on every React Router navigation
function useGtagPageView() {
  const location = useLocation();
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location]);
}

// Inner component — has access to Router context
function AppRoutes() {
  useGtagPageView();

  return (
    <Suspense fallback={<div className="loading-spinner" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        {skillsConfig.map(skill => (
          <Route
            key={skill.path}
            path={\`/skills/\${skill.path}\`}
            element={<skill.component />}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}`;

const skillsConfigCode = `// data/skillsConfig.js — Data-driven skill routing
// Each skill page is lazy-loaded as its own JS chunk
import { lazy } from 'react';

export const skillsConfig = [
  {
    path: 'linux-admin',
    label: 'Linux Admin',
    category: 'Infrastructure',
    component: lazy(() => import('../components/skills/linux_admin')),
    icon: '🐧',
  },
  {
    path: 'php',
    label: 'PHP',
    category: 'Languages',
    component: lazy(() => import('../components/skills/php')),
    icon: '🐘',
  },
  {
    path: 'mysql',
    label: 'MySQL',
    category: 'Databases',
    component: lazy(() => import('../components/skills/mysql')),
    icon: '🗄️',
  },
  {
    path: 'aws',
    label: 'AWS',
    category: 'Cloud',
    component: lazy(() => import('../components/skills/aws')),
    icon: '☁️',
  },
  {
    path: 'react',
    label: 'React',
    category: 'Frontend',
    component: lazy(() => import('../components/skills/react')),
    icon: '⚛️',
  },
  // ... all 23 skill pages registered here
];

// Group skills by category for the Skills overview page
export const skillsByCategory = skillsConfig.reduce((acc, skill) => {
  if (!acc[skill.category]) acc[skill.category] = [];
  acc[skill.category].push(skill);
  return acc;
}, {});`;

const lazyLoadCode = `// How React.lazy + Suspense works in this resume
// Each skill page is its own webpack chunk — loaded on demand

// ❌ Without code splitting — ALL skill pages in one bundle
import PHP from './components/skills/php';
import MySQL from './components/skills/mysql';
import AWS from './components/skills/aws';
// ^ Entire codebase in one bundle — slow initial load

// ✅ With React.lazy — each page loads only when navigated to
const PHP = lazy(() => import('./components/skills/php'));
const MySQL = lazy(() => import('./components/skills/mysql'));
const AWS = lazy(() => import('./components/skills/aws'));

// Wrap in Suspense with a fallback while the chunk loads
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/skills/php" element={<PHP />} />
    <Route path="/skills/mysql" element={<MySQL />} />
    <Route path="/skills/aws" element={<AWS />} />
  </Routes>
</Suspense>

// webpack output with code splitting:
// main.[hash].js        — 42 KB  (app shell)
// php.[hash].chunk.js   —  8 KB  (loaded only on /skills/php)
// mysql.[hash].chunk.js —  7 KB  (loaded only on /skills/mysql)
// aws.[hash].chunk.js   —  9 KB  (loaded only on /skills/aws)`;

const ReactComponent = () => {
  const [activeTab, setActiveTab] = useState('app');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>React</h1>
        <p className={styles.heroTagline}>Component-driven UI — including this very resume you're reading now</p>
        <div className={styles.heroBadges}>
          {['React 18', 'Hooks', 'React Router', 'Lazy Loading', 'CSS Modules', 'CRA'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            React is my primary frontend framework for building component-based UIs — internal dashboards, monitoring tools,
            and this resume itself. This entire site is a React 18 SPA built with React Router v6, route-level lazy loading,
            CSS Modules for scoped styling, and Google Analytics 4 integration via a custom hook.
          </p>
          <p className={styles.sectionText}>
            I follow a data-driven routing pattern where all skill pages are registered in a central <code>skillsConfig.js</code> array.
            Adding a new skill page requires only adding one entry to the config — the route, nav link, and lazy import are
            all generated automatically.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>This Resume's Architecture</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>React Router v6</strong> — Nested routes, data-driven route generation
            from <code>skillsConfig.js</code>, and a <code>useLocation</code> hook to fire GA4 page-view events on every
            navigation without a full page reload.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Code splitting</strong> — Every skill page is a separate webpack chunk loaded
            on demand via <code>React.lazy()</code>. The initial bundle stays small regardless of how many skill pages exist.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>CSS Modules</strong> — Scoped class names prevent style collisions between components.
            The shared <code>SkillPage.module.css</code> provides a consistent design system across all 23 skill pages.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Use <code>React.lazy()</code> + <code>Suspense</code> for route-level code splitting.
            Each skill page becomes its own chunk — the initial bundle stays small regardless of how many pages you add.
            This is the exact pattern powering this resume's fast initial load.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — This Resume's Actual Architecture</h2>
        <p className={styles.sectionText}>
          The code below is drawn directly from this resume's source. The App.js shows the GA4 page-view hook pattern,
          skillsConfig.js shows the data-driven routing, and the lazy loading example shows the webpack output difference.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['app', 'App.js + GA4 hook'], ['config', 'skillsConfig.js'], ['lazy', 'Lazy loading']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>javascript — {activeTab === 'app' ? 'App.js' : activeTab === 'config' ? 'skillsConfig.js' : 'Code splitting'}</div>
          <SyntaxHighlighter language="javascript" style={vscDarkPlus} showLineNumbers>
            {activeTab === 'app' ? appJsCode : activeTab === 'config' ? skillsConfigCode : lazyLoadCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default ReactComponent;
