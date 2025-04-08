import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchdDatasheets, fetchHistoryLog} from '../../Ultility/Datasheet';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from '../Datasheet/DetailModal'
import { Select, Button, Spin } from 'antd'; // Import Ant Design components
import { useNavigate } from 'react-router-dom';
import { baseURLMaterial } from '../../Ultility/ApiSetup/api';
const { Option } = Select;
const DataSheet = () =>{
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
    const navigate = useNavigate();

    const columnDefs = [
        { headerName: 'No', field: 'No', checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'Data Sheet No.', field: 'Data_Sheet_No' , pinned: 'left'},
        { headerName: 'Compact No.', field: 'Compact_No' },
        { headerName: 'เกรดเคมี.', field: 'Grade_Chem' },
        { headerName: 'น้ำหนักเคมี F1', field: 'Weight_F1' },
        { headerName: 'น้ำหนักเคมี F2', field: 'Weight_F2' },
        { headerName: 'เกรดเคมี Underlayer', field: 'Underlayer_Grade_Chem' },
        { headerName: 'น้ำหนักเคมี U1', field: 'Weight_U1' },
        { headerName: 'น้ำหนักเคมี U2', field: 'Weight_U2' },
        { headerName: 'สูตร', field: 'Formular' },

        { headerName: 'แม่พิมพ์เย็น', field: 'Mold_Cold' },
        { headerName: 'เครื่องจักรพิมพ์เย็น', field: 'Machine_Cold' },
        { headerName: 'แรงดันพิมพ์เย็น', field: 'Presure_Cold' },
        { headerName: 'ชิ้นต่อพิมพ์ (พิมพ์เย็น)', field: 'Piece_Per_Mold_Cold' },
        { headerName: 'แม่พิมพ์ร้อน', field: 'Mold_Hot' },
        { headerName: 'อุณหภูมิบน', field: 'Temperature_Upper' },
        { headerName: 'อุณหภูมิล้าง', field: 'Temperature_Lower' },
        { headerName: 'เครื่องจักรพิมพ์ร้อน', field: 'Machine_Hot' },
        { headerName: 'แรงดันพิมพ์ร้อน', field: 'Presure_Hot' },
        { headerName: 'ชิ้นต่อพิมพ์ (พิมพ์ร้อน)', field: 'Piece_Per_Mold_Hot' },

        { headerName: 'ID', field: 'ID' },
        { headerName: 'Area', field: 'Area' },
        { headerName: 'ความหนา SD', field: 'Thick' },
        { headerName: 'ความหนา SD + 0.5', field: 'Thickplus' },


        { headerName: 'Status', field: 'Status' },
        { headerName: 'Check Status', field: 'Check_Status' },
        { headerName: 'Remark', field: 'Remark' },
        // { headerName: 'กรอกโดย', field: 'CreateBy' },
        // { headerName: 'กรอกเมื่อ', field: 'CreateAt' },
        {
            headerName: 'Actions',
            field: 'actions',
            pinned: 'right',
            cellRenderer: (params) => (
                <div>
                    {params.data.materialfile && (
                        <a
                            href={`${baseURLMaterial}/${encodeURIComponent(params.data.materialfile)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button
                                className="btn btn-warning btn-sm"
                                style={{ marginRight: '5px' }}
                            >
                                C
                            </button>
                        </a>
                    )}
                    <button
                        className={`btn btn-sm ${
                            params.data.Check_Status === 'Review' ? 'btn-warning' :
                            params.data.Check_Status === 'Reject' ? 'btn-danger' :
                            params.data.Check_Status === 'Wait' ? 'btn-success' :
                            'btn-primary'
                        }`}
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
            const packageData = (await fetchdDatasheets()).data;
            // console.log('packageData',packageData)
            const mappedData = packageData.map(i => ({
                No: i.id,
                Data_Sheet_No: i.Data_Sheet_No,
                Compact_No: i.Compact_No,
                Grade_Chem: i.Grade_Chem,
                Weight_F1: i.Weight_F1,
                Weight_F2: i.Weight_F2,
                Underlayer_Grade_Chem: i.Underlayer_Grade_Chem,
                Weight_U1: i.Weight_U1,
                Weight_U2: i.Weight_U2,
                Formular: i.Formular,
                Status: i.Status,
                CreateBy: i.CreateBy,
                CreateAt: i.CreateAt,

                Mold_Cold: i.Mold_Cold,
                Machine_Cold: i.Machine_Cold,
                Presure_Cold: i.Presure_Cold,
                Piece_Per_Mold_Cold: i.Piece_Per_Mold_Cold,
                Mold_Hot: i.Mold_Hot,
                Temperature_Upper: i.Temperature_Upper,
                Temperature_Lower: i.Temperature_Lower,
                Machine_Hot: i.Machine_Hot,
                Presure_Hot: i.Presure_Hot,
                Piece_Per_Mold_Hot: i.Piece_Per_Mold_Hot,
                Check_Status: i.Check_Status,
                Remark: i.Remark,
                Check_By: i.Check_By,
                Check_At: i.Check_At,

                ID: i.ID,
                Thick: i.Thick,
                Area: i.Area,
                materialfile: i.materialfile,
                Thickplus: (parseFloat(i.Thick) + 0.5)


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
        navigate('/createdatasheet');
    };
    const handleShowEdit = (data) => {
        navigate(`/datasheet/${data.No}`);
    };
    const handleFilterChange = () => {
        const filtered = rowData.filter((item) =>
          (!partNoFilter.length || partNoFilter.includes(item.Compact_No)) &&
          (!gradingFilter.length || gradingFilter.includes(item.Grade_Chem))
        );
        setFilteredData(filtered);
    };
    
    useEffect(handleFilterChange, [ partNoFilter, gradingFilter, rowData]);

    const clearFilters = () => {
        setPartNoFilter([]);
        setGradingFilter([])
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
            </div>
            <div>
                <button className='btn btn-success btn-sm' style={{ marginBottom: '10px' }} onClick={handleOnClick}>เพิ่มรายการ</button>
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename = "Data-Sheet"/>
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
                    onGridReady={onGridReady}
                    onSelectionChanged={onSelectionChanged}
                />
            )}
            <DetailModal
                show={showModal}
                onHide={handleCloseModal}
                data={selectedData}
                historyLog={historyLog}
                Tablename = 'Data-Sheet'
            />
        </>
    )
}

export default DataSheet;