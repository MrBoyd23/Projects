import React from 'react';
import styles from '../css/Education.module.css'; // Correct import

const Education = () => {
    return (
        <div className={styles.education}> {/* Use styles.education */}
            <h2 className={styles.heading}>Education</h2> {/* Add class for h2 */}
            <div className={styles.educationItem}>
                <h3 className={styles.schoolName}>Mesa Community College</h3>
                <p>Associates in Applied Science, Administration of Justice | 2003 - 2006</p>
                <p>Courses: CIS 126DL | LINUX Operating System</p> {/* New section */}
            </div>
            <div className={styles.educationItem}>
                <h3 className={styles.schoolName}>Mesa High School</h3>
                <p>High School, General Studies | 2000 - 2003</p>
                <p>Grade: A</p>
                <p>Activities and societies:</p>
                <ul>
                    <li><a className={`${styles.turquoiseLink} ${styles.italic}`} href="https://www.deca.org/hs" target="_blank" rel="noopener noreferrer"><b>DECA</b></a></li>
                    <li>JV and Varsity Basketball Team</li>
                    <li>Computer Technology</li>
                </ul>
            </div>
        </div>
    );
};

export default Education;

