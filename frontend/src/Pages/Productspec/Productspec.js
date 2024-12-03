import React, { useState, useEffect } from 'react';
import Tablecomponent from '../../Components/Tablecomponent';
import {fetchProductspecs, fetchHistoryLog} from '../../Ultility/Productspecapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import DetailModal from '../Productspec/DetailModal'
import { useNavigate } from 'react-router-dom';
const Productspec = () =>{
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState();
    const [gridApi, setGridApi] = useState(null)
    const [selectedData, setSelectedData] = useState(null);
    const [historyLog, setHistoryLog] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const columnDefs = [
        { headerName: 'No', field: 'No', checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'รหัส Product Spec', field: 'Product_Spec_Id' },
        { headerName: 'Code การขาย', field: 'Sale_Code' },
        { headerName: 'Coating', field: 'Coating' },
        { headerName: 'Scoarching', field: 'Scoarching' },
        { headerName: 'รหัสการ Scoarching/Coating', field: 'Scoarching_Coating_Id' },
        { headerName: 'ติดแผน Shim', field: 'Shim' },
        { headerName: 'Slot', field: 'Slot' },
        { headerName: 'Chamfer', field: 'Chamfer' },
        { headerName: 'พ่นสี', field: 'Color' },
        { headerName: 'รหัสสี', field: 'Color_Id' },
        { headerName: 'ชื่อลูกค้า', field: 'Customer_Name_Product_Spec' },
        { headerName: 'สูตรเคมี', field: 'Chem_Formular' },
        { headerName: 'สูตร Under layer', field: 'Formula_Under_Layer' },
        { headerName: 'ชื่อสติกเกอร์ 1', field: 'Sticker_Name_1' },
        { headerName: 'รหัส ERP สติกเกอร์ 1', field: 'Sticker_Erp_Id_1' },
        { headerName: 'จำนวน สติกเกอร์ 1', field: 'Num_Sticker_1' },
        { headerName: 'ชื่อสติกเกอร์ 2', field: 'Sticker_Name_2' },
        { headerName: 'รหัส ERP สติกเกอร์ 2', field: 'Sticker_Erp_Id_2' },
        { headerName: 'จำนวน สติกเกอร์ 2', field: 'Num_Sticker_2' },
        { headerName: 'ชื่อสติกเกอร์ 3', field: 'Sticker_Name_3' },
        { headerName: 'รหัส ERP สติกเกอร์ 3', field: 'Sticker_Erp_Id_3' },
        { headerName: 'จำนวน สติกเกอร์ 3', field: 'Num_Sticker_3' },
        { headerName: 'ชื่อใบแนบ 1', field: 'Name_Attach_Paper_1' },
        { headerName: 'รหัส ERP ใบแนบ 1', field: 'Attach_Paper_Erp_Id_1' },
        { headerName: 'จำนวนใบแนบ 1', field: 'Num_Attach_1' },
        { headerName: 'ชื่อใบแนบ 2', field: 'Name_Attach_Paper_2' },
        { headerName: 'รหัส ERP ใบแนบ 2', field: 'Attach_Paper_Erp_Id_2' },
        { headerName: 'จำนวนใบแนบ 2', field: 'Num_Attach_2' },
        { headerName: 'ชื่อใบแนบ 3', field: 'Name_Attach_Paper_3' },
        { headerName: 'รหัส ERP ใบแนบ 3', field: 'Attach_Paper_Erp_Id_3' },
        { headerName: 'จำนวนใบแนบ 3', field: 'Num_Attach_3' },
        { headerName: 'ชื่อใบแนบ 4', field: 'Name_Attach_Paper_4' },
        { headerName: 'รหัส ERP ใบแนบ 4', field: 'Attach_Paper_Erp_Id_4' },
        { headerName: 'จำนวนใบแนบ 4', field: 'Num_Attach_4' },
        { headerName: 'ชื่อ ERP อุปกรณ์เสริมอื่น ๆ', field: 'Name_Erp_Additional_Tool' },
        { headerName: 'รหัส ERP อุปกรณ์เสริมอื่น ๆ', field: 'Additional_Tool_Erp_Id' },
        { headerName: 'จำนวน อุปกรณ์เสริมอื่น ๆ', field: 'Num_Additional_Tool' },
        { headerName: 'Column_36', field: 'Column_36' },

        // { headerName: 'กรอกโดย', field: 'CreateBy' },
        // { headerName: 'กรอกเมื่อ', field: 'CreateAt' },
        {
            headerName: 'Actions',
            field: 'actions',
            cellRenderer: (params) => (
                <div>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleShowDetails(params.data)}
                        style={{ marginRight: '5px' }}
                    >
                        Detail
                    </button>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleShowEdit(params.data)}
                        style={{ marginRight: '5px' }}
                    >
                        Edit
                    </button>
                </div>
            ),
        }
    ];
    const handleShowDetails = async (data) => {
        setSelectedData(data);
        try {
            const history = await fetchHistoryLog(data.No); // API call to fetch the history log
            setHistoryLog(history);
        } catch (err) {
            console.error('Failed to fetch history log:', err.message);
            setError(err.message);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedData(null);
        setHistoryLog([]);
    };



    useEffect(() => {
        const load = async () => {
          try {
            const packageData = (await fetchProductspecs()).data;
            
            const mappedData = packageData.map(i => ({
                No: i.id,
                Product_Spec_Id: i.Product_Spec_Id,
                Sale_Code: i.Sale_Code,
                Coating: i.Coating,
                Scoarching: i.Scoarching,
                Scoarching_Coating_Id: i.Scoarching_Coating_Id,
                Shim: i.Shim,
                Slot: i.Slot,
                Chamfer: i.Chamfer,
                Color: i.Color,
                Color_Id: i.Color_Id,
                Customer_Name_Product_Spec: i.Customer_Name_Product_Spec,
                Chem_Formular: i.Chem_Formular,
                Formula_Under_Layer: i.Formula_Under_Layer,
                Sticker_Name_1: i.Sticker_Name_1,
                Sticker_Erp_Id_1: i.Sticker_Erp_Id_1,
                Num_Sticker_1: i.Num_Sticker_1,
                Sticker_Name_2: i.Sticker_Name_2,
                Sticker_Erp_Id_2: i.Sticker_Erp_Id_2,
                Num_Sticker_2: i.Num_Sticker_2,
                Sticker_Name_3: i.Sticker_Name_3,
                Sticker_Erp_Id_3: i.Sticker_Erp_Id_3,
                Num_Sticker_3: i.Num_Sticker_3,
                Name_Attach_Paper_1: i.Name_Attach_Paper_1,
                Attach_Paper_Erp_Id_1: i.Attach_Paper_Erp_Id_1,
                Num_Attach_1: i.Num_Attach_2,
                Name_Attach_Paper_2: i.Name_Attach_Paper_2,
                Attach_Paper_Erp_Id_2: i.Attach_Paper_Erp_Id_2,
                Num_Attach_2: i.Num_Attach_2,
                Name_Attach_Paper_3: i.Name_Attach_Paper_3,
                Attach_Paper_Erp_Id_3: i.Attach_Paper_Erp_Id_3,
                Num_Attach_3: i.Num_Attach_3,
                Name_Attach_Paper_4: i.Name_Attach_Paper_4,
                Attach_Paper_Erp_Id_4: i.Attach_Paper_Erp_Id_4,
                Num_Attach_4: i.Num_Attach_4,
                Name_Erp_Additional_Tool: i.Name_Erp_Additional_Tool,
                Additional_Tool_Erp_Id: i.Additional_Tool_Erp_Id,
                Num_Additional_Tool: i.Num_Additional_Tool,
                Column_36: i.Column_36,

                CreateBy: i.CreateBy,
                CreateAt: i.CreateAt

            }));
            // console.log('Mapped Data', mappedData)
            setRowData(mappedData); // Set the users from the API response
          } catch (err) {
            setError(err.message); // Set the error message if something goes wrong
          } finally {
            setLoading(false); // Turn off the loading state once the operation is complete
          }
        };
    
        load();
    }, []);

    const onGridReady = params => {
        setGridApi(params.api);
    };

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        console.log('Selected rows:', selectedRows);
    };

    const handleOnClick = () => {
        navigate('/createproductspec');
    };
    const handleShowEdit = (data) => {
        navigate(`/productspec/${data.No}`);
    };
    return (
        <>
            <div>
                <button className='btn btn-success btn-sm' style={{ marginBottom: '10px' }} onClick={handleOnClick}>เพิ่มรายการ</button>
                <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename = "Product-spec"/>
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
            <DetailModal
                show={showModal}
                onHide={handleCloseModal}
                data={selectedData}
                historyLog={historyLog}
                Tablename = 'Product-spec'
            />
        </>
    )
}

export default Productspec;