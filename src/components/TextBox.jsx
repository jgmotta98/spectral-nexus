// src/components/TextBox.jsx
import React from 'react';

const TextBox = ({ value, onChange }) => {

    const handleInputChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <div>
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder="Name"
            />
        </div>
    );
};

export default TextBox;
