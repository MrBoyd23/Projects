import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/Skills.module.css';
import { softwareSkills } from '../data/skillsConfig';

/**
 * Software — nav bar shown above each software skill detail page.
 * Skills driven by softwareSkills in src/data/skillsConfig.js.
 */
const Software = () => (
  <div className={styles.skillsPage}>
    <p className={styles.centeredParagraph}>🛠 Software &amp; Tools — select a skill</p>
    <div className={styles.skillsList}>
      {softwareSkills.map(({ id, label }) => (
        <Link key={id} to={`/${id}`} className={styles.skillBubble}>{label}</Link>
      ))}
    </div>
  </div>
);

export default Software;

