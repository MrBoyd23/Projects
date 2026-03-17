import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const indexHtmlCode = `<!-- index.html — GA4 script tag in the <head> -->
<!-- Measurement ID is injected at build time from environment variable -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="Brandon Boyd — System Engineer III at GoDaddy" />
  <title>Brandon Boyd | System Engineer III</title>

  <!-- Google tag (gtag.js) — Google Analytics 4 -->
  <!-- async: doesn't block page render -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=%REACT_APP_GA_MEASUREMENT_ID%"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());

    // Initial config — page_view fired on hard load
    // send_page_view: false because the React hook handles SPA navigation
    gtag('config', '%REACT_APP_GA_MEASUREMENT_ID%', {
      send_page_view: false,
      cookie_flags: 'SameSite=None;Secure'
    });
  </script>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;

const pageViewHookCode = `// App.js — GA4 SPA page-view tracking hook
// Standard gtag doesn't fire on React Router navigation (no full page reload)
// This hook listens to route changes and fires page_view manually

import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

/**
 * useGtagPageView — fires GA4 page_view event on every route change.
 *
 * Must be used inside a component that is a child of <Router>
 * so it has access to the location context.
 */
function useGtagPageView() {
  const location = useLocation();

  useEffect(() => {
    // Guard: don't fire if gtag isn't loaded or measurement ID is missing
    if (
      typeof window.gtag !== 'function' ||
      !process.env.REACT_APP_GA_MEASUREMENT_ID
    ) {
      return;
    }

    window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID, {
      // Full path including query string — important for tracking search params
      page_path: location.pathname + location.search,
      // Document title at time of navigation
      page_title: document.title,
    });

    // Optional: log in dev to confirm it's firing
    if (process.env.NODE_ENV === 'development') {
      console.log('[GA4] page_view:', location.pathname + location.search);
    }
  }, [location]); // Re-runs every time the route changes
}

// Inner component — has access to Router context
function AppRoutes() {
  useGtagPageView(); // Hook fires on every navigation

  return (
    <Suspense fallback={<div className="loading" />}>
      <Routes>
        {/* Routes defined here */}
      </Routes>
    </Suspense>
  );
}

// Root component wraps everything in Router
export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}`;

const customEventsCode = `// Custom GA4 event tracking patterns
// Used in this resume site and client projects

// Track skill page views with skill name as parameter
export function trackSkillView(skillName) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'skill_view', {
    skill_name: skillName,
    page_location: window.location.href,
  });
}

// Track contact form engagement
export function trackContactFormOpen() {
  window.gtag?.('event', 'contact_form_open', {
    event_category: 'engagement',
    event_label: 'contact_modal',
  });
}

export function trackContactFormSubmit(success) {
  window.gtag?.('event', 'contact_form_submit', {
    event_category: 'conversion',
    success: success,
  });
}

// Track resume PDF download (if applicable)
export function trackResumeDownload() {
  window.gtag?.('event', 'file_download', {
    event_category: 'engagement',
    file_name: 'brandon_boyd_resume.pdf',
    file_extension: 'pdf',
  });
}

// Track outbound link clicks (GitHub, LinkedIn, etc.)
export function trackOutboundLink(url, linkText) {
  window.gtag?.('event', 'click', {
    event_category: 'outbound',
    event_label: linkText,
    link_url: url,
    transport_type: 'beacon', // Ensures event fires before page navigates away
  });
}`;

const Website_Analytics = () => {
  const [activeTab, setActiveTab] = useState('indexhtml');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Website Analytics</h1>
        <p className={styles.heroTagline}>Turning raw traffic data into actionable insights</p>
        <div className={styles.heroBadges}>
          {['Google Analytics 4', 'GTM', 'Custom Events', 'Conversion Tracking', 'Core Web Vitals'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            I implement and maintain analytics tracking for client sites and my own projects. That means setting up
            GA4 properties, configuring Google Tag Manager containers, defining custom events for user interactions,
            building conversion funnels, and reviewing Core Web Vitals for performance optimization.
          </p>
          <p className={styles.sectionText}>
            This resume site uses GA4 with SPA page-view tracking implemented via a custom React hook —
            <code> useGtagPageView</code> — that fires a <code>page_view</code> event on every React Router navigation.
            Standard GA4 doesn't work with SPAs out of the box, so this hook is the critical piece that makes
            analytics work correctly with client-side routing.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>SPA Analytics Challenges</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>The SPA problem</strong> — Single-page apps never fully reload the
            page, so the standard GA4 snippet only fires once on the initial page load. Every subsequent React Router
            navigation is invisible to analytics without custom instrumentation.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>The solution</strong> — A <code>useEffect</code> hook that depends
            on React Router's <code>useLocation</code>. Every time the location object changes (route change),
            the hook fires <code>gtag('config', ...)</code> with the new <code>page_path</code>, telling GA4 to
            record a new page view.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Why it matters</strong> — Without this, GA4 reports 100% single-page
            sessions with a 100% bounce rate, zero skill page views, and no conversion data. Useless for understanding
            how users navigate the site.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Standard GA4 page-view tracking doesn't work with React Router SPAs — the page
            never fully reloads. You must listen to route changes manually and call{' '}
            <code>gtag('config', ...)</code> with the new <code>page_path</code> on each navigation, exactly as done
            in this site's <code>App.js</code>.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — GA4 on This Resume Site</h2>
        <p className={styles.sectionText}>
          The code below is drawn directly from this site's implementation — the gtag.js snippet, the SPA page-view hook,
          and the custom event tracking functions used throughout the site.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['indexhtml', 'index.html snippet'], ['hook', 'useGtagPageView hook'], ['events', 'Custom events']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>
            {activeTab === 'indexhtml' ? 'html — index.html' : 'javascript — ' + (activeTab === 'hook' ? 'App.js' : 'analytics.js')}
          </div>
          <SyntaxHighlighter
            language={activeTab === 'indexhtml' ? 'html' : 'javascript'}
            style={vscDarkPlus}
            showLineNumbers
          >
            {activeTab === 'indexhtml' ? indexHtmlCode : activeTab === 'hook' ? pageViewHookCode : customEventsCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default Website_Analytics;
