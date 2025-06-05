import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchD_Weights, fetchHistoryLog} from '../../Ultility/D_Weight';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from '../D_Weight/DetailModal'
import { Select, Button, Spin } from 'antd'; // Import Ant Design components
import { useNavigate } from 'react-router-dom';
const { Option } = Select;
const D_Weight = () =>{
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
    const [gradingFilter, setGradingFilter] = useState([]);
    const [mold_Code_Cold_Filter, setMold_Code_Cold] = useState([]);
    const [mold_Code_Hot_Filter, setMold_Code_Hot] = useState([]);
    const navigate = useNavigate();

    const columnDefs = [
        { headerName: 'No', field: 'No', checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'Data Sheet No. (Weight)', field: 'Data_Sheet_No', pinned: 'left' },
        { headerName: 'Compact No.', field: 'Compact_No' },
        { headerName: 'สูตร', field: 'Formulation' },
        { headerName: 'เกรด', field: 'Chem_Grade' },
        { headerName: 'รหัสแม่พิมพ์เย็น', field: 'Mold_Code_Cold' },
        { headerName: 'รหัสแม่พิมพ์ร้อน', field: 'Mold_Code_Hot' },
        { headerName: 'น้ำหนักเคมี F', field: 'Weight_F' },
        { headerName: 'น้ำหนักเคมี U', field: 'Weight_U' },
        { headerName: 'เกรดเคมี Under layer', field: 'Chem_Grade_U' },
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
            const Data = (await fetchD_Weights()).data;
            // console.log('packageData',packageData)
            const mappedData = Data.map(i => ({

                No: i.id,
                Data_Sheet_No: i.Data_Sheet_No,
                Compact_No: i.Compact_No,
                Formulation: i.Formulation,
                Chem_Grade: i.Chem_Grade,
                Mold_Code_Cold: i.Mold_Code_Cold,
                Mold_Code_Hot: i.Mold_Code_Hot,
                Weight_F: i.Weight_F,
                Weight_U: i.Weight_U,
                Chem_Grade_U: i.Chem_Grade_U,
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
        navigate('/createdweight');
    };
    const handleShowEdit = (data) => {
        navigate(`/dweight/${data.No}`);
    };
    const handleFilterChange = () => {
        const filtered = rowData.filter((item) =>
          (!mold_Code_Cold_Filter.length || mold_Code_Cold_Filter.includes(item.Mold_Code_Cold)) &&
          (!mold_Code_Hot_Filter.length || mold_Code_Hot_Filter.includes(item.Mold_Code_Hot)) &&
          (!partNoFilter.length || partNoFilter.includes(item.Compact_No)) &&
          (!gradingFilter.length || gradingFilter.includes(item.Chem_Grade))
        );
        setFilteredData(filtered);
    };
    
    useEffect(handleFilterChange, [ partNoFilter, gradingFilter,mold_Code_Cold_Filter,mold_Code_Hot_Filter , rowData]);

    const clearFilters = () => {
        setPartNoFilter([]);
        setGradingFilter([])
        setMold_Code_Cold([])
        setMold_Code_Hot([])
    };
    return (
        <>
            <div style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '10px' }}>Filters</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>

                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by Compact No.:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    // placeholder="Select Compact No"
                    style={{ width: '100%' }}
                    value={partNoFilter}
                    onChange={(value) => setPartNoFilter(value)}
                    >
                    {[...new Set(
                        rowData.filter((item) =>
                        (!mold_Code_Cold_Filter.length || mold_Code_Cold_Filter.includes(item.Mold_Code_Cold)) &&
                        (!mold_Code_Hot_Filter.length || mold_Code_Hot_Filter.includes(item.Mold_Code_Hot)) &&
                        // (!partNoFilter.length || partNoFilter.includes(item.Compact_No)) &&
                        (!gradingFilter.length || gradingFilter.includes(item.Chem_Grade))
                      )
                        .map((item) => item.Compact_No))].map((Compact_No) => (
                        <Option key={Compact_No} value={Compact_No}>
                        {Compact_No}
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
                        (!mold_Code_Cold_Filter.length || mold_Code_Cold_Filter.includes(item.Mold_Code_Cold)) &&
                        (!mold_Code_Hot_Filter.length || mold_Code_Hot_Filter.includes(item.Mold_Code_Hot)) &&
                        (!partNoFilter.length || partNoFilter.includes(item.Compact_No))
                        // (!gradingFilter.length || gradingFilter.includes(item.Chem_Grade))
                      )
                        .map((item) => item.Chem_Grade))].map((Chem_Grade) => (
                        <Option key={Chem_Grade} value={Chem_Grade}>
                            {Chem_Grade}
                        </Option>
                    ))}
                    </Select>
                </div>
                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by Mold-Machine-พิมพ์เย็น:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    // placeholder="Select เกรดเคมี"
                    style={{ width: '100%' }}
                    value={mold_Code_Cold_Filter}
                    onChange={(value) => setMold_Code_Cold(value)}
                    >
                    {[...new Set(
                        rowData.filter((item) =>
                        // (!mold_Code_Cold_Filter.length || mold_Code_Cold_Filter.includes(item.Mold_Code_Cold)) &&
                        (!mold_Code_Hot_Filter.length || mold_Code_Hot_Filter.includes(item.Mold_Code_Hot)) &&
                        (!partNoFilter.length || partNoFilter.includes(item.Compact_No)) &&
                        (!gradingFilter.length || gradingFilter.includes(item.Chem_Grade))
                      )
                        .map((item) => item.Mold_Code_Cold))].map((Mold_Code_Cold) => (
                        <Option key={Mold_Code_Cold} value={Mold_Code_Cold}>
                            {Mold_Code_Cold}
                        </Option>
                    ))}
                    </Select>
                </div>
                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by Mold-Machine-พิมพ์ร้อน:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    // placeholder="Select เกรดเคมี"
                    style={{ width: '100%' }}
                    value={mold_Code_Hot_Filter}
                    onChange={(value) => setMold_Code_Hot(value)}
                    >
                    {[...new Set(
                        rowData.filter((item) =>
                        (!mold_Code_Cold_Filter.length || mold_Code_Cold_Filter.includes(item.Mold_Code_Cold)) &&
                        // (!mold_Code_Hot_Filter.length || mold_Code_Hot_Filter.includes(item.Mold_Code_Hot)) &&
                        (!partNoFilter.length || partNoFilter.includes(item.Compact_No)) &&
                        (!gradingFilter.length || gradingFilter.includes(item.Chem_Grade))
                      )
                        .map((item) => item.Mold_Code_Hot))].map((Mold_Code_Hot) => (
                        <Option key={Mold_Code_Hot} value={Mold_Code_Hot}>
                            {Mold_Code_Hot}
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
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename = "D_Weight"/>
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
                Tablename = 'D_Weight'
                historyLog={historyLog}
            />
        </>
    )
}

export default D_Weight;