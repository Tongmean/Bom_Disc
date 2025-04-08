import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { fetchDrawing, updateDrawingapi } from '../../Ultility/Drawingapi';
import { fetchStatus, fetchcheckstatus } from '../../Ultility/ApiSetup/staticData';
import { fetchmaterialbp, fetchmaterialwd } from '../../Ultility/Sellectedbom';
import { fetchrmpk } from '../../Ultility/Sellectedbom';
const { Option } = Select;


const UpdateDrawing = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); // Extract ID from route params
    const navigate = useNavigate();
    const [wdoptions, setWdoption] = useState([]);
    const [bpoptions, setBpoption] = useState([]);
    //erp filter
    const [bperpoptions, setBperpoption] = useState([])
    const [wderpoptions, setwderpoption] = useState([])
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
        Status: "Status", // Add Status field
        Check_Status: "Check Status", // Add Status field
        Remark: "Remark", // Add Status field
    };
    //Loading Bp & Wd Dropdown
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const Databp = await fetchmaterialbp(); 
                setBpoption(Databp.data); 
                const Datawd = await fetchmaterialwd(); 
                setWdoption(Datawd.data); 
                console.log('Datawd', Datawd)
                const Data = (await fetchrmpk()).data;
                const Databperp = Data.filter(item => item.Group === "BP");
                const Datawderp = Data.filter(item => item.Group === "WD");
                setBperpoption(Databperp)
                setwderpoption(Datawderp)

            } catch (error) {
                showNotification('Failed to fetch data', 'warning');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Fetch drawing data on component mount
    useEffect(() => {
        const load = async (id) => {
            try {
                const data = (await fetchDrawing(id)).data[0]; // Fetch data by ID

                if (data) {
                    form.setFieldsValue(data); // Populate form with data
                    setLoading(false);
                } else {
                    setLoading(false);
                    showNotification('No data found', 'error');
                }
            } catch (error) {
                setLoading(false);
                console.error('Error fetching data:', error); // Log the error for debugging
                showNotification('Failed to load data', 'error');
            }
        };

        if (id) {
            load(id); // Fetch data when ID is present
        }
    }, [id, form]);

    // Handle form submission
    const handleSubmit = async (values) => {
        setIsPending(true);

        try {
            const updatedDrawing = { ...values, UpdateBy: '-' }; // Include UpdateBy field
            const result = await updateDrawingapi(id, updatedDrawing); // Update the drawing
            showNotification(result.msg, 'success');
            setTimeout(() => navigate('/drawing'), 2500); // Redirect after update
        } catch (error) {
            showNotification(error.message, 'fail');
        } finally {
            setIsPending(false);
        }
    };

    // Show notification
    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 2000); // Clear notification after 2 seconds
    };

    // Loading spinner while fetching data
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }
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
    const handleClearForm = () => {
        form.resetFields(); // Clears all the form fields
        showNotification('Form values cleared', 'success');
    };
    return (
        <div className="container-fluid">
            <h2>แก้ไข Drawing (Update Drawing)</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                {/* <div className="row">
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
                                {isPending ? 'Updating...' : 'Update Data'}
                            </Button>
                        </Form.Item>
                    </div>
                </div> */}

            <div className="row">
                {['Compact_No_Modify_Drawing', 'Part_No', 'Status', 'Check_Status', 'Remark'].map((key) => (
                    <div className="col-md-4" key={key}>
                        <Form.Item
                            label={columnNameLabels[key]}
                            name={key}
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels[key]}` }]}
                        >
                            {key === "Status" ? (
                                <Select options={fetchStatus} placeholder={`เลือก ${columnNameLabels[key]}`} />
                            ) 
                            : 
                            key === "Check_Status" ? (
                                <Select options={fetchcheckstatus} placeholder={`เลือก ${columnNameLabels[key]}`} />
                            ) : (
                                <Input placeholder={`กรอก ${columnNameLabels[key]}`} />
                            )}
                        </Form.Item>
                    </div>
                ))}
            </div>

            {/* BP1 to BP4 Rows */}
            {[1, 2, 3, 4].map((num) => (
                <div className="row" key={num}>
                    {['Erp_Id_BP', 'Name_BP', 'Id_BP', 'Quantity_BP', 'Thickness_Pad'].map((prefix) => {
                        const key = `${prefix}${num}`;
                        return (
                            <div className={key.includes('Erp_Id_BP') || key.includes('Name_BP') ? "col-md-3" : "col-md-2"} key={key}>
                                <Form.Item
                                    label={columnNameLabels[key]}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณาเลือก ${columnNameLabels[key]}` }]}
                                >
                                    {key.includes('Name_BP') || key.includes('Thickness_Pad') || key.includes('Quantity_BP') ? (
                                        <Input placeholder={`กรอก ${columnNameLabels[key]}`} />
                                    ) : (
                                        <Select
                                            placeholder={`เลือก ${columnNameLabels[key]}`}
                                            loading={loading}
                                            allowClear
                                            showSearch
                                            onChange={(value) => handleSelectChange(value, key)}
                                        >
                                            <Select.Option value="-">-</Select.Option>
                                            {(key.includes('Erp_Id_BP') ? bperpoptions : bpoptions).map((i) => (
                                                <Select.Option key={i.ID || i.Erp_Id} value={i.ID || i.Erp_Id}>
                                                    {i.ID || i.Erp_Id}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>
                        );
                    })}
                </div>
            ))}

            {/* WD1 to WD3 Rows */}
            {[1, 2, 3].map((num) => (
                <div className="row" key={num}>
                    {['Erp_Id_WD', 'Name_WD', 'Id_WD', 'Quantity_WD'].map((prefix) => {
                        const key = `${prefix}${num}`;
                        return (
                            <div className="col-md-3" key={key}>
                                <Form.Item
                                    label={columnNameLabels[key]}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณาเลือก ${columnNameLabels[key]}` }]}
                                >
                                    {key.includes('Name_WD') || key.includes('Quantity_WD')? (
                                        <Input placeholder={`กรอก ${columnNameLabels[key]}`} />
                                    ) : (
                                        <Select
                                            placeholder={`เลือก ${columnNameLabels[key]}`}
                                            loading={loading}
                                            allowClear
                                            showSearch
                                            onChange={(value) => handleSelectChange(value, key)}
                                        >
                                            <Select.Option value="-">-</Select.Option>
                                            {(key.includes('Erp_Id_WD') ? wderpoptions : wdoptions).map((i) => (
                                                <Select.Option key={i.ID || i.Erp_Id} value={i.ID || i.Erp_Id}>
                                                    {i.ID || i.Erp_Id}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>
                        );
                    })}
                </div>
            ))}

            {/* Action Buttons */}
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


            </Form>

            {/* Display notification if available */}
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

export default UpdateDrawing;
