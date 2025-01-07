import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Timeline } from "antd";
import "antd/dist/reset.css";
import { convertToUTCPlus7 } from "../../Ultility/Moment-timezone";

const DetailModal = ({ show, onHide, data, historyLog, Tablename }) => {
    const [showHistoryLog, setShowHistoryLog] = useState(false); // State for toggling history log visibility

    if (!data) return null;

    // Mapping column_name to labels
    const columnNameLabels = [
        { headerName: "รหัสเรียก", field: "Rm_Pk_Id" },
        { headerName: "กลุ่มสินค้า", field: "Mat_Cat" },
        { headerName: "กลุ่ม", field: "Group" },
        { headerName: "กลุ่มสินค้าย่อย", field: "Sub_Mat_Cat" },
        { headerName: "รหัสสินค้า Erp", field: "Erp_Id" },
        { headerName: "ชื่อสินค้า Erp", field: "Name_Erp" },
        { headerName: "ขนาด (Dimension)", field: "Dimension" },
        { headerName: "น้ำหนัก", field: "Weight" },
        { headerName: "Spec", field: "Spec" },
        { headerName: "หน่วย", field: "Unit" },
        { headerName: "Status", field: "Status" },
        { headerName: "CreateBy", field: "กรอกโดย" },
        { headerName: "CreateAt", field: "กรอกเมื่อ" },
    ];

    return (
        <Modal show={show} onHide={onHide} centered size="xl">
            <Modal.Header closeButton>
                <Modal.Title>รายละเอียด: {Tablename}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Main Detail Section */}
                <h5 className="text-primary">Detail Information</h5>
                <div className="row">
                    {columnNameLabels.map((label, index) => (
                        <div key={index} className="col-md-4 mb-3">
                            <div className="p-2 border border-primary rounded bg-light">
                                <h6 className="text-secondary mb-1">{label.headerName}</h6>
                                <p className="m-0">{data[label.field] || "-"}</p>
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
                                                <span>
                                                    Column:{" "}
                                                    <strong>
                                                        {columnNameLabels.find(
                                                            (col) => col.field === log.column_name
                                                        )?.headerName || log.column_name}
                                                    </strong>{" "}
                                                    |{" "}
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
                                                    Updated At:{" "}
                                                    <strong>{convertToUTCPlus7(log.action_at) || "-"}</strong>
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
