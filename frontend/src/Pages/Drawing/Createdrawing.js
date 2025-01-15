import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { CreateDrawingapi } from '../../Ultility/Drawingapi';
import { fetchStatus } from '../../Ultility/ApiSetup/staticData';
import { fetchmaterialbp, fetchmaterialwd } from '../../Ultility/Sellectedbom';
import { fetchmaterialfilterbycompactno, fetchmaterialfilterdrawing } from '../../Ultility/Bomfilterapi';
import { fetchrmpk } from '../../Ultility/Sellectedbom';

const { Option } = Select;
const CreateDrawing = () => {
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const [wdoptions, setWdoption] = useState([]);
    const [bpoptions, setBpoption] = useState([]);
    const [loading, setLoading] = useState(false);
    //Filter
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [numFilter, setNumFilter] = useState([]);
    const [compactnoFilter, setCompactnoFilter] = useState([]);
    const [bperpoptions, setBperpoption] = useState([])
    const [wderpoptions, setwderpoption] = useState([])
    //Loading Bp & Wd Dropdown
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const Databp = await fetchmaterialbp(); 
                setBpoption(Databp.data); 
                const Datawd = await fetchmaterialwd(); 
                setWdoption(Datawd.data); 
                // console.log('Datawd', Datawd)
                //Filter BP & WD ERP
                const Data = (await fetchrmpk()).data;
                const Databperp = Data.filter(item => item.Group === "BP");
                const Datawderp = Data.filter(item => item.Group === "WD");
                setBperpoption(Databperp)
                setwderpoption(Datawderp)
                // console.log('Databperp',Databperp ,'Datawderp',Datawderp)

            } catch (error) {
                showNotification('Failed to fetch data', 'warning');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const columnNameLabels = {
        Compact_No_Modify_Drawing: "Compact No (ปรับ)",
        Part_No: "Part No.",
        Erp_Id_BP1: "รหัส ERP BP1",
        Name_BP1: "ชื่อ ERP BP1",
        Id_BP1: "ID BP1",
        Quantity_BP1: "จำนวน BP1",
        Thickness_Pad1: "ความหนาผ้า 1",
        Erp_Id_BP2: "รหัส ERP BP2",
        Name_BP2: "ชื่อ ERP BP2",
        Id_BP2: "ID BP2",
        Quantity_BP2: "จำนวน BP2",
        Thickness_Pad2: "ความหนาผ้า 2",
        Erp_Id_BP3: "รหัส ERP BP3",
        Name_BP3: "ชื่อ ERP BP3",
        Id_BP3: "ID BP3",
        Quantity_BP3: "จำนวน BP3",
        Thickness_Pad3: "ความหนาผ้า 3",
        Erp_Id_BP4: "รหัส ERP BP4",
        Name_BP4: "ชื่อ ERP BP4",
        Id_BP4: "ID BP4",
        Quantity_BP4: "จำนวน BP4",
        Thickness_Pad4: "ความหนาผ้า 4",
        Erp_Id_WD1: "รหัส ERP WD1",
        Name_WD1: "ชื่อ ERP WD1",
        Id_WD1: "ID WD1",
        Quantity_WD1: "จำนวน WD1",
        Erp_Id_WD2: "รหัส ERP WD2",
        Name_WD2: "ชื่อ ERP WD2",
        Id_WD2: "ID WD2",
        Quantity_WD2: "จำนวน WD2",
        Erp_Id_WD3: "รหัส ERP WD3",
        Name_WD3: "ชื่อ ERP WD3",
        Id_WD3: "ID WD3",
        Quantity_WD3: "จำนวน WD3",
        Status: "Status"
    };

    const initialValues = {
        Compact_No_Modify_Drawing: "",
        Part_No: "",
        Erp_Id_BP1: "",
        Name_BP1: "",
        Id_BP1: "",
        Quantity_BP1: "",
        Thickness_Pad1: "-",
        Erp_Id_BP2: "",
        Name_BP2: "",
        Id_BP2: "",
        Quantity_BP2: "",
        Thickness_Pad2: "-",
        Erp_Id_BP3: "",
        Name_BP3: "",
        Id_BP3: "",
        Quantity_BP3: "",
        Thickness_Pad3: "-",
        Erp_Id_BP4: "",
        Name_BP4: "",
        Id_BP4: "",
        Quantity_BP4: "",
        Thickness_Pad4: "-",
        Erp_Id_WD1: "",
        Name_WD1: "",
        Id_WD1: "",
        Quantity_WD1: "",
        Erp_Id_WD2: "",
        Name_WD2: "",
        Id_WD2: "",
        Quantity_WD2: "",
        Erp_Id_WD3: "",
        Name_WD3: "",
        Id_WD3: "",
        Quantity_WD3: "",
        Status: "" 
    };

    const handleSubmit = async (values) => {
        setIsPending(true);

        const drawingData = { ...values, CreateBy: '-' };

        try {
            const result = await CreateDrawingapi(drawingData);
            showNotification(result.msg, 'success');
            form.resetFields();
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
            const Data = (await fetchmaterialfilterdrawing()).data;
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
          (!numFilter.length || numFilter.includes(item.Num)) &&
          (!compactnoFilter.length || compactnoFilter.includes(item.Compact_No_Modify_Drawing)) 
          
        );
        setFilteredData(filtered);
    };
    
    useEffect(handleFilterChange, [compactnoFilter,  numFilter, rowData]);
    
    const clearFilters = () => {
        setCompactnoFilter([]);
        setNumFilter([]);
        
    };
    const HandleFilter = async () => {

        setIsPending(true);
        const Compact_No_Modify_Drawing = { Compact_No_Modify_Drawing: `${compactnoFilter}` }; // Filter payload
        // console.log('Code_Fg', Code_Fg);
    
        try {
            const result = await fetchmaterialfilterbycompactno(Compact_No_Modify_Drawing); // Fetch filtered data
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
    const handleSelectChange = (value, key) => {
        if (key === 'Erp_Id_BP1') {
            const selected = bperpoptions.find(item => item.Erp_Id === value);
            console.log('Selected 1:', selected); // Debug
            form.setFieldsValue({
                Name_BP1: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Erp_Id_BP2') {
            const selected = bperpoptions.find(item => item.Erp_Id === value);
            console.log('Selected 2:', selected); // Debug
            form.setFieldsValue({
                Name_BP2: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Erp_Id_BP3') {
            const selected = bperpoptions.find(item => item.Erp_Id === value);
            console.log('Selected 3:', selected); // Debug
            form.setFieldsValue({
                Name_BP3: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Erp_Id_BP4') {
            const selected = bperpoptions.find(item => item.Erp_Id === value);
            console.log('Selected 3:', selected); // Debug
            form.setFieldsValue({
                Name_BP4: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Erp_Id_WD1') {
            const selected = wderpoptions.find(item => item.Erp_Id === value);
            form.setFieldsValue({
                Name_WD1: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Erp_Id_WD2') {
            const selected = wderpoptions.find(item => item.Erp_Id === value);
            form.setFieldsValue({
                Name_WD2: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Erp_Id_WD3') {
            const selected = wderpoptions.find(item => item.Erp_Id === value);
            form.setFieldsValue({
                Name_WD3: selected ? selected.Name_Erp : ''
            });
        }
    };
    
    return (
        <div className="container-fluid">
            <div style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '10px' }}>Filters</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>

                    <div style={{ flex: '1 1 45%' }}>
                        <label>Filter by Part No:</label>
                        <Select
                        
                        showSearch
                        placeholder="Select Part No"
                        style={{ width: '100%' }}
                        value={numFilter}
                        onChange={(value) => setNumFilter(value)}
                        >
                        {[...new Set(filteredData.map((item) => item.Num))].map((Num) => (
                            <Option key={Num} value={Num}>
                            {Num}
                            </Option>
                        ))}
                        </Select>
                    </div>

                    <div style={{ flex: '1 1 45%' }}>
                        <label>Filter by compact no.</label>
                        <Select
                        
                        showSearch
                        placeholder="Select compact no."
                        style={{ width: '100%' }}
                        value={compactnoFilter}
                        onChange={(value) => setCompactnoFilter(value)}
                        >
                        {[...new Set(filteredData.map((item) => item.Compact_No_Modify_Drawing))].map((Compact_No_Modify_Drawing) => (
                            <Option key={Compact_No_Modify_Drawing} value={Compact_No_Modify_Drawing}>
                            {Compact_No_Modify_Drawing}
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
            <h2>แบบฟอร์มบันทึก Drawing</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={initialValues}
            >
                <div className="row">
                    {Object.entries(columnNameLabels).map(([key, label], index) => (
                        <div className={`col-xl-3 col-lg-3 col-md-4 col-sm-6`} key={index}>
                            {key === "Status" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select placeholder={`เลือก ${label}`} >
                                    <Select options={fetchStatus} /></Select>
                                </Form.Item>
                            )
                            :
                            key === "Id_BP1" ? (
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
                                            {bpoptions.map((i) => (
                                            <Option key={i.ID} value={i.ID}>
                                                {i.ID}
                                        </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Erp_Id_BP1" ? (
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
                                        onChange={(value) => handleSelectChange(value, key)}
                                    >
                                        <Option value="-">-</Option>
                                            {bperpoptions.map((i) => (
                                            <Option key={i.Erp_Id} value={i.Erp_Id}>
                                                {i.Erp_Id}
                                        </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Erp_Id_BP2" ? (
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
                                        onChange={(value) => handleSelectChange(value, key)}
                                    >
                                        <Option value="-">-</Option>
                                            {bperpoptions.map((i) => (
                                            <Option key={i.Erp_Id} value={i.Erp_Id}>
                                                {i.Erp_Id}
                                        </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Erp_Id_BP3" ? (
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
                                        onChange={(value) => handleSelectChange(value, key)}
                                    >
                                        <Option value="-">-</Option>
                                            {bperpoptions.map((i) => (
                                            <Option key={i.Erp_Id} value={i.Erp_Id}>
                                                {i.Erp_Id}
                                        </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Erp_Id_BP4" ? (
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
                                        onChange={(value) => handleSelectChange(value, key)}
                                    >
                                        <Option value="-">-</Option>
                                            {bperpoptions.map((i) => (
                                            <Option key={i.Erp_Id} value={i.Erp_Id}>
                                                {i.Erp_Id}
                                        </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Id_BP2" ? (
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
                                            {bpoptions.map((i) => (
                                            <Option key={i.ID} value={i.ID}>
                                                {i.ID}
                                        </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Id_BP3" ? (
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
                                            {bpoptions.map((i) => (
                                            <Option key={i.ID} value={i.ID}>
                                                {i.ID}
                                        </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Id_BP4" ? (
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
                                            {bpoptions.map((i) => (
                                            <Option key={i.ID} value={i.ID}>
                                                {i.ID}
                                        </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Id_WD1" ? (
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
                                            {wdoptions.map((i) => (
                                            <Option key={i.ID} value={i.ID}>
                                                {i.ID}
                                        </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Id_WD2" ? (
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
                                            {wdoptions.map((i) => (
                                            <Option key={i.ID} value={i.ID}>
                                                {i.ID}
                                        </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Id_WD3" ? (
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
                                            {wdoptions.map((i) => (
                                            <Option key={i.ID} value={i.ID}>
                                                {i.ID}
                                        </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Erp_Id_WD1" ? (
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
                                        onChange={(value) => handleSelectChange(value, key)}
                                    >
                                        <Option value="-">-</Option>
                                            {wderpoptions.map((i) => (
                                            <Option key={i.Erp_Id} value={i.Erp_Id}>
                                                {i.Erp_Id}
                                        </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Erp_Id_WD2" ? (
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
                                        onChange={(value) => handleSelectChange(value, key)}
                                    >
                                        <Option value="-">-</Option>
                                            {wderpoptions.map((i) => (
                                            <Option key={i.Erp_Id} value={i.Erp_Id}>
                                                {i.Erp_Id}
                                        </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Erp_Id_WD3" ? (
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
                                        onChange={(value) => handleSelectChange(value, key)}
                                    >
                                        <Option value="-">-</Option>
                                            {wderpoptions.map((i) => (
                                            <Option key={i.Erp_Id} value={i.Erp_Id}>
                                                {i.Erp_Id}
                                        </Option>
                                        ))}
                                    </Select>
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
                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/drawing')}>
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
    );
};

export default CreateDrawing;
