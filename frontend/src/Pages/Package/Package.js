import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchPackages, fetchHistoryLog} from '../../Ultility/Packageapi';
import { baseURLpackage} from '../../Ultility/ApiSetup/api';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from '../Package/DetailModal'
import { Select, Button } from 'antd'; // Import Ant Design components
import { useNavigate } from 'react-router-dom';
const { Option } = Select;
const Package = () =>{
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
    const [pkFilter, setPkFilter] = useState([]);
    const [matcatFilter, setMatcatFilter] = useState([]);
    const [submatcatFilter, setSubmatcatFilter] = useState([]);
    const [groupFilter, setGroupFilter] = useState([]);
    
    const columnDefs = [
        { headerName: 'No', field: 'id', checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'รหัสเรียก', field: 'Rm_Pk_Id' },
        { headerName: 'กลุ่มสินค้า', field: 'Mat_Cat' },
        { headerName: 'กลุ่ม', field: 'Group' },
        { headerName: 'กลุ่มสินค้าย่อย', field: 'Sub_Mat_Cat' },


        { headerName: 'รหัสสินค้า Erp', field: 'Erp_Id' },
        { headerName: 'ชื่อสินค้า Erp', field: 'Name_Erp' },
        { headerName: 'ขนาด (Demension)', field: 'Dimension' },
        { headerName: 'น้ำหนัก', field: 'Weight' },
        { headerName: 'Spec', field: 'Spec' },
        { headerName: 'หน่วย', field: 'Unit' },
        { headerName: 'Status', field: 'Status' },
        // { headerName: 'กรอกโดย', field: 'CreateBy' },
        // { headerName: 'กรอกเมื่อ', field: 'CreateAt' },
        {
            headerName: 'Actions',
            field: 'actions',
            cellRenderer: (params) => (
                <div>
                    {params.data.unqiuename && (
                        <a
                            href={`${baseURLpackage}/${encodeURIComponent(params.data.unqiuename)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button
                                className="btn btn-info btn-sm"
                                style={{ marginRight: '5px' }}
                            >
                                P
                            </button>
                        </a>
                    )}
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
        const loadpackages = async () => {
          try {
            const packageData = (await fetchPackages()).data;
            setRowData(packageData); // Set the users from the API response
            console.log('packageData', packageData)
          } catch (err) {
            setError(err.message); // Set the error message if something goes wrong
          } finally {
            setLoading(false); // Turn off the loading state once the operation is complete
          }
        };
    
        loadpackages();
    }, []);

    const onGridReady = params => {
        setGridApi(params.api);
    };

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        console.log('Selected rows:', selectedRows);
    };

    const handleOnClick = () => {
        navigate('/createPackage');
    };
    const handleShowEdit = (data) => {
        navigate(`/package/${data.id}`);
    };

    const handleFilterChange = () => {
        const filtered = rowData.filter((item) =>
          (!pkFilter.length || pkFilter.includes(item.Rm_Pk_Id)) &&
          (!groupFilter.length || groupFilter.includes(item.Group)) &&
          (!matcatFilter.length || matcatFilter.includes(item.Mat_Cat)) &&
          (!submatcatFilter.length || submatcatFilter.includes(item.Sub_Mat_Cat))
        );
        setFilteredData(filtered);
    };
    
    useEffect(handleFilterChange, [submatcatFilter,matcatFilter, pkFilter, groupFilter, rowData]);

    const clearFilters = () => {
        setSubmatcatFilter([])
        setMatcatFilter([])
        setPkFilter([])
        setGroupFilter([])
    };
    return (
        <>
            <div style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '10px' }}>Filters</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>

                <div style={{ flex: '1 1 45%' }}>
                    <label>Filter by กลุ่มสินค้า</label>
                    <Select
                    mode='multiple'
                    showSearch
                    placeholder="Select กลุ่มสินค้า"
                    style={{ width: '100%' }}
                    value={matcatFilter}
                    onChange={(value) => setMatcatFilter(value)}
                    >
                    {[...new Set(filteredData.map((item) => item.Mat_Cat))].map((Mat_Cat) => (
                        <Option key={Mat_Cat} value={Mat_Cat}>
                            {Mat_Cat}
                        </Option>
                    ))}
                    </Select>
                </div>
                <div style={{ flex: '1 1 45%' }}>
                    <label>Filter by กลุ่ม.:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    placeholder="Select กลุ่ม"
                    style={{ width: '100%' }}
                    value={groupFilter}
                    onChange={(value) => setGroupFilter(value)}
                    >
                    {[...new Set(filteredData.map((item) => item.Group))].map((group) => (
                        <Option key={group} value={group}>
                            {group}
                        </Option>
                    ))}
                    </Select>
                </div>
                <div style={{ flex: '1 1 45%' }}>
                    <label>Filter by กลุ่มสินค้าย่อย</label>
                    <Select
                    mode='multiple'
                    showSearch
                    placeholder="Select กลุ่มสินค้าย่อย"
                    style={{ width: '100%' }}
                    value={submatcatFilter}
                    onChange={(value) => setSubmatcatFilter(value)}
                    >
                    {[...new Set(filteredData.map((item) => item.Sub_Mat_Cat))].map((Sub_Mat_Cat) => (
                        <Option key={Sub_Mat_Cat} value={Sub_Mat_Cat}>
                            {Sub_Mat_Cat}
                        </Option>
                    ))}
                    </Select>
                </div>
                <div style={{ flex: '1 1 45%' }}>
                    <label>Filter by รหัสเรียก</label>
                    <Select
                    mode='multiple'
                    showSearch
                    placeholder="Select รหัสเรียก"
                    style={{ width: '100%' }}
                    value={pkFilter}
                    onChange={(value) => setPkFilter(value)}
                    >
                    {[...new Set(filteredData.map((item) => item.Rm_Pk_Id))].map((Rm_Pk_Id) => (
                        <Option key={Rm_Pk_Id} value={Rm_Pk_Id}>
                            {Rm_Pk_Id}
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
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename = "Package"/>
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
                Tablename = 'RM&PK'
            />
        </>
    )
}

export default Package;