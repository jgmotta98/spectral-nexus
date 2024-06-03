// src/components/ComboBox.jsx
import React from 'react';

const ComboBox = ({ selectedOption, onSelectChange }) => {
    const coresOptions = Array.from({ length: navigator.hardwareConcurrency || 1 }, (_, i) => i + 1);

    return (
        <select value={selectedOption} onChange={onSelectChange}>
            <option value="">Select a core</option>
            {coresOptions.map(core => (
                <option key={core} value={`${core}`}>{`${core}`}</option>
            ))}
        </select>
    );
};

export default ComboBox;
