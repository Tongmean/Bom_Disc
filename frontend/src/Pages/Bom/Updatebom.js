import { fetchBom, updateBom } from '../../Ultility/Bomapi';
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import {
    fetchPackages,
    fetchOuters,
    fetchDatasheets,
    fetchProductspecs,
    fetchShims,
    fetchDrawings,
} from '../../Ultility/Sellectedbom';
import { fetchStatusproduct } from '../../Ultility/ApiSetup/staticData';

const { Option } = Select;

const UpdateBom = () => {
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dropdownLoading, setDropdownLoading] = useState(false);
    const [packageOptions, setPackageoptions] = useState([]);
    const [outerOptions, setOuteroptions] = useState([]);
    const [datasheetOptions, setDatasheetoptions] = useState([]);
    const [productspecOptions, setProductspecoptions] = useState([]);
    const [shimOptions, setShimoptions] = useState([]);
    const [drawingOptions, setDrawingoptions] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDropdownData = async () => {
            setDropdownLoading(true);
            try {
                const [packages, outers, datasheets, productspecs, shims, drawings] = await Promise.all([
                    fetchPackages(),
                    fetchOuters(),
                    fetchDatasheets(),
                    fetchProductspecs(),
                    fetchShims(),
                    fetchDrawings(),
                ]);

                setPackageoptions(packages.data);
                setOuteroptions(outers.data);
                setDatasheetoptions(datasheets.data);
                setProductspecoptions(productspecs.data);
                setShimoptions(shims.data);
                setDrawingoptions(drawings.data);

                console.log('productspecOptions', productspecOptions)

            } catch (error) {
                showNotification('Failed to fetch dropdown data', 'warning');
            } finally {
                setDropdownLoading(false);
            }
        };

        const fetchBomData = async (id) => {
            setLoading(true);
            try {
                const data = (await fetchBom(id)).data[0];
                if (data) {
                    form.setFieldsValue(data);
                } else {
                    showNotification('No data found for the selected BOM', 'error');
                }
            } catch (error) {
                showNotification('Failed to fetch BOM data', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchDropdownData();
        if (id) {
            fetchBomData(id);
        }
    }, [id, form]);

    const handleSubmit = async (values) => {
        setIsPending(true);
        try {
            const updatedBom = { ...values, UpdateBy: '-' };
            const result = await updateBom(id, updatedBom);
            showNotification(result.msg, 'success');
            setTimeout(() => navigate('/bom'), 2000);
        } catch (error) {
            showNotification(error.message, 'fail');
        } finally {
            setIsPending(false);
        }
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const getUniqueOptions = (options) => {
        // Filter out duplicates while including the default "-" option only once
        const uniqueOptions = Array.from(new Set(options.map(item => item.Compact_No_Modify_Drawing || item.Display_Box_id || item.Outer_Id)))
            .map(value => options.find(item => item.Compact_No_Modify_Drawing === value || item.Display_Box_id === value || item.Outer_Id === value));
        return uniqueOptions;
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <h2>แก้ไข Bill of Material (Update BOM)</h2>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                                <Select.Option options = {fetchStatusproduct}></Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    {/* Drawing No. Dropdown */}
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="Drawing No." name="Drawing_No" rules={[{ required: true, message: 'กรุณาเลือก Drawing No.' }]}>
                            <Select
                                placeholder="กรุณาเลือก Drawing No."
                                loading={dropdownLoading}
                                allowClear
                                showSearch
                            >
                                <Option value="-">-</Option>
                                {(drawingOptions).map((option) => (
                                    <Option key={option.Compact_No_Modify_Drawing} value={option.Compact_No_Modify_Drawing}>
                                        {option.Compact_No_Modify_Drawing}
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
                        {/* Shim No. Dropdown */}
                        <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="Shim No." name="Shim_No" rules={[{ required: true, message: 'กรุณากรอก Shim No.' }]}>
                            <Select
                                placeholder="กรุณาเลือก Shim No."
                                loading={dropdownLoading}
                                allowClear
                                showSearch
                            >
                                <Option value="-">-</Option>
                                {shimOptions.map((option) => (
                                    <Option key={option.Compact_No_Modify} value={option.Compact_No_Modify}>
                                        {option.Compact_No_Modify}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    {/* Product Spec No. Dropdown */}
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="Product Spec No." name="Product_Spec_No" rules={[{ required: true, message: 'กรุณากรอก Product Spec No.' }]}>
                            <Select
                                placeholder="กรุณาเลือก Product Spec No."
                                loading={dropdownLoading}
                                allowClear
                                showSearch
                            >
                                <Option value="-">-</Option>
                                {(productspecOptions).map((option) => (
                                    <Option key={option.Product_Spec_Id} value={option.Product_Spec_Id}>
                                        {option.Product_Spec_Id}
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
                    {/* Outer Package Dropdown */}
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Form.Item label="รหัส Outer" name="Outer_Package" rules={[{ required: true, message: 'กรุณากรอก Outer Package' }]}>
                            <Select
                                placeholder="กรุณาเลือก Outer Package"
                                loading={dropdownLoading}
                                allowClear
                                showSearch
                            >
                                <Option value="-">-</Option>
                                {(outerOptions).map((option) => (
                                    <Option key={option.Outer_Id} value={option.Outer_Id}>
                                        {option.Outer_Id}
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


                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/bom')}>
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
                <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
            )}
        </div>
    );
};

export default UpdateBom;
