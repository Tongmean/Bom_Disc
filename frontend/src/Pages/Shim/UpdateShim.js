import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin, Select } from 'antd'; // Import necessary components
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { fetchShim, updateShim } from '../../Ultility/Shimapi';
import { fetchStatus } from '../../Ultility/ApiSetup/staticData';


const UpdateShim = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); // Extract ID from route params
    const navigate = useNavigate();

    // Mapping the new attributes to their labels
    const fieldLabels = {
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
        Status: "Status" // Add label for the Status field
    };

    // Fetch shim data on component mount
    useEffect(() => {
        const load = async (id) => {
            try {
                const data = (await fetchShim(id)).data[0]; // Fetch data by ID

                if (data) {
                    const formData = {};
                    for (let key in fieldLabels) {
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

    return (
        <div className="container-fluid">
            <h2>แก้ไข Shim (Update Shim)</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <div className="row">
                    {Object.keys(fieldLabels).map((key) => (
                        <div className="col-xl-4 col-lg-4 col-md-12" key={key}>
                            <Form.Item
                                label={fieldLabels[key]}
                                name={key}
                                rules={[
                                    {
                                        required: key === "Status" || key !== "Compact_No_Modify", // Make Status required
                                        message: `กรุณากรอก ${fieldLabels[key]}`
                                    }
                                ]}
                            >
                                {key === "Status" ? (
                                    <Select placeholder="Status">
                                        <Select options={fetchStatus} /></Select>
                                ) : (
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
