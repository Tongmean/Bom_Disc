import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { fetchAdditionalpackage, updateAdditionalpackage } from '../../Ultility/Additionalpackageapi';

const UpdateAdditionPackage = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); // Extract ID from route params
    const navigate = useNavigate();

    // Fetch additional package data on component mount
    useEffect(() => {
        const loads = async (id) => { 
            try {
                const data = (await fetchAdditionalpackage(id)).data[0]; // Fetch data by ID
                // console.log('Fetched data:', data); // Log the fetched data to debug

                // Ensure the fetched data matches the form field names
                if (data) {
                    const formData = {
                        Additional_Package_Id: data.Additional_Package_Id,
                        Additional_Tool_Erp_Id_1: data.Additional_Tool_Erp_Id_1,
                        Name_Additional_Tool_1: data.Name_Additional_Tool_1,
                        Quantity_Additional_Tool_1: data.Quantity_Additional_Tool_1,
                        Additional_Tool_Erp_Id_2: data.Additional_Tool_Erp_Id_2,
                        Name_Additional_Tool_2: data.Name_Additional_Tool_2,
                        Quantity_Additional_Tool_2: data.Quantity_Additional_Tool_2
                    };

                    // Check if the form is ready and set the values
                    form.setFieldsValue(formData); // Populate form with data
                    setLoading(false);
                    // console.log('formData', formData); // Log the fetched data to debug

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
            loads(id); // Fetch data when ID is present
        }
    }, [id, form]);

    // Handle form submission
    const handleSubmit = async (values) => {
        setIsPending(true);
        // console.log('Submitted values:', values); // Debugging form submission

        try {
            const updatedAdditionalpackage = { ...values, UpdateBy: '-' }; // Include UpdateBy field
            const result = await updateAdditionalpackage(id, updatedAdditionalpackage); // Update the package
            showNotification(result.msg, 'success');
            setTimeout(() => navigate('/additionalpackage'), 2000); // Redirect after update
        } catch (error) {
            showNotification(error.message, 'fail');
        } finally {
            setIsPending(false);
        }
    };

    // Show notification
    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 2000); // Clear notification after 3 seconds
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
        <div className="container-fluid">
            <h2>แก้ไข โฟมสำเร็จรูปอุปกรณ์เสริม (Update Additional Package)</h2>
            <Form
                form={form} // Connect form instance
                layout="vertical"
                onFinish={handleSubmit}
            >
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label="รหัสการบรรจุที่ใส่อุปกรณ์เสริมเพิ่มมา"
                            name="Additional_Package_Id"
                            rules={[{ required: true, message: 'กรุณากรอก รหัสการบรรจุที่ใส่อุปกรณ์เสริมเพิ่มมา' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="รหัส ERP โฟมและอุปกรณ์เสริม 1"
                            name="Additional_Tool_Erp_Id_1"
                            rules={[{ required: true, message: 'กรุณากรอก รหัส ERP โฟมและอุปกรณ์เสริม 1' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="ชื่อ ERP โฟมและอุปกรณ์เสริม 1"
                            name="Name_Additional_Tool_1"
                            rules={[{ required: true, message: 'กรุณากรอก ชื่อ ERP โฟมและอุปกรณ์เสริม 1' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="จำนวนโฟมและอุปกรณ์เสริม 1"
                            name="Quantity_Additional_Tool_1"
                            rules={[{ required: true, message: 'กรุณากรอก จำนวนโฟมและอุปกรณ์เสริม 1' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label="รหัส ERP โฟมและอุปกรณ์เสริม 2"
                            name="Additional_Tool_Erp_Id_2"
                            rules={[{ required: true, message: 'กรุณากรอก รหัส ERP โฟมและอุปกรณ์เสริม 2' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="ชื่อ ERP โฟมและอุปกรณ์เสริม 2"
                            name="Name_Additional_Tool_2"
                            rules={[{ required: true, message: 'กรุณากรอก ชื่อ ERP โฟมและอุปกรณ์เสริม 2' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="จำนวนโฟมและอุปกรณ์เสริม 2"
                            name="Quantity_Additional_Tool_2"
                            rules={[{ required: true, message: 'กรุณากรอก จำนวนโฟมและอุปกรณ์เสริม 2' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/c')}>
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

export default UpdateAdditionPackage;
