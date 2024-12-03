import React, { useState } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createOuter } from '../../Ultility/Outerapi';

const CreateOuter = () => {
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setIsPending(true);
        const outer = { ...values, CreateBy: '-' };

        try {
            const result = await createOuter(outer);
            showNotification(result.msg, 'success');
            form.resetFields();
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

    const columnNameLabels = {
        Outer_Id: "รหัส Outer",
        Num_Display_Box: "เบอร์กล่อง",
        Type_Diecut: "ลักษณะ Die Cut",
        Num_Outer: "เบอร์ Outer",
        Outer_Erp_Id: "รหัส ERP",
        Name_Outer_Erp: "ชื่อ Outer",
        Set_Per_Outer: "จำนวน Set/ Outer",
        Set_Per_Outer_1: "จำนวน Set/ Outer_1",
        Outer_Erp_Sticker: "รหัส ERP Sticker",
        Name_Outer_Erp_Sticker: "ชื่อ ERP Sticker",
        Num_Sticker: "จำนวน Sticker",
        Outer_Per_pallet: "จำนวน Outer/ พาเลท",
    };

    return (
        <div className="container-fluid">
            <h2>แบบฟอร์มบันทึก Outer</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    Outer_Id: '',
                    Num_Display_Box: '',
                    Type_Diecut: '',
                    Num_Outer: '',
                    Outer_Erp_Id: '',
                    Name_Outer_Erp: '',
                    Set_Per_Outer: '',
                    Set_Per_Outer_1: '',
                    Outer_Erp_Sticker: '',
                    Name_Outer_Erp_Sticker: '',
                    Num_Sticker: '',
                    Outer_Per_pallet: '',
                }}
            >
                <Row gutter={16}>
                    <Col xl={8} lg={12} md={24} sm={24}>
                        <Form.Item
                            label={columnNameLabels.Outer_Id}
                            name="Outer_Id"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Outer_Id}` }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={columnNameLabels.Num_Display_Box}
                            name="Num_Display_Box"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Num_Display_Box}` }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={columnNameLabels.Type_Diecut}
                            name="Type_Diecut"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Type_Diecut}` }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={columnNameLabels.Num_Outer}
                            name="Num_Outer"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Num_Outer}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xl={8} lg={12} md={24} sm={24}>
                        <Form.Item
                            label={columnNameLabels.Outer_Erp_Id}
                            name="Outer_Erp_Id"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Outer_Erp_Id}` }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={columnNameLabels.Name_Outer_Erp}
                            name="Name_Outer_Erp"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Name_Outer_Erp}` }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={columnNameLabels.Set_Per_Outer}
                            name="Set_Per_Outer"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Set_Per_Outer}` }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={columnNameLabels.Set_Per_Outer_1}
                            name="Set_Per_Outer_1"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Set_Per_Outer_1}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xl={8} lg={12} md={24} sm={24}>
                        <Form.Item
                            label={columnNameLabels.Outer_Erp_Sticker}
                            name="Outer_Erp_Sticker"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Outer_Erp_Sticker}` }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={columnNameLabels.Name_Outer_Erp_Sticker}
                            name="Name_Outer_Erp_Sticker"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Name_Outer_Erp_Sticker}` }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={columnNameLabels.Num_Sticker}
                            name="Num_Sticker"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Num_Sticker}` }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={columnNameLabels.Outer_Per_pallet}
                            name="Outer_Per_pallet"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Outer_Per_pallet}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button type="default" className="me-2" onClick={() => navigate('/outer')}>
                        Back
                    </Button>
                    <Button type="primary" htmlType="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save Data'}
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

export default CreateOuter;
