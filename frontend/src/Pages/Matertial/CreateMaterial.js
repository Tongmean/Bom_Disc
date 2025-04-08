import React, { useState } from 'react';
import { Form, Input, Button, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createMaterial } from '../../Ultility/Materialapi'; // Assuming `createMaterial` is your API function
import { fetchMaterialcabinetid, fetchMaterialtypedrawing, fetchMaterialdocumentid, fetchMaterialremark, fetchMaterialtype1, fetchMaterialtype2, fetchMaterialtype3 } from '../../Ultility/ApiSetup/staticData';
import { Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const CreateMaterial = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [fileList, setFileList] = useState([]); // Declare fileList state

    // const [catalog, setcatalog] = useState('');
    const navigate = useNavigate();


    const columnNameLabels = [
        { headerName: 'Compact_No (ปรับ)', field: 'Compact_No_Modify' },
        { headerName: 'Compact_No (Catalog)', field: 'Compact_No_Catalog' },
        { headerName: 'Drawing Number', field: 'Drawing_no' },
        { headerName: 'Type Drawing', field: 'Type_Drawing' },
        { headerName: 'เบอร์', field: 'Num' },
        { headerName: 'Sheet', field: 'Sheet' },
        { headerName: 'Date Approve', field: 'Data_Approve' },
        { headerName: 'Edion', field: 'Edion' },
        { headerName: 'รหัสตู้', field: 'Cabinet_Id' },
        { headerName: 'หมายเหตุ', field: 'Remark' },
        { headerName: 'รหัสเอกสาร', field: 'Document_Id' },
        { headerName: 'Type1', field: 'Type1' },
        { headerName: 'Type2', field: 'Type2' },
        { headerName: 'Type3', field: 'Type3' },
        { headerName: 'ID', field: 'ID' },
        { headerName: 'กว้าง', field: 'Width' },
        { headerName: 'ยาว', field: 'Length' },
        { headerName: 'หนา', field: 'Thick' },
        { headerName: 'หนารวมชิม', field: 'Shim_Thick' },
        { headerName: 'สูง', field: 'Height' },
        { headerName: 'ระยะการใช้งาน', field: 'Working_Duration' },
        { headerName: 'ขนาดรู', field: 'Hole_Scale' },
        { headerName: 'จำนวนชิ้น', field: 'Quantity_Shim' },
        { headerName: 'Option', field: 'Option' },
        { headerName: 'Area', field: 'Area' },
        { headerName: 'เจาะรู', field: 'Drill' },
        { headerName: 'ลักษณะชิม', field: 'Type_Shim' },
        { headerName: 'ไฟล์ PDF', field: 'file' },
    ];

    const handleSubmit = async (values) => {
        setIsPending(true);

        const materialData = { ...values, CreateBy: '-' }; // Merge form values with CreateBy
        // Create FormData to send as multipart form data
        const formData = new FormData();

        // Append form fields to FormData
        Object.keys(materialData).forEach((key) => {
            formData.append(key, materialData[key]);
        });
    

        const file = fileList.length > 0 ? fileList[0].originFileObj : null;

        if (fileList.length > 0) {
            formData.append('file', fileList[0].originFileObj); // Attach the file
        }

        try {
            const result = await createMaterial(formData);
            showNotification(result.msg, 'success');
            // console.log('Material Data:', materialData);
            // console.log('API Result:', result);

            form.resetFields(); // Clear the form fields upon success
            setFileList([])
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
            <h2>แบบฟอร์มบันทึกส่วนประกอบ (Component Part)</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                // onFieldsChange={handleFieldsChange} 
                initialValues={{
                    Compact_No_Modify: '',
                    Compact_No_Catalog: '',
                    Drawing_no: '',
                    Type_Drawing: '',
                    Num: '',
                    Sheet: '',
                    Data_Approve: '',
                    Edion: '',
                    Cabinet_Id: '',
                    Remark: '',
                    Document_Id: '',
                    Type1: '',
                    Type2: '',
                    Type3: '',
                    ID: '',
                    Width: '',
                    Length: '',
                    Thick: '',
                    Shim_Thick: '',
                    Height: '',
                    Working_Duration: '',
                    Hole_Scale: '',
                    Quantity_Shim: '',
                    Option: '',
                    Area: '',
                    Drill: '',
                    Type_Shim: '',
                    file: []
                }}
            >
                <div className="row">
                    <div className='row'>
                        {columnNameLabels.map(({ headerName, field }, index) => (
                            <div className={`col-xl-3 col-lg-3 col-md-4 col-sm-6`} key={index}>
                                {field === 'Cabinet_Id' ? (
                                    <Form.Item
                                        label={headerName}
                                        name={field}
                                        allowClear
                                        rules={[{ required: true, message: `กรุณาเลือก ${headerName}` }]}
                                    >
                                        <Select placeholder={`เลือก ${headerName}`}>
                                            {fetchMaterialcabinetid.map((status) => (
                                                <Option key={status.value} value={status.value}>
                                                    {status.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                )
                                : 
                                field === 'Type_Drawing' ? (
                                    <Form.Item
                                        label={headerName}
                                        name={field}
                                        allowClear
                                        rules={[{ required: true, message: `กรุณาเลือก ${headerName}` }]}
                                    >
                                        <Select placeholder={`เลือก ${headerName}`}>
                                            {fetchMaterialtypedrawing.map((status) => (
                                                <Option key={status.value} value={status.value}>
                                                    {status.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                )
                                : 
                                field === 'fetchMaterialtypedrawing' ? (
                                    <Form.Item
                                        label={headerName}
                                        name={field}
                                        allowClear
                                        rules={[{ required: true, message: `กรุณาเลือก ${headerName}` }]}
                                    >
                                        <Select placeholder={`เลือก ${headerName}`}>
                                            {fetchMaterialremark.map((status) => (
                                                <Option key={status.value} value={status.value}>
                                                    {status.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                )
                                : 
                                field === 'Remark' ? (
                                    <Form.Item
                                        label={headerName}
                                        name={field}
                                        allowClear
                                        rules={[{ required: true, message: `กรุณาเลือก ${headerName}` }]}
                                    >
                                        <Select placeholder={`เลือก ${headerName}`}>
                                            {fetchMaterialremark.map((status) => (
                                                <Option key={status.value} value={status.value}>
                                                    {status.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                )
                                : 
                                field === 'Remark' ? (
                                    <Form.Item
                                        label={headerName}
                                        name={field}
                                        allowClear
                                        rules={[{ required: true, message: `กรุณาเลือก ${headerName}` }]}
                                    >
                                        <Select placeholder={`เลือก ${headerName}`}>
                                            {fetchMaterialremark.map((status) => (
                                                <Option key={status.value} value={status.value}>
                                                    {status.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                )
                                : 
                                field === 'Document_Id' ? (
                                    <Form.Item
                                        label={headerName}
                                        name={field}
                                        allowClear
                                        rules={[{ required: true, message: `กรุณาเลือก ${headerName}` }]}
                                    >
                                        <Select placeholder={`เลือก ${headerName}`}>
                                            {fetchMaterialdocumentid.map((status) => (
                                                <Option key={status.value} value={status.value}>
                                                    {status.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                )
                                : 
                                field === 'Type1' ? (
                                    <Form.Item
                                        label={headerName}
                                        name={field}
                                        allowClear
                                        rules={[{ required: true, message: `กรุณาเลือก ${headerName}` }]}
                                    >
                                        <Select placeholder={`เลือก ${headerName}`}>
                                            {fetchMaterialtype1.map((status) => (
                                                <Option key={status.value} value={status.value}>
                                                    {status.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                )
                                : 
                                field === 'Type2' ? (
                                    <Form.Item
                                        label={headerName}
                                        name={field}
                                        allowClear
                                        rules={[{ required: true, message: `กรุณาเลือก ${headerName}` }]}
                                    >
                                        <Select placeholder={`เลือก ${headerName}`}>
                                            {fetchMaterialtype2.map((status) => (
                                                <Option key={status.value} value={status.value}>
                                                    {status.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                )
                                : 
                                field === 'Type3' ? (
                                    <Form.Item
                                        label={headerName}
                                        name={field}
                                        allowClear
                                        rules={[{ required: true, message: `กรุณาเลือก ${headerName}` }]}
                                    >
                                        <Select placeholder={`เลือก ${headerName}`}>
                                            {fetchMaterialtype3.map((status) => (
                                                <Option key={status.value} value={status.value}>
                                                    {status.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                )
                                : 
                                field === 'Data_Approve' ? (
                                    <Form.Item
                                        label={headerName}
                                        name={field}
                                        allowClear
                                        rules={[{ required: true, message: `กรุณาเลือก ${headerName}` }]}
                                    >
                                        <Input placeholder="DD/MM/YYYY" />
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
                            <Button type="default" className="me-2" onClick={() => navigate('/componentpart')}>
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

export default CreateMaterial;
