// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/Header.module.css'; // Correctly import the CSS module

const Header = () => {
    return (
        <header className={styles.header}>
            <h1>Brandon Anthony Boyd</h1>
            <h2>Engineer | Administrator | Developer</h2>
            <nav>
                <ul className={styles.navList}>
                    <li className={styles.navItem}><Link to="/" className={styles.navLink}>Home</Link></li>
                    <li className={styles.navItem}><Link to="/Experience" className={styles.navLink}>Experience</Link></li>
                    <li className={styles.navItem}><Link to="/Education" className={styles.navLink}>Education</Link></li>
                    <li className={styles.navItem}><a href="https://github.com/MrBoyd23/Projects" className={styles.navLink} target="_blank" rel="noopener noreferrer">GitHub Repos</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;

