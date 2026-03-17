import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const promqlCode = `# PromQL queries used in Grafana dashboards for server health monitoring

# --- CPU Usage ---
# CPU usage percentage per server (excluding idle)
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# CPU usage > 90% for more than 5 minutes (alert threshold)
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 90

# Top 10 highest CPU servers in the fleet
topk(10, 100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100))

# --- Memory Pressure ---
# Memory usage percentage
100 * (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes))

# Memory available in GB
node_memory_MemAvailable_bytes / 1024 / 1024 / 1024

# Servers with less than 500MB available RAM
node_memory_MemAvailable_bytes < 500 * 1024 * 1024

# --- Disk I/O ---
# Disk read throughput (bytes/sec)
rate(node_disk_read_bytes_total{device!~"loop.*"}[5m])

# Disk write throughput (bytes/sec)
rate(node_disk_written_bytes_total{device!~"loop.*"}[5m])

# Disk usage percentage (root filesystem)
100 * (1 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}))

# --- Network ---
# Inbound network throughput (Mbps)
rate(node_network_receive_bytes_total{device!="lo"}[5m]) * 8 / 1000000

# Outbound network throughput (Mbps)
rate(node_network_transmit_bytes_total{device!="lo"}[5m]) * 8 / 1000000`;

const dashboardJsonCode = `// Grafana dashboard panel JSON — CPU Usage Time Series
// Import via Grafana UI: Dashboards > Import > Paste JSON
{
  "type": "timeseries",
  "title": "CPU Usage % — All Servers",
  "gridPos": { "h": 8, "w": 12, "x": 0, "y": 0 },
  "datasource": { "type": "prometheus", "uid": "prometheus" },
  "targets": [
    {
      "expr": "100 - (avg by (instance) (rate(node_cpu_seconds_total{mode=\\"idle\\"}[5m])) * 100)",
      "legendFormat": "{{instance}}",
      "refId": "A"
    }
  ],
  "fieldConfig": {
    "defaults": {
      "color": { "mode": "palette-classic" },
      "custom": {
        "lineWidth": 2,
        "fillOpacity": 10,
        "showPoints": "never"
      },
      "unit": "percent",
      "min": 0,
      "max": 100,
      "thresholds": {
        "mode": "absolute",
        "steps": [
          { "color": "green", "value": null },
          { "color": "yellow", "value": 70 },
          { "color": "red", "value": 90 }
        ]
      }
    }
  },
  "options": {
    "tooltip": { "mode": "multi", "sort": "desc" },
    "legend": { "displayMode": "list", "placement": "bottom" }
  }
}`;

const alertRuleCode = `# Grafana alert rule — High CPU (unified alerting)
# Configured in Grafana UI: Alerting > Alert Rules > New Alert Rule

apiVersion: 1
groups:
  - orgId: 1
    name: server-health
    folder: Infrastructure
    interval: 1m
    rules:
      - uid: high-cpu-alert
        title: High CPU Usage
        condition: C
        data:
          - refId: A
            queryType: ''
            relativeTimeRange:
              from: 300
              to: 0
            datasourceUid: prometheus
            model:
              expr: >
                100 - (avg by (instance)
                (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
              intervalMs: 1000
              maxDataPoints: 43200
              refId: A
          - refId: C
            queryType: ''
            relativeTimeRange:
              from: 300
              to: 0
            datasourceUid: __expr__
            model:
              conditions:
                - evaluator:
                    params: [90]
                    type: gt
                  operator: { type: and }
                  query: { params: [A] }
                  reducer:
                    params: []
                    type: last
              refId: C
              type: classic_conditions
        noDataState: NoData
        execErrState: Error
        for: 5m
        annotations:
          description: >
            Server {{ $labels.instance }} CPU has been above 90%
            for more than 5 minutes. Current value: {{ $values.A }}%
          summary: High CPU on {{ $labels.instance }}
        labels:
          severity: warning
          team: systems-eng`;

const Grafana = () => {
  const [activeTab, setActiveTab] = useState('promql');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Grafana</h1>
        <p className={styles.heroTagline}>Building real-time visibility dashboards across a 100,000+ server fleet</p>
        <div className={styles.heroBadges}>
          {['Grafana', 'PromQL', 'Dashboards', 'Alerting', 'Time Series', 'Panels'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            Grafana is my primary observability tool. I build and maintain dashboards that visualize server metrics
            — CPU, memory, disk, and network — sourced from Prometheus via PromQL. During incidents, Grafana is the
            first place I look to correlate a spike in errors with an underlying resource constraint.
          </p>
          <p className={styles.sectionText}>
            I create per-team dashboards, configure threshold-based alerts with proper routing to PagerDuty, and
            use PromQL to write custom metric queries for SLO monitoring. I also use Grafana's Explore view for
            ad-hoc metric queries during incident response — faster than building a panel when you need answers immediately.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>100K+</div>
              <div className={styles.statLabel}>Monitored Servers</div>
            </div>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>1m</div>
              <div className={styles.statLabel}>Scrape Interval</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Dashboard Design Principles</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Signal over noise</strong> — A dashboard with 40 panels is worthless.
            I design dashboards around questions: "Is this server healthy right now?" Key metrics front and center,
            details available on drill-down.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Thresholds as context</strong> — Every metric panel has green/yellow/red
            thresholds so operators can read health status at a glance without knowing the underlying numbers.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Templating for scale</strong> — Dashboard variables allow a single
            dashboard to display any server, region, or cluster. One dashboard design serves the entire fleet.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Use Grafana's "Explore" view for ad-hoc metric queries during incidents —
            it's faster than building a panel when you need answers quickly. Save the good queries as dashboard panels
            after the incident so the next engineer has them ready.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — Server Health Dashboard</h2>
        <p className={styles.sectionText}>
          The PromQL queries, panel JSON, and alert rule below are representative of what I build and maintain
          for the fleet monitoring dashboards.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['promql', 'PromQL queries'], ['panel', 'Panel JSON'], ['alert', 'Alert rule YAML']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>
            {activeTab === 'promql' ? 'promql' : activeTab === 'panel' ? 'json — grafana panel' : 'yaml — alert rule'}
          </div>
          <SyntaxHighlighter
            language={activeTab === 'promql' ? 'bash' : activeTab === 'panel' ? 'json' : 'yaml'}
            style={vscDarkPlus}
            showLineNumbers
          >
            {activeTab === 'promql' ? promqlCode : activeTab === 'panel' ? dashboardJsonCode : alertRuleCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default Grafana;
