import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchD_Machines, fetchHistoryLog} from '../../Ultility/D_Machine';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from '../D_Machine/DetailModal'
import { Select, Button, Spin } from 'antd'; // Import Ant Design components
import { useNavigate } from 'react-router-dom';
const { Option } = Select;
const Machine = () =>{
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null)
    const [selectedData, setSelectedData] = useState(null);
    const [historyLog, setHistoryLog] = useState([]);
    const [showModal, setShowModal] = useState(false);
    // Individual filters
    const [filteredData, setFilteredData] = useState([]);
    const [machineFilter, setMachinefilter] = useState([]);
    const [groupFilter, setGroupfilter] = useState([]);
    const [diameterFilter, setDiameterfilter] = useState([]);
    const navigate = useNavigate();

    const columnDefs = [
        { headerName: 'No', field: 'No', checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'เครื่องจักร.', field: 'Machine_Code' , pinned: 'left'},
        { headerName: 'รายการ.', field: 'Type_Machine'},
        { headerName: 'ขนาด(นิ้ว).', field: 'Diameter' },
        { headerName: 'Min Pressure.', field: 'Min_Pressure' },
        { headerName: 'Max Pressure.', field: 'Max_Pressure'},
        { headerName: 'กลุ่ม.', field: 'Group'},
        { headerName: 'Status.', field: 'Status'},

        // CreateBy: i.CreateBy,
        // CreateAt: i.CreateAt,
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
            const packageData = (await fetchD_Machines()).data;
            // console.log('packageData',packageData)
            const mappedData = packageData.map(i => ({
                No: i.id,
                Machine_Code: i.Machine_Code,
                Type_Machine: i.Type_Machine,
                Diameter: i.Diameter,
                Min_Pressure: i.Min_Pressure,
                Max_Pressure: i.Max_Pressure,
                Group: i.Group,
                Status: i.Status,

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
        navigate('/createmachine');
    };
    const handleShowEdit = (data) => {
        navigate(`/machine/${data.No}`);
    };
    const handleFilterChange = () => {
        const filtered = rowData.filter((item) =>
          (!machineFilter.length || machineFilter.includes(item.Machine_Code)) &&
          (!groupFilter.length || groupFilter.includes(item.Group)) &&
          (!diameterFilter.length || diameterFilter.includes(item.Diameter))
        );
        setFilteredData(filtered);
    };
    
    useEffect(handleFilterChange, [ machineFilter, groupFilter, diameterFilter, rowData]);

    const clearFilters = () => {
        setDiameterfilter([]);
        setGroupfilter([]);
        setMachinefilter([])
    };
    return (
        <>
            <div style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '10px' }}>Filters</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>

                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by Machine_Code.:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    // placeholder="Select Compact No"
                    style={{ width: '100%' }}
                    value={machineFilter}
                    onChange={(value) => setMachinefilter(value)}
                    >
                    {[...new Set(
                        rowData.filter((item) =>
                        // (!machineFilter.length || machineFilter.includes(item.Machine_Code)) &&
                        (!groupFilter.length || groupFilter.includes(item.Group)) &&
                        (!diameterFilter.length || diameterFilter.includes(item.Diameter))
                      )
                        .map((item) => item.Machine_Code))].map((Machine_Code) => (
                        <Option key={Machine_Code} value={Machine_Code}>
                        {Machine_Code}
                        </Option>
                    ))}
                    </Select>
                </div>

                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by ประเภท Machine:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    // placeholder="Select เกรดเคมี"
                    style={{ width: '100%' }}
                    value={groupFilter}
                    onChange={(value) => setGroupfilter(value)}
                    >
                    {[...new Set(
                        rowData.filter((item) =>
                        (!machineFilter.length || machineFilter.includes(item.Machine_Code)) &&
                        // (!groupFilter.length || groupFilter.includes(item.Group)) &&
                        (!diameterFilter.length || diameterFilter.includes(item.Diameter))
                      )
                        .map((item) => item.Group))].map((Group) => (
                        <Option key={Group} value={Group}>
                            {Group}
                        </Option>
                    ))}
                    </Select>
                </div>
                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by ขนาดกระบอกสูบ:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    // placeholder="Select เกรดเคมี"
                    style={{ width: '100%' }}
                    value={diameterFilter}
                    onChange={(value) => setDiameterfilter(value)}
                    >
                    {[...new Set(
                        rowData.filter((item) =>
                        (!machineFilter.length || machineFilter.includes(item.Machine_Code)) &&
                        (!groupFilter.length || groupFilter.includes(item.Group)) 
                        // (!diameterFilter.length || diameterFilter.includes(item.Diameter))
                      )
                        .map((item) => item.Diameter))].map((Diameter) => (
                        <Option key={Diameter} value={Diameter}>
                            {Diameter}
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
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename = "Machine"/>
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
                    // rowData={rowData}
                    onGridReady={onGridReady}
                    onSelectionChanged={onSelectionChanged}
                />
            )}
            <DetailModal
                show={showModal}
                onHide={handleCloseModal}
                data={selectedData}
                columnDefs = {columnDefs}
                Tablename = 'Machine'
                historyLog={historyLog}
            />
        </>
    )
}

export default Machine;