import React, { useState ,useEffect} from 'react';
import { Form, Button, Upload, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';  // Ensure Notification component is working as expected
import { createDatasheetfile } from '../../Ultility/datasheetfileapi'; // Adjust API import as needed
import { fetchDatasheets } from '../../Ultility/Sellectedbom'; // Adjust API import as needed
import { UploadOutlined } from '@ant-design/icons';
const { Option } = Select;

const CreateDatasheetFile = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const [Options, setoptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            try {
                const Data = await fetchDatasheets(); 
                setoptions(Data.data); 
                // console.log('Data.data',Data.data)
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
        formData.append('datasheet_no', values.datasheet_no);
        formData.append('file', values.file.file); // Extract file from the upload object

        console.log('file:', values.file);
        console.log('Submitted Data:', formData);

        try {
            const result = await createDatasheetfile(formData);

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
            <h2>แบบฟอร์มบันทึกไฟล์ (Datasheet File)</h2>
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
                       
                        <Form.Item label="Datasheet No. " name="datasheet_no" rules={[{ required: true, message: 'กรุณากรอก Datasheet No. ' }]}>
                            <Select
                                placeholder="กรุณาเลือก Datasheet No. "
                                loading={loading}
                                allowClear
                                showSearch
                            >
                                <Option value="-">-</Option>
                                {Options.map((i) => (
                                    <Option key={i.Data_Sheet_No} value={i.Data_Sheet_No}>
                                        {i.Data_Sheet_No}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="ไฟล์ PDF "
                            name="file"
                            rules={[{ required: true, message: 'กรุณาอัปโหลด ไฟล์ PDF ' }]}
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
                            <Button type="default" className="me-2" onClick={() => navigate('/datasheetfile')}>
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

export default CreateDatasheetFile;
