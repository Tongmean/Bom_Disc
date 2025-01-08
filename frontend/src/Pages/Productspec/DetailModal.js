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
        Customer_Name_Product_Spec: 'ชื่อลูกค้า',
        Customer_Code: 'รหัสลูกค้า',
        Sale_Code: 'Code การขาย',
        Product_Spec_Id: 'รหัส Product Spec',
        Chem_Formular: 'สูตรเคมี',
        Formula_Under_Layer: 'สูตร Under layer',
        Coating: 'Coating',
        Scoarching: 'Scoarching',
        Scoarching_Coating_Id: 'รหัสการ Scoarching/Coating',
        Shim: 'ติดแผน Shim',
        Slot: 'Slot',
        Chamfer: 'Chamfer',
        Color: 'พ่นสี',
        Color_Id: 'รหัสสี',
        Sticker_Erp_Id_1: 'รหัส ERP สติกเกอร์ 1',
        Sticker_Name_1: 'ชื่อสติกเกอร์ 1',
        Num_Sticker_1: 'จำนวน สติกเกอร์ 1',
        Sticker_Erp_Id_2: 'รหัส ERP สติกเกอร์ 2',
        Sticker_Name_2: 'ชื่อสติกเกอร์ 2',
        Num_Sticker_2: 'จำนวน สติกเกอร์ 2',
        Sticker_Erp_Id_3: 'รหัส ERP สติกเกอร์ 3',
        Sticker_Name_3: 'ชื่อสติกเกอร์ 3',
        Num_Sticker_3: 'จำนวน สติกเกอร์ 3',
        Attach_Paper_Erp_Id_1: 'รหัส ERP ใบแนบ 1',
        Name_Attach_Paper_1: 'ชื่อใบแนบ 1',
        Num_Attach_1: 'จำนวนใบแนบ 1',
        Attach_Paper_Erp_Id_2: 'รหัส ERP ใบแนบ 2',
        Name_Attach_Paper_2: 'ชื่อใบแนบ 2',
        Num_Attach_2: 'จำนวนใบแนบ 2',
        Attach_Paper_Erp_Id_3: 'รหัส ERP ใบแนบ 3',
        Name_Attach_Paper_3: 'ชื่อใบแนบ 3',
        Num_Attach_3: 'จำนวนใบแนบ 3',
        Attach_Paper_Erp_Id_4: 'รหัส ERP ใบแนบ 4',
        Name_Attach_Paper_4: 'ชื่อใบแนบ 4',
        Num_Attach_4: 'จำนวนใบแนบ 4',
        Additional_Tool_Erp_Id_1: 'รหัส ERP อุปกรณ์เสริมอื่น 1',
        Name_Erp_Additional_Tool_1: 'ชื่อ ERP อุปกรณ์เสริมอื่น 1',
        Num_Additional_Tool_1: 'จำนวน อุปกรณ์เสริมอื่น 1',
        Additional_Tool_Erp_Id_2: 'รหัส ERP อุปกรณ์เสริมอื่น 2',
        Name_Erp_Additional_Tool_2: 'ชื่อ ERP อุปกรณ์เสริมอื่น 2',
        Num_Additional_Tool_2: 'จำนวน อุปกรณ์เสริมอื่น 2',
        Additional_Tool_Erp_Id_3: 'รหัส ERP อุปกรณ์เสริมอื่น 3',
        Name_Erp_Additional_Tool_3: 'ชื่อ ERP อุปกรณ์เสริมอื่น 3',
        Num_Additional_Tool_3: 'จำนวน อุปกรณ์เสริมอื่น 3',
        Status: 'Status',
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
                    {Object.keys(columnNameLabels).map((key, index) => (
                        <div key={index} className="col-xl-3 col-lg-3 col-md-3 col-sm-6 mb-3"> {/* Updated to 4 columns per row */}
                            <div className="p-2 border border-primary rounded bg-light">
                                <h6 className="text-secondary mb-1">
                                    {columnNameLabels[key]}:
                                </h6>
                                <p className="m-0">{data[key]}</p>
                            </div>
                        </div>
                    ))}
                    <div className="col-md-4 mb-3">
                        <div className="p-2 border border-primary rounded bg-light">
                            <h6 className="text-secondary mb-1">กรอกโดย:</h6>
                            <p className="m-0">{data.CreateBy || "-"}</p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="p-2 border border-primary rounded bg-light">
                            <h6 className="text-secondary mb-1">กรอกเมื่อ:</h6>
                            <p className="m-0">{convertToUTCPlus7(data.CreateAt) || "-"}</p>
                        </div>
                    </div>
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
                                                <span>
                                                    Column: <strong>{columnNameLabels[log.column_name] || log.column_name}</strong> |{" "}
                                                </span>
                                                <span>
                                                    Old Value: <strong>{log.old_value || "-"}</strong> |{" "}
                                                </span>
                                                <span>
                                                    New Value: <strong>{log.new_value || "-"}</strong> |{" "}
                                                </span>
                                                <span>
                                                    Updated By: <strong>{log.action_by || "-"}</strong> |{" "}
                                                </span>
                                                <span>
                                                    Updated At: <strong>{convertToUTCPlus7(log.action_at) || "-"}</strong>
                                                </span>
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
