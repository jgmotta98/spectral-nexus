// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Home from './pages/Home';
import Report from './pages/Report';
import './App.css';

const App = () => {
  return (
    <div className="App" style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '250px', padding: '20px', width: 'calc(100% - 250px)', height: '100vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
