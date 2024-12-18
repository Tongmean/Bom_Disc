import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { fetchUser, updateUser } from '../../Ultility/Usersapi'; // Adjusted API import
import { fetchUserrole, fetchUserpermission } from '../../Ultility/ApiSetup/staticData';

const UpdateUser = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); // Extract ID from route params
    const navigate = useNavigate();

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async (id) => {
            try {
                const data = (await fetchUser(id)).data[0]; // Fetch user data by ID
                // Ensure the fetched data matches the form field names
                if (data) {
                    // const formData = {
                    //     email: data.email,
                    //     password: data.password,
                    //     role: data.role,
                    //     permission1: data.permission1,
                    //     permission2: data.permission1,
                    //     permission3: data.permission1,
                    //     permission4 data.permission1,
                    // };

                    // Set form values with fetched data
                    form.setFieldsValue(data);
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
            fetchUserData(id); // Fetch data when ID is present
        }
    }, [id, form]);

    // Handle form submission
    const handleSubmit = async (values) => {
        setIsPending(true);

        try {
            const updatedUser = { ...values, updatedBy: '-' }; // Include updatedBy field
            const result = await updateUser(id, updatedUser); // Update user data
            showNotification(result.msg, 'success');
            setTimeout(() => navigate('/usermanagement'), 2000); // Redirect after update
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
            <h2>แก้ไขผู้ใช้ (Update User)</h2>
            <Form
                form={form} // Connect form instance
                layout="vertical"
                onFinish={handleSubmit}
            >
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'กรุณากรอก Email' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'กรุณากรอก Password' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                      
                        <Form.Item
                            label="Permission 2"
                            name="permission2"
                            rules={[{ required: true, message: 'กรุณาเลือก Permission' }]}
                        >
                            <Select placeholder="Select a permmision">
                                <Select.Option options= {fetchUserpermission}></Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Permission 4"
                            name="permission4"
                            rules={[{ required: true, message: 'กรุณาเลือก Permission' }]}
                        >
                            <Select placeholder="Select a permmision">
                                <Select.Option options= {fetchUserpermission}></Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label="Role"
                            name="role"
                            rules={[{ required: true, message: 'กรุณากรอก Role' }]}
                        >
                            <Select>
                                <Select.Option options= {fetchUserrole}></Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Permission 1"
                            name="permission1"
                            rules={[{ required: true, message: 'กรุณาเลือก Permission' }]}
                        >
                            <Select placeholder="Select a permmision">
                                <Select.Option options= {fetchUserpermission}></Select.Option>
                            </Select>
                        </Form.Item>
                        
           
                        <Form.Item
                            label="Permission 3"
                            name="permission3"
                            rules={[{ required: true, message: 'กรุณาเลือก Permission' }]}
                        >
                            <Select placeholder="Select a permmision">
                                <Select.Option options= {fetchUserpermission}></Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/usermanagement')}>
                                Back
                            </Button>
                            <Button type="primary" htmlType="submit" disabled={isPending}>
                                {isPending ? 'Updating...' : 'Update User'}
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

export default UpdateUser;
