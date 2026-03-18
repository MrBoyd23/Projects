import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const malwareRemediationCode = `#!/bin/bash
# WordPress malware remediation workflow using WP-CLI
# Run as root or the site owner's system user

SITE_PATH="/var/www/html/customer-site"
SITE_URL="https://customer-site.com"

echo "=== Step 1: Enable maintenance mode ==="
wp maintenance-mode activate --path="$SITE_PATH"

echo "=== Step 2: Verify core file integrity ==="
wp core verify-checksums --path="$SITE_PATH"
# Flags any modified WordPress core files vs. official checksums

echo "=== Step 3: Verify all plugin checksums ==="
wp plugin verify-checksums --all --path="$SITE_PATH"
# Identifies plugins with modified files (common injection point)

echo "=== Step 4: List files modified in last 7 days ==="
find "$SITE_PATH" -name "*.php" -newer "$SITE_PATH/wp-config.php" -mtime -7 -ls \\
  | sort -k8 | grep -v ".git"

echo "=== Step 5: Scan for common malware signatures ==="
grep -rl "eval(base64_decode" "$SITE_PATH" --include="*.php"
grep -rl "preg_replace.*/e" "$SITE_PATH" --include="*.php"
grep -rl "system(" "$SITE_PATH" --include="*.php" | grep -v "wp-includes"
grep -rl "shell_exec" "$SITE_PATH" --include="*.php" | grep -v "wp-includes"

echo "=== Step 6: Reset admin password ==="
wp user update admin \\
  --user_pass="$(openssl rand -base64 24)" \\
  --path="$SITE_PATH"

echo "=== Step 7: Regenerate secret keys in wp-config.php ==="
wp config shuffle-salts --path="$SITE_PATH"

echo "=== Step 8: Update all plugins and themes ==="
wp plugin update --all --path="$SITE_PATH"
wp theme update --all --path="$SITE_PATH"
wp core update --path="$SITE_PATH"

echo "=== Step 9: Delete unused themes (attack surface reduction) ==="
# Keep only the active theme
ACTIVE_THEME=$(wp theme list --status=active --field=name --path="$SITE_PATH")
wp theme delete $(wp theme list --field=name --path="$SITE_PATH" | grep -v "$ACTIVE_THEME") 2>/dev/null || true

echo "=== Step 10: Harden file permissions ==="
find "$SITE_PATH" -type d -exec chmod 755 {} \\;
find "$SITE_PATH" -type f -exec chmod 644 {} \\;
chmod 600 "$SITE_PATH/wp-config.php"

echo "=== Step 11: Flush caches and disable maintenance mode ==="
wp cache flush --path="$SITE_PATH"
wp maintenance-mode deactivate --path="$SITE_PATH"

echo "=== Remediation complete. Verify site: $SITE_URL ==="`;

const wpcliDailyCode = `#!/bin/bash
# WP-CLI daily management commands — patterns I use constantly

SITE="/var/www/html/site"

# --- Database operations ---
# Optimize all database tables
wp db optimize --path="$SITE"

# Search and replace domain after migration (updates serialized data correctly)
wp search-replace 'http://old-domain.com' 'https://new-domain.com' \\
  --all-tables --precise --path="$SITE"

# Export/import database
wp db export "/backups/site_$(date +%Y%m%d).sql" --path="$SITE"
wp db import /backups/site_restore.sql --path="$SITE"

# --- User management ---
# Reset a user's password
wp user update username --user_pass='NewSecurePassword!' --path="$SITE"

# List all admin users
wp user list --role=administrator --path="$SITE"

# Create a new admin user
wp user create newadmin admin@site.com \\
  --role=administrator \\
  --user_pass='TempPassword123!' \\
  --path="$SITE"

# --- Bulk plugin management ---
# List all plugins with update status
wp plugin list --path="$SITE"

# Update a specific plugin
wp plugin update woocommerce --path="$SITE"

# Deactivate all plugins (WSOD troubleshooting)
wp plugin deactivate --all --path="$SITE"

# Reactivate specific plugin
wp plugin activate contact-form-7 --path="$SITE"

# --- wp-config management ---
# View current WP_DEBUG setting
wp config get WP_DEBUG --path="$SITE"

# Enable debug logging without displaying errors
wp config set WP_DEBUG true --raw --path="$SITE"
wp config set WP_DEBUG_LOG true --raw --path="$SITE"
wp config set WP_DEBUG_DISPLAY false --raw --path="$SITE"

# Increase memory limit
wp config set WP_MEMORY_LIMIT '256M' --path="$SITE"`;

