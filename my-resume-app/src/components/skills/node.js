import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const expressServerCode = `// server.js — Express health-check API
// Pattern used in this resume's contact form backend
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'https://resume.brandonaboyd.com',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '10kb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Contact form endpoint
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    // Send email via nodemailer / SES / etc.
    await sendEmail({ name, email, message });
    return res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Graceful shutdown
const server = app.listen(PORT, () => {
  console.log(\`API server running on port \${PORT}\`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

module.exports = app;`;

const pm2Code = `# ecosystem.config.js — PM2 process management config
# Store this in the project root; never use bare 'pm2 start' commands

module.exports = {
  apps: [
    {
      name: 'resume-api',
      script: './server.js',
      instances: 2,              // cluster mode — 2 workers
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        ALLOWED_ORIGIN: 'https://resume.brandonaboyd.com'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 3000,
      max_restarts: 10
    }
  ]
};

# --- Common PM2 commands ---

# Start using ecosystem config
pm2 start ecosystem.config.js

# Zero-downtime reload (cluster mode)
pm2 reload resume-api

# View logs in real time
pm2 logs resume-api --lines 50

# Check process status
pm2 status

# Save process list for server reboots
pm2 save

# Register PM2 as a system startup service
pm2 startup systemd`;

const Node = () => {
  const [activeTab, setActiveTab] = useState('express');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Node.js</h1>
        <p className={styles.heroTagline}>Server-side JavaScript for monitoring tools, APIs, and this very resume</p>
        <div className={styles.heroBadges}>
          {['Express', 'npm', 'PM2', 'Node 18+', 'REST API', 'async/await'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            Node.js powers the backend services I build for internal tooling and this resume site itself. I run Node-based
            monitoring and API services in production, managed by PM2 for process supervision, automatic restarts, and
            cluster mode load distribution across CPU cores.
          </p>
          <p className={styles.sectionText}>
            I use Express.js for lightweight REST APIs — the contact form server for this resume is a Node/Express app
            running on a VPS behind NGINX. I manage npm dependencies with locked <code>package-lock.json</code> files
            to ensure reproducible installs across environments.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Key Patterns</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>PM2 cluster mode</strong> — Running Node apps with multiple workers
            across all available CPU cores. Zero-downtime reloads (<code>pm2 reload</code>) deploy code changes without
            dropping connections — critical for production API servers.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Graceful shutdown</strong> — Listening for <code>SIGTERM</code> to drain
            in-flight requests before exiting. Kubernetes and PM2 both send SIGTERM before SIGKILL — handling it properly
            prevents dropped connections during deploys.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Input validation</strong> — Never trusting client-submitted data. Every
            API endpoint validates required fields, sanitizes inputs, and returns structured error responses.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Always use PM2's <code>ecosystem.config.js</code> instead of bare <code>pm2 start</code> commands.
            It stores your startup config, environment variables, and cluster settings — making it trivial to reproduce
            the exact production configuration on a new server.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — Express API + PM2 Process Management</h2>
        <p className={styles.sectionText}>
          The Express server below is the actual pattern behind this resume's contact form backend. The PM2 config shows
          the ecosystem file format I use for all Node services in production.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['express', 'Express server'], ['pm2', 'PM2 ecosystem config']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>{activeTab === 'express' ? 'javascript — server.js' : 'javascript — ecosystem.config.js'}</div>
          <SyntaxHighlighter language="javascript" style={vscDarkPlus} showLineNumbers>
            {activeTab === 'express' ? expressServerCode : pm2Code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default Node;
