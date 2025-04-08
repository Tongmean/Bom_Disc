import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createProductspec } from '../../Ultility/Productspecapi';
import { Select } from 'antd';
import { fetchrmpk } from '../../Ultility/Sellectedbom';
import { fetchStatus, fetchcheckstatus } from '../../Ultility/ApiSetup/staticData';
import { fetchStatusslot, fetchStatuschamfer, fetchStatuscolorid, fetchStatuscoatingscorching} from '../../Ultility/ApiSetup/staticData';
// const { Option } = Select;

const CreateProductSpec = () => {
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const [stickerOptions, setStickeroptions] = useState([]);
    const [additionOptions, setAdditionoptions] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setIsPending(true);

        const productspecData = { ...values, CreateBy: '-' };

        try {
            const result = await createProductspec(productspecData);
            showNotification(result.msg, 'success');
            console.log('Product Spec:', productspecData);
            console.log('API Result:', result);

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
        Check_Status: 'Check Status'
    };
    

    

    useEffect(() => {
        const load = async () => {
            setIsPending(true);
            try {
                const Data = (await fetchrmpk()).data;
                const additiondata = Data.filter(item => item.Group === "อุปกรณ์เสริม");
                setAdditionoptions(additiondata);
                const stickerdata = Data.filter(item => item.Group === "Sticker");
                setStickeroptions(stickerdata);
                // console.log('additiondata', additiondata);
                // console.log('stickerdata', stickerdata);
            } catch (error) {
                showNotification('Failed to fetch data', 'warning');
            } finally {
                setIsPending(false);
            }
        };
        load();
    }, []);

    const handleSelectChange = (value, key) => {
        if (key === 'Additional_Tool_Erp_Id_1') {
            const selected = additionOptions.find(item => item.Erp_Id === value);
            console.log('Selected Outer 1:', selected); // Debug
            form.setFieldsValue({
                Name_Erp_Additional_Tool_1: selected ? selected.Name_Erp : ''
            });
        } else if (key === 'Additional_Tool_Erp_Id_2') {
            const selected = additionOptions.find(item => item.Erp_Id === value);
            console.log('Selected Outer 2:', selected); // Debug
            form.setFieldsValue({
                Name_Erp_Additional_Tool_2: selected ? selected.Name_Erp : ''
            });
        } else if (key === 'Additional_Tool_Erp_Id_3') {
            const selected = additionOptions.find(item => item.Erp_Id === value);
            console.log('Selected Outer 3:', selected); // Debug
            form.setFieldsValue({
                Name_Erp_Additional_Tool_3: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Attach_Paper_Erp_Id_1') {
            const selected = additionOptions.find(item => item.Erp_Id === value);
            form.setFieldsValue({
                Name_Attach_Paper_1: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Attach_Paper_Erp_Id_2') {
            const selected = additionOptions.find(item => item.Erp_Id === value);
            form.setFieldsValue({
                Name_Attach_Paper_2: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Attach_Paper_Erp_Id_3') {
            const selected = additionOptions.find(item => item.Erp_Id === value);
            form.setFieldsValue({
                Name_Attach_Paper_3: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Attach_Paper_Erp_Id_4') {
            const selected = additionOptions.find(item => item.Erp_Id === value);
            form.setFieldsValue({
                Name_Attach_Paper_4: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Sticker_Erp_Id_1') {
            const selected = stickerOptions.find(item => item.Erp_Id === value);
            form.setFieldsValue({
                Sticker_Name_1: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Sticker_Erp_Id_2') {
            const selected = stickerOptions.find(item => item.Erp_Id === value);
            form.setFieldsValue({
                Sticker_Name_2: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Sticker_Erp_Id_3') {
            const selected = stickerOptions.find(item => item.Erp_Id === value);
            form.setFieldsValue({
                Sticker_Name_3: selected ? selected.Name_Erp : ''
            });
        }
    };
    


    return (
        <div className="container-fluid">
            <h2>แบบฟอร์มบันทึก Product Spec</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                // initialValues={Object.fromEntries(attributes.map(attr => [attr.name, '']))}
                initialValues={{
                    Check_Status: "Wait"

                }}
            >
                {/* <div className="row">
                    {attributes.map((attr, index) => (
                        <div key={attr.name} className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                            {attr.name === 'Status' ? (
                                <Form.Item
                                    label={attr.label}
                                    name={attr.name}
                                    rules={[{ required: true, message: `กรุณาเลือก ${attr.label}` }]}
                                >
                                    <Select options={fetchStatus} />
                                </Form.Item>
                            ) : attr.name === 'Slot' ? (
                                <Form.Item
                                label={attr.label}
                                name={attr.name}
                                rules={[{ required: true, message: `กรุณาเลือก ${attr.label}` }]}
                                >
                                    <Select options={fetchStatusslot} />
                                </Form.Item>
                            ): attr.name === 'Chamfer' ? (
                                <Form.Item
                                label={attr.label}
                                name={attr.name}
                                rules={[{ required: true, message: `กรุณาเลือก ${attr.label}` }]}
                                >
                                    <Select options={fetchStatuschamfer} />
                                </Form.Item> 
                            )
                            : attr.name === 'Color_Id' ? (
                                <Form.Item
                                label={attr.label}
                                name={attr.name}
                                rules={[{ required: true, message: `กรุณาเลือก ${attr.label}` }]}
                                >
                                    <Select options={fetchStatuscolorid} />
                                </Form.Item> 
                            )
                            : attr.name === 'Scoarching_Coating_Id' ? (
                                <Form.Item
                                label={attr.label}
                                name={attr.name}
                                rules={[{ required: true, message: `กรุณาเลือก ${attr.label}` }]}
                                >
                                    <Select options={fetchStatuscoatingscorching} />
                                </Form.Item> 
                            )
                            : attr.name === 'Additional_Tool_Erp_Id_1' ? (
                                <Form.Item
                                label={attr.label}
                                name={attr.name}
                                rules={[{ required: true, message: `กรุณาเลือก ${attr.label}` }]}
                                >
                                    <Select
                                            showSearch
                                            placeholder={`เลือก ${attr.label}`}
                                            onChange={(value) => handleSelectChange(value, attr.name)}
                                        >

                                            <Option value="-">-</Option>
                                            {(additionOptions).map((item) => (
                                                <Option key={item.Rm_Pk_Id} value={item.Erp_Id}>
                                                    {item.Erp_Id}
                                                </Option>
                                            ))}
                                    </Select>
                                </Form.Item> 
                            )
                            : attr.name === 'Additional_Tool_Erp_Id_2' ? (
                                <Form.Item
                                label={attr.label}
                                name={attr.name}
                                rules={[{ required: true, message: `กรุณาเลือก ${attr.label}` }]}
                                >
                                    <Select
                                            showSearch
                                            placeholder={`เลือก ${attr.label}`}
                                            onChange={(value) => handleSelectChange(value, attr.name)}
                                        >
                                            <Option value="-">-</Option>
                                            {(additionOptions).map((item) => (
                                                <Option key={item.Rm_Pk_Id} value={item.Erp_Id}>
                                                    {item.Erp_Id}
                                                </Option>
                                            ))}
                                        </Select>
                                </Form.Item> 
                            )
                            : attr.name === 'Additional_Tool_Erp_Id_3' ? (
                                <Form.Item
                                label={attr.label}
                                name={attr.name}
                                rules={[{ required: true, message: `กรุณาเลือก ${attr.label}` }]}
                                >
                                    <Select
                                            showSearch

                                            placeholder={`เลือก ${attr.label}`}
                                            onChange={(value) => handleSelectChange(value, attr.name)}
                                        >
                                            <Option value="-">-</Option>
                                            {(additionOptions).map((item) => (
                                                <Option key={item.Erp_Id} value={item.Erp_Id}>
                                                    {item.Erp_Id}
                                                </Option>
                                            ))}
                                        </Select>
                                </Form.Item> 
                            )
                            : attr.name === 'Attach_Paper_Erp_Id_1' ? (
                                <Form.Item
                                label={attr.label}
                                name={attr.name}
                                rules={[{ required: true, message: `กรุณาเลือก ${attr.label}` }]}
                                >
                                    <Select
                                            showSearch
                                            placeholder={`เลือก ${attr.label}`}
                                            onChange={(value) => handleSelectChange(value, attr.name)}
                                        >
                                            <Option value="-">-</Option>
                                            {(additionOptions).map((item) => (
                                                <Option key={item.Erp_Id} value={item.Erp_Id}>
                                                    {item.Erp_Id}
                                                </Option>
                                            ))}
                                        </Select>
                                </Form.Item> 
                            )
                            : attr.name === 'Attach_Paper_Erp_Id_2' ? (
                                <Form.Item
                                label={attr.label}
                                name={attr.name}
                                rules={[{ required: true, message: `กรุณาเลือก ${attr.label}` }]}
                                >
                                    <Select
                                            showSearch
                                            placeholder={`เลือก ${attr.label}`}
                                            onChange={(value) => handleSelectChange(value, attr.name)}
                                        >
                                            <Option value="-">-</Option>
                                            {(additionOptions).map((item) => (
                                                <Option key={item.Erp_Id} value={item.Erp_Id}>
                                                    {item.Erp_Id}
                                                </Option>
                                            ))}
                                        </Select>
                                </Form.Item> 
                            )
                            : attr.name === 'Attach_Paper_Erp_Id_3' ? (
                                <Form.Item
                                label={attr.label}
                                name={attr.name}
                                rules={[{ required: true, message: `กรุณาเลือก ${attr.label}` }]}
                                >
                                    <Select
                                            showSearch
                                            placeholder={`เลือก ${attr.label}`}
                                            onChange={(value) => handleSelectChange(value, attr.name)}
                                        >
                                            <Option value="-">-</Option>
                                            {(additionOptions).map((item) => (
                                                <Option key={item.Erp_Id} value={item.Erp_Id}>
                                                    {item.Erp_Id}
                                                </Option>
                                            ))}
                                        </Select>
                                </Form.Item> 
                            )
                            : attr.name === 'Attach_Paper_Erp_Id_4' ? (
                                <Form.Item
                                label={attr.label}
                                name={attr.name}
                                rules={[{ required: true, message: `กรุณาเลือก ${attr.label}` }]}
                                >
                                    <Select
                                            showSearch
                                            placeholder={`เลือก ${attr.label}`}
                                            onChange={(value) => handleSelectChange(value, attr.name)}
                                        >
                                            <Option value="-">-</Option>
                                            {(additionOptions).map((item) => (
                                                <Option key={item.Erp_Id} value={item.Erp_Id}>
                                                    {item.Erp_Id}
                                                </Option>
                                            ))}
                                        </Select>
                                </Form.Item> 
                            )
                            : attr.name === 'Sticker_Erp_Id_1' ? (
                                <Form.Item
                                label={attr.label}
                                name={attr.name}
                                rules={[{ required: true, message: `กรุณาเลือก ${attr.label}` }]}
                                >
                                    <Select
                                            showSearch
                                            placeholder={`เลือก ${attr.label}`}
                                            onChange={(value) => handleSelectChange(value, attr.name)}
                                        >
                                            <Option value="-">-</Option>
                                            {(stickerOptions).map((item) => (
                                                <Option key={item.Erp_Id} value={item.Erp_Id}>
                                                    {item.Erp_Id}
                                                </Option>
                                            ))}
                                        </Select>
                                </Form.Item> 
                            )
                            : attr.name === 'Sticker_Erp_Id_2' ? (
                                <Form.Item
                                label={attr.label}
                                name={attr.name}
                                rules={[{ required: true, message: `กรุณาเลือก ${attr.label}` }]}
                                >
                                    <Select
                                            showSearch
                                            placeholder={`เลือก ${attr.label}`}
                                            onChange={(value) => handleSelectChange(value, attr.name)}
                                        >
                                            <Option value="-">-</Option>
                                            {(stickerOptions).map((item) => (
                                                <Option key={item.Erp_Id} value={item.Erp_Id}>
                                                    {item.Erp_Id}
                                                </Option>
                                            ))}
                                        </Select>
                                </Form.Item> 
                            )
                            : attr.name === 'Sticker_Erp_Id_3' ? (
                                <Form.Item
                                label={attr.label}
                                name={attr.name}
                                rules={[{ required: true, message: `กรุณาเลือก ${attr.label}` }]}
                                >
                                    <Select
                                            showSearch
                                            placeholder={`เลือก ${attr.label}`}
                                            onChange={(value) => handleSelectChange(value, attr.name)}
                                        >
                                            <Option value="-">-</Option>
                                            {(stickerOptions).map((item) => (
                                                <Option key={item.Erp_Id} value={item.Erp_Id}>
                                                    {item.Erp_Id}
                                                </Option>
                                            ))}
                                        </Select>
                                </Form.Item> 
                            )
                            : 
                            (
                                <Form.Item
                                    label={attr.label}
                                    name={attr.name}
                                    rules={[{ required: true, message: `กรุณากรอก ${attr.label}` }]}
                                >
                                    <Input />
                                </Form.Item>
                            )}
                        </div>
                    ))}
                </div> */}

                <div className="row">
                    {['Customer_Name_Product_Spec', 'Customer_Code','Sale_Code', 'Product_Spec_Id', 'Chem_Formular', 'Formula_Under_Layer', 'Coating', 'Scoarching', 'Scoarching_Coating_Id', 'Shim', 'Slot', 'Chamfer','Color', 'Color_Id', 'Status', 'Check_Status'].map((key) => (
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
                                    <Select options={fetchcheckstatus} placeholder={`เลือก ${columnNameLabels[key]}`} disabled/>
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

export default CreateProductSpec;
