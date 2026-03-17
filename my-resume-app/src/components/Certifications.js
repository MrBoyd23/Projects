import React from 'react';
import styles from '../css/Certifications.module.css';

/**
 * Certifications — timeline-style cards matching Education page.
 * Uses CSS Modules for scoped styling.
 */
const Certifications = () => (
    <div className={styles.certifications}>
        <h2 className={styles.heading}>Certifications</h2>

        <div className={styles.certificationItem}>
            <p className={styles.certificationTitle}>
                Cert Prep: LPIC-1 Exam 101 (Version 5.0)
            </p>
            <span className={styles.issueDate}>Issued Nov 2022</span>
            <p className={styles.issuer}>
                <a
                    href="https://www.linkedin.com/learning/certificates/664439323ab3490b1adfb5a8e5fdf95a6c7f017f12e1e57f63a3b23f23f7f0be"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View on LinkedIn
                </a>
            </p>
        </div>
    </div>
);

export default Certifications;

