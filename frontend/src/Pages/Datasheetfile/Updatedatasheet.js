import React, { useState, useEffect } from 'react';
import { Form, Button, Upload, Select, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { UpdateDatasheetfileapi, fetchDatasheetfile } from '../../Ultility/datasheetfileapi';
import { fetchDatasheets } from '../../Ultility/Sellectedbom';
import { UploadOutlined } from '@ant-design/icons';
import { baseURLDatasheet, baseURLshim } from '../../Ultility/ApiSetup/api';

const { Option } = Select;

const UpdateDatasheetFile = () => {
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const [drawingOptions, setDrawingOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        const loadFile = async () => {
            setLoading(true);
            try {
                const response = await fetchDatasheetfile(id);
                const File = response.data[0];
                // console.log('File',File)
                form.setFieldsValue({
                    datasheet_no: File.datasheet_no || null,
                });

                if (File.unqiuename) {
                    setFileList([
                        {
                            uid: '-1',
                            name: File.unqiuename,
                            status: 'done',
                            url: `${baseURLDatasheet}/${File.unqiuename}`,
                        },
                    ]);
                } else {
                    setFileList([]);

                }
            } catch (error) {
                showNotification('Failed to load drawing file', 'warning');
            } finally {
                setLoading(false);
            }
        };

        const loadShims = async () => {
            try {
                const response = await fetchDatasheets();
                setDrawingOptions(response.data);
            } catch (error) {
                showNotification('Failed to fetch options', 'warning');
            }
        };


        loadFile();
        loadShims();
    }, [id, form]);

    const handleSubmit = async (values) => {
        setIsPending(true);
        const formData = new FormData();
        formData.append('datasheet_no', values.datasheet_no);

        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('file', fileList[0].originFileObj);
        }

        try {
            const result = await UpdateDatasheetfileapi(id, formData);
            showNotification(result.msg, 'success');
            setTimeout(() => navigate('/datasheetfile'), 2000);
        } catch (error) {
            showNotification(error.message || 'Failed to update drawing file', 'warning');
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
            <h2>แบบฟอร์มแก้ไขไฟล์ (Update Datasheet File)</h2>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <div className="row">
                        <div className="col-xl-6 col-lg-6 col-md-12">
                            <Form.Item
                                label="Datasheet No. (ปรับ)"
                                name="datasheet_no"
                                rules={[{ required: true, message: 'Please select Datasheet No.' }]}
                            >
                                <Select
                                    placeholder="Select Datasheet No. (ปรับ)"
                                    loading={loading}
                                    allowClear
                                    showSearch
                                >
                                    <Option value="-">-</Option>
                                    {drawingOptions.map((option) => (
                                        <Option
                                            key={option.Data_Sheet_No}
                                            value={option.Data_Sheet_No}
                                        >
                                            {option.Data_Sheet_No}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label="PDF Drawing File" name="file" valuePropName="file">
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
                                <Button type="default" className="me-2" onClick={() => navigate('/datasheetfile')}>
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

export default UpdateDatasheetFile;
