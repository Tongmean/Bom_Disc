import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { fetchPackage, updatePackage } from '../../Ultility/Packageapi';

const UpdateDisplayBox = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); // Extract ID from route params
    const navigate = useNavigate();

    // Fetch display box data on component mount
    useEffect(() => {
        const fetchDisplayBox = async (id) => { 
            try {
                const data = (await fetchPackage(id)).data[0]; // Fetch data by ID
                // console.log('Fetched data:', data); // Log the fetched data to debug

                // Ensure the fetched data matches the form field names
                if (data) {

                    const formData = {
                        Display_Box_id: data.Display_Box_id,
                        Display_Box_Erp_Id: data.Display_Box_Erp_Id,
                        Name_Display_Box_Erp: data.Name_Display_Box_Erp,
                        Num_Display_Box: data.Num_Display_Box,
                        Display_Box_Group: data.Display_Box_Group
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
            fetchDisplayBox(id); // Fetch data when ID is present
        }
    }, [id, form]);

    // Handle form submission
    const handleSubmit = async (values) => {
        setIsPending(true);
        // console.log('Submitted values:', values); // Debugging form submission

        try {
            const updatedBox = { ...values, UpdateBy: '-' }; // Include UpdateBy field
            const result = await updatePackage(id, updatedBox); // Update the package
            showNotification(result.msg, 'success');
            setTimeout(() => navigate('/package'), 2000); // Redirect after update
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
            <h2>แก้ไขกล่อง (Update Display Box)</h2>
            <Form
                form={form} // Connect form instance
                layout="vertical"
                onFinish={handleSubmit}
            >
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label="รหัสกล่อง"
                            name="Display_Box_id"
                            rules={[{ required: true, message: 'กรุณากรอก รหัสกล่อง' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="รหัส ERP กล่อง"
                            name="Display_Box_Erp_Id"
                            rules={[{ required: true, message: 'กรุณากรอก รหัส ERP กล่อง' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="ชื่อ ERP กล่อง"
                            name="Name_Display_Box_Erp"
                            rules={[{ required: true, message: 'กรุณากรอก ชื่อ ERP กล่อง' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="เบอร์กล่อง"
                            name="Num_Display_Box"
                            rules={[{ required: true, message: 'กรุณากรอก เบอร์กล่อง' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label="กลุ่ม"
                            name="Display_Box_Group"
                            rules={[{ required: true, message: 'กรุณากรอก กลุ่ม' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/package')}>
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

export default UpdateDisplayBox;
