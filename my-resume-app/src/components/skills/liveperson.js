import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const botIntentCode = `// HelpBot intent configuration — LivePerson Bot Studio
// Handles Tier-1 agent questions about common hosting issues

{
  "bot_name": "HelpBot",
  "version": "2.4.1",
  "fallback_message": "I couldn't find a match for that. Transferring to a senior agent...",
  "escalation_skill": "Systems-Senior",

  "intents": [
    {
      "name": "DNS_PROPAGATION",
      "display_name": "DNS Propagation Questions",
      "training_phrases": [
        "DNS not propagating",
        "domain not resolving",
        "how long does DNS take",
        "DNS changes not working",
        "nameserver update not showing"
      ],
      "confidence_threshold": 0.75,
      "response": {
        "type": "structured_content",
        "elements": [
          {
            "type": "text",
            "text": "DNS Propagation typically takes 0-48 hours globally. Here's how to check:"
          },
          {
            "type": "checklist",
            "items": [
              "Verify NS records updated: dig NS domain.com @8.8.8.8",
              "Check propagation status: whatsmydns.net",
              "Confirm TTL — low TTL (300s) propagates faster",
              "Clear local DNS cache: ipconfig /flushdns (Windows)"
            ]
          },
          {
            "type": "quick_replies",
            "items": [
              { "text": "Still not working after 48h", "action": "escalate_dns" },
              { "text": "This helped, thanks", "action": "close_resolved" }
            ]
          }
        ]
      }
    },

    {
      "name": "SITE_500_ERROR",
      "display_name": "Website 500 Internal Server Error",
      "training_phrases": [
        "500 error",
        "internal server error",
        "white screen of death",
        "site showing 500",
        "WordPress WSOD"
      ],
      "confidence_threshold": 0.80,
      "response": {
        "type": "decision_tree",
        "root_question": "Is this a WordPress site?",
        "branches": [
          {
            "condition": "yes",
            "response": "WordPress 500 diagnostic steps:\\n1. Check PHP error log: /var/log/php-fpm.log\\n2. Deactivate all plugins via WP-CLI: wp plugin deactivate --all\\n3. Switch to default theme\\n4. Check memory_limit in wp-config.php",
            "escalation_if_unresolved": true
          },
          {
            "condition": "no",
            "response": "General 500 diagnostic steps:\\n1. Check Apache/Nginx error log\\n2. Verify file permissions (755 dirs, 644 files)\\n3. Check .htaccess for syntax errors\\n4. Review recent deployments",
            "escalation_if_unresolved": true
          }
        ]
      }
    },

    {
      "name": "SSL_ISSUES",
      "display_name": "SSL Certificate Problems",
      "training_phrases": [
        "SSL not working",
        "certificate error",
        "HTTPS not secure",
        "mixed content warning",
        "SSL expired",
        "ERR_CERT_COMMON_NAME_INVALID"
      ],
      "confidence_threshold": 0.78,
      "response": {
        "type": "text",
        "text": "SSL Troubleshooting Guide:\\n\\n• Mixed content: Search-replace HTTP→HTTPS in database\\n• Expired cert: Re-run AutoSSL in cPanel > SSL/TLS\\n• Wrong domain: Verify the cert's CN matches the domain\\n• Check chain: ssllabs.com/ssltest for full analysis\\n\\nNeed to escalate? Use skill: Systems-SSL"
      }
    }
  ]
}`;

const routingRulesCode = `// LiveEngage routing rules — skill-based chat routing configuration
// Ensures customers reach the right team based on issue type

{
  "routing_rules": [
    {
      "name": "WordPress Emergency Route",
      "priority": 1,
      "conditions": [
        { "type": "url_contains", "value": "wordpress" },
        { "type": "pre_chat_survey", "field": "issue_type", "value": "site_down" }
      ],
      "action": {
        "route_to_skill": "WordPress-Priority",
        "max_wait_seconds": 120,
        "fallback_skill": "General-Hosting"
      }
    },
    {
      "name": "HelpBot First — Tier-1 Queue",
      "priority": 5,
      "conditions": [
        { "type": "skill", "value": "General-Hosting" }
      ],
      "action": {
        "route_to_bot": "HelpBot",
        "bot_timeout_seconds": 300,
        "on_bot_failure": { "route_to_skill": "General-Hosting" },
        "on_unresolved": { "route_to_skill": "Systems-Senior" }
      }
    }
  ],

  "queue_thresholds": {
    "General-Hosting": {
      "max_queue_size": 50,
      "max_wait_minutes": 5,
      "overflow_skill": "Systems-Senior"
    }
  }
}`;

const LivePerson = () => {
  const [activeTab, setActiveTab] = useState('bot');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>LivePerson</h1>
        <p className={styles.heroTagline}>Conversational AI and chat routing for enterprise support operations</p>
        <div className={styles.heroBadges}>
          {['LiveEngage', 'HelpBot', 'Bot Studio', 'Agent Routing', 'Chat Analytics', 'Conversational AI'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            I manage LivePerson's chat routing rules and help maintain HelpBot — an automated bot I helped build and
            configure that answers Tier-1 agents' technical questions in real time during customer chats. Rather than
            escalating every technical question to a senior engineer, agents type their question and HelpBot returns
            a structured answer with diagnostic steps.
          </p>
          <p className={styles.sectionText}>
            I monitor agent queue metrics, analyze conversation transcripts to identify gaps in HelpBot's knowledge base,
            and tune the intent configuration when new issue patterns emerge. I also manage the routing rules that ensure
            customers with urgent issues (site down, security incident) reach the right skill queue immediately.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>HelpBot Impact</h2>
          <p className={styles.sectionText}>
            HelpBot was designed to reduce the average handle time for Tier-1 escalations. Instead of an agent pausing
            a customer chat to ask a senior engineer "how do I fix DNS not propagating?" — they ask HelpBot and get
            a structured answer with diagnostic steps in under 2 seconds.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Intents I built:</strong> DNS propagation troubleshooting, WordPress
            500 errors and WSOD, SSL certificate issues, email delivery failures, PHP memory exhaustion,
            cPanel/WHM navigation questions, and domain transfer status.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Routing architecture:</strong> Customer chats are first routed to
            HelpBot for Tier-1 containment. Unresolved issues fall through to human agents in the appropriate skill queue,
            with HelpBot's transcript attached so agents have full context.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Start HelpBot with your top 10 most-asked questions. Focus on high-volume,
            low-complexity queries first. Even a 20% containment rate is a massive win for agent productivity —
            and it frees senior engineers to work on actual incidents instead of answering the same questions repeatedly.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — HelpBot Intent Configuration</h2>
        <p className={styles.sectionText}>
          The bot intent configuration and routing rules below represent the structure I built for the HelpBot system —
          covering the most common Tier-1 technical questions with decision-tree responses and smart escalation paths.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['bot', 'HelpBot intent config'], ['routing', 'Routing rules']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>json — LivePerson Bot Studio config</div>
          <SyntaxHighlighter language="json" style={vscDarkPlus} showLineNumbers>
            {activeTab === 'bot' ? botIntentCode : routingRulesCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default LivePerson;
