import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const createIncidentCode = `#!/usr/bin/env python3
"""
servicenow_incident.py — Auto-create ServiceNow P2 incident from Prometheus alert webhook.
Triggered by Alertmanager webhook receiver when a high-CPU alert fires.
"""
import os
import json
import requests
from datetime import datetime, timezone

SNOW_INSTANCE = os.environ['SNOW_INSTANCE']   # e.g. company.service-now.com
SNOW_USER = os.environ['SNOW_USER']
SNOW_PASSWORD = os.environ['SNOW_PASSWORD']

SNOW_API = f"https://{SNOW_INSTANCE}/api/now/table"


def get_server_ci(hostname: str) -> dict:
    """Query CMDB for server Configuration Item details."""
    resp = requests.get(
        f"{SNOW_API}/cmdb_ci_linux_server",
        auth=(SNOW_USER, SNOW_PASSWORD),
        headers={"Accept": "application/json"},
        params={
            "sysparm_query": f"name={hostname}",
            "sysparm_fields": "sys_id,name,ip_address,u_environment,u_owner_team",
            "sysparm_limit": 1
        }
    )
    resp.raise_for_status()
    results = resp.json().get('result', [])
    return results[0] if results else {}


def create_incident(alert: dict) -> str:
    """Create a ServiceNow incident from a Prometheus alert payload."""
    hostname = alert['labels'].get('instance', 'unknown').split(':')[0]
    cpu_value = alert['annotations'].get('description', '')
    summary = alert['annotations'].get('summary', 'High CPU alert')

    # Look up CMDB CI
    ci = get_server_ci(hostname)
    ci_sys_id = ci.get('sys_id', '')
    environment = ci.get('u_environment', 'production')
    owner_team = ci.get('u_owner_team', 'Systems Engineering')

    incident_data = {
        "short_description": f"[AUTO] {summary}",
        "description": (
            f"Automated incident created from Prometheus alert.\\n\\n"
            f"Server: {hostname}\\n"
            f"Alert: {alert['labels'].get('alertname')}\\n"
            f"Details: {cpu_value}\\n"
            f"Environment: {environment}\\n"
            f"Fired at: {alert.get('startsAt', datetime.now(timezone.utc).isoformat())}\\n\\n"
            f"Prometheus alert labels: {json.dumps(alert['labels'], indent=2)}"
        ),
        "impact": "2",           # Medium impact
        "urgency": "2",          # Medium urgency
        "priority": "2",         # P2
        "category": "Infrastructure",
        "subcategory": "Server",
        "assignment_group": owner_team,
        "cmdb_ci": ci_sys_id,
        "caller_id": "prometheus_automation",
        "u_detection_method": "Automated — Prometheus Alertmanager"
    }

    resp = requests.post(
        f"{SNOW_API}/incident",
        auth=(SNOW_USER, SNOW_PASSWORD),
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        json=incident_data
    )
    resp.raise_for_status()
    result = resp.json()['result']
    incident_number = result['number']
    incident_url = f"https://{SNOW_INSTANCE}/nav_to.do?uri=incident.do?sys_id={result['sys_id']}"
    print(f"Created incident {incident_number}: {incident_url}")
    return incident_number


def handle_alertmanager_webhook(payload: dict):
    """Process Alertmanager webhook payload — may contain multiple alerts."""
    alerts = payload.get('alerts', [])
    firing = [a for a in alerts if a['status'] == 'firing']
    print(f"Processing {len(firing)} firing alerts...")
    for alert in firing:
        try:
            number = create_incident(alert)
            print(f"  Created: {number} for {alert['labels'].get('instance')}")
        except Exception as e:
            print(f"  ERROR creating incident for {alert['labels'].get('instance')}: {e}")`;

const cmdbQueryCode = `# ServiceNow REST API — CMDB queries for incident response

# Query CMDB for server details by hostname
GET https://company.service-now.com/api/now/table/cmdb_ci_linux_server
  ?sysparm_query=name=web01.prod
  &sysparm_fields=name,ip_address,u_environment,u_owner_team,u_datacenter
  &sysparm_limit=1

Authorization: Basic <base64(user:password)>
Accept: application/json

---

# Update a CI attribute after server changes (e.g., IP change after migration)
PATCH https://company.service-now.com/api/now/table/cmdb_ci_linux_server/{sys_id}
Content-Type: application/json

{
  "ip_address": "203.0.113.45",
  "u_environment": "production",
  "u_last_updated_by": "provisioning_automation",
  "comments": "IP updated post-migration 2025-01-15"
}

---

# Query open incidents for a specific CI
GET https://company.service-now.com/api/now/table/incident
  ?sysparm_query=cmdb_ci.name=web01.prod^active=true^state!=6
  &sysparm_fields=number,short_description,priority,state,assigned_to
  &sysparm_orderby=priority

---

# Close a resolved incident
PATCH https://company.service-now.com/api/now/table/incident/{sys_id}
{
  "state": "6",
  "close_code": "Solved (Permanently)",
  "close_notes": "Root cause: runaway PHP-FPM process. Fixed by increasing pm.max_children. Monitoring in place."
}`;

const ServiceNow = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>ServiceNow</h1>
        <p className={styles.heroTagline}>ITSM and CMDB operations at enterprise scale</p>
        <div className={styles.heroBadges}>
          {['CMDB', 'Incident Management', 'Change Management', 'ITSM', 'REST API', 'Workflows'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            ServiceNow is the primary ITSM platform I use for incident and change management. I create and resolve
            incidents, manage change requests through the CAB approval workflow, and query the CMDB (Configuration
            Management Database) to look up server configurations, relationships, and ownership during incident response.
          </p>
          <p className={styles.sectionText}>
            I also use the ServiceNow REST API to automate incident creation from monitoring alerts — when Prometheus
            fires a high-CPU alert, a Python script automatically creates a properly-populated incident ticket in
            ServiceNow within seconds, with the server's CMDB record already attached.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Key Capabilities</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>CMDB queries</strong> — Identifying server ownership, environment,
            and related CIs during incidents. A well-maintained CMDB tells me which team owns a server, what services
            run on it, and what the change history looks like — in seconds.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Change management</strong> — Creating and tracking change requests
            through the approval workflow. Every infrastructure change that touches production goes through a ServiceNow
            change request with risk assessment, implementation plan, and rollback steps.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Automation via REST API</strong> — Python scripts that create incidents,
            update CI records, and close tickets automatically as part of provisioning and decommission workflows.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Keep your CMDB current. Stale CI records are the #1 cause of incorrect alert
            routing and missed SLAs. Build automation that updates CI attributes during server provisioning and
            decommission — a CMDB that's updated manually will always be out of date.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — Automated Incident Creation from Prometheus</h2>
        <p className={styles.sectionText}>
          When a Prometheus high-CPU alert fires, a webhook triggers a Python script that queries the CMDB for server
          details and creates a properly-populated P2 incident automatically — no manual ticket creation required.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['create', 'Auto-create incident (Python)'], ['cmdb', 'CMDB REST API queries']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>{activeTab === 'create' ? 'python3 — automated incident creation' : 'http — ServiceNow REST API'}</div>
          <SyntaxHighlighter language={activeTab === 'create' ? 'python' : 'http'} style={vscDarkPlus} showLineNumbers>
            {activeTab === 'create' ? createIncidentCode : cmdbQueryCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default ServiceNow;
