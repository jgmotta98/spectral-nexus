import React from 'react';

const HelpModal = ({ text, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="modal-content window" 
                onClick={(e) => e.stopPropagation()}
                style={{ width: '400px', maxHeight: '80vh', overflowY: 'auto' }}
            >
                <div className="title-bar">
                    <div className="title-bar-text"></div>
                    <div className="title-bar-controls">
                        <button 
                            aria-label="Close" 
                            onClick={onClose}
                            className="close-button"
                        />
                    </div>
                </div>

                <div className="window-body text-lg text-center" style={{ padding: '15px' }}>
                    <p 
                        dangerouslySetInnerHTML={{ __html: text }}
                    />
                    <br />
                </div>
            </div>
        </div>
    );
};

export default HelpModal;