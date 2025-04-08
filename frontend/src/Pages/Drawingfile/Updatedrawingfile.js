import React, { useState, useEffect } from 'react';
import { Form, Button, Upload, Select, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { UpdateDrawingfileapi, fetchDrawingfile } from '../../Ultility/Drawingfileapi';
import { fetchDrawings } from '../../Ultility/Sellectedbom';
import { UploadOutlined } from '@ant-design/icons';
import { baseURL } from '../../Ultility/ApiSetup/api';

const { Option } = Select;

const UpdateDrawingFile = () => {
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const [drawingOptions, setDrawingOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        const loadDrawingFile = async () => {
            setLoading(true);
            try {
                const response = await fetchDrawingfile(id);
                const drawingFile = response.data[0];
                // console.log('drawingFile',drawingFile)
                form.setFieldsValue({
                    Drawing_No: drawingFile.drawing_no || null,
                });

                if (drawingFile.unqiuename) {
                    setFileList([
                        {
                            uid: '-1',
                            name: drawingFile.unqiuename,
                            status: 'done',
                            url: `${baseURL}/Assets/Drawing/${drawingFile.unqiuename}`,
                        },
                    ]);
                } else {
                    setFileList([]);

                    // console.log('Fetched Drawing File:', drawingFile);
                    // console.log('File List:', drawingFile.drawing_no);

                }
            } catch (error) {
                showNotification('Failed to load drawing file', 'warning');
            } finally {
                setLoading(false);
            }
        };

        const loadDrawings = async () => {
            try {
                const response = await fetchDrawings();
                setDrawingOptions(response.data);
            } catch (error) {
                showNotification('Failed to fetch drawing options', 'warning');
            }
        };


        loadDrawingFile();
        loadDrawings();
    }, [id]);

    const handleSubmit = async (values) => {
        setIsPending(true);
        const formData = new FormData();
        formData.append('Drawing_No', values.Drawing_No);

        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('file', fileList[0].originFileObj);
        }

        try {
            const result = await UpdateDrawingfileapi(id, formData);
            showNotification(result.msg, 'success');
            setTimeout(() => navigate('/drawingfile'), 2000);
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
            <h2>Update Drawing File</h2>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <div className="row">
                        <div className="col-xl-6 col-lg-6 col-md-12">
                            <Form.Item
                                label="Drawing No."
                                name="Drawing_No"
                                rules={[{ required: true, message: 'Please select Drawing No.' }]}
                            >
                                <Select
                                    placeholder="Select Drawing No."
                                    loading={loading}
                                    allowClear
                                    showSearch
                                >
                                    <Option value="-">-</Option>
                                    {drawingOptions.map((option) => (
                                        <Option
                                            key={option.Compact_No_Modify_Drawing}
                                            value={option.Compact_No_Modify_Drawing}
                                        >
                                            {option.Compact_No_Modify_Drawing}
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
                                <Button type="default" className="me-2" onClick={() => navigate('/drawingfile')}>
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

export default UpdateDrawingFile;
