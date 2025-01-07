import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Upload } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseURLpackage} from '../../Ultility/ApiSetup/api';
import Notification from '../../Components/Notification';
import { updatePackage, fetchPackage } from '../../Ultility/Packageapi';
import { fetchStatusemark, fetchmatcat, fetchgroupoptions } from '../../Ultility/ApiSetup/staticData';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const UpdatePackage = () => {
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const [fileList, setFileList] = useState([]); // Declare fileList state


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
    // Fetch display box data on component mount
    useEffect(() => {
        const fetchDisplayBox = async (id) => { 
            try {
                const data = (await fetchPackage(id)).data[0]; // Fetch data by ID
                // console.log('Fetched data:', data); // Log the fetched data to debug

                // Ensure the fetched data matches the form field names
                if (data) {
                    form.setFieldsValue(data); // Populate form with data
                    setIsPending(false);
                    console.log('data', data); // Log the fetched data to debug

                    if (data.unqiuename) {
                        setFileList([
                            {
                                uid: '-1',
                                name: data.unqiuename,
                                status: 'done',
                                url: `${baseURLpackage}/${data.unqiuename}`,
                            },
                        ]);
                    } else {
                        setFileList([]);
    
                        console.log('Fetched Drawing File:', data);
    
                    }

                } else {
                    setIsPending(false);
                    showNotification('No data found', 'error');
                }
            } catch (error) {
                setIsPending(false);
                console.error('Error fetching data:', error); // Log the error for debugging
                showNotification('Failed to load data', 'error');
            }
        };

        if (id) {
            fetchDisplayBox(id); // Fetch data when ID is present
        }
    }, [id, form]);

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
        // if (file) {
        //     formData.append('file', file.originFileObj); // Attach the file object from Ant Design's Upload
        // }
        if (fileList.length > 0) {
            formData.append('file', fileList[0].originFileObj); // Attach the file
        }
    
        try {
            const result = await updatePackage(id, formData); // Make sure your API accepts FormData
            showNotification(result.msg, 'success');
            form.resetFields(); // Clear form fields after success
            setTimeout(() => navigate('/package'), 2000);
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
                <h2>แบบฟอร์มแก้ไข RM และ PK</h2>
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
                                    <Form.Item label="PDF File" name="file" valuePropName="file">
                                        <Upload
                                            beforeUpload={(file) => {
                                                setFileList([
                                                    {
                                                        uid: '-1',
                                                        name: file.name,
                                                        originFileObj: file,
                                                        status: 'done',
                                                    },
                                                ]);
                                                return false;
                                            }}
                                            fileList={fileList}
                                            onChange={({ fileList }) =>
                                                setFileList(fileList.length > 0 ? [fileList[fileList.length - 1]] : [])
                                            }
                                            accept=".pdf"
                                            maxCount={1}
                                            onRemove={() => form.setFieldsValue({ file: null })}
                                        >
                                            <Button icon={<UploadOutlined />}>Upload PDF</Button>
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

export default UpdatePackage;
