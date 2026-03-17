import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Choose a style
import styles from '../../css/SkillPage.module.css';

const GitHubCodeViewer = () => {
    const [code1, setCode1] = useState('');
    const [code2, setCode2] = useState('');
    const [code3, setCode3] = useState('');
    const [showCode1, setShowCode1] = useState(false);
    const [showCode2, setShowCode2] = useState(false);
    const [showCode3, setShowCode3] = useState(false);

    const githubUrl1 = 'https://raw.githubusercontent.com/MrBoyd23/Projects/main/my-resume-app/src/css/Header.module.css';
    const githubUrl2 = 'https://raw.githubusercontent.com/MrBoyd23/Projects/main/my-resume-app/src/css/Skills.css';
    const githubUrl3 = 'https://raw.githubusercontent.com/MrBoyd23/Projects/main/my-resume-app/src/css/styles.css';

    useEffect(() => {
        const fetchCode = async (url, setter) => {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const codeText = await response.text();
                    setter(codeText);
                } else {
                    console.error('Failed to fetch code:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching code:', error);
            }
        };

        fetchCode(githubUrl1, setCode1);
        fetchCode(githubUrl2, setCode2);
        fetchCode(githubUrl3, setCode3);
    }, [githubUrl1, githubUrl2, githubUrl3]);

    const toggleCodeVisibility = (codeNumber) => {
        switch (codeNumber) {
            case 1:
                setShowCode1(!showCode1);
                break;
            case 2:
                setShowCode2(!showCode2);
                break;
            case 3:
                setShowCode3(!showCode3);
                break;
            default:
                break;
        }
    };

    const modulesVsGlobalCode = `/* CSS Module — scoped to this component */
:local(.heroTitle) {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

/* Usage in JSX */
/* <h1 className={styles.heroTitle}>Title</h1> */

/* Compiles to a unique class: */
/* .HeroSection_heroTitle__3xK2a { ... } */

/* vs. Global CSS selector */
/* h1.hero-title { color: #fff; } */
/* — applies everywhere, causes leakage */`;

    return (
        <div className={styles.skillPage}>

            {/* Hero Section */}
            <div className={styles.hero}>
                <h1 className={styles.heroTitle}>CSS</h1>
                <p className={styles.heroTagline}>Styling the web — from global resets to scoped CSS Modules and responsive layouts</p>
                <div className={styles.heroBadges}>
                    {['CSS Modules', 'Flexbox', 'CSS Grid', 'Variables', 'Media Queries', 'Animations'].map(badge => (
                        <span key={badge} className={styles.heroBadge}>{badge}</span>
                    ))}
                </div>
            </div>

            {/* Two-column section */}
            <div className={styles.twoCol}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
                    <p className={styles.sectionText}>
                        I work with CSS daily in two contexts — as a System Engineer building internal dashboards and tools,
                        and as the developer of this resume site. I've migrated this site from global CSS to CSS Modules for
                        proper scoping, and use CSS Grid/Flexbox for all layouts. I also write performance-focused CSS:
                        minimal repaints, hardware-accelerated transitions, and critical-path inlining.
                    </p>
                </div>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>CSS Modules vs Global CSS</h2>
                    <div className={styles.codeWrapper}>
                        <span className={styles.codeLabel}>css</span>
                        <SyntaxHighlighter language="css" style={atomDark}>
                            {modulesVsGlobalCode}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>

            {/* Live Section */}
            <div className={styles.liveSection}>
                <h2 className={styles.liveSectionTitle}>
                    <span className={styles.liveDot}></span>
                    Live: CSS Files Powering This Site
                </h2>
                <p className={styles.liveSubtitle}>The CSS below is actively styling what you're reading right now</p>

                <div className="github-code-viewer">
                    <h2>CSS Code Examples</h2>
                    <p><em>Click On The Options Below To View</em></p>
                    <p>The Information Listed Below Is Actively Being Used To Style This Website</p>

                    {/* Code 1 */}
                    <div style={{ marginBottom: '10px' }}>
                        <button onClick={() => toggleCodeVisibility(1)}>
                            {showCode1 ? 'Hide Code' : 'Resume Header CSS'}
                        </button>
                        {showCode1 && (
                            <div style={{ marginTop: '10px' }}>
                                <h3>Resume Header CSS</h3>
                                <SyntaxHighlighter language="jsx" style={atomDark}>
                                    {code1}
                                </SyntaxHighlighter>
                            </div>
                        )}
                    </div>

                    {/* Code 2 */}
                    <div style={{ marginBottom: '10px' }}>
                        <button onClick={() => toggleCodeVisibility(2)}>
                            {showCode2 ? 'Hide Code' : 'Resume Skills CSS'}
                        </button>
                        {showCode2 && (
                            <div style={{ marginTop: '10px' }}>
                                <h3>Resume Skills CSS</h3>
                                <SyntaxHighlighter language="jsx" style={atomDark}>
                                    {code2}
                                </SyntaxHighlighter>
                            </div>
                        )}
                    </div>

                    {/* Code 3 */}
                    <div style={{ marginBottom: '10px' }}>
                        <button onClick={() => toggleCodeVisibility(3)}>
                            {showCode3 ? 'Hide Code' : 'Resume Styles CSS Code'}
                        </button>
                        {showCode3 && (
                            <div style={{ marginTop: '10px' }}>
                                <h3>Resume Styles CSS Code</h3>
                                <SyntaxHighlighter language="jsx" style={atomDark}>
                                    {code3}
                                </SyntaxHighlighter>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default GitHubCodeViewer;
