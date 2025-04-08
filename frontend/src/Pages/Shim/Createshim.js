import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from '../../Components/Notification';
import { createShim } from '../../Ultility/Shimapi'; // Assuming you have a similar API function
import { fetchStatus } from '../../Ultility/ApiSetup/staticData';
import { fetchmaterialsp } from '../../Ultility/Sellectedbom';
import { fetchmaterialfilterbycompactnoshim, fetchmaterialfiltershim } from '../../Ultility/Bomfilterapi';
import { fetchrmpk } from '../../Ultility/Sellectedbom';

const { Option } = Select;

const CreateShim = () => {
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const [spoptions, setShimoption] = useState([]);
    const [loading, setLoading] = useState(false);
    //Filter
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [numFilter, setNumFilter] = useState([]);
    const [compactnoFilter, setCompactnoFilter] = useState([]);
    //Filter Shim
    const [shimOptionsrm, setShimrmoption] = useState([]);
    //Loading Sp Dropdown
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const Data = await fetchmaterialsp(); 
                setShimoption(Data.data); 

            } catch (error) {
                showNotification('Failed to fetch data', 'warning');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const columnNameLabels = {
        Compact_No_Modify: "Compact No (ปรับ)",
        Part_No: "Part No",
        Erp_Id_SP1: "รหัส Erp SP1",
        Name_SP1: "ชื่อ Erp SP1",
        Id_SP1: "ID SP1",
        Quantity_SP1: "จำนวน SP1",
        Erp_Id_SP2: "รหัส Erp SP2",
        Name_SP2: "ชื่อ Erp SP2",
        Id_SP2: "ID SP2",
        Quantity_SP2: "จำนวน SP2",
        Erp_Id_SP3: "รหัส Erp SP3",
        Name_SP3: "ชื่อ Erp SP3",
        Id_SP3: "ID SP3",
        Quantity_SP3: "จำนวน SP3",
        Status: "Status",
    };

    const handleSubmit = async (values) => {
        setIsPending(true);

        const shimData = { ...values, CreateBy: '-' };

        try {
            const result = await createShim(shimData);
            showNotification(result.msg, 'success');
            console.log('Shim Data:', shimData);
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
    //Filter Component
    useEffect(() => {
        const load = async () => {
            try {
            const Data = (await fetchmaterialfiltershim()).data;
            // console.log('FilterData', Data)
            const Datashim = (await fetchrmpk()).data;
            const additiondata = Datashim.filter(item => item.Group === "Shim");
            setShimrmoption(additiondata)
            // console.log('Datashim', Datashim , additiondata)
            setRowData(Data);
            setFilteredData(Data);
            } catch (err) {
            setError(err.message);
            } finally {
            setLoading(false);
            }
        };
        load();
    }, []);
    // useEffect(() => {
    //     const load = async () => {
    //         setIsPending(true);
    //         try {
    //             const Data = (await fetchrmpk()).data;
    //             const additiondata = Data.filter(item => item.Group === "อุปกรณ์เสริม");
    //             setAdditionoptions(additiondata);
    //             const stickerdata = Data.filter(item => item.Group === "สติ๊กเกอร์");
    //             setStickeroptions(stickerdata);
    //             console.log('additiondata', additiondata);
    //             console.log('stickerdata', stickerdata);
    //         } catch (error) {
    //             showNotification('Failed to fetch data', 'warning');
    //         } finally {
    //             setIsPending(false);
    //         }
    //     };
    //     load();
    // }, []);
    const handleFilterChange = () => {
        const filtered = rowData.filter((item) =>
          (!numFilter.length || numFilter.includes(item.Part_No)) &&
          (!compactnoFilter.length || compactnoFilter.includes(item.Compact_No_Modify)) 
          
        );
        setFilteredData(filtered);
    };
    
    useEffect(handleFilterChange, [compactnoFilter,  numFilter, rowData]);
    
    const clearFilters = () => {
        setCompactnoFilter([]);
        setNumFilter([]);
        
    };
    const HandleFilter = async () => {

        setIsPending(true);
        const Compact_No_Modify_Drawing = { Compact_No_Modify_Drawing: `${compactnoFilter}` }; // Filter payload
        // console.log('Code_Fg', Code_Fg);
    
        try {
            const result = await fetchmaterialfilterbycompactnoshim(Compact_No_Modify_Drawing); // Fetch filtered data
            console.log('result', result);
    
            if (result.data && result.data.length > 0) {
                const initialValues = result.data[0]; // Assuming you use the first result
                console.log('initialValues', initialValues);
    
                // Update form fields with fetched data
                form.setFieldsValue({
                    ...initialValues, // Populate all matched keys
                });
    
                showNotification('Data loaded into the form successfully', 'success');
            } else {
                showNotification('No data found for the selected filter', 'warning');
            }
        } catch (error) {
            showNotification(`Failed to fetch data: ${error.message}`, 'warning');
        } finally {
            setIsPending(false);
        }
    };
    
    const handleClearForm = () => {
        form.resetFields(); // Clears all the form fields
        showNotification('Form values cleared', 'success');
    };
    const handleSelectChange = (value, key) => {
        if (key === 'Erp_Id_SP1') {
            const selected = shimOptionsrm.find(item => item.Erp_Id === value);
            console.log('Selected 1:', selected); // Debug
            form.setFieldsValue({
                Name_SP1: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Erp_Id_SP2') {
            const selected = shimOptionsrm.find(item => item.Erp_Id === value);
            console.log('Selected 2:', selected); // Debug
            form.setFieldsValue({
                Name_SP2: selected ? selected.Name_Erp : ''
            });
        }
        else if (key === 'Erp_Id_SP3') {
            const selected = shimOptionsrm.find(item => item.Erp_Id === value);
            console.log('Selected 3:', selected); // Debug
            form.setFieldsValue({
                Name_SP3: selected ? selected.Name_Erp : ''
            });
        }
    };
    return (
        <div className="container-fluid">
            <div style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '10px' }}>Filters</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>

                    <div style={{ flex: '1 1 45%' }}>
                        <label>Filter by Part No:</label>
                        <Select
                        
                        showSearch
                        placeholder="Select Part No"
                        style={{ width: '100%' }}
                        value={numFilter}
                        onChange={(value) => setNumFilter(value)}
                        >
                        {[...new Set(filteredData.map((item) => item.Part_No))].map((Part_No) => (
                            <Option key={Part_No} value={Part_No}>
                            {Part_No}
                            </Option>
                        ))}
                        </Select>
                    </div>

                    <div style={{ flex: '1 1 45%' }}>
                        <label>Filter by compact no.</label>
                        <Select
                        
                        showSearch
                        placeholder="Select compact no."
                        style={{ width: '100%' }}
                        value={compactnoFilter}
                        onChange={(value) => setCompactnoFilter(value)}
                        >
                        {[...new Set(filteredData.map((item) => item.Compact_No_Modify))].map((Compact_No_Modify) => (
                            <Option key={Compact_No_Modify} value={Compact_No_Modify}>
                            {Compact_No_Modify}
                            </Option>
                        ))}
                        </Select>
                    </div>
                </div>

                <Button type="default" style={{ marginTop: '10px',  marginRight: '10px',backgroundColor: 'blue',color: 'white',}} onClick={HandleFilter}>
                    Filter
                </Button>
                <Button type="default" style={{ marginTop: '10px' }} onClick={clearFilters}>
                    Clear Filters
                </Button>
            </div>
            <h2>แบบฟอร์มบันทึก Shim</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    Compact_No_Modify: '',
                    Part_No: '',
                    Name_SP1: '',
                    Erp_Id_SP1: '',
                    Id_SP1: '',
                    Quantity_SP1: '',
                    Name_SP2: '',
                    Erp_Id_SP2: '',
                    Id_SP2: '',
                    Quantity_SP2: '',
                    Name_SP3: '',
                    Erp_Id_SP3: '',
                    Id_SP3: '',
                    Quantity_SP3: '',
                    Status: '',
                }}
            >
                {/* <div className="row">
                    {Object.entries(columnNameLabels).map(([key, label], index) => (
                        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6" key={index}>
                            <Form.Item
                                label={label}
                                name={key}
                                rules={[{ required: true, message: `กรุณากรอก ${label}` }]}
                            >
                                {key === 'Status' ? (
                                    <Select>
                                        {fetchStatus.map((status) => (
                                            <Option key={status.value} value={status.value}>
                                                {status.label}
                                            </Option>
                                        ))}
                                    </Select>
                                ) 
                                : 
                                key === "Id_SP1" ? (
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                    >
                                        <Option value="-">-</Option>
                                        {spoptions.map((i) => (
                                        <Option key={i.ID} value={i.ID}>
                                            {i.ID}
                                        </Option>
                                        ))}
                                    </Select>
                                ) 
                                : 
                                key === "Id_SP2" ? (
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                    >
                                        <Option value="-">-</Option>
                                            {spoptions.map((i) => (
                                            <Option key={i.ID} value={i.ID}>
                                                {i.ID}
                                        </Option>
                                        ))}
                                    </Select>
                                ) 
                                : 
                                key === "Id_SP3" ? (
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                    >
                                        <Option value="-">-</Option>
                                            {spoptions.map((i) => (
                                            <Option key={i.ID} value={i.ID}>
                                                {i.ID}
                                        </Option>
                                        ))}
                                    </Select>
                                ) 
                                : 
                                key === "Erp_Id_SP1" ? (
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                        onChange={(value) => handleSelectChange(value, key)}
                                    >
                                        <Option value="-">-</Option>
                                            {shimOptionsrm.map((i) => (
                                            <Option key={i.Erp_Id} value={i.Erp_Id}>
                                                {i.Erp_Id}
                                        </Option>
                                        ))}
                                    </Select>
                                ) 
                                : 
                                key === "Erp_Id_SP2" ? (
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                        onChange={(value) => handleSelectChange(value, key)}
                                    >
                                        <Option value="-">-</Option>
                                            {shimOptionsrm.map((i) => (
                                            <Option key={i.Erp_Id} value={i.Erp_Id}>
                                                {i.Erp_Id}
                                        </Option>
                                        ))}
                                    </Select>
                                ) 
                                : 
                                key === "Erp_Id_SP3" ? (
                                    <Select 
                                        placeholder={`เลือก ${label}`} 
                                        loading={loading}
                                        allowClear
                                        showSearch
                                        onChange={(value) => handleSelectChange(value, key)}
                                    >
                                        <Option value="-">-</Option>
                                            {shimOptionsrm.map((i) => (
                                            <Option key={i.Erp_Id} value={i.Erp_Id}>
                                                {i.Erp_Id}
                                        </Option>
                                        ))}
                                    </Select>
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
                            <Button type="default" className="me-2" onClick={() => navigate('/shim')}>
                                Back
                            </Button>
                            <Button type="primary" htmlType="submit" disabled={isPending}>
                                {isPending ? 'Saving...' : 'Save Data'}
                            </Button>
                            <Button type="default" onClick={handleClearForm} style={{ marginLeft: '10px' }}>
                                Clear
                            </Button>
                        </Form.Item>
                    </div>
                </div> */}

                <div className="row">
                    {['Compact_No_Modify', 'Part_No', 'Status'].map((key) => (
                        <div className="col-md-4" key={key}>
                            <Form.Item
                                label={columnNameLabels[key]}
                                name={key}
                                rules={[{ required: true, message: `กรุณากรอก ${columnNameLabels[key]}` }]}
                            >
                                {key === "Status" ? (
                                    <Select options={fetchStatus} placeholder={`เลือก ${columnNameLabels[key]}`} />
                                ) : (
                                    <Input placeholder={`กรอก ${columnNameLabels[key]}`} />
                                )}
                            </Form.Item>
                        </div>
                    ))}
                </div>
                {/* SP1 to SP3 Rows */}
                {[1, 2, 3].map((num) => (
                    <div className="row" key={num}>
                        {['Erp_Id_SP', 'Name_SP', 'Id_SP', 'Quantity_SP'].map((prefix) => {
                            const key = `${prefix}${num}`;
                            return (
                                <div className="col-md-3" key={key}>
                                    <Form.Item
                                        label={columnNameLabels[key]}
                                        name={key}
                                        rules={[{ required: true, message: `กรุณาเลือก ${columnNameLabels[key]}` }]}
                                    >
                                        {key.includes('Name_SP') || key.includes('Quantity_SP')? (
                                            <Input placeholder={`กรอก ${columnNameLabels[key]}`} />
                                        ) : (
                                            <Select
                                                placeholder={`เลือก ${columnNameLabels[key]}`}
                                                loading={loading}
                                                allowClear
                                                showSearch
                                                onChange={(value) => handleSelectChange(value, key)}
                                            >
                                                <Select.Option value="-">-</Select.Option>
                                                {(key.includes('Erp_Id_SP') ? shimOptionsrm : spoptions).map((i) => (
                                                    <Select.Option key={i.ID || i.Erp_Id} value={i.ID || i.Erp_Id}>
                                                        {i.ID || i.Erp_Id}
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

                {/* Action Buttons */}
                <div className="col-12">
                    <Form.Item>
                        <Button type="default" className="me-2" onClick={() => navigate('/drawing')}>
                            Back
                        </Button>
                        <Button type="primary" htmlType="submit" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Save Data'}
                        </Button>
                        <Button type="default" onClick={handleClearForm} style={{ marginLeft: '10px' }}>
                            Clear
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

export default CreateShim;
