import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const vhostConfig = `# /etc/apache2/sites-available/example.com.conf
<VirtualHost *:80>
    ServerName  example.com
    ServerAlias www.example.com
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName  example.com
    DocumentRoot /var/www/example.com/public_html

    SSLEngine on
    SSLCertificateFile    /etc/letsencrypt/live/example.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/example.com/privkey.pem

    Header always set X-Content-Type-Options    "nosniff"
    Header always set X-Frame-Options           "SAMEORIGIN"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

    AddOutputFilterByType DEFLATE text/html text/css application/javascript

    ErrorDocument 404 /errors/404.html
    ErrorDocument 500 /errors/500.html

    <FilesMatch \\.php$>
        SetHandler "proxy:unix:/run/php/php8.1-fpm.sock|fcgi://localhost"
    </FilesMatch>

    ErrorLog  /var/log/apache2/example.com-error.log
    CustomLog /var/log/apache2/example.com-access.log combined
</VirtualHost>`;

const htaccessCode = `# .htaccess — SPA fallback + security hardening
Options -Indexes
ServerSignature Off

RewriteEngine On
RewriteBase /
RewriteRule ^index\\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Block common exploit probes
RewriteCond %{QUERY_STRING} (\\.\\./) [NC,OR]
RewriteCond %{QUERY_STRING} (etc/passwd) [NC]
RewriteRule .* - [F,L]

<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg   "access plus 1 year"
    ExpiresByType text/css    "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>`;

const dailyCmds = `# Test config before reload (always do this first)
apachectl configtest

# Reload without dropping connections
systemctl reload apache2

# Enable a new site
a2ensite example.com.conf && systemctl reload apache2

# Tail live error log
tail -f /var/log/apache2/error.log

# List loaded modules
apache2ctl -M | sort

# Find top IPs hitting the server
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -20`;

const sections = [
  { label: 'VirtualHost + SSL Config', lang: 'apacheconf', code: vhostConfig },
  { label: '.htaccess — SPA + Security', lang: 'apacheconf', code: htaccessCode },
];

const Apache = () => {
  const [active, setActive] = useState(null);

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Apache HTTP Server</h1>
        <p className={styles.heroTagline}>
          The backbone of large-scale shared hosting — and my daily workbench
        </p>
        <div className={styles.heroBadges}>
          {['mod_rewrite','mod_ssl','VirtualHost','PHP-FPM','.htaccess','mod_deflate'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            As a System Engineer III managing a 100,000+ server network, Apache is at the center of
            almost every hosting incident I touch. On any given shift I'm diagnosing 500/403 errors,
            reviewing error logs, tuning VirtualHost configurations, and applying security patches.
          </p>
          <p className={styles.sectionText}>
            I configure Virtual Hosts for new account migrations, set up PHP-FPM socket connections,
            manage SSL certificate installations, and write custom mod_rewrite rules to handle SPA
            routing or enforce HTTPS redirects. Quick access to the access and error logs is my first
            stop for any escalated server incident.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Key Commands</h2>
          <div className={styles.codeWrapper}>
            <div className={styles.codeLabel}>bash — daily commands</div>
            <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{margin:0,borderRadius:0}}>
              {dailyCmds}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — VirtualHost Migration with SSL</h2>
        <p className={styles.sectionText}>
          A customer was being migrated from a legacy shared server to a new CentOS 8 host.
          I needed to create a secure VirtualHost with HTTP→HTTPS enforcement, PHP-FPM integration,
          security headers, and SPA routing support for their React front-end — all before their DNS
          TTL expired and traffic swung over.
        </p>
        {sections.map(({ label, lang, code }, i) => (
          <div key={i} style={{ marginBottom: '12px' }}>
            <button onClick={() => setActive(active === i ? null : i)}>
              {active === i ? '▼ Hide' : '▶ Show'} {label}
            </button>
            {active === i && (
              <div className={styles.codeWrapper}>
                <div className={styles.codeLabel}>{label}</div>
                <SyntaxHighlighter language={lang} style={vscDarkPlus} customStyle={{margin:0,borderRadius:0}}>
                  {code}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        ))}
        <div className={styles.tipBox}>
          <strong>Pro Tip:</strong> Always run <code>apachectl configtest</code> before any reload.
          A syntax error in a VirtualHost config will silently break every site on that server —
          catching it beforehand has saved countless production incidents.
        </div>
      </div>
    </div>
  );
};

export default Apache;