const WordPress = () => {
  const [plugins, setPlugins] = useState([]);
  const [pluginsLoading, setPluginsLoading] = useState(true);
  const [pluginsError, setPluginsError] = useState(null);
  const [activeTab, setActiveTab] = useState('remediation');

  useEffect(() => {
    fetch('https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[search]=security&request[per_page]=4')
      .then(res => {
        if (!res.ok) throw new Error(`WordPress API error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setPlugins(data.plugins || []);
        setPluginsLoading(false);
      })
      .catch(err => {
        setPluginsError(err.message);
        setPluginsLoading(false);
      });
  }, []);

  const formatInstalls = (num) => {
    if (!num) return 'N/A';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K+`;
    return num.toString();
  };

  const formatRating = (rating) => {
    if (!rating) return '—';
    const stars = Math.round(rating / 20);
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  };

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>WordPress</h1>
        <p className={styles.heroTagline}>Supporting and securing 100,000+ WordPress sites on managed hosting</p>
        <div className={styles.heroBadges}>
          {['WP-CLI', 'wp-config.php', 'Malware Remediation', 'WooCommerce', 'PHP', 'MySQL'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            WordPress is the most common platform in the hosting environments I support — it's involved in a majority of
            my daily support escalations. I use WP-CLI for everything: updating core, plugins, and themes;
            resetting admin passwords; fixing database encoding issues; diagnosing WSOD (White Screen of Death);
            and performing malware remediation.
          </p>
          <p className={styles.sectionText}>
            I've built runbooks for the most common WordPress attack vectors — compromised admin credentials,
            injected malicious PHP files, backdoors in theme files, and malicious <code>wp_options</code> entries.
            I can take a fully compromised WordPress site and restore it to a clean state using a documented,
            reproducible CLI workflow.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>100K+</div>
              <div className={styles.statLabel}>WP Sites Managed</div>
            </div>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>WP-CLI</div>
              <div className={styles.statLabel}>Primary Tool</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Common Incident Types</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Malware / compromise</strong> — Injected PHP in theme files or
            <code> wp-content/uploads</code>. Detected via <code>wp core verify-checksums</code> and file modification
            timestamps. Remediated with full credential reset, file cleanup, and permission hardening.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>White Screen of Death</strong> — Almost always a PHP fatal error.
            Diagnosed via PHP error log + WP-CLI plugin deactivation to isolate the offending plugin.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Database connection errors</strong> — Wrong credentials in
            <code> wp-config.php</code> after a migration, or MySQL max_connections exceeded. Fixed via WP-CLI config
            update or direct MySQL intervention.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> The fastest way to detect malware is:{' '}
            <code>wp core verify-checksums &amp;&amp; wp plugin verify-checksums --all</code> — it compares installed
            files against official WordPress.org checksums and flags any modified files. Run this first on every
            suspected compromise.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — Malware Remediation Workflow</h2>
        <p className={styles.sectionText}>
          The complete WP-CLI workflow I use for malware remediation and the daily management commands that cover
          the most common WordPress operations I perform.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['remediation', 'Malware remediation'], ['daily', 'Daily WP-CLI commands']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>bash — WP-CLI</div>
          <SyntaxHighlighter language="bash" style={vscDarkPlus} showLineNumbers>
            {activeTab === 'remediation' ? malwareRemediationCode : wpcliDailyCode}
          </SyntaxHighlighter>
        </div>
      </div>

      <div className={styles.liveSection}>
        <h2 className={styles.liveSectionTitle}>
          <span className={styles.liveDot} />
          Top Security Plugins — WordPress.org API
        </h2>
        <p className={styles.liveSubtitle}>
          Fetched live from api.wordpress.org — plugins I recommend for hardening WordPress installations
        </p>

        {pluginsLoading && <p className={styles.loading}>Loading from WordPress.org API...</p>}
        {pluginsError && <p className={styles.error}>Could not load plugin data: {pluginsError}</p>}

        {!pluginsLoading && !pluginsError && (
          <div className={styles.cardsGrid}>
            {plugins.map(plugin => (
              <div key={plugin.slug} className={styles.card}>
                <div className={styles.cardTitle}>{plugin.name}</div>
                <p className={styles.cardMeta}>
                  <span style={{ color: '#40e0d0' }}>{formatInstalls(plugin.active_installs)} active installs</span>
                </p>
                <p className={styles.cardMeta}>
                  <span className={styles.cardStar}>{formatRating(plugin.rating)}</span>
                  <span style={{ color: '#666', marginLeft: '6px', fontSize: '0.72rem' }}>
                    ({plugin.num_ratings?.toLocaleString() || 0} ratings)
                  </span>
                </p>
                {plugin.short_description && (
                  <p className={styles.cardMeta} style={{ color: '#aaa', fontSize: '0.78rem', lineHeight: 1.4, marginTop: '6px' }}>
                    {plugin.short_description.substring(0, 100)}...
                  </p>
                )}
                <a
                  href={`https://wordpress.org/plugins/${plugin.slug}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.cardLink}
                >
                  View on WordPress.org →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordPress;
