import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchAdditionalpackages, fetchHistoryLog} from '../../Ultility/Additionalpackageapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from '../Additionalpackage/DetailModal'
import { useNavigate } from 'react-router-dom';
const Additionalpackage = () =>{
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState();
    const [gridApi, setGridApi] = useState(null)
    const [selectedData, setSelectedData] = useState(null);
    const [historyLog, setHistoryLog] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const columnDefs = [
        { headerName: 'No', field: 'No', checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'รหัสการบรรจุที่ใส่อุปกรณ์เสริมเพิ่มมา', field: 'Additional_Package_Id' },
        { headerName: 'รหัส ERP โฟมและอุปกรณ์เสริม 1', field: 'Additional_Tool_Erp_Id_1' },
        { headerName: 'ชื่อ ERP โฟมและอุปกรณ์เสริม 1', field: 'Name_Additional_Tool_1' },
        { headerName: 'จำนวนโฟมและอุปกรณ์เสริม 1', field: 'Quantity_Additional_Tool_1' },
        { headerName: 'รหัส ERP โฟมและอุปกรณ์เสริม 2', field: 'Additional_Tool_Erp_Id_2' },
        { headerName: 'ชื่อ ERP โฟมและอุปกรณ์เสริม 2', field: 'Name_Additional_Tool_2' },
        { headerName: 'จำนวนโฟมและอุปกรณ์เสริม 2', field: 'Quantity_Additional_Tool_2' },
      

        // { headerName: 'กรอกโดย', field: 'CreateBy' },
        // { headerName: 'กรอกเมื่อ', field: 'CreateAt' },
        {
            headerName: 'Actions',
            field: 'actions',
            cellRenderer: (params) => (
                <div>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleShowDetails(params.data)}
                        style={{ marginRight: '5px' }}
                    >
                        Detail
                    </button>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleShowEdit(params.data)}
                        style={{ marginRight: '5px' }}
                    >
                        Edit
                    </button>
                </div>
            ),
        }
    ];
    const handleShowDetails = async (data) => {
        setSelectedData(data);
        try {
            const history = await fetchHistoryLog(data.No); // API call to fetch the history log
            setHistoryLog(history);
            console.log('history',history)
        } catch (err) {
            console.error('Failed to fetch history log:', err.message);
            setError(err.message);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedData(null);
        setHistoryLog([]);
    };



    useEffect(() => {
        const load = async () => {
          try {
            const packageData = (await fetchAdditionalpackages()).data;
            
            const mappedData = packageData.map(i => ({
                No: i.id,
                Additional_Package_Id: i.Additional_Package_Id,
                Additional_Tool_Erp_Id_1: i.Additional_Tool_Erp_Id_1,
                Name_Additional_Tool_1: i.Name_Additional_Tool_1,
                Quantity_Additional_Tool_1: i.Quantity_Additional_Tool_1,
                Additional_Tool_Erp_Id_2: i.Additional_Tool_Erp_Id_2,
                Name_Additional_Tool_2: i.Name_Additional_Tool_2,
                Quantity_Additional_Tool_2: i.Quantity_Additional_Tool_2,
                CreateBy: i.CreateBy,
                CreateAt: i.CreateAt,


            }));
            // console.log('Mapped Data', mappedData)
            setRowData(mappedData); // Set the users from the API response
          } catch (err) {
            setError(err.message); // Set the error message if something goes wrong
          } finally {
            setLoading(false); // Turn off the loading state once the operation is complete
          }
        };
    
        load();
    }, []);

    const onGridReady = params => {
        setGridApi(params.api);
    };

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        console.log('Selected rows:', selectedRows);
    };

    const handleOnClick = () => {
        navigate('/createadditionalpackage');
    };
    const handleShowEdit = (data) => {
        navigate(`/additionalpackage/${data.No}`);
    };
    return (
        <>
            <div>
                <button className='btn btn-success btn-sm' style={{ marginBottom: '10px' }} onClick={handleOnClick}>เพิ่มรายการ</button>
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename = "โฟมสำเร็จรูปอุปกรณ์เสริม"/>
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
            <DetailModal
                show={showModal}
                onHide={handleCloseModal}
                data={selectedData}
                historyLog={historyLog}
                Tablename = 'โฟมสำเร็จรูปอุปกรณ์เสริม'
            />
        </>
    )
}

export default Additionalpackage;