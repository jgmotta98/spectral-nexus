import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import InteractiveGraph from '../components/InteractiveGraph';
import './Report.css';

const Report = () => {
  const [finalResult, setFinalResult] = useState({});
  const [selectedKey, setSelectedKey] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const handleReportDownload = async () => {
    setLoading(true);
    const response = await fetch(apiUrl, {
      method: 'POST'
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setLoading(false);
  };

  const options = Object.keys(finalResult).map((key) => ({ value: key, label: key }));

  return (
    <div className="report-container">
      <h1>Report Page</h1>
      <Select options={options} onChange={(option) => setSelectedKey(option.value)} />
      {selectedKey && <h3>{selectedKey}: {finalResult[selectedKey]}</h3>}
      <InteractiveGraph />
      <button onClick={handleReportDownload}>Download Report</button>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Report;
