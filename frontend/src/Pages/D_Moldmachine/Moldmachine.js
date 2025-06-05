import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchD_Mold_Machines, fetchHistoryLog} from '../../Ultility/D_Mold_Machine';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from '../D_Moldmachine/DetailModal'
import { Select, Button, Spin } from 'antd'; // Import Ant Design components
import { useNavigate } from 'react-router-dom';
import Machine from '../D_Machine/Machine';
const { Option } = Select;
const Moldmachine = () =>{
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null)
    const [selectedData, setSelectedData] = useState(null);
    const [historyLog, setHistoryLog] = useState([]);
    const [showModal, setShowModal] = useState(false);
    // Individual filters
    const [filteredData, setFilteredData] = useState([]);
    const [moldFilter, setMoldfilter] = useState([]);
    const [machineFilter, setMachinefilter] = useState([]);
    const navigate = useNavigate();

    const columnDefs = [
        { headerName: 'No', field: 'No', checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'Mold+Machine', field: 'Mold_Machine_Code' , pinned: 'left'},
        { headerName: 'รหัสแม่พิมพ์.', field: 'Mold_Code'},
        { headerName: 'เครื่องจักร.', field: 'Machine_Code' },
        { headerName: 'ประเภท.', field: 'Description' },
        {
            headerName: 'Actions',
            field: 'actions',
            pinned: 'right',
            cellRenderer: (params) => (
                <div>
                    
                    <button
                        className= "btn btn-primary btn-sm"
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
        const loadDatasheet = async () => {
          try {
            const packageData = (await fetchD_Mold_Machines()).data;
            // console.log('packageData',packageData)
            const mappedData = packageData.map(i => ({
                No: i.id,
                Mold_Machine_Code:i.Mold_Machine_Code,
                Mold_Code: i.Mold_Code,
                Machine_Code: i.Machine_Code,
                Description: i.Description,

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
    
        loadDatasheet();
    }, []);

    const onGridReady = params => {
        setGridApi(params.api);
    };

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        console.log('Selected rows:', selectedRows);
    };

    const handleOnClick = () => {
        navigate('/createdmoldmachine');
    };
    const handleOnClickmultiple = () => {
        navigate('/createmultipledmoldmachine');
    };
    const handleShowEdit = (data) => {
        navigate(`/dmoldmachine/${data.No}`);
    };
    const handleFilterChange = () => {
        const filtered = rowData.filter((item) =>
          (!moldFilter.length || moldFilter.includes(item.Mold_Code)) &&
          (!machineFilter.length || machineFilter.includes(item.Machine_Code))
        );
        setFilteredData(filtered);
    };
    
    useEffect(handleFilterChange, [ moldFilter, machineFilter, rowData]);

    const clearFilters = () => {
        setMoldfilter([]);
        setMachinefilter([])
    };
    return (
        <>
            <div style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '10px' }}>Filters</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>

                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by Mold.:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    // placeholder="Select Compact No"
                    style={{ width: '100%' }}
                    value={moldFilter}
                    onChange={(value) => setMoldfilter(value)}
                    >
                    {[...new Set(
                        rowData.filter((item) =>
                        // (!moldFilter.length || moldFilter.includes(item.Mold_Code)) 
                        (!machineFilter.length || machineFilter.includes(item.Machine_Code))
                      )
                        .map((item) => item.Mold_Code))].map((Mold_Code) => (
                        <Option key={Mold_Code} value={Mold_Code}>
                        {Mold_Code}
                        </Option>
                    ))}
                    </Select>
                </div>

                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by Machine:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    // placeholder="Select เกรดเคมี"
                    style={{ width: '100%' }}
                    value={machineFilter}
                    onChange={(value) => setMachinefilter(value)}
                    >
                    {[...new Set(
                        rowData.filter((item) =>
                        (!moldFilter.length || moldFilter.includes(item.Mold_Code)) 
                        // (!machineFilter.length || machineFilter.includes(item.Machine_Code))
                      )
                        .map((item) => item.Machine_Code))].map((Machine_Code) => (
                        <Option key={filteredData} value={Machine_Code}>
                            {Machine_Code}
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
                <button className='btn btn-success btn-sm' style={{ marginBottom: '10px' , marginLeft: '10px'}} onClick={handleOnClickmultiple}>เพิ่มรายการ More than 1 </button>
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename = "Mold-machine"/>
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
                    // rowData={filteredData}
                    rowData={filteredData}
                    onGridReady={onGridReady}
                    onSelectionChanged={onSelectionChanged}
                />
            )}
            <DetailModal
                show={showModal}
                onHide={handleCloseModal}
                data={selectedData}
                Tablename = 'Mold-machine'
                historyLog={historyLog}
            />
        </>
    )
}

export default Moldmachine;