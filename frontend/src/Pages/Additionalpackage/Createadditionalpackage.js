import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createAdditionalpackage } from '../../Ultility/Additionalpackageapi';
import { fetchrmpk } from '../../Ultility/Sellectedbom';

const { Option } = Select;

const CreateAdditionalPackage = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const [additionOptions, setAdditionoptions] = useState([]);

    //Filter Component
    useEffect(() => {
        const load = async () => {
            try {
                const Data = (await fetchrmpk()).data;
                const additiondata = Data.filter(item => item.Group === "อุปกรณ์เสริม");
                setAdditionoptions(additiondata)
            // console.log('Datashim', Datashim , additiondata)
            } catch (err) {
                console.log(err.message);
            } finally {
                setIsPending(false);
            }
        };
        load();
    }, []);
    const handleSubmit = async (values) => {
        setIsPending(true);

        const additionalpackageData = { ...values, CreateBy: '-' }; // Merge form values with CreateBy

        try {
            const result = await createAdditionalpackage(additionalpackageData);
            showNotification(result.msg, 'success');
            console.log('Additional Package:', additionalpackageData);
            console.log('API Result:', result);

            form.resetFields(); // Clear the form fields upon success
            // Optionally navigate to another route
            // setTimeout(() => navigate('/package'), 2000);
        } catch (error) {
            showNotification(error.message, 'warning');
        } finally {
            setIsPending(false);
        }
    };

    const columnNameLabels = {
        Additional_Package_Id: "รหัสการบรรจุที่ใส่อุปกรณ์เสริมเพิ่มมา",
        Additional_Tool_Erp_Id_1: "รหัส ERP โฟมและอุปกรณ์เสริม 1",
        Name_Additional_Tool_1: "ชื่อ ERP โฟมและอุปกรณ์เสริม 1",
        Quantity_Additional_Tool_1: "จำนวนโฟมและอุปกรณ์เสริม 1",
        Additional_Tool_Erp_Id_2: "รหัส ERP โฟมและอุปกรณ์เสริม 2",
        Name_Additional_Tool_2: "ชื่อ ERP โฟมและอุปกรณ์เสริม 2",
        Quantity_Additional_Tool_2: "จำนวนโฟมและอุปกรณ์เสริม 2",
        Weight: "น้ำหนัก",

    };
    

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };
    const handleSelectChange = (value, key) => {
        if (key === 'Additional_Tool_Erp_Id_1') {
            const selected = additionOptions.find(item => item.Erp_Id === value);
            console.log('Selected 1:', selected); // Debug
            form.setFieldsValue({
                Name_Additional_Tool_1: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Additional_Tool_Erp_Id_2') {
            const selected = additionOptions.find(item => item.Erp_Id === value);
            console.log('Selected 2:', selected); // Debug
            form.setFieldsValue({
                Name_Additional_Tool_2: selected ? selected.Name_Erp : ''
            });
        }
    };

    return (
        <div className="container-fluid">
            <h2>แบบฟอร์มบันทึก โฟมสำเร็จรูปอุปกรณ์เสริม (Additional Package)</h2>
            <Form
                form={form} // Associate the form instance with the Form component
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    Additional_Package_Id: '',
                    Additional_Tool_Erp_Id_1: '',
                    Name_Additional_Tool_1: '',
                    Quantity_Additional_Tool_1: '',
                    Additional_Tool_Erp_Id_2: '',
                    Name_Additional_Tool_2: '',
                    Quantity_Additional_Tool_2: '',
                }}
            >
                <div className="row">
                    {Object.entries(columnNameLabels).map(([key, label], index) => (
                        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6" key={index}>
                            <Form.Item
                                label={label}
                                name={key}
                                rules={[{ required: true, message: `กรุณากรอก ${label}` }]}
                                
                            >
                                {key === 'Additional_Tool_Erp_Id_1' || key === 'Additional_Tool_Erp_Id_2' ? (
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={isPending}
                                        allowClear
                                        showSearch
                                        onChange={(value) => handleSelectChange(value, key)}
                                    >
                                        <Option value="-">-</Option>
                                            {additionOptions.map((i) => (
                                            <Option key={i.Erp_Id} value={i.Erp_Id}>
                                                {i.Erp_Id}
                                        </Option>
                                        ))}
                                    </Select>
                                ) 
 
                                : 
                                (
                                    <Input />
                                )}
                            </Form.Item>
                        </div>
                    ))}
                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/additionalpackage')}>
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

export default CreateAdditionalPackage;
