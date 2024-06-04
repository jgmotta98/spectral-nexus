import React from 'react';
import { Link } from 'react-router-dom';

const Topbar = () => {
  return (
    <div style={{
      width: '100%',
      height: '50px',
      backgroundColor: '#333',
      position: 'fixed',
      top: 0,
      left: 0,
      overflowX: 'hidden',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      zIndex: 1000
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Home</Link>
      <Link to="/report" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Report</Link>
    </div>
  );
}

export default Topbar;
