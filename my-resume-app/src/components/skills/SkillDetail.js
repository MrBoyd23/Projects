import React from 'react';

/**
 * SkillDetail — generic placeholder for skills that don't yet have
 * custom content. Replace this component's usage for a specific skill
 * by creating a dedicated component file and adding its id to
 * CUSTOM_SKILL_IDS in src/data/skillsConfig.js.
 */
const SkillDetail = ({ name }) => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>{name}</h2>
      <p>Detailed content for <strong>{name}</strong> is coming soon.</p>
    </div>
  );
};

export default SkillDetail;
