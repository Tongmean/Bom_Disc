import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { updateWipapi, fetchwip } from '../../Ultility/Wipprocess';


const UpdateWip = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); // Extract ID from route params
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    const fields = [
        { headerName: 'Code Fg.', field: 'Code_Fg' , pinned: 'left'},
        { headerName: 'เบอร์.', field: 'Part_No'},
        { headerName: 'เกรดเคมี.', field: 'Grade' },
        { headerName: 'Hotpressing.', field: 'Hotpressing' },
        { headerName: 'Grinding.', field: 'Grinding'},
        { headerName: 'Powder.', field: 'Powder'},
        { headerName: 'Treatment.', field: 'Treatment'},
        { headerName: 'Shim.', field: 'Shim'},
        { headerName: 'ย้ำ.', field: 'Attachment'},
        { headerName: 'จำนวน.', field: 'Quantity'},
    ];
        // Fetch datasheet data on component mount
        useEffect(() => {
            const fetchD_Machinebyid = async (id) => {
                try {
                    const data = (await fetchwip(id)).data[0]; // Fetch data by ID
    
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
                fetchD_Machinebyid(id); // Fetch data when ID is present
            }
        }, [id, form]);

    const handleSubmit = async (values) => {
        setIsPending(true);

        const machineData = { ...values, CreateBy: '-' }; // Merge form values with CreateBy

        try {
            const result = await updateWipapi(id, machineData);
            showNotification(result.msg, 'success');
            // console.log('Datasheet:', datasheetData);
            // console.log('API Result:', result);

            form.resetFields(); // Clear the form fields upon success
            // Optionally navigate to another route
            setTimeout(() => navigate('/wip'), 2000);
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
            <h2>แบบฟอร์มแก้ไข WIP-PROCESS</h2>
            <Form
                form={form} // Associate the form instance with the Form component
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    // Machine_Code: '',
                    // Type_Machine: '',
                    // Diameter: '',
                    // Min_Pressure: '',
                    // Max_Pressure: '',
                    // Group: '',
                    // Status: '',
                    
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
                                {field.field === 'Quantity' ? (
                                    <Input type='number'/>
                                ) 
                                // : 
                                // field.field === 'Type_Machine' ? (
                                //     <Select >
                                //         <Select.Option options={fetchtypeD_Machine}></Select.Option>
                                //     </Select>
                                // ) 
                                :  
                                (
                                    <Input />
                                )}
                            </Form.Item>
                        </div>
                    ))}

                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/wip')}>
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

export default UpdateWip;
