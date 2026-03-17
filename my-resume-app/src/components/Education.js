import React from 'react';
import styles from '../css/Education.module.css';

const Education = () => (
    <div className={styles.education}>
        <h2 className={styles.heading}>Education</h2>

        {/* ── Mesa Community College ── */}
        <div className={styles.educationItem}>
            <h3 className={styles.schoolName}>Mesa Community College</h3>
            <p className={styles.degree}>
                <span className={styles.degreeLabel}>Associates in Applied Science</span> — Administration of Justice
            </p>
            <span className={styles.year}>2006</span>

            <hr className={styles.sectionDivider} />
            <p className={styles.detailLabel}>Relevant Coursework</p>
            <ul className={styles.tagsList}>
                <li><span className={styles.tag}>CIS 126DL — Linux Operating System</span></li>
            </ul>
        </div>

        {/* ── Mesa High School ── */}
        <div className={styles.educationItem}>
            <h3 className={styles.schoolName}>Mesa High School</h3>
            <p className={styles.degree}>
                <span className={styles.degreeLabel}>High School Diploma</span> — General Studies
            </p>
            <span className={styles.year}>2000 – 2003</span>

            <hr className={styles.sectionDivider} />
            <p className={styles.detailLabel}>Activities &amp; Societies</p>
            <ul className={styles.tagsList}>
                <li><span className={styles.tag}>Computer Technology</span></li>
            </ul>
        </div>
    </div>
);

export default Education;
