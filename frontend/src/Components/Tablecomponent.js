import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const Tablecomponent = ({
    columnDefs,
    rowData,
    rowSelection = 'multiple',
    pagination = true,
    paginationPageSize = 20,
    defaultColDef = {
        resizable: true,
        sortable: true,
        filter: true,
        editable: true,
    },
    onGridReady,
    onSelectionChanged,
}) => {
    return (
        <div className="ag-theme-alpine" style={{ height: 'calc(100vh - 100px)', width: '100%' }}>
            <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
                rowSelection={rowSelection}
                pagination={pagination}
                paginationPageSize={paginationPageSize}
                defaultColDef={defaultColDef}
                onSelectionChanged={onSelectionChanged}
                onGridReady={onGridReady}
            />
        </div>
    );
};

export default Tablecomponent;
