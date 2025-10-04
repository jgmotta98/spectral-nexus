import React from 'react';

const ValidationErrorModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="window" style={{ width: '300px' }}>
        <div className="title-bar">
          <div className="title-bar-text"></div>
          <div className="title-bar-controls">
            <button aria-label="Close" onClick={onClose}></button>
          </div>
        </div>
        <div className="window-body text-center p-4">
          <p className="window-body text-sm" style={{ marginBottom: '15px' }}>{message}</p>
          <button onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default ValidationErrorModal;