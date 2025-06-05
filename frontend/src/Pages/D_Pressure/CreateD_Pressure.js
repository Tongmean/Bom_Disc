import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createD_Pressureapi } from '../../Ultility/D_Pressure';
import { fetchsellectD_Moldmachines, fetchsellectD_Weights, fetchsellectbyD_Weights,fetchsellectbyD_moldmachine, } from '../../Ultility/D_Sellect';
const { Option } = Select;

const CreateD_Pressure = () => {
    const [form] = Form.useForm(); // Initialize Form instance
    const [isPending, setIsPending] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const [moldmachineOption, setMoldmachineoption] = useState([]);
    const [dweightOption, setDweightoption] = useState([]);
    const [holecold, setCold] = useState(0);
    const [holehot, setHot] = useState(0);
    const [pressurecold, setPressurecold] = useState(0);
    const [pressurehot, setPressurehot] = useState(0);
    const [area, setArea] = useState(0);
    const [diameterhot, setDiameterhot] = useState(0);
    const [diameterhcold, setDimetercold] = useState(0);
    // const [sgvalue, setSgvalue] = useState(0);

    const fields = [
        { headerName: 'Data Sheet No. (แรงดัน)', field: 'Data_Sheet_No_Pressure', pinned: 'left' },
        { headerName: 'Data Sheet No. (น้ำหนัก).', field: 'Data_Sheet_No' },

        { headerName: 'Mold-Machine-พิมพ์เย็น', field: 'Mold_Machine_Cold_Code' },
        { headerName: 'ชิ้นต่อพิมพ์ (พิมพ์เย็น)', field: 'Pcs_Per_Mold_Cold' },
        { headerName: 'แรงดันต่อเครื่อง (พิมพ์เย็น)', field: 'Presure_Cold' },

        { headerName: 'Mold-Machine-พิมพ์ร้อน', field: 'Mold_Machine_Cold_Hot' },
        { headerName: 'ชิ้นต่อพิมพ์ (พิมพ์ร้อน)', field: 'Pcs_Per_Mold_Hot' },
        { headerName: 'แรงดันต่อเครื่อง (พิมพ์ร้อน)', field: 'Presure_Hot' },
    ]
    //Dropdown Option
    useEffect(() => {
        const fetchsellectD = async () => {
            try {
                const moldmachinedata = (await fetchsellectD_Moldmachines()).data; // Fetch data by ID
                setMoldmachineoption(moldmachinedata);
                // console.log('moldmachinedata',moldmachinedata)
                const dweightdata = (await fetchsellectD_Weights()).data; // Fetch data by ID
                setDweightoption(dweightdata);
                
                

            } catch (error) {
                setLoading(false);
                console.error('Error fetching data:', error); 
                showNotification('Failed to load data', 'error');
            }
        };
        fetchsellectD();
    }, []);
    // useEffect(() => {
    //     let Area = parseFloat(area)/100;
    //     let result = ((parseFloat(pressurecold)*parseFloat(Area)*parseFloat(holecold))/(3.14 * (parseFloat(holecold)*2.54)*(parseFloat(holecold)*2.54))) * 4 *14.23
    //     console.log("result", result);
    //     // form.setFieldsValue({ Weight_F: result.toFixed(2) });
    // }, [holecold, pressurecold,diameterhcold,area]);
    useEffect(() => {
        const Area = parseFloat(area) / 100;
        const Diameter = parseFloat(diameterhcold) * 2.54; // convert cm to inches
        const pressure = parseFloat(pressurecold);
    
        const denominator = Math.PI * Diameter * Diameter;
        const numerator = pressure * Area * parseFloat(holecold);
    
        const result = (numerator / denominator) * 4 * 14.23;
        if(result){
            form.setFieldsValue({ Presure_Cold: result.toFixed(2) });
        }
        // console.log("result", result);
        // console.log("Area", Area);
        // console.log("Diameter", Diameter);
        // console.log("pressure", pressure);
        // console.log("holecold", holecold);
    
        // Uncomment if you want to update the form:
        // form.setFieldsValue({ Weight_F: result.toFixed(2) });
    }, [holecold, pressurecold, area, diameterhcold]); // Removed diameterhcold if unused
    useEffect(() => {
        const Area = parseFloat(area) / 100;
        const Diameter = parseFloat(diameterhot) * 2.54; // convert cm to inches
        const pressure = parseFloat(pressurehot);
    
        const denominator = Math.PI * Diameter * Diameter;
        const numerator = pressure * Area * parseFloat(holehot);
    
        const result = (numerator / denominator) * 4 * 14.23;
        if(result){
            form.setFieldsValue({ Presure_Hot: result.toFixed(2) });
        }
        // console.log("result", result);
        // console.log("Area", Area);
        // console.log("Diameter", Diameter);
        // console.log("pressure", pressure);
        // console.log("holecold", holecold);
    
        // Uncomment if you want to update the form:
        // form.setFieldsValue({ Weight_F: result.toFixed(2) });
    }, [holehot, pressurehot, area, diameterhot]); // Removed diameterhcold if unused
    

    const handleFieldsChange = () => {
        const values = form.getFieldsValue(["Data_Sheet_No", "Mold_Machine_Cold_Code", "Mold_Machine_Cold_Hot"]);
        const generateddatasheet = `${(values.Data_Sheet_No || '').split("-").slice(0, 2).join("-")}-${values.Mold_Machine_Cold_Code || ''}-${values.Mold_Machine_Cold_Hot || ''}`;
        form.setFieldsValue({ Data_Sheet_No_Pressure: generateddatasheet });
        console.log("generateddatasheet", generateddatasheet);
        // setPressurecold(values.Pcs_Per_Mold_Cold);
        // setPressurehot(values.Pcs_Per_Mold_Hot);
        // console.log('values.Presure_Hot',values.Pcs_Per_Mold_Hot)
    };


    const handleSubmit = async (values) => {
        setIsPending(true);

        const Data = { ...values, CreateBy: '-' }; // Merge form values with CreateBy

        try {
            const result = await createD_Pressureapi(Data);
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

    const handleholecoldChange = async (moldmachine) =>{
    //   console.log('partno',partno)
      try {
        const result = await fetchsellectbyD_moldmachine({moldmachine:moldmachine})
        const Hole_Active_Quantity = result.data[0].Hole_Active_Quantity;
        const Diameter = result.data[0].Diameter;
        setDimetercold(Diameter);
        if(result){
            form.setFieldsValue({ Pcs_Per_Mold_Cold: Hole_Active_Quantity });
            setCold(Hole_Active_Quantity);
            console.log('Diameter',Diameter)
        }
        // setVolumne(VolumnePartno);
        // console.log('result', result)
      } catch (error) {
        showNotification('Failed to fetch weight sum', 'warning');
      }
    }
    const handleholehotChange = async (moldmachine) =>{
    //   console.log('partno',partno)
      try {
        const result = await fetchsellectbyD_moldmachine({moldmachine:moldmachine})
        console.log('moldmachine',result)
        const Hole_Active_Quantity = result.data[0].Hole_Active_Quantity;
        const Diameter = parseFloat(result.data[0].Diameter);
        setDiameterhot(Diameter);
        if(result){
            form.setFieldsValue({ Pcs_Per_Mold_Hot: Hole_Active_Quantity });
            setHot(Hole_Active_Quantity);
            // setDiameterhot(Diameter)
            console.log('Diameter',Diameter)


        }
        // setVolumne(VolumnePartno);
        console.log('result', result)
      } catch (error) {
        showNotification('Failed to fetch weight sum', 'warning');
      }
    }
    const handledweightChange = async (dweight) =>{
    //   console.log('chemgrade',chemgrade)
      try {
        const result = await fetchsellectbyD_Weights({dweight:dweight})
        console.log('result', result)
        console.log('dweight', dweight)
        if(result){
            const Pressure_Cold = result.data[0].Pressure_Cold;
            const Pressure_Hot = result.data[0].Pressure_Hot;
            const Area = result.data[0].Area;
            console.log('Area', Area);
            let cleanedArea = Area.replace(/,/g, ''); // "5115.12"
            setArea(parseFloat(cleanedArea)); // 5115.12
            // setArea(Area);
            setPressurecold(Pressure_Cold);
            setPressurehot(Pressure_Hot);
        }
        

        // setSgvalue(SG_Value);
        // console.log('SG_Value', SG_Value)
      } catch (error) {
        showNotification('Failed to fetch weight sum', 'warning');
      }
    }
    const handlechangePcs_Per_Mold_Cold = (event) => {
        const value = event.target.value;
        console.log('pcs_per_mold:', value); // to verify
        if(value){
            setCold(value)
        }
        // Do something with the value
    };
    const handlechangePcs_Per_Mold_Hot = (event) => {
        const value = event.target.value;
        console.log('pcs_per_mold:', value); // to verify
        if(value){
            setHot(value)
        }
        // Do something with the value
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
            <h2>แบบฟอร์มบันทึกข้อมูล Data-Sheet (แรงดัน)</h2>
            <Form
                form={form} // Associate the form instance with the Form component
                layout="vertical"
                onFinish={handleSubmit}
                onValuesChange={handleFieldsChange}
                initialValues={{
                    // Data_Sheet_No: '',
                    // Compact_No: '',
                    // Formulation: '',
                    // Chem_Grade: '',
                    // Mold_Code_Cold: '',
                    // Mold_Code_Hot: '',
                    // Weight_F: '',
                    // Weight_U: '',
                    // Chem_Grade_U:''
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
                                    field.field === 'Data_Sheet_No' ? (
                                        <Select
                                            loading={loading}
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                            onChange={handledweightChange}
                                        >
                                            {dweightOption.map((status) => (
                                                <Option key={status.Data_Sheet_No} value={status.Data_Sheet_No}>
                                                    {status.Data_Sheet_No}
                                                </Option>
                                            ))}
                                        </Select>
                                    )
                                    : field.field === 'Mold_Machine_Cold_Code' ? (
                                        <Select
                                            loading={loading}
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                            onChange={handleholecoldChange}
                                        >
                                            {moldmachineOption.map((status) => (
                                                <Option key={status.Mold_Machine_Code} value={status.Mold_Machine_Code}>
                                                    {status.Mold_Machine_Code}
                                                </Option>
                                            ))}
                                        </Select>
                                    )
                                    : field.field === 'Pcs_Per_Mold_Cold' ? (
                                        <Input type="number" onChange={handlechangePcs_Per_Mold_Cold}/>
                                    )
                                    : field.field === 'Presure_Cold' ? (
                                        <Input />
                                    )
                                    :
                                     field.field === 'Mold_Machine_Cold_Hot' ? (
                                        <Select
                                            loading={loading}
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                            onChange={handleholehotChange}
                                        >
                                            {moldmachineOption.map((status) => (
                                                <Option key={status.Mold_Machine_Code} value={status.Mold_Machine_Code}>
                                                    {status.Mold_Machine_Code}
                                                </Option>
                                            ))}
                                        </Select>
                                    )
                                    : field.field === 'Pcs_Per_Mold_Hot' ? (
                                        <Input type="number" onChange={handlechangePcs_Per_Mold_Hot}/>
                                    )
                                    : field.field === 'Presure_Hot' ? (
                                        <Input />
                                    )
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
                            <Button type="default" className="me-2" onClick={() => navigate('/dpressure')}>
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

export default CreateD_Pressure;
