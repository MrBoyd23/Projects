import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const whmApiCode = `#!/bin/bash
# WHM API calls for scripted bulk account operations
# Uses WHM's JSON API v1 via curl with root credentials

WHM_HOST="server.example.com"
WHM_USER="root"
WHM_TOKEN="your_api_token_here"
API="https://$WHM_HOST:2087/json-api"

# 1. List all cPanel accounts on the server
curl -sk "$API/listaccts" \\
  -H "Authorization: whm $WHM_USER:$WHM_TOKEN" \\
  | python3 -m json.tool | grep -E '"user"|"domain"|"diskused"'

# 2. Create a new cPanel account
curl -sk "$API/createacct" \\
  -H "Authorization: whm $WHM_USER:$WHM_TOKEN" \\
  --data-urlencode "username=newclient" \\
  --data-urlencode "domain=newclient.com" \\
  --data-urlencode "password=SecureP@ss123!" \\
  --data-urlencode "plan=business" \\
  --data-urlencode "contactemail=newclient@example.com"

# 3. Suspend a compromised account
curl -sk "$API/suspendacct" \\
  -H "Authorization: whm $WHM_USER:$WHM_TOKEN" \\
  --data-urlencode "user=compromised_user" \\
  --data-urlencode "reason=Malware detected — account suspended pending review"

# 4. Check DNS zone for a domain
curl -sk "$API/dumpzone" \\
  -H "Authorization: whm $WHM_USER:$WHM_TOKEN" \\
  --data-urlencode "domain=example.com" \\
  | python3 -m json.tool`;

const pkgacctCode = `#!/bin/bash
# pkgacct / restorepkg — scriptable account backup and restore

SOURCE_SERVER="server1.example.com"
DEST_SERVER="server2.example.com"
ACCOUNT="migrating_user"
BACKUP_DIR="/home/cpbackups"

# 1. Package the account on the source server
ssh root@$SOURCE_SERVER "pkgacct $ACCOUNT $BACKUP_DIR"

# 2. Verify the backup was created
ssh root@$SOURCE_SERVER "ls -lh $BACKUP_DIR/cpmove-$ACCOUNT.tar.gz"

# 3. Transfer to destination server
rsync -avzP --progress \\
  root@$SOURCE_SERVER:$BACKUP_DIR/cpmove-$ACCOUNT.tar.gz \\
  /home/cpbackups/

# 4. Restore account on destination server
/scripts/restorepkg \\
  --allow-reseller \\
  --overwrite \\
  --skipres \\
  /home/cpbackups/cpmove-$ACCOUNT.tar.gz

# 5. Post-migration verification
# Verify account exists
whmapi1 listaccts search=$ACCOUNT searchtype=user | grep -A5 "acct:"

# Update nameservers in DNS (if not using WHM DNS cluster)
whmapi1 addzonerecord domain=newdomain.com \\
  name="@" type=A address="$NEW_IP"

# Test site with hosts file override before DNS propagation
curl -sk --resolve "$ACCOUNT.com:443:$NEW_IP" "https://$ACCOUNT.com/" | head -5`;

const CPanel = () => {
  const [activeTab, setActiveTab] = useState('api');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>cPanel / WHM</h1>
        <p className={styles.heroTagline}>The control panel behind millions of managed hosting accounts</p>
        <div className={styles.heroBadges}>
          {['WHM', 'cPanel', 'DNS', 'SSL', 'Backups', 'Email', 'MySQL', 'API'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            cPanel and WHM are core tools in the shared and managed hosting environments I support. I work in WHM
            daily — creating and terminating accounts, managing DNS zones, installing and renewing SSL certificates,
            configuring email routing and filtering rules, and running account backups before migrations or risky changes.
          </p>
          <p className={styles.sectionText}>
            The WHM API is where my work scales. Rather than clicking through the GUI for bulk operations, I write bash scripts
            using WHM's JSON API to perform actions across dozens of accounts at once — mass SSL installs, bulk account
            audits, and automated post-migration verification.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Key Operations</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Account management</strong> — Create, suspend, terminate, and transfer
            accounts using WHM GUI and <code>whmapi1</code> CLI. Bulk account audits using the API to identify accounts
            over disk quota, with suspended accounts, or with security flags.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>DNS management</strong> — Zone editing, TTL adjustments, MX record
            configuration for email providers, and DNS cluster management across multiple nameservers.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>SSL certificates</strong> — AutoSSL management, manual DV/OV certificate
            installation, troubleshooting certificate chain issues and mixed-content warnings.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Use WHM's <code>pkgacct</code> and <code>restorepkg</code> commands for scriptable
            account backups and restores. The Transfer Tool GUI is convenient, but the CLI gives you full control,
            better logging, and the ability to script multi-account migrations.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — Bulk Account Migration</h2>
        <p className={styles.sectionText}>
          Migrating accounts between servers is one of the most high-stakes operations in managed hosting. The scripts below
          show how I use the WHM API and <code>pkgacct</code>/<code>restorepkg</code> to automate and verify the migration workflow.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['api', 'WHM API calls'], ['migrate', 'pkgacct migration']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>bash — WHM CLI / API</div>
          <SyntaxHighlighter language="bash" style={vscDarkPlus} showLineNumbers>
            {activeTab === 'api' ? whmApiCode : pkgacctCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default CPanel;
