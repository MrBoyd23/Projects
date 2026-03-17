// src/components/Header.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../css/Header.module.css';

const NAV_ITEMS = [
    { to: '/',           label: 'Home',        icon: '⌂', end: true,  external: false },
    { to: '/Experience', label: 'Experience',   icon: '◈', end: false, external: false },
    { to: '/Education',  label: 'Education',    icon: '◆', end: false, external: false },
    {
        href: `https://github.com/${process.env.REACT_APP_GITHUB_REPO}`,
        label: 'GitHub Repos',
        icon: '⎇',
        external: true,
    },
];

const Header = () => {
    const linkClass = ({ isActive }) =>
        `${styles.navLink}${isActive ? ` ${styles.navLinkActive}` : ''}`;

    return (
        <header className={styles.header}>
            <div className={styles.headerBrand}>
                <h1>Brandon Anthony Boyd</h1>
                <h2>Engineer | Administrator | Developer</h2>
            </div>
            <nav aria-label="Main navigation">
                <ul className={styles.navList}>
                    {NAV_ITEMS.map(({ to, href, label, icon, end, external }) => (
                        <li key={label} className={styles.navItem}>
                            {external ? (
                                <a
                                    href={href}
                                    className={styles.navLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className={styles.navIcon}>{icon}</span>
                                    <span className={styles.navLabel}>{label}</span>
                                    <span className={styles.navExternalDot} aria-hidden="true">↗</span>
                                </a>
                            ) : (
                                <NavLink to={to} end={end} className={linkClass}>
                                    <span className={styles.navIcon}>{icon}</span>
                                    <span className={styles.navLabel}>{label}</span>
                                </NavLink>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
