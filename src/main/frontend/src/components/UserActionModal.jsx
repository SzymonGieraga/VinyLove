import React from 'react';

const UserActionModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>&times;</button>
                <h2>{title}</h2>
                {children || <p>Funkcjonalność w budowie...</p>}
            </div>
        </div>
    );
};

export default UserActionModal;