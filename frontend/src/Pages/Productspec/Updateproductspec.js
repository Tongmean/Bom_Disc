import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { fetchproductspec, updateProductspec } from '../../Ultility/Productspecapi';

const UpdateProductSpec = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); // Extract ID from route params
    const navigate = useNavigate();

    // Fetch product spec data on component mount
    useEffect(() => {
        const load = async (id) => { 
            try {
                const data = (await fetchproductspec(id)).data[0]; // Fetch data by ID

                // Ensure the fetched data matches the form field names
                if (data) {
                    const formData = {
                        Product_Spec_Id: data.Product_Spec_Id,
                        Sale_Code: data.Sale_Code,
                        Coating: data.Coating,
                        Scoarching: data.Scoarching,
                        Scoarching_Coating_Id: data.Scoarching_Coating_Id,
                        Shim: data.Shim,
                        Slot: data.Slot,
                        Chamfer: data.Chamfer,
                        Color: data.Color,
                        Color_Id: data.Color_Id,
                        Customer_Name_Product_Spec: data.Customer_Name_Product_Spec,
                        Chem_Formular: data.Chem_Formular,
                        Formula_Under_Layer: data.Formula_Under_Layer,
                        Sticker_Name_1: data.Sticker_Name_1,
                        Sticker_Erp_Id_1: data.Sticker_Erp_Id_1,
                        Num_Sticker_1: data.Num_Sticker_1,
                        Sticker_Name_2: data.Sticker_Name_2,
                        Sticker_Erp_Id_2: data.Sticker_Erp_Id_2,
                        Num_Sticker_2: data.Num_Sticker_2,
                        Sticker_Name_3: data.Sticker_Name_3,
                        Sticker_Erp_Id_3: data.Sticker_Erp_Id_3,
                        Num_Sticker_3: data.Num_Sticker_3,
                        Name_Attach_Paper_1: data.Name_Attach_Paper_1,
                        Attach_Paper_Erp_Id_1: data.Attach_Paper_Erp_Id_1,
                        Num_Attach_1: data.Num_Attach_1,
                        Name_Attach_Paper_2: data.Name_Attach_Paper_2,
                        Attach_Paper_Erp_Id_2: data.Attach_Paper_Erp_Id_2,
                        Num_Attach_2: data.Num_Attach_2,
                        Name_Attach_Paper_3: data.Name_Attach_Paper_3,
                        Attach_Paper_Erp_Id_3: data.Attach_Paper_Erp_Id_3,
                        Num_Attach_3: data.Num_Attach_3,
                        Name_Attach_Paper_4: data.Name_Attach_Paper_4,
                        Attach_Paper_Erp_Id_4: data.Attach_Paper_Erp_Id_4,
                        Num_Attach_4: data.Num_Attach_4,
                        Name_Erp_Additional_Tool: data.Name_Erp_Additional_Tool,
                        Additional_Tool_Erp_Id: data.Additional_Tool_Erp_Id,
                        Num_Additional_Tool: data.Num_Additional_Tool,
                        Column_36: data.Column_36
                    };

                    form.setFieldsValue(formData); // Populate form with data
                    setLoading(false);
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
            load(id); // Fetch data when ID is present
        }
    }, [id, form]);

    // Handle form submission
    const handleSubmit = async (values) => {
        setIsPending(true);

        try {
            const updatedProductspec = { ...values, UpdateBy: '-' }; // Include UpdateBy field
            const result = await updateProductspec(id, updatedProductspec); // Update the product spec
            showNotification(result.msg, 'success');
            setTimeout(() => navigate('/productspec'), 2000); // Redirect after update
        } catch (error) {
            showNotification(error.message, 'fail');
        } finally {
            setIsPending(false);
        }
    };

    // Show notification
    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 2000); // Clear notification after 2 seconds
    };

    // Loading spinner while fetching data
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spin size="large" />
            </div>
        ); // Show a spinner until the data is loaded
    }

    return (
        <div className="container-fluid">
            <h2>แก้ไข Product Spec (Update Product Spec)</h2>
            <Form
                form={form} // Connect form instance
                layout="vertical"
                onFinish={handleSubmit}
            >
                <div className="row">
                    {[
                        { label: 'รหัส Product Spec', name: 'Product_Spec_Id' },
                        { label: 'Code การขาย', name: 'Sale_Code' },
                        { label: 'Coating', name: 'Coating' },
                        { label: 'Scoarching', name: 'Scoarching' },
                        { label: 'รหัสการ Scoarching/Coating', name: 'Scoarching_Coating_Id' },
                        { label: 'ติดแผน Shim', name: 'Shim' },
                        { label: 'Slot', name: 'Slot' },
                        { label: 'Chamfer', name: 'Chamfer' },
                        { label: 'พ่นสี', name: 'Color' },
                        { label: 'รหัสสี', name: 'Color_Id' },
                        { label: 'ชื่อลูกค้า', name: 'Customer_Name_Product_Spec' },
                        { label: 'สูตรเคมี', name: 'Chem_Formular' },
                        { label: 'สูตร Under layer', name: 'Formula_Under_Layer' },
                        { label: 'ชื่อสติกเกอร์ 1', name: 'Sticker_Name_1' },
                        { label: 'รหัส ERP สติกเกอร์ 1', name: 'Sticker_Erp_Id_1' },
                        { label: 'จำนวน สติกเกอร์ 1', name: 'Num_Sticker_1' },
                        { label: 'ชื่อสติกเกอร์ 2', name: 'Sticker_Name_2' },
                        { label: 'รหัส ERP สติกเกอร์ 2', name: 'Sticker_Erp_Id_2' },
                        { label: 'จำนวน สติกเกอร์ 2', name: 'Num_Sticker_2' },
                        { label: 'ชื่อสติกเกอร์ 3', name: 'Sticker_Name_3' },
                        { label: 'รหัส ERP สติกเกอร์ 3', name: 'Sticker_Erp_Id_3' },
                        { label: 'จำนวน สติกเกอร์ 3', name: 'Num_Sticker_3' },
                        { label: 'ชื่อใบแนบ 1', name: 'Name_Attach_Paper_1' },
                        { label: 'รหัส ERP ใบแนบ 1', name: 'Attach_Paper_Erp_Id_1' },
                        { label: 'จำนวนใบแนบ 1', name: 'Num_Attach_1' },
                        { label: 'ชื่อใบแนบ 2', name: 'Name_Attach_Paper_2' },
                        { label: 'รหัส ERP ใบแนบ 2', name: 'Attach_Paper_Erp_Id_2' },
                        { label: 'จำนวนใบแนบ 2', name: 'Num_Attach_2' },
                        { label: 'ชื่อใบแนบ 3', name: 'Name_Attach_Paper_3' },
                        { label: 'รหัส ERP ใบแนบ 3', name: 'Attach_Paper_Erp_Id_3' },
                        { label: 'จำนวนใบแนบ 3', name: 'Num_Attach_3' },
                        { label: 'ชื่อใบแนบ 4', name: 'Name_Attach_Paper_4' },
                        { label: 'รหัส ERP ใบแนบ 4', name: 'Attach_Paper_Erp_Id_4' },
                        { label: 'จำนวนใบแนบ 4', name: 'Num_Attach_4' },
                        { label: 'ชื่อ ERP อุปกรณ์เสริมอื่น ๆ', name: 'Name_Erp_Additional_Tool' },
                        { label: 'รหัส ERP อุปกรณ์เสริมอื่น ๆ', name: 'Additional_Tool_Erp_Id' },
                        { label: 'จำนวน อุปกรณ์เสริมอื่น ๆ', name: 'Num_Additional_Tool' },
                        { label: 'Column_36', name: 'Column_36' }
                    ].map((field, index) => (
                        <div className="col-xl-4 col-lg-6 col-md-12" key={index}>
                            <Form.Item
                                label={field.label}
                                name={field.name}
                                rules={[{ required: true, message: `กรุณากรอก ${field.label}` }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    ))}
                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/package')}>
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

export default UpdateProductSpec;