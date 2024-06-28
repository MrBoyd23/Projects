import React from 'react';
import '../css/Skills.css';

const skills = [
    'PHP', 'CSS', 'API', 'SEO', 'AWS', 'HTML', 'Linux', 'MySQL', 'Apache', 'cPanel', 'Plesk',
    'Ansible', 'Python', 'Node.js', 'React', 'JavaScript', 'Jira', 'GitHub', 'Grafana', 'Prometheus',
    'ServiceNow', 'LivePerson', 'WordPress', 'phpMyAdmin', 'E-commerce', 'Web Design',
    'Linux Admin', 'Node Package Name', 'Website Analytics', 'Online Marketing', 'Online Advertising',
    'Data Analytics', 'Digital Marketing', 'Bash Scripting'
];

const Skills = () => {
    return (
        <div className="skills">
            <h1><u>Skillsets</u></h1>
            <div className="skills-grid">
                {skills.map((skill, index) => (
                    <div key={index} className="skill-bubble">
                        {skill}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Skills;
