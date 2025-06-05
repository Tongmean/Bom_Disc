import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchD_Pressures, fetchHistoryLog} from '../../Ultility/D_Pressure';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from '../D_Pressure/DetailModal'
import { Select, Button, Spin } from 'antd'; // Import Ant Design components
import { useNavigate } from 'react-router-dom';
const { Option } = Select;
const D_Pressure = () =>{
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null)
    const [selectedData, setSelectedData] = useState(null);
    const [historyLog, setHistoryLog] = useState([]);
    const [showModal, setShowModal] = useState(false);
    // Individual filters
    const [filteredData, setFilteredData] = useState([]);
    const [mold_Machine_Cold_CodeFilter, setMold_Machine_Cold_Code] = useState([]);
    const [mold_Machine_Cold_HotFilter, setMold_Machine_Cold_Hot] = useState([]);
    const [dFilter, setDfilter] = useState([]);
    const navigate = useNavigate();

    const columnDefs = [
        { headerName: 'No', field: 'No', checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'Data Sheet No. (แรงดัน)', field: 'Data_Sheet_No_Pressure', pinned: 'left' },
        { headerName: 'Data Sheet No. (น้ำหนัก).', field: 'Data_Sheet_No' },

        { headerName: 'Mold-Machine-พิมพ์เย็น', field: 'Mold_Machine_Cold_Code' },
        { headerName: 'ชิ้นต่อพิมพ์ (พิมพ์เย็น)', field: 'Pcs_Per_Mold_Cold' },
        { headerName: 'แรงดันต่อเครื่อง (พิมพ์เย็น)', field: 'Presure_Cold' },

        { headerName: 'Mold-Machine-พิมพ์ร้อน', field: 'Mold_Machine_Cold_Hot' },
        { headerName: 'ชิ้นต่อพิมพ์ (พิมพ์ร้อน)', field: 'Pcs_Per_Mold_Hot' },
        { headerName: 'แรงดันต่อเครื่อง (พิมพ์ร้อน)', field: 'Presure_Hot' },
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
            const Data = (await fetchD_Pressures()).data;
            // console.log('packageData',packageData)
            const mappedData = Data.map(i => ({
                No: i.id,
                Data_Sheet_No_Pressure: i.Data_Sheet_No_Pressure,
                Data_Sheet_No: i.Data_Sheet_No,

                Mold_Machine_Cold_Code: i.Mold_Machine_Cold_Code,
                Pcs_Per_Mold_Cold: i.Pcs_Per_Mold_Cold,
                Presure_Cold: i.Presure_Cold,

                Mold_Machine_Cold_Hot : i.Mold_Machine_Cold_Hot,
                Pcs_Per_Mold_Hot: i.Pcs_Per_Mold_Hot,
                Presure_Hot: i.Presure_Hot,

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
        navigate('/createdpressure');
    };
    const handleShowEdit = (data) => {
        navigate(`/dpressure/${data.No}`);
    };
    const handleFilterChange = () => {
        const filtered = rowData.filter((item) =>
          (!mold_Machine_Cold_CodeFilter.length || mold_Machine_Cold_CodeFilter.includes(item.Mold_Machine_Cold_Code)) &&
          (!dFilter.length || dFilter.includes(item.Data_Sheet_No)) &&
          (!mold_Machine_Cold_HotFilter.length || mold_Machine_Cold_HotFilter.includes(item.Mold_Machine_Cold_Hot))
        );
        setFilteredData(filtered);
    };
    
    useEffect(handleFilterChange, [ mold_Machine_Cold_HotFilter, mold_Machine_Cold_CodeFilter,dFilter, rowData]);

    const clearFilters = () => {
        setMold_Machine_Cold_Code([]);
        setMold_Machine_Cold_Hot([]);
        setDfilter([]);
    };
    return (
        <>
            <div style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '10px' }}>Filters</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>

                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by Data_Sheet_No.:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    // placeholder="Select Compact No"
                    style={{ width: '100%' }}
                    value={dFilter}
                    onChange={(value) => setDfilter(value)}
                    >
                    {[...new Set(
                        rowData.filter((item) =>
                        (!mold_Machine_Cold_CodeFilter.length || mold_Machine_Cold_CodeFilter.includes(item.Mold_Machine_Cold_Code)) &&
                        // (!dFilter.length || dFilter.includes(item.Data_Sheet_No)) &&
                        (!mold_Machine_Cold_HotFilter.length || mold_Machine_Cold_HotFilter.includes(item.Mold_Machine_Cold_Hot))
                      )
                        .map((item) => item.Data_Sheet_No))].map((Data_Sheet_No) => (
                        <Option key={Data_Sheet_No} value={Data_Sheet_No}>
                        {Data_Sheet_No}
                        </Option>
                    ))}
                    </Select>
                </div>
                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by Mold-Machine-เย็น.:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    // placeholder="Select Compact No"
                    style={{ width: '100%' }}
                    value={mold_Machine_Cold_CodeFilter}
                    onChange={(value) => setMold_Machine_Cold_Code(value)}
                    >
                    {[...new Set(
                        rowData.filter((item) =>
                        // (!mold_Machine_Cold_CodeFilter.length || mold_Machine_Cold_CodeFilter.includes(item.Mold_Machine_Cold_Code)) &&
                        (!dFilter.length || dFilter.includes(item.Data_Sheet_No)) &&
                        (!mold_Machine_Cold_HotFilter.length || mold_Machine_Cold_HotFilter.includes(item.Mold_Machine_Cold_Hot))
                      )
                        .map((item) => item.Mold_Machine_Cold_Code))].map((Mold_Machine_Cold_Code) => (
                        <Option key={Mold_Machine_Cold_Code} value={Mold_Machine_Cold_Code}>
                        {Mold_Machine_Cold_Code}
                        </Option>
                    ))}
                    </Select>
                </div>

                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by Mold-Machine-ร้อน.</label>
                    <Select
                    mode='multiple'
                    showSearch
                    // placeholder="Select เกรดเคมี"
                    style={{ width: '100%' }}
                    value={mold_Machine_Cold_HotFilter}
                    onChange={(value) => setMold_Machine_Cold_Hot(value)}
                    >
                    {[...new Set(
                        rowData.filter((item) =>
                        (!mold_Machine_Cold_CodeFilter.length || mold_Machine_Cold_CodeFilter.includes(item.Mold_Machine_Cold_Code)) &&
                        (!dFilter.length || dFilter.includes(item.Data_Sheet_No)) 
                        // (!mold_Machine_Cold_HotFilter.length || mold_Machine_Cold_HotFilter.includes(item.Mold_Machine_Cold_Hot))
                      )
                        .map((item) => item.Mold_Machine_Cold_Hot))].map((Mold_Machine_Cold_Hot) => (
                        <Option key={Mold_Machine_Cold_Hot} value={Mold_Machine_Cold_Hot}>
                            {Mold_Machine_Cold_Hot}
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
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename = "D_Pressure"/>
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
                Tablename = 'D_Pressure'
                historyLog={historyLog}
            />
        </>
    )
}

export default D_Pressure;