import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Choose a style
import styles from '../../css/SkillPage.module.css';

const Bash_Scripting = () => {
    const [code1, setCode1] = useState('');
    const [code2, setCode2] = useState('');
    const [code3, setCode3] = useState('');
    const [code4, setCode4] = useState('');
    const [showCode1, setShowCode1] = useState(false);
    const [showCode2, setShowCode2] = useState(false);
    const [showCode3, setShowCode3] = useState(false);
    const [showCode4, setShowCode4] = useState(false);

    const RAW = process.env.REACT_APP_GITHUB_RAW_BASE;
    const REPO = process.env.REACT_APP_GITHUB_REPO;
    const githubUrl1 = `${RAW}/${REPO}/main/scripts/Bash_Scripts/update_playbook_names.sh`;
    const githubUrl2 = `${RAW}/${REPO}/main/scripts/Bash_Scripts/update_bash_script_titles.sh`;
    const githubUrl3 = `${RAW}/${REPO}/main/scripts/Bash_Scripts/nftables_abuse.sh`;
    const githubUrl4 = `${RAW}/${REPO}/main/auto-commit.sh`;

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
        fetchCode(githubUrl4, setCode4);
    }, [githubUrl1, githubUrl2, githubUrl3, githubUrl4]);

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
            case 4:
                setShowCode4(!showCode4);
                break;
            default:
                break;
        }
    };

    const keyPatternsCode = `#!/usr/bin/env bash
set -euo pipefail

# For loop over servers
for server in "\${servers[@]}"; do
  echo "Processing $server"
done

# While read loop
while IFS= read -r line; do
  echo "$line"
done < input.txt

# Trap for cleanup
trap 'rm -f /tmp/lockfile' EXIT

# Conditional checks
if [[ -f "$config" && -r "$config" ]]; then
  source "$config"
fi

# Cron entry example
# 0 2 * * * /usr/local/bin/health_check.sh >> /var/log/health.log 2>&1`;

    return (
        <div className={styles.skillPage}>

            {/* Hero Section */}
            <div className={styles.hero}>
                <h1 className={styles.heroTitle}>Bash Scripting</h1>
                <p className={styles.heroTagline}>Automating server operations across a 100K+ server fleet — one script at a time</p>
                <div className={styles.heroBadges}>
                    {['bash', 'shell', 'cron', 'nftables', 'iptables', 'loops & conditionals'].map(badge => (
                        <span key={badge} className={styles.heroBadge}>{badge}</span>
                    ))}
                </div>
            </div>

            {/* Two-column section */}
            <div className={styles.twoCol}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
                    <p className={styles.sectionText}>
                        As a System Engineer III, Bash is my first tool when I need to quickly automate a repetitive server task.
                        I write scripts for log parsing, automated remediation, system health checks, and bulk operations across
                        server groups. My nftables blocking script is a real example used to mitigate DDOS attack patterns
                        detected in journal logs.
                    </p>
                </div>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Key Patterns I Use</h2>
                    <div className={styles.codeWrapper}>
                        <span className={styles.codeLabel}>bash</span>
                        <SyntaxHighlighter language="bash" style={atomDark}>
                            {keyPatternsCode}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>

            {/* Live Section */}
            <div className={styles.liveSection}>
                <h2 className={styles.liveSectionTitle}>
                    <span className={styles.liveDot}></span>
                    Live: Bash Scripts from GitHub
                </h2>
                <p className={styles.liveSubtitle}>Click to view scripts from MrBoyd23/Projects</p>

                <div className="github-code-viewer">
                    <h2>Bash Script Examples</h2>
                    <p><em>Click On The Options Below To View</em></p>

                    {/* Code 1 */}
                    <div className="code-section">
                        <button onClick={() => toggleCodeVisibility(1)}>
                            {showCode1 ? 'Hide Code' : 'Update Yaml File Name Section'}
                        </button>
                        {showCode1 && (
                            <div className="code-content">
                                <h3>Update Yaml File Name Section</h3>
                                <div className="code-wrapper">
                                    <SyntaxHighlighter language="bash" style={atomDark} className="code-block">
                                        {code1}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Code 2 */}
                    <div className="code-section">
                        <button onClick={() => toggleCodeVisibility(2)}>
                            {showCode2 ? 'Hide Code' : 'Update Bash Titles To Uppercase'}
                        </button>
                        {showCode2 && (
                            <div className="code-content">
                                <h3>Update Bash Titles To Uppercase</h3>
                                <div className="code-wrapper">
                                    <SyntaxHighlighter language="bash" style={atomDark} className="code-block">
                                        {code2}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Code 3 */}
                    <div className="code-section">
                        <button onClick={() => toggleCodeVisibility(3)}>
                            {showCode3 ? 'Hide Code' : 'Journal Logs | NFTables Block'}
                        </button>
                        {showCode3 && (
                            <div className="code-content">
                                <h3>Journal Logs | NFTables Block</h3>
                                <div className="code-wrapper">
                                    <SyntaxHighlighter language="bash" style={atomDark} className="code-block">
                                        {code3}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Code 4 */}
                    <div className="code-section">
                        <button onClick={() => toggleCodeVisibility(4)}>
                            {showCode4 ? 'Hide Code' : 'GITHUB Auto Commit'}
                        </button>
                        {showCode4 && (
                            <div className="code-content">
                                <h3>GITHUB Auto Commit</h3>
                                <div className="code-wrapper">
                                    <SyntaxHighlighter language="bash" style={atomDark} className="code-block">
                                        {code4}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Bash_Scripting;
