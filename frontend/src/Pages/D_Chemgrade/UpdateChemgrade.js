import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { updateD_Chemgradeapi, fetchD_Chemgrade } from '../../Ultility/D_Chemgrade';


const UpdateChemgrade = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); // Extract ID from route params

    const fields = [
        { headerName: 'รหัสเกรดเคมี', field: 'Chem_Grade_Code'},
        { headerName: 'SG Value', field: 'SG_Value' },
        { headerName: 'แรงดัน (เย็น)', field: 'Pressure_Cold' },
        { headerName: 'แรงดัน (ร้อน)', field: 'Pressure_Hot' },
        { headerName: 'อุณหภูมิสูงสุด', field: 'Temp_Above' },
        { headerName: 'อุณหภูมิต่ำสุด', field: 'Temp_Bellow' },
        { headerName: 'Total Time', field: 'Total_Time' },
        { headerName: 'Program No.', field: 'Program_No' },
    ]
    // Fetch datasheet data on component mount
    useEffect(() => {
        const fetchD = async (id) => {
            try {
                const data = (await fetchD_Chemgrade(id)).data[0]; // Fetch data by ID

                if (data) {
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
            fetchD(id); // Fetch data when ID is present
        }
    }, [id, form]);
    const handleSubmit = async (values) => {
        setIsPending(true);

        const Data = { ...values, CreateBy: '-' }; // Merge form values with CreateBy

        try {
            const result = await updateD_Chemgradeapi(id,Data);
            showNotification(result.msg, 'success');
            // console.log('Datasheet:', datasheetData);
            // console.log('API Result:', result);

            form.resetFields(); // Clear the form fields upon success
            // Optionally navigate to another route
            setTimeout(() => navigate('/chemgrade'), 2500);
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
            <h2>แบบฟอร์มแก้ไขข้อมูล SG (Specific Gravity)</h2>
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

export default UpdateChemgrade;
