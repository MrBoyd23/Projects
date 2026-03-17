import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const auditQueriesCode = `-- Emergency DB audit queries run via phpMyAdmin SQL editor
-- Used during customer migration to identify issues before transfer

-- 1. List all tables with row counts and storage engine
SELECT
  table_name,
  engine,
  table_rows,
  ROUND(data_length / 1024 / 1024, 2) AS data_mb,
  ROUND(index_length / 1024 / 1024, 2) AS index_mb,
  table_collation
FROM information_schema.tables
WHERE table_schema = 'customer_db'
ORDER BY data_length DESC;

-- 2. Find orphaned tables from old plugin installations
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'customer_db'
  AND table_name NOT LIKE 'wp_%'
ORDER BY table_name;

-- 3. Check database user permissions
SELECT user, host, Select_priv, Insert_priv, Update_priv,
       Delete_priv, Create_priv, Drop_priv, Grant_priv
FROM mysql.user
WHERE user != 'root'
ORDER BY user;

-- 4. Find tables with MyISAM engine (should be InnoDB)
SELECT table_name, engine
FROM information_schema.tables
WHERE table_schema = 'customer_db'
  AND engine = 'MyISAM';

-- 5. Optimize all tables before migration
OPTIMIZE TABLE wp_posts, wp_postmeta, wp_options, wp_usermeta;`;

const exportCode = `-- Selective export via phpMyAdmin Custom Export

-- Export only specific tables (not entire database)
-- phpMyAdmin > Export > Custom > Select Tables:
--   wp_posts, wp_postmeta, wp_options, wp_users, wp_usermeta

-- Equivalent mysqldump for the same operation:
mysqldump -u root -p \\
  --single-transaction \\
  --skip-lock-tables \\
  customer_db \\
  wp_posts wp_postmeta wp_options wp_users wp_usermeta \\
  > selective_export_$(date +%Y%m%d).sql

-- Verify export integrity
wc -l selective_export_*.sql
grep -c "INSERT INTO" selective_export_*.sql

-- Import via phpMyAdmin:
-- phpMyAdmin > Database > Import > Choose File > Go
-- For large files (>100MB), use CLI import instead:
mysql -u root -p customer_db < selective_export_20250115.sql`;

const PhpMyAdmin = () => {
  const [activeTab, setActiveTab] = useState('audit');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>phpMyAdmin</h1>
        <p className={styles.heroTagline}>GUI-based MySQL administration for rapid database inspection and management</p>
        <div className={styles.heroBadges}>
          {['MySQL GUI', 'Import/Export', 'User Management', 'SQL Editor', 'Database Backup'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            phpMyAdmin is my go-to tool for rapid visual database inspection during support escalations. When a customer
            calls with a broken WordPress site, I can browse the table structure, check the <code>wp_options</code> table for
            misconfigured site URLs, run ad-hoc SELECT queries, and visually identify data anomalies faster than building
            the same queries in the CLI.
          </p>
          <p className={styles.sectionText}>
            I use phpMyAdmin's export functionality to snapshot specific tables before migrations, the SQL editor for
            complex multi-table queries, and the user management interface to visually audit database permissions
            during security reviews.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>When I Reach for phpMyAdmin vs CLI</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>phpMyAdmin is faster for:</strong> Browsing table structures and row data,
            visual comparison of tables, quick exports of specific tables, verifying import results, and diagnosing
            WordPress option misconfigurations (<code>siteurl</code>, <code>home</code>).
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>CLI is better for:</strong> Large imports (&gt;100MB), scripted operations,
            bulk operations across multiple databases, and anything that needs to be repeatable or auditable.
          </p>
          <p className={styles.sectionText}>
            In practice, I use both — phpMyAdmin for the visual inspection phase of an incident, CLI for the actual
            repair operations that need to be documented and reproduced.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Always restrict phpMyAdmin access by IP or move it to a non-default path.
            Leaving it exposed at <code>/phpmyadmin</code> with a weak password is one of the most common attack
            vectors on shared hosting — automated scanners hit it constantly.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — Emergency Database Audit Before Migration</h2>
        <p className={styles.sectionText}>
          Before a cPanel account transfer, I run a full database audit to identify orphaned tables, check storage
          engines, verify user permissions, and export specific tables. The SQL queries below are the ones I run in
          phpMyAdmin's SQL editor during this workflow.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['audit', 'Audit queries'], ['export', 'Export / import']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>{activeTab === 'audit' ? 'sql — audit queries' : 'bash / sql — export workflow'}</div>
          <SyntaxHighlighter language={activeTab === 'audit' ? 'sql' : 'bash'} style={vscDarkPlus} showLineNumbers>
            {activeTab === 'audit' ? auditQueriesCode : exportCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default PhpMyAdmin;
