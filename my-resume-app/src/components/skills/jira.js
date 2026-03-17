import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const jqlQueriesCode = `-- JQL Queries I use daily for incident management and reporting

-- 1. All active P1/P2 incidents assigned to Systems team (last 7 days)
project = "INFRA"
  AND issuetype = Incident
  AND priority in (P1, P2)
  AND created >= -7d
  AND assignee in membersOf("systems-eng")
  AND status != Resolved
ORDER BY priority ASC, created DESC

-- 2. Trending incidents by component — identify recurring patterns
project = "INFRA"
  AND issuetype = Incident
  AND created >= -7d
  AND component in ("Shared Hosting", "MySQL", "PHP-FPM", "cPanel")
ORDER BY component ASC, created DESC

-- 3. SLA breached tickets — requires immediate attention
project = "INFRA"
  AND issuetype = Incident
  AND "Time to resolution" = breached()
  AND status != Resolved
ORDER BY priority ASC

-- 4. My open tickets with approaching SLA
assignee = currentUser()
  AND status not in (Resolved, Closed)
  AND "Time to resolution" < 2h
ORDER BY "Time to resolution" ASC

-- 5. RCA tickets opened this sprint
project = "INFRA"
  AND issuetype = "Root Cause Analysis"
  AND sprint in openSprints()
ORDER BY created DESC

-- 6. Change requests pending approval this week
project = "CHG"
  AND issuetype = "Change Request"
  AND status = "Pending Approval"
  AND "Planned Start" >= startOfWeek()
  AND "Planned Start" <= endOfWeek()
ORDER BY "Planned Start" ASC`;

const jiraWorkflowCode = `# Incident lifecycle workflow — how I use Jira for production incidents

# Incident states:
# Open → In Progress → Pending Change → Resolved → Closed → [Post-Mortem]

# Typical P1 incident ticket fields I populate:
{
  "summary": "Production MySQL cluster: too many connections — 3 servers affected",
  "issuetype": "Incident",
  "priority": "P1",
  "components": ["MySQL", "Shared Hosting"],
  "environment": "Production",
  "affected_systems": "db01.prod, db02.prod, db03.prod",
  "customer_impact": "~2,400 hosted sites returning 500 errors",
  "detection_method": "CloudWatch alarm → PagerDuty → Jira auto-create",

  "description": "## Summary\\nMySQL max_connections reached on 3 production DB servers.\\n\\n## Impact\\n~2,400 customer sites returning DB connection errors.\\n\\n## Initial Steps\\n1. Identified via SHOW PROCESSLIST — runaway WP cron jobs\\n2. Increased max_connections temporarily: SET GLOBAL max_connections=500\\n3. Killed 847 idle Sleep connections\\n4. Service restored at 14:23 UTC\\n\\n## Root Cause (preliminary)\\nWordPress cron misconfiguration creating unbounded connection pool",

  "resolution": "Increased global max_connections, implemented connection pooling via ProxySQL, added monitoring alert for connections > 80% of max",

  "time_to_detect": "4 minutes",
  "time_to_resolve": "18 minutes"
}`;

const Jira = () => {
  const [activeTab, setActiveTab] = useState('jql');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Jira</h1>
        <p className={styles.heroTagline}>Incident tracking, sprint planning, and SLA management at enterprise scale</p>
        <div className={styles.heroBadges}>
          {['Jira Software', 'JQL', 'Sprints', 'Epics', 'SLA', 'Confluence', 'Kanban'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            Jira is the primary incident and change management system at GoDaddy. Every production incident I respond to
            gets a Jira ticket — from initial detection through resolution and root cause analysis documentation.
            I create and triage tickets, track SLA compliance, and use JQL for advanced filtering to identify patterns
            across our incident queue.
          </p>
          <p className={styles.sectionText}>
            I work across both Kanban and Sprint boards depending on the team. Incident response uses Kanban for
            continuous flow, while infrastructure improvement projects use Sprints with epics for longer-horizon work.
            I also maintain Confluence runbooks linked directly from Jira incident types.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>JQL Mastery for Ops Teams</h2>
          <p className={styles.sectionText}>
            JQL (Jira Query Language) is the difference between drowning in a ticket queue and having operational
            intelligence. I use it to build saved filters that the whole team relies on — active P1 dashboards,
            SLA breach monitors, and sprint completion tracking.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Pattern identification</strong> — Querying by component and time window
            lets me spot when a particular service (MySQL, PHP-FPM, DNS) is generating a spike in incidents,
            triggering a proactive investigation before customers notice a trend.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>SLA management</strong> — Using the <code>breached()</code> function
            to surface tickets that have missed SLA targets, enabling immediate escalation and RCA documentation.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Save your most-used JQL queries as Jira filters and share them with your team.
            A well-maintained "Active P1 Incidents" filter visible on the team board is worth more than a dozen
            status meetings — everyone has the same real-time picture.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — Trending Incident Analysis with JQL</h2>
        <p className={styles.sectionText}>
          The JQL queries below are the ones I use to identify trending incidents, monitor SLA compliance, and build
          the operational intelligence needed for proactive remediation. The incident template shows how I document
          production incidents for RCA.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['jql', 'JQL queries'], ['workflow', 'Incident template']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>{activeTab === 'jql' ? 'JQL — Jira Query Language' : 'json — incident ticket structure'}</div>
          <SyntaxHighlighter language={activeTab === 'jql' ? 'sql' : 'json'} style={vscDarkPlus} showLineNumbers>
            {activeTab === 'jql' ? jqlQueriesCode : jiraWorkflowCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default Jira;
