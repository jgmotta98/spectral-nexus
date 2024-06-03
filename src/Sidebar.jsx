// src/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{
      width: '250px',
      height: '100vh',
      backgroundColor: '#333',
      position: 'fixed',
      left: 0,
      top: 0,
      overflowX: 'hidden',
      paddingTop: '10px',
      paddingLeft: '10px',
      zIndex: 1000  // Make sure sidebar is on top
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'block', margin: '10px 0' }}>Home</Link>
      <Link to="/report" style={{ color: 'white', textDecoration: 'none', display: 'block', margin: '10px 0' }}>Report</Link>
    </div>
  );
}

export default Sidebar;
