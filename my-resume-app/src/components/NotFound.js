import React from 'react';
import { Link } from 'react-router-dom';
import { codingSkills, softwareSkills } from '../data/skillsConfig';

const sectionStyle = {
  background: '#0d0d0d',
  border: '1px solid #1e1e1e',
  borderLeft: '3px solid #8b0000',
  borderRadius: '0 10px 10px 0',
  padding: '24px 28px',
  marginBottom: '22px',
};

const headingStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '1.1rem',
  color: '#fff',
  margin: '0 0 14px',
  paddingBottom: '8px',
  borderBottom: '1px solid #2d0000',
};

const linkGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
  gap: '8px',
};

const linkStyle = {
  display: 'block',
  padding: '8px 14px',
  background: 'linear-gradient(135deg, #1a0000, #3d0000)',
  border: '1px solid #8b0000',
  borderRadius: '6px',
  color: '#fff',
  textDecoration: 'none',
  fontSize: '0.8rem',
  fontFamily: "'Poppins', sans-serif",
  textAlign: 'center',
  transition: 'all 0.2s',
};

const NotFound = () => (
  <div style={{ width: '100%', padding: '20px 0' }}>
    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', color: '#cc0000', margin: '0 0 8px' }}>
        404
      </h1>
      <p style={{ color: '#aaa', fontSize: '1rem', margin: '0 0 6px' }}>
        Page not found
      </p>
      <p style={{ color: '#666', fontSize: '0.85rem' }}>
        The page you're looking for doesn't exist. Here's where you can go:
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={headingStyle}>Main Sections</h2>
      <div style={linkGridStyle}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/Experience" style={linkStyle}>Experience</Link>
        <Link to="/Education" style={linkStyle}>Education</Link>
      </div>
    </div>

    <div style={sectionStyle}>
      <h2 style={headingStyle}>Coding & Development</h2>
      <div style={linkGridStyle}>
        {codingSkills.map(({ id, label }) => (
          <Link key={id} to={`/${id}`} style={linkStyle}>{label}</Link>
        ))}
      </div>
    </div>

    <div style={sectionStyle}>
      <h2 style={headingStyle}>Software & Tools</h2>
      <div style={linkGridStyle}>
        {softwareSkills.map(({ id, label }) => (
          <Link key={id} to={`/${id}`} style={linkStyle}>{label}</Link>
        ))}
      </div>
    </div>
  </div>
);

export default NotFound;
