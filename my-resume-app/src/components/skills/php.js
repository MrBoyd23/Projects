import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const phpIniCode = `; /etc/php/8.2/fpm/php.ini — Production tuning
memory_limit = 256M
max_execution_time = 60
max_input_time = 60
post_max_size = 64M
upload_max_filesize = 64M
display_errors = Off
log_errors = On
error_log = /var/log/php/error.log

; OPcache — critical for WordPress performance
opcache.enable = 1
opcache.memory_consumption = 128
opcache.interned_strings_buffer = 16
opcache.max_accelerated_files = 10000
opcache.revalidate_freq = 60
opcache.validate_timestamps = 1`;

const phpDiagCode = `# Check active PHP version and loaded modules
php -v
php -m | grep -i opcache

# Lint a file for syntax errors before deploying
php -l /var/www/html/wp-config.php

# Tail the PHP-FPM slow log in real time
tail -f /var/log/php8.2-fpm.log | grep -i "warning\\|fatal\\|error"

# Switch active PHP CLI version (Ubuntu/Debian)
sudo update-alternatives --set php /usr/bin/php8.2

# Check PHP-FPM pool status
sudo systemctl status php8.2-fpm
sudo php-fpm8.2 -t   # test config before reload

# Find all PHP files recently modified (malware hunting)
find /var/www -name "*.php" -newer /tmp/baseline -ls`;

const fpmPoolCode = `; /etc/php/8.2/fpm/pool.d/www.conf — high-traffic site pool
[www]
user = www-data
group = www-data
listen = /run/php/php8.2-fpm.sock
listen.owner = www-data
listen.group = www-data

pm = dynamic
pm.max_children = 50
pm.start_servers = 10
pm.min_spare_servers = 5
pm.max_spare_servers = 20
pm.max_requests = 500

; Log slow requests over 5 seconds
slowlog = /var/log/php8.2-fpm-slow.log
request_slowlog_timeout = 5s`;

const PHP = () => {
  const [activeTab, setActiveTab] = useState('ini');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>PHP</h1>
        <p className={styles.heroTagline}>Server-side scripting powering millions of WordPress sites I manage daily</p>
        <div className={styles.heroBadges}>
          {['PHP-FPM', 'php.ini', 'OPcache', 'CLI', 'WordPress', 'PHP 8.x'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            PHP is the backbone of nearly every WordPress site on shared and managed hosting platforms. As a System Engineer III,
            I manage PHP-FPM pool configurations, diagnose memory exhaustion errors, switch PHP versions for compatibility issues,
            and tune <code>php.ini</code> directives like <code>memory_limit</code>, <code>max_execution_time</code>, and OPcache settings.
          </p>
          <p className={styles.sectionText}>
            The most common escalation I handle is the White Screen of Death (WSOD) — almost always a PHP fatal error. I tail FPM logs,
            identify the offending plugin or theme, and restore service, often without requiring a full site restore.
            I also manage PHP version upgrades for clients migrating to PHP 8.x from end-of-life 7.x branches.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>8.x</div>
              <div className={styles.statLabel}>Active Version</div>
            </div>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>256M</div>
              <div className={styles.statLabel}>Typical Limit</div>
            </div>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>FPM</div>
              <div className={styles.statLabel}>Process Model</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Common Incident Patterns</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Fatal error: Allowed memory size exhausted</strong> — The most frequent PHP ticket.
            Caused by a WordPress plugin loading too much data. Fix: increase <code>memory_limit</code> in <code>php.ini</code> or
            the site's <code>wp-config.php</code> (<code>define('WP_MEMORY_LIMIT', '256M')</code>).
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Max execution time exceeded</strong> — Long-running WooCommerce imports
            or backup plugins hitting the default 30-second limit. I identify the offending process via FPM slow logs and
            tune <code>max_execution_time</code> for the specific pool, not globally.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>PHP version mismatch</strong> — Plugin requiring PHP 8.0+ running on 7.4.
            I use <code>update-alternatives</code> to switch CLI and coordinate FPM pool changes to avoid downtime.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Never set <code>display_errors=On</code> in production. Use <code>log_errors=On</code> and
            tail the error log. Exposing raw PHP errors leaks server paths, database credentials, and version info to attackers.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — Diagnosing Memory Exhaustion</h2>
        <p className={styles.sectionText}>
          A WordPress site goes white screen mid-morning. The customer reports no recent changes. I pull up the PHP error log,
          find <code>Fatal error: Allowed memory size of 134217728 bytes exhausted</code> in a WooCommerce product import function,
          identify the pool config needs tuning, and restore the site in under 10 minutes.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['ini', 'php.ini tuning'], ['diag', 'CLI diagnostics'], ['fpm', 'FPM pool config']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
                background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>
            {activeTab === 'ini' ? 'php.ini' : activeTab === 'diag' ? 'bash' : 'php-fpm pool config'}
          </div>
          <SyntaxHighlighter language={activeTab === 'ini' || activeTab === 'fpm' ? 'ini' : 'bash'} style={vscDarkPlus} showLineNumbers>
            {activeTab === 'ini' ? phpIniCode : activeTab === 'diag' ? phpDiagCode : fpmPoolCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default PHP;
