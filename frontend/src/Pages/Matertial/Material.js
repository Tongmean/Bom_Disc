import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchMaterials, fetchHistoryLog} from '../../Ultility/Materialapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from './DetailModal';
import { Select, Button } from 'antd'; // Import Ant Design components
import { useNavigate } from 'react-router-dom';
const { Option } = Select;
const Material = () =>{
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null)
    const [selectedData, setSelectedData] = useState(null);
    const [historyLog, setHistoryLog] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    // Individual filters
    const [filteredData, setFilteredData] = useState([]);
    const [type2Filter, setType2Filter] = useState([]);
    const [idFilter, setIdFilter] = useState([]);
    const [numberFilter, setNumberFilter] = useState([]);
    const [filterwithoutid, setFilterwithoutid] = useState([]);
    const columnDefs = [
        { headerName: 'ที่', field: 'id', checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'Compact_No (ปรับ)', field: 'Compact_No_Modify' },
        { headerName: 'Compact_No (Catalog)', field: 'Compact_No_Catalog' },
        { headerName: 'Drawing Number', field: 'Drawing_no' },
        { headerName: 'Type Drawing', field: 'Type_Drawing' },
        { headerName: 'เบอร์', field: 'Num' },
        { headerName: 'Sheet', field: 'Sheet' },
        { headerName: 'Date Approve', field: 'Data_Approve' },
        { headerName: 'Edion', field: 'Edion' },
        { headerName: 'รหัสตู้', field: 'Cabinet_Id' },
        { headerName: 'หมายเหตุ', field: 'Remark' },
        { headerName: 'รหัสเอกสาร', field: 'Document_Id' },
        { headerName: 'Type1', field: 'Type1' },
        { headerName: 'Type2', field: 'Type2' },
        { headerName: 'Type3', field: 'Type3' },
        { headerName: 'ID', field: 'ID' },
        { headerName: 'กว้าง', field: 'Width' },
        { headerName: 'ยาว', field: 'Length' },
        { headerName: 'หนา', field: 'Thick' },
        { headerName: 'หนารวมชิม', field: 'Shim_Thick' },
        { headerName: 'สูง', field: 'Height' },
        { headerName: 'ระยะการใช้งาน', field: 'Working_Duration' },
        { headerName: 'ขนาดรู', field: 'Hole_Scale' },
        { headerName: 'จำนวนชิ้น', field: 'Quantity_Shim' },
        { headerName: 'Option', field: 'Option' },
        { headerName: 'Area', field: 'Area' },
        { headerName: 'เจาะรู', field: 'Drill' },
        { headerName: 'ลักษณะชิม', field: 'Type_Shim' },
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
            const history = await fetchHistoryLog(data.id); // API call to fetch the history log
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
            const Data = (await fetchMaterials()).data;
            console.log('Mapped Data', Data)
            setRowData(Data); // Set the users from the API response
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
        navigate('/createcomponentpart');
    };
    const handleShowEdit = (data) => {
        navigate(`/componentpart/${data.id}`);
    };

    const handleFilterChange = () => {
        const filtered = rowData.filter((item) =>
          (!idFilter.length || idFilter.includes(item.ID)) &&
          (!type2Filter.length || type2Filter.includes(item.Type2)) &&
          (!numberFilter.length || numberFilter.includes(item.Num))
        );
        const filteredwithoutiddata = rowData.filter((item) =>
          (!type2Filter.length || type2Filter.includes(item.Type2)) &&
          (!numberFilter.length || numberFilter.includes(item.Num))
        );
        setFilteredData(filtered);
        setFilterwithoutid(filteredwithoutiddata)
        console.log('filteredwithoutiddata', filteredwithoutiddata)
    };
 
    
    
    
    useEffect(handleFilterChange, [idFilter, type2Filter, numberFilter, rowData]);

    const clearFilters = () => {
        setIdFilter([]);
        setType2Filter([]);
        setNumberFilter([])
    };
    return (
        <>
            <div style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '10px' }}>Filters</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>

                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by เบอร์.:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    placeholder="Select เบอร์."
                    style={{ width: '100%' }}
                    value={numberFilter}
                    onChange={(value) => setNumberFilter(value)}
                    >
                    {[...new Set(rowData.map((item) => item.Num))].map((Num) => (
                        <Option key={Num} value={Num}>
                            {Num}
                        </Option>
                    ))}
                    </Select>
                </div>

                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by Type 2:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    placeholder="Select Type 2"
                    style={{ width: '100%' }}
                    value={type2Filter}
                    onChange={(value) => setType2Filter(value)}
                    >
                    {[...new Set(rowData.map((item) => item.Type2))].map((Type2) => (
                        <Option key={Type2} value={Type2}>
                            {Type2}
                        </Option>
                    ))}
                    </Select>
                </div>
                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by ID:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    placeholder="Select ID"
                    style={{ width: '100%' }}
                    value={idFilter}
                    onChange={(value) => setIdFilter(value)}
                    >
                    {[...new Set(
                        filterwithoutid.map((item) => item.ID))].map((Id) => (
                        <Option key={Id} value={Id}>
                            {Id}
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
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename = "Material"/>
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
                Tablename = 'Material'
            />
        </>
    )
}

export default Material;