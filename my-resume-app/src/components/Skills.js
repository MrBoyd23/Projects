import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/Skills.module.css';
import { codingSkills, softwareSkills } from '../data/skillsConfig';

const sites = [
  { name: 'PhoenixAZEvents.com', url: 'http://phoenixazevents.com/', desc: 'Local event discovery site for the Phoenix, AZ area — WordPress with custom event listings.', thumb: 'https://image.thum.io/get/width/600/http://phoenixazevents.com/' },
  { name: 'RJPJ2020.com', url: 'http://rjpj2020.com/', desc: 'Wedding website celebrating the union of Richard & Polli Jones.', thumb: 'https://image.thum.io/get/width/600/http://rjpj2020.com/' },
  { name: 'BrandonABoyd.com', url: 'http://brandonaboyd.com/', desc: 'A family website bringing together moments, memories, and milestones shared with my kids.', thumb: 'https://image.thum.io/get/width/600/http://brandonaboyd.com/' },
  { name: 'RachelIGarcia.com', url: 'http://racheligarcia.com/', desc: 'A heartfelt tribute dedicated to the life and legacy of Rachel Irene Garcia.', thumb: 'https://image.thum.io/get/width/600/http://racheligarcia.com/' },
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
    </div>
  );
};

export default Skills;
