import React, { useState, useEffect } from 'react';
import { Select, Button } from 'antd'; // Import Ant Design components
import Tablecomponent from '../../Components/Tablecomponent';
import { fetchDisplaySale } from '../../Ultility/Displayapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import { baseURL } from '../../Ultility/ApiSetup/api';
const { Option } = Select;

const Saledisplay = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [gridApi, setGridApi] = useState(null);

  // Individual filters
  const [codeFgFilter, setCodeFgFilter] = useState([]);
  const [partNoFilter, setPartNoFilter] = useState([]);
  const [productspecFilter, setProductspecFilter] = useState([]);


  const columnDefs = [
    { headerName: 'รหัส ERP (Code_Fg)', field: 'Code_Fg', checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: 'Part No.', field: 'Part_No' },
    { headerName: 'Code การขาย', field: 'Sale_Code_Bom' },
    // { headerName: 'ชื่อลูกค้า', field: 'Customer_Name' },

    { headerName: 'เบอร์', field: 'Num' },
    { headerName: 'รหัส Product Spec', field: 'Product_Spec_No' },
    { headerName: 'Drawing No.', field: 'Drawing_No' },
    { headerName: 'ติด Shim', field: 'Shim_Attach' },
    { headerName: 'Data sheet no', field: 'Data_Sheet_No' },
    { headerName: 'เบอร์กล่อง', field: 'Display_Box_Id' },
    { headerName: 'จำนวนชิ้น/ชุด', field: 'Pcs_Per_Set' },
    { headerName: 'ใส่ Outer', field: 'Outer_Package' },
    {
        headerName: 'Actions',
        field: 'actions',
        cellRenderer: (params) => (
            <div>
                <>
                    {params.data.productspecfile && (
                        <a
                            href={`${baseURL}/Assets/Productspec/${encodeURIComponent(params.data.productspecfile)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button
                                className="btn btn-info btn-sm"
                                style={{ marginRight: '5px' }}
                            >
                                P
                            </button>
                        </a>
                    )}

                    {params.data.drawingfile && (
                        <a
                            href={`${baseURL}/Assets/Drawing/${encodeURIComponent(params.data.drawingfile)}`}
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
                </>
            </div>
        ),
    },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const packageData = (await fetchDisplaySale()).data;
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
      (!codeFgFilter.length || codeFgFilter.includes(item.Code_Fg)) &&
      (!partNoFilter.length || partNoFilter.includes(item.Part_No)) &&
      (!productspecFilter.length || productspecFilter.includes(item.Product_Spec_No))
    );
    setFilteredData(filtered);
  };

  useEffect(handleFilterChange, [codeFgFilter,  partNoFilter, productspecFilter]);

  const clearFilters = () => {
    setCodeFgFilter([]);
    setPartNoFilter([]);
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
              showSearch
              placeholder="Select Code_Fg"
              style={{ width: '100%' }}
              value={codeFgFilter}
              onChange={(value) => setCodeFgFilter(value)}
            >
              {[...new Set(rowData.map((item) => item.Code_Fg))].map((code) => (
                <Option key={code} value={code}>
                  {code}
                </Option>
              ))}
            </Select>
          </div>
          <div style={{ flex: '1 1 30%' }}>
            <label>Filter by Part No.:</label>
            <Select
              showSearch
              placeholder="Select Part No."
              style={{ width: '100%' }}
              value={partNoFilter}
              onChange={(value) => setPartNoFilter(value)}
            >
              {[...new Set(rowData.map((item) => item.Part_No))].map((partNo) => (
                <Option key={partNo} value={partNo}>
                  {partNo}
                </Option>
              ))}
            </Select>
          </div>

          <div style={{ flex: '1 1 30%' }}>
            <label>Filter by รหัส Product Spec:</label>
            <Select
              showSearch
              placeholder="Select Product Spec"
              style={{ width: '100%' }}
              value={productspecFilter}
              onChange={(value) => setProductspecFilter(value)}
            >
              {[...new Set(rowData.map((item) => item.Product_Spec_No))].map((productspec) => (
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

export default Saledisplay;
