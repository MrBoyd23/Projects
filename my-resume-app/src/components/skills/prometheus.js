import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const scrapeConfigCode = `# prometheus.yml — scrape configuration for adding new servers

global:
  scrape_interval: 60s
  evaluation_interval: 60s
  scrape_timeout: 10s
  external_labels:
    cluster: 'prod-us-west'
    region: 'us-west-2'

# Load alerting rules
rule_files:
  - /etc/prometheus/rules/*.yml

# Alertmanager target
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

scrape_configs:
  # Node exporter — system metrics from all Linux servers
  - job_name: 'node_exporter'
    scrape_interval: 60s
    static_configs:
      - targets:
          - 'web01.prod:9100'
          - 'web02.prod:9100'
          - 'db01.prod:9100'
          - 'db02.prod:9100'
        labels:
          team: 'systems-eng'
          env: 'production'

  # Service discovery via file — new servers auto-added
  - job_name: 'node_exporter_sd'
    file_sd_configs:
      - files:
          - '/etc/prometheus/targets/*.json'
        refresh_interval: 30s

  # MySQL exporter
  - job_name: 'mysql_exporter'
    static_configs:
      - targets: ['db01.prod:9104', 'db02.prod:9104']
        labels:
          team: 'systems-eng'

  # PHP-FPM exporter (custom)
  - job_name: 'php_fpm'
    static_configs:
      - targets: ['web01.prod:9253', 'web02.prod:9253']`;

const nodeExporterCode = `#!/bin/bash
# onboard_server.sh — Deploy node_exporter on a new Linux server
# Part of the server provisioning runbook at GoDaddy

SERVER="$1"
NODE_EXPORTER_VERSION="1.7.0"
PROM_SERVER="prometheus.internal:9090"

if [[ -z "$SERVER" ]]; then
  echo "Usage: $0 <hostname-or-ip>"
  exit 1
fi

echo "==> Deploying node_exporter $NODE_EXPORTER_VERSION to $SERVER"

ssh root@"$SERVER" bash -s << 'ENDSSH'
  set -euo pipefail

  VERSION="1.7.0"
  ARCH="linux-amd64"
  URL="https://github.com/prometheus/node_exporter/releases/download/v\${VERSION}/node_exporter-\${VERSION}.\${ARCH}.tar.gz"

  # Download and install
  cd /tmp
  curl -sLO "$URL"
  tar -xzf "node_exporter-\${VERSION}.\${ARCH}.tar.gz"
  install -m 755 "node_exporter-\${VERSION}.\${ARCH}/node_exporter" /usr/local/bin/

  # Create system user
  useradd -rs /bin/false node_exporter 2>/dev/null || true

  # Create systemd service
  cat > /etc/systemd/system/node_exporter.service << 'EOF'
[Unit]
Description=Prometheus Node Exporter
After=network.target

[Service]
User=node_exporter
Group=node_exporter
ExecStart=/usr/local/bin/node_exporter \\
  --collector.systemd \\
  --collector.processes \\
  --web.listen-address=:9100
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  systemctl enable --now node_exporter
  echo "node_exporter started: $(systemctl is-active node_exporter)"
ENDSSH

# Add to Prometheus file service discovery
echo "==> Registering $SERVER in Prometheus targets"
cat >> /etc/prometheus/targets/prod.json << EOF
[{"targets": ["\${SERVER}:9100"], "labels": {"env": "production"}}]
EOF

# Reload Prometheus config (no restart needed)
curl -s -X POST "$PROM_SERVER/-/reload"
echo "==> Done. Verify: curl http://$SERVER:9100/metrics | head -20"`;

const alertRulesCode = `# /etc/prometheus/rules/server-alerts.yml
# Alert rules for server health — evaluated every 60 seconds

groups:
  - name: server.health
    interval: 60s
    rules:

      # High CPU — sustained above 90% for 5 minutes
      - alert: HighCPUUsage
        expr: >
          100 - (avg by (instance)
          (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 90
        for: 5m
        labels:
          severity: warning
          team: systems-eng
        annotations:
          summary: "High CPU on {{ $labels.instance }}"
          description: >
            CPU usage on {{ $labels.instance }} is {{ $value | printf "%.1f" }}%
            (threshold: 90%). Sustained for 5+ minutes.
          runbook: "https://wiki.internal/runbooks/high-cpu"

      # Critical CPU — above 98% for 2 minutes
      - alert: CriticalCPUUsage
        expr: >
          100 - (avg by (instance)
          (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 98
        for: 2m
        labels:
          severity: critical
          team: systems-eng
        annotations:
          summary: "CRITICAL CPU on {{ $labels.instance }}"
          description: "CPU at {{ $value | printf "%.1f" }}% on {{ $labels.instance }}"

      # Low memory — less than 500MB available
      - alert: LowMemory
        expr: node_memory_MemAvailable_bytes < 500 * 1024 * 1024
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Low memory on {{ $labels.instance }}"
          description: >
            Only {{ $value | humanize }}B available on {{ $labels.instance }}.

      # Disk almost full — root filesystem over 85%
      - alert: DiskSpaceWarning
        expr: >
          100 * (1 - (node_filesystem_avail_bytes{mountpoint="/"}
          / node_filesystem_size_bytes{mountpoint="/"})) > 85
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Disk space warning on {{ $labels.instance }}"
          description: "Root filesystem {{ $value | printf "%.1f" }}% full."

      # Node down — target unreachable
      - alert: NodeDown
        expr: up{job="node_exporter"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Node unreachable: {{ $labels.instance }}"`;

