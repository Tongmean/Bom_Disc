import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { fetchMaterial, updateMaterial } from '../../Ultility/Materialapi'; // Assuming `fetchMaterialById` and `updateMaterial` are API functions
import { fetchMaterialcabinetid, fetchMaterialtypedrawing, fetchMaterialdocumentid, fetchMaterialremark, fetchMaterialtype1, fetchMaterialtype2, fetchMaterialtype3 } from '../../Ultility/ApiSetup/staticData';

import { Select } from 'antd';

const UpdateMaterial = () => {
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams(); // Assuming the `id` is passed as a route parameter

    const fields = [
        { headerName: 'Compact_No (ปรับ)', field: 'Compact_No_Modify' },
        { headerName: 'Compact_No (Catalog)', field: 'Compact_No_Catalog' },
        { headerName: 'Drawing Number', field: 'Drawing_no' },
        { headerName: 'Type Drawing', field: 'Type_Drawing' },
        { headerName: 'เบอร์', field: 'Num' },
        { headerName: 'Sheet', field: 'Sheet' },
        { headerName: 'Date Approve', field: 'Data_Approve' },
        { headerName: 'Edion', field: 'Edion' },
        { headerName: 'รหัสตู้', field: 'Cabinet_Id' },
        { headerName: 'หมายเหตุ', field: 'Remark' },
        { headerName: 'รหัสเอกสาร', field: 'Document_Id' },
        { headerName: 'Type1', field: 'Type1' },
        { headerName: 'Type2', field: 'Type2' },
        { headerName: 'Type3', field: 'Type3' },
        { headerName: 'ID', field: 'ID' },
        { headerName: 'กว้าง', field: 'Width' },
        { headerName: 'ยาว', field: 'Length' },
        { headerName: 'หนา', field: 'Thick' },
        { headerName: 'หนารวมชิม', field: 'Shim_Thick' },
        { headerName: 'สูง', field: 'Height' },
        { headerName: 'ระยะการใช้งาน', field: 'Working_Duration' },
        { headerName: 'ขนาดรู', field: 'Hole_Scale' },
        { headerName: 'จำนวนชิ้น', field: 'Quantity_Shim' },
        { headerName: 'Option', field: 'Option' },
        { headerName: 'Area', field: 'Area' },
        { headerName: 'เจาะรู', field: 'Drill' },
        { headerName: 'ลักษณะชิม', field: 'Type_Shim' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const material = (await fetchMaterial(id)).data[0];
                form.setFieldsValue(material);
                console.log('material', material)
            } catch (error) {
                showNotification(error.message, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, form]);

    const handleSubmit = async (values) => {
        setIsPending(true);

        const updatedMaterial = { ...values, UpdateBy: '-' };

        try {
            const result = await updateMaterial(id, updatedMaterial);
            showNotification(result.msg, 'success');
            console.log('Updated Material Data:', updatedMaterial);
            console.log('API Result:', result);

            navigate('/material');
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-fluid">
            <h2>แก้ไขข้อมูลวัสดุ (Material)</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    Compact_No_Modify: '',
                    Compact_No_Catalog: '',
                    Drawing_no: '',
                    Type_Drawing: '',
                    Num: '',
                    Sheet: '',
                    Data_Approve: '',
                    Edion: '',
                    Cabinet_Id: '',
                    Remark: '',
                    Document_Id: '',
                    Type1: '',
                    Type2: '',
                    Type3: '',
                    ID: '',
                    Width: '',
                    Length: '',
                    Thick: '',
                    Shim_Thick: '',
                    Height: '',
                    Working_Duration: '',
                    Hole_Scale: '',
                    Quantity_Shim: '',
                    Option: '',
                    Area: '',
                    Drill: '',
                    Type_Shim: '',
                }}
            >
                <div className="row">
                    {fields.map((field) => (
                        <div className="col-xl-3 col-lg-6 col-md-12" key={field.field}>
                            <Form.Item
                                label={field.headerName}
                                name={field.field}
                                rules={[{ required: true, message: `กรุณากรอก ${field.headerName}` }]}
                            >
                                {field.field === 'Cabinet_Id' ? (
                                    <Select options={fetchMaterialcabinetid} />
                                ) : field.field === 'Type_Drawing' ? (
                                    <Select options={fetchMaterialtypedrawing} />
                                ) : field.field === 'Remark' ? (
                                    <Select options={fetchMaterialremark} />
                                ) : field.field === 'Document_Id' ? (
                                    <Select options={fetchMaterialdocumentid} />
                                ) : field.field === 'Type1' ? (
                                    <Select options={fetchMaterialtype1} />
                                ) : field.field === 'Type2' ? (
                                    <Select options={fetchMaterialtype2} />
                                ) : field.field === 'Type3' ? (
                                    <Select options={fetchMaterialtype3} />
                                ) : field.field === 'Data_Approve' ? (
                                    <Input placeholder="DD/MM/YYYY" />
                                ) : (
                                    <Input />
                                )}
                            </Form.Item>
                        </div>
                    ))}

                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/material')}>
                                Back
                            </Button>
                            <Button type="primary" htmlType="submit" disabled={isPending}>
                                {isPending ? 'Updating...' : 'Update Data'}
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

export default UpdateMaterial;
