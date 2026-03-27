import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const gridLayoutCode = `/* monitoring-dashboard.css — Responsive grid layout */

/* Mobile-first base layout */
.dashboard {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  gap: 16px;
  padding: 16px;
  background: #0d0d0d;
  min-height: 100vh;
}

/* Named grid areas for semantic layout */
.dashboard {
  grid-template-areas:
    "header"
    "alerts"
    "cpu"
    "memory"
    "disk"
    "network"
    "sidebar";
}

.header  { grid-area: header; }
.alerts  { grid-area: alerts; }
.cpu     { grid-area: cpu; }
.memory  { grid-area: memory; }
.disk    { grid-area: disk; }
.network { grid-area: network; }
.sidebar { grid-area: sidebar; }

/* Tablet — 2 columns */
@media (min-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "header  header"
      "alerts  alerts"
      "cpu     memory"
      "disk    network"
      "sidebar sidebar";
  }
}

/* Desktop — 3 columns with persistent sidebar */
@media (min-width: 1200px) {
  .dashboard {
    grid-template-columns: 1fr 1fr 280px;
    grid-template-rows: auto auto 1fr;
    grid-template-areas:
      "header  header  sidebar"
      "alerts  alerts  sidebar"
      "cpu     memory  sidebar"
      "disk    network sidebar";
  }
}

/* Panel base styles */
.panel {
  background: #111;
  border: 1px solid #2d0000;
  border-radius: 10px;
  padding: 20px;
  transition: border-color 0.2s;
}

.panel:hover { border-color: #8b0000; }

/* Flexbox for panel internals */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.metric-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.metric-block {
  flex: 1;
  min-width: 80px;
  text-align: center;
  padding: 10px;
  background: rgba(139,0,0,0.1);
  border-radius: 6px;
}`;

const sites = [
  { name: 'PhoenixAZEvents.com', url: 'http://phoenixazevents.com/', desc: 'Local event discovery site for the Phoenix, AZ area — WordPress with custom event listings.', thumb: 'https://image.thum.io/get/width/600/wait/3/noanimate/http://phoenixazevents.com/' },
  { name: 'RJPJ2020.com', url: 'http://rjpj2020.com/', desc: 'Wedding website celebrating the union of Richard & Polli Jones.', thumb: 'https://image.thum.io/get/width/600/wait/3/noanimate/http://rjpj2020.com/' },
  { name: 'BrandonABoyd.com', url: 'http://brandonaboyd.com/', desc: 'A family website bringing together moments, memories, and milestones shared with my kids.', thumb: 'https://image.thum.io/get/width/600/wait/3/noanimate/http://brandonaboyd.com/' },
  { name: 'RachelIGarcia.com', url: 'http://racheligarcia.com/', desc: 'A heartfelt tribute dedicated to the life and legacy of Rachel Irene Garcia.', thumb: 'https://image.thum.io/get/width/600/wait/3/noanimate/http://racheligarcia.com/' },
];

const WebDesign = () => {
  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Web Design</h1>
        <p className={styles.heroTagline}>Designing functional, responsive web experiences from the ground up</p>
        <div className={styles.heroBadges}>
          {['Responsive Design', 'CSS Grid', 'Flexbox', 'UX', 'WordPress', 'Figma'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            Web design for me is inseparable from technical execution. I design layouts for client sites, internal dashboards,
            and this resume, with a focus on responsive design, accessibility, and performance. I use CSS Grid and Flexbox
            for layout, writing mobile-first stylesheets that scale cleanly from 375px to 4K displays.
          </p>
          <p className={styles.sectionText}>
            Beyond visual aesthetics, I ensure the technical foundation is solid: semantic HTML for accessibility and SEO,
            optimized image delivery (WebP, lazy loading), minimal render-blocking resources, and CSS architecture that
            scales without turning into a specificity nightmare.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Design Principles I Follow</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Mobile-first</strong> — Base styles target small screens, complexity added
            with <code>min-width</code> breakpoints. Results in leaner, more maintainable CSS than desktop-down rewrites.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Performance as design</strong> — A beautifully designed page that loads
            in 4 seconds is a bad design. I optimize Core Web Vitals (LCP, CLS, FID) as part of the design process,
            not as an afterthought.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Semantic HTML</strong> — Using correct elements (<code>nav</code>, <code>main</code>,
            <code>article</code>, <code>section</code>) improves accessibility, SEO crawlability, and screen reader compatibility.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Design mobile-first. Writing CSS for small screens first and adding complexity with
            <code> min-width</code> media queries results in leaner, more maintainable stylesheets — you add features,
            not override them.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Sites I've Built</h2>
        <p className={styles.sectionText}>
          A selection of sites I've designed and built from the ground up, spanning WordPress and React architectures.
        </p>
        <div className={styles.cardsGrid}>
          {sites.map(site => (
            <div key={site.name} className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
              <a href={site.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                <img
                  src={site.thumb}
                  alt={`${site.name} screenshot`}
                  loading="lazy"
                  onError={e => { e.target.style.display = 'none'; }}
                  style={{ width: '100%', height: 140, objectFit: 'cover', objectPosition: 'top', display: 'block', borderBottom: '1px solid #2d0000' }}
                />
              </a>
              <div style={{ padding: '14px 16px 16px' }}>
                <div className={styles.cardTitle}>{site.name}</div>
                <p className={styles.cardMeta} style={{ color: '#aaa', fontSize: '0.82rem', lineHeight: 1.5 }}>{site.desc}</p>
                <a href={site.url} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
                  Visit site →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — Responsive Monitoring Dashboard Grid</h2>
        <p className={styles.sectionText}>
          This CSS Grid layout pattern is what I use for internal monitoring dashboards — a named grid-areas approach
          that reorganizes itself cleanly across mobile, tablet, and desktop breakpoints without JavaScript.
        </p>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>css — responsive grid layout</div>
          <SyntaxHighlighter language="css" style={vscDarkPlus} showLineNumbers>
            {gridLayoutCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default WebDesign;
