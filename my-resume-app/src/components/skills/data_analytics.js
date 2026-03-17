import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const splunkSplCode = `| --- SPL: Identify and correlate PHP 500 error wave --- |

| Search 1: Extract 500 error counts per server over time
index=apache_logs sourcetype=access_combined status=500
| timechart span=5m count AS error_count by host
| where error_count > 100
| sort - error_count

| Search 2: Extract PHP error types from error log
index=php_errors sourcetype=php_error
| rex field=_raw "PHP (?P<error_type>Fatal error|Warning|Notice): (?P<error_msg>[^\\n]+) in (?P<file_path>[^ ]+)"
| stats count AS occurrences by error_type, error_msg, file_path
| sort - occurrences
| head 20

| Search 3: Trending — error rate over 24 hours by server
index=apache_logs sourcetype=access_combined status=500
| bucket _time span=1h
| stats count AS errors by _time, host
| streamstats window=3 avg(errors) AS rolling_avg by host
| where errors > (rolling_avg * 2)   | Spike detection: 2x above rolling avg
| table _time, host, errors, rolling_avg

| Search 4: Correlate with deployment events
index=deployments OR index=apache_logs
| eval event_type=if(index="deployments", "DEPLOY", "ERROR")
| stats count AS cnt by _time, event_type, host
| timechart span=10m sum(cnt) AS count by event_type
| rename COMMENT AS "Look for error spike after deploy event"

| Search 5: Identify which plugin caused the errors
index=php_errors sourcetype=php_error "Fatal error"
| rex field=_raw "in (?P<file_path>/var/www/[^/]+/wp-content/plugins/(?P<plugin_name>[^/]+)/)"
| stats count by plugin_name
| sort - count

| Search 6: Production dashboard — 500 error rate alert
| mstats avg(http.status_5xx_count) AS error_rate
    WHERE index=metrics app=apache span=5m
| where error_rate > 50
| eval severity=case(error_rate>500, "CRITICAL", error_rate>100, "WARNING", true(), "INFO")
| table _time, host, error_rate, severity`;

const splunkAlertCode = `| --- Splunk saved searches and alert configuration --- |

| Alert 1: PHP 500 spike detection (saved search → alert)
| Name: "PHP 500 Error Spike"
| Schedule: Every 5 minutes
| Search:
index=apache_logs status=500 earliest=-10m
| stats count AS errors_10m by host
| where errors_10m > 200
| join host [
    search index=apache_logs status=500 earliest=-60m latest=-10m
    | stats count AS errors_baseline by host
  ]
| eval pct_increase=round((errors_10m - errors_baseline) / errors_baseline * 100, 1)
| where pct_increase > 50
| table host, errors_10m, errors_baseline, pct_increase

| Alert action: PagerDuty + Jira ticket creation
| Alert condition: Number of results > 0
| Throttle: 15 minutes per host

---

| Alert 2: Daily incident trend report (scheduled at 08:00)
| Name: "Daily Incident Summary"
index=apache_logs OR index=php_errors OR index=mysql_errors
| eval day=strftime(_time, "%Y-%m-%d")
| stats
    count(eval(status=500)) AS http_500,
    count(eval(sourcetype="php_error" AND error_type="Fatal error")) AS php_fatal,
    count(eval(sourcetype="mysql_error")) AS mysql_errors
  by day
| sort - day
| head 7
| rename day AS Date, http_500 AS "HTTP 500s",
    php_fatal AS "PHP Fatals", mysql_errors AS "MySQL Errors"`;

