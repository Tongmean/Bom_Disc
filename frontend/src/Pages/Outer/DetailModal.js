import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Timeline } from "antd";
import "antd/dist/reset.css";
import { convertToUTCPlus7 } from "../../Ultility/Moment-timezone";

const DetailModal = ({ show, onHide, data, historyLog, Tablename }) => {
    const [showHistoryLog, setShowHistoryLog] = useState(false); // State for toggling history log visibility

    if (!data) return null;

    // Mapping column_name to labels based on headerName
    const columnNameLabels = {
        id : "No",
        Outer_Id: "รหัสรูปแบบการบรรจุ",
        Erp_Id_Outer: "รหัส Erp (Outer)",
        Name_Erp_Outer: "ชื่อ Erp (Outer)",
        Num_Outer: "เบอร์กล่อง (Outer)",
        Erp_Id_Inner: "รหัส ERP (Inner)",
        Name_Erp_Inner: "ชื่อ Erp (Inner)",
        Die_Cut: "Die Cut",
        Set_Per_Outer: "จำนวน Set/ Outer",
        Outer_Per_pallet: "จำนวน Outer/ พาเลท",
        Set_Per_Pallet: "จำนวน Set/ พาเลท",

       
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
                        <div key={index} className="col-md-4 mb-3"> {/* Updated to 4 columns per row */}
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
