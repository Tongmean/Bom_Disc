import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchOuters, fetchHistoryLog} from '../../Ultility/Outerapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from '../Outer/DetailModal'
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
        { headerName: 'No', field: 'No', checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'รหัส Outer', field: 'Outer_Id' },
        { headerName: 'เบอร์กล่อง', field: 'Num_Display_Box' },
        { headerName: 'ลักษณะ Die Cut', field: 'Type_Diecut' },
        { headerName: 'เบอร์ Outer', field: 'Num_Outer' },
        { headerName: 'รหัส ERP', field: 'Outer_Erp_Id' },
        { headerName: 'ชื่อ Outer', field: 'Name_Outer_Erp' },
        { headerName: 'จำนวน Set/ Outer', field: 'Set_Per_Outer' },
        { headerName: 'จำนวน Set/ Outer_1', field: 'Set_Per_Outer_1' },
        { headerName: 'รหัส ERP Sticker', field: 'Outer_Erp_Sticker' },
        { headerName: 'ชื่อ ERP Sticker', field: 'Name_Outer_Erp_Sticker' },
        { headerName: 'จำนวน Sticker', field: 'Num_Sticker' },
        { headerName: 'จำนวน Outer/ พาเลท', field: 'Outer_Per_pallet' },
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
            const packageData = (await fetchOuters()).data;
        
            const mappedData = packageData.map((i) => ({
                No: i.id, // Assuming you want to assign a sequential number starting at 1
                Outer_Id: i.Outer_Id || "-",
                Num_Display_Box: i.Num_Display_Box || "-",
                Type_Diecut: i.Type_Diecut || "-",
                Num_Outer: i.Num_Outer || "-",
                Outer_Erp_Id: i.Outer_Erp_Id || "-",
                Name_Outer_Erp: i.Name_Outer_Erp || "-",
                Set_Per_Outer: i.Set_Per_Outer || "-",
                Set_Per_Outer_1: i.Set_Per_Outer_1 || "-",
                Outer_Erp_Sticker: i.Outer_Erp_Sticker || "-",
                Name_Outer_Erp_Sticker: i.Name_Outer_Erp_Sticker || "-",
                Num_Sticker: i.Num_Sticker || "-",
                Outer_Per_pallet: i.Outer_Per_pallet || "-",
                CreateBy: i.CreateBy || "-",
                CreateAt: i.CreateAt || "-",
            }));
            
            // console.log('Mapped Data', mappedData)
            setRowData(mappedData); // Set the users from the API response
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
        navigate(`/outer/${data.No}`);
    };
    return (
        <>
            <div>
                <button className='btn btn-success btn-sm' style={{ marginBottom: '10px' }} onClick={handleOnClick}>เพิ่มรายการ</button>
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename = "Outer"/>
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
                Tablename = 'Outer'
            />
        </>
    )
}

export default Outer;