// src/components/NumberInput.jsx
import React from 'react';

const NumberInput = ({ value, onChange, ...rest }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <input
      type="number"
      value={value}
      onChange={handleChange}
      {...rest}
    />
  );
};

export default NumberInput;
