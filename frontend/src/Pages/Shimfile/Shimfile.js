import React, { useState, useEffect } from 'react';
import { baseURLshim } from '../../Ultility/ApiSetup/api';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchShimfiles, fetchHistoryLog} from '../../Ultility/Shimfileapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import { useNavigate } from 'react-router-dom';
import DetailModal from '../Shimfile/DetailModal'

const Shimfile = () =>{
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState();
    const [gridApi, setGridApi] = useState(null)
    const [selectedData, setSelectedData] = useState(null);
    const [historyLog, setHistoryLog] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const columnDefs = [
        { headerName: 'No', field: 'id' , checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'Compact No (ปรับ)', field: 'shim_no' },
        { headerName: 'File name', field: 'originalname' },
        { headerName: 'File path', field: 'unqiuename' },
        {
            headerName: 'Actions',
            field: 'actions',
            cellRenderer: (params) => (
                <div>
                    <>
                        
                        <a
                            href={`${baseURLshim}/${encodeURIComponent(params.data.unqiuename)}`} // Use drawingPath as the link
                            target="_blank" // Open link in new tab
                            rel="noopener noreferrer" // Security best practice
                            >
                            <button
                                className="btn btn-warning btn-sm"
                                style={{ marginRight: '5px' }}
                            >
                                S
                            </button>
                        </a>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleShowDetails(params.data)}
                            style={{ marginRight: '5px' }}
                        >
                            Detail
                        </button>
                        
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleShowEdit(params.data.id)}
                            style={{ marginRight: '5px' }}
                        >
                            Edit
                        </button>
                    </>
                </div>
            ),
        },


        // { headerName: 'กรอกโดย', field: 'create_by' },
        // { headerName: 'กรอกเมื่อ', field: 'create_at' },
    ];

    const handleShowDetails = async (data) => {
        setSelectedData(data);
        console.log('data', data)
        try {
            const history = await fetchHistoryLog(data.id); // API call to fetch the history log
            setHistoryLog(history);
            console.log('history', history)
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
            const Data = (await fetchShimfiles()).data;
            console.log('aa', Data)
            setRowData(Data); // Set the users from the API response
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
        navigate('/createshimfile');
    };
    const handleShowEdit = (data) => {
        navigate(`/shimfile/${data}`);
    };
    return (
        <>
            <div>
                <button className='btn btn-success btn-sm' style={{ marginBottom: '10px' }} onClick={handleOnClick}>เพิ่มรายการ</button>
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename = "shim"/>
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
                Tablename = 'shim'
            />
        </>
    )
}

export default Shimfile;