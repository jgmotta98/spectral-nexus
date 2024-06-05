import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import InteractiveGraph from '../components/InteractiveGraph';
import './Report.css';

const Report = () => {
  const [finalResult, setFinalResult] = useState({});
  const [reportData, setReportData] = useState(null);
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

  const selectedInput = reportData?.textBoxValue || {};
  const selectedComponentData = reportData?.components_data_filter?.[selectedKey] || {};
  const selectedInputListData = reportData?.input_list_dict?.[selectedKey] || {};
  const selectedComponentSpectra = reportData?.spectral_list?.[selectedKey] || {};
  const selectedInputListSpectra = reportData?.input_df?.[selectedInput] || {};
  

  if (!selectedKey) {
    return <div>Loading...</div>;
  }

  return (
    <div className="report-container">
      <Select 
        options={options} 
        value={options.find(option => option.value === selectedKey)} 
        onChange={(option) => setSelectedKey(option.value)} 
      />
      {selectedKey && <h3>{selectedKey}: {(finalResult[selectedKey]).toFixed(2)}%</h3>}
      <InteractiveGraph 
        selectedCompound={selectedKey}
        selectedInput={selectedInput}
        componentData={selectedComponentData} 
        inputListData={selectedInputListData}
        componentSpectra={selectedComponentSpectra}
        inputSpectra={selectedInputListSpectra}
      />
      <button onClick={handleReportDownload}>Download Relatório</button>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Report;
