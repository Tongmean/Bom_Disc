import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchWips, fetchHistoryLog} from '../../Ultility/Wipprocess';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from '../Wipprocess/DetailModal'
import { Select, Button, Spin } from 'antd'; // Import Ant Design components
import { useNavigate } from 'react-router-dom';
const { Option } = Select;
const Wipprocess = () =>{
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null)
    const [selectedData, setSelectedData] = useState(null);
    const [historyLog, setHistoryLog] = useState([]);
    const [showModal, setShowModal] = useState(false);
    // Individual filters
    // const [filteredData, setFilteredData] = useState([]);
    // const [partNoFilter, setPartNoFilter] = useState([]);
    // const [gradingFilter, setGradingFilter] = useState([]);
    const navigate = useNavigate();

    const columnDefs = [
        { headerName: 'No', field: 'No', checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'Code Fg.', field: 'Code_Fg' , pinned: 'left'},
        { headerName: 'เบอร์.', field: 'Part_No'},
        { headerName: 'เกรดเคมี.', field: 'Grade' },
        { headerName: 'Hotpressing.', field: 'Hotpressing' },
        { headerName: 'Grinding.', field: 'Grinding'},
        { headerName: 'Powder.', field: 'Powder'},
        { headerName: 'Treatment.', field: 'Treatment'},
        { headerName: 'Shim.', field: 'Shim'},
        { headerName: 'ย้ำ.', field: 'Attachment'},
        { headerName: 'จำนวน.', field: 'Quantity'},
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
            const packageData = (await fetchWips()).data;
            // console.log('packageData',packageData)
            const mappedData = packageData.map(i => ({
                No: i.id,
                Code_Fg: i.Code_Fg,
                Part_No: i.Part_No,
                Grade: i.Grade,
                Hotpressing: i.Hotpressing,
                Grinding: i.Grinding,
                Powder: i.Powder,
                Treatment: i.Treatment,
                Shim: i.Shim,
                Attachment: i.Attachment,
                Quantity: i.Quantity,

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
        navigate('/createwip');
    };
    const handleShowEdit = (data) => {
        navigate(`/wip/${data.No}`);
    };
    // const handleFilterChange = () => {
    //     const filtered = rowData.filter((item) =>
    //       (!partNoFilter.length || partNoFilter.includes(item.Compact_No)) &&
    //       (!gradingFilter.length || gradingFilter.includes(item.Grade_Chem))
    //     );
    //     setFilteredData(filtered);
    // };
    
    // useEffect(handleFilterChange, [ partNoFilter, gradingFilter, rowData]);

    // const clearFilters = () => {
    //     setPartNoFilter([]);
    //     setGradingFilter([])
    // };
    return (
        <>
            {/* <div style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '10px' }}>Filters</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>

                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by Compact No.:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    placeholder="Select Compact No"
                    style={{ width: '100%' }}
                    value={partNoFilter}
                    onChange={(value) => setPartNoFilter(value)}
                    >
                    {[...new Set(filteredData.map((item) => item.Compact_No))].map((partNo) => (
                        <Option key={partNo} value={partNo}>
                        {partNo}
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
                    {[...new Set(filteredData.map((item) => item.Grade_Chem))].map((Grade_Chem) => (
                        <Option key={filteredData} value={Grade_Chem}>
                            {Grade_Chem}
                        </Option>
                    ))}
                    </Select>
                </div>
                
                </div>
                <Button type="default" style={{ marginTop: '10px' }} onClick={clearFilters}>
                Clear Filters
                </Button>
            </div> */}
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
                    // rowData={filteredData}
                    rowData={rowData}
                    onGridReady={onGridReady}
                    onSelectionChanged={onSelectionChanged}
                />
            )}
            <DetailModal
                show={showModal}
                onHide={handleCloseModal}
                data={selectedData}
                columnDefs = {columnDefs}
                Tablename = 'Wip'
                historyLog={historyLog}
            />
        </>
    )
}

export default Wipprocess;