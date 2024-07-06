// src/components/Slider.jsx
import React from 'react';

const SliderComponent = ({ value, onChange }) => {
    const handleChange = (event) => {
        onChange(Number(event.target.value));
    };

    return (
        <div>
            <label style={{display: 'Flex', alignItems: 'Center'}}>
                {value}
                <input 
                    type="range" 
                    min="10" 
                    max="40" 
                    value={value} 
                    onChange={handleChange} 
                />
            </label>
        </div>
    );
};

export default SliderComponent;
