import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { CreateDatasheetapi } from '../../Ultility/Datasheet';
// import { fetchStatus } from '../../Ultility/ApiSetup/staticData';
import { fetchStatus, fetchcheckstatus  } from '../../Ultility/ApiSetup/staticData';


const CreateDatasheet = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    // Column Name Labels Mapping
    // const columnNameLabels = {
    //     Data_Sheet_No: "Data Sheet No.",
    //     Compact_No: "Compact No.",
    //     Grade_Chem: "เกรดเคมี.",
    //     Weight_F1: "น้ำหนักเคมี F1",
    //     Weight_F2: "น้ำหนักเคมี F2",
    //     Underlayer_Grade_Chem: "เกรดเคมี Underlayer",
    //     Weight_U1: "น้ำหนักเคมี U1",
    //     Weight_U2: "น้ำหนักเคมี U2",
    //     Formular: "สูตร",
    //     Status: "Status",
    // };
    const fields = [
        { headerName: 'Data Sheet No.', field: 'Data_Sheet_No'},
        { headerName: 'Compact No.', field: 'Compact_No' },
        { headerName: 'เกรดเคมี.', field: 'Grade_Chem' },
        { headerName: 'น้ำหนักเคมี F1', field: 'Weight_F1' },
        { headerName: 'น้ำหนักเคมี F2', field: 'Weight_F2' },
        { headerName: 'เกรดเคมี Underlayer', field: 'Underlayer_Grade_Chem' },
        { headerName: 'น้ำหนักเคมี U1', field: 'Weight_U1' },
        { headerName: 'น้ำหนักเคมี U2', field: 'Weight_U2' },
        { headerName: 'สูตร', field: 'Formular' },

        { headerName: 'แม่พิมพ์เย็น', field: 'Mold_Cold' },
        { headerName: 'เครื่องจักรพิมพ์เย็น', field: 'Machine_Cold' },
        { headerName: 'แรงดันพิมพ์เย็น', field: 'Presure_Cold' },
        { headerName: 'ชิ้นต่อพิมพ์ (พิมพ์เย็น)', field: 'Piece_Per_Mold_Cold' },
        { headerName: 'แม่พิมพ์ร้อน', field: 'Mold_Hot' },
        { headerName: 'อุณหภูมิบน', field: 'Temperature_Upper' },
        { headerName: 'อุณหภูมิล้าง', field: 'Temperature_Lower' },
        { headerName: 'เครื่องจักรพิมพ์ร้อน', field: 'Machine_Hot' },
        { headerName: 'แรงดันพิมพ์ร้อน', field: 'Presure_Hot' },
        { headerName: 'ชิ้นต่อพิมพ์ (พิมพ์ร้อน)', field: 'Piece_Per_Mold_Hot' },

        { headerName: 'Status', field: 'Status' },
        { headerName: 'Check Status', field: 'Check_Status' },
        { headerName: 'Remark', field: 'Remark' }
    ]

    const handleSubmit = async (values) => {
        setIsPending(true);

        const datasheetData = { ...values, CreateBy: '-' }; // Merge form values with CreateBy

        try {
            const result = await CreateDatasheetapi(datasheetData);
            showNotification(result.msg, 'success');
            // console.log('Datasheet:', datasheetData);
            // console.log('API Result:', result);

            form.resetFields(); // Clear the form fields upon success
            // Optionally navigate to another route
            // setTimeout(() => navigate('/datasheet'), 2000);
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
            <h2>แบบฟอร์มบันทึกข้อมูล Datasheet</h2>
            <Form
                form={form} // Associate the form instance with the Form component
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    Data_Sheet_No: '',
                    Compact_No: '',
                    Grade_Chem: '',
                    Weight_F1: '',
                    Weight_F2: '',
                    Underlayer_Grade_Chem: '',
                    Weight_U1: '',
                    Weight_U2: '',
                    Formular: '',
                    Status: '',
                    Check_Status: "Wait",
                    Remark: "-",
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
                                {field.field === 'Status' ? (
                                    <Select>
                                        <Select.Option options={fetchStatus}></Select.Option>
                                    </Select>
                                ) 
                                : 
                                field.field === 'Check_Status' ? (
                                    <Select disabled>
                                        <Select.Option options={fetchcheckstatus}></Select.Option>
                                    </Select>
                                ) 
                                :  
                                (
                                    <Input />
                                )}
                            </Form.Item>
                        </div>
                    ))}

                    {/* <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Data_Sheet_No}
                            name="Data_Sheet_No"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Data_Sheet_No}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Compact_No}
                            name="Compact_No"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Compact_No}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Grade_Chem}
                            name="Grade_Chem"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Grade_Chem}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Weight_F1}
                            name="Weight_F1"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Weight_F1}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Weight_F2}
                            name="Weight_F2"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Weight_F2}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Underlayer_Grade_Chem}
                            name="Underlayer_Grade_Chem"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Underlayer_Grade_Chem}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Weight_U1}
                            name="Weight_U1"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Weight_U1}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Weight_U2}
                            name="Weight_U2"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Weight_U2}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Formular}
                            name="Formular"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Formular}` }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <Form.Item
                            label={columnNameLabels.Status}
                            name="Status"
                            rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels.Status}` }]}
                        >
                            <Select placeholder="กรุณาเลือก Status">
                                <Select.Option options={fetchStatus}></Select.Option>
                            </Select>
                        </Form.Item>
                    </div> */}

                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/datasheet')}>
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

export default CreateDatasheet;
