// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Topbar from './Topbar';
import Home from './pages/Home';
import Report from './pages/Report';
import './App.css';

const App = () => {
  return (
    <div className="App" style={{ paddingTop: '0px' }}>
    <Topbar />
        <div style={{ padding: '0px', width: '100%', height: 'calc(70vh)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
