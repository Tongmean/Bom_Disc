import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { updateD_Mold_Machine, fetchD_Mold_Machine } from '../../Ultility/D_Mold_Machine';
import { fetchsellectD_Machines, fetchsellectD_Molds } from '../../Ultility/D_Sellect';
import { fetchtypeD_Machine } from '../../Ultility/ApiSetup/staticData';
const { Option } = Select;


const UpdateMoldmachine = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [moldOption, setMoldoption] = useState([]);
    const [machineOption, setMachineoption] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const fields = [
        { headerName: 'Mold+Machine', field: 'Mold_Machine_Code'},
        { headerName: 'รหัสแม่พิมพ์.', field: 'Mold_Code'},
        { headerName: 'ประเภทเครื่องจักร.', field: 'Machine_Code' },
        { headerName: 'ประเภท.', field: 'Description' },
    ]
    useEffect(() => {
        const fetchsellectD = async () => {
            try {
                const molddata = (await fetchsellectD_Molds()).data; // Fetch data by ID
                setMoldoption(molddata);
                // console.log('molddata',molddata)
                const machinedata = (await fetchsellectD_Machines()).data; // Fetch data by ID
                setMachineoption(machinedata);

                const data = (await fetchD_Mold_Machine(id)).data[0]; // Fetch data by ID
                if (data) {
                    form.setFieldsValue(data); 
                }
            } catch (error) {
                setLoading(false);
                console.error('Error fetching data:', error); 
                showNotification('Failed to load data', 'error');
            }
        };
        fetchsellectD();
    }, []);

    // useEffect(() => {
    //     const values = form.getFieldsValue(["Mold_Code", "Machine_Code"]);
    //     const generate = `${values.Mold_Code || ''}-${values.Machine_Code || ''}`;
    //     form.setFieldsValue({ Mold_Machine_Code: generate });
    // }, [form]);
    const handleFieldsChange = () => {
        const values = form.getFieldsValue(["Mold_Code", "Machine_Code"]);
        const generate = `${values.Mold_Code || ''}-${values.Machine_Code || ''}`;
        form.setFieldsValue({ Mold_Machine_Code: generate });
    };
    const handleSubmit = async (values) => {
        setIsPending(true);

        const Data = { ...values, CreateBy: '-' }; // Merge form values with CreateBy

        try {
            const result = await updateD_Mold_Machine(id, Data);
            showNotification(result.msg, 'success');
            // console.log('Datasheet:', datasheetData);
            // console.log('API Result:', result);

            form.resetFields(); // Clear the form fields upon success
            // Optionally navigate to another route
            setTimeout(() => navigate('/dmoldmachine'), 2000);
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
            <h2>แบบฟอร์มแก้ไขข้อมูล Mold-Machine</h2>
            <Form
                form={form} // Associate the form instance with the Form component
                layout="vertical"
                onFinish={handleSubmit}
                onValuesChange={handleFieldsChange}
                initialValues={{
                    Mold_Machine_Code: '',
                    Mold_Code: '',
                    Machine_Code: '',
                    Description: '',
                }}
            >
                <div className="row">
                {fields.map((field) => (
                        <div className="col-xl-4 col-lg-6 col-md-12" key={field.field}>
                            <Form.Item
                                label={field.headerName}
                                name={field.field}
                                rules={[{ required: true, message: `กรุณากรอก ${field.headerName}` }]}
                            >
                                {
                                    field.field === 'Mold_Code' ? (
                                        <Select
                                            loading={loading}
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                        >
                                            <Option value="-">-</Option>
                                            {moldOption.map((status) => (
                                                <Option key={status.Mold_Code} value={status.Mold_Code}>
                                                    {status.Mold_Code}
                                                </Option>
                                            ))}
                                        </Select>
                                    )
                                    : field.field === 'Machine_Code' ? (
                                        <Select
                                            loading={loading}
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                            // onChange={handlechemcodeChange}
                                        >
                                            {machineOption.map((status) => (
                                                <Option key={status.Group} value={status.Group}>
                                                    {status.Group}
                                                </Option>
                                            ))}
                                        </Select>
                                    )
                                    : field.field === 'Description' ? (
                                        <Select
                                            loading={loading}
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                            // onChange={handlecompactnoChange}
                                        >
                                            {fetchtypeD_Machine.map((status) => (
                                                <Option key={status.value} value={status.value}>
                                                    {status.value}
                                                </Option>
                                            ))}
                                        </Select>
                                    )
                                    :
                                    (
                                        <Input />
                                    )
                                }
                            </Form.Item>
                        </div>
                    ))}

                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/dmoldmachine')}>
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

export default UpdateMoldmachine;
