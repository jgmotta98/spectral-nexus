import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import InteractiveGraph from '../components/InteractiveGraph';
import './Report.css';

const Report = () => {
  const [finalResult, setFinalResult] = useState({});
  const [selectedKey, setSelectedKey] = useState(null);
  const [reportData, setReportData] = useState(null);
  const apiUrl = 'http://127.0.0.1:8000/api/report';

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setFinalResult(data.final_result);
        setReportData(data);
        setSelectedKey(Object.keys(data.final_result)[0]);
      });
  }, []);

  const options = Object.keys(finalResult).map((key) => ({ value: key, label: key }));

  return (
    <div className="report-container">
      <h1>Report Page</h1>
      <Select options={options} onChange={(option) => setSelectedKey(option.value)} />
      {selectedKey && <h3>{selectedKey}: {finalResult[selectedKey]}</h3>}
      <div className="chart-wrapper">
        <InteractiveGraph />
      </div>
    </div>
  );
};

export default Report;
