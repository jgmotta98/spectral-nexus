// src/components/ToggleSwitch.jsx
import React from 'react';

const ToggleSwitch = ({ isToggled, onToggle }) => {
    return (
        <label>
            <input
                type="checkbox"
                checked={isToggled}
                onChange={onToggle}
            />
            <span style={{ marginLeft: '8px' }}>
                {isToggled ? 'Usar paralelização: On' : 'Usar paralelização: Off'}
            </span>
        </label>
    );
};

export default ToggleSwitch;
