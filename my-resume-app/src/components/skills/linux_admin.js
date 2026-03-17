import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const cpuDiagCode = `#!/bin/bash
# Production server at 100% CPU — full diagnostic sequence
# Goal: identify the offending process without taking the server down

echo "=== STEP 1: Quick overview — top 10 CPU consumers ==="
ps aux --sort=-%cpu | head -11

echo ""
echo "=== STEP 2: Interactive top — sort by CPU (press P) ==="
# top -bn1 for non-interactive snapshot
top -bn1 -o %CPU | head -20

echo ""
echo "=== STEP 3: Identify the PID and what it's doing ==="
HIGH_CPU_PID=$(ps aux --sort=-%cpu | awk 'NR==2{print $2}')
echo "Highest CPU PID: $HIGH_CPU_PID"

# Show full command line
cat /proc/$HIGH_CPU_PID/cmdline | tr '\\0' ' '; echo

# Show open files for this process
echo "Open files:"
lsof -p $HIGH_CPU_PID | head -20

# Show network connections
echo "Network connections:"
ss -tp | grep "pid=$HIGH_CPU_PID"

echo ""
echo "=== STEP 4: Check what the process is doing with strace ==="
# Attach strace briefly — interrupt after 3 seconds
timeout 3 strace -p $HIGH_CPU_PID -e trace=all -c 2>&1 || true

echo ""
echo "=== STEP 5: Check journal logs for this process ==="
journalctl _PID=$HIGH_CPU_PID --since "30 min ago" --no-pager | tail -30

echo ""
echo "=== STEP 6: Check system load and context switches ==="
vmstat 1 5
mpstat -P ALL 1 3`;

const serviceManagementCode = `# systemd service management — daily operations

# Check service status with recent logs
systemctl status nginx php8.2-fpm mysql --no-pager

# Restart a service gracefully
systemctl restart nginx

# Reload config without restart (nginx, apache)
systemctl reload nginx
systemctl reload apache2

# View service logs — structured, with timestamps
journalctl -u nginx --since "1 hour ago" --no-pager
journalctl -u php8.2-fpm -f    # follow in real time
journalctl -u mysql --since today --priority=err

# Check failed services
systemctl --failed

# Mask a service (prevent any start, even by dependencies)
systemctl mask apache2

# Enable service to start on boot
systemctl enable --now node_exporter

# Check all services and their resource usage
systemctl list-units --type=service --state=running

# Emergency: kill all processes of a service
systemctl kill --signal=SIGKILL nginx`;

const firewallCode = `# iptables / nftables firewall management

# --- iptables (legacy, still common on older systems) ---

# List current rules with line numbers
iptables -L INPUT -n -v --line-numbers

# Allow specific IP to access port 3306 (MySQL)
iptables -A INPUT -s 203.0.113.10 -p tcp --dport 3306 -j ACCEPT

# Block an IP address (DDoS mitigation)
iptables -I INPUT 1 -s 198.51.100.0/24 -j DROP

# Rate limit SSH to prevent brute force (10 attempts per minute)
iptables -A INPUT -p tcp --dport 22 -m state --state NEW \\
  -m recent --set --name SSH
iptables -A INPUT -p tcp --dport 22 -m state --state NEW \\
  -m recent --update --seconds 60 --hitcount 10 \\
  --name SSH -j DROP

# Save rules (persist across reboots)
iptables-save > /etc/iptables/rules.v4

# --- nftables (modern replacement) ---
# List all rules
nft list ruleset

# Add a rule to block an IP
nft add rule ip filter INPUT ip saddr 198.51.100.42 drop

# Add rate limiting for SSH
nft add rule ip filter INPUT \\
  tcp dport 22 ct state new \\
  limit rate over 10/minute \\
  drop`;

const Linux_Admin = () => {
  const [activeTab, setActiveTab] = useState('cpu');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Linux Admin</h1>
        <p className={styles.heroTagline}>The command line is my office — Linux is where all the work happens</p>
        <div className={styles.heroBadges}>
          {['systemctl', 'iptables', 'htop', 'journalctl', 'cron', 'SSH', 'LVM', 'SELinux'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            Linux is the foundation of everything I do. My workday begins and ends at a terminal. I manage services
            with <code>systemctl</code>, review structured logs with <code>journalctl</code>, monitor processes with
            <code> htop</code> and <code>top</code>, manage users and permissions, write cron jobs, configure
            <code> iptables</code>/<code>nftables</code> firewall rules, manage LVM volumes, and harden SSH access.
          </p>
          <p className={styles.sectionText}>
            I work primarily on RHEL/CentOS and Ubuntu/Debian variants across GoDaddy's infrastructure. The specific
            distro matters less than understanding the underlying systems — init system, package manager, filesystem
            hierarchy, and networking stack.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>RHEL</div>
              <div className={styles.statLabel}>Primary Distro</div>
            </div>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>Ubuntu</div>
              <div className={styles.statLabel}>Also Common</div>
            </div>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>systemd</div>
              <div className={styles.statLabel}>Init System</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Core Competencies</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Process management</strong> — <code>ps</code>, <code>top</code>,
            <code> htop</code>, <code>lsof</code>, <code>strace</code>, <code>kill</code>/<code>pkill</code>.
            Identifying runaway processes, zombie processes, and memory leaks without rebooting.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Log analysis</strong> — <code>journalctl</code> for systemd services,
            <code> tail -f</code> for real-time monitoring, <code>grep</code>/<code>awk</code>/<code>sed</code>
            for log parsing. Correlating events across multiple log sources during incident timelines.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>LVM management</strong> — Extending logical volumes without downtime,
            creating snapshots before risky operations, managing VG/PV allocation.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Always use <code>journalctl -u service-name --since "1 hour ago"</code> instead
            of raw log files for systemd services. The structured output with timestamps is far easier to correlate
            with incident timelines — and you get log level filtering, boot boundaries, and persistent storage automatically.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — 100% CPU Incident Diagnosis</h2>
        <p className={styles.sectionText}>
          A production server hits 100% CPU. Customer sites are responding slowly. The full diagnostic sequence —
          from initial <code>ps</code> snapshot through <code>strace</code> analysis — that I follow to identify
          the cause and remediate without taking the server offline.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['cpu', 'CPU diagnosis'], ['services', 'Service management'], ['firewall', 'Firewall rules']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>bash — {activeTab === 'cpu' ? 'CPU incident diagnosis' : activeTab === 'services' ? 'systemd / journalctl' : 'iptables / nftables'}</div>
          <SyntaxHighlighter language="bash" style={vscDarkPlus} showLineNumbers>
            {activeTab === 'cpu' ? cpuDiagCode : activeTab === 'services' ? serviceManagementCode : firewallCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default Linux_Admin;
