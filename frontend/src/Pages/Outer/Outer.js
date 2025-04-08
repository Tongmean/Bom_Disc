import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchOuters, fetchHistoryLog} from '../../Ultility/Outerapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from '../Outer/DetailModal'
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
const Outer = () =>{
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState();
    const [gridApi, setGridApi] = useState(null)
    const [selectedData, setSelectedData] = useState(null);
    const [historyLog, setHistoryLog] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const columnDefs = [
        { headerName: 'No', field: 'id', checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'แบบการบรรจุ', field: 'Outer_Id', pinned: 'left'  },
        { headerName: 'รหัส Erp (Outer)', field: 'Erp_Id_Outer' },
        { headerName: 'ชื่อ Erp (Outer)', field: 'Name_Erp_Outer' },
        { headerName: 'เบอร์กล่อง (Outer)', field: 'Num_Outer' },
        { headerName: 'รหัส ERP (Inner)', field: 'Erp_Id_Inner' },
        { headerName: 'ชื่อ Erp (Inner)', field: 'Name_Erp_Inner' },
        { headerName: 'Die Cut', field: 'Die_Cut' },
        { headerName: 'จำนวน Set/ Outer', field: 'Set_Per_Outer' },
        { headerName: 'จำนวน Outer/ พาเลท', field: 'Outer_Per_pallet' },
        { headerName: 'จำนวน Set/ พาเลท', field: 'Set_Per_Pallet' },
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
            const history = await fetchHistoryLog(data.id); // API call to fetch the history log
            setHistoryLog(history);
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
        const loadouter = async () => {
          try {
            const Data = (await fetchOuters()).data;
            console.log('Data', Data)
            // const mappedData = packageData.map((i) => ({
            //     No: i.id, // Assuming you want to assign a sequential number starting at 1
            //     Outer_Id: i.Outer_Id || "-",
            //     Num_Display_Box: i.Num_Display_Box || "-",
            //     Type_Diecut: i.Type_Diecut || "-",
            //     Num_Outer: i.Num_Outer || "-",
            //     Outer_Erp_Id: i.Outer_Erp_Id || "-",
            //     Name_Outer_Erp: i.Name_Outer_Erp || "-",
            //     Set_Per_Outer: i.Set_Per_Outer || "-",
            //     Set_Per_Outer_1: i.Set_Per_Outer_1 || "-",
            //     Outer_Erp_Sticker: i.Outer_Erp_Sticker || "-",
            //     Name_Outer_Erp_Sticker: i.Name_Outer_Erp_Sticker || "-",
            //     Num_Sticker: i.Num_Sticker || "-",
            //     Outer_Per_pallet: i.Outer_Per_pallet || "-",
            //     CreateBy: i.CreateBy || "-",
            //     CreateAt: i.CreateAt || "-",
            // }));
            
            // console.log('Mapped Data', mappedData)
            setRowData(Data); // Set the users from the API response
          } catch (err) {
            setError(err.message); // Set the error message if something goes wrong
          } finally {
            setLoading(false); // Turn off the loading state once the operation is complete
          }
        };
    
        loadouter();
    }, []);

    const onGridReady = params => {
        setGridApi(params.api);
    };

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        console.log('Selected rows:', selectedRows);
    };

    const handleOnClick = () => {
        navigate('/createouter');
    };
    const handleShowEdit = (data) => {
        navigate(`/outer/${data.id}`);
    };
    return (
        <>
            <div>
                <button className='btn btn-success btn-sm' style={{ marginBottom: '10px' }} onClick={handleOnClick}>เพิ่มรายการ</button>
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename = "การบรรจุ-Outer"/>
                <ClipboardButton gridApi={gridApi} columnDefs={columnDefs} />
            </div>
            {loading ? (
               
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <Spin size="large" />
                </div>
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
                Tablename = 'การบรรจุ-Outer'
            />
        </>
    )
}

export default Outer;