import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createMaterial } from '../../Ultility/Materialapi'; // Assuming `createMaterial` is your API function
import { fetchMaterialcabinetid, fetchMaterialtypedrawing, fetchMaterialdocumentid, fetchMaterialremark, fetchMaterialtype1, fetchMaterialtype2, fetchMaterialtype3 } from '../../Ultility/ApiSetup/staticData';
import { Select } from 'antd';
const CreateMaterial = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [catalog, setcatalog] = useState('');
    const navigate = useNavigate();

 
    // const handleFieldsChange = () => {
    //     const values = form.getFieldsValue(["Compact_No_Modify"]);
    
    //     // Extract the first 9 digits of Compact_No_Modify
    //     const compactNoModify = values.Compact_No_Modify || '';
    //     const catalog = compactNoModify.slice(0, 9); // First 9 digits
    
    //     // Set the catalog value only if Compact_No_Modify changes and Compact_No_Catalog is still empty
    //     if (!form.getFieldValue('Compact_No_Catalog')) {
    //         form.setFieldsValue({ Compact_No_Catalog: catalog });
    //     }
    // };
    
    
    
    

    // console.log('catalog', catalog)
    // console.log('form', form)

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

    const handleSubmit = async (values) => {
        setIsPending(true);

        const materialData = { ...values, CreateBy: '-' }; // Merge form values with CreateBy

        try {
            const result = await createMaterial(materialData);
            showNotification(result.msg, 'success');
            console.log('Material Data:', materialData);
            console.log('API Result:', result);

            form.resetFields(); // Clear the form fields upon success
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
            <h2>แบบฟอร์มบันทึกส่วนประกอบ (Component Part)</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                // onFieldsChange={handleFieldsChange} 
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
                                    <Select>
                                        <Select.Option options={fetchMaterialcabinetid}></Select.Option>
                                    </Select>
                                ) 
                                : field.field === 'Type_Drawing' ? (
                                    <Select>
                                        <Select.Option options={fetchMaterialtypedrawing}></Select.Option>
                                    </Select>
                                )
                                : field.field === 'Remark' ? (
                                    <Select>
                                        <Select.Option options={fetchMaterialremark}></Select.Option>
                                    </Select>
                                )
                                : field.field === 'Document_Id' ? (
                                    <Select>
                                        <Select.Option options={fetchMaterialdocumentid}></Select.Option>
                                    </Select>
                                )
                                : field.field === 'Type1' ? (
                                    <Select>
                                        <Select.Option options={fetchMaterialtype1}></Select.Option>
                                    </Select>
                                )
                                : field.field === 'Type2' ? (
                                    <Select>
                                        <Select.Option options={fetchMaterialtype2}></Select.Option>
                                    </Select>
                                )
                                : field.field === 'Type3' ? (
                                    <Select>
                                        <Select.Option options={fetchMaterialtype3}></Select.Option>
                                    </Select>
                                )
                                : 
                                field.field === 'Data_Approve' ? (
                                    <Input
                                        placeholder='DD/MM/YYYY'
                                    />
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
                            <Button type="default" className="me-2" onClick={() => navigate('/componentpart')}>
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

export default CreateMaterial;
