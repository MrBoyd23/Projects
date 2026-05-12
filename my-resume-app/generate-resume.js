const { Document, Packer, Paragraph, TextRun, AlignmentType, LevelFormat, TabStopType, TabStopPosition, BorderStyle } = require("docx");
const fs = require("fs");

const FONT = "Arial";
const BLUE = "2563EB";

const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: 22, color: "333333" } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 48, bold: true, font: FONT, color: "1a1a1a" },
        paragraph: { spacing: { after: 40 }, alignment: AlignmentType.CENTER } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 20, font: FONT, color: "666666" },
        paragraph: { spacing: { after: 200 }, alignment: AlignmentType.CENTER } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: FONT, color: "1a1a1a" },
        paragraph: { spacing: { before: 300, after: 60 } } },
    ]
  },
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
      }]
    }, {
      reference: "subbullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 1080, hanging: 360 } } }
      }]
    }]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    children: [
      // Name
      new Paragraph({ heading: "Heading1", children: [new TextRun({ text: "BRANDON ANTHONY BOYD", font: FONT })] }),
      // Subtitle
      new Paragraph({ heading: "Heading2", children: [new TextRun({ text: "ENGINEER  |  ADMINISTRATOR  |  DEVELOPER", font: FONT, characterSpacing: 80 })] }),
      // Divider
      new Paragraph({ spacing: { after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE, space: 1 } }, children: [] }),

      // === EXPERIENCE SECTION ===
      sectionHeader("PROFESSIONAL EXPERIENCE"),

      // Job 1
      ...jobEntry("System Engineer III", "GoDaddy", "February 2025 \u2013 Present", "Remote"),
      competencyHeader("Independent Problem Solving & Execution"),
      ...bullets([
        "Consistently solving complex problems and delivering solutions independently, often serving as a go-to resource for peers facing similar challenges.",
        "Operating with a high degree of autonomy, requiring minimal direction on day-to-day work and proactively scoping new assignments."
      ]),
      competencyHeader("Documentation Excellence"),
      ...bullets([
        "Maintaining a strong track record of high-quality ticket documentation, upholding high team standards.",
        "Authoring comprehensive documentation across multiple products and platforms, including operational SOPs, developer notes, and Atlassian knowledge base articles."
      ]),
      competencyHeader("Emerging Leadership"),
      ...bullets([
        "Regularly leading standups, team meetings, and cross-functional discussions.",
        "Recognized as an emerging leader driving alignment, accountability, and team-wide operational readiness."
      ]),
      competencyHeader("Continuous Improvement & Innovation"),
      ...bullets([
        "Championing continuous improvement initiatives, identifying and implementing process enhancements, tooling upgrades, and automation that increased team efficiency.",
        "Taking calculated risks and experimenting with new approaches, with a proven history of turning experiments into adopted solutions."
      ]),
      competencyHeader("Multi-Technology Investigations"),
      ...bullets([
        "Investigating and resolving issues of moderate-to-high scope across multiple technologies\u2014including application infrastructure, networking, databases, and security.",
        "Often connecting dots across systems that others miss."
      ]),
      competencyHeader("Customer-First Mindset"),
      ...bullets([
        "Proactively identifying gaps and problems within area of ownership and driving them to resolution without waiting for escalation.",
        "Leading complex, customer-impacting investigations end-to-end, coordinating across teams and delivering root cause analysis with actionable follow-ups."
      ]),
      competencyHeader("Operational Readiness & Training"),
      ...bullets([
        "Independently driving operational readiness across the team, including maintaining up-to-date documentation, developing training materials, onboarding new team members, and writing SOPs to standardize processes."
      ]),
      competencyHeader("Subject Matter Expertise"),
      ...bullets([
        "Established SME in Incident Management Process and one or more System Operations products/services, regularly consulted by peers and leadership for guidance.",
        "Deep experience coordinating and improving incident response workflows over multiple cycles."
      ]),

      // Job 2
      ...jobEntry("System Engineer II", "GoDaddy", "July 2021 \u2013 February 2025", "Remote"),
      ...bullets([
        "Developed Remediation Scripting For Troubleshooting Server Environment",
        "Utilized CMDB (Configuration Management Database) with ServiceNow",
        "Incident Management & Alert Monitoring On 100K+ Server Network",
        "Subject Matter Expert On WordPress Server Configuration & Remediation",
        "Monitored Network For DDoS Attacks Against Different Environments",
        "Engaged with Kentik Software To Track Trends In Network Traffic",
        "Mitigated Attacks Against Servers (Network Level Blocking, Network Swings, NetScout, iptables)",
        "Identify Trending Incidents, Perform Root Cause Analysis & Implement Process Changes To Reduce/Eliminate Recurrence",
        "Apache & IIS Troubleshooting",
        "Setup/Configure Services In WHM/cPanel & Plesk/Remote Desktop",
        "MySQL/MSSQL Database Troubleshooting",
        "Conducted Website & Content Migrations",
        "DNS & Email Configuration Setup",
        "Assisted Legal Team In Making Data Archives",
        "Utilized Confluence & Jira For Document Tracking & Versioning",
        "Completed Training To Keep Up With Best Security Principles & Practices"
      ]),

      // Job 3
      ...jobEntry("System Engineer I", "GoDaddy", "November 2018 \u2013 July 2021", "Remote"),
      ...bullets([
        "Incident Management & Alert Monitoring On 100K+ Server Network",
        "Identify Trending Incidents, Perform Root Cause Analysis & Implement Process Changes To Reduce & Eliminate Recurrence",
        "Utilize Splunk Software & Command-Line To Review Relayed Email",
        "Coordinated With Tier 2 Agents To Assist In Providing First Contact Resolution",
        "Apache & IIS Troubleshooting",
        "Managed & Issued Network Violations For Users Abusing Network & Hardware Services",
        "Website & Server Restorations",
        "MySQL/MSSQL Database Troubleshooting",
        "Assist Office of the CEO & Management with Escalated Matters In The Environment",
        "Website Security Review/Configuration/Analysis",
        "Properly Identify and Remove Malware From Compromised Websites",
        "Coordinated with Tier 2 Level Teams On How To Correct Issues with New Tools",
        "Used Documented Issues To Have Developers Create Tools To Fix Common Issues",
        "Created Technical Documentation for Tier 1 & 2 For Best Practices When Configuring Services",
        "Setup of A HelpBot (LiveEngage), Automated Bot That Provides Answers To Agents Based On Common Issues In The Environment"
      ]),

      // Job 4
      ...jobEntry("Hosting Technical Lead", "GoDaddy", "February 2016 \u2013 November 2018", "Scottsdale, Arizona | Remote"),
      ...bullets([
        "Worked Server/Managed Services Incident Queue",
        "Website Security Reviews/Configuration/Analysis",
        "Utilized Splunk To Review Email Server Relays, As Well As Incoming And Outgoing Emails On The Network",
        "Updated On External Facing Articles",
        "Beta Tested Cloud Servers",
        "Reviewed Active Issues With Internal Agents",
        "Created Internal Documentation In Relation To Troubleshooting Existing Support Issues",
        "Tracked Trending Issues Affecting The Network Over Extended Periods",
        "Completed Network Violation Reviews",
        "Migrated WordPress Website Content (WordPress/Joomla/Personal Sites)",
        "Completed Shared Hosting/Server Restores"
      ]),

      // Job 5
      ...jobEntry("Subject Matter Expert | Website Security", "GoDaddy | Sucuri", "August 2015 \u2013 November 2018", "Scottsdale, Arizona"),
      ...bullets([
        "Determined Cost-saving Strategies By Publicizing Internal & New Documentation",
        "Subject Matter Expert (Website Security | Sucuri)",
        "Utilized Confluence/Jira For Document Tracking And Versioning",
        "Implemented Proper Security Principles And Practices",
        "Website Security Review/Configuration/Analysis",
        "Properly Identify And Remove Malware From Compromised Websites",
        "Implemented Fixes On Mis-configured Security Plans via API",
        "Used Documented Issues To Have Developers Create Tools To Fix Common Issues",
        "Coordinated With Tier 2 Level Teams On How To Correct Issues With New Tools",
        "Created Technical Documentation For Tier 1 & 2 For Best Practices When Configuring Services"
      ]),

      // Job 6
      ...jobEntry("Advanced Hosting IV", "GoDaddy", "November 2013 \u2013 January 2016", "Scottsdale, Arizona"),
      ...bullets([
        "Tested cPanel And Plesk Releases For Shared Hosting Environment",
        "Created Supporting Documentation/Help Articles For Customers/Agents",
        "Provided Hosting Support For Front Of Site Chat Representatives",
        "Reviewed And Corresponded To Network Violations In Relation To Customer Hosting Plans",
        "Incident Management via Internal Ticketing System"
      ]),

      // Job 7
      ...jobEntry("Hosting Online Support Team", "GoDaddy", "February 2008 \u2013 October 2013", "Scottsdale, Arizona"),
      ...bullets([
        "Instrumental In The Creation Of A Team Dedicated To Hosting Support",
        "Piloted The Server Support Chat Team",
        "Identified & Helped Resolve Issues In Relation To Customer Shared & Server Platforms",
        "Reviewed Incidents From Customers via Email",
        "Troubleshoot Email Configuration (MX Records/Mail Client Configuration)",
        "Identified Trending Issues Within The Network"
      ]),
    ]
  }]
});

