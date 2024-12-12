import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import { fetchEmarks, fetchHistoryLog } from '../../Ultility/Emarkapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from '../Emark/DetailModal';
import { useNavigate } from 'react-router-dom';

const Emark = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [historyLog, setHistoryLog] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const columnDefs = [
        { headerName: 'No', field: 'id', checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'Emark ID', field: 'Emark_Id'},
        { headerName: 'Part Number', field: 'Part_No' },
        { headerName: 'Brake Pad', field: 'Brake_Pad' },
        { headerName: 'Material', field: 'Material' },
        { headerName: 'Type', field: 'Type_Emark' },
        { headerName: 'Approval Code', field: 'Approval_Code' },
        { headerName: 'Revision', field: 'Revision' },
        { headerName: 'Approved Date', field: 'Approved_Date' },
        { headerName: 'Status', field: 'Status' },
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
            console.log('history',history)
            console.log('data',data)
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
        const loadEmarkData = async () => {
            try {
                const Data = (await fetchEmarks()).data;

                // const mappedData = packageData.map((i) => ({
                //     Emark_Id: i.Emark_Id,
                //     Part_No: i.Part_No,
                //     Brake_Pad: i.Brake_Pad,
                //     Material: i.Material,
                //     Type_Emark: i.Type_Emark,
                //     Approval_Code: i.Approval_Code,
                //     Revision: i.Revision,
                //     Approved_Date: i.Approved_Date,
                //     Status: i.Status,
                // }));
                setRowData(Data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadEmarkData();
    }, []);

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        console.log('Selected rows:', selectedRows);
    };

    const handleOnClick = () => {
        navigate('/createEmark');
    };

    const handleShowEdit = (data) => {
        navigate(`/emark/${data.id}`);
    };

    return (
        <>
            <div>
                <button className="btn btn-success btn-sm" style={{ marginBottom: '10px' }} onClick={handleOnClick}>
                    เพิ่มรายการ
                </button>
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename="Emark" />
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
                Tablename="Emark"
            />
        </>
    );
};

export default Emark;
