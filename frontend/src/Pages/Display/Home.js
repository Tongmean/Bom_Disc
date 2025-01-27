import React, { useState, useEffect } from 'react';
import { Select, Button } from 'antd'; // Import Ant Design components
import Tablecomponent from '../../Components/Tablecomponent';
import { fetchDisplayhome } from '../../Ultility/Displayapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';

const { Option } = Select;

const Homepage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [gridApi, setGridApi] = useState(null);

  // Individual filters
  const [codeFgFilter, setCodeFgFilter] = useState([]);
  const [saleCodeBomFilter, setSaleCodeBomFilter] = useState([]);
  const [partNoFilter, setPartNoFilter] = useState([]);
  const [customerNameFilter, setCustomerNameFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [productspecFilter, setProductspecFilter] = useState([]);


  const columnDefs = [
    { headerName: 'รหัส ERP (Code_Fg)', field: 'Code_Fg', checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: 'ชื่อลูกค้า', field: 'Customer_Name' },
    { headerName: 'Code การขาย', field: 'Sale_Code_Bom' },
    { headerName: 'Part No.', field: 'Part_No' },
    { headerName: 'เบอร์', field: 'Num' },
    { headerName: 'จำนวนชิ้น/ชุด', field: 'Pcs_Per_Set' },
    { headerName: 'Status', field: 'Status' },
    { headerName: 'สูตรเคมี.', field: 'Formular' },
    { headerName: 'น้ำหนักเคมี F1', field: 'Weight_F1' },
    { headerName: 'น้ำหนักเคมี F2', field: 'Weight_F2' },
    { headerName: 'เกรดเคมี Underlayer', field: 'Underlayer_Grade_Chem' },
    { headerName: 'น้ำหนักเคมี U1', field: 'Weight_U1' },
    { headerName: 'น้ำหนักเคมี U2', field: 'Weight_U2' },
    { headerName: 'รหัส ERP BP1', field: 'Erp_Id_BP1' },
    { headerName: 'ชื่อ ERP BP1', field: 'Name_BP1' },
    { headerName: 'ID BP1', field: 'Id_BP1' },
    { headerName: 'จำนวน BP1', field: 'Quantity_BP1' },

    { headerName: 'รหัส ERP BP2', field: 'Erp_Id_BP2' },
    { headerName: 'ชื่อ ERP BP2', field: 'Name_BP2' },
    { headerName: 'ID BP2', field: 'Id_BP2' },
    { headerName: 'จำนวน BP2', field: 'Quantity_BP2' },

    { headerName: 'รหัส ERP BP3', field: 'Erp_Id_BP3' },
    { headerName: 'ชื่อ ERP BP3', field: 'Name_BP3' },
    { headerName: 'ID BP3', field: 'Id_BP3' },
    { headerName: 'จำนวน BP3', field: 'Quantity_BP3' },

    { headerName: 'รหัส ERP BP4', field: 'Erp_Id_BP4' },
    { headerName: 'ชื่อ ERP BP4', field: 'Name_BP4' },
    { headerName: 'ID BP4', field: 'Id_BP4' },
    { headerName: 'จำนวน BP4', field: 'Quantity_BP4' },

    { headerName: 'รหัส ERP WD1', field: 'Erp_Id_WD1' },
    { headerName: 'ชื่อ ERP WD1', field: 'Name_WD1' },
    { headerName: 'ID WD1', field: 'Id_WD1' },
    { headerName: 'จำนวน WD1', field: 'Quantity_WD1' },

    { headerName: 'รหัส ERP WD2', field: 'Erp_Id_WD2' },
    { headerName: 'ชื่อ ERP WD2', field: 'Name_WD2' },
    { headerName: 'ID WD2', field: 'Id_WD2' },
    { headerName: 'จำนวน WD2', field: 'Quantity_WD2' },

    { headerName: 'รหัส ERP WD3', field: 'Erp_Id_WD3' },
    { headerName: 'ชื่อ ERP WD3', field: 'Name_WD3' },
    { headerName: 'ID WD3', field: 'Id_WD3' },
    { headerName: 'จำนวน WD3', field: 'Quantity_WD3' },
    { headerName: 'การติด Shim', field: 'Shim_Attach' },

    { headerName: 'รหัส SP1', field: 'Erp_Id_SP1' },
    { headerName: 'ชื่อ SP1', field: 'Name_SP1' },
    { headerName: 'ID SP1', field: 'Id_SP1' },
    { headerName: 'จำนวน SP1', field: 'Quantity_SP1' },

    { headerName: 'รหัส SP2', field: 'Erp_Id_SP2' },
    { headerName: 'ชื่อ SP2', field: 'Name_SP2' },
    { headerName: 'ID SP2', field: 'Id_SP2' },
    { headerName: 'จำนวน SP2', field: 'Quantity_SP2' },

    { headerName: 'รหัส SP3', field: 'Erp_Id_SP3' },
    { headerName: 'ชื่อ SP3', field: 'Name_SP3' },
    { headerName: 'ID SP3', field: 'Id_SP3' },
    { headerName: 'จำนวน SP3', field: 'Quantity_SP3' },

    { headerName: 'Slot', field: 'Slot' },
    { headerName: 'Chamfer', field: 'Chamfer' },
    { headerName: 'พ่นสี', field: 'Color' },
    { headerName: 'Coating', field: 'Coating' },
    { headerName: 'Scoarching', field: 'Scoarching' },

    { headerName: 'รหัส ERP ใบแนบ 1', field: 'Attach_Paper_Erp_Id_1' },
    { headerName: 'ชื่อใบแนบ 1', field: 'Name_Attach_Paper_1' },
    { headerName: 'จำนวนใบแนบ 1', field: 'Num_Attach_1' },

    { headerName: 'รหัส ERP ใบแนบ 2', field: 'Attach_Paper_Erp_Id_2' },
    { headerName: 'ชื่อใบแนบ 2', field: 'Name_Attach_Paper_2' },
    { headerName: 'จำนวนใบแนบ 2', field: 'Num_Attach_2' },

    { headerName: 'รหัส ERP ใบแนบ 3', field: 'Attach_Paper_Erp_Id_3' },
    { headerName: 'ชื่อใบแนบ 3', field: 'Name_Attach_Paper_3' },
    { headerName: 'จำนวนใบแนบ 3', field: 'Num_Attach_3' },

    { headerName: 'รหัส ERP ใบแนบ 4', field: 'Attach_Paper_Erp_Id_4' },
    { headerName: 'ชื่อใบแนบ 4', field: 'Name_Attach_Paper_4' },
    { headerName: 'จำนวนใบแนบ 4', field: 'Num_Attach_4' },

    { headerName: 'รหัส ERP อุปกรณ์เสริมอื่น ๆ 1', field: 'Additional_Tool_Erp_Id_1' },
    { headerName: 'ชื่อ ERP อุปกรณ์เสริมอื่น ๆ 1', field: 'Name_Erp_Additional_Tool_1' },
    { headerName: 'จำนวน อุปกรณ์เสริมอื่น ๆ 1', field: 'Num_Additional_Tool_1' },

    { headerName: 'รหัส ERP อุปกรณ์เสริมอื่น ๆ 2', field: 'Additional_Tool_Erp_Id_2' },
    { headerName: 'ชื่อ ERP อุปกรณ์เสริมอื่น ๆ 2', field: 'Name_Erp_Additional_Tool_2' },
    { headerName: 'จำนวน อุปกรณ์เสริมอื่น ๆ 2', field: 'Num_Additional_Tool_2' },

    { headerName: 'รหัส ERP อุปกรณ์เสริมอื่น ๆ 3', field: 'Additional_Tool_Erp_Id_3' },
    { headerName: 'ชื่อ ERP อุปกรณ์เสริมอื่น ๆ 3', field: 'Name_Erp_Additional_Tool_3' },
    { headerName: 'จำนวน อุปกรณ์เสริมอื่น ๆ 3', field: 'Num_Additional_Tool_3' },

    { headerName: 'รหัส ERP สติกเกอร์ 1', field: 'Sticker_Erp_Id_1' },
    { headerName: 'ชื่อสติกเกอร์ 1', field: 'Sticker_Name_1' },
    { headerName: 'จำนวน สติกเกอร์ 1', field: 'Num_Sticker_1' },

    { headerName: 'รหัส ERP สติกเกอร์ 2', field: 'Sticker_Erp_Id_2' },
    { headerName: 'ชื่อสติกเกอร์ 2', field: 'Sticker_Name_2' },
    { headerName: 'จำนวน สติกเกอร์ 2', field: 'Num_Sticker_2' },

    { headerName: 'รหัส ERP สติกเกอร์ 3', field: 'Sticker_Erp_Id_3' },
    { headerName: 'ชื่อสติกเกอร์ 3', field: 'Sticker_Name_3' },
    { headerName: 'จำนวน สติกเกอร์ 3', field: 'Num_Sticker_3' },

    { headerName: 'รหัส ERP โฟมและอุปกรณ์เสริม 1', field: 'Additional_Tool_Erp_Id_1' },
    { headerName: 'ชื่อ ERP โฟมและอุปกรณ์เสริม 1', field: 'Name_Additional_Tool_1' },
    { headerName: 'จำนวนโฟมและอุปกรณ์เสริม 1', field: 'Quantity_Additional_Tool_1' },

    { headerName: 'รหัส ERP โฟมและอุปกรณ์เสริม 2', field: 'Additional_Tool_Erp_Id_2' },
    { headerName: 'ชื่อ ERP โฟมและอุปกรณ์เสริม 2', field: 'Name_Additional_Tool_2' },
    { headerName: 'จำนวนโฟมและอุปกรณ์เสริม 2', field: 'Quantity_Additional_Tool_2' },

    { headerName: 'รหัสกล่อง (Inner)', field: 'Rm_Pk_Id' },
    { headerName: 'รหัส ERP กล่อง (Inner)', field: 'Erp_Id' },
    { headerName: 'ชื่อ ERP กล่อง (Inner)', field: 'Name_Erp' },
    { headerName: 'จำนวนกล่อง', field: 'Quantity_Display_Box' },
    { headerName: 'ใส่ Outer', field: 'Outer_Package' },
    { headerName: 'เบอร์ Outer', field: 'Num_Outer' },

    { headerName: 'รหัส ERP (Outer)', field: 'Erp_Id_Outer' },
    { headerName: 'ชื่อ Outer (Outer)', field: 'Name_Erp_Outer' },
    { headerName: 'จำนวน Set/ Outer', field: 'Set_Per_Outer' },
    { headerName: 'จำนวน Outer/ พาเลท', field: 'Outer_Per_pallet' },
    { headerName: 'จำนวน Set/ พาเลท', field: 'Set_Per_Pallet' },

    { headerName: 'รหัส Product spec', field: 'Product_Spec_Id' },
    { headerName: 'น้ำหนักรวม', field: 'Weight' },
    { headerName: 'Emark Id', field: 'Emark_Id' },


  ];

  useEffect(() => {
    const load = async () => {
      try {
        const packageData = (await fetchDisplayhome()).data;
        console.log('packageData',packageData)

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
    // console.log('params.api', params.api)
    setGridApi(params.api);
  };

  const handleFilterChange = () => {
    const filtered = rowData.filter((item) =>
      (!codeFgFilter.length || codeFgFilter.includes(item.Code_Fg)) &&
      (!saleCodeBomFilter.length || saleCodeBomFilter.includes(item.Sale_Code_Bom)) &&
      (!partNoFilter.length || partNoFilter.includes(item.Part_No)) &&
      (!customerNameFilter.length || customerNameFilter.includes(item.Customer_Name)) &&
      (!statusFilter.length || statusFilter.includes(item.Status)) &&
      (!productspecFilter.length || productspecFilter.includes(item.Product_Spec_Id))
    );
    setFilteredData(filtered);
  };

  useEffect(handleFilterChange, [codeFgFilter, saleCodeBomFilter, partNoFilter, customerNameFilter, statusFilter, productspecFilter]);

  const clearFilters = () => {
    setCodeFgFilter([]);
    setSaleCodeBomFilter([]);
    setPartNoFilter([]);
    setCustomerNameFilter([]);
    setStatusFilter([]);
    setProductspecFilter([])
  };

  return (
    <div>
      <div style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '10px' }}>Filters</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ flex: '1 1 30%' }}>
            <label>Filter by Code_Fg (ERP):</label>
            <Select
              mode="multiple"
              placeholder="Select Code_Fg"
              style={{ width: '100%' }}
              value={codeFgFilter}
              onChange={(value) => setCodeFgFilter(value)}
            >
              {[...new Set(
                rowData.filter((item) =>
                // (!codeFgFilter.length || codeFgFilter.includes(item.Code_Fg)) &&
                (!saleCodeBomFilter.length || saleCodeBomFilter.includes(item.Sale_Code_Bom)) &&
                (!partNoFilter.length || partNoFilter.includes(item.Part_No)) &&
                (!customerNameFilter.length || customerNameFilter.includes(item.Customer_Name)) &&
                (!statusFilter.length || statusFilter.includes(item.Status)) &&
                (!productspecFilter.length || productspecFilter.includes(item.Product_Spec_Id))
              )
                .map((item) => item.Code_Fg))].map((code) => (
                <Option key={code} value={code}>
                  {code}
                </Option>
              ))}
            </Select>
          </div>

          <div style={{ flex: '1 1 30%' }}>
            <label>Filter by Code การขาย:</label>
            <Select
              mode="multiple"
              placeholder="Select Sale Code"
              style={{ width: '100%' }}
              value={saleCodeBomFilter}
              onChange={(value) => setSaleCodeBomFilter(value)}
            >
              {[...new Set(filteredData.map((item) => item.Sale_Code_Bom))].map((code) => (
                <Option key={code} value={code}>
                  {code}
                </Option>
              ))}
            </Select>
          </div>

          <div style={{ flex: '1 1 30%' }}>
            <label>Filter by Part No.:</label>
            <Select
              mode="multiple"
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
            <label>Filter by ชื่อลูกค้า:</label>
            <Select
              mode="multiple"
              placeholder="Select Customer Name"
              style={{ width: '100%' }}
              value={customerNameFilter}
              onChange={(value) => setCustomerNameFilter(value)}
            >
              {[...new Set(filteredData.map((item) => item.Customer_Name))].map((customerName) => (
                <Option key={customerName} value={customerName}>
                  {customerName}
                </Option>
              ))}
            </Select>
          </div>

          <div style={{ flex: '1 1 30%' }}>
            <label>Filter by Status:</label>
            <Select
              mode="multiple"
              placeholder="Select Status"
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
            >
              {[...new Set(filteredData.map((item) => item.Status))].map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </div>
          <div style={{ flex: '1 1 30%' }}>
            <label>Filter by รหัส Product Spec:</label>
            <Select
              mode="multiple"
              placeholder="Select Product Spec"
              style={{ width: '100%' }}
              value={productspecFilter}
              onChange={(value) => setProductspecFilter(value)}
            >
              {[...new Set(filteredData.map((item) => item.Product_Spec_Id))].map((productspec) => (
                <Option key={productspec} value={productspec}>
                  {productspec}
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
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{`Error: ${error}`}</div>
      ) : (
        <div style={{ marginBottom: '20px'}}>
            <ExcelExportButton gridApi={gridApi} columnDefs={columnDefs} Tablename="Bom" />
            <ClipboardButton gridApi={gridApi} columnDefs={columnDefs} />
            <Tablecomponent
                columnDefs={columnDefs}
                rowData={filteredData}
                onGridReady={onGridReady}
            />
        </div>
      )}
    </div>
  );
};

export default Homepage;
