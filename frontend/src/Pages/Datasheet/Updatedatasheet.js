import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { fetchDatasheet, updateDatasheet } from '../../Ultility/Datasheet';

const UpdateDatasheet = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); // Extract ID from route params
    const navigate = useNavigate();

    // Static column labels
    const columnNameLabels = {
        Data_Sheet_No: "Data Sheet No.",
        Compact_No: "Compact No.",
        Grade_Chem: "เกรดเคมี.",
        Weight_F1: "น้ำหนักเคมี F1",
        Weight_F2: "น้ำหนักเคมี F2",
        Underlayer_Grade_Chem: "เกรดเคมี Underlayer",
        Weight_U1: "น้ำหนักเคมี U1",
        Weight_U2: "น้ำหนักเคมี U2",
        Formular: "สูตร",
    };

    // Fetch datasheet data on component mount
    useEffect(() => {
        const fetchDatasheetbyid = async (id) => {
            try {
                const data = (await fetchDatasheet(id)).data[0]; // Fetch data by ID

                if (data) {
                    const formData = {
                        Data_Sheet_No: data.Data_Sheet_No,
                        Compact_No: data.Compact_No,
                        Grade_Chem: data.Grade_Chem,
                        Weight_F1: data.Weight_F1,
                        Weight_F2: data.Weight_F2,
                        Underlayer_Grade_Chem: data.Underlayer_Grade_Chem,
                        Weight_U1: data.Weight_U1,
                        Weight_U2: data.Weight_U2,
                        Formular: data.Formular,
                    };
                    console.log('data', data)
                    console.log('formData', formData)
                    // Set the form fields with fetched data
                    form.setFieldsValue(formData); 
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
            fetchDatasheetbyid(id); // Fetch data when ID is present
        }
    }, [id, form]);

    // Handle form submission
    const handleSubmit = async (values) => {
        setIsPending(true);

        try {
            const updatedDatasheet = { ...values, UpdateBy: '-' }; // Include UpdateBy field
            const result = await updateDatasheet(id, updatedDatasheet); // Update the datasheet
            showNotification(result.msg, 'success');
            setTimeout(() => navigate('/datasheet'), 2500); // Redirect after update
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
            <h2>แก้ไข Datasheet (Update Datasheet)</h2>
            <Form
                form={form} // Connect form instance
                layout="vertical"
                onFinish={handleSubmit}
            >
                <div className="row">
                    {/* Static form fields for each attribute */}
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Data_Sheet_No}
                            name="Data_Sheet_No"
                            rules={[{ required: true, message: 'กรุณากรอก Data Sheet No.' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Compact_No}
                            name="Compact_No"
                            rules={[{ required: true, message: 'กรุณากรอก Compact No.' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Grade_Chem}
                            name="Grade_Chem"
                            rules={[{ required: true, message: 'กรุณากรอก เกรดเคมี.' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Weight_F1}
                            name="Weight_F1"
                            rules={[{ required: true, message: 'กรุณากรอก น้ำหนักเคมี F1' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Weight_F2}
                            name="Weight_F2"
                            rules={[{ required: true, message: 'กรุณากรอก น้ำหนักเคมี F2' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Underlayer_Grade_Chem}
                            name="Underlayer_Grade_Chem"
                            rules={[{ required: true, message: 'กรุณากรอก เกรดเคมี Underlayer' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Weight_U1}
                            name="Weight_U1"
                            rules={[{ required: true, message: 'กรุณากรอก น้ำหนักเคมี U1' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Weight_U2}
                            name="Weight_U2"
                            rules={[{ required: true, message: 'กรุณากรอก น้ำหนักเคมี U2' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Formular}
                            name="Formular"
                            rules={[{ required: true, message: 'กรุณากรอก สูตร' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>

                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/datasheet')}>
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

export default UpdateDatasheet;
