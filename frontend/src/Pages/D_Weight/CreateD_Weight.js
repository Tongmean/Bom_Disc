import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createD_Weightapi } from '../../Ultility/D_Weight';
import { fetchsellectD_Chemgrades, fetchsellectD_Molds, fetchsellectD_Partnos, fetchsellectD_Volunmebypartno, fetchsellectD_SG_ValuebyChemgrade } from '../../Ultility/D_Sellect';
import { ignore } from 'antd/es/theme/useToken';
const { Option } = Select;

const CreateD_Weight = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const [moldOption, setMoldoption] = useState([]);
    const [partnoOption, setPartnooption] = useState([]);
    const [chemgradeOption, setChemgradeoption] = useState([]);
    const [volumne, setVolumne] = useState(0);
    const [area, setArea] = useState(0);
    const [thickness, setThickness] = useState(0);
    const [sgvalue, setSgvalue] = useState(0);
    const [gradeU, setGradeU] = useState(0);

    const fields = [
        { headerName: 'Data Sheet No. (Weight)', field: 'Data_Sheet_No' },
        { headerName: 'Compact No.', field: 'Compact_No' },
        { headerName: 'สูตร', field: 'Formulation' },
        { headerName: 'รหัสแม่พิมพ์เย็น', field: 'Mold_Code_Cold' },
        { headerName: 'รหัสแม่พิมพ์ร้อน', field: 'Mold_Code_Hot' },
        { headerName: 'เกรดเกรดเคมี', field: 'Chem_Grade' },
        { headerName: 'น้ำหนักเคมี F', field: 'Weight_F' },
        { headerName: 'เกรดเคมี Under layer', field: 'Chem_Grade_U' },
        { headerName: 'น้ำหนักเคมี U', field: 'Weight_U' },
        
    ]
    //Dropdown Option
    useEffect(() => {
        const fetchsellectD = async () => {
            try {
                const molddata = (await fetchsellectD_Molds()).data; // Fetch data by ID
                setMoldoption(molddata);
                // console.log('molddata',molddata)
                const chemgradedata = (await fetchsellectD_Chemgrades()).data; // Fetch data by ID
                setChemgradeoption(chemgradedata);
                const partnodata = (await fetchsellectD_Partnos()).data; // Fetch data by ID
                setPartnooption(partnodata);
                

            } catch (error) {
                setLoading(false);
                console.log('Error fetching data:', error); 
                showNotification(error.message, 'warning');
            }
        };
        fetchsellectD();
    }, []);

    // useEffect(() => {
    //     let volumneintoint = parseFloat(volumne);
    //     let sgvalueintoint = parseFloat(sgvalue);
    //     let areaintoint = parseFloat(area);
    //     let thicknessintoint = parseFloat(thickness);
    //     let thicknessintointgradeu = parseFloat(gradeU);
    //     let resultweightF = areaintoint * (thicknessintoint - thicknessintointgradeu) * sgvalueintoint * 1.10;
    //     console.log("resultweightF", resultweightF);
    //     form.setFieldsValue({ Weight_F: resultweightF.toFixed(2) });

    // }, [volumne, sgvalue, area, thickness, gradeU]);
    useEffect(() => {
        let volumneintoint = parseFloat(volumne);
        let sgvalueintoint = parseFloat(sgvalue);
        let areaintoint = parseFloat(area);
        let thicknessintoint = parseFloat(thickness)/10;
        let thicknessintointgradeu = parseFloat(gradeU);
    
        console.log("Parsed values:");
        console.log("volume:", volumneintoint);
        console.log("sgvalue:", sgvalueintoint);
        console.log("area:", areaintoint);
        console.log("thickness:", thicknessintoint);
        console.log("gradeU:", thicknessintointgradeu);
    
        if (
            isNaN(areaintoint) ||
            isNaN(thicknessintoint) ||
            isNaN(thicknessintointgradeu) ||
            isNaN(sgvalueintoint)
        ) {
            console.warn("One or more inputs are NaN, skipping weight calculation");
            return;
        }
    
        let resultweightF = areaintoint * (thicknessintoint - thicknessintointgradeu) * sgvalueintoint * 1.10;
        // let resultweightFnot = areaintoint * (thicknessintoint - thicknessintointgradeu) * sgvalueintoint;
        let resultweightU = areaintoint * thicknessintointgradeu * sgvalueintoint * 1.10;
        console.log("resultweightF", resultweightF);
        console.log("resultweightU", resultweightU);
        if(resultweightU === 0){
            form.setFieldsValue({ Weight_F: resultweightF.toFixed(2), Weight_U: '-'});
        }else{
            form.setFieldsValue({ Weight_F: resultweightF.toFixed(2), Weight_U: resultweightU.toFixed(2)});
        }
    
    }, [volumne, sgvalue, area, thickness, gradeU]);
    

    const handleFieldsChange = () => {
        const values = form.getFieldsValue(["Compact_No", "Chem_Grade", "Mold_Code_Cold", "Mold_Code_Hot"]);
        const generateddatasheet = `D${values.Compact_No || ''}-${values.Chem_Grade || ''}-${values.Mold_Code_Cold || ''}-${values.Mold_Code_Hot || ''}`;
        form.setFieldsValue({ Data_Sheet_No: generateddatasheet });
        console.log("generateddatasheet", generateddatasheet);
        console.log("volumne", volumne);
        console.log("sgvalue", sgvalue);
    };


    const handleSubmit = async (values) => {
        setIsPending(true);

        const machineData = { ...values, CreateBy: '-' }; // Merge form values with CreateBy

        try {
            const result = await createD_Weightapi(machineData);
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

    const handlecompactnoChange = async (partno) =>{
    //   console.log('partno',partno)
      try {
        const result = await fetchsellectD_Volunmebypartno(partno)
        const VolumnePartno = result.data[0].volumne;
        const AreaPartno = result.data[0].Max_Area_F_div_100;
        const ThicknessPartno = result.data[0].max_thick_f;
        setVolumne(VolumnePartno);
        setArea(AreaPartno);
        setThickness(ThicknessPartno);
        console.log('VolumnePartno', VolumnePartno)
        console.log('AreaPartno', AreaPartno)
        console.log('ThicknessPartno', ThicknessPartno)
      } catch (error) {
        showNotification(error.message, 'warning');
      }
    }
    const handlechemcodeChange = async (chemgrade) =>{
    //   console.log('chemgrade',chemgrade)
      try {
        const result = await fetchsellectD_SG_ValuebyChemgrade(chemgrade)
        const SG_Value = result.data[0].SG_Value;
        setSgvalue(SG_Value);
        console.log('SG_Value', SG_Value)
      } catch (error) {
        showNotification(error.message, 'warning');
      }
    }
    const handleChem_Grade_UChange = async (grade)=>{
        if(grade === '-'){
            setGradeU(0)
        }else {
            setGradeU(0.2)
        }
    }

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
            <h2>แบบฟอร์มบันทึกข้อมูล Data-Sheet (น้ำหนัก)</h2>
            <Form
                form={form} // Associate the form instance with the Form component
                layout="vertical"
                onFinish={handleSubmit}
                onValuesChange={handleFieldsChange}
                initialValues={{
                    Data_Sheet_No: '',
                    Compact_No: '',
                    Formulation: '',
                    Chem_Grade: '',
                    Mold_Code_Cold: '',
                    Mold_Code_Hot: '',
                    Weight_F: '',
                    Weight_U: '',
                    Chem_Grade_U:'-'
                }}
            >
                <div className="row">
                    {fields.map((field) => (
                        <div className="col-xl-4 col-lg-6 col-md-12" key={field.field}>
                            <Form.Item
                                label={field.headerName}
                                name={field.field}
                                rules={[{ required: true, message: `กรุณากรอก ${field.headerName}` }]}
                            >
                                {
                                    field.field === 'Mold_Code_Cold' ? (
                                        <Select
                                            loading={loading}
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                        >
                                            {moldOption.map((status) => (
                                                <Option key={status.Mold_Code} value={status.Mold_Code}>
                                                    {status.Mold_Code}
                                                </Option>
                                            ))}
                                        </Select>
                                    )
                                    : field.field === 'Mold_Code_Hot' ? (
                                        <Select
                                            loading={loading}
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                        >
                                            {moldOption.map((status) => (
                                                <Option key={status.Mold_Code} value={status.Mold_Code}>
                                                    {status.Mold_Code}
                                                </Option>
                                            ))}
                                        </Select>
                                    )
                                    : field.field === 'Chem_Grade' ? (
                                        <Select
                                            loading={loading}
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                            onChange={handlechemcodeChange}
                                        >
                                            {chemgradeOption.map((status) => (
                                                <Option key={status.Chem_Grade_Code} value={status.Chem_Grade_Code}>
                                                    {status.Chem_Grade_Code}
                                                </Option>
                                            ))}
                                        </Select>
                                    )
                                    : field.field === 'Compact_No' ? (
                                        <Select
                                            loading={loading}
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                            onChange={handlecompactnoChange}
                                        >
                                            {partnoOption.map((status) => (
                                                <Option key={status.Num} value={status.Num}>
                                                    {status.Num}
                                                </Option>
                                            ))}
                                        </Select>
                                    )
                                    : field.field === 'Chem_Grade_U' ? (
                                        <Select
                                            loading={loading}
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                            onChange={handleChem_Grade_UChange}
                                        >
                                            <Option value="-">-</Option>
                                            {chemgradeOption.map((status) => (
                                                <Option key={status.Chem_Grade_Code} value={status.Chem_Grade_Code}>
                                                    {status.Chem_Grade_Code}
                                                </Option>
                                            ))}
                                        </Select>
                                    )
                                    // : field.field === 'Data_Sheet_No' ?
                                    // (
                                    //     <Input value={datasheetid} disabled/>
                                    // )
                                    :
                                    (
                                        <Input />
                                    )
                                }
                            </Form.Item>
                        </div>
                    ))}


                    <div className="col-12">
                        <Form.Item>
                            <Button type="default" className="me-2" onClick={() => navigate('/dweight')}>
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

export default CreateD_Weight;
