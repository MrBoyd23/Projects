import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const mixedContentFixCode = `# Diagnosing and fixing mixed content on a WooCommerce checkout

# Step 1: Verify SSL is active and certificate is valid
curl -I https://store.example.com/checkout/ | grep -E "HTTP|Strict"
openssl s_client -connect store.example.com:443 -servername store.example.com 2>/dev/null | grep "Verify return code"

# Step 2: Check browser console (from DevTools) — look for:
# Mixed Content: The page was loaded over HTTPS but requested insecure resource

# Step 3: Check wp_options for HTTP siteurl/home (most common cause)
wp option get siteurl
wp option get home

# Fix: Update to HTTPS
wp option update siteurl 'https://store.example.com'
wp option update home 'https://store.example.com'

# Step 4: Search-replace HTTP in database (handles serialized data correctly)
wp search-replace 'http://store.example.com' 'https://store.example.com' \\
  --all-tables \\
  --precise \\
  --report-changed-only

# Step 5: Force HTTPS in .htaccess
cat >> /var/www/html/store/.htaccess << 'EOF'
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
EOF

# Step 6: Enable WooCommerce force-SSL checkout setting via WP-CLI
wp option update woocommerce_force_ssl_checkout 'yes'

# Step 7: Flush all caches
wp cache flush
wp transient delete --all`;

const cspHeadersCode = `# Content Security Policy and security headers for e-commerce
# Add to .htaccess or Nginx config — critical for PCI-DSS compliance

# Apache .htaccess
<IfModule mod_headers.c>
  # Strict Transport Security (HSTS) — 1 year, include subdomains
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

  # Content Security Policy — allow Stripe iframe
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com; frame-src 'self' https://js.stripe.com; connect-src 'self' https://api.stripe.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"

  # Prevent clickjacking
  Header always set X-Frame-Options "SAMEORIGIN"

  # Prevent MIME type sniffing
  Header always set X-Content-Type-Options "nosniff"

  # Referrer policy (don't leak checkout URLs to third parties)
  Header always set Referrer-Policy "strict-origin-when-cross-origin"

  # Permissions policy — disable unnecessary APIs
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>

# Verify headers are in place:
# curl -I https://store.example.com | grep -E "Strict|Content-Security|X-Frame"`;

const pciChecklistCode = `# PCI-DSS compliance checklist — server-level requirements
# For hosted WooCommerce/Magento stores processing card payments

# 1. Verify TLS version (must be TLS 1.2 or 1.3, NO TLS 1.0/1.1)
openssl s_client -connect store.example.com:443 -tls1 2>&1 | grep "handshake failure"
# Should fail — TLS 1.0 should be disabled
nmap --script ssl-enum-ciphers -p 443 store.example.com | grep -E "TLSv|Grade"

# 2. Check for exposed admin paths (should require IP restriction)
curl -o /dev/null -s -w "%{http_code}" https://store.example.com/wp-admin/
# Should return 302 (redirect to login) or 403 (blocked by IP)

# 3. Verify phpMyAdmin is not publicly accessible
curl -o /dev/null -s -w "%{http_code}" https://store.example.com/phpmyadmin/
# Must return 403 or 404

# 4. Check for directory listing (must be disabled)
curl -o /dev/null -s -w "%{http_code}" https://store.example.com/wp-content/uploads/
# Should return 403, not 200 with a file listing

# 5. Verify xmlrpc.php is disabled (common attack vector)
curl -s -o /dev/null -w "%{http_code}" https://store.example.com/xmlrpc.php
# Should return 403

# 6. Check file permissions on wp-config.php
stat /var/www/html/store/wp-config.php | grep Access
# Should be 600 (owner read/write only)

# 7. Verify no card data in server logs
grep -i "card\\|cvv\\|4[0-9]\\{15\\}" /var/log/apache2/access.log | head -5
# Should return nothing — card data must never appear in logs`;

const ECommerce = () => {
  const [activeTab, setActiveTab] = useState('mixed');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>ECommerce</h1>
        <p className={styles.heroTagline}>Keeping online stores running, secure, and converting</p>
        <div className={styles.heroBadges}>
          {['WooCommerce', 'Magento', 'SSL/TLS', 'Payment Gateways', 'PCI-DSS', 'Performance'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            E-commerce support escalations are some of the most urgent tickets I handle — a broken checkout directly
            costs the customer revenue by the minute. I troubleshoot checkout failures, fix SSL/mixed-content issues
            that block payment gateways, optimize site performance for conversion rates, and ensure PCI-DSS compliance
            requirements are met at the server level.
          </p>
          <p className={styles.sectionText}>
            I work primarily with WooCommerce on WordPress, and occasionally with Magento 2 on dedicated hosting.
            My server-side focus means I address the infrastructure issues that plugin-based solutions can't fix:
            TLS configuration, security headers, cache tuning, database performance, and file permission hardening.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Most Common E-Commerce Incidents</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Broken checkout / Stripe iframe not loading</strong> — Mixed content
            (HTTP resources on an HTTPS page) is the #1 cause. The Stripe payment iframe requires the entire page to
            be HTTPS. The fix is almost always a WordPress <code>siteurl</code>/<code>home</code> option pointing to HTTP.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Slow checkout performance</strong> — WooCommerce sessions hammering
            the database, missing database indexes on <code>wp_woocommerce_sessions</code>, or unoptimized cart
            fragment AJAX calls causing excessive server load.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>PCI compliance failures</strong> — TLS 1.0/1.1 still enabled,
            exposed admin paths, weak cipher suites. I harden these as part of migration and security review workflows.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Mixed content (HTTP resources on an HTTPS page) is the #1 cause of broken
            payment gateways. Use browser DevTools Console to spot them instantly — they show as red Mixed Content warnings.
            The fix is almost always a WordPress <code>siteurl</code>/<code>home</code> option pointing to HTTP instead of HTTPS.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — "Checkout Is Broken" Investigation</h2>
        <p className={styles.sectionText}>
          Customer reports Stripe payment iframe not loading on checkout. Mixed content warning is blocking it.
          Full diagnostic and fix workflow, security headers, and PCI compliance checks.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['mixed', 'Mixed content fix'], ['csp', 'Security headers (CSP)'], ['pci', 'PCI-DSS checklist']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>bash — {activeTab === 'mixed' ? 'WooCommerce HTTPS fix' : activeTab === 'csp' ? 'security headers' : 'PCI compliance checks'}</div>
          <SyntaxHighlighter language="bash" style={vscDarkPlus} showLineNumbers>
            {activeTab === 'mixed' ? mixedContentFixCode : activeTab === 'csp' ? cspHeadersCode : pciChecklistCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default ECommerce;
