import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/Skills.module.css';
import { codingSkills } from '../data/skillsConfig';

/**
 * Coding — nav bar shown above each coding skill detail page.
 * Skills driven by codingSkills in src/data/skillsConfig.js.
 */
const Coding = () => (
  <div className={styles.skillsPage}>
    <p className={styles.centeredParagraph}>⌨ Coding &amp; Development — select a skill</p>
    <div className={styles.skillsList}>
      {codingSkills.map(({ id, label }) => (
        <Link key={id} to={`/${id}`} className={styles.skillBubble}>{label}</Link>
      ))}
    </div>
  </div>
);

export default Coding;

