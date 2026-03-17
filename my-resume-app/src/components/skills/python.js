import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const diskMonitorCode = `#!/usr/bin/env python3
"""
disk_usage_report.py — Scan /var/www accounts and report oversized directories.
Runs daily via cron; outputs sorted report to stdout and sends alert if threshold exceeded.
"""
import os
import sys
import subprocess
from datetime import datetime

THRESHOLD_GB = 10.0
SCAN_ROOT = '/var/www'
ALERT_EMAIL = 'ops-team@company.com'


def get_dir_size_gb(path: str) -> float:
    """Return directory size in GB using du for accuracy."""
    try:
        result = subprocess.run(
            ['du', '-s', '--block-size=1G', path],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            size = int(result.stdout.split()[0])
            return float(size)
    except (subprocess.TimeoutExpired, ValueError, IndexError):
        pass
    return 0.0


def scan_accounts(root: str, threshold: float) -> list:
    """Scan all account directories under root and return oversized ones."""
    oversized = []
    try:
        accounts = [
            d for d in os.listdir(root)
            if os.path.isdir(os.path.join(root, d))
        ]
    except PermissionError as e:
        print(f"ERROR: Cannot read {root}: {e}", file=sys.stderr)
        return oversized

    for account in sorted(accounts):
        account_path = os.path.join(root, account)
        size_gb = get_dir_size_gb(account_path)
        if size_gb >= threshold:
            oversized.append({'account': account, 'path': account_path, 'size_gb': size_gb})

    return sorted(oversized, key=lambda x: x['size_gb'], reverse=True)


def main():
    print(f"Disk Usage Report — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Scan root: {SCAN_ROOT} | Threshold: {THRESHOLD_GB} GB")
    print("-" * 60)

    oversized = scan_accounts(SCAN_ROOT, THRESHOLD_GB)

    if not oversized:
        print("No accounts exceed the threshold.")
        return

    for entry in oversized:
        print(f"  {entry['size_gb']:6.1f} GB  {entry['account']:<30}  {entry['path']}")

    print(f"\nTotal oversized accounts: {len(oversized)}")

    if len(oversized) > 5:
        subprocess.run([
            'mail', '-s',
            f'[ALERT] {len(oversized)} accounts over {THRESHOLD_GB}GB on {os.uname().nodename}',
            ALERT_EMAIL
        ], input='\n'.join(f"{e['size_gb']:.1f}GB {e['account']}" for e in oversized),
           text=True)


if __name__ == '__main__':
    main()`;

const subprocessCode = `#!/usr/bin/env python3
"""
server_health_check.py — Run shell commands from Python and parse output.
Demonstrates subprocess patterns used in automation scripts.
"""
import subprocess
import json
import re
from typing import Optional


def run_command(cmd: list, timeout: int = 30) -> tuple[int, str, str]:
    """Run a shell command and return (returncode, stdout, stderr)."""
    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        timeout=timeout
    )
    return result.returncode, result.stdout.strip(), result.stderr.strip()


def get_cpu_usage() -> Optional[float]:
    """Parse CPU idle % from vmstat and return usage %."""
    rc, out, _ = run_command(['vmstat', '1', '2'])
    if rc != 0:
        return None
    lines = out.strip().split('\n')
    if len(lines) >= 4:
        idle = int(lines[-1].split()[14])
        return 100.0 - idle
    return None


def get_memory_usage() -> dict:
    """Return memory stats as a dict."""
    rc, out, _ = run_command(['free', '-m'])
    if rc != 0:
        return {}
    lines = out.split('\n')
    mem_line = lines[1].split()
    return {
        'total_mb': int(mem_line[1]),
        'used_mb': int(mem_line[2]),
        'free_mb': int(mem_line[3]),
        'pct_used': round(int(mem_line[2]) / int(mem_line[1]) * 100, 1)
    }


def check_service(service: str) -> str:
    """Return 'active', 'inactive', or 'unknown' for a systemd service."""
    rc, out, _ = run_command(['systemctl', 'is-active', service])
    return out if rc == 0 else 'inactive'


def main():
    services = ['nginx', 'php8.2-fpm', 'mysql', 'sshd']
    report = {
        'cpu_pct': get_cpu_usage(),
        'memory': get_memory_usage(),
        'services': {s: check_service(s) for s in services}
    }
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()`;

const Python = () => {
  const [activeTab, setActiveTab] = useState('disk');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Python</h1>
        <p className={styles.heroTagline}>Automation scripting to reduce manual toil across large server fleets</p>
        <div className={styles.heroBadges}>
          {['Python 3', 'os/sys', 'subprocess', 'requests', 'cron', 'automation'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            Python is my primary scripting language for anything beyond simple one-liners. I use it to write automation scripts
            for log parsing, disk usage monitoring, API integrations, and bulk file operations across server fleets.
            Python replaced many of my bash scripts for anything requiring complex logic, data structures, or external API calls.
          </p>
          <p className={styles.sectionText}>
            I use Python for incident data aggregation — pulling metrics from multiple sources, correlating events, and generating
            structured reports. The <code>subprocess</code> module lets me run shell commands from Python scripts while keeping
            the benefits of Python's data manipulation capabilities.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Automation Use Cases</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Log parsing</strong> — Regular expressions against Apache/PHP/MySQL logs to
            extract error patterns, count occurrences by type, and generate daily summaries sent to the team.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>API integrations</strong> — Using <code>requests</code> to query the
            ServiceNow REST API for ticket data, the GitHub API for deployment tracking, and Prometheus for metric
            snapshots during incident post-mortems.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Bulk operations</strong> — Scripts that iterate over thousands of cPanel
            accounts, check specific file conditions, and apply changes — operations that would take hours manually.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Use virtual environments (<code>python3 -m venv .venv</code>) even for small scripts.
            It avoids dependency conflicts with system Python and ensures your script runs consistently across servers
            with different package versions.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — Disk Usage Monitor + subprocess Patterns</h2>
        <p className={styles.sectionText}>
          These are patterns I use regularly: a disk usage scanner that identifies oversized hosting accounts and alerts the ops team,
          and a health check script demonstrating how I use <code>subprocess</code> to run shell commands from Python
          and parse their output into structured data.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['disk', 'Disk usage report'], ['subprocess', 'subprocess patterns']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>python3</div>
          <SyntaxHighlighter language="python" style={vscDarkPlus} showLineNumbers>
            {activeTab === 'disk' ? diskMonitorCode : subprocessCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default Python;
