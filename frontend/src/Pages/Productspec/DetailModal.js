import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Timeline } from 'antd';
import 'antd/dist/reset.css';
import { convertToUTCPlus7 } from '../../Ultility/Moment-timezone';

const DetailModal = ({ show, onHide, data, historyLog, Tablename }) => {
    const [showHistoryLog, setShowHistoryLog] = useState(false); // State for toggling history log visibility

    if (!data) return null;

    // Mapping column_name to labels
    const columnNameLabels = {
        Product_Spec_Id: 'รหัส Product Spec',
        Sale_Code: 'Code การขาย',
        Coating: 'Coating',
        Scoarching: 'Scoarching',
        Scoarching_Coating_Id: 'รหัสการ Scoarching/Coating',
        Shim: 'ติดแผน Shim',
        Slot: 'Slot',
        Chamfer: 'Chamfer',
        Color: 'พ่นสี',
        Color_Id: 'รหัสสี',
        Customer_Name_Product_Spec: 'ชื่อลูกค้า',
        Chem_Formular: 'สูตรเคมี',
        Formula_Under_Layer: 'สูตร Under layer',
        Sticker_Name_1: 'ชื่อสติกเกอร์ 1',
        Sticker_Erp_Id_1: 'รหัส ERP สติกเกอร์ 1',
        Num_Sticker_1: 'จำนวน สติกเกอร์ 1',
        Sticker_Name_2: 'ชื่อสติกเกอร์ 2',
        Sticker_Erp_Id_2: 'รหัส ERP สติกเกอร์ 2',
        Num_Sticker_2: 'จำนวน สติกเกอร์ 2',
        Sticker_Name_3: 'ชื่อสติกเกอร์ 3',
        Sticker_Erp_Id_3: 'รหัส ERP สติกเกอร์ 3',
        Num_Sticker_3: 'จำนวน สติกเกอร์ 3',
        Name_Attach_Paper_1: 'ชื่อใบแนบ 1',
        Attach_Paper_Erp_Id_1: 'รหัส ERP ใบแนบ 1',
        Num_Attach_1: 'จำนวนใบแนบ 1',
        Name_Attach_Paper_2: 'ชื่อใบแนบ 2',
        Attach_Paper_Erp_Id_2: 'รหัส ERP ใบแนบ 2',
        Num_Attach_2: 'จำนวนใบแนบ 2',
        Name_Attach_Paper_3: 'ชื่อใบแนบ 3',
        Attach_Paper_Erp_Id_3: 'รหัส ERP ใบแนบ 3',
        Num_Attach_3: 'จำนวนใบแนบ 3',
        Name_Attach_Paper_4: 'ชื่อใบแนบ 4',
        Attach_Paper_Erp_Id_4: 'รหัส ERP ใบแนบ 4',
        Num_Attach_4: 'จำนวนใบแนบ 4',
        Name_Erp_Additional_Tool: 'ชื่อ ERP อุปกรณ์เสริมอื่น ๆ',
        Additional_Tool_Erp_Id: 'รหัส ERP อุปกรณ์เสริมอื่น ๆ',
        Num_Additional_Tool: 'จำนวน อุปกรณ์เสริมอื่น ๆ',
        Column_36: 'Column_36'
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
                        { label: "No:", value: data.No },
                        { label: "รหัส Product Spec:", value: data.Product_Spec_Id },
                        { label: "Code การขาย:", value: data.Sale_Code },
                        { label: "Coating:", value: data.Coating },
                        { label: "Scoarching:", value: data.Scoarching },
                        { label: "รหัสการ Scoarching/Coating:", value: data.Scoarching_Coating_Id },
                        { label: "ติดแผน Shim:", value: data.Shim },
                        { label: "Slot:", value: data.Slot },
                        { label: "Chamfer:", value: data.Chamfer },
                        { label: "พ่นสี:", value: data.Color },
                        { label: "รหัสสี:", value: data.Color_Id },
                        { label: "ชื่อลูกค้า:", value: data.Customer_Name_Product_Spec },
                        { label: "สูตรเคมี:", value: data.Chem_Formular },
                        { label: "สูตร Under layer:", value: data.Formula_Under_Layer },
                        { label: "ชื่อสติกเกอร์ 1:", value: data.Sticker_Name_1 },
                        { label: "รหัส ERP สติกเกอร์ 1:", value: data.Sticker_Erp_Id_1 },
                        { label: "จำนวน สติกเกอร์ 1:", value: data.Num_Sticker_1 },
                        { label: "ชื่อสติกเกอร์ 2:", value: data.Sticker_Name_2 },
                        { label: "รหัส ERP สติกเกอร์ 2:", value: data.Sticker_Erp_Id_2 },
                        { label: "จำนวน สติกเกอร์ 2:", value: data.Num_Sticker_2 },
                        { label: "ชื่อสติกเกอร์ 3:", value: data.Sticker_Name_3 },
                        { label: "รหัส ERP สติกเกอร์ 3:", value: data.Sticker_Erp_Id_3 },
                        { label: "จำนวน สติกเกอร์ 3:", value: data.Num_Sticker_3 },
                        { label: "ชื่อใบแนบ 1:", value: data.Name_Attach_Paper_1 },
                        { label: "รหัส ERP ใบแนบ 1:", value: data.Attach_Paper_Erp_Id_1 },
                        { label: "จำนวนใบแนบ 1:", value: data.Num_Attach_1 },
                        { label: "ชื่อใบแนบ 2:", value: data.Name_Attach_Paper_2 },
                        { label: "รหัส ERP ใบแนบ 2:", value: data.Attach_Paper_Erp_Id_2 },
                        { label: "จำนวนใบแนบ 2:", value: data.Num_Attach_2 },
                        { label: "ชื่อใบแนบ 3:", value: data.Name_Attach_Paper_3 },
                        { label: "รหัส ERP ใบแนบ 3:", value: data.Attach_Paper_Erp_Id_3 },
                        { label: "จำนวนใบแนบ 3:", value: data.Num_Attach_3 },
                        { label: "ชื่อใบแนบ 4:", value: data.Name_Attach_Paper_4 },
                        { label: "รหัส ERP ใบแนบ 4:", value: data.Attach_Paper_Erp_Id_4 },
                        { label: "จำนวนใบแนบ 4:", value: data.Num_Attach_4 },
                        { label: "ชื่อ ERP อุปกรณ์เสริมอื่น ๆ:", value: data.Name_Erp_Additional_Tool },
                        { label: "รหัส ERP อุปกรณ์เสริมอื่น ๆ:", value: data.Additional_Tool_Erp_Id },
                        { label: "จำนวน อุปกรณ์เสริมอื่น ๆ:", value: data.Num_Additional_Tool },
                        { label: "Column_36:", value: data.Column_36 },
                        { label: "กรอกโดย:", value: data.CreateBy },
                        { label: "กรอกเมื่อ:", value: convertToUTCPlus7(data.CreateAt) },
                    ].map((field, index) => (
                        <div key={index} className="col-md-4 mb-3">
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
                        <h5 className="text-primary">ประวิติการแก้ไข</h5>
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
                                <p>ไม่มี ประวิติการแก้ไข.</p>
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
