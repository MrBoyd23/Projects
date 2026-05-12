/**
 * server/server.js — Express backend
 *
 * Endpoints:
 *   GET  /api/resume  — generates and streams a fresh Brandon_Boyd_Resume.docx
 *   POST /api/contact — handles the contact form submission
 *
 * Run with: node server/server.js  (or: npm run server from the project root)
 *
 * Requires a .env file at the project root with:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_RECIPIENT
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express    = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, LevelFormat, TabStopType, TabStopPosition, BorderStyle
} = require('docx');

const app  = express();
const port = process.env.SERVER_PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ── Resume helpers ──────────────────────────────────────────────
const FONT = 'Arial';
const BLUE = '2563EB';
const DARK = '1a1a1a';

function sectionHeader(text) {
  return new Paragraph({
    spacing: { before: 320, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLUE, space: 4 } },
    children: [new TextRun({ text, bold: true, size: 24, font: FONT, color: BLUE, characterSpacing: 120 })]
  });
}

function jobEntry(title, company, dates, location) {
  return [
    // Row 1: Job title
    new Paragraph({
      spacing: { before: 260, after: 0 },
      children: [
        new TextRun({ text: title, bold: true, size: 24, font: FONT, color: DARK }),
      ]
    }),
    // Row 2: Company  •  Dates  •  Location
    new Paragraph({
      spacing: { before: 20, after: 120 },
      children: [
        new TextRun({ text: company, bold: true, size: 20, font: FONT, color: '444444' }),
        new TextRun({ text: '  •  ' + dates, size: 20, font: FONT, color: '666666' }),
        new TextRun({ text: '  •  ' + location, size: 20, font: FONT, color: '888888', italics: true }),
      ]
    }),
  ];
}

function competencyHeader(text) {
  return new Paragraph({
    spacing: { before: 160, after: 40 },
    children: [new TextRun({ text, bold: true, italics: true, size: 21, font: FONT, color: '2c2c2c' })]
  });
}

function bullets(items) {
  return items.map(text =>
    new Paragraph({
      numbering: { reference: 'bullets', level: 0 },
      spacing: { before: 40, after: 40 },
      children: [new TextRun({ text, size: 21, font: FONT, color: '333333' })]
    })
  );
}

// ── Document builder ────────────────────────────────────────────
function buildResumeDoc() {
  return new Document({
    styles: {
      default: { document: { run: { font: FONT, size: 22, color: '333333' } } },
      paragraphStyles: [
        {
          id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 52, bold: true, font: FONT, color: DARK },
          paragraph: { spacing: { after: 40 }, alignment: AlignmentType.CENTER }
        },
        {
          id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 22, font: FONT, color: '555555' },
          paragraph: { spacing: { after: 60 }, alignment: AlignmentType.CENTER }
        },
      ]
    },
    numbering: {
      config: [
        {
          reference: 'bullets',
          levels: [{
            level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          }]
        },
        {
          reference: 'subbullets',
          levels: [{
            level: 0, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } }
          }]
        }
      ]
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
        }
      },
      children: [

        // ── Header: Name ────────────────────────────────────────
        new Paragraph({
          heading: 'Heading1',
          children: [new TextRun({ text: 'BRANDON ANTHONY BOYD', font: FONT, bold: true, size: 52, color: DARK })]
        }),

        // ── Header: Title bar ───────────────────────────────────
        new Paragraph({
          heading: 'Heading2',
          children: [new TextRun({ text: 'ENGINEER  •  ADMINISTRATOR  •  DEVELOPER', font: FONT, size: 22, color: '444444', characterSpacing: 100 })]
        }),

        // ── Divider ─────────────────────────────────────────────
        new Paragraph({
          spacing: { after: 60 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BLUE, space: 1 } },
          children: []
        }),

        // ── Spacer ──────────────────────────────────────────────
        new Paragraph({ spacing: { after: 100 }, children: [] }),

        // ════════════════════════════════════════════════════════
        //  PROFESSIONAL EXPERIENCE
        // ════════════════════════════════════════════════════════
        sectionHeader('PROFESSIONAL EXPERIENCE'),

        // ── System Engineer III ─────────────────────────────────
        ...jobEntry('System Engineer III', 'GoDaddy', 'February 2025 – Present', 'Remote'),

        competencyHeader('Independent Problem Solving & Execution'),
        ...bullets([
          'Consistently solving complex problems and delivering solutions independently, often serving as a go-to resource for peers facing similar challenges.',
          'Operating with a high degree of autonomy, requiring minimal direction on day-to-day work and proactively scoping new assignments.',
        ]),

        competencyHeader('Documentation Excellence'),
        ...bullets([
          'Maintaining a strong track record of high-quality ticket documentation, upholding high team standards.',
          'Authoring comprehensive documentation across multiple products and platforms, including operational SOPs, developer notes, and Atlassian knowledge base articles.',
        ]),

        competencyHeader('Emerging Leadership'),
        ...bullets([
          'Regularly leading standups, team meetings, and cross-functional discussions.',
          'Recognized as an emerging leader driving alignment, accountability, and team-wide operational readiness.',
        ]),

        competencyHeader('Continuous Improvement & Innovation'),
        ...bullets([
          'Championing continuous improvement initiatives, identifying and implementing process enhancements, tooling upgrades, and automation that increased team efficiency.',
          'Taking calculated risks and experimenting with new approaches, with a proven history of turning experiments into adopted solutions.',
        ]),

        competencyHeader('Multi-Technology Investigations'),
        ...bullets([
          'Investigating and resolving issues of moderate-to-high scope across multiple technologies—including application infrastructure, networking, databases, and security.',
          'Often connecting dots across systems that others miss.',
        ]),

        competencyHeader('Customer-First Mindset'),
        ...bullets([
          'Proactively identifying gaps and problems within area of ownership and driving them to resolution without waiting for escalation.',
          'Leading complex, customer-impacting investigations end-to-end, coordinating across teams and delivering root cause analysis with actionable follow-ups.',
        ]),

        competencyHeader('Operational Readiness & Training'),
        ...bullets([
          'Independently driving operational readiness across the team, including maintaining up-to-date documentation, developing training materials, onboarding new team members, and writing SOPs to standardize processes.',
        ]),

        competencyHeader('Subject Matter Expertise'),
        ...bullets([
          'Established SME in Incident Management Process and one or more System Operations products/services, regularly consulted by peers and leadership for guidance.',
          'Deep experience coordinating and improving incident response workflows over multiple cycles.',
        ]),

        // ── System Engineer II ──────────────────────────────────
        ...jobEntry('System Engineer II', 'GoDaddy', 'July 2021 – February 2025', 'Remote'),
        ...bullets([
          'Developed Remediation Scripting For Troubleshooting Server Environment',
          'Utilized CMDB (Configuration Management Database) with ServiceNow',
          'Incident Management & Alert Monitoring On 100K+ Server Network',
          'Subject Matter Expert On WordPress Server Configuration & Remediation',
          'Monitored Network For DDoS Attacks Against Different Environments',
          'Engaged with Kentik Software To Track Trends In Network Traffic',
          'Mitigated Attacks Against Servers (Network Level Blocking, Network Swings, NetScout, iptables)',
          'Identify Trending Incidents, Perform Root Cause Analysis & Implement Process Changes To Reduce/Eliminate Recurrence',
          'Apache & IIS Troubleshooting',
          'Setup/Configure Services In WHM/cPanel & Plesk/Remote Desktop',
          'MySQL/MSSQL Database Troubleshooting',
          'Conducted Website & Content Migrations',
          'DNS & Email Configuration Setup',
          'Assisted Legal Team In Making Data Archives',
          'Utilized Confluence & Jira For Document Tracking & Versioning',
          'Completed Training To Keep Up With Best Security Principles & Practices',
        ]),

        // ── System Engineer I ───────────────────────────────────
        ...jobEntry('System Engineer I', 'GoDaddy', 'November 2018 – July 2021', 'Remote'),
        ...bullets([
          'Incident Management & Alert Monitoring On 100K+ Server Network',
          'Identify Trending Incidents, Perform Root Cause Analysis & Implement Process Changes To Reduce & Eliminate Recurrence',
          'Utilize Splunk Software & Command-Line To Review Relayed Email',
          'Coordinated With Tier 2 Agents To Assist In Providing First Contact Resolution',
          'Apache & IIS Troubleshooting',
          'Managed & Issued Network Violations For Users Abusing Network & Hardware Services',
          'Website & Server Restorations',
          'MySQL/MSSQL Database Troubleshooting',
          'Assist Office of the CEO & Management with Escalated Matters In The Environment',
          'Website Security Review/Configuration/Analysis',
          'Properly Identify and Remove Malware From Compromised Websites',
          'Coordinated with Tier 2 Level Teams On How To Correct Issues with New Tools',
          'Used Documented Issues To Have Developers Create Tools To Fix Common Issues',
          'Created Technical Documentation for Tier 1 & 2 For Best Practices When Configuring Services',
          'Setup of A HelpBot (LiveEngage), Automated Bot That Provides Answers To Agents Based On Common Issues In The Environment',
        ]),

        // ── Hosting Technical Lead ──────────────────────────────
        ...jobEntry('Hosting Technical Lead', 'GoDaddy', 'February 2016 – November 2018', 'Scottsdale, Arizona | Remote'),
        ...bullets([
          'Worked Server/Managed Services Incident Queue',
          'Website Security Reviews/Configuration/Analysis',
          'Utilized Splunk To Review Email Server Relays, As Well As Incoming And Outgoing Emails On The Network',
          'Updated On External Facing Articles',
          'Beta Tested Cloud Servers',
          'Reviewed Active Issues With Internal Agents',
          'Created Internal Documentation In Relation To Troubleshooting Existing Support Issues',
          'Tracked Trending Issues Affecting The Network Over Extended Periods',
          'Completed Network Violation Reviews',
          'Migrated WordPress Website Content (WordPress/Joomla/Personal Sites)',
          'Completed Shared Hosting/Server Restores',
        ]),

        // ── Subject Matter Expert | Website Security ────────────
        ...jobEntry('Subject Matter Expert | Website Security', 'GoDaddy | Sucuri', 'August 2015 – November 2018', 'Scottsdale, Arizona'),
        ...bullets([
          'Determined Cost-saving Strategies By Publicizing Internal & New Documentation',
          'Subject Matter Expert (Website Security | Sucuri)',
          'Utilized Confluence/Jira For Document Tracking And Versioning',
          'Implemented Proper Security Principles And Practices',
          'Website Security Review/Configuration/Analysis',
          'Properly Identify And Remove Malware From Compromised Websites',
          'Implemented Fixes On Mis-configured Security Plans via API',
          'Used Documented Issues To Have Developers Create Tools To Fix Common Issues',
          'Coordinated With Tier 2 Level Teams On How To Correct Issues With New Tools',
          'Created Technical Documentation For Tier 1 & 2 For Best Practices When Configuring Services',
        ]),

        // ── Advanced Hosting IV ─────────────────────────────────
        ...jobEntry('Advanced Hosting IV', 'GoDaddy', 'November 2013 – January 2016', 'Scottsdale, Arizona'),
        ...bullets([
          'Tested cPanel And Plesk Releases For Shared Hosting Environment',
          'Created Supporting Documentation/Help Articles For Customers/Agents',
          'Provided Hosting Support For Front Of Site Chat Representatives',
          'Reviewed And Corresponded To Network Violations In Relation To Customer Hosting Plans',
          'Incident Management via Internal Ticketing System',
        ]),

        // ── Hosting Online Support Team ─────────────────────────
        ...jobEntry('Hosting Online Support Team', 'GoDaddy', 'February 2008 – October 2013', 'Scottsdale, Arizona'),
        ...bullets([
          'Instrumental In The Creation Of A Team Dedicated To Hosting Support',
          'Piloted The Server Support Chat Team',
          'Identified & Helped Resolve Issues In Relation To Customer Shared & Server Platforms',
          'Reviewed Incidents From Customers via Email',
          'Troubleshoot Email Configuration (MX Records/Mail Client Configuration)',
          'Identified Trending Issues Within The Network',
        ]),

      ]
    }]
  });
}

// ── GET /api/resume ─────────────────────────────────────────────
// Generates a fresh .docx on every request and streams it as a download.
app.get('/api/resume', async (req, res) => {
  try {
    const doc    = buildResumeDoc();
    const buffer = await Packer.toBuffer(doc);
    res.set({
      'Content-Type':        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="Brandon_Boyd_Resume.docx"',
      'Content-Length':      buffer.length,
      'Cache-Control':       'no-store',
    });
    res.send(buffer);
    console.log('Resume generated and sent —', new Date().toISOString());
  } catch (err) {
    console.error('Resume generation failed:', err);
    res.status(500).json({ error: 'Failed to generate resume.' });
  }
});

// ── POST /api/contact ───────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, message, inquiryType } = req.body;

  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from:    `"Contact Form" <${process.env.SMTP_USER}>`,
    to:      process.env.CONTACT_RECIPIENT,
    subject: `New ${inquiryType} Inquiry from ${name}`,
    text:    `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\n\nMessage:\n${message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent:', info.messageId);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

// ── Start ───────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
