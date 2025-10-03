import React, { useState } from 'react';
import InfoIcon from '../assets/msg_information-2.png'; 

const InputGroup = ({
  label,
  children,
  name,
  showInfoIcon = true,
  titleText, 
  infoPopupText, 
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  if (!showInfoIcon) {
    return (
      <div className="input-group">
        <label htmlFor={name}>{label}</label>
        {children}
      </div>
    );
  }

  return (
    <div className="input-group">
      <label htmlFor={name}>
        {label}
        <span
          className="info-icon-container"
          onMouseEnter={() => infoPopupText && setIsPopupVisible(true)}
          onMouseLeave={() => infoPopupText && setIsPopupVisible(false)}
          title={!infoPopupText ? (titleText || `Info ${label}`) : undefined}
          style={{ position: 'relative', display: 'inline-block' }}
        >
          <img
            src={InfoIcon}
            alt="info"
            style={{ width: '16px', height: '16px', verticalAlign: 'middle', marginLeft: '5px' }}
          />

          {infoPopupText && isPopupVisible && (
            <div
              className="win98-systray-tooltip"
              style={{
                position: 'absolute',
                bottom: '100%', 
                left: '0%', 
                zIndex: 10,
                marginBottom: '10px', 
                minWidth: '20rem',
              }}
            >
              {infoPopupText}
            </div>
          )}
        </span>
      </label>
      {children}
    </div>
  );
};

export default InputGroup;