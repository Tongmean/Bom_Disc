import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createBom } from '../../Ultility/Bomapi';
import { fetchStatusproduct, fetchOuterproduct, fetchtypecustomerproduct, fetchcheckstatus } from '../../Ultility/ApiSetup/staticData';
import {fetchAdditionalpackages, fetchPackages , fetchOuters, fetchDatasheets, fetchProductspecs, fetchShims, fetchDrawings, fetchEmarks} from '../../Ultility/Sellectedbom';
import { fetchBomfilter, fetchBomfilterbycodefg } from '../../Ultility/Bomfilterapi';

const { Option } = Select;
const CreateBom = () => {
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [packageOptions, setPackageoptions] = useState([]);
    const [outerOptions, setOuteroptions] = useState([]);
    const [datasheetOptions, setDatasheetoptions] = useState([]);
    const [productspecOptions, setProductspecoptions] = useState([]);
    const [shimOptions, setShimoptions] = useState([]);
    const [additionalpackgeOptions, setAdditionalpackgeoptions] = useState([]);
    const [drawingOptions, setDrawingoptions] = useState([]);
    const [emarkOptions, setEmarkoptions] = useState([]);
    const navigate = useNavigate();
    //Filter
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [codeFgFilter, setCodeFgFilter] = useState([]);
    const [partNoFilter, setPartNoFilter] = useState([]);
    const [statusFilter, setStatusFilter] = useState([]);
    const [customerNameFilter, setCustomerNameFilter] = useState([]);

    // Fetch display box data on component mount
    const columnNameLabels = {
        Customer_Name: "ชื่อลูกค้า",
        Customer_Code: "รหัสลูกค้า",
        Type_Customer: "ประเภทลูกค้า",
        Sale_Code_Bom: "Code การขาย",
        Num: "เบอร์",
        Part_No: "Part No.",
        Code_Fg: "รหัส ERP (Code_Fg)",
        Drawing_No: "Drawing No.",
        Shim_Attach: "การติด Shim",
        Shim_No: "Shim No",
        Product_Spec_No: "Product Spec No.",
        Data_Sheet_No: "Data Sheet No.",
        Pcs_Per_Set: "จำนวนชิ้น/ชุด",
        Display_Box_Id: "เบอร์กล่อง",
        Quantity_Display_Box: "จำนวนกล่อง",
        Outer_Package: "ใส่ Outer",
        Outer_Id: "รหัส Outer",
        Additional_Package_Id: "รหัสการบรรจุที่ใส่อุปกรณ์เสริมเพิ่มเติมมา",
        Status: "Status",
        Start_Sale_Date: "วันเริ่มขาย",
        End_Sale_Date: "วันยกเลิกขาย",
        Emark_Id: "Emark Id",
        Ref_Code: "Ref Code_Fg",
        Weight: "น้ำหนัก",
        Check_Status: "Check Status",
        // Kit_Id: "Kit_Id",
        

    };

    //Dropdown Value
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const packageData = await fetchPackages(); 
                setPackageoptions(packageData.data); 

                const outerData = await fetchOuters(); 
                setOuteroptions(outerData.data); 

                const datasheetData = await fetchDatasheets(); 
                setDatasheetoptions(datasheetData.data); 

                const productspecData = await fetchProductspecs(); 
                setProductspecoptions(productspecData.data); 

                const shimData = await fetchShims(); 
                setShimoptions(shimData.data); 

                const drawingData = await fetchDrawings(); 
                setDrawingoptions(drawingData.data); 

                const emarkData = await fetchEmarks(); 
                setEmarkoptions(emarkData.data); 

                const additionalpackageData = await fetchAdditionalpackages(); 
                setAdditionalpackgeoptions(additionalpackageData.data); 

                // console.log('shimOptions', shimOptions)

            } catch (error) {
                showNotification('Failed to fetch data', 'warning');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);


    const handleSubmit = async (values) => {
        setIsPending(true);
        const bomData = { ...values, CreateBy: '-' }; // Add CreateBy field

        try {
            const result = await createBom(bomData);
            showNotification(result.msg, 'success');
            form.resetFields(); // Clear form fields after success
            console.log('BOM Data:', bomData);
            console.log('API Result:', result);

            // Optionally navigate after a delay
            // setTimeout(() => navigate('/bom'), 2000);
        } catch (error) {
            showNotification(error.message, 'warning');
        } finally {
            setIsPending(false);
        }
    };


    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };
    //Filter Component
    useEffect(() => {
        const load = async () => {
          try {
            const Data = (await fetchBomfilter()).data;
            // console.log('FilterData', Data)
            setRowData(Data);
            setFilteredData(Data);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
        load();
    }, []);
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
    // console.log('codeFgFilter', codeFgFilter)

    const HandleFilter = async () => {

        setIsPending(true);
        const Code_Fg = { Code_Fg: `${codeFgFilter}` }; // Filter payload
        // console.log('Code_Fg', Code_Fg);
    
        try {
            const result = await fetchBomfilterbycodefg(Code_Fg); // Fetch filtered data
            console.log('result', result);
    
            if (result.data && result.data.length > 0) {
                const initialValues = result.data[0]; // Assuming you use the first result
                console.log('initialValues', initialValues);
    
                // Update form fields with fetched data
                form.setFieldsValue({
                    ...initialValues, // Populate all matched keys
                });
    
                showNotification('Data loaded into the form successfully', 'success');
            } else {
                showNotification('No data found for the selected filter', 'warning');
            }
        } catch (error) {
            showNotification(`Failed to fetch data: ${error.message}`, 'warning');
        } finally {
            setIsPending(false);
        }
    };
    const handleClearForm = () => {
        form.resetFields(); // Clears all the form fields
        showNotification('Form values cleared', 'success');
    };
    // Loading spinner while fetching data
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spin size="large" />
            </div>
        ); // Show a spinner until the data is loaded
    }
    return (
        <>
            <div style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '10px' }}>Filters</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>

                    <div style={{ flex: '1 1 45%' }}>
                        <label>Filter by รหัส Status:</label>
                        <Select
                        
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
                        placeholder="Select Code_Fg"
                        style={{ width: '100%' }}
                        value={codeFgFilter}
                        onChange={(value) => setCodeFgFilter(value)}
                        >
                        {[...new Set(filteredData.map((item) => item.Code_Fg))].map((code) => (
                            <Option key={code} value={code}>
                            {code}
                            </Option>
                        ))}
                        </Select>
                    </div>
                </div>

                <Button type="default" style={{ marginTop: '10px',  marginRight: '10px',backgroundColor: 'blue',color: 'white',}} onClick={HandleFilter}>
                    Filter
                </Button>
                <Button type="default" style={{ marginTop: '10px' }} onClick={clearFilters}>
                    Clear Filters
                </Button>
            </div>


            <div className="container-fluid">
            <h2>แบบฟอร์มลงทะเบียนผลิตภัณฑ์ (Product Register)</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    Code_Fg: '',
                    Num: '',
                    Part_No: '',
                    Sale_Code_Bom: '',
                    Type_Customer: '',
                    Customer_Name: '',
                    Start_Sale_Date: '',
                    End_Sale_Date: '',
                    Status: '',
                    Drawing_No: '',
                    Shim_Attach: '',
                    Shim_No: '',
                    Product_Spec_No: '',
                    Data_Sheet_No: '',
                    Display_Box_Id: '',
                    Quantity_Display_Box: '',
                    Outer_Package: '',
                    Outer_Id: '',
                    Pcs_Per_Set: '',
                    Additional_Package_Id: '',
                    Customer_Code: '',
                    Ref_Code: '',
                    Emark_Id: '',
                    Weight: "",
                    // Kit_Id: ""
                    Check_Status: "Wait"

                }}
            >
                <div className="row">
                    {Object.entries(columnNameLabels).map(([key, label], index) => (
                        <div className={`col-xl-3 col-lg-3 col-md-4 col-sm-6`} key={index}>
                            {key === "Status" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    loading={loading}
                                    allowClear
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select placeholder={`เลือก ${label}`}>
                                    {fetchStatusproduct.map((status) => (
                                        <Option key={status.value} value={status.value}>
                                            {status.label}
                                        </Option>
                                    ))}
                        
                                    </Select>
                                </Form.Item>
                            )
                            :
                            
                            key === "Check_Status" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    loading={loading}
                                    allowClear
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                    
                                >
                                    <Select placeholder={`เลือก ${label}`} disabled>
                                    <Option value="-">-</Option>
                                    {fetchcheckstatus.map((status) => (
                                        <Option key={status.value} value={status.value}>
                                            {status.label}
                                        </Option>
                                    ))}
                        
                                </Select>
                                </Form.Item>
                            )
                            :
                            key === "Additional_Package_Id" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    loading={loading}
                                    allowClear
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select placeholder={`เลือก ${label}`}>
                                    <Option value="-">-</Option>
                                    {additionalpackgeOptions.map((status) => (
                                        <Option key={status.Additional_Package_Id} value={status.Additional_Package_Id}>
                                            {status.Additional_Package_Id}
                                        </Option>
                                    ))}
                        
                                </Select>
                                </Form.Item>
                            )
                            :
                            key === "Type_Customer" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    loading={loading}
                                    allowClear
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select placeholder={`เลือก ${label}`}>
                                    <Option value="-">-</Option>
                                    {fetchtypecustomerproduct.map((status) => (
                                        <Option key={status.value} value={status.value}>
                                            {status.label}
                                        </Option>
                                    ))}
                        
                                </Select>
                                </Form.Item>
                            )
                            :
                            key === "Outer_Package" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    loading={loading}
                                    allowClear
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select placeholder={`เลือก ${label}`}>
                                    {fetchOuterproduct.map((status) => (
                                        <Option key={status.value} value={status.value}>
                                            {status.label}
                                        </Option>
                                    ))}
                        
                                </Select>
                                </Form.Item>
                            )
                            :
                            key === "Shim_Attach" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    loading={loading}
                                    allowClear
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select placeholder={`เลือก ${label}`}>
                                    {fetchOuterproduct.map((status) => (
                                        <Option key={status.value} value={status.value}>
                                            {status.label}
                                        </Option>
                                    ))}
                        
                                </Select>
                                </Form.Item>
                            )
                            :
                            key === "Drawing_No" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                    >
                                        <Option value="-">-</Option>
                                        {drawingOptions.map((i) => (
                                            <Option key={i.Compact_No_Modify_Drawing} value={i.Compact_No_Modify_Drawing}>
                                                {i.Compact_No_Modify_Drawing}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Shim_No" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                    >
                                        <Option value="-">-</Option>
                                        {shimOptions.map((i) => (
                                            <Option key={i.Compact_No_Modify} value={i.Compact_No_Modify}>
                                                {i.Compact_No_Modify}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Product_Spec_No" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                    >
                                        <Option value="-">-</Option>
                                        {productspecOptions.map((i) => (
                                            <Option key={i.Product_Spec_Id} value={i.Data_Sheet_Id}>
                                                {i.Product_Spec_Id}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Data_Sheet_No" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                    >
                                        <Option value="-">-</Option>
                                        {datasheetOptions.map((i) => (
                                            <Option key={i.Data_Sheet_No} value={i.Data_Sheet_No}>
                                                {i.Data_Sheet_No}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Display_Box_Id" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                    >
                                        <Option value="-">-</Option>
                                        {packageOptions.map((i) => (
                                            <Option key={i.Rm_Pk_Id} value={i.Rm_Pk_Id}>
                                                {i.Rm_Pk_Id}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Outer_Id" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                    >
                                        <Option value="-">-</Option>
                                        {outerOptions.map((i) => (
                                            <Option key={i.Outer_Id} value={i.Outer_Id}>
                                                {i.Outer_Id}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Emark_Id" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                    >
                                        <Option value="-">-</Option>
                                        {emarkOptions.map((i) => (
                                            <Option key={i.Emark_Id} value={i.Emark_Id}>
                                                {i.Emark_Id}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Start_Sale_Date" ?
                            (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณากรอก ${label}` }]}
                                >
                                    <Input placeholder="DD/MM/YYYY" />
                                </Form.Item>
                            )
                            :
                            key === "End_Sale_Date" ?
                            (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณากรอก ${label}` }]}
                                >
                                    <Input placeholder="DD/MM/YYYY" />
                                </Form.Item>
                            )
                            :
                            (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณากรอก ${label}` }]}
                                >
                                    <Input />
                                </Form.Item>
                            )}
                        </div>
                    ))}
                </div>
                <div className="col-12">
                    <Form.Item>
                        <Button type="default" className="me-2" onClick={() => navigate('/productregister')}>
                            Back
                        </Button>
                        <Button type="primary" htmlType="submit" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Save Data'}
                        </Button>
                        <Button type="default" onClick={handleClearForm} style={{ marginLeft: '10px' }}>
                                Clear
                        </Button>
                    </Form.Item>
                </div>
            </Form>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
        </>


    );
};

export default CreateBom;
