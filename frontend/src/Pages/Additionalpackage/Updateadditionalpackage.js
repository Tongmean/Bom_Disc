import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { fetchAdditionalpackage, updateAdditionalpackage } from '../../Ultility/Additionalpackageapi';
import { fetchrmpk } from '../../Ultility/Sellectedbom';
const { Option } = Select;

const UpdateAdditionPackage = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); // Extract ID from route params
    const [additionOptions, setAdditionoptions] = useState([]);

    const navigate = useNavigate();

    // Fetch additional package data on component mount
    useEffect(() => {
        const loads = async (id) => { 
            try {
                const data = (await fetchAdditionalpackage(id)).data[0]; // Fetch data by ID
                // console.log('Fetched data:', data); // Log the fetched data to debug
                const Data = (await fetchrmpk()).data;
                const additiondata = Data.filter(item => item.Group === "อุปกรณ์เสริม");
                setAdditionoptions(additiondata)
                // Ensure the fetched data matches the form field names
                if (data) {
                    // const formData = {
                    //     Additional_Package_Id: data.Additional_Package_Id,
                    //     Additional_Tool_Erp_Id_1: data.Additional_Tool_Erp_Id_1,
                    //     Name_Additional_Tool_1: data.Name_Additional_Tool_1,
                    //     Quantity_Additional_Tool_1: data.Quantity_Additional_Tool_1,
                    //     Additional_Tool_Erp_Id_2: data.Additional_Tool_Erp_Id_2,
                    //     Name_Additional_Tool_2: data.Name_Additional_Tool_2,
                    //     Quantity_Additional_Tool_2: data.Quantity_Additional_Tool_2
                    // };

                    // Check if the form is ready and set the values
                    form.setFieldsValue(data); // Populate form with data
                    setLoading(false);
                    // console.log('formData', formData); // Log the fetched data to debug

                } else {
                    setLoading(false);
                    showNotification('No data found', 'error');
                }
            } catch (error) {
                setLoading(false);
                console.error('Error fetching data:', error); // Log the error for debugging
                showNotification('Failed to load data', 'error');
            }
        };

        if (id) {
            loads(id); // Fetch data when ID is present
        }
    }, [id, form]);
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

    // Handle form submission
    const handleSubmit = async (values) => {
        setIsPending(true);
        // console.log('Submitted values:', values); // Debugging form submission

        try {
            const updatedAdditionalpackage = { ...values, UpdateBy: '-' }; // Include UpdateBy field
            const result = await updateAdditionalpackage(id, updatedAdditionalpackage); // Update the package
           

            showNotification(result.msg, 'success');
            setTimeout(() => navigate('/additionalpackage'), 2000); // Redirect after update
        } catch (error) {
            showNotification(error.message, 'fail');
        } finally {
            setIsPending(false);
        }
    };

    // Show notification
    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 2000); // Clear notification after 3 seconds
    };

    // Loading spinner while fetching data
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spin size="large" />
            </div>
        ); // Show a spinner until the data is loaded
    }
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
            <h2>แก้ไข โฟมสำเร็จรูปอุปกรณ์เสริม (Update Additional Package)</h2>
            <Form
                form={form} // Connect form instance
                layout="vertical"
                onFinish={handleSubmit}
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
                                {isPending ? 'Updating...' : 'Update Data'}
                            </Button>
                        </Form.Item>
                    </div>
                </div>
            </Form>

            {/* Display notification if available */}
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

export default UpdateAdditionPackage;
