// src/components/Sidebar.js
import React from 'react';
import styles from '../css/Sidebar.module.css';

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <ul className={styles.sidebarList}>
                <li>
                    <a href="https://github.com/MrBoyd23?tab=repositories" target="_blank" rel="noopener noreferrer">GitHub Repositories</a>
	        </li>
            </ul>
        </div>
    );
};

export default Sidebar;

