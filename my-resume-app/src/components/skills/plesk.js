import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const pleskCliCode = `#!/bin/bash
# Plesk CLI commands for subscription setup, SSL, and hardening

DOMAIN="newclient.com"
EMAIL="admin@newclient.com"
PHP_VERSION="8.2"

# 1. Create a new subscription (hosting plan)
plesk bin subscription --create "$DOMAIN" \\
  -owner-name "New Client" \\
  -email "$EMAIL" \\
  -service-plan "Default Domain" \\
  -ip "203.0.113.10"

# 2. Create FTP/system user for the subscription
plesk bin ftpsubaccount --create "$DOMAIN" \\
  -login "newclient_ftp" \\
  -passwd "SecureP@ss123!" \\
  -home /

# 3. Set PHP version for the subscription
plesk bin domain --update "$DOMAIN" \\
  -php_handler_id "plesk-php\${PHP_VERSION}-fpm"

# 4. Install Let's Encrypt SSL certificate
plesk bin extension --exec letsencrypt cli.php \\
  -d "$DOMAIN" \\
  -d "www.$DOMAIN" \\
  --email "$EMAIL"

# 5. Force HTTPS redirect
plesk bin domain --update "$DOMAIN" \\
  -https_redirect true

# 6. Enable HTTP/2
plesk bin server_pref -u -apache-redirect-to-nginx true

# 7. Verify SSL certificate status
plesk bin certificate --list "$DOMAIN"`;

const wpToolkitCode = `#!/bin/bash
# Plesk WordPress Toolkit CLI — bulk management operations

# List all WordPress installations on the server
plesk ext wp-toolkit --list

# Update WordPress core on a specific installation
plesk ext wp-toolkit --update-core --instance-id 42

# Bulk update all plugins across ALL WordPress sites on the server
plesk ext wp-toolkit --update-plugins --all-instances

# Bulk update all themes
plesk ext wp-toolkit --update-themes --all-instances

# Check security status for all WP installations
plesk ext wp-toolkit --check-security --all-instances

# Enable maintenance mode before bulk updates
plesk ext wp-toolkit --maintenance-on --instance-id 42

# Apply security hardening recommendations
plesk ext wp-toolkit --fix-security --instance-id 42

# Create a backup before updates
plesk ext wp-toolkit --backup --instance-id 42 \\
  --backup-name "pre-update-$(date +%Y%m%d)"

# View last 50 lines of WordPress Toolkit log
tail -50 /var/log/plesk/wordpress-toolkit.log`;

const Plesk = () => {
  const [activeTab, setActiveTab] = useState('cli');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Plesk</h1>
        <p className={styles.heroTagline}>Server management panel for Linux and Windows hosting environments</p>
        <div className={styles.heroBadges}>
          {['Plesk Obsidian', 'WordPress Toolkit', 'SSL', 'DNS', 'Extensions', 'CLI'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            Plesk is the control panel for a portion of GoDaddy's Windows and Linux hosting fleet. I manage
            Plesk-based environments for both consumer and business hosting products — configuring subscriptions,
            installing SSL certificates via Let's Encrypt and manual uploads, managing DNS zones,
            and using WordPress Toolkit for bulk site management.
          </p>
          <p className={styles.sectionText}>
            The Plesk CLI (<code>plesk bin</code>) is essential for any operation that needs to be scripted or
            applied across multiple subscriptions. I've built shell scripts that automate new subscription provisioning,
            bulk SSL installation, and post-migration verification using the CLI.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Key Features I Work With</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>WordPress Toolkit</strong> — The most powerful feature for managed
            WordPress hosting. I use it to apply bulk updates across all WordPress installations on a server,
            check security scores, enable maintenance mode before updates, and create pre-update backups.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Let's Encrypt integration</strong> — Automated certificate provisioning
            and renewal for all domains on a subscription. I use the Plesk extension CLI to script certificate
            installation across new account setups.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Subscription management</strong> — Creating, modifying, and transferring
            subscriptions including PHP version selection, disk quota enforcement, and service plan assignment.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Use Plesk's WordPress Toolkit for bulk core/plugin updates across multiple sites.
            Running updates from the Toolkit's dashboard is dramatically safer than doing it per-site through
            the WordPress admin — it creates backups first and can roll back if something breaks.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — New Subscription Setup + WordPress Install</h2>
        <p className={styles.sectionText}>
          Setting up a new Plesk subscription with Let's Encrypt SSL, PHP 8.2, and bulk WordPress management commands.
          The CLI approach lets me script this as a repeatable onboarding workflow.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['cli', 'Subscription + SSL CLI'], ['wptk', 'WordPress Toolkit CLI']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>bash — plesk bin CLI</div>
          <SyntaxHighlighter language="bash" style={vscDarkPlus} showLineNumbers>
            {activeTab === 'cli' ? pleskCliCode : wpToolkitCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default Plesk;