function sectionHeader(text) {
  return new Paragraph({
    spacing: { before: 300, after: 200 },
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
        new TextRun({ text: title, bold: true, size: 24, font: FONT, color: "1a1a1a" }),
      ]
    }),
    // Row 2: Company  |  Dates  |  Location
    new Paragraph({
      spacing: { before: 20, after: 120 },
      children: [
        new TextRun({ text: company, bold: true, size: 20, font: FONT, color: "444444" }),
        new TextRun({ text: "  •  " + dates, size: 20, font: FONT, color: "666666" }),
        new TextRun({ text: "  •  " + location, size: 20, font: FONT, color: "888888", italics: true }),
      ]
    }),
  ];
}

function competencyHeader(text) {
  return new Paragraph({
    spacing: { before: 160, after: 40 },
    children: [new TextRun({ text, bold: true, italics: true, size: 21, font: FONT, color: "2c2c2c" })]
  });
}

function bullets(items) {
  return items.map(text =>
    new Paragraph({
      numbering: { reference: "bullets", level: 0 },
      spacing: { before: 40, after: 40 },
      children: [new TextRun({ text, size: 21, font: FONT, color: "333333" })]
    })
  );
}

const path = require("path");
const outPath = path.join(__dirname, "public", "Brandon_Boyd_Resume.docx");

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("Resume saved to " + outPath);
});
