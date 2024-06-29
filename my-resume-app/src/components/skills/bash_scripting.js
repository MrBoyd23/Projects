import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Choose a style

const Bash_Scripting = () => {
    const [code1, setCode1] = useState('');
    const [code2, setCode2] = useState('');
    const [code3, setCode3] = useState('');
    const [code4, setCode4] = useState('');
    const [showCode1, setShowCode1] = useState(false);
    const [showCode2, setShowCode2] = useState(false);
    const [showCode3, setShowCode3] = useState(false);
    const [showCode4, setShowCode4] = useState(false);

    const githubUrl1 = 'https://raw.githubusercontent.com/MrBoyd23/Projects/main/scripts/Bash_Scripts/update_playbook_names.sh';
    const githubUrl2 = 'https://raw.githubusercontent.com/MrBoyd23/Projects/main/scripts/Bash_Scripts/update_bash_script_titles.sh';
    const githubUrl3 = 'https://raw.githubusercontent.com/MrBoyd23/Projects/main/scripts/Bash_Scripts/nftables_abuse.sh';
    const githubUrl4 = 'https://raw.githubusercontent.com/MrBoyd23/Projects/main/auto-commit.sh';

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

    return (
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
    );
};

export default Bash_Scripting;

