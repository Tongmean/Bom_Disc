import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { CreateDatasheetapi } from '../../Ultility/Datasheet';

const CreateDatasheet = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    // Column Name Labels Mapping
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

    const handleSubmit = async (values) => {
        setIsPending(true);

        const datasheetData = { ...values, CreateBy: '-' }; // Merge form values with CreateBy

        try {
            const result = await CreateDatasheetapi(datasheetData);
            showNotification(result.msg, 'success');
            console.log('Datasheet:', datasheetData);
            console.log('API Result:', result);

            form.resetFields(); // Clear the form fields upon success
            // Optionally navigate to another route
            // setTimeout(() => navigate('/datasheet'), 2000);
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
            <h2>แบบฟอร์มบันทึกข้อมูล Datasheet</h2>
            <Form
                form={form} // Associate the form instance with the Form component
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    Data_Sheet_No: '',
                    Compact_No: '',
                    Grade_Chem: '',
                    Weight_F1: '',
                    Weight_F2: '',
                    Underlayer_Grade_Chem: '',
                    Weight_U1: '',
                    Weight_U2: '',
                    Formular: '',
                }}
            >
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Data_Sheet_No}
                            name="Data_Sheet_No"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Data_Sheet_No}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Compact_No}
                            name="Compact_No"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Compact_No}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Grade_Chem}
                            name="Grade_Chem"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Grade_Chem}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Weight_F1}
                            name="Weight_F1"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Weight_F1}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Weight_F2}
                            name="Weight_F2"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Weight_F2}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Underlayer_Grade_Chem}
                            name="Underlayer_Grade_Chem"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Underlayer_Grade_Chem}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Weight_U1}
                            name="Weight_U1"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Weight_U1}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Weight_U2}
                            name="Weight_U2"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Weight_U2}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Formular}
                            name="Formular"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Formular}` }]}
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

export default CreateDatasheet;
