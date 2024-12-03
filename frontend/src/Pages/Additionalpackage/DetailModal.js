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
        Additional_Package_Id: "รหัสการบรรจุที่ใส่อุปกรณ์เสริมเพิ่มมา",
        Additional_Tool_Erp_Id_1: "รหัส ERP โฟมและอุปกรณ์เสริม 1",
        Name_Additional_Tool_1: "ชื่อ ERP โฟมและอุปกรณ์เสริม 1",
        Quantity_Additional_Tool_1: "จำนวนโฟมและอุปกรณ์เสริม 1",
        Additional_Tool_Erp_Id_2: "รหัส ERP โฟมและอุปกรณ์เสริม 2",
        Name_Additional_Tool_2: "ชื่อ ERP โฟมและอุปกรณ์เสริม 2",
        Quantity_Additional_Tool_2: "จำนวนโฟมและอุปกรณ์เสริม 2",
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
                        { label: "รหัสการบรรจุที่ใส่อุปกรณ์เสริมเพิ่มมา:", value: data.Additional_Package_Id },
                        { label: "รหัส ERP โฟมและอุปกรณ์เสริม 1:", value: data.Additional_Tool_Erp_Id_1 },
                        { label: "ชื่อ ERP โฟมและอุปกรณ์เสริม 1:", value: data.Name_Additional_Tool_1 },
                        { label: "จำนวนโฟมและอุปกรณ์เสริม 1:", value: data.Quantity_Additional_Tool_1 },
                        { label: "รหัส ERP โฟมและอุปกรณ์เสริม 2:", value: data.Additional_Tool_Erp_Id_2 },
                        { label: "ชื่อ ERP โฟมและอุปกรณ์เสริม 2:", value: data.Name_Additional_Tool_2 },
                        { label: "จำนวนโฟมและอุปกรณ์เสริม 2:", value: data.Quantity_Additional_Tool_2 },
                        { label: "กรอกโดย:", value: data.CreateBy },
                        { label: "กรอกเมื่อ:", value: convertToUTCPlus7(data.CreateAt) },
                    ].map((field, index) => (
                        <div key={index} className="col-md-6 mb-3">
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
