import React, { useState } from 'react';
import Notification from './Notification';

const ClipboardButton = ({ gridApi }) => {
    const [notification, setNotification] = useState(null);
    // console.log('gridApi', gridApi)

    const copySelectedRowsToClipboard = () => {
        if (!gridApi) {
            console.error('Grid API is not available.');
            return;
        }

        const selectedRows = gridApi.getSelectedRows();
        if (!Array.isArray(selectedRows) || selectedRows.length === 0) {
            showNotification('No rows selected to copy.', 'warning');
            return;
        }
        console.log('selectedRows', selectedRows)

        const cleanedRows = selectedRows.map(({ CreateBy, CreateAt, create_at,create_by, originalname , unqiuename , path , ...rest }) => rest);
        const tsvData = cleanedRows
            .map(row => 
                Object.values(row)
                    .map(value => String(value).replace(/\n/g, ''))  // Convert to string and remove all newlines
                    .join('\t')
            )
            .join('\n');



        const copyToClipboard = (text) => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showNotification('Copied to clipboard successfully!', 'success');
            } catch (err) {
                console.error('Failed to copy:', err);
                showNotification('Failed to copy to clipboard.', 'fail');
            }
            document.body.removeChild(textarea);
        };

        copyToClipboard(tsvData);
        console.log('tsvData', tsvData)
        console.log('cleanedRows', cleanedRows)
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
    };

    return (
        <>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <button
                onClick={copySelectedRowsToClipboard}
                className="btn btn-secondary btn-sm"
                style={{ marginLeft: '10px', marginBottom: '10px' }}
            >
                Copy
            </button>
        </>
    );
};

export default ClipboardButton;
