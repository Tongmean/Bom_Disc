import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createMultipleD_Mold_Machine } from '../../Ultility/D_Mold_Machine';
import { fetchsellectD_Machines, fetchsellectD_Molds } from '../../Ultility/D_Sellect';
import { fetchtypeD_Machine } from '../../Ultility/ApiSetup/staticData';

const { Option } = Select;

const CreateMultipleMoldmachine = () => {
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [moldOption, setMoldoption] = useState([]);
    const [machineOption, setMachineoption] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const molddata = (await fetchsellectD_Molds()).data;
                const machinedata = (await fetchsellectD_Machines()).data;
                setMoldoption(molddata);
                setMachineoption(machinedata);
            } catch (error) {
                showNotification('Failed to load data', 'error');
            }
        };
        fetchOptions();
    }, []);

    const handleAutoGenerate = (changedValues, allValues) => {
        const updatedList = allValues.items.map(item => {
            const code = `${item?.Mold_Code || ''}-${item?.Machine_Code || ''}`;
            return {
                ...item,
                Mold_Machine_Code: code
            };
        });
        form.setFieldsValue({ items: updatedList });
    };

    // const handleSubmit = async ({ items }) => {
    //     setIsPending(true);
    //     try {
    //         for (const item of items) {
    //             await createMultipleD_Mold_Machine({ ...item, CreateBy: '-' });
    //             console.log('{ ...item, CreateBy: '-' }', { ...item, CreateBy: '-' })
    //         }
    //         showNotification('All data saved successfully!', 'success');
    //         form.resetFields();
    //     } catch (error) {
    //         showNotification(error.message, 'warning');
    //     } finally {
    //         setIsPending(false);
    //     }
    // };
    const handleSubmit = async ({ items }) => {
        setIsPending(true);
        try {
          const payload = items.map(item => ({ ...item, CreateBy: '-' }));
          const result = await createMultipleD_Mold_Machine(payload);
          showNotification(result.msg, 'success');
        //   console.log('payload',payload)
        // console.log('API result:', result);
        // console.log('API result.msg:', result.msg);

        showNotification(result.msg, 'success');
        form.resetFields();
        } catch (error) {
            showNotification(error.message, 'warning')
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
            <h2>แบบฟอร์มบันทึกข้อมูล Mold-Machine (หลายรายการ)</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                onValuesChange={handleAutoGenerate}
                initialValues={{ items: [{}] }}
            >
                <Form.List name="items">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} className="border rounded p-3 mb-3">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <Form.Item
                                                {...restField}
                                                label="Mold+Machine"
                                                name={[name, 'Mold_Machine_Code']}
                                                rules={[{ required: true }]}
                                            >
                                                <Input disabled />
                                            </Form.Item>
                                        </div>
                                        <div className="col-md-3">
                                            <Form.Item
                                                {...restField}
                                                label="รหัสแม่พิมพ์"
                                                name={[name, 'Mold_Code']}
                                                rules={[{ required: true, message: 'กรุณาเลือกแม่พิมพ์' }]}
                                            >
                                                <Select loading={loading} showSearch allowClear>
                                                    {moldOption.map((item) => (
                                                        <Option key={item.Mold_Code} value={item.Mold_Code}>
                                                            {item.Mold_Code}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </div>
                                        <div className="col-md-3">
                                            <Form.Item
                                                {...restField}
                                                label="เครื่องจักร"
                                                name={[name, 'Machine_Code']}
                                                rules={[{ required: true, message: 'กรุณาเลือกเครื่องจักร' }]}
                                            >
                                                <Select loading={loading} showSearch allowClear>
                                                    {machineOption.map((item) => (
                                                        <Option key={item.Group} value={item.Group}>
                                                            {item.Group}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </div>
                                        <div className="col-md-3">
                                            <Form.Item
                                                {...restField}
                                                label="ประเภท"
                                                name={[name, 'Description']}
                                                rules={[{ required: true, message: 'กรุณาเลือกประเภท' }]}
                                            >
                                                <Select loading={loading} showSearch allowClear>
                                                    {fetchtypeD_Machine.map((type) => (
                                                        <Option key={type.value} value={type.value}>
                                                            {type.value}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </div>
                                        <div className="col-md-12 text-end">
                                            <Button danger onClick={() => remove(name)} icon={<MinusCircleOutlined />}>
                                                ลบรายการ
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    เพิ่มรายการ
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Form.Item>
                    <Button type="default" className="me-2" onClick={() => navigate('/dmoldmachine')}>
                        Back
                    </Button>
                    <Button type="primary" htmlType="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save All'}
                    </Button>
                </Form.Item>
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

export default CreateMultipleMoldmachine;
