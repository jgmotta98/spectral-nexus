import React from 'react';

const ComboBox = ({ selectedOption, onSelectChange }) => {
    const coresOptions = Array.from({ length: navigator.hardwareConcurrency || 1 }, (_, i) => i + 1);
    const defaultOption = coresOptions[0];

    return (
        <select value={selectedOption || defaultOption} onChange={onSelectChange}>
            {coresOptions.map(core => (
                <option key={core} value={`${core}`}>{`${core}`}</option>
            ))}
        </select>
    );
};

export default ComboBox;
