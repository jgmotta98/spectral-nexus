// src/components/FileSearch.jsx
import React from 'react';

const FileSearch = ({ onFileSelect }) => {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "text/csv") {
            onFileSelect(file);
        } else {
            alert("Please select a CSV file.");
        }
    };

    return (
        <div>
            <input type="file" accept=".csv" onChange={handleFileChange} />
        </div>
    );
};

export default FileSearch;
