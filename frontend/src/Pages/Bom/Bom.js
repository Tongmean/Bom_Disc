import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchBoms, fetchHistoryLog} from '../../Ultility/Bomapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from '../Bom/DetailModal'
import { useNavigate } from 'react-router-dom';
import {Button, Select } from 'antd';
const { Option } = Select;

const Bom = () =>{
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null)
    const [selectedData, setSelectedData] = useState(null);
    const [historyLog, setHistoryLog] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    //Filter
    const [filteredData, setFilteredData] = useState([]);
    const [codeFgFilter, setCodeFgFilter] = useState([]);
    const [partNoFilter, setPartNoFilter] = useState([]);
    const [statusFilter, setStatusFilter] = useState([]);
    const [customerNameFilter, setCustomerNameFilter] = useState([]);
    const columnDefs = [
        { headerName: 'No', field: 'No', checkboxSelection: true, headerCheckboxSelection: true},
        { headerName: 'รหัส ERP (Code_Fg)', field: 'Code_Fg' , pinned: 'left' },
        { headerName: 'เบอร์', field: 'Num' },
        { headerName: 'Part No.', field: 'Part_No'},
        { headerName: 'Code การขาย', field: 'Sale_Code_Bom' },
        { headerName: 'รหัสลูกค้า', field: 'Customer_Code' },

        { headerName: 'ประเภทลูกค้า', field: 'Type_Customer' },
        { headerName: 'ชื่อลูกค้า', field: 'Customer_Name' },
        { headerName: 'วันเริ่มขาย', field: 'Start_Sale_Date' },
        { headerName: 'วันยกเลิกขาย', field: 'End_Sale_Date' },
        { headerName: 'Status', field: 'Status' },
        { headerName: 'Drawing No.', field: 'Drawing_No' },
        { headerName: 'การติด Shim', field: 'Shim_Attach' },
        { headerName: 'Shim No', field: 'Shim_No' },
        { headerName: 'Product Spec No.', field: 'Product_Spec_No' },
        { headerName: 'Data Sheet No.', field: 'Data_Sheet_No' },
        { headerName: 'เบอร์กล่อง', field: 'Display_Box_Id' },
        { headerName: 'จำนวนกล่อง', field: 'Quantity_Display_Box' },
        { headerName: 'ใส่ Outer', field: 'Outer_Package' },
        { headerName: 'รหัส Outer', field: 'Outer_Id' },
        { headerName: 'จำนวนชิ้น/ชุด', field: 'Pcs_Per_Set' },
        { headerName: 'รหัสการบรรจุที่ใส่อุปกรณ์เสริมเพิ่มเติมมา', field: 'Additional_Package_Id' },
        { headerName: 'Ref Code_Fg', field: 'Ref_Code' },
        { headerName: 'Emark Id', field: 'Emark_Id' },
        { headerName: 'น้ำหนัก', field: 'Weight' },
        { headerName: 'Kit_Id', field: 'Kit_Id' },
        { headerName: 'Check Status', field: 'Check_Status' },
        { headerName: 'Remark', field: 'Remark' },
        // { headerName: 'Check_By', field: 'Check_By' },
        // { headerName: 'Check_At', field: 'Check_At' },


        // { headerName: 'กรอกโดย', field: 'CreateBy' },
        // { headerName: 'กรอกเมื่อ', field: 'CreateAt' },
        {
            headerName: 'Actions',
            field: 'actions',
            pinned: 'right',
            cellRenderer: (params) => (
                <div>
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
        const load = async () => {
          try {
            const packageData = (await fetchBoms()).data;
            
            const mappedData = packageData.map(i => ({
                No: i.id,
                Code_Fg: i.Code_Fg,
                Num: i.Num,
                Part_No: i.Part_No,
                Sale_Code_Bom: i.Sale_Code_Bom,
                Customer_Code: i.Customer_Code,
                Type_Customer: i.Type_Customer,
                Customer_Name: i.Customer_Name,
                Start_Sale_Date: i.Start_Sale_Date,
                Status: i.Status,
                Drawing_No: i.Drawing_No,
                Shim_Attach: i.Shim_Attach,
                Product_Spec_No: i.Product_Spec_No,
                Data_Sheet_No: i.Data_Sheet_No,
                Display_Box_Id: i.Display_Box_Id,
                Quantity_Display_Box: i.Quantity_Display_Box,
                Outer_Package: i.Outer_Package,
                Outer_Id: i.Outer_Id,

                Pcs_Per_Set: i.Pcs_Per_Set,
                Additional_Package_Id: i.Additional_Package_Id,


                CreateBy: i.CreateBy,
                CreateAt: i.CreateAt,

                Ref_Code:i.Ref_Code,
                Emark_Id:i.Emark_Id,
                Weight:i.Weight,
                Kit_Id:i.Kit_Id,
                
                Check_Status:i.Check_Status,
                Check_By:i.Check_By,
                Check_At:i.Check_At,
                Remark:i.Remark

            }));
            // console.log('Mapped Data', mappedData)
            console.log('Bom Data', packageData)
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
        navigate('/createproductregister');
    };
    const handleShowEdit = (data) => {
        navigate(`/productregister/${data.No}`);
    };
    const handleFilterChange = () => {
        const filtered = rowData.filter((item) =>
          (!codeFgFilter.length || codeFgFilter.includes(item.Code_Fg)) &&
          (!partNoFilter.length || partNoFilter.includes(item.Part_No)) &&
          (!statusFilter.length || statusFilter.includes(item.Status)) &&
          (!customerNameFilter.length || customerNameFilter.includes(item.Customer_Name)) 
        );
        setFilteredData(filtered);
    };
    
    useEffect(handleFilterChange, [codeFgFilter,  partNoFilter, statusFilter, customerNameFilter, rowData]);
    
    const clearFilters = () => {
        setCodeFgFilter([]);
        setPartNoFilter([]);
        setStatusFilter([]);
        setCustomerNameFilter([])
    };
    return (
        <>
            <div style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '10px' }}>Filters</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>

                    <div style={{ flex: '1 1 45%' }}>
                        <label>Filter by รหัส Status:</label>
                        <Select
                        mode='multiple'
                        showSearch
                        placeholder="Select Status"
                        style={{ width: '100%' }}
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value)}
                        >
                        {[...new Set(filteredData.map((item) => item.Status))].map((Status) => (
                            <Option key={Status} value={Status}>
                            {Status}
                            </Option>
                        ))}
                        </Select>
                    </div>

                    <div style={{ flex: '1 1 45%' }}>
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


                    <div style={{ flex: '1 1 45%' }}>
                        <label>Filter by ชื่อลูกค้า:</label>
                        <Select
                        mode='multiple'
                        showSearch
                        placeholder="Select Customer Name."
                        style={{ width: '100%' }}
                        value={customerNameFilter}
                        onChange={(value) => setCustomerNameFilter(value)}
                        >
                        {[...new Set(filteredData.map((item) => item.Customer_Name))].map((Customer_Name) => (
                            <Option key={Customer_Name} value={Customer_Name}>
                            {Customer_Name}
                            </Option>
                        ))}
                        </Select>
                    </div>

                    <div style={{ flex: '1 1 45%' }}>
                        <label>Filter by Code_Fg (ERP):</label>
                        <Select
                        showSearch
                        mode='multiple'
                        placeholder="Select Code_Fg"
                        style={{ width: '100%' }}
                        value={codeFgFilter}
                        onChange={(value) => setCodeFgFilter(value)}
                        >
                        {[...new Set(
                                rowData.filter((item) =>
                                // (!codeFgFilter.length || codeFgFilter.includes(item.Code_Fg)) &&
                                (!partNoFilter.length || partNoFilter.includes(item.Part_No)) &&
                                (!statusFilter.length || statusFilter.includes(item.Status)) &&
                                (!customerNameFilter.length || customerNameFilter.includes(item.Customer_Name)) 
                            )
                            .map((item) => item.Code_Fg))].map((code) => (
                            <Option key={code} value={code}>
                                {code}
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
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename = "Bom"/>
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
                Tablename = 'Bom'
            />
        </>
    )
}

export default Bom;