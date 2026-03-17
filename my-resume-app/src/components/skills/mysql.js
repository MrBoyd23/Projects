import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const processlistCode = `-- Find blocking queries and long-running connections
SHOW FULL PROCESSLIST;

-- Kill a specific process by ID
KILL 4821;

-- Find all queries running longer than 30 seconds
SELECT id, user, host, db, command, time, state, LEFT(info, 80) AS query
FROM information_schema.processlist
WHERE command != 'Sleep' AND time > 30
ORDER BY time DESC;

-- Check max connections vs current usage
SHOW STATUS LIKE 'Max_used_connections';
SHOW STATUS LIKE 'Threads_connected';
SHOW VARIABLES LIKE 'max_connections';

-- Temporarily raise max_connections without restart
SET GLOBAL max_connections = 500;`;

const slowQueryCode = `-- Enable slow query log at runtime (no restart needed)
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';

-- Parse slow log with mysqldumpslow
mysqldumpslow -s t -t 10 /var/log/mysql/slow.log

-- Add EXPLAIN to investigate a slow query
EXPLAIN SELECT p.ID, p.post_title
FROM wp_posts p
JOIN wp_postmeta pm ON p.ID = pm.post_id
WHERE pm.meta_key = '_wp_page_template'
  AND p.post_status = 'publish';

-- Add missing index to speed up the query above
ALTER TABLE wp_postmeta ADD INDEX idx_meta_key (meta_key);`;

const backupGrantCode = `# Full database backup before any migration or schema change
mysqldump -u root -p \\
  --single-transaction \\
  --routines \\
  --triggers \\
  --events \\
  customer_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup a single table
mysqldump -u root -p customer_db wp_options > wp_options_backup.sql

# Restore from backup
mysql -u root -p customer_db < backup_20250115_143022.sql

-- Grant permissions to application user
GRANT SELECT, INSERT, UPDATE, DELETE ON customer_db.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;

-- Revoke privileges
REVOKE ALL PRIVILEGES ON customer_db.* FROM 'old_user'@'%';
DROP USER 'old_user'@'%';

-- Repair a corrupted InnoDB table
ALTER TABLE wp_options ENGINE=InnoDB;

-- Check and optimize tables
CHECK TABLE wp_posts;
OPTIMIZE TABLE wp_posts, wp_postmeta, wp_options;`;

const MySQL = () => {
  const [activeTab, setActiveTab] = useState('process');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>MySQL</h1>
        <p className={styles.heroTagline}>Database troubleshooting and administration across thousands of hosted accounts</p>
        <div className={styles.heroBadges}>
          {['InnoDB', 'mysqldump', 'SHOW PROCESSLIST', 'slow query log', 'user grants', 'replication'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            MySQL administration is a constant part of my incident response workflow. When a WordPress site goes down or
            slows to a crawl, the database is usually the first thing I check. I run <code>SHOW PROCESSLIST</code> to identify
            blocking queries, review the slow query log to find missing indexes, and kill runaway processes that are consuming
            all available connections.
          </p>
          <p className={styles.sectionText}>
            I perform <code>mysqldump</code> backups before every migration, schema change, or risky operation. I've repaired
            corrupted InnoDB tables, managed replication lag on read replicas, and handled "too many connections" emergencies
            by temporarily raising <code>max_connections</code> at runtime to restore service.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>InnoDB</div>
              <div className={styles.statLabel}>Primary Engine</div>
            </div>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>8.0</div>
              <div className={styles.statLabel}>Target Version</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Incident Patterns</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Too many connections</strong> — A rogue PHP process (often a WP cron job)
            opens hundreds of connections and never releases them. Fix: identify via <code>SHOW PROCESSLIST</code>,
            KILL the offending threads, tune <code>max_connections</code> and <code>wait_timeout</code>.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Table-level lock contention</strong> — Plugins using <code>MyISAM</code>
            instead of InnoDB cause full table locks on writes. Fix: convert to InnoDB with <code>ALTER TABLE ... ENGINE=InnoDB</code>.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Replication lag</strong> — I monitor <code>Seconds_Behind_Master</code>
            on read replicas and identify the binary log position causing delays, adjusting <code>slave_parallel_workers</code>
            to reduce lag.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Always <code>mysqldump</code> before any schema change or migration. One line:{' '}
            <code>mysqldump -u root -p db_name &gt; backup_$(date +%Y%m%d).sql</code>. That 10 seconds has saved hours of recovery time.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — "Too Many Connections" Emergency</h2>
        <p className={styles.sectionText}>
          Production site returns "ERROR 1040: Too many connections." I SSH in, connect to MySQL as root (which has one reserved
          connection above <code>max_connections</code>), identify the offending queries, kill them, restore service, then
          investigate the root cause in the slow query log.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['process', 'PROCESSLIST + KILL'], ['slow', 'Slow query log'], ['backup', 'Backup + Grants']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>{activeTab === 'backup' ? 'bash / sql' : 'sql'}</div>
          <SyntaxHighlighter language={activeTab === 'backup' ? 'bash' : 'sql'} style={vscDarkPlus} showLineNumbers>
            {activeTab === 'process' ? processlistCode : activeTab === 'slow' ? slowQueryCode : backupGrantCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default MySQL;
