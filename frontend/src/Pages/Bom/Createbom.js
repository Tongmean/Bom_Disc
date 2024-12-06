import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createBom } from '../../Ultility/Bomapi';
import {fetchPackages , fetchOuters, fetchDatasheets, fetchProductspecs, fetchShims, fetchDrawings} from '../../Ultility/Sellectedbom'
const { Option } = Select;
const CreateBom = () => {
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [packageOptions, setPackageoptions] = useState([]);
    const [outerOptions, setOuteroptions] = useState([]);
    const [datasheetOptions, setDatasheetoptions] = useState([]);
    const [productspecOptions, setProductspecoptions] = useState([]);
    const [shimOptions, setShimoptions] = useState([]);
    const [drawingOptions, setDrawingoptions] = useState([]);
    const navigate = useNavigate();
    // Fetch display box data on component mount

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const packageData = await fetchPackages(); 
                setPackageoptions(packageData.data); 

                const outerData = await fetchOuters(); 
                setOuteroptions(outerData.data); 

                const datasheetData = await fetchDatasheets(); 
                setDatasheetoptions(datasheetData.data); 

                const productspecData = await fetchProductspecs(); 
                setProductspecoptions(productspecData.data); 

                const shimData = await fetchShims(); 
                setShimoptions(shimData.data); 

                const drawingData = await fetchDrawings(); 
                setDrawingoptions(drawingData.data); 

            } catch (error) {
                showNotification('Failed to fetch data', 'warning');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSubmit = async (values) => {
        setIsPending(true);
        const bomData = { ...values, CreateBy: '-' }; // Add CreateBy field

        try {
            const result = await createBom(bomData);
            showNotification(result.msg, 'success');
            form.resetFields(); // Clear form fields after success
            console.log('BOM Data:', bomData);
            console.log('API Result:', result);

            // Optionally navigate after a delay
            // setTimeout(() => navigate('/bom'), 2000);
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
            <h2>แบบฟอร์มบันทึก BOM (Bill of Materials)</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    Code_Fg: '',
                    Num: '',
                    Part_No: '',
                    Sale_Code_Bom: '',
                    Type_Customer: '',
                    Customer_Name: '',
                    Start_Sale_Date: '-',
                    Status: '',
                    Drawing_No: '',
                    Shim_Attach: '',
                    Shim_No: '',
                    Product_Spec_No: '',
                    Data_Sheet_No: '',
                    Display_Box_Id: '',
                    Quantity_Display_Box: '',
                    Outer_Package: '',
                    Outer_Id: '',
                    Pcs_Per_Set: '',
                    Additional_Package_Id: '',
                }}
            >
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="รหัส ERP (Code_Fg)" name="Code_Fg" rules={[{ required: true, message: 'กรุณากรอก รหัส ERP (Code_Fg)' }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="เบอร์" name="Num" rules={[{ required: true, message: 'กรุณากรอก เบอร์' }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="Part No." name="Part_No" rules={[{ required: true, message: 'กรุณากรอก Part No.' }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="Code การขาย" name="Sale_Code_Bom" rules={[{ required: true, message: 'กรุณากรอก Code การขาย' }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="ประเภทลูกค้า" name="Type_Customer" rules={[{ required: true, message: 'กรุณากรอก ประเภทลูกค้า' }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="ชื่อลูกค้า" name="Customer_Name" rules={[{ required: true, message: 'กรุณากรอก ชื่อลูกค้า' }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="วันเริ่มขาย" name="Start_Sale_Date" rules={[{ required: true, message: 'กรุณากรอก วันเริ่มขาย' }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="Status" name="Status" rules={[{ required: true, message: 'กรุณากรอก Status' }]}>
                            <Select placeholder="กรุณาเลือก Status">
                                <Select.Option value="พร้อมจำหน่าย">พร้อมจำหน่าย</Select.Option>
                                <Select.Option value="ประเมินราคา">ประเมินราคา</Select.Option>
                                <Select.Option value="ทดลองผลิต APQP">ทดลองผลิต APQP</Select.Option>
                                <Select.Option value="Obsolete">Obsolete</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="Drawing No." name="Drawing_No" rules={[{ required: true, message: 'กรุณากรอก Drawing No.' }]}>
                            <Select
                                placeholder="กรุณาเลือก Drawing No."
                                loading={loading}
                                allowClear
                                showSearch
                            >
                                <Option value="-">-</Option>
                                {drawingOptions.map((i) => (
                                    <Option key={i.Compact_No_Modify_Drawing} value={i.Compact_No_Modify_Drawing}>
                                        {i.Compact_No_Modify_Drawing}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="การติด Shim" name="Shim_Attach" rules={[{ required: true, message: 'กรุณากรอก การติด Shim' }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="Shim No" name="Shim_No" rules={[{ required: true, message: 'กรุณากรอก Shim No' }]}>
                            <Select
                                placeholder="กรุณาเลือก Shim No."
                                loading={loading}
                                allowClear
                                showSearch
                            >
                                <Option value="-">-</Option>
                                {shimOptions.map((i) => (
                                    <Option key={i.Compact_No_Modify} value={i.Compact_No_Modify}>
                                        {i.Compact_No_Modify}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="Product Spec No." name="Product_Spec_No" rules={[{ required: true, message: 'กรุณากรอก Product Spec No.' }]}>
                            <Select
                                placeholder="กรุณาเลือก Product Spec No."
                                loading={loading}
                                allowClear
                                showSearch
                            >
                                <Option value="-">-</Option>
                                {productspecOptions.map((i) => (
                                    <Option key={i.Product_Spec_Id} value={i.Data_Sheet_Id}>
                                        {i.Product_Spec_Id}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="Data Sheet No." name="Data_Sheet_No" rules={[{ required: true, message: 'กรุณากรอก Data Sheet No.' }]}>
                            <Select
                                placeholder="กรุณาเลือก Data Sheet No."
                                loading={loading}
                                allowClear
                                showSearch
                            >
                                <Option value="-">-</Option>
                                {datasheetOptions.map((i) => (
                                    <Option key={i.Data_Sheet_No} value={i.Data_Sheet_No}>
                                        {i.Data_Sheet_No}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item
                            label="เบอร์กล่อง"
                            name="Display_Box_Id"
                            rules={[{ required: true, message: 'กรุณาเลือก เบอร์กล่อง' }]}
                        >
                            <Select
                                placeholder="กรุณาเลือก เบอร์กล่อง"
                                loading={loading}
                                allowClear
                                showSearch
                            >
                                <Option value="-">-</Option>
                                {packageOptions.map((i) => (
                                    <Option key={i.Display_Box_id} value={i.Display_Box_id}>
                                        {i.Display_Box_id}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="จำนวนกล่อง" name="Quantity_Display_Box" rules={[{ required: true, message: 'กรุณากรอก จำนวนกล่อง' }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="ใส่ Outer" name="Outer_Package" rules={[{ required: true, message: 'กรุณากรอก ใส่ Outer' }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="รหัส Outer" name="Outer_Id" rules={[{ required: true, message: 'กรุณากรอก รหัส Outer' }]}>
                            <Select
                                placeholder="กรุณาเลือก รหัส Outer"
                                loading={loading}
                                allowClear
                                showSearch
                            >
                                <Option value="-">-</Option>
                                {outerOptions.map((i) => (
                                    <Option key={i.Outer_Id} value={i.Outer_Id}>
                                        {i.Outer_Id}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="จำนวนชิ้น/ชุด" name="Pcs_Per_Set" rules={[{ required: true, message: 'กรุณากรอก จำนวนชิ้น/ชุด' }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="รหัสการบรรจุที่ใส่อุปกรณ์เสริมเพิ่มเติมมา" name="Additional_Package_Id" rules={[{ required: true, message: 'กรุณากรอก รหัสการบรรจุที่ใส่อุปกรณ์เสริมเพิ่มเติมมา' }]}>
                            <Input />
                        </Form.Item>
                    </div>
                </div>
                <div className="col-12">
                    <Form.Item>
                        <Button type="default" className="me-2" onClick={() => navigate('/bom')}>
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
    );
};

export default CreateBom;
