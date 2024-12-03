import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createShim } from '../../Ultility/Shimapi'; // Assuming you have a similar API function

const CreateShim = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    const columnNameLabels = {
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
    };

    const handleSubmit = async (values) => {
        setIsPending(true);

        const shimData = { ...values, CreateBy: '-' }; // Merge form values with CreateBy

        try {
            const result = await createShim(shimData);
            showNotification(result.msg, 'success');
            console.log('Shim Data:', shimData);
            console.log('API Result:', result);

            form.resetFields(); // Clear the form fields upon success
            // Optionally navigate to another route
            // setTimeout(() => navigate('/shim'), 2000);
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
            <h2>แบบฟอร์มบันทึก Shim</h2>
            <Form
                form={form} // Associate the form instance with the Form component
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    Compact_No_Modify: '',
                    Part_No: '',
                    Name_SP1: '',
                    Erp_Id_SP1: '',
                    Id_SP1: '',
                    Quantity_SP1: '',
                    Name_SP2: '',
                    Erp_Id_SP2: '',
                    Id_SP2: '',
                    Quantity_SP2: '',
                    Name_SP3: '',
                    Erp_Id_SP3: '',
                    Id_SP3: '',
                    Quantity_SP3: '',
                }}
            >
                <div className="row">
                    {Object.entries(columnNameLabels).map(([fieldName, label], index) => (
                        <div className="col-xl-4 col-lg-4 col-md-6" key={fieldName}>
                            <Form.Item
                                label={label}
                                name={fieldName}
                                rules={[{ required: true, message: `กรุณากรอก ${label}` }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    ))}
                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/shim')}>
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

export default CreateShim;
