import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/Skills.module.css';
import { codingSkills, softwareSkills } from '../data/skillsConfig';

const projects = [
  {
    title: 'Network Violation Tool Management',
    subtitle: 'End-to-end ownership — acquisition to production deployment, security hardening, and documentation.',
    bullets: [
      'Took over the tool from the previous team and stood it up in the HOC PCP environment with zero disruption.',
      'Configured Katana within PCP; established and maintained both Production and Development environments.',
      'Configured GitHub Workflows for automated builds and consistent deployments.',
      'Authored the Network Violation Homepage and Dev Notes, documenting the full management lifecycle.',
      'Conducted security review: secured the API, addressed missing rate limiting, and remediated JS exception messages.',
      'Set up the CCID Account required for tool integration and operation.',
    ],
  },
  {
    title: 'MWPv2 Platform Access & Management',
    subtitle: 'Operations-level management including DDoS defense, observability, and team enablement.',
    bullets: [
      'Managed the platform as primary point of contact for health and incident response.',
      'Set up Cloudflare rate limiting and created Rate Limiting graphs to prevent abuse.',
      'Created Kibana graphs for tracking DDoS events, improving real-time threat visibility.',
      'Wrote comprehensive Atlassian documentation for platform remediation best practices.',
    ],
  },
  {
    title: 'Toolkit Improvements',
    subtitle: 'Feature development, cross-team collaboration, and access management.',
    bullets: [
      'Added Plesk and cPanel Hypervisor search, broadening diagnostic capabilities.',
      'Collaborated with cPanel Dev Team to add VM status visibility — critical for server troubleshooting.',
      'Enabled Toolkit access for several teams, expanding cross-org adoption.',
      'Created separate Developer access group to scope permissions appropriately.',
    ],
  },
  {
    title: 'MySQL Operations & Remediation Scripts',
    subtitle: 'Standardization of database access workflows and operational scripting on cPanel.',
    bullets: [
      'Wrote .bash_profile configuration for seamless MySQL server access, standardizing the team\'s workflow.',
      'Configured and documented SOPs for consistent MySQL operations.',
      'Identified and updated non-functional cPanel scripts to restore remediation capabilities.',
    ],
  },
];

const sites = [
  { name: 'Dev.BrandonABoyd.com', url: 'http://dev.brandonaboyd.com/', desc: 'Development and staging environment for testing new features before production.', thumb: 'https://image.thum.io/get/width/600/wait/3/noanimate/http://dev.brandonaboyd.com/' },
  { name: 'PhoenixAZEvents.com', url: 'http://phoenixazevents.com/', desc: 'Local event discovery site for the Phoenix, AZ area — WordPress with custom event listings.', thumb: 'https://image.thum.io/get/width/600/wait/3/noanimate/http://phoenixazevents.com/' },
  { name: 'RJPJ2020.com', url: 'http://rjpj2020.com/', desc: 'Wedding website celebrating the union of Richard & Polli Jones.', thumb: 'https://image.thum.io/get/width/600/wait/3/noanimate/http://rjpj2020.com/' },
  { name: 'BrandonABoyd.com', url: 'http://brandonaboyd.com/', desc: 'A family website bringing together moments, memories, and milestones shared with my kids.', thumb: 'https://image.thum.io/get/width/600/wait/3/noanimate/http://brandonaboyd.com/' },
  { name: 'RachelIGarcia.com', url: 'http://racheligarcia.com/', desc: 'A heartfelt tribute dedicated to the life and legacy of Rachel Irene Garcia.', thumb: 'https://image.thum.io/get/width/600/wait/3/noanimate/http://racheligarcia.com/' },
];

/**
 * Skills — shows Coding and Software categories inline with expandable
 * skill bubbles. No separate navigation click required.
 */
const CategoryAccordion = ({ title, skills, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.categoryBlock}>
      <button
        className={styles.categoryHeader}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className={styles.categoryTitle}>{title}</span>
        <span className={`${styles.categoryChevron} ${open ? styles.categoryChevronOpen : ''}`}>
          ▼
        </span>
      </button>

      {open && (
        <div className={styles.skillsList}>
          {skills.map(({ id, label }) => (
            <Link key={id} to={`/${id}`} className={styles.skillBubble}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Skills = () => {
  return (
    <div className={styles.skillsPage}>
      <p className={styles.intro}>
        Explore my technical skillset below. Click any skill to view a detailed breakdown,
        real-world use cases, and code examples from my work as a System Engineer III.
      </p>

      <div className={styles.categoriesRow}>
        <CategoryAccordion title="⌨ Coding &amp; Development" skills={codingSkills} defaultOpen={true} />
        <CategoryAccordion title="🛠 Software &amp; Tools" skills={softwareSkills} defaultOpen={true} />
      </div>

      <div className={styles.sitesSection}>
        <h2 className={styles.sitesHeading}>Sites I've Built</h2>
        <div className={styles.sitesGrid}>
          {sites.map(site => (
            <div key={site.name} className={styles.siteCard} style={{ padding: 0, overflow: 'hidden' }}>
              <a href={site.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                <img
                  src={site.thumb}
                  alt={`${site.name} screenshot`}
                  loading="lazy"
                  onError={e => { e.target.style.display = 'none'; }}
                  style={{ width: '100%', height: 140, objectFit: 'cover', objectPosition: 'top', display: 'block', borderBottom: '1px solid #2d0000' }}
                />
              </a>
              <div style={{ padding: '14px 16px 16px' }}>
                <h3 className={styles.siteCardName}>{site.name}</h3>
                <p className={styles.siteCardDesc}>{site.desc}</p>
                <a href={site.url} target="_blank" rel="noopener noreferrer" className={styles.siteCardLink}>
                  Visit site →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.projectsSection}>
        <h2 className={styles.sitesHeading}>Key Projects &amp; Technical Accomplishments</h2>
        <div className={styles.projectsGrid}>
          {projects.map(project => (
            <div key={project.title} className={styles.projectCard}>
              <h3 className={styles.projectCardTitle}>{project.title}</h3>
              <p className={styles.projectCardSubtitle}>{project.subtitle}</p>
              <ul className={styles.projectCardList}>
                {project.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
