import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Timeline } from 'antd';
import 'antd/dist/reset.css';
import { convertToUTCPlus7 } from '../../Ultility/Moment-timezone';

const DetailModal = ({ show, onHide, data, historyLog, Tablename }) => {
    const [showHistoryLog, setShowHistoryLog] = useState(false); // State for toggling history log visibility

    if (!data) return null;

    // Mapping field names to display labels
    const columnNameLabels = {
        Code_Fg: "รหัส ERP (Code_Fg)",
        Num: "เบอร์",
        Part_No: "Part No.",
        Sale_Code_Bom: "Code การขาย",
        Type_Customer: "ประเภทลูกค้า",
        Customer_Name: "ชื่อลูกค้า",
        Start_Sale_Date: "วันเริ่มขาย",
        End_Sale_Date: "วันยกเลิกขาย",
        Status: "Status",
        Drawing_No: "Drawing No.",
        Shim_Attach: "การติด Shim",
        Shim_No: "Shim No",
        Product_Spec_No: "Product Spec No.",
        Data_Sheet_No: "Data Sheet No.",
        Display_Box_Id: "เบอร์กล่อง",
        Quantity_Display_Box: "จำนวนกล่อง",
        Outer_Package: "รหัส Outer",
        Outer_Id: "ใส่ Outer",
        Pcs_Per_Set: "จำนวนชิ้น/ชุด",
        Additional_Package_Id: "รหัสการบรรจุที่ใส่อุปกรณ์เสริมเพิ่มเติมมา",
        Customer_Code: "รหัสลูกค้า",
        Ref_Code: "Ref Code_Fg",
        Emark_Id: "Emark Id",
    };

    return (
        <Modal show={show} onHide={onHide} centered size="xl">
            <Modal.Header closeButton>
                <Modal.Title>รายละเอียด: {Tablename}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Main Detail Section */}
                <h5 className="text-primary">Detail Information</h5>
                <div className="row">
                    {[
                        { label: columnNameLabels.Code_Fg, value: data.Code_Fg },
                        { label: columnNameLabels.Num, value: data.Num },
                        { label: columnNameLabels.Part_No, value: data.Part_No },
                        { label: columnNameLabels.Sale_Code_Bom, value: data.Sale_Code_Bom },
                        { label: columnNameLabels.Type_Customer, value: data.Type_Customer },
                        { label: columnNameLabels.Customer_Name, value: data.Customer_Name },
                        { label: columnNameLabels.Start_Sale_Date, value: data.Start_Sale_Date },
                        { label: columnNameLabels.End_Sale_Date, value: data.End_Sale_Date },
                        { label: columnNameLabels.Status, value: data.Status },
                        { label: columnNameLabels.Drawing_No, value: data.Drawing_No },
                        { label: columnNameLabels.Shim_Attach, value: data.Shim_Attach },
                        { label: columnNameLabels.Shim_No, value: data.Shim_No },
                        { label: columnNameLabels.Product_Spec_No, value: data.Product_Spec_No },
                        { label: columnNameLabels.Data_Sheet_No, value: data.Data_Sheet_No },
                        { label: columnNameLabels.Display_Box_Id, value: data.Display_Box_Id },
                        { label: columnNameLabels.Quantity_Display_Box, value: data.Quantity_Display_Box },
                        { label: columnNameLabels.Outer_Package, value: data.Outer_Package },
                        { label: columnNameLabels.Outer_Id, value: data.Outer_Id },
                        { label: columnNameLabels.Pcs_Per_Set, value: data.Pcs_Per_Set },
                        { label: columnNameLabels.Ref_Code, value: data.Ref_Code },
                        { label: columnNameLabels.Customer_Code, value: data.Customer_Code },
                        { label: columnNameLabels.Emark_Id, value: data.Emark_Id },
                        { label: columnNameLabels.Additional_Package_Id, value: data.Additional_Package_Id },
                        { label: "กรอกโดย", value: data.CreateBy },
                        { label: "กรอกเมื่อ", value: convertToUTCPlus7(data.CreateAt) },
                    ].map((field, index) => (
                        <div key={index} className="col-xl-3 col-lg-3 col-md-3 col-sm-6 mb-3">
                            <div className="p-2 border border-primary rounded bg-light">
                                <h6 className="text-secondary mb-1">{field.label}</h6>
                                <p className="m-0">{field.value || "-"}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* History Log Section */}
                {showHistoryLog && (
                    <div className="mt-3">
                        <h5 className="text-primary">ประวัติการแก้ไข</h5>
                        <div className="border p-3 bg-light">
                            {historyLog && historyLog.length > 0 ? (
                                <Timeline>
                                    {historyLog.map((log, index) => (
                                        <Timeline.Item key={index} color="blue">
                                            <p style={{ margin: 0 }}>
                                                <strong>{index + 1}. </strong>
                                                <span>Column: <strong>{columnNameLabels[log.column_name] || log.column_name}</strong> | </span>
                                                <span>Old Value: <strong>{log.old_value || "-"}</strong> | </span>
                                                <span>New Value: <strong>{log.new_value || "-"}</strong> | </span>
                                                <span>Updated By: <strong>{log.action_by || "-"}</strong> | </span>
                                                <span>Updated At: <strong>{convertToUTCPlus7(log.action_at) || "-"}</strong></span>
                                            </p>
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            ) : (
                                <p>ไม่มีประวัติการแก้ไข.</p>
                            )}
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant={showHistoryLog ? "danger" : "primary"}
                    onClick={() => setShowHistoryLog(!showHistoryLog)}
                >
                    {showHistoryLog ? "Hide History Log" : "Show History Log"}
                </Button>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DetailModal;
