import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchDisplaywip} from '../../Ultility/Displayapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import { useNavigate } from 'react-router-dom';
import { Select, Button } from 'antd'; // Import Ant Design components
const { Option } = Select;

const Wipdisplay = () =>{
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null)
    const navigate = useNavigate();
    // Individual filters
    const [filteredData, setFilteredData] = useState([]);
    const [codeFgFilter, setCodeFgFilter] = useState([]);
    const [partNoFilter, setPartNoFilter] = useState([]);
    const [numberFilter, setNumberFilter] = useState([]);

    const columnDefs = [
        { headerName: 'รหัส ERP (Code_Fg)', field: 'Code_Fg' , checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'เบอร์', field: 'Num' },
        { headerName: 'Part No', field: 'Part_No' },
        { headerName: 'WIP1', field: 'WIP1' },
        { headerName: 'จำนวน WIP1', field: 'Quantity_BP1' },
        { headerName: 'WIP2', field: 'WIP2' },
        { headerName: 'จำนวน WIP2', field: 'Quantity_BP2' },
        { headerName: 'WIP3', field: 'WIP3' },
        { headerName: 'จำนวน WIP3', field: 'Quantity_BP3' },
        { headerName: 'WIP4', field: 'WIP4' },
        { headerName: 'จำนวน WIP4', field: 'Quantity_BP4' },
    ];
    //Map to Wip
    const mapToWIPs = (array) => {
        return array.map(item => {
            const pads = [
                { Id_BP: item.Id_BP1, Thickness: item.Thickness_Pad1, Quantity: item.Quantity_BP1 },
                { Id_BP: item.Id_BP2, Thickness: item.Thickness_Pad2, Quantity: item.Quantity_BP2 },
                { Id_BP: item.Id_BP3, Thickness: item.Thickness_Pad3, Quantity: item.Quantity_BP3 },
                { Id_BP: item.Id_BP4, Thickness: item.Thickness_Pad4, Quantity: item.Quantity_BP4 }
            ];
    
            const result = pads.reduce((acc, pad, index) => {
                const padKey = `WIP${index + 1}`;
                if (
                    pad.Thickness === pads[0].Thickness &&
                    pads.every(p => p.Thickness === pad.Thickness)
                ) {
                    acc[padKey] =
                        pad.Thickness === "-" && pad.Id_BP?.includes("BP")
                            ? `${pad.Id_BP}-${item.Grade_Chem}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`
                            : (pad.Thickness === "-" || !pad.Id_BP?.includes("BP"))
                                ? "-"
                                : `${pad.Id_BP}-${item.Grade_Chem}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`;
                } else {
                    acc[padKey] =
                        pad.Thickness === "-" && pad.Id_BP?.includes("BP")
                            ? `${pad.Id_BP}-${item.Grade_Chem}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`
                            : (pad.Thickness === "-" || !pad.Id_BP?.includes("BP"))
                                ? "-"
                                : `${pad.Id_BP}(${pad.Thickness})-${item.Grade_Chem}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`;
                }
                // Add Quantity for each pad
                acc[`Quantity_BP${index + 1}`] = pad.Quantity || "-";
                return acc;
            }, {});
    
            // Include Code_Fg in the result
            return {
                Code_Fg: item.Code_Fg,
                Num: item.Num,
                Part_No: item.Part_No,
                ...result
            };
        });
    };
    

    useEffect(() => {
        const loadpackages = async () => {
          try {
            const Data = (await fetchDisplaywip()).data;
            console.log('Data', Data)
            const WipmappedReult = mapToWIPs(Data);
            console.log('WipmappedReult', WipmappedReult)

            setRowData(WipmappedReult); // Set the users from the API response
            console.log("RowData", rowData)
          } catch (err) {
            setError(err.message); // Set the error message if something goes wrong
          } finally {
            setLoading(false); // Turn off the loading state once the operation is complete
          }
        };
    
        loadpackages();
    }, []);

    const onGridReady = params => {
        setGridApi(params.api);
    };

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        console.log('Selected rows:', selectedRows);
    };
    
    const handleFilterChange = () => {
        const filtered = rowData.filter((item) =>
          (!codeFgFilter.length || codeFgFilter.includes(item.Code_Fg)) &&
          (!partNoFilter.length || partNoFilter.includes(item.Part_No)) &&
          (!numberFilter.length || numberFilter.includes(item.Num))
        );
        setFilteredData(filtered);
      };
    
      useEffect(handleFilterChange, [codeFgFilter,  partNoFilter, numberFilter, rowData]);
    
      const clearFilters = () => {
        setCodeFgFilter([]);
        setPartNoFilter([]);
        setNumberFilter([])
      };

    return (
        <>
            <div style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '10px' }}>Filters</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by Code_Fg (ERP):</label>
                    <Select
                    mode='multiple'
                    showSearch
                    placeholder="Select Code_Fg"
                    style={{ width: '100%' }}
                    value={codeFgFilter}
                    onChange={(value) => setCodeFgFilter(value)}
                    >
                    {[...new Set(
                        rowData.filter((item) =>
                        // (!codeFgFilter.length || codeFgFilter.includes(item.Code_Fg)) &&
                        (!partNoFilter.length || partNoFilter.includes(item.Part_No)) &&
                        (!numberFilter.length || numberFilter.includes(item.Num))
                      )
                        .map((item) => item.Code_Fg))].map((code) => (
                        <Option key={code} value={code}>
                        {code}
                        </Option>
                    ))}
                    </Select>
                </div>
                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by Part No.:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    placeholder="Select Part No."
                    style={{ width: '100%' }}
                    value={partNoFilter}
                    onChange={(value) => setPartNoFilter(value)}
                    >
                    {[...new Set(filteredData.map((item) => item.Part_No))].map((partNo) => (
                        <Option key={partNo} value={partNo}>
                        {partNo}
                        </Option>
                    ))}
                    </Select>
                </div>

                <div style={{ flex: '1 1 30%' }}>
                    <label>Filter by รหัส เบอร์:</label>
                    <Select
                    mode='multiple'
                    showSearch
                    placeholder="Select เบอร์"
                    style={{ width: '100%' }}
                    value={numberFilter}
                    onChange={(value) => setNumberFilter(value)}
                    >
                    {[...new Set(filteredData.map((item) => item.Num))].map((Num) => (
                        <Option key={Num} value={Num}>
                        {Num}
                        </Option>
                    ))}
                    </Select>
                </div>
                
                </div>
                <Button type="default" style={{ marginTop: '10px' }} onClick={clearFilters}>
                    Clear Filters
                </Button>
            </div>
            
            <div>
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename = "งานกึ่ง"/>
                <ClipboardButton gridApi={gridApi} columnDefs={columnDefs} />
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div style={{ color: 'red' }}>{`Error: ${error}`}</div>
            ) : (
                <Tablecomponent
                    columnDefs={columnDefs}
                    rowData={filteredData}
                    onGridReady={onGridReady}
                    onSelectionChanged={onSelectionChanged}
                />
            )}
        </>
    )
}

export default Wipdisplay;