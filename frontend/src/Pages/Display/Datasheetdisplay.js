import React, { useState, useEffect } from 'react';
import { Select, Button, Spin } from 'antd'; // Import Ant Design components
import Tablecomponent from '../../Components/Tablecomponent';
import { fetchdatasheetdisplay } from '../../Ultility/Displayapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import {baseURLdrawing} from '../../Ultility/ApiSetup/api';
import DetailModal from './DetailModalDatasheet';
const { Option } = Select;

const Datasheetdisplay = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // Individual filters
  const [machine_Code_Cold, setMachine_Code_Cold] = useState([]);
  const [partNoFilter, setPartNoFilter] = useState([]);
  const [machine_Code_Hot, setMachine_Code_Hot] = useState([]);
  const [thicknessfilter, setThicknessfilter] = useState([]);


  const columnDefs = [
    { headerName: 'No.', field: 'running_no', checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: 'Part No.', field: 'Compact_No' , pinned: 'left'},
    { headerName: 'ขนาด STD', field: 'sum_max_thick' },
    { headerName: 'ขนาดต้องการ', field: 'sum_max_thick_plus_0_5' },
    { headerName: 'พื่นที่', field: 'max_area_f_div_100' , valueFormatter: params => Number(params.value).toFixed(2)},

    { headerName: 'รหัสแม่พิมพ์เย็น', field: 'Mold_Code_Cold' },
    { headerName: 'ชิ้นต่อพิมพ์เย็น', field: 'Pcs_Per_Mold_Cold' },
    { headerName: 'รหัสเครื่องพิมพ์เย็น', field: 'Machine_Code_Cold' },
    { headerName: 'ขนาดกระบอกสูบเครื่องพิมพ์เย็น', field: 'Diameter_Machine_Code_Cold' },
    { headerName: 'แรงดันต่อชิ้นงานพิมพ์เย็น', field: 'Pressure_Cold_Per_pcs' },
    { headerName: 'แรงดันต่อแม่พิมพ์เย็น', field: 'Presure_Cold' },

    { headerName: 'รหัสแม่พิมพ์ร้อน', field: 'Mold_Code_Hot' },
    { headerName: 'ชิ้นต่อพิมพ์ร้อน', field: 'Pcs_Per_Mold_Hot' },
    { headerName: 'รหัสเครื่องพิมพ์ร้อน', field: 'Machine_Code_Hot' },
    { headerName: 'ขนาดกระบอกสูบเครื่องพิมพ์เย็น', field: 'Diameter_Machine_Code_Hot' },
    { headerName: 'แรงดันต่อชิ้นงานพิมพ์ร้อน', field: 'pressure_hot_per_pcs' },
    { headerName: 'แรงดันต่อพิมพ์แม่พิมพ์ร้อน', field: 'Presure_Hot' },

    { headerName: 'สูตรเคมี', field: 'Formulation' },
    { headerName: 'เกรดเคมี', field: 'Chem_Grade' },
    { headerName: 'น้ำหนัก F', field: 'Weight_F' },
    { headerName: 'น้ำหนัก U', field: 'Weight_U' },

    { headerName: 'Program_No', field: 'Program_No' },
    { headerName: 'Drawing No.', field: 'Compact_No_Modify' },
    {
        headerName: 'Actions',
        field: 'actions',
        pinned: 'right',
        cellRenderer: (params) => (
            <div>
                <>
                    {params.data.drawingfile && (
                        <a
                            href={`${baseURLdrawing}/${encodeURIComponent(params.data.drawingfile)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button
                                className="btn btn-success btn-sm"
                                style={{ marginRight: '5px' }}
                            >
                                D
                            </button>
                        </a>
                    )}
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleShowDetails(params.data)}
                        style={{ marginRight: '5px' }}
                    >
                        Detail
                    </button>
                </>
            </div>
        ),
    },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const packageData = (await fetchdatasheetdisplay()).data;
        console.log('packageData', packageData)
        setRowData(packageData);
        setFilteredData(packageData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const handleFilterChange = () => {
    const filtered = rowData.filter((item) =>
      (!machine_Code_Cold.length || machine_Code_Cold.includes(item.Machine_Code_Cold)) &&
      (!partNoFilter.length || partNoFilter.includes(item.Compact_No)) &&
      (!machine_Code_Hot.length || machine_Code_Hot.includes(item.Machine_Code_Hot)) &&
      (!thicknessfilter.length || thicknessfilter.includes(item.sum_max_thick))
    //   (!customerNameFilter.length || customerNameFilter.includes(item.Customer_Name)) 
    );
    setFilteredData(filtered);
  };

  useEffect(handleFilterChange, [ partNoFilter,machine_Code_Cold, machine_Code_Hot, thicknessfilter, rowData]);

    const clearFilters = () => {
        setPartNoFilter([]);
        setMachine_Code_Cold([]);
        setMachine_Code_Hot([])
        setThicknessfilter([])
    };

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        console.log('Selected rows:', selectedRows);
    };
    const handleShowDetails = async (data) => {
        setSelectedData(data);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedData(null);
    };


  return (
    <div>
      <div style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '10px' }}>Filters</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>

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
                {[...new Set(
                  rowData.filter((item) =>
                  (!machine_Code_Cold.length || machine_Code_Cold.includes(item.Machine_Code_Cold)) &&
                  // (!partNoFilter.length || partNoFilter.includes(item.Compact_No)) &&
                  (!machine_Code_Hot.length || machine_Code_Hot.includes(item.Machine_Code_Hot)) &&
                  (!thicknessfilter.length || thicknessfilter.includes(item.sum_max_thick))
                //   (!customerNameFilter.length || customerNameFilter.includes(item.Customer_Name)) 
                )
                  .map((item) => item.Compact_No))].map((Compact_No) => (
                    <Option key={Compact_No} value={Compact_No}>
                    {Compact_No}
                    </Option>
                ))}
                </Select>
            </div>
            <div style={{ flex: '1 1 30%' }}>
                <label>Filter by ความหน้า.:</label>
                <Select
                mode='multiple'
                showSearch
                placeholder="Select ความหน้า."
                style={{ width: '100%' }}
                value={thicknessfilter}
                onChange={(value) => setThicknessfilter(value)}
                >
                {[...new Set(
                  rowData.filter((item) =>
                  (!machine_Code_Cold.length || machine_Code_Cold.includes(item.Machine_Code_Cold)) &&
                  (!partNoFilter.length || partNoFilter.includes(item.Compact_No)) &&
                  (!machine_Code_Hot.length || machine_Code_Hot.includes(item.Machine_Code_Hot)) 
                  // (!thicknessfilter.length || thicknessfilter.includes(item.sum_max_thick))
                //   (!customerNameFilter.length || customerNameFilter.includes(item.Customer_Name)) 
                )
                  .map((item) => item.sum_max_thick))].map((sum_max_thick) => (
                    <Option key={sum_max_thick} value={sum_max_thick}>
                    {sum_max_thick}
                    </Option>
                ))}
                </Select>
            </div>

            <div style={{ flex: '1 1 30%' }}>
                <label>Filter by รหัสเครื่องพิมพ์เย็น.:</label>
                <Select
                mode='multiple'
                showSearch
                // placeholder="Select Part No."
                style={{ width: '100%' }}
                value={machine_Code_Cold}
                onChange={(value) => setMachine_Code_Cold(value)}
                >
                {[...new Set(
                  rowData.filter((item) =>
                  // (!machine_Code_Cold.length || machine_Code_Cold.includes(item.Machine_Code_Cold)) &&
                  (!partNoFilter.length || partNoFilter.includes(item.Compact_No)) &&
                  (!machine_Code_Hot.length || machine_Code_Hot.includes(item.Machine_Code_Hot)) &&
                  (!thicknessfilter.length || thicknessfilter.includes(item.sum_max_thick))
                //   (!customerNameFilter.length || customerNameFilter.includes(item.Customer_Name)) 
                )
                  .map((item) => item.Machine_Code_Cold))].map((Machine_Code_Cold) => (
                    <Option key={Machine_Code_Cold} value={Machine_Code_Cold}>
                    {Machine_Code_Cold}
                    </Option>
                ))}
                </Select>
            </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>

            <div style={{ flex: '1 2 30%' }}>
                <label>Filter by รหัสเครื่องพิมพ์ร้อน.:</label>
                <Select
                mode='multiple'
                showSearch
                // placeholder="Select Part No."
                style={{ width: '100%' }}
                value={machine_Code_Hot}
                onChange={(value) => setMachine_Code_Hot(value)}
                >
                {[...new Set(
                  rowData.filter((item) =>
                  (!machine_Code_Cold.length || machine_Code_Cold.includes(item.Machine_Code_Cold)) &&
                  (!partNoFilter.length || partNoFilter.includes(item.Compact_No)) &&
                  // (!machine_Code_Hot.length || machine_Code_Hot.includes(item.Machine_Code_Hot)) 
                  (!thicknessfilter.length || thicknessfilter.includes(item.sum_max_thick))
                //   (!customerNameFilter.length || customerNameFilter.includes(item.Customer_Name)) 
                )
                  .map((item) => item.Machine_Code_Hot))].map((Machine_Code_Hot) => (
                    <Option key={Machine_Code_Hot} value={Machine_Code_Hot}>
                    {Machine_Code_Hot}
                    </Option>
                ))}
                </Select>
            </div>
        
        </div>

        <Button type="default" style={{ marginTop: '10px' }} onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Spin size="large" />
        </div>
      ) : error ? (
        <div style={{ color: 'red' }}>{`Error: ${error}`}</div>
      ) : (
        <div style={{ marginBottom: '20px'}}>
            <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename="Datasheet" />
            <ClipboardButton gridApi={gridApi} columnDefs={columnDefs} />
            <Tablecomponent
                columnDefs={columnDefs}
                rowData={filteredData}
                onGridReady={onGridReady}
                onSelectionChanged={onSelectionChanged}
            />
            <DetailModal
                show={showModal}
                onHide={handleCloseModal}
                data={selectedData}
                Tablename = 'Datasheet'
            />
        </div>
      )}
    </div>
  );
};

export default Datasheetdisplay;
