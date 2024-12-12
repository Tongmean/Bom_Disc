import React, { useState, useEffect } from 'react';
import { Form, Button, Upload, Select, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { UpdateProdctspecfileapi, fetchProductspecfile } from '../../Ultility/Productspecfileapi';
import { fetchProductspecs } from '../../Ultility/Sellectedbom';
import { UploadOutlined } from '@ant-design/icons';
import { baseURL } from '../../Ultility/ApiSetup/api';

const { Option } = Select;

const UpdateProductspecFile = () => {
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const [Options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        const loadFile = async () => {
            setLoading(true);
            try {
                const response = await fetchProductspecfile(id);
                const File = response.data[0];
                console.log('drawingFile',File)
                form.setFieldsValue({
                    Product_Spec_Id: File.productspec_no || null,
                });

                if (File.unqiuename) {
                    setFileList([
                        {
                            uid: '-1',
                            name: File.unqiuename,
                            status: 'done',
                            url: `${baseURL}/Assets/Productspec/${File.unqiuename}`,
                        },
                    ]);
                } else {
                    setFileList([]);

  
                }
            } catch (error) {
                showNotification('Failed to load product spec file', 'warning');
            } finally {
                setLoading(false);
            }
        };

        const load = async () => {
            try {
                const response = await fetchProductspecs();
                setOptions(response.data);
            } catch (error) {
                showNotification('Failed to fetch drawing options', 'warning');
            }
        };


        loadFile();
        load();
    }, [id]);

    const handleSubmit = async (values) => {
        setIsPending(true);
        const formData = new FormData();
        formData.append('Product_Spec_Id', values.Product_Spec_Id);

        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('file', fileList[0].originFileObj);
        }

        try {
            const result = await UpdateProdctspecfileapi(id, formData);
            showNotification(result.msg, 'success');
            setTimeout(() => navigate('/productspecfile'), 2000);
        } catch (error) {
            showNotification(error.message || 'Failed to update productspec file', 'warning');
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
            <h2>Update productspec File</h2>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <div className="row">
                        <div className="col-xl-6 col-lg-6 col-md-12">
                            <Form.Item
                                label="รหัส Product Spec"
                                name="Product_Spec_Id"
                                rules={[{ required: true, message: 'Please select รหัส Product Spec.' }]}
                            >
                                <Select
                                    placeholder="Select Drawing No."
                                    loading={loading}
                                    allowClear
                                    showSearch
                                >
                                    <Option value="-">-</Option>
                                    {Options.map((option) => (
                                        <Option
                                            key={option.Product_Spec_Id}
                                            value={option.Product_Spec_Id}
                                        >
                                            {option.Product_Spec_Id}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label="Product Spec File" name="file" valuePropName="file">
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
                        </div>

                        <div className="col-12">
                            <Form.Item>
                                <Button type="default" className="me-2" onClick={() => navigate('/productspecfile')}>
                                    Back
                                </Button>
                                <Button type="primary" htmlType="submit" disabled={isPending}>
                                    {isPending ? 'Updating...' : 'Update Data'}
                                </Button>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            )}
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

export default UpdateProductspecFile;
