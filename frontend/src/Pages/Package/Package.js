import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchPackages} from '../../Ultility/Packageapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
const Package = () =>{
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState();
    const [gridApi, setGridApi] = useState(null)

    const columnDefs = [
        { headerName: 'No', field: 'No', checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'รหัสกล่อง', field: 'Display_Box_id' },
        { headerName: 'รหัส ERP กล่อง', field: 'Display_Box_Erp_Id' },
        { headerName: 'ชื่อ ERP กล่อง', field: 'Name_Display_Box_Erp' },
        { headerName: 'เบอร์กล่อง', field: 'Num_Display_Box' },
        { headerName: 'กลุ่ม', field: 'Display_Box_Group' },
        { headerName: 'กรอกโดย', field: 'CreateBy' },
        { headerName: 'กรอกเมื่อ', field: 'CreateAt' },
        {
            headerName: 'Actions',
            field: 'actions',
            cellRenderer: (params) => (
                <div>
                    <button
                        className="btn btn-primary btn-sm"
                        // onClick={() => handleShowDetails(params.data)}
                        style={{ marginRight: '5px' }}
                    >
                        Detail
                    </button>
                    <button
                        className="btn btn-secondary btn-sm"
                        // onClick={() => handleShowEdit(params.data)}
                        style={{ marginRight: '5px' }}
                    >
                        Edit
                    </button>
                </div>
            ),
        }
    ]


    useEffect(() => {
        const loadpackages = async () => {
          try {
            const packageData = await fetchPackages();
            
            const mappedData = packageData.map(i => ({
                No: i.id,
                Display_Box_id: i.Display_Box_id,
                Display_Box_Erp_Id: i.Display_Box_Erp_Id,
                Name_Display_Box_Erp: i.Name_Display_Box_Erp,
                Num_Display_Box: i.Num_Display_Box,
                Display_Box_Group: i.Display_Box_Group,
                CreateBy: i.CreateBy,
                CreateAt: i.CreateAt

            }));
            // console.log('Mapped Data', mappedData)
            setRowData(mappedData); // Set the users from the API response
          } catch (err) {
            setError(err.message); // Set the error message if something goes wrong
          } finally {
            setLoading(false); // Turn off the loading state once the operation is complete
          }
        };
    
        loadpackages();
    }, []);

    const onGridReady = params => {
        setGridApi(params.api);
    };

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        console.log('Selected rows:', selectedRows);
    };


    return (
        <>
            <div>
                <button className='btn btn-success btn-sm' style={{ marginBottom: '10px' }}>เพิ่มรายการ</button>
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename = "Package"/>
                <ClipboardButton gridApi={gridApi} columnDefs={columnDefs} />
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div style={{ color: 'red' }}>{`Error: ${error}`}</div>
            ) : (
                <Tablecomponent
                    columnDefs={columnDefs}
                    rowData={rowData}
                    onGridReady={onGridReady}
                    onSelectionChanged={onSelectionChanged}
                />
            )}
        </>
    )
}

export default Package;