const pythonAnalysisCode = `#!/usr/bin/env python3
"""
incident_pattern_analysis.py
Pulls Splunk data via REST API and generates an incident trend report.
Used for weekly ops review and SLO reporting.
"""
import os
import json
import time
import requests
from collections import defaultdict
from datetime import datetime, timedelta

SPLUNK_HOST = os.environ['SPLUNK_HOST']
SPLUNK_USER = os.environ['SPLUNK_USER']
SPLUNK_PASS = os.environ['SPLUNK_PASS']
BASE_URL = f"https://{SPLUNK_HOST}:8089"


def run_splunk_search(spl: str, earliest: str = "-7d", latest: str = "now") -> list:
    """Execute a Splunk search job and return results as a list of dicts."""
    session = requests.Session()
    session.auth = (SPLUNK_USER, SPLUNK_PASS)
    session.verify = False  # Internal cert

    # Create search job
    resp = session.post(f"{BASE_URL}/services/search/jobs", data={
        "search": f"search {spl}",
        "earliest_time": earliest,
        "latest_time": latest,
        "output_mode": "json"
    })
    resp.raise_for_status()
    sid = resp.json()['sid']

    # Poll until complete
    while True:
        status = session.get(f"{BASE_URL}/services/search/jobs/{sid}",
                             params={"output_mode": "json"})
        state = status.json()['entry'][0]['content']['dispatchState']
        if state == 'DONE':
            break
        time.sleep(2)

    # Fetch results
    results = session.get(f"{BASE_URL}/services/search/jobs/{sid}/results",
                          params={"output_mode": "json", "count": 1000})
    return results.json().get('results', [])


def generate_incident_report():
    """Generate a 7-day incident trend report."""
    spl = """
    index=apache_logs status=500
    | timechart span=1d count AS daily_500s by host
    | addtotals
    """
    results = run_splunk_search(spl, earliest="-7d")

    print("\\n=== 7-Day Incident Trend Report ===")
    print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\\n")

    for row in results:
        date = row.get('_time', 'Unknown')[:10]
        total = row.get('Total', 0)
        print(f"  {date}: {int(total):>6,} HTTP 500 errors")


if __name__ == '__main__':
    generate_incident_report()`;

const Data_Analytics = () => {
  const [activeTab, setActiveTab] = useState('splunk');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Data Analytics</h1>
        <p className={styles.heroTagline}>From raw server logs to actionable incident intelligence</p>
        <div className={styles.heroBadges}>
          {['Splunk', 'SPL', 'Log Analysis', 'KPIs', 'Trend Analysis', 'Python', 'Data Visualization'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            Analyzing large volumes of server and application logs is a core part of my role — specifically the
            "Identify Trending Incidents, Perform Root Cause Analysis" responsibilities. I use Splunk SPL to query
            terabytes of log data, identify trending incidents across the fleet, correlate events across systems,
            and build dashboards for operational KPIs.
          </p>
          <p className={styles.sectionText}>
            The most valuable skill in incident response is the ability to ask the right questions of log data quickly.
            I can go from "we're seeing elevated 500 errors on multiple servers" to "it was caused by a bad plugin update
            that went out at 14:23 UTC" in under 10 minutes using Splunk.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>TB+</div>
              <div className={styles.statLabel}>Logs Queried Daily</div>
            </div>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>SPL</div>
              <div className={styles.statLabel}>Query Language</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Analytical Capabilities</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Incident root cause analysis</strong> — Correlating error spikes
            with deployment events, config changes, and infrastructure modifications to pinpoint the exact trigger
            of a production incident — even when the evidence is spread across multiple log sources.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Trend detection</strong> — Using rolling averages and statistical
            deviation to identify when an error rate has moved beyond normal variance. Proactive detection before
            a trend becomes a customer-visible outage.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Automated reporting</strong> — Python scripts that pull Splunk data
            via REST API, format it into structured reports, and distribute them to the team via email or Slack
            on a scheduled basis.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Build a Splunk saved search for your most common incident patterns and set
            up alerts. When 500 errors spike above a threshold, getting paged within minutes vs. hours is the
            difference between a minor incident and a customer-visible outage. The alert configuration pays for
            itself the first time it fires at 3 AM.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — Root Cause Analysis of PHP 500 Error Wave</h2>
        <p className={styles.sectionText}>
          A wave of PHP 500 errors hits multiple servers simultaneously. Using Splunk SPL to correlate server logs,
          PHP error logs, and deployment events to identify that a bad plugin update was the trigger — and identify
          exactly which plugin.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['splunk', 'SPL queries — RCA'], ['alerts', 'SPL alerts + saved searches'], ['python', 'Python Splunk API report']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>
            {activeTab === 'python' ? 'python3 — Splunk REST API' : 'spl — Splunk Processing Language'}
          </div>
          <SyntaxHighlighter
            language={activeTab === 'python' ? 'python' : 'bash'}
            style={vscDarkPlus}
            showLineNumbers
          >
            {activeTab === 'splunk' ? splunkSplCode : activeTab === 'alerts' ? splunkAlertCode : pythonAnalysisCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default Data_Analytics;
