import React, { useState, useEffect } from 'react';
import { Select, Button } from 'antd'; // Import Ant Design components
import Tablecomponent from '../../Components/Tablecomponent';
import { fetchDisplayQc } from '../../Ultility/Displayapi';
import ExcelExportButton from '../../Components/ExcelExportButton';
import ClipboardButton from '../../Components/ClipboardButton';
import { baseURLproductspec,baseURLdrawing } from '../../Ultility/ApiSetup/api';
import DetailModal from './DetailModalQc';
const { Option } = Select;

const Qcdisplay = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // Individual filters
  const [codeFgFilter, setCodeFgFilter] = useState([]);
  const [partNoFilter, setPartNoFilter] = useState([]);
  const [productspecFilter, setProductspecFilter] = useState([]);
  const [customerNameFilter, setCustomerNameFilter] = useState([]);


  const columnDefs = [
    { headerName: 'รหัส ERP (Code_Fg)', field: 'Code_Fg', checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: 'Part No.', field: 'Part_No' },
    { headerName: 'เบอร์', field: 'Num' },
    { headerName: 'รหัส Product Spec', field: 'Product_Spec_No' },
    { headerName: 'Drawing No.', field: 'Drawing_No' },
    {
        headerName: 'Actions',
        field: 'actions',
        cellRenderer: (params) => (
            <div>
                <>
                    {params.data.productspecfile && (
                        <a
                            href={`${baseURLproductspec}/${encodeURIComponent(params.data.productspecfile)}`}
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
        const packageData = (await fetchDisplayQc()).data;
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
      (!productspecFilter.length || productspecFilter.includes(item.Product_Spec_No)) &&
      (!customerNameFilter.length || customerNameFilter.includes(item.Customer_Name)) 
    );
    setFilteredData(filtered);
  };

  useEffect(handleFilterChange, [codeFgFilter,  partNoFilter, productspecFilter, customerNameFilter, rowData]);

    const clearFilters = () => {
        setCodeFgFilter([]);
        setPartNoFilter([]);
        setProductspecFilter([]);
        setCustomerNameFilter([])
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
            <div style={{ flex: '1 1 45%' }}>
                <label>Filter by Code_Fg (ERP):</label>
                <Select
                showSearch
                placeholder="Select Code_Fg"
                style={{ width: '100%' }}
                value={codeFgFilter}
                onChange={(value) => setCodeFgFilter(value)}
                >
                {[...new Set(filteredData.map((item) => item.Code_Fg))].map((code) => (
                    <Option key={code} value={code}>
                    {code}
                    </Option>
                ))}
                </Select>
            </div>

            <div style={{ flex: '1 1 45%' }}>
                <label>Filter by Part No.:</label>
                <Select
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

            <div style={{ flex: '1 1 45%' }}>
                <label>Filter by รหัส Product Spec:</label>
                <Select
                showSearch
                placeholder="Select Product Spec"
                style={{ width: '100%' }}
                value={productspecFilter}
                onChange={(value) => setProductspecFilter(value)}
                >
                {[...new Set(filteredData.map((item) => item.Product_Spec_No))].map((productspec) => (
                    <Option key={productspec} value={productspec}>
                    {productspec}
                    </Option>
                ))}
                </Select>
            </div>

            <div style={{ flex: '1 1 45%' }}>
                <label>Filter by ชื่อลูกค้า:</label>
                <Select
                showSearch
                placeholder="Select Customer Name."
                style={{ width: '100%' }}
                value={customerNameFilter}
                onChange={(value) => setCustomerNameFilter(value)}
                >
                {[...new Set(filteredData.map((item) => item.Customer_Name))].map((Customer_Name) => (
                    <Option key={Customer_Name} value={Customer_Name}>
                    {Customer_Name}
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
                onSelectionChanged={onSelectionChanged}
            />
            <DetailModal
                show={showModal}
                onHide={handleCloseModal}
                data={selectedData}
                Tablename = 'Product-spec'
            />
        </div>
      )}
    </div>
  );
};

export default Qcdisplay;
