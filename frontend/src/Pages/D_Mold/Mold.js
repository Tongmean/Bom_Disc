import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchD_Molds, fetchHistoryLog} from '../../Ultility/D_Mold';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from '../D_Mold/DetailModal'
import { Select, Button, Spin } from 'antd'; // Import Ant Design components
import { useNavigate } from 'react-router-dom';
const { Option } = Select;
const Mold = () =>{
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null)
    const [selectedData, setSelectedData] = useState(null);
    const [historyLog, setHistoryLog] = useState([]);
    const [showModal, setShowModal] = useState(false);
    // Individual filters
    const [filteredData, setFilteredData] = useState([]);
    const [mold_CodeFilter, setMold_Codefilter] = useState([]);
    const [hole_Deformation_QuantityFilter, setHole_Deformation_QuantityFilter] = useState([]);
    const [hole_Active_QuantityFilter, setHole_Active_Quantity] = useState([]);
    const navigate = useNavigate();

    const columnDefs = [
        { headerName: 'No', field: 'No', checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'รหัสแม่พิมพ์.', field: 'Mold_Code' , pinned: 'left'},
        { headerName: 'ประเภท.', field: 'Type_Mold'},
        { headerName: 'สถานที่จัดเก็บ.', field: 'Area' },
        { headerName: 'จำนวนชิ้นเต็ม.', field: 'Full_Hole_Quantity' },
        { headerName: 'จำนวนชิ้นเสีย.', field: 'Hole_Deformation_Quantity'},
        { headerName: 'จำนวนชิ้นคงเหลือ.', field: 'Hole_Balance_Quantity'},
        { headerName: 'จำนวนชิ้น Active.', field: 'Hole_Active_Quantity'},
        { headerName: 'ตำแหน่งชิ้นที่เสีย.', field: 'Hole_Deformation_Position'},
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
            const packageData = (await fetchD_Molds()).data;
            // console.log('packageData',packageData)
            const mappedData = packageData.map(i => ({
                No: i.id,
                Mold_Code: i.Mold_Code,
                Type_Mold: i.Type_Mold,
                Area: i.Area,
                Full_Hole_Quantity: i.Full_Hole_Quantity,
                Hole_Deformation_Quantity: i.Hole_Deformation_Quantity,
                Hole_Balance_Quantity: i.Hole_Balance_Quantity,
                Hole_Active_Quantity: i.Hole_Active_Quantity,
                Hole_Deformation_Position: i.Hole_Deformation_Position,

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
        navigate('/createmold');
    };
    const handleShowEdit = (data) => {
        navigate(`/mold/${data.No}`);
    };
    const handleFilterChange = () => {
        const filtered = rowData.filter((item) =>
          (!hole_Active_QuantityFilter.length || hole_Active_QuantityFilter.includes(item.Hole_Active_Quantity)) &&
          (!hole_Deformation_QuantityFilter.length || hole_Deformation_QuantityFilter.includes(item.Hole_Deformation_Quantity)) &&
          (!mold_CodeFilter.length || mold_CodeFilter.includes(item.Mold_Code))
        );
        setFilteredData(filtered);
    };
    
    useEffect(handleFilterChange, [ hole_Active_QuantityFilter, hole_Deformation_QuantityFilter,mold_CodeFilter , rowData]);

    const clearFilters = () => {
        setHole_Active_Quantity([]);
        setHole_Deformation_QuantityFilter([])
        setMold_Codefilter([])
    };
    return (
        <>
            <div style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '10px' }}>Filters</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>

                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by Mold_Code.:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    // placeholder="Select Compact No"
                    style={{ width: '100%' }}
                    value={mold_CodeFilter}
                    onChange={(value) => setMold_Codefilter(value)}
                    >
                    {[...new Set(
                        rowData.filter((item) =>
                        (!hole_Active_QuantityFilter.length || hole_Active_QuantityFilter.includes(item.Hole_Active_Quantity)) &&
                        (!hole_Deformation_QuantityFilter.length || hole_Deformation_QuantityFilter.includes(item.Hole_Deformation_Quantity))
                        // (!mold_CodeFilter.length || mold_CodeFilter.includes(item.Mold_Code))
                      )
                        .map((item) => item.Mold_Code))].map((Mold_Code) => (
                        <Option key={Mold_Code} value={Mold_Code}>
                        {Mold_Code}
                        </Option>
                    ))}
                    </Select>
                </div>

                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by จำนวนชิ้น Active</label>
                    <Select
                    mode='multiple'
                    showSearch
                    // placeholder="Select เกรดเคมี"
                    style={{ width: '100%' }}
                    value={hole_Active_QuantityFilter}
                    onChange={(value) => setHole_Active_Quantity(value)}
                    >
                    {[...new Set(
                        rowData.filter((item) =>
                        // (!hole_Active_QuantityFilter.length || hole_Active_QuantityFilter.includes(item.Hole_Active_Quantity)) &&
                        (!hole_Deformation_QuantityFilter.length || hole_Deformation_QuantityFilter.includes(item.Hole_Deformation_Quantity)) &&
                        (!mold_CodeFilter.length || mold_CodeFilter.includes(item.Mold_Code))
                      )
                        .map((item) => item.Hole_Active_Quantity))].map((Hole_Active_Quantity) => (
                        <Option key={Hole_Active_Quantity} value={Hole_Active_Quantity}>
                            {Hole_Active_Quantity}
                        </Option>
                    ))}
                    </Select>
                </div>
                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by จำนวนชิ้นเสีย:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    // placeholder="Select เกรดเคมี"
                    style={{ width: '100%' }}
                    value={hole_Deformation_QuantityFilter}
                    onChange={(value) => setHole_Deformation_QuantityFilter(value)}
                    >
                    {[...new Set(
                        rowData.filter((item) =>
                        (!hole_Active_QuantityFilter.length || hole_Active_QuantityFilter.includes(item.Hole_Active_Quantity)) &&
                        // (!hole_Deformation_QuantityFilter.length || hole_Deformation_QuantityFilter.includes(item.Hole_Deformation_Quantity)) &&
                        (!mold_CodeFilter.length || mold_CodeFilter.includes(item.Mold_Code))
                      )
                        .map((item) => item.Hole_Deformation_Quantity))].map((Hole_Deformation_Quantity) => (
                        <Option key={Hole_Deformation_Quantity} value={Hole_Deformation_Quantity}>
                            {Hole_Deformation_Quantity}
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
                Tablename = 'Mold'
                historyLog={historyLog}
            />
        </>
    )
}

export default Mold;