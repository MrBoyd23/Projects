import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const robotsTxtCode = `# robots.txt — resume.brandonaboyd.com
# Instructs crawlers on what to index and what to skip

User-agent: *
Allow: /

# Block admin and API paths from indexing
Disallow: /admin/
Disallow: /api/
Disallow: /wp-admin/
Disallow: /wp-login.php
Disallow: /?s=          # WordPress search results (duplicate content)
Disallow: /tag/         # Tag archive pages (thin content)

# Allow Googlebot to crawl CSS/JS (required for rendering assessment)
User-agent: Googlebot
Allow: /static/
Allow: *.js$
Allow: *.css$

# Sitemap location — must match canonical domain (HTTPS)
Sitemap: https://resume.brandonaboyd.com/sitemap.xml

# Crawl-delay for aggressive bots
User-agent: AhrefsBot
Crawl-delay: 10`;

const sitemapCode = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Homepage — highest priority -->
  <url>
    <loc>https://resume.brandonaboyd.com/</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- About page -->
  <url>
    <loc>https://resume.brandonaboyd.com/about</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Skills overview -->
  <url>
    <loc>https://resume.brandonaboyd.com/skills</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Individual skill pages — auto-generated from skillsConfig -->
  <url>
    <loc>https://resume.brandonaboyd.com/skills/linux-admin</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- ... remaining skill pages ... -->

</urlset>`;

const htaccessCode = `# .htaccess — HTTPS enforcement + HSTS + canonical redirects

# Force HTTPS — 301 permanent redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

# Remove www (canonical domain is non-www)
RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
RewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]

# HSTS — tell browsers to always use HTTPS for 1 year
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

# X-Content-Type-Options
Header always set X-Content-Type-Options "nosniff"

# Referrer-Policy
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Canonical tag via PHP (for WordPress — add to header.php)
# <link rel="canonical" href="https://resume.brandonaboyd.com<?php echo $_SERVER['REQUEST_URI']; ?>" />

# Gzip compression for faster LCP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>`;

const SEO = () => {
  const [activeTab, setActiveTab] = useState('robots');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>SEO</h1>
        <p className={styles.heroTagline}>Technical SEO to ensure servers, configs, and content rank and perform</p>
        <div className={styles.heroBadges}>
          {['Sitemap', 'robots.txt', 'Core Web Vitals', 'Structured Data', 'Crawl Budget', 'HTTPS'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            My approach to SEO is server-side first. I configure <code>robots.txt</code> to protect crawl budget,
            generate XML sitemaps, enforce HTTPS redirects with proper HSTS headers, monitor Core Web Vitals in
            Google Search Console, and fix crawl errors before they compound. I built the <code>sitemap.xml</code> and
            <code> robots.txt</code> for this very resume site.
          </p>
          <p className={styles.sectionText}>
            I've implemented technical SEO for multiple client sites — diagnosing duplicate content issues from
            HTTP/HTTPS and www/non-www variants, fixing slow LCP caused by render-blocking resources, and setting
            up canonical tags to prevent content dilution.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Technical SEO Checklist</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>HTTPS + HSTS</strong> — 301 redirect from HTTP, non-www canonical,
            HSTS header with <code>includeSubDomains</code> and <code>preload</code>. Verified with Chrome DevTools
            and <code>curl -I</code>.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Crawl budget</strong> — <code>robots.txt</code> blocking admin pages,
            search results, and tag archives. Only indexable, canonical content gets crawler access.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Core Web Vitals</strong> — LCP under 2.5s via image optimization and
            preloading, CLS near zero by setting explicit image dimensions, FID/INP low via deferring non-critical JS.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> HTTPS is a confirmed Google ranking signal. A 301 redirect from HTTP to HTTPS with
            proper HSTS headers is the bare minimum. Also ensure your <code>sitemap.xml</code> URL in <code>robots.txt</code>{' '}
            matches your canonical domain exactly — a mismatch can cause indexing delays.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — Technical SEO Implementation for This Site</h2>
        <p className={styles.sectionText}>
          The files below are based on the actual robots.txt, sitemap.xml, and .htaccess configurations I implemented
          for this resume site and client projects.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['robots', 'robots.txt'], ['sitemap', 'sitemap.xml'], ['htaccess', '.htaccess HTTPS + HSTS']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>{activeTab === 'robots' ? 'robots.txt' : activeTab === 'sitemap' ? 'sitemap.xml' : 'apache .htaccess'}</div>
          <SyntaxHighlighter
            language={activeTab === 'robots' ? 'nginx' : activeTab === 'sitemap' ? 'xml' : 'apacheconf'}
            style={vscDarkPlus}
            showLineNumbers
          >
            {activeTab === 'robots' ? robotsTxtCode : activeTab === 'sitemap' ? sitemapCode : htaccessCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default SEO;
