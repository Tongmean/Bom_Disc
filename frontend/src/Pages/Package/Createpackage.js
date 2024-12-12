import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createPackage } from '../../Ultility/Packageapi';
import { fetchStatusetypemark } from '../../Ultility/ApiSetup/staticData';
const CreateDisplayBox = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setIsPending(true);

        const displayBox = { ...values, CreateBy: '-' }; // Merge form values with CreateBy

        try {
            const result = await createPackage(displayBox);
            showNotification(result.msg, 'success');
            console.log('Display Box:', displayBox);
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
            <h2>แบบฟอร์มบันทึกกล่อง (Display Box)</h2>
            <Form
                form={form} // Associate the form instance with the Form component
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    Display_Box_id: '',
                    Display_Box_Erp_Id: '',
                    Name_Display_Box_Erp: '',
                    Num_Display_Box: '',
                    Display_Box_Group: '',
                }}
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

export default CreateDisplayBox;
