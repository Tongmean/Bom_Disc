import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { CreateDrawingapi } from '../../Ultility/Drawingapi';

const CreateDrawing = () => {
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    const columnNameLabels = {
        Compact_No_Modify_Drawing: "Compact No (ปรับ)",
        Part_No: "Part No.",
        Erp_Id_BP1: "รหัส ERP BP1",
        Name_BP1: "ชื่อ ERP BP1",
        Id_BP1: "ID BP1",
        Quantity_BP1: "จำนวน BP1",
        Thickness_Pad1: "ความหนาผ้า 1",
        Erp_Id_BP2: "รหัส ERP BP2",
        Name_BP2: "ชื่อ ERP BP2",
        Id_BP2: "ID BP2",
        Quantity_BP2: "จำนวน BP2",
        Thickness_Pad2: "ความหนาผ้า 2",
        Erp_Id_BP3: "รหัส ERP BP3",
        Name_BP3: "ชื่อ ERP BP3",
        Id_BP3: "ID BP3",
        Quantity_BP3: "จำนวน BP3",
        Thickness_Pad3: "ความหนาผ้า 3",
        Erp_Id_BP4: "รหัส ERP BP4",
        Name_BP4: "ชื่อ ERP BP4",
        Id_BP4: "ID BP4",
        Quantity_BP4: "จำนวน BP4",
        Thickness_Pad4: "ความหนาผ้า 4",
        Erp_Id_WD1: "รหัส ERP WD1",
        Name_WD1: "ชื่อ ERP WD1",
        Id_WD1: "ID WD1",
        Quantity_WD1: "จำนวน WD1",
        Erp_Id_WD2: "รหัส ERP WD2",
        Name_WD2: "ชื่อ ERP WD2",
        Id_WD2: "ID WD2",
        Quantity_WD2: "จำนวน WD2",
        Erp_Id_WD3: "รหัส ERP WD3",
        Name_WD3: "ชื่อ ERP WD3",
        Id_WD3: "ID WD3",
        Quantity_WD3: "จำนวน WD3",
    };

    const initialValues = {
        Compact_No_Modify_Drawing: "",
        Part_No: "",
        Erp_Id_BP1: "",
        Name_BP1: "",
        Id_BP1: "",
        Quantity_BP1: "",
        Thickness_Pad1: "-",
        Erp_Id_BP2: "",
        Name_BP2: "",
        Id_BP2: "",
        Quantity_BP2: "",
        Thickness_Pad2: "-",
        Erp_Id_BP3: "",
        Name_BP3: "",
        Id_BP3: "",
        Quantity_BP3: "",
        Thickness_Pad3: "-",
        Erp_Id_BP4: "",
        Name_BP4: "",
        Id_BP4: "",
        Quantity_BP4: "",
        Thickness_Pad4: "-",
        Erp_Id_WD1: "",
        Name_WD1: "",
        Id_WD1: "",
        Quantity_WD1: "",
        Erp_Id_WD2: "",
        Name_WD2: "",
        Id_WD2: "",
        Quantity_WD2: "",
        Erp_Id_WD3: "",
        Name_WD3: "",
        Id_WD3: "",
        Quantity_WD3: "",
    };

    const handleSubmit = async (values) => {
        setIsPending(true);

        const drawingData = { ...values, CreateBy: '-' };

        try {
            const result = await CreateDrawingapi(drawingData);
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

    return (
        <div className="container-fluid">
            <h2>แบบฟอร์มบันทึก Drawing</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={initialValues}
            >
                <div className="row">
                    {Object.entries(columnNameLabels).map(([key, label], index) => (
                        <div className={`col-xl-4 col-lg-4 col-md-6`} key={index}>
                            <Form.Item
                                label={label}
                                name={key}
                                rules={[{ required: true, message: `กรุณากรอก ${label}` }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    ))}
                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/drawing')}>
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

export default CreateDrawing;
