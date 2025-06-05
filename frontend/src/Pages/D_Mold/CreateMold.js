import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createD_Moldapi } from '../../Ultility/D_Mold';
import { fetchtypeD_Mold } from '../../Ultility/ApiSetup/staticData';


const CreateMold = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    const fields = [
        { headerName: 'รหัสแม่พิมพ์.', field: 'Mold_Code' , pinned: 'left'},
        { headerName: 'ประเภท.', field: 'Type_Mold'},
        { headerName: 'สถานที่จัดเก็บ.', field: 'Area' },
        { headerName: 'จำนวนชิ้นเต็ม.', field: 'Full_Hole_Quantity' },
        { headerName: 'จำนวนชิ้นเสีย.', field: 'Hole_Deformation_Quantity'},
        { headerName: 'จำนวนชิ้นคงเหลือ.', field: 'Hole_Balance_Quantity'},
        { headerName: 'จำนวนชิ้น Active.', field: 'Hole_Active_Quantity'},
        { headerName: 'ตำแหน่งชิ้นที่เสีย.', field: 'Hole_Deformation_Position'},
    ]

    const handleSubmit = async (values) => {
        setIsPending(true);

        const machineData = { ...values, CreateBy: '-' }; // Merge form values with CreateBy

        try {
            const result = await createD_Moldapi(machineData);
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
            <h2>แบบฟอร์มบันทึกข้อมูล Mold</h2>
            <Form
                form={form} // Associate the form instance with the Form component
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    Mold_Code: '',
                    Type_Mold: '',
                    Area: 'CPI',
                    Full_Hole_Quantity: '',
                    Hole_Deformation_Quantity: '',
                    Hole_Balance_Quantity: '',
                    Hole_Active_Quantity: '',
                    Hole_Deformation_Position: '',
                    
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
                                field.field === 'Type_Mold' ? (
                                    <Select >
                                        <Select.Option options={fetchtypeD_Mold}></Select.Option>
                                    </Select>
                                ) 
                                :  
                                (
                                    <Input />
                                )}
                            </Form.Item>
                        </div>
                    ))}

                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/mold')}>
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

export default CreateMold;
