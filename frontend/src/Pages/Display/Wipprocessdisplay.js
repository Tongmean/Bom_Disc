import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchDisplaywip} from '../../Ultility/Displayapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
// import { useNavigate } from 'react-router-dom';
import { Select, Button, Spin } from 'antd'; // Import Ant Design components
const { Option } = Select;

const Wipprocessdisplay = () =>{
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null)
    // const navigate = useNavigate();
    // Individual filters
    const [filteredData, setFilteredData] = useState([]);
    const [codeFgFilter, setCodeFgFilter] = useState([]);
    const [partNoFilter, setPartNoFilter] = useState([]);
    const [numberFilter, setNumberFilter] = useState([]);

    const columnDefs = [
        { headerName: 'รหัส ERP (Code_Fg)', field: 'Code_Fg' , checkboxSelection: true, headerCheckboxSelection: true , pinned: 'left'},
        { headerName: 'เบอร์', field: 'Num' },
        { headerName: 'Part No', field: 'Part_No' },
        { headerName: 'WipHP1', field: 'WipHP1' },
        { headerName: 'WipGRD1', field: 'WipGRD1' },
        { headerName: 'WipPow1', field: 'WipPow1' },
        { headerName: 'WipTREAT1', field: 'WipTREAT1' },
        { headerName: 'จำนวน WIP1', field: 'Quantity_BP1' },
        { headerName: 'WipHP2', field: 'WipHP2' },
        { headerName: 'WipGRD2', field: 'WipGRD2' },
        { headerName: 'WipPow2', field: 'WipPow2' },
        { headerName: 'WipTREAT2', field: 'WipTREAT2' },
        { headerName: 'จำนวน WIP2', field: 'Quantity_BP2' },
        { headerName: 'WipHP3', field: 'WipHP3' },
        { headerName: 'WipGRD3', field: 'WipGRD3' },
        { headerName: 'WipPow3', field: 'WipPow3' },
        { headerName: 'WipTREAT3', field: 'WipTREAT3' },
        { headerName: 'จำนวน WIP3', field: 'Quantity_BP3' },
        { headerName: 'WipHP4', field: 'WipHP4' },
        { headerName: 'WipGRD4', field: 'WipGRD4' },
        { headerName: 'WipPow4', field: 'WipPow4' },
        { headerName: 'WipTREAT4', field: 'WipTREAT4' },
        { headerName: 'จำนวน WIP4', field: 'Quantity_BP4' },
    ];
    //Map to Wip
    // const mapToWIPs = (array) => {
    //     return array.map(item => {
    //         const pads = [
    //             { Id_BP: item.Id_BP1, Thickness: item.Thickness_Pad1, Quantity: item.Quantity_BP1 },
    //             { Id_BP: item.Id_BP2, Thickness: item.Thickness_Pad2, Quantity: item.Quantity_BP2 },
    //             { Id_BP: item.Id_BP3, Thickness: item.Thickness_Pad3, Quantity: item.Quantity_BP3 },
    //             { Id_BP: item.Id_BP4, Thickness: item.Thickness_Pad4, Quantity: item.Quantity_BP4 }
    //         ];
    
    //         // Check if any two thicknesses are the same (excluding "-")
    //         const uniqueThicknesses = [...new Set(pads.filter(pad => pad.Thickness !== "-").map(pad => pad.Thickness))];
    
    //         const result = pads.reduce((acc, pad, index) => {
    //             const padKey = `WIP${index + 1}`;
    //             const includeThickness = uniqueThicknesses.length > 1; // If there are multiple unique thicknesses, include thickness
    
    //             if (
    //                 pad.Thickness === pads[0].Thickness &&
    //                 (pad.Thickness === pads[1].Thickness || pad.Thickness === "-") &&
    //                 (pad.Thickness === pads[2].Thickness || pads[2].Thickness === "-") &&
    //                 (pad.Thickness === pads[3].Thickness || pads[3].Thickness === "-")
    //             ) {
    //                 acc[padKey] =
    //                     pad.Thickness === "-" && pad.Id_BP?.includes("BP")
    //                         ? `${pad.Id_BP}-${item.Formular}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`
    //                         : (pad.Thickness === "-" || !pad.Id_BP?.includes("BP"))
    //                             ? "-"
    //                             : includeThickness
    //                                 ? `${pad.Id_BP}-${item.Formular}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`
    //                                 : `${pad.Id_BP}-${item.Formular}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`;
    //             } else {
    //                 acc[padKey] =
    //                     pad.Thickness === "-" && pad.Id_BP?.includes("BP")
    //                         ? `${pad.Id_BP}-${item.Formular}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`
    //                         : (pad.Thickness === "-" || !pad.Id_BP?.includes("BP"))
    //                             ? "-"
    //                             : includeThickness
    //                                 ? `${pad.Id_BP}(${pad.Thickness})-${item.Formular}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`
    //                                 : `${pad.Id_BP}-${item.Formular}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`;
    //             }
    
    //             // Add Quantity for each pad
    //             acc[`Quantity_BP${index + 1}`] = pad.Quantity || "-";
    //             return acc;
    //         }, {});
    
    //         // Include Code_Fg in the result
    //         return {
    //             Code_Fg: item.Code_Fg,
    //             Num: item.Num,
    //             Part_No: item.Part_No,
    //             ...result
    //         };
    //     });
    // };

    // const mapToWIPs = (array) => {
    //     return array.map(item => {
    //         const pads = [
    //             { Id_BP: item.Id_BP1, Thickness: item.Thickness_Pad1, Quantity: item.Quantity_BP1 },
    //             { Id_BP: item.Id_BP2, Thickness: item.Thickness_Pad2, Quantity: item.Quantity_BP2 },
    //             { Id_BP: item.Id_BP3, Thickness: item.Thickness_Pad3, Quantity: item.Quantity_BP3 },
    //             { Id_BP: item.Id_BP4, Thickness: item.Thickness_Pad4, Quantity: item.Quantity_BP4 }
    //         ];
    
    //         const uniqueThicknesses = [...new Set(pads.filter(pad => pad.Thickness !== "-").map(pad => pad.Thickness))];
    
    //         const result = pads.reduce((acc, pad, index) => {
    //             const padKey = `WIP${index + 1}`;
    //             const includeThickness = uniqueThicknesses.length > 1;
    
    //             if (!pad.Id_BP?.includes("BP")) {
    //                 acc[padKey] = "-";
    //                 acc[`WipHP${index + 1}`] = "-";
    //                 acc[`WipGRD${index + 1}`] = "-";
    //                 acc[`WipPow${index + 1}`] = "-";
    //                 acc[`WipTREAT${index + 1}`] = "-";
    //             } else {
    //                 const baseWip = pad.Thickness === "-" && pad.Id_BP?.includes("BP")
    //                     ? `${pad.Id_BP}-${item.Formular}`
    //                     : (pad.Thickness === "-" || !pad.Id_BP?.includes("BP"))
    //                         ? "-"
    //                         : includeThickness
    //                             ? `${pad.Id_BP}(${pad.Thickness})-${item.Formular}`
    //                             : `${pad.Id_BP}-${item.Formular}`;
    
    //                 acc[padKey] = baseWip;
    //                 acc[`WipHP${index + 1}`] = baseWip;
    //                 acc[`WipGRD${index + 1}`] = `${baseWip}-${item.Slot}${item.Chamfer}`;
    //                 acc[`WipPow${index + 1}`] = `${baseWip}-${item.Slot}${item.Chamfer}-${item.Color_Id}`;
    //                 acc[`WipTREAT${index + 1}`] = `${baseWip}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`;
    //             }
                
    //             acc[`Quantity_BP${index + 1}`] = pad.Quantity || "-";
    //             return acc;
    //         }, {});
    
    //         return {
    //             Code_Fg: item.Code_Fg,
    //             Num: item.Num,
    //             Part_No: item.Part_No,
    //             ...result
    //         };
    //     });
    // };
    // const mapToWIPtorows = (array) => {
    //     return array.flatMap(item => {
    //         const pads = [
    //             { Id_BP: item.Id_BP1, Thickness: item.Thickness_Pad1, Quantity: item.Quantity_BP1 },
    //             { Id_BP: item.Id_BP2, Thickness: item.Thickness_Pad2, Quantity: item.Quantity_BP2 },
    //             { Id_BP: item.Id_BP3, Thickness: item.Thickness_Pad3, Quantity: item.Quantity_BP3 },
    //             { Id_BP: item.Id_BP4, Thickness: item.Thickness_Pad4, Quantity: item.Quantity_BP4 }
    //         ];
    
    //         const uniqueThicknesses = [...new Set(pads.filter(pad => pad.Thickness !== "-").map(pad => pad.Thickness))];
    
    //         return pads.map((pad, index) => {
    //             if (!pad.Id_BP?.includes("BP")) return null; // Skip if BP is not contained
    
    //             const baseWip = pad.Thickness === "-" && pad.Id_BP?.includes("BP")
    //                 ? `${pad.Id_BP}-${item.Formular}`
    //                 : (pad.Thickness === "-")
    //                     ? ""
    //                     : uniqueThicknesses.length > 1
    //                         ? `${pad.Id_BP}(${pad.Thickness})-${item.Formular}`
    //                         : `${pad.Id_BP}-${item.Formular}`;
    
    //             return {
    //                 Code_Fg: item.Code_Fg,
    //                 Num: item.Num,
    //                 Part_No: item.Part_No,
    //                 WIP: baseWip || "",
    //                 WipHP: baseWip || "",
    //                 WipGRD: baseWip ? `${baseWip}-${item.Slot}${item.Chamfer}` : "",
    //                 WipPow: baseWip ? `${baseWip}-${item.Slot}${item.Chamfer}-${item.Color_Id}` : "",
    //                 WipTREAT: baseWip ? `${baseWip}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}` : "",
    //                 Quantity_BP: pad.Quantity || ""
    //             };
    //         }).filter(row => row !== null); // Remove null rows
    //     });
    // };
    

    useEffect(() => {
        const loadpackages = async () => {
          try {
            const Data = (await fetchDisplaywip()).data;
            console.log('Data', Data)
            // const WipmappedReult = mapToWIPs(Data);
            // const WipmappedReultrow = mapToWIPtorows(Data);
            // console.log('WipmappedReult', WipmappedReult)
            // console.log('mapToWIPtorows', WipmappedReultrow)

            setRowData(Data); // Set the users from the API response
            // console.log("RowData", rowData)
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
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <Spin size="large" />
                </div>
                // <div>Loading...</div>
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

export default Wipprocessdisplay;