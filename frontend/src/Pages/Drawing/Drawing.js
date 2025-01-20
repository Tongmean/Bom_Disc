import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchDrawings, fetchHistoryLog} from '../../Ultility/Drawingapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from '../Drawing/DetailModal'
import { Select, Button } from 'antd'; // Import Ant Design components
import { useNavigate } from 'react-router-dom';
const { Option } = Select;
const Drawing = () =>{
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
        { headerName: 'Compact No (ปรับ)', field: 'Compact_No_Modify_Drawing' },
        { headerName: 'Part No.', field: 'Part_No' },
        { headerName: 'รหัส ERP BP1', field: 'Erp_Id_BP1' },
        { headerName: 'ชื่อ ERP BP1', field: 'Name_BP1' },
        { headerName: 'ID BP1', field: 'Id_BP1' },
        { headerName: 'จำนวน BP1', field: 'Quantity_BP1' },
        { headerName: 'ความหนาผ้า 1', field: 'Thickness_Pad1' },

        { headerName: 'รหัส ERP BP2', field: 'Erp_Id_BP2' },
        { headerName: 'ชื่อ ERP BP2', field: 'Name_BP2' },
        { headerName: 'ID BP2', field: 'Id_BP2' },
        { headerName: 'จำนวน BP2', field: 'Quantity_BP2' },
        { headerName: 'ความหนาผ้า 2', field: 'Thickness_Pad2' },

        { headerName: 'รหัส ERP BP3', field: 'Erp_Id_BP3' },
        { headerName: 'ชื่อ ERP BP3', field: 'Name_BP3' },
        { headerName: 'ID BP3', field: 'Id_BP3' },
        { headerName: 'จำนวน BP3', field: 'Quantity_BP3' },
        { headerName: 'ความหนาผ้า 3', field: 'Thickness_Pad3' },

        { headerName: 'รหัส ERP BP4', field: 'Erp_Id_BP4' },
        { headerName: 'ชื่อ ERP BP4', field: 'Name_BP4' },
        { headerName: 'ID BP4', field: 'Id_BP4' },
        { headerName: 'จำนวน BP4', field: 'Quantity_BP4' },
        { headerName: 'ความหนาผ้า 4', field: 'Thickness_Pad4' },

        { headerName: 'รหัส ERP WD1', field: 'Erp_Id_WD1' },
        { headerName: 'ชื่อ ERP WD1', field: 'Name_WD1' },
        { headerName: 'ID WD1', field: 'Id_WD1' },
        { headerName: 'จำนวน WD1', field: 'Quantity_WD1' },

        { headerName: 'รหัส ERP WD2', field: 'Erp_Id_WD2' },
        { headerName: 'ชื่อ ERP WD2', field: 'Name_WD2' },
        { headerName: 'ID WD2', field: 'Id_WD2' },
        { headerName: 'จำนวน WD2', field: 'Quantity_WD2' },

        { headerName: 'รหัส ERP WD3', field: 'Erp_Id_WD3' },
        { headerName: 'ชื่อ ERP WD3', field: 'Name_WD3' },
        { headerName: 'ID WD3', field: 'Id_WD3' },
        { headerName: 'จำนวน WD3', field: 'Quantity_WD3' },
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
            console.log('history', history)
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
            const packageData = (await fetchDrawings()).data;
            
            const mappedData = packageData.map(i => ({
                No: i.id,
                Compact_No_Modify_Drawing: i.Compact_No_Modify_Drawing,
                Part_No: i.Part_No,
                Erp_Id_BP1: i.Erp_Id_BP1,
                Name_BP1: i.Name_BP1,
                Id_BP1: i.Id_BP1,
                Quantity_BP1: i.Quantity_BP1,
                Thickness_Pad1: i.Thickness_Pad1,

                Erp_Id_BP2: i.Erp_Id_BP2,
                Name_BP2: i.Name_BP2,
                Id_BP2: i.Id_BP2,
                Quantity_BP2: i.Quantity_BP2,
                Thickness_Pad2: i.Thickness_Pad2,

                Erp_Id_BP3: i.Erp_Id_BP3,
                Name_BP3: i.Name_BP3,
                Id_BP3: i.Id_BP3,
                Quantity_BP3: i.Quantity_BP3,
                Thickness_Pad3: i.Thickness_Pad3,

                Erp_Id_BP4: i.Erp_Id_BP4,
                Name_BP4: i.Name_BP4,
                Id_BP4: i.Id_BP4,
                Quantity_BP4: i.Quantity_BP4,
                Thickness_Pad4: i.Thickness_Pad4,

                Erp_Id_WD1: i.Erp_Id_WD1,
                Name_WD1: i.Name_WD1,
                Id_WD1: i.Id_WD1,
                Quantity_WD1: i.Quantity_WD1,

                Erp_Id_WD2: i.Erp_Id_WD2,
                Name_WD2: i.Name_WD2,
                Id_WD2: i.Id_WD2,
                Quantity_WD2: i.Quantity_WD2,

                Erp_Id_WD3: i.Erp_Id_WD3,
                Name_WD3: i.Name_WD3,
                Id_WD3: i.Id_WD3,
                Quantity_WD3: i.Quantity_WD3,
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
        navigate('/createdrawing');
    };
    const handleShowEdit = (data) => {
        navigate(`/drawing/${data.No}`);
    };
    
    const handleFilterChange = () => {
        const filtered = rowData.filter((item) =>
          (!partNoFilter.length || partNoFilter.includes(item.Part_No)) &&
          (!numberFilter.length || numberFilter.includes(item.Compact_No_Modify_Drawing))
        );
        setFilteredData(filtered);
    };
    
    useEffect(handleFilterChange, [ partNoFilter, numberFilter, rowData]);

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
                    {[...new Set(filteredData.map((item) => item.Compact_No_Modify_Drawing))].map((Num) => (
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
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename = "Drawing"/>
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
                Tablename = 'Drawing'
            />
        </>
    )
}

export default Drawing;