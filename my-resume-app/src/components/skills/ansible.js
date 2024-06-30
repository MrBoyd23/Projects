import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../../css/styles.css'; // Ensure this is the path to your global styles

const Ansible = () => {
    const [playbooks, setPlaybooks] = useState([]);
    const [selectedPlaybookContent, setSelectedPlaybookContent] = useState(null);

    useEffect(() => {
        const fetchPlaybooks = async () => {
            const playbooksUrl = 'https://api.github.com/repos/MrBoyd23/Projects/contents/scripts/Ansible/playbooks';
            try {
                const response = await fetch(playbooksUrl);
                if (response.ok) {
                    const playbooksData = await response.json();
                    const playbooksFiltered = playbooksData.filter(item => item.type === 'file');
                    setPlaybooks(playbooksFiltered);
                } else {
                    console.error('Failed to fetch playbooks:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching playbooks:', error);
            }
        };

        fetchPlaybooks();
    }, []);

    const handlePlaybookClick = async (playbook) => {
        const playbookUrl = playbook.download_url;
        try {
            const response = await fetch(playbookUrl);
            if (response.ok) {
                const playbookContent = await response.text();
                setSelectedPlaybookContent(playbookContent);
            } else {
                console.error('Failed to fetch playbook content:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching playbook content:', error);
        }
    };

    return (
        <div className="github-code-viewer"> {/* Using the className from bash_scripting.js */}
            <h2>Ansible Playbooks</h2>
            <p><em>Explore Ansible Playbooks from GitHub</em></p>

            <div className="playbooks-grid"> {/* Keeping the className as playbooks-grid */}
                {playbooks.map((playbook, index) => (
                    <button key={index} className="playbook-button" onClick={() => handlePlaybookClick(playbook)}>
                        {playbook.name}
                    </button>
                ))}
            </div>

            {selectedPlaybookContent && (
                <div>
                    <h3>Selected Playbook Content</h3>
                    <div className="code-content"> {/* Using the className from bash_scripting.js */}
                        <SyntaxHighlighter language="yaml" style={atomDark}>
                            {selectedPlaybookContent}
                        </SyntaxHighlighter>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ansible;

