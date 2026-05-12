// src/components/Header.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../css/Header.module.css';

const NAV_ITEMS = [
    { to: '/',           label: 'Home',         end: true,  external: false },
    { to: '/Experience', label: 'Experience',   end: false, external: false },
    { to: '/Education',  label: 'Education',    end: false, external: false },
    {
        href: `https://github.com/${process.env.REACT_APP_GITHUB_REPO}`,
        label: 'GitHub Repos',
        external: true,
    },
    {
        href: '/Brandon_Boyd_Resume.docx',
        label: 'Download Resume',
        external: true,
        download: true,
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
                    {NAV_ITEMS.map(({ to, href, label, end, external, download }) => (
                        <li key={label} className={styles.navItem}>
                            {external ? (
                                <a
                                    href={href}
                                    className={download ? styles.navDownload : styles.navLink}
                                    target={download ? '_self' : '_blank'}
                                    rel="noopener noreferrer"
                                    {...(download && { download: true })}
                                >
                                    <span className={styles.navLabel}>{label}</span>
                                    {!download && <span className={styles.navExternalDot} aria-hidden="true">↗</span>}
                                    {download && <span className={styles.navDownloadIcon} aria-hidden="true">↓</span>}
                                </a>
                            ) : (
                                <NavLink to={to} end={end} className={linkClass}>
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
