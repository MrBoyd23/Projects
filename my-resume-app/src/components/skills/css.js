import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Choose a style

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

    return (
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
                        <h3>Code 1</h3>
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
                        <h3>Code 2</h3>
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
                        <h3>Code 3</h3>
                        <SyntaxHighlighter language="jsx" style={atomDark}>
                            {code3}
                        </SyntaxHighlighter>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GitHubCodeViewer;
