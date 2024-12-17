import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { fetchDrawing, updateDrawingapi } from '../../Ultility/Drawingapi';
import { fetchStatus } from '../../Ultility/ApiSetup/staticData';


const UpdateDrawing = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); // Extract ID from route params
    const navigate = useNavigate();

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
    };

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

    return (
        <div className="container-fluid">
            <h2>แก้ไข Drawing (Update Drawing)</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <div className="row">
                    {Object.entries(columnNameLabels).map(([key, label]) => (
                        <div className="col-xl-4 col-lg-4 col-md-12" key={key}>
                            {key === "Status" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select placeholder={`เลือก ${label}`}>
                                        <Select options={fetchStatus} /></Select>
                                        
                                </Form.Item>
                            ) : (
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