import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { fetchEmark, updateEmark } from '../../Ultility/Emarkapi';
import { fetchStatusemark, fetchStatusetypemark } from '../../Ultility/ApiSetup/staticData';

const UpdateEmark = () => {
    const { id } = useParams(); // Get the `id` parameter from the URL
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [emarkId, setEmarkId] = useState(''); // State to track Emark_Id dynamically
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the data for the specified `id` and populate the form
        const fetchData = async () => {
            try {
                const emarkData = (await fetchEmark(id)).data[0];
                // console.log(emarkData, emarkData);
                form.setFieldsValue(emarkData);
                
                
                await form.setFieldsValue(emarkData); // Populate the form fields with fetched data
                // console.log('Form values:', form.getFieldsValue());
                // console.log('emarkData:', emarkData);

                const values = form.getFieldsValue(["Brake_Pad", "Material", "Type_Emark"]);
                const generatedEmarkId = `${values.Brake_Pad || ''}-${values.Material || ''}-${values.Type_Emark || ''}`;
                setEmarkId(generatedEmarkId);
            } catch (error) {
                showNotification('Failed to fetch E-mark data', 'error');
            }
        };

        fetchData();
    }, [id, form]);

    const handleFieldsChange = () => {
        const values = form.getFieldsValue(["Brake_Pad", "Material", "Type_Emark"]);
        const generatedEmarkId = `${values.Brake_Pad || ''}-${values.Material || ''}-${values.Type_Emark || ''}`;
        setEmarkId(generatedEmarkId);
    };

    const handleSubmit = async (values) => {
        setIsPending(true);

        const Emark_Id = emarkId; // Use the dynamically generated Emark_Id
        const emarkData = { ...values, Emark_Id, id }; // Merge form values with Emark_Id and include `id`

        try {
            const result = await updateEmark(id, emarkData);
            showNotification(result.msg, 'success');
            // console.log('Updated E-mark Data:', emarkData);
            // console.log('API Result:', result);

            // Optionally navigate to another route
            setTimeout(() => navigate('/emark'), 2000);
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
            <h2>แบบฟอร์มแก้ไข E-mark</h2>
            <Form
                form={form} // Associate the form instance with the Form component
                layout="vertical"
                onFinish={handleSubmit}
                onFieldsChange={handleFieldsChange} // Trigger dynamic update on field change
                initialValues={{}}
            >
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item label="E-mark ID (Auto)">
                            <Input value={emarkId} disabled /> 
                        </Form.Item>
                        <Form.Item
                            label="Part No"
                            name="Part_No"
                            rules={[{ required: true, message: 'กรุณากรอก เบอร์ชิ้นส่วน' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Brake Pad"
                            name="Brake_Pad"
                            rules={[{ required: true, message: 'กรุณากรอก เบรกแพด' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Material"
                            name="Material"
                            rules={[{ required: true, message: 'กรุณากรอก วัสดุ' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Approval Code"
                            name="Approval_Code"
                            rules={[{ required: true, message: 'กรุณากรอก รหัสการอนุมัติ' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label="Type Of E-mark"
                            name="Type_Emark"
                            rules={[{ required: true, message: 'กรุณาเลือก ประเภท E-mark' }]}
                        >
                            <Select>
                                <Select.Option options={fetchStatusetypemark}></Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Revision"
                            name="Revision"
                            rules={[{ required: true, message: 'กรุณากรอก การแก้ไข' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Approved Date"
                            name="Approved_Date"
                            rules={[{ required: true, message: 'กรุณากรอก วันที่อนุมัติ' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="สถานะ (Status)"
                            name="Status"
                            rules={[{ required: true, message: 'กรุณากรอก สถานะ' }]}
                        >
                            <Select>
                                <Select.Option options={fetchStatusemark}></Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/emark')}>
                                Back
                            </Button>
                            <Button type="primary" htmlType="submit" disabled={isPending}>
                                {isPending ? 'Updating...' : 'Update Data'}
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

export default UpdateEmark;