import React from 'react';
import WeatherComponent from './api2.js';
import TMDbApp from './api3.js';
import styles from '../../css/SkillPage.module.css';

/**
 * API — live demo hub showing real API integrations:
 *   1. Visual Crossing Weather API (api2.js)
 *   2. TMDb Movies/TV/Actors browser (api3.js)
 */
const APIPage = () => (
  <div className={styles.skillPage}>

    <div className={styles.hero}>
      <h1 className={styles.heroTitle}>API Integrations</h1>
      <p className={styles.heroTagline}>
        Live REST API calls I've built — demonstrating real data consumption, error handling,
        and performance optimizations like <code>append_to_response</code> and <code>Promise.all</code>
      </p>
      <div className={styles.heroBadges}>
        {['REST','fetch / axios','Promise.all','Visual Crossing','TMDb','JSON'].map(b => (
          <span key={b} className={styles.heroBadge}>{b}</span>
        ))}
      </div>
    </div>

    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>How I Use APIs Daily</h2>
      <p className={styles.sectionText}>
        As a System Engineer III, REST APIs are a core part of my toolkit. I interact with
        ServiceNow's REST API for automated incident creation, the GitHub API for scripted
        repository management, cloud provider APIs for infrastructure automation, and
        monitoring APIs for programmatic alert management.
      </p>
      <p className={styles.sectionText}>
        The two live demos below showcase client-side API consumption built with React — including
        parallel fetch optimization, proper error handling, pagination, and search functionality.
      </p>
      <div className={styles.tipBox}>
        <strong>Performance Note:</strong> The TMDb browser uses TMDb's{' '}
        <code>append_to_response</code> parameter to combine certification and cast data into a
        single request per item, then runs all detail fetches in parallel via{' '}
        <code>Promise.all</code> — cutting total API requests roughly in half versus the original
        N+1 approach.
      </div>
    </div>

    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>📍 Live: Visual Crossing Weather API</h2>
      <p className={styles.sectionText}>
        Real-time weather for 5 major US cities, fetched from the{' '}
        <strong>Visual Crossing Weather API</strong> on page load.
      </p>
      <WeatherComponent />
    </div>

    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>🎬 Live: TMDb Movie &amp; TV Browser</h2>
      <p className={styles.sectionText}>
        Search movies, TV shows, and actors using the <strong>TMDb API</strong>.
        Results include ratings, certifications, cast, and paginated top-rated lists.
      </p>
      <TMDbApp />
    </div>

  </div>
);

export default APIPage;
