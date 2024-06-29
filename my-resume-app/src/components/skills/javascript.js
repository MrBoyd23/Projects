import React, { useState, useEffect } from 'react';

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
                    // Filter out folders and get only files
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
                    // Filter out folders and get only files
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

    return (
        <div className="content-container">
            <h2>JavaScript Code</h2>
            <p><em>The Following Content Consists Of The Pages That Make Up This Resume</em></p>

            <h3>Main Pages:</h3>
            <div className="files-grid">
                {files.map((file, index) => (
                    <button key={index} onClick={() => handleFileClick(file)}>
                        {file.name}
                    </button>
                ))}
            </div>
            <div>
                <h3>Experience Pages:</h3>
                <div className="skills-files">
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
                    <pre className="code-block">{selectedFileContent}</pre>
                </div>
            )}
        </div>
    );
};

export default JavaScript;

