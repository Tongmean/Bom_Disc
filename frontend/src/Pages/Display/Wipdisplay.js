import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchDisplaywip} from '../../Ultility/Displayapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import { useNavigate } from 'react-router-dom';
const Wipdisplay = () =>{
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState();
    const [gridApi, setGridApi] = useState(null)
    const navigate = useNavigate();

    const columnDefs = [
        { headerName: 'รหัส ERP (Code_Fg)', field: 'Code_Fg' , checkboxSelection: true, headerCheckboxSelection: true },

        { headerName: 'WIP1', field: 'WIP1' },
        { headerName: 'จำนวน WIP1', field: 'Quantity_BP1' },
        { headerName: 'WIP2', field: 'WIP2' },
        { headerName: 'จำนวน WIP2', field: 'Quantity_BP2' },
        { headerName: 'WIP3', field: 'WIP3' },
        { headerName: 'จำนวน WIP3', field: 'Quantity_BP3' },
        { headerName: 'WIP4', field: 'WIP4' },
        { headerName: 'จำนวน WIP4', field: 'Quantity_BP4' },



        // { headerName: 'กรอกโดย', field: 'CreateBy' },
        // { headerName: 'กรอกเมื่อ', field: 'CreateAt' },
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
                        pad.Thickness === "-" || !pad.Id_BP?.includes("BP")
                            ? "-"
                            : `${pad.Id_BP}${item.Formular}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`;
                } else {
                    acc[padKey] =
                        pad.Thickness === "-" || !pad.Id_BP?.includes("BP")
                            ? "-"
                            : `${pad.Id_BP}(${pad.Thickness})${item.Formular}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`;
                }
                // Add Quantity for each pad
                acc[`Quantity_BP${index + 1}`] = pad.Quantity || "-";
                return acc;
            }, {});
    
            // Include Code_Fg in the result
            return {
                Code_Fg: item.Code_Fg,
                ...result
            };
        });
    };



    useEffect(() => {
        const loadpackages = async () => {
          try {
            const packageData = (await fetchDisplaywip()).data;
            console.log('packageData', packageData)

            const WipmappedReult = mapToWIPs(packageData);
            console.log('WipmappedReult', WipmappedReult)

            setRowData(WipmappedReult); // Set the users from the API response
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

    const handleOnClick = () => {
        navigate('/createPackage');
    };
    return (
        <>
            <div>
                <button className='btn btn-success btn-sm' style={{ marginBottom: '10px' }} onClick={handleOnClick}>เพิ่มรายการ</button>
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
                    rowData={rowData}
                    onGridReady={onGridReady}
                    onSelectionChanged={onSelectionChanged}
                />
            )}
        </>
    )
}

export default Wipdisplay;