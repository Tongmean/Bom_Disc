import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createPackage } from '../../Ultility/Packageapi';
import { fetchStatusemark, fetchmatcat, fetchgroupoptions } from '../../Ultility/ApiSetup/staticData';

const { Option } = Select;

const CreatePackage = () => {
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    // Mapping header names to database fields
    const columnNameLabels = [
        { headerName: 'รหัสเรียก', field: 'Rm_Pk_Id' },
        { headerName: 'กลุ่มสินค้า', field: 'Mat_Cat' },
        { headerName: 'กลุ่ม', field: 'Group' },
        { headerName: 'กลุ่มสินค้าย่อย', field: 'Sub_Mat_Cat' },
        { headerName: 'รหัสสินค้า Erp', field: 'Erp_Id' },
        { headerName: 'ชื่อสินค้า Erp', field: 'Name_Erp' },
        { headerName: 'ขนาด (Dimension)', field: 'Dimension' },
        { headerName: 'น้ำหนัก', field: 'Weight' },
        { headerName: 'Spec', field: 'Spec' },
        { headerName: 'หน่วย', field: 'Unit' },
        { headerName: 'Status', field: 'Status' },
        { headerName: 'ไฟล์ PDF', field: 'file' }, // Ensure the file field is added here
    ];

    const handleSubmit = async (values) => {
        setIsPending(true);
        const packageData = { ...values, CreateBy: '-' }; // Add CreateBy field
    
        // Create FormData to send as multipart form data
        const formData = new FormData();
    
        // Append form fields to FormData
        Object.keys(packageData).forEach((key) => {
            formData.append(key, packageData[key]);
        });
    
        // Append the file
        const file = values.file && values.file[0]; // Assuming only one file
        if (file) {
            formData.append('file', file.originFileObj); // Attach the file object from Ant Design's Upload
        }
    
        try {
            const result = await createPackage(formData); // Make sure your API accepts FormData
            showNotification(result.msg, 'success');
            form.resetFields(); // Clear form fields after success
            console.log('Package Data:', packageData);
            console.log('API Result:', result);
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

    const handleClearForm = () => {
        form.resetFields(); // Clears all the form fields
        showNotification('Form values cleared', 'success');
    };

    return (
        <>
            <div className="container-fluid">
                <h2>แบบฟอร์มบันทึก RM และ PK</h2>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        Rm_Pk_Id: '',
                        Mat_Cat: '',
                        Group: '',
                        Erp_Id: '',
                        Name_Erp: '',
                        Dimension: '',
                        Weight: '',
                        Spec: '',
                        Unit: '',
                        Status: '',
                        file: [], // Default value for PDF
                    }}
                >
                    <div className="row">
                        {columnNameLabels.map(({ headerName, field }, index) => (
                            <div className={`col-xl-3 col-lg-3 col-md-4 col-sm-6`} key={index}>
                                {
                                field === 'Status' ? (
                                    <Form.Item
                                        label={headerName}
                                        name={field}
                                        allowClear
                                        rules={[{ required: true, message: `กรุณาเลือก ${headerName}` }]}
                                    >
                                        <Select placeholder={`เลือก ${headerName}`}>
                                            {fetchStatusemark.map((status) => (
                                                <Option key={status.value} value={status.value}>
                                                    {status.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                )
                                : 
                                field === 'Mat_Cat' ? (
                                    <Form.Item
                                        label={headerName}
                                        name={field}
                                        allowClear
                                        rules={[{ required: true, message: `กรุณาเลือก ${headerName}` }]}
                                    >
                                        <Select placeholder={`เลือก ${headerName}`}>
                                            {fetchmatcat.map((status) => (
                                                <Option key={status.value} value={status.value}>
                                                    {status.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                )
                                : 
                                field === 'Group' ? (
                                    <Form.Item
                                        label={headerName}
                                        name={field}
                                        allowClear
                                        rules={[{ required: true, message: `กรุณาเลือก ${headerName}` }]}
                                    >
                                        <Select placeholder={`เลือก ${headerName}`}>
                                            {fetchgroupoptions.map((status) => (
                                                <Option key={status.value} value={status.value}>
                                                    {status.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                )
                                : 
                                field === 'file' ? (
                                    <Form.Item
                                        label={headerName}
                                        name={field}
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => e?.fileList || []}
                                        // rules={[{ message: `กรุณาเลือก ${headerName}` }]} // Ensure file is required
                                    >
                                        <Upload
                                            accept="application/pdf"
                                            beforeUpload={() => false} // Prevent automatic upload
                                            listType="picture"
                                            maxCount={1}
                                        >
                                            <Button>Select PDF</Button>
                                        </Upload>
                                    </Form.Item>
                                ) : (
                                    <Form.Item
                                        label={headerName}
                                        name={field}
                                        rules={[{ required: true, message: `กรุณากรอก ${headerName}` }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/package')}>
                                Back
                            </Button>
                            <Button type="primary" htmlType="submit" disabled={isPending}>
                                {isPending ? 'Saving...' : 'Save Data'}
                            </Button>
                            <Button type="default" onClick={handleClearForm} style={{ marginLeft: '10px' }}>
                                Clear
                            </Button>
                        </Form.Item>
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
        </>
    );
};

export default CreatePackage;
