import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin, Select } from 'antd'; // Import necessary components
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { fetchShim, updateShim } from '../../Ultility/Shimapi';
import { fetchStatus } from '../../Ultility/ApiSetup/staticData';
import { fetchmaterialsp } from '../../Ultility/Sellectedbom';
import { fetchrmpk } from '../../Ultility/Sellectedbom';
const { Option } = Select;


const UpdateShim = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); // Extract ID from route params
    const navigate = useNavigate();
    const [spoptions, setShimoption] = useState([]);
    //Filter Shim
    const [shimOptionsrm, setShimrmoption] = useState([]);

    // const [loading, setLoading] = useState(false);

    //Loading Sp Dropdown
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const Data = await fetchmaterialsp(); 
                setShimoption(Data.data); 
                const Datashim = (await fetchrmpk()).data;
                const additiondata = Datashim.filter(item => item.Group === "Shim");
                setShimrmoption(additiondata)

            } catch (error) {
                showNotification('Failed to fetch data', 'warning');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);
    // Mapping the new attributes to their labels

    const columnNameLabels = {
        Compact_No_Modify: "Compact No (ปรับ)",
        Part_No: "Part No",
        Erp_Id_SP1: "รหัส Erp SP1",
        Name_SP1: "ชื่อ Erp SP1",
        Id_SP1: "ID SP1",
        Quantity_SP1: "จำนวน SP1",
        Erp_Id_SP2: "รหัส Erp SP2",
        Name_SP2: "ชื่อ Erp SP2",
        Id_SP2: "ID SP2",
        Quantity_SP2: "จำนวน SP2",
        Erp_Id_SP3: "รหัส Erp SP3",
        Name_SP3: "ชื่อ Erp SP3",
        Id_SP3: "ID SP3",
        Quantity_SP3: "จำนวน SP3",
        Status: "Status",
    };

    // Fetch shim data on component mount
    useEffect(() => {
        const load = async (id) => {
            try {
                const data = (await fetchShim(id)).data[0]; // Fetch data by ID
                

                if (data) {
                    const formData = {};
                    for (let key in columnNameLabels) {
                        formData[key] = data[key];
                    }

                    form.setFieldsValue(formData); // Populate form with data
                    setLoading(false);
                } else {
                    setLoading(false);
                    showNotification('No data found', 'error');
                }
            } catch (error) {
                setLoading(false);
                console.error('Error fetching data:', error);
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
            const updatedShim = { ...values, UpdateBy: '-' }; // Include UpdateBy field
            const result = await updateShim(id, updatedShim); // Update the package
            showNotification(result.msg, 'success');
            setTimeout(() => navigate('/shim'), 2500); // Redirect after update
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
        if (key === 'Erp_Id_SP1') {
            const selected = shimOptionsrm.find(item => item.Erp_Id === value);
            console.log('Selected 1:', selected); // Debug
            form.setFieldsValue({
                Name_SP1: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Erp_Id_SP2') {
            const selected = shimOptionsrm.find(item => item.Erp_Id === value);
            console.log('Selected 2:', selected); // Debug
            form.setFieldsValue({
                Name_SP2: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Erp_Id_SP3') {
            const selected = shimOptionsrm.find(item => item.Erp_Id === value);
            console.log('Selected 3:', selected); // Debug
            form.setFieldsValue({
                Name_SP3: selected ? selected.Name_Erp : ''
            });
        }
    };

    return (
        <div className="container-fluid">
            <h2>แก้ไข Shim (Update Shim)</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <div className="row">
                    {Object.entries(columnNameLabels).map(([key, label], index) => (
                        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6" key={index}>
                            <Form.Item
                                label={label}
                                name={key}
                                rules={[{ required: true, message: `กรุณากรอก ${label}` }]}
                            >
                                {key === 'Status' ? (
                                    <Select>
                                        {fetchStatus.map((status) => (
                                            <Option key={status.value} value={status.value}>
                                                {status.label}
                                            </Option>
                                        ))}
                                    </Select>
                                ) 
                                : 
                                key === "Id_SP1" ? (
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                    >
                                        <Option value="-">-</Option>
                                        {spoptions.map((i) => (
                                        <Option key={i.ID} value={i.ID}>
                                            {i.ID}
                                        </Option>
                                        ))}
                                    </Select>
                                ) 
                                : 
                                key === "Id_SP2" ? (
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                    >
                                        <Option value="-">-</Option>
                                            {spoptions.map((i) => (
                                            <Option key={i.ID} value={i.ID}>
                                                {i.ID}
                                        </Option>
                                        ))}
                                    </Select>
                                ) 
                                : 
                                key === "Id_SP3" ? (
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                    >
                                        <Option value="-">-</Option>
                                            {spoptions.map((i) => (
                                            <Option key={i.ID} value={i.ID}>
                                                {i.ID}
                                        </Option>
                                        ))}
                                    </Select>
                                ) 
                                : 
                                key === "Erp_Id_SP1" ? (
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                        onChange={(value) => handleSelectChange(value, key)}
                                    >
                                        <Option value="-">-</Option>
                                            {shimOptionsrm.map((i) => (
                                            <Option key={i.Erp_Id} value={i.Erp_Id}>
                                                {i.Erp_Id}
                                        </Option>
                                        ))}
                                    </Select>
                                ) 
                                : 
                                key === "Erp_Id_SP2" ? (
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                        onChange={(value) => handleSelectChange(value, key)}
                                    >
                                        <Option value="-">-</Option>
                                            {shimOptionsrm.map((i) => (
                                            <Option key={i.Erp_Id} value={i.Erp_Id}>
                                                {i.Erp_Id}
                                        </Option>
                                        ))}
                                    </Select>
                                ) 
                                : 
                                key === "Erp_Id_SP3" ? (
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                        onChange={(value) => handleSelectChange(value, key)}
                                    >
                                        <Option value="-">-</Option>
                                            {shimOptionsrm.map((i) => (
                                            <Option key={i.Erp_Id} value={i.Erp_Id}>
                                                {i.Erp_Id}
                                        </Option>
                                        ))}
                                    </Select>
                                ) 
 
                                : 
                                (
                                    <Input />
                                )}
                            </Form.Item>
                        </div>
                    ))}
                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/shim')}>
                                Back
                            </Button>
                            <Button type="primary" htmlType="submit" disabled={isPending}>
                                {isPending ? 'Updating...' : 'Update Data'}
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

export default UpdateShim;
