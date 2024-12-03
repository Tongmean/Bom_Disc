import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { fetchOuter, updateOuter } from '../../Ultility/Outerapi';

const UpdateOuter = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); // Extract ID from route params
    const navigate = useNavigate();

    // Column names and their labels
    const columnNameLabels = {
        Outer_Id: "รหัส Outer",
        Num_Display_Box: "เบอร์กล่อง",
        Type_Diecut: "ลักษณะ Die Cut",
        Num_Outer: "เบอร์ Outer",
        Outer_Erp_Id: "รหัส ERP",
        Name_Outer_Erp: "ชื่อ Outer",
        Set_Per_Outer: "จำนวน Set/ Outer",
        Set_Per_Outer_1: "จำนวน Set/ Outer_1",
        Outer_Erp_Sticker: "รหัส ERP Sticker",
        Name_Outer_Erp_Sticker: "ชื่อ ERP Sticker",
        Num_Sticker: "จำนวน Sticker",
        Outer_Per_pallet: "จำนวน Outer/ พาเลท",
    };

    // Fetch display box data on component mount
    useEffect(() => {
        const fetchOuter1 = async (id) => { 
            try {
                const data = (await fetchOuter(id)).data[0]; // Fetch data by ID
                // console.log('Fetched data:', data); // Log the fetched data to debug

                // Ensure the fetched data matches the form field names
                if (data) {
                    const formData = {
                        Outer_Id: data.Outer_Id,
                        Num_Display_Box: data.Num_Display_Box,
                        Type_Diecut: data.Type_Diecut,
                        Num_Outer: data.Num_Outer,
                        Outer_Erp_Id: data.Outer_Erp_Id,
                        Name_Outer_Erp: data.Name_Outer_Erp,
                        Set_Per_Outer: data.Set_Per_Outer,
                        Set_Per_Outer_1: data.Set_Per_Outer_1,
                        Outer_Erp_Sticker: data.Outer_Erp_Sticker,
                        Name_Outer_Erp_Sticker: data.Name_Outer_Erp_Sticker,
                        Num_Sticker: data.Num_Sticker,
                        Outer_Per_pallet: data.Outer_Per_pallet,
                    };

                    // Check if the form is ready and set the values
                    form.setFieldsValue(formData); // Populate form with data
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
            fetchOuter1(id); // Fetch data when ID is present
        }
    }, [id, form]);

    // Handle form submission
    const handleSubmit = async (values) => {
        setIsPending(true);
        // console.log('Submitted values:', values); // Debugging form submission

        try {
            const outer = { ...values, UpdateBy: '-' }; // Include UpdateBy field
            const result = await updateOuter(id, outer); // Update the package
            showNotification(result.msg, 'success');
            setTimeout(() => navigate('/outer'), 2500); // Redirect after update
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
            <h2>แก้ไข Outer (Update Outer)</h2>
            <Form
                form={form} // Connect form instance
                layout="vertical"
                onFinish={handleSubmit}
            >
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Outer_Id}
                            name="Outer_Id"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Outer_Id}` }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={columnNameLabels.Num_Display_Box}
                            name="Num_Display_Box"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Num_Display_Box}` }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={columnNameLabels.Type_Diecut}
                            name="Type_Diecut"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Type_Diecut}` }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={columnNameLabels.Num_Outer}
                            name="Num_Outer"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Num_Outer}` }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={columnNameLabels.Outer_Erp_Id}
                            name="Outer_Erp_Id"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Outer_Erp_Id}` }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={columnNameLabels.Name_Outer_Erp}
                            name="Name_Outer_Erp"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Name_Outer_Erp}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Set_Per_Outer}
                            name="Set_Per_Outer"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Set_Per_Outer}` }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={columnNameLabels.Set_Per_Outer_1}
                            name="Set_Per_Outer_1"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Set_Per_Outer_1}` }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={columnNameLabels.Outer_Erp_Sticker}
                            name="Outer_Erp_Sticker"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Outer_Erp_Sticker}` }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={columnNameLabels.Name_Outer_Erp_Sticker}
                            name="Name_Outer_Erp_Sticker"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Name_Outer_Erp_Sticker}` }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={columnNameLabels.Num_Sticker}
                            name="Num_Sticker"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Num_Sticker}` }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={columnNameLabels.Outer_Per_pallet}
                            name="Outer_Per_pallet"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Outer_Per_pallet}` }]}
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

export default UpdateOuter;
