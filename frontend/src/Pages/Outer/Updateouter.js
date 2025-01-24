import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { updateOuter , fetchOuter } from '../../Ultility/Outerapi';
import { fetchrmpk } from '../../Ultility/Sellectedbom';

const { Option } = Select;

const UpdateOuter = () => {
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [outerOptions, setOuteroptions] = useState([]);
    const [innerOptions, setInneroptions] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    const columnNameLabels = {
        Outer_Id: "แบบการบรรจุ",
        Erp_Id_Outer: "รหัส Erp (Outer)",
        Name_Erp_Outer: "ชื่อ Erp (Outer)",
        Num_Outer: "เบอร์กล่อง (Outer)",
        Erp_Id_Inner: "รหัส ERP (Inner)",
        Name_Erp_Inner: "ชื่อ Erp (Inner)",
        Die_Cut: "Die Cut",
        Set_Per_Outer: "จำนวน Set/ Outer",
        Outer_Per_pallet: "จำนวน Outer/ พาเลท",
        Set_Per_Pallet: "จำนวน Set/ พาเลท"
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const Data = (await fetchrmpk()).data;
                const outerdata = Data.filter(item => item.Group === "Outer_Box");
                setOuteroptions(outerdata);
                const innerdata = Data.filter(item => item.Group === "Inner_Box");
                setInneroptions(innerdata);
                // console.log('Data', Data);
                // console.log('outerdata',outerdata)
                // console.log('innerdata',innerdata)

            } catch (error) {
                showNotification('Failed to fetch data', 'warning');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSelectChange = (value, key) => {
        if (key === 'Erp_Id_Outer') {
            const selected = outerOptions.find(item => item.Erp_Id === value);
            console.log('Selected Outer:', selected);  // Add this line to debug
            form.setFieldsValue({
                Name_Erp_Outer: selected ? selected.Name_Erp : '',
                Num_Outer: selected ? selected.Dimension : ''
            });
        } else if (key === 'Erp_Id_Inner') {
            const selected = innerOptions.find(item => item.Erp_Id === value);
            form.setFieldsValue({
                Name_Erp_Inner: selected ? selected.Name_Erp : '',
            });            
        }
    };
    

    const handleSubmit = async (values) => {
        setIsPending(true);
        const outerData = { ...values, CreateBy: '-' }; // Add CreateBy field

        try {
            const result = await updateOuter(id, outerData);
            showNotification(result.msg, 'success');
            form.resetFields(); // Clear form fields after success
            console.log('Outer Data:', outerData);
            console.log('API Result:', result);
            setTimeout(() => navigate('/outer'), 2000);

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
        <>
            <div className="container-fluid">
                <h2>แบบฟอร์มการแก้ไข รูปแแบบการบรรจุ</h2>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        Outer_Id: '',
                        Erp_Id_Outer: '',
                        Name_Erp_Outer: '',
                        Num_Outer: '',
                        Erp_Id_Inner: '',
                        Name_Erp_Inner: '',
                        Die_Cut: '',
                        Set_Per_Outer: '',
                        Outer_Per_pallet: '',
                        Set_Per_Pallet: ''
                    }}
                >
                    <div className="row">
                        {Object.entries(columnNameLabels).map(([key, label], index) => (
                            <div className={`col-xl-3 col-lg-3 col-md-4 col-sm-6`} key={index}>
                                {key === "Erp_Id_Outer" || key === "Erp_Id_Inner" ? (
                                    <Form.Item
                                        label={label}
                                        name={key}
                                        rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                    >
                                        <Select
                                            placeholder={`เลือก ${label}`}
                                            onChange={(value) => handleSelectChange(value, key)}
                                        >
                                            {(key === "Erp_Id_Outer" ? outerOptions : innerOptions).map((item) => (
                                                <Option key={item.Rm_Pk_Id} value={item.Erp_Id}>
                                                    {item.Erp_Id}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                ) : key === "Name_Erp_Outer" || key === "Name_Erp_Inner" || key === "Num_Outer" ? (
                                    <Form.Item
                                        label={label}
                                        name={key}
                                    >
                                        <Input />
                                    </Form.Item>
                                ) : (
                                    <Form.Item
                                        label={label}
                                        name={key}
                                        rules={[{ required: true, message: `กรุณากรอก ${label}` }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/outer')}>
                                Back
                            </Button>
                            <Button type="primary" htmlType="submit" disabled={isPending}>
                                {isPending ? 'Saving...' : 'Save Data'}
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

export default UpdateOuter;
