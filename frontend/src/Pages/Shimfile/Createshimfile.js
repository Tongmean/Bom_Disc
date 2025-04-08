import React, { useState ,useEffect} from 'react';
import { Form, Button, Upload, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';  // Ensure Notification component is working as expected
import { createShimfile } from '../../Ultility/Shimfileapi'; // Adjust API import as needed
import { fetchShims } from '../../Ultility/Sellectedbom'; // Adjust API import as needed
import { UploadOutlined } from '@ant-design/icons';
const { Option } = Select;

const CreateShimFile = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const [drawingOptions, setDrawingoptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            try {
                const Data = await fetchShims(); 
                setDrawingoptions(Data.data); 

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
        formData.append('Compact_No_Modify', values.Compact_No_Modify);
        formData.append('file', values.file.file); // Extract file from the upload object

        // console.log('file:', values.file);
        // console.log('Submitted Data:', formData);

        try {
            const result = await createShimfile(formData);

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
        setTimeout(() => setNotification(null), 2500); // Clear notification after 3 seconds
    };

    return (
        <div className="container-fluid">
            <h2>แบบฟอร์มบันทึกไฟล์ (Shim File)</h2>
            <Form
                form={form} // Associate the form instance with the Form component
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    Drawing_No: '',
                }}
            >
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        {/* <Form.Item
                            label="Drawing_No"
                            name="Drawing_No"
                            rules={[{ required: true, message: 'กรุณากรอก เลขที่ Drawing' }]}
                        >
                            <Input />
                        </Form.Item> */}
                        <Form.Item label="Compact No. (ปรับ)" name="Compact_No_Modify" rules={[{ required: true, message: 'กรุณากรอก Compact No. (ปรับ)' }]}>
                            <Select
                                placeholder="กรุณาเลือก Compact No. (ปรับ)"
                                loading={loading}
                                allowClear
                                showSearch
                            >
                                <Option value="-">-</Option>
                                {drawingOptions.map((i) => (
                                    <Option key={i.Compact_No_Modify} value={i.Compact_No_Modify}>
                                        {i.Compact_No_Modify}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="ไฟล์ PDF Shim"
                            name="file"
                            rules={[{ required: true, message: 'กรุณาอัปโหลด ไฟล์ PDF Shim' }]}
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
                            <Button type="default" className="me-2" onClick={() => navigate('/shimfile')}>
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

export default CreateShimFile;
