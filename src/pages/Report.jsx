import React from 'react';
import InteractiveGraph from '../components/InteractiveGraph';
import './Report.css';

const Report = () => {
  return (
    <div className="report-container">
      <h1>Report Page</h1>
      <div className="chart-wrapper">
        <InteractiveGraph />
      </div>
    </div>
  );
};

export default Report;
