import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const JavaScript = () => {
    const [files, setFiles] = useState([]);
    const [selectedFileContent, setSelectedFileContent] = useState(null);
    const [skillsFiles, setSkillsFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            const repositoryUrl = 'https://api.github.com/repos/MrBoyd23/Projects/contents/my-resume-app/src/components';
            try {
                const response = await fetch(repositoryUrl);
                if (response.ok) {
                    const filesData = await response.json();
                    const filesFiltered = filesData.filter(item => item.type === 'file');
                    setFiles(filesFiltered);
                } else {
                    console.error('Failed to fetch files:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };

        fetchFiles();
    }, []);

    useEffect(() => {
        const fetchSkillsFiles = async () => {
            const skillsFolderUrl = 'https://api.github.com/repos/MrBoyd23/Projects/contents/my-resume-app/src/components/skills';
            try {
                const response = await fetch(skillsFolderUrl);
                if (response.ok) {
                    const skillsFilesData = await response.json();
                    const skillsFilesFiltered = skillsFilesData.filter(item => item.type === 'file');
                    setSkillsFiles(skillsFilesFiltered);
                } else {
                    console.error('Failed to fetch skills files:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching skills files:', error);
            }
        };

        fetchSkillsFiles();
    }, []);

    const handleFileClick = async (file) => {
        const fileUrl = file.download_url;
        try {
            const response = await fetch(fileUrl);
            if (response.ok) {
                const fileContent = await response.text();
                setSelectedFileContent(fileContent);
            } else {
                console.error('Failed to fetch file content:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching file content:', error);
        }
    };

    const keyPatternsCode = `// async/await with try/catch
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
  } catch (err) {
    console.error('Fetch failed:', err);
  }
};

// Promise.all for parallel fetches
const [users, posts] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
]);

// Optional chaining
const city = user?.address?.city ?? 'Unknown';

// Array destructuring
const [first, ...rest] = items;

// useEffect hook pattern
useEffect(() => {
  fetchData(apiUrl).then(setData);
}, [apiUrl]);`;

    return (
        <div className={styles.skillPage}>

            {/* Hero Section */}
            <div className={styles.hero}>
                <h1 className={styles.heroTitle}>JavaScript</h1>
                <p className={styles.heroTagline}>The language powering this resume — from async API calls to React component logic</p>
                <div className={styles.heroBadges}>
                    {['ES2022+', 'async/await', 'Promises', 'DOM APIs', 'fetch', 'React'].map(badge => (
                        <span key={badge} className={styles.heroBadge}>{badge}</span>
                    ))}
                </div>
            </div>

            {/* Two-column section */}
            <div className={styles.twoCol}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
                    <p className={styles.sectionText}>
                        JavaScript is the primary language for this resume site and for scripting browser-side monitoring
                        tools and dashboards. I use modern ES2022+ features: optional chaining, nullish coalescing,
                        async/await over raw Promises, and Array methods (map, filter, reduce) for data transformation.
                        Every API call on this site uses the fetch API with proper error handling.
                    </p>
                </div>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Key Patterns</h2>
                    <div className={styles.codeWrapper}>
                        <span className={styles.codeLabel}>javascript</span>
                        <SyntaxHighlighter language="javascript" style={atomDark}>
                            {keyPatternsCode}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>

            {/* Live Section */}
            <div className={styles.liveSection}>
                <h2 className={styles.liveSectionTitle}>
                    <span className={styles.liveDot}></span>
                    Live: This Site's Component Source
                </h2>
                <p className={styles.liveSubtitle}>Browse the actual JavaScript files that make up this resume</p>

                <div className="github-code-viewer">
                    <h2>JavaScript Code</h2>
                    <p><em>The Following Content Consists Of The Pages That Make Up This Resume</em></p>

                    <h3>Main Pages:</h3>
                    <div className="code-section">
                        {files.map((file, index) => (
                            <button key={index} onClick={() => handleFileClick(file)}>
                                {file.name}
                            </button>
                        ))}
                    </div>
                    <div>
                        <h3>Experience Pages:</h3>
                        <div className="code-section">
                            {skillsFiles.map((file, index) => (
                                <button key={index} onClick={() => handleFileClick(file)}>
                                    {file.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    {selectedFileContent && (
                        <div>
                            <h3>Selected File Content</h3>
                            <div className="code-wrapper">
                                <SyntaxHighlighter language="javascript" style={atomDark}>
                                    {selectedFileContent}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default JavaScript;
