import React, { useState ,useEffect} from 'react';
import { Form, Button, Upload, Select,Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';  // Ensure Notification component is working as expected
import { createProductspecfileapi } from '../../Ultility/Productspecfileapi'; // Adjust API import as needed
import { fetchProductspecs } from '../../Ultility/Sellectedbom'; // Adjust API import as needed
import { UploadOutlined } from '@ant-design/icons';
const { Option } = Select;

const CreateProductspecFile = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const [productspecOptions, setProductspecoptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            try {
                const Data = await fetchProductspecs(); 
                setProductspecoptions(Data.data); 

            } catch (error) {
                showNotification('Failed to fetch data', 'warning');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);
    const handleSubmit = async (values) => {
        setIsPending(true);

        const formData = new FormData(); // Use FormData for file upload
        formData.append('Product_Spec_Id', values.Product_Spec_Id);
        formData.append('file', values.file.file); // Extract file from the upload object

        console.log('file:', values.file);
        console.log('Submitted Data:', formData);

        try {
            const result = await createProductspecfileapi(formData);

            // Show success notification
            showNotification(result.msg, 'success');
            console.log('API Result:', result);

            // Reset form fields after successful submission
            form.resetFields();

            // Optional: Navigate to another route after a delay
            // setTimeout(() => navigate('/drawingfile'), 2000); // You can adjust the delay
        } catch (error) {
            // Show error notification
            showNotification(error.message, 'warning');
        } finally {
            setIsPending(false);
        }
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
    };
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <h2>แบบฟอร์มบันทึกไฟล์ Product Spec (Product Spec File)</h2>
            <Form
                form={form} // Associate the form instance with the Form component
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    Product_Spec_Id: '',
                }}
            >
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item label="รหัส Product Spec." name="Product_Spec_Id" rules={[{ required: true, message: 'กรุณากรอก Drawing No.' }]}>
                            <Select
                                placeholder="กรุณาเลือก รหัส Product Spec."
                                loading={loading}
                                allowClear
                                showSearch
                            >
                                <Option value="-">-</Option>
                                {productspecOptions.map((i) => (
                                    <Option key={i.Product_Spec_Id} value={i.Product_Spec_Id}>
                                        {i.Product_Spec_Id}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="ไฟล์ PDF Product spec"
                            name="file"
                            rules={[{ required: true, message: 'กรุณาอัปโหลด ไฟล์ PDF Product spec' }]}
                        >
                            <Upload
                                beforeUpload={(file) => {
                                    form.setFieldsValue({ file }); // Manually set the file in form data
                                    return false; // Prevent auto-upload
                                }}
                                accept=".pdf"
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>Upload PDF</Button>
                            </Upload>
                        </Form.Item>
                    </div>
                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/productspecfile')}>
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

export default CreateProductspecFile;
