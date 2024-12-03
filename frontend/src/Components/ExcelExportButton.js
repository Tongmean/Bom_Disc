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

            const excludeFields = ['Actions']; // Fields to exclude
            const headers = columnDefs.reduce((acc, col) => {
                // Only add fields that are not in the exclude list
                if (!excludeFields.includes(col.field)) {
                    acc[col.field] = col.headerName;
                }
                return acc;
            }, {});

            // Filter out the excluded fields from data rows
            const mappedData = selectedRows.map(row => {
                const mappedRow = {};
                for (const key in row) {
                    if (headers[key]) {  // Only include keys that are in the headers
                        mappedRow[headers[key]] = row[key] || ''; // Map data only to included columns
                    }
                }
                return mappedRow;
            });

            const worksheet = XLSX.utils.json_to_sheet(mappedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Selected Data');
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const currentDate = new Date().toISOString().split('T')[0];
            saveAs(blob, `${currentDate}_Selected_${Tablename}.xlsx`);
            showNotification('Export successful!', 'success');
        } catch (error) {
            showNotification('Error exporting data to Excel.', 'fail');
        }
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
                onClick={exportToExcel}
                className="btn btn-primary btn-sm"
                style={{ marginLeft: '10px', marginBottom: '10px' }}
            >
                Export
            </button>
        </>
    );
};

export default ExcelExportButton;