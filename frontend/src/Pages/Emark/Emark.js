import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import { fetchEmarks, fetchHistoryLog } from '../../Ultility/Emarkapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from '../Emark/DetailModal';
import { Select, Button, Spin } from 'antd'; // Import Ant Design components
import { useNavigate } from 'react-router-dom';
const { Option } = Select;
const Emark = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [historyLog, setHistoryLog] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    // Individual filters
    const [filteredData, setFilteredData] = useState([]);
    const [partNoFilter, setPartNoFilter] = useState([]);
    const [brakepadFilter, setBrakepadFilter] = useState([]);
    const [materialFilter, setMaterialFilter] = useState([]);
    const [typeofemarkFilter, setTypeofemarkFilter] = useState([]);

    const columnDefs = [
        { headerName: 'No', field: 'id', checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'E-mark ID', field: 'Emark_Id', pinned: 'left' },
        { headerName: 'Part No. ', field: 'Part_No' },
        { headerName: 'Brake Pad', field: 'Brake_Pad' },
        { headerName: 'Material', field: 'Material' },
        { headerName: 'Type of E-mark', field: 'Type_Emark' },
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
        // console.log('Selected rows:', selectedRows);
    };

    const handleOnClick = () => {
        navigate('/createEmark');
    };

    const handleShowEdit = (data) => {
        navigate(`/emark/${data.id}`);
    };

    const handleFilterChange = () => {
        const filtered = rowData.filter((item) =>
          (!partNoFilter.length || partNoFilter.includes(item.Part_No)) &&
          (!materialFilter.length || materialFilter.includes(item.Material)) &&
          (!brakepadFilter.length || brakepadFilter.includes(item.Brake_Pad)) &&
          (!typeofemarkFilter.length || typeofemarkFilter.includes(item.Type_Emark)) 
        );
        setFilteredData(filtered);
    };
    
    useEffect(handleFilterChange, [brakepadFilter, typeofemarkFilter,  partNoFilter, materialFilter , rowData]);

    const clearFilters = () => {
        setPartNoFilter([])
        setMaterialFilter([])
        setBrakepadFilter([])
        setTypeofemarkFilter([])
    };
    return (
        <>
            <div style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '10px' }}>Filters</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>

                <div style={{ flex: '1 1 45%' }}>
                    <label>Filter by Part No.:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    placeholder="Select Part No."
                    style={{ width: '100%' }}
                    value={partNoFilter}
                    onChange={(value) => setPartNoFilter(value)}
                    >
                    {[...new Set(filteredData.map((item) => item.Part_No))].map((partNo) => (
                        <Option key={partNo} value={partNo}>
                        {partNo}
                        </Option>
                    ))}
                    </Select>
                </div>

                <div style={{ flex: '1 1 45%' }}>
                    <label>Filter by Brake Pad:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    placeholder="Select Brake Pad"
                    style={{ width: '100%' }}
                    value={brakepadFilter}
                    onChange={(value) => setBrakepadFilter(value)}
                    >
                    {[...new Set(filteredData.map((item) => item.Brake_Pad))].map((Brake_Pad) => (
                        <Option key={Brake_Pad} value={Brake_Pad}>
                            {Brake_Pad}
                        </Option>
                    ))}
                    </Select>
                </div>
                <div style={{ flex: '1 1 45%' }}>
                    <label>Filter by Material:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    placeholder="Select Brake Pad"
                    style={{ width: '100%' }}
                    value={materialFilter}
                    onChange={(value) => setMaterialFilter(value)}
                    >
                    {[...new Set(filteredData.map((item) => item.Material))].map((Material) => (
                        <Option key={Material} value={Material}>
                            {Material}
                        </Option>
                    ))}
                    </Select>
                </div>
                <div style={{ flex: '1 1 45%' }}>
                    <label>Filter by Type of E-mark:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    placeholder="Select Type of E-mark"
                    style={{ width: '100%' }}
                    value={typeofemarkFilter}
                    onChange={(value) => setTypeofemarkFilter(value)}
                    >
                    {[...new Set(filteredData.map((item) => item.Type_Emark))].map((Type_Emark) => (
                        <Option key={Type_Emark} value={Type_Emark}>
                            {Type_Emark}
                        </Option>
                    ))}
                    </Select>
                </div>
                
                </div>
                <Button type="default" style={{ marginTop: '10px' }} onClick={clearFilters}>
                Clear Filters
                </Button>
            </div>
            <div>
                <button className="btn btn-success btn-sm" style={{ marginBottom: '10px' }} onClick={handleOnClick}>
                    เพิ่มรายการ
                </button>
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename="Emark" />
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
                    rowData={filteredData}
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
