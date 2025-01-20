import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchShims, fetchHistoryLog} from '../../Ultility/Shimapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from '../Shim/DetailModal'
import { Select, Button } from 'antd'; // Import Ant Design components
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

const Shim = () =>{
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null)
    const [selectedData, setSelectedData] = useState(null);
    const [historyLog, setHistoryLog] = useState([]);
    const [showModal, setShowModal] = useState(false);
    // Individual filters
    const [filteredData, setFilteredData] = useState([]);
    const [partNoFilter, setPartNoFilter] = useState([]);
    const [numberFilter, setNumberFilter] = useState([]);
    const navigate = useNavigate();

    const columnDefs = [
        { headerName: 'No', field: 'No', checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'Compact No (ปรับ)', field: 'Compact_No_Modify' },
        { headerName: 'Part No', field: 'Part_No' },

        { headerName: 'ชื่อ SP1', field: 'Name_SP1' },
        { headerName: 'รหัส SP1', field: 'Erp_Id_SP1' },
        { headerName: 'ID SP1', field: 'Id_SP1' },
        { headerName: 'จำนวน SP1', field: 'Quantity_SP1' },

        { headerName: 'ชื่อ SP2', field: 'Name_SP2' },
        { headerName: 'รหัส SP2', field: 'Erp_Id_SP2' },
        { headerName: 'ID SP2', field: 'Id_SP2' },
        { headerName: 'จำนวน SP2', field: 'Quantity_SP2' },

        { headerName: 'ชื่อ SP3', field: 'Name_SP3' },
        { headerName: 'รหัส SP3', field: 'Erp_Id_SP3' },
        { headerName: 'ID SP3', field: 'Id_SP3' },
        { headerName: 'จำนวน SP3', field: 'Quantity_SP3' },
        { headerName: 'Status', field: 'Status' },

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
            const packageData = (await fetchShims()).data;
            
            const mappedData = packageData.map(i => ({
                No: i.id,
                Compact_No_Modify: i.Compact_No_Modify,
                Part_No: i.Part_No,
                Name_SP1: i.Name_SP1,
                Erp_Id_SP1: i.Erp_Id_SP1,
                Id_SP1: i.Id_SP1,
                Quantity_SP1: i.Quantity_SP1,
                Name_SP2: i.Name_SP2,
                Erp_Id_SP2: i.Erp_Id_SP2,
                Id_SP2: i.Id_SP2,
                Quantity_SP2: i.Quantity_SP2,
                Name_SP3: i.Name_SP3,
                Erp_Id_SP3: i.Erp_Id_SP3,
                Id_SP3: i.Id_SP3,
                Quantity_SP3: i.Quantity_SP3,
                Status: i.Status,

                
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
        navigate('/createshim');
    };
    const handleShowEdit = (data) => {
        navigate(`/shim/${data.No}`);
    };

    const handleFilterChange = () => {
        const filtered = rowData.filter((item) =>
          (!partNoFilter.length || partNoFilter.includes(item.Part_No)) &&
          (!numberFilter.length || numberFilter.includes(item.Compact_No_Modify))
        );
        setFilteredData(filtered);
    };
    
    useEffect(handleFilterChange, [  partNoFilter, numberFilter, rowData]);

    const clearFilters = () => {
        setPartNoFilter([]);
        setNumberFilter([])
    };
    return (
        <>
            <div style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '10px' }}>Filters</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>

                <div style={{ flex: '1 1 30%' }}>
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

                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by Compact No:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    placeholder="Select Compact No"
                    style={{ width: '100%' }}
                    value={numberFilter}
                    onChange={(value) => setNumberFilter(value)}
                    >
                    {[...new Set(filteredData.map((item) => item.Compact_No_Modify))].map((Num) => (
                        <Option key={Num} value={Num}>
                        {Num}
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
                <button className='btn btn-success btn-sm' style={{ marginBottom: '10px' }} onClick={handleOnClick}>เพิ่มรายการ</button>
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename = "Shim"/>
                <ClipboardButton gridApi={gridApi} columnDefs={columnDefs} />
            </div>
            {loading ? (
                <div>Loading...</div>
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
                Tablename = 'Shim'
            />
        </>
    )
}

export default Shim;