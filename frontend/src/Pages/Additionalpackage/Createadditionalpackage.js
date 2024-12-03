import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createAdditionalpackage } from '../../Ultility/Additionalpackageapi';

const CreateAdditionalPackage = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setIsPending(true);

        const additionalpackageData = { ...values, CreateBy: '-' }; // Merge form values with CreateBy

        try {
            const result = await createAdditionalpackage(additionalpackageData);
            showNotification(result.msg, 'success');
            console.log('Additional Package:', additionalpackageData);
            console.log('API Result:', result);

            form.resetFields(); // Clear the form fields upon success
            // Optionally navigate to another route
            // setTimeout(() => navigate('/package'), 2000);
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
            <h2>แบบฟอร์มบันทึก โฟมสำเร็จรูปอุปกรณ์เสริม (Additional Package)</h2>
            <Form
                form={form} // Associate the form instance with the Form component
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    Additional_Package_Id: '',
                    Additional_Tool_Erp_Id_1: '',
                    Name_Additional_Tool_1: '',
                    Quantity_Additional_Tool_1: '',
                    Additional_Tool_Erp_Id_2: '',
                    Name_Additional_Tool_2: '',
                    Quantity_Additional_Tool_2: '',
                }}
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
                            <Button type="default" className="me-2" onClick={() => navigate('/additionalpackage')}>
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

export default CreateAdditionalPackage;
