import React from 'react';

const Notification = ({ message, type, onClose }) => {
    const getNotificationStyles = () => {
        switch (type) {
            case 'success':
                return {
                    backgroundColor: 'green',
                    color: 'white',
                };
            case 'fail':
                return {
                    backgroundColor: 'red',
                    color: 'white',
                };
            case 'warning':
                return {
                    backgroundColor: 'orange',
                    color: 'white',
                };
            default:
                return {};
        }
    };

    return (
        <div
            style={{
                ...getNotificationStyles(),
                padding: '10px',
                borderRadius: '5px',
                position: 'fixed', // Changed from 'absolute' to 'fixed' for better floating behavior
                top: '10px',
                right: '10px',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '300px',
                boxSizing: 'border-box', // Ensures padding is considered in width
            }}
        >
            <span>{message}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '16px',
                    cursor: 'pointer',
                }}
            >
                &#10005;
            </button>
        </div>
    );
};

export default Notification;
