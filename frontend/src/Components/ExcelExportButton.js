import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Notification from './Notification';

const ExcelExportButton = ({ gridApi, columnDefs, Tablename }) => {
    const [notification, setNotification] = useState(null);

    const exportToExcel = () => {
        try {
            if (!gridApi) {
                throw new Error('Grid API is not available.');
            }

            const selectedRows = gridApi.getSelectedRows();
            if (selectedRows.length === 0) {
                showNotification('แจ้งเตือน: ยังไม่มีการเลือกแถว เพื่อนำออก ครับ.', 'warning');
                return;
            }

            const excludeFields = ['actions']; // Fields to exclude

            // Get ordered column headers and filter out excluded fields
            const headers = columnDefs
                .filter(col => !excludeFields.includes(col.field))
                .map(col => ({ field: col.field, headerName: col.headerName }));

            // Map selected data based on columnDefs order
            const mappedData = selectedRows.map(row =>
                headers.reduce((acc, { field, headerName }) => {
                    acc[headerName] = row[field] || ''; // Assign values by header name
                    return acc;
                }, {})
            );

            // Generate Excel file
            const worksheet = XLSX.utils.json_to_sheet(mappedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Selected Data');

            // Save file with timestamp
            const currentDate = new Date().toISOString().split('T')[0];
            const fileName = `${currentDate}_Selected_${Tablename}.xlsx`;
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAs(new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), fileName);

            showNotification('Export successful!', 'success');
        } catch (error) {
            console.error('Export Error:', error);
            showNotification('Error exporting data to Excel.', 'fail');
        }
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
    };

    return (
        <>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <button onClick={exportToExcel} className="btn btn-primary btn-sm" style={{ marginLeft: '10px', marginBottom: '10px' }}>
                Export
            </button>
        </>
    );
};

export default ExcelExportButton;
