import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createD_Chemgradeapi } from '../../Ultility/D_Chemgrade';


const CreateChemgrade = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    const fields = [
        { headerName: 'รหัสเกรดเคมี', field: 'Chem_Grade_Code'},
        { headerName: 'SG Value', field: 'SG_Value' },
        { headerName: 'แรงดัน (เย็น)', field: 'Pressure_Cold' },
        { headerName: 'แรงดัน (ร้อน)', field: 'Pressure_Hot' },
        { headerName: 'อุณหภูมิบน', field: 'Temp_Above' },
        { headerName: 'อุณหภูมิล้าง', field: 'Temp_Bellow' },
        { headerName: 'Total Time', field: 'Total_Time' },
        { headerName: 'Program No.', field: 'Program_No' },
    ]

    const handleSubmit = async (values) => {
        setIsPending(true);

        const machineData = { ...values, CreateBy: '-' }; // Merge form values with CreateBy

        try {
            const result = await createD_Chemgradeapi(machineData);
            showNotification(result.msg, 'success');
            // console.log('Datasheet:', datasheetData);
            // console.log('API Result:', result);

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
            <h2>แบบฟอร์มบันทึกข้อมูล SG (Specific Gravity)</h2>
            <Form
                form={form} // Associate the form instance with the Form component
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    Chem_Grade_Code: '',
                    SG_Value: '',
                    Pressure_Cold: '120',
                    Pressure_Hot: '300',
                    Temp_Above: '',
                    Temp_Bellow: '',
                    Total_Time: '',
                    Program_No: '',
                    
                }}
            >
                <div className="row">
                    {fields.map((field) => (
                        <div className="col-xl-4 col-lg-6 col-md-12" key={field.field}>
                            <Form.Item
                                label={field.headerName}
                                name={field.field}
                                rules={[{ required: true, message: `กรุณากรอก ${field.headerName}` }]}
                            >
                                {  
                                (
                                    <Input />
                                )}
                            </Form.Item>
                        </div>
                    ))}

                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/chemgrade')}>
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

export default CreateChemgrade;