const recordingRulesCode = `# /etc/prometheus/rules/recording-rules.yml
# Pre-compute expensive queries to reduce dashboard load

groups:
  - name: node.recording
    interval: 60s
    rules:

      # Pre-compute CPU usage per instance
      - record: instance:node_cpu_utilization:rate5m
        expr: >
          100 - (avg by (instance)
          (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

      # Pre-compute memory usage percentage
      - record: instance:node_memory_utilization:ratio
        expr: >
          1 - (node_memory_MemAvailable_bytes
          / node_memory_MemTotal_bytes)

      # Pre-compute disk utilization per mountpoint
      - record: instance:node_disk_utilization:ratio
        expr: >
          1 - (node_filesystem_avail_bytes
          / node_filesystem_size_bytes)

      # Network throughput in Mbps
      - record: instance:node_network_receive_mbps:rate5m
        expr: >
          rate(node_network_receive_bytes_total{device!="lo"}[5m])
          * 8 / 1000000`;

const Prometheus = () => {
  const [activeTab, setActiveTab] = useState('scrape');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Prometheus</h1>
        <p className={styles.heroTagline}>Pull-based metrics collection powering observability across the server fleet</p>
        <div className={styles.heroBadges}>
          {['PromQL', 'node_exporter', 'Alertmanager', 'scrape_configs', 'Recording Rules'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            Prometheus is the metrics backbone behind GoDaddy's observability platform. I manage scrape configurations
            to onboard new servers as they're provisioned, write PromQL queries for SLO monitoring and incident analysis,
            configure Alertmanager routing rules to ensure alerts reach the right teams, and maintain recording rules
            to pre-compute expensive queries that run frequently in dashboards.
          </p>
          <p className={styles.sectionText}>
            Deploying <code>node_exporter</code> on new servers is part of our provisioning runbook — I've scripted
            the full onboarding process so a new server is emitting metrics within minutes of being added to the fleet.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Architecture Overview</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Scrape model</strong> — Prometheus polls targets (node_exporter,
            mysql_exporter, custom exporters) at configurable intervals. File-based service discovery means new servers
            auto-appear in monitoring without restarting Prometheus.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Alert pipeline</strong> — Prometheus evaluates alert rules every 60s,
            fires to Alertmanager, which deduplicates and routes to PagerDuty/Slack based on severity and team labels.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Recording rules</strong> — Pre-computed expressions stored as new metrics.
            Critical for dashboards that query 100K+ time series — a recording rule reduces query time from seconds to milliseconds.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Use recording rules for any PromQL query that runs frequently. Pre-computed rules
            dramatically reduce query load on Prometheus and make dashboards load faster — especially for fleet-wide
            aggregations across tens of thousands of instances.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — Server Onboarding + Alert Rules</h2>
        <p className={styles.sectionText}>
          The configs below cover the full Prometheus stack I work with: scrape config for new servers, the node_exporter
          onboarding script, alert rules for server health, and recording rules for performance.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['scrape', 'prometheus.yml'], ['onboard', 'onboard_server.sh'], ['alerts', 'alert rules'], ['recording', 'recording rules']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>
            {activeTab === 'scrape' ? 'yaml — prometheus.yml' : activeTab === 'onboard' ? 'bash — onboarding script' : 'yaml — rules'}
          </div>
          <SyntaxHighlighter
            language={activeTab === 'onboard' ? 'bash' : 'yaml'}
            style={vscDarkPlus}
            showLineNumbers
          >
            {activeTab === 'scrape' ? scrapeConfigCode : activeTab === 'onboard' ? nodeExporterCode : activeTab === 'alerts' ? alertRulesCode : recordingRulesCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default Prometheus;
