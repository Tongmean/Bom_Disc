import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createShim } from '../../Ultility/Shimapi'; // Assuming you have a similar API function
import { fetchStatus } from '../../Ultility/ApiSetup/staticData';
import { fetchmaterialsp } from '../../Ultility/Sellectedbom';
const { Option } = Select;

const CreateShim = () => {
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const [spoptions, setShimoption] = useState([]);
    const [loading, setLoading] = useState(false);

    //Loading Sp Dropdown
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const Data = await fetchmaterialsp(); 
                setShimoption(Data.data); 

            } catch (error) {
                showNotification('Failed to fetch data', 'warning');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const columnNameLabels = {
        Compact_No_Modify: "Compact No (ปรับ)",
        Part_No: "Part No",
        Name_SP1: "ชื่อ SP1",
        Erp_Id_SP1: "รหัส SP1",
        Id_SP1: "ID SP1",
        Quantity_SP1: "จำนวน SP1",
        Name_SP2: "ชื่อ SP2",
        Erp_Id_SP2: "รหัส SP2",
        Id_SP2: "ID SP2",
        Quantity_SP2: "จำนวน SP2",
        Name_SP3: "ชื่อ SP3",
        Erp_Id_SP3: "รหัส SP3",
        Id_SP3: "ID SP3",
        Quantity_SP3: "จำนวน SP3",
        Status: "Status",
    };

    const handleSubmit = async (values) => {
        setIsPending(true);

        const shimData = { ...values, CreateBy: '-' };

        try {
            const result = await createShim(shimData);
            showNotification(result.msg, 'success');
            console.log('Shim Data:', shimData);
            console.log('API Result:', result);

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
    return (
        <div className="container-fluid">
            <h2>แบบฟอร์มบันทึก Shim</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    Compact_No_Modify: '',
                    Part_No: '',
                    Name_SP1: '',
                    Erp_Id_SP1: '',
                    Id_SP1: '',
                    Quantity_SP1: '',
                    Name_SP2: '',
                    Erp_Id_SP2: '',
                    Id_SP2: '',
                    Quantity_SP2: '',
                    Name_SP3: '',
                    Erp_Id_SP3: '',
                    Id_SP3: '',
                    Quantity_SP3: '',
                    Status: '',
                }}
            >
                <div className="row">
                    {Object.entries(columnNameLabels).map(([key, label], index) => (
                        <div className="col-xl-4 col-lg-4 col-md-6" key={index}>
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
                                {isPending ? 'Saving...' : 'Save Data'}
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

export default CreateShim;
