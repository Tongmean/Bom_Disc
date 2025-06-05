import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createWipapi } from '../../Ultility/Wipprocess';
// import { fetchstatusD_Machine, fetchtypeD_Machine  } from '../../Ultility/ApiSetup/staticData';


const CreateWip = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
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
    ]

    const handleSubmit = async (values) => {
        setIsPending(true);

        const machineData = { ...values, CreateBy: '-' }; // Merge form values with CreateBy

        try {
            const result = await createWipapi(machineData);
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
            <h2>แบบฟอร์มบันทึกข้อมูล WIP-PROCESS</h2>
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

export default CreateWip;
