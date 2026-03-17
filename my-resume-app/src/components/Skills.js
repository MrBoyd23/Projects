import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/Skills.module.css';
import { codingSkills, softwareSkills } from '../data/skillsConfig';

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
    </div>
  );
};

export default Skills;
