import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { fetchrmpk } from '../../Ultility/Sellectedbom';
import { fetchproductspec, updateProductspec } from '../../Ultility/Productspecapi';
import { fetchStatus } from '../../Ultility/ApiSetup/staticData';
import { fetchStatusslot, fetchStatuschamfer, fetchStatuscolorid, fetchStatuscoatingscorching, fetchcheckstatus} from '../../Ultility/ApiSetup/staticData';
const { Option } = Select;

const UpdateProductSpec = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stickerOptions, setStickeroptions] = useState([]);
    const [additionOptions, setAdditionoptions] = useState([]);
    const { id } = useParams(); // Extract ID from route params
    const navigate = useNavigate();

    // Fetch product spec data on component mount
    useEffect(() => {
        const load = async (id) => {

            try {
                const data = (await fetchproductspec(id)).data[0]; // Fetch data by ID
                const Data = (await fetchrmpk()).data;
                const additiondata = Data.filter(item => item.Group === "อุปกรณ์เสริม");
                setAdditionoptions(additiondata);
                const stickerdata = Data.filter(item => item.Group === "Sticker");
                setStickeroptions(stickerdata);
                // console.log('additiondata', additiondata);
                // console.log('stickerdata', stickerdata);

                // Ensure the fetched data matches the form field names
                if (data) {
                    // const formData = {
                    //     Product_Spec_Id: data.Product_Spec_Id,
                    //     Sale_Code: data.Sale_Code,
                    //     Coating: data.Coating,
                    //     Scoarching: data.Scoarching,
                    //     Scoarching_Coating_Id: data.Scoarching_Coating_Id,
                    //     Shim: data.Shim,
                    //     Slot: data.Slot,
                    //     Chamfer: data.Chamfer,
                    //     Color: data.Color,
                    //     Color_Id: data.Color_Id,
                    //     Customer_Name_Product_Spec: data.Customer_Name_Product_Spec,
                    //     Chem_Formular: data.Chem_Formular,
                    //     Formula_Under_Layer: data.Formula_Under_Layer,
                    //     Sticker_Name_1: data.Sticker_Name_1,
                    //     Sticker_Erp_Id_1: data.Sticker_Erp_Id_1,
                    //     Num_Sticker_1: data.Num_Sticker_1,
                    //     Sticker_Name_2: data.Sticker_Name_2,
                    //     Sticker_Erp_Id_2: data.Sticker_Erp_Id_2,
                    //     Num_Sticker_2: data.Num_Sticker_2,
                    //     Sticker_Name_3: data.Sticker_Name_3,
                    //     Sticker_Erp_Id_3: data.Sticker_Erp_Id_3,
                    //     Num_Sticker_3: data.Num_Sticker_3,
                    //     Name_Attach_Paper_1: data.Name_Attach_Paper_1,
                    //     Attach_Paper_Erp_Id_1: data.Attach_Paper_Erp_Id_1,
                    //     Num_Attach_1: data.Num_Attach_1,
                    //     Name_Attach_Paper_2: data.Name_Attach_Paper_2,
                    //     Attach_Paper_Erp_Id_2: data.Attach_Paper_Erp_Id_2,
                    //     Num_Attach_2: data.Num_Attach_2,
                    //     Name_Attach_Paper_3: data.Name_Attach_Paper_3,
                    //     Attach_Paper_Erp_Id_3: data.Attach_Paper_Erp_Id_3,
                    //     Num_Attach_3: data.Num_Attach_3,
                    //     Name_Attach_Paper_4: data.Name_Attach_Paper_4,
                    //     Attach_Paper_Erp_Id_4: data.Attach_Paper_Erp_Id_4,
                    //     Num_Attach_4: data.Num_Attach_4,
                    //     Name_Erp_Additional_Tool: data.Name_Erp_Additional_Tool,
                    //     Additional_Tool_Erp_Id: data.Additional_Tool_Erp_Id,
                    //     Num_Additional_Tool: data.Num_Additional_Tool,
                    //     Column_36: data.Column_36,
                    //     Status: data.Status 
                    // };

                    form.setFieldsValue(data); // Populate form with data
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

    const handleSelectChange = (value, key) => {
        if (key === 'Additional_Tool_Erp_Id_1') {
            const selected = additionOptions.find(item => item.Rm_Pk_Id === value);
            console.log('Selected Outer 1:', selected); // Debug
            form.setFieldsValue({
                Name_Erp_Additional_Tool_1: selected ? selected.Name_Erp : ''
            });
        } else if (key === 'Additional_Tool_Erp_Id_2') {
            const selected = additionOptions.find(item => item.Rm_Pk_Id === value);
            console.log('Selected Outer 2:', selected); // Debug
            form.setFieldsValue({
                Name_Erp_Additional_Tool_2: selected ? selected.Name_Erp : ''
            });
        } else if (key === 'Additional_Tool_Erp_Id_3') {
            const selected = additionOptions.find(item => item.Rm_Pk_Id === value);
            console.log('Selected Outer 3:', selected); // Debug
            form.setFieldsValue({
                Name_Erp_Additional_Tool_3: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Attach_Paper_Erp_Id_1') {
            const selected = additionOptions.find(item => item.Rm_Pk_Id === value);
            form.setFieldsValue({
                Name_Attach_Paper_1: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Attach_Paper_Erp_Id_2') {
            const selected = additionOptions.find(item => item.Rm_Pk_Id === value);
            form.setFieldsValue({
                Name_Attach_Paper_2: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Attach_Paper_Erp_Id_3') {
            const selected = additionOptions.find(item => item.Rm_Pk_Id === value);
            form.setFieldsValue({
                Name_Attach_Paper_3: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Attach_Paper_Erp_Id_4') {
            const selected = additionOptions.find(item => item.Rm_Pk_Id === value);
            form.setFieldsValue({
                Name_Attach_Paper_4: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Sticker_Erp_Id_1') {
            const selected = stickerOptions.find(item => item.Rm_Pk_Id === value);
            form.setFieldsValue({
                Sticker_Name_1: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Sticker_Erp_Id_2') {
            const selected = stickerOptions.find(item => item.Rm_Pk_Id === value);
            form.setFieldsValue({
                Sticker_Name_2: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Sticker_Erp_Id_3') {
            const selected = stickerOptions.find(item => item.Rm_Pk_Id === value);
            form.setFieldsValue({
                Sticker_Name_3: selected ? selected.Name_Erp : ''
            });
        }
    };
    
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

    // Define fields including the new Status dropdown
    // const attributes = [
    //     { label: 'ชื่อลูกค้า', name: 'Customer_Name_Product_Spec' },
    //     { label: 'รหัสลูกค้า', name: 'Customer_Code' },
    //     { label: 'Code การขาย', name: 'Sale_Code' },
    //     { label: 'รหัส Product Spec', name: 'Product_Spec_Id' },
    //     { label: 'สูตรเคมี', name: 'Chem_Formular' },
    //     { label: 'สูตร Under layer', name: 'Formula_Under_Layer' },
    //     { label: 'Coating', name: 'Coating' },
    //     { label: 'Scoarching', name: 'Scoarching' },
    //     { label: 'รหัสการ Scoarching/Coating', name: 'Scoarching_Coating_Id' },
    //     { label: 'ติดแผน Shim', name: 'Shim' },
    //     { label: 'Slot', name: 'Slot' },
    //     { label: 'Chamfer', name: 'Chamfer' },
    //     { label: 'พ่นสี', name: 'Color' },
    //     { label: 'รหัสสี', name: 'Color_Id' },

    //     { label: 'รหัส ERP สติกเกอร์ 1', name: 'Sticker_Erp_Id_1' },
    //     { label: 'ชื่อสติกเกอร์ 1', name: 'Sticker_Name_1' },
    //     { label: 'จำนวน สติกเกอร์ 1', name: 'Num_Sticker_1' },

    //     { label: 'รหัส ERP สติกเกอร์ 2', name: 'Sticker_Erp_Id_2' },
    //     { label: 'ชื่อสติกเกอร์ 2', name: 'Sticker_Name_2' },
    //     { label: 'จำนวน สติกเกอร์ 2', name: 'Num_Sticker_2' },

    //     { label: 'รหัส ERP สติกเกอร์ 3', name: 'Sticker_Erp_Id_3' },
    //     { label: 'ชื่อสติกเกอร์ 3', name: 'Sticker_Name_3' },
    //     { label: 'จำนวน สติกเกอร์ 3', name: 'Num_Sticker_3' },

    //     { label: 'รหัส ERP ใบแนบ 1', name: 'Attach_Paper_Erp_Id_1' },
    //     { label: 'ชื่อใบแนบ 1', name: 'Name_Attach_Paper_1' },
    //     { label: 'จำนวนใบแนบ 1', name: 'Num_Attach_1' },

    //     { label: 'รหัส ERP ใบแนบ 2', name: 'Attach_Paper_Erp_Id_2' },
    //     { label: 'ชื่อใบแนบ 2', name: 'Name_Attach_Paper_2' },
    //     { label: 'จำนวนใบแนบ 2', name: 'Num_Attach_2' },

    //     { label: 'รหัส ERP ใบแนบ 3', name: 'Attach_Paper_Erp_Id_3' },
    //     { label: 'ชื่อใบแนบ 3', name: 'Name_Attach_Paper_3' },
    //     { label: 'จำนวนใบแนบ 3', name: 'Num_Attach_3' },

    //     { label: 'รหัส ERP ใบแนบ 4', name: 'Attach_Paper_Erp_Id_4' },
    //     { label: 'ชื่อใบแนบ 4', name: 'Name_Attach_Paper_4' },
    //     { label: 'จำนวนใบแนบ 4', name: 'Num_Attach_4' },

    //     { label: 'รหัส ERP อุปกรณ์เสริมอื่น 1', name: 'Additional_Tool_Erp_Id_1' },
    //     { label: 'ชื่อ ERP อุปกรณ์เสริมอื่น 1', name: 'Name_Erp_Additional_Tool_1' },
    //     { label: 'จำนวน อุปกรณ์เสริมอื่น 1', name: 'Num_Additional_Tool_1' },

    //     { label: 'รหัส ERP อุปกรณ์เสริมอื่น 2', name: 'Additional_Tool_Erp_Id_2' },
    //     { label: 'ชื่อ ERP อุปกรณ์เสริมอื่น 2', name: 'Name_Erp_Additional_Tool_2' },
    //     { label: 'จำนวน อุปกรณ์เสริมอื่น 2', name: 'Num_Additional_Tool_2' },

    //     { label: 'รหัส ERP อุปกรณ์เสริมอื่น 3', name: 'Additional_Tool_Erp_Id_3' },
    //     { label: 'ชื่อ ERP อุปกรณ์เสริมอื่น 3', name: 'Name_Erp_Additional_Tool_3' },
    //     { label: 'จำนวน อุปกรณ์เสริมอื่น 3', name: 'Num_Additional_Tool_3' },
        
    //     { label: 'Status', name: 'Status' },
    //     { label: 'Check Status', name: 'Check_Status' },
    //     { label: 'Remark', name: 'Remark' },
    // ];
    const columnNameLabels = {
        Customer_Name_Product_Spec: 'ชื่อลูกค้า',
        Customer_Code: 'รหัสลูกค้า',
        Sale_Code: 'Code การขาย',
        Product_Spec_Id: 'รหัส Product Spec',
        Chem_Formular: 'สูตรเคมี',
        Formula_Under_Layer: 'สูตร Under layer',
        Coating: 'Coating',
        Scoarching: 'Scoarching',
        Scoarching_Coating_Id: 'รหัสการ Scoarching/Coating',
        Shim: 'ติดแผน Shim',
        Slot: 'Slot',
        Chamfer: 'Chamfer',
        Color: 'พ่นสี',
        Color_Id: 'รหัสสี',
        
        Sticker_Erp_Id_1: 'รหัส ERP สติกเกอร์ 1',
        Sticker_Name_1: 'ชื่อสติกเกอร์ 1',
        Num_Sticker_1: 'จำนวน สติกเกอร์ 1',
    
        Sticker_Erp_Id_2: 'รหัส ERP สติกเกอร์ 2',
        Sticker_Name_2: 'ชื่อสติกเกอร์ 2',
        Num_Sticker_2: 'จำนวน สติกเกอร์ 2',
    
        Sticker_Erp_Id_3: 'รหัส ERP สติกเกอร์ 3',
        Sticker_Name_3: 'ชื่อสติกเกอร์ 3',
        Num_Sticker_3: 'จำนวน สติกเกอร์ 3',
    
        Attach_Paper_Erp_Id_1: 'รหัส ERP ใบแนบ 1',
        Name_Attach_Paper_1: 'ชื่อใบแนบ 1',
        Num_Attach_1: 'จำนวนใบแนบ 1',
    
        Attach_Paper_Erp_Id_2: 'รหัส ERP ใบแนบ 2',
        Name_Attach_Paper_2: 'ชื่อใบแนบ 2',
        Num_Attach_2: 'จำนวนใบแนบ 2',
    
        Attach_Paper_Erp_Id_3: 'รหัส ERP ใบแนบ 3',
        Name_Attach_Paper_3: 'ชื่อใบแนบ 3',
        Num_Attach_3: 'จำนวนใบแนบ 3',
    
        Attach_Paper_Erp_Id_4: 'รหัส ERP ใบแนบ 4',
        Name_Attach_Paper_4: 'ชื่อใบแนบ 4',
        Num_Attach_4: 'จำนวนใบแนบ 4',
    
        Additional_Tool_Erp_Id_1: 'รหัส ERP อุปกรณ์เสริมอื่น 1',
        Name_Erp_Additional_Tool_1: 'ชื่อ ERP อุปกรณ์เสริมอื่น 1',
        Num_Additional_Tool_1: 'จำนวน อุปกรณ์เสริมอื่น 1',
    
        Additional_Tool_Erp_Id_2: 'รหัส ERP อุปกรณ์เสริมอื่น 2',
        Name_Erp_Additional_Tool_2: 'ชื่อ ERP อุปกรณ์เสริมอื่น 2',
        Num_Additional_Tool_2: 'จำนวน อุปกรณ์เสริมอื่น 2',
    
        Additional_Tool_Erp_Id_3: 'รหัส ERP อุปกรณ์เสริมอื่น 3',
        Name_Erp_Additional_Tool_3: 'ชื่อ ERP อุปกรณ์เสริมอื่น 3',
        Num_Additional_Tool_3: 'จำนวน อุปกรณ์เสริมอื่น 3',
    
        Status: 'Status',
        Check_Status: 'Check Status',
        Remark: 'Remark'
    };

    return (
        <div className="container-fluid">
            <h2>แก้ไข Product Spec (Update Product Spec)</h2>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    // initialValues={Object.fromEntries(attributes.map(attr => [attr.name, '']))}
                >
                    

                    
                    <div className="row">
                        {['Customer_Name_Product_Spec', 'Customer_Code','Sale_Code', 'Product_Spec_Id', 'Chem_Formular', 'Formula_Under_Layer', 'Coating', 'Scoarching', 'Scoarching_Coating_Id', 'Shim', 'Slot', 'Chamfer','Color', 'Color_Id', 'Status', 'Check_Status', 'Remark'].map((key) => (
                            <div className="col-md-3" key={key}>
                                <Form.Item
                                    label={columnNameLabels[key]}
                                    name={key}
                                    rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels[key]}` }]}
                                >
                                    {
                                    key === 'Scoarching_Coating_Id' ? (
                                        <Select options={fetchStatuscoatingscorching} placeholder={`เลือก ${columnNameLabels[key]}`} />
                                    )
                                    :    
                                    key === 'Slot' ? (
                                        <Select options={fetchStatusslot} placeholder={`เลือก ${columnNameLabels[key]}`} />
                                    )
                                    :    
                                    key === 'Chamfer' ? (
                                        <Select options={fetchStatuschamfer} placeholder={`เลือก ${columnNameLabels[key]}`} />
                                    )
                                    :    
                                    key === 'Color_Id' ? (
                                        <Select options={fetchStatuscolorid} placeholder={`เลือก ${columnNameLabels[key]}`} />
                                    )
                                    :    
                                    key === "Status" ? (
                                        <Select options={fetchStatus} placeholder={`เลือก ${columnNameLabels[key]}`} />
                                    )
                                    : 
                                    key === "Check_Status" ? (
                                        <Select options={fetchcheckstatus} placeholder={`เลือก ${columnNameLabels[key]}`} />
                                    )
                                    : 

                                    (
                                        <Input placeholder={`กรอก ${columnNameLabels[key]}`} />
                                    )}
                                </Form.Item>
                            </div>
                        ))}
                    </div>               

                    {/* Sticker to 1-3 Rows */}
                    {[1, 2, 3].map((num) => (
                        <div className="row" key={num}>
                            {['Sticker_Erp_Id_', 'Sticker_Name_', 'Num_Sticker_'].map((prefix) => {
                                const key = `${prefix}${num}`;
                                return (
                                    <div className="col-md-4" key={key}>
                                        <Form.Item
                                            label={columnNameLabels[key]}
                                            name={key}
                                            rules={[{ required: true, message: `กรุณาเลือก ${columnNameLabels[key]}` }]}
                                        >
                                            {key.includes('Sticker_Name_') || key.includes('Num_Sticker_')? (
                                                <Input placeholder={`กรอก ${columnNameLabels[key]}`} />
                                            ) : (
                                                <Select
                                                    placeholder={`เลือก ${columnNameLabels[key]}`}
                                                    // loading={loading}
                                                    allowClear
                                                    showSearch
                                                    onChange={(value) => handleSelectChange(value, key)}
                                                >
                                                    <Select.Option value="-">-</Select.Option>
                                                    {(key.includes('Sticker_Erp_Id_') ? stickerOptions : stickerOptions).map((i) => (
                                                        <Select.Option key={i.Erp_Id} value={i.Erp_Id}>
                                                            {i.Erp_Id}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                    {/* attach paper to 1-3 Rows */}
                    {[1, 2, 3, 4].map((num) => (
                        <div className="row" key={num}>
                            {['Attach_Paper_Erp_Id_', 'Name_Attach_Paper_', 'Num_Attach_'].map((prefix) => {
                                const key = `${prefix}${num}`;
                                return (
                                    <div className="col-md-4" key={key}>
                                        <Form.Item
                                            label={columnNameLabels[key]}
                                            name={key}
                                            rules={[{ required: true, message: `กรุณาเลือก ${columnNameLabels[key]}` }]}
                                        >
                                            {key.includes('Name_Attach_Paper_') || key.includes('Num_Attach_')? (
                                                <Input placeholder={`กรอก ${columnNameLabels[key]}`} />
                                            ) : (
                                                <Select
                                                    placeholder={`เลือก ${columnNameLabels[key]}`}
                                                    // loading={loading}
                                                    allowClear
                                                    showSearch
                                                    onChange={(value) => handleSelectChange(value, key)}
                                                >
                                                    <Select.Option value="-">-</Select.Option>
                                                    {(key.includes('Attach_Paper_Erp_Id_') ? additionOptions : additionOptions).map((i) => (
                                                        <Select.Option key={i.Erp_Id} value={i.Erp_Id}>
                                                            {i.Erp_Id}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                    {/* Additional_Tool to 1-3 Rows */}
                    {[1, 2, 3].map((num) => (
                        <div className="row" key={num}>
                            {['Additional_Tool_Erp_Id_', 'Name_Erp_Additional_Tool_', 'Num_Additional_Tool_'].map((prefix) => {
                                const key = `${prefix}${num}`;
                                return (
                                    <div className="col-md-4" key={key}>
                                        <Form.Item
                                            label={columnNameLabels[key]}
                                            name={key}
                                            rules={[{ required: true, message: `กรุณาเลือก ${columnNameLabels[key]}` }]}
                                        >
                                            {key.includes('Name_Erp_Additional_Tool_') || key.includes('Num_Additional_Tool_')? (
                                                <Input placeholder={`กรอก ${columnNameLabels[key]}`} />
                                            ) : (
                                                <Select
                                                    placeholder={`เลือก ${columnNameLabels[key]}`}
                                                    // loading={loading}
                                                    allowClear
                                                    showSearch
                                                    onChange={(value) => handleSelectChange(value, key)}
                                                >
                                                    <Select.Option value="-">-</Select.Option>
                                                    {(key.includes('Additional_Tool_Erp_Id_') ? additionOptions : additionOptions).map((i) => (
                                                        <Select.Option key={i.Erp_Id} value={i.Erp_Id}>
                                                            {i.Erp_Id}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                    <div className="row">
                        <div className="col-12">
                            <Form.Item>
                                <Button type="default" className="me-2" onClick={() => navigate('/productspec')}>
                                    Back
                                </Button>
                                <Button type="primary" htmlType="submit" disabled={isPending}>
                                    {isPending ? 'Saving...' : 'Save Data'}
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
