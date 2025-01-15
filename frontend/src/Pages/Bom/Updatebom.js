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
    fetchEmarks,
    fetchAdditionalpackages
} from '../../Ultility/Sellectedbom';
import { fetchStatusproduct, fetchOuterproduct } from '../../Ultility/ApiSetup/staticData';

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
    const [emarkOptions, setEmarkoptions] = useState([]);
    const [additionalpackgeOptions, setAdditionalpackgeoptions] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();

    const columnNameLabels = {
        Customer_Name: "ชื่อลูกค้า",
        Customer_Code: "รหัสลูกค้า",
        Type_Customer: "ประเภทลูกค้า",
        Sale_Code_Bom: "Code การขาย",
        Num: "เบอร์",
        Part_No: "Part No.",
        Code_Fg: "รหัส ERP (Code_Fg)",
        Drawing_No: "Drawing No.",
        Shim_Attach: "การติด Shim",
        Shim_No: "Shim No",
        Product_Spec_No: "Product Spec No.",
        Data_Sheet_No: "Data Sheet No.",
        Pcs_Per_Set: "จำนวนชิ้น/ชุด",
        Display_Box_Id: "เบอร์กล่อง",
        Quantity_Display_Box: "จำนวนกล่อง",
        Outer_Package: "ใส่ Outer",
        Outer_Id: "รหัส Outer",
        Additional_Package_Id: "รหัสการบรรจุที่ใส่อุปกรณ์เสริมเพิ่มเติมมา",
        Status: "Status",

        Start_Sale_Date: "วันเริ่มขาย",
        End_Sale_Date: "วันยกเลิกขาย",
        Emark_Id: "Emark Id",
        Ref_Code: "Ref Code_Fg",

    };

    
    useEffect(() => {
        const fetchDropdownData = async () => {
            setDropdownLoading(true);
            try {
                const [packages, outers, datasheets, productspecs, shims, drawings, emarks, additionalpackageData] = await Promise.all([
                    fetchPackages(),
                    fetchOuters(),
                    fetchDatasheets(),
                    fetchProductspecs(),
                    fetchShims(),
                    fetchDrawings(),
                    fetchEmarks(),

                    fetchAdditionalpackages()
                ]);

                setPackageoptions(packages.data);
                setOuteroptions(outers.data);
                setDatasheetoptions(datasheets.data);
                setProductspecoptions(productspecs.data);
                setShimoptions(shims.data);
                setDrawingoptions(drawings.data);
                setEmarkoptions(emarks.data);
                setAdditionalpackgeoptions(additionalpackageData.data); 
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
            setTimeout(() => navigate('/productregister'), 2000);
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

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <h2>แบบฟอร์มแก้ไขทะเบียนผลิตภัณฑ์ (Product Register)</h2>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <div className="row">
                    {Object.entries(columnNameLabels).map(([key, label], index) => (
                        <div className={`col-xl-3 col-lg-3 col-md-4 col-sm-6`} key={index}>
                            {key === "Status" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    loading={loading}
                                    allowClear
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select placeholder={`เลือก ${label}`}>
                                    {fetchStatusproduct.map((status) => (
                                        <Option key={status.value} value={status.value}>
                                            {status.label}
                                        </Option>
                                    ))}
                        
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Additional_Package_Id" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    loading={loading}
                                    allowClear
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select placeholder={`เลือก ${label}`}>
                                    <Option value="-">-</Option>
                                    {additionalpackgeOptions.map((status) => (
                                        <Option key={status.Additional_Package_Id} value={status.Additional_Package_Id}>
                                            {status.Additional_Package_Id}
                                        </Option>
                                    ))}
                        
                                </Select>
                                </Form.Item>
                            )
                            :
                            key === "Outer_Package" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    loading={loading}
                                    allowClear
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select placeholder={`เลือก ${label}`}>
                                    {fetchOuterproduct.map((status) => (
                                        <Option key={status.value} value={status.value}>
                                            {status.label}
                                        </Option>
                                    ))}
                        
                                </Select>
                                </Form.Item>
                            )
                            :
                            key === "Shim_Attach" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    loading={loading}
                                    allowClear
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select placeholder={`เลือก ${label}`}>
                                    {fetchOuterproduct.map((status) => (
                                        <Option key={status.value} value={status.value}>
                                            {status.label}
                                        </Option>
                                    ))}
                        
                                </Select>
                                </Form.Item>
                            )
                            :
                            key === "Drawing_No" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
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
                            )
                            :
                            key === "Shim_No" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
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
                            )
                            :
                            key === "Product_Spec_No" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
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
                            )
                            :
                            key === "Data_Sheet_No" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
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
                            )
                            :
                            key === "Display_Box_Id" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
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
                            )
                            :
                            key === "Outer_Id" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
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
                            )
                            :
                            
                            key === "Emark_Id" ? (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณาเลือก ${label}` }]}
                                >
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                    >
                                        <Option value="-">-</Option>
                                        {emarkOptions.map((i) => (
                                            <Option key={i.Emark_Id} value={i.Emark_Id}>
                                                {i.Emark_Id}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                            :
                            key === "Start_Sale_Date" ?
                            (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณากรอก ${label}` }]}
                                >
                                    <Input placeholder="DD/MM/YYYY" />
                                </Form.Item>
                            )
                            :
                            key === "End_Sale_Date" ?
                            (
                                <Form.Item
                                    label={label}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณากรอก ${label}` }]}
                                >
                                    <Input placeholder="DD/MM/YYYY" />
                                </Form.Item>
                            )
                            :
                            (
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




                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/productregister')}>
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
