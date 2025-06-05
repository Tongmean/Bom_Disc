import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchD_Chemgrades, fetchHistoryLog} from '../../Ultility/D_Chemgrade';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from '../D_Chemgrade/DetailModal'
import { Select, Button, Spin } from 'antd'; // Import Ant Design components
import { useNavigate } from 'react-router-dom';
const { Option } = Select;
const Chemgrade = () =>{
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null)
    const [selectedData, setSelectedData] = useState(null);
    const [historyLog, setHistoryLog] = useState([]);
    const [showModal, setShowModal] = useState(false);
    // Individual filters
    const [filteredData, setFilteredData] = useState([]);
    const [sgFilter, setSgfilter] = useState([]);
    const [gradingFilter, setGradingFilter] = useState([]);
    const navigate = useNavigate();

    const columnDefs = [
        { headerName: 'No', field: 'No', checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'รหัสเกรดเคมี', field: 'Chem_Grade_Code', pinned: 'left' },
        { headerName: 'SG Value', field: 'SG_Value' },
        { headerName: 'แรงดัน (เย็น)', field: 'Pressure_Cold' },
        { headerName: 'แรงดัน (ร้อน)', field: 'Pressure_Hot' },
        { headerName: 'อุณหภูมิสูงสุด', field: 'Temp_Above' },
        { headerName: 'อุณหภูมิต่ำสุด', field: 'Temp_Bellow' },
        { headerName: 'Total Time', field: 'Total_Time' },
        { headerName: 'Program No.', field: 'Program_No' },

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
        const loadData = async () => {
          try {
            const packageData = (await fetchD_Chemgrades()).data;
            // console.log('packageData',packageData)
            const mappedData = packageData.map(i => ({
                No: i.id,
                Chem_Grade_Code: i.Chem_Grade_Code,
                SG_Value: i.SG_Value,
                Pressure_Cold: i.Pressure_Cold,
                Pressure_Hot: i.Pressure_Hot,
                Temp_Above: i.Temp_Above,
                Temp_Bellow: i.Temp_Bellow,
                Total_Time: i.Total_Time,
                Program_No: i.Program_No,
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
    
        loadData();
    }, []);

    const onGridReady = params => {
        setGridApi(params.api);
    };

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        console.log('Selected rows:', selectedRows);
    };

    const handleOnClick = () => {
        navigate('/createchemgrade');
    };
    const handleShowEdit = (data) => {
        navigate(`/chemgrade/${data.No}`);
    };
    const handleFilterChange = () => {
        const filtered = rowData.filter((item) =>
          (!sgFilter.length || sgFilter.includes(item.SG_Value)) &&
          (!gradingFilter.length || gradingFilter.includes(item.Chem_Grade_Code))
        );
        setFilteredData(filtered);
    };
    
    useEffect(handleFilterChange, [ sgFilter, gradingFilter, rowData]);

    const clearFilters = () => {
        setSgfilter([]);
        setGradingFilter([])
    };
    return (
        <>
            <div style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '10px' }}>Filters</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>

                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by ค่า SG.:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    // placeholder="Select Compact No"
                    style={{ width: '100%' }}
                    value={sgFilter}
                    onChange={(value) => setSgfilter(value)}
                    >
                    {[...new Set(
                        rowData.filter((item) =>
                        // (!sgFilter.length || sgFilter.includes(item.SG_Value)) &&
                        (!gradingFilter.length || gradingFilter.includes(item.Chem_Grade_Code))
                      )
                        .map((item) => item.SG_Value))].map((SG_Value) => (
                        <Option key={SG_Value} value={SG_Value}>
                        {SG_Value}
                        </Option>
                    ))}
                    </Select>
                </div>

                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by เกรดเคมี:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    placeholder="Select เกรดเคมี"
                    style={{ width: '100%' }}
                    value={gradingFilter}
                    onChange={(value) => setGradingFilter(value)}
                    >
                    {[...new Set(
                        rowData.filter((item) =>
                         (!sgFilter.length || sgFilter.includes(item.SG_Value))
                        // (!gradingFilter.length || gradingFilter.includes(item.Chem_Grade_Code))
                      )
                        .map((item) => item.Chem_Grade_Code))].map((Chem_Grade_Code) => (
                        <Option key={Chem_Grade_Code} value={Chem_Grade_Code}>
                            {Chem_Grade_Code}
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
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename = "เกรดเคมี"/>
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
                Tablename = 'เกรดเคมี'
                historyLog={historyLog}
            />
        </>
    )
}

export default Chemgrade;