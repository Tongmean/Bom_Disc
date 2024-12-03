import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Timeline } from 'antd';
import 'antd/dist/reset.css';
import { convertToUTCPlus7 } from '../../Ultility/Moment-timezone';

const DetailModal = ({ show, onHide, data, historyLog, Tablename }) => {
    const [showHistoryLog, setShowHistoryLog] = useState(false); // State for toggling history log visibility

    if (!data) return null;

    // Updated column_name to labels
    const columnNameLabels = {
        No: "No",
        Data_Sheet_No: "Data Sheet No.",
        Compact_No: "Compact No.",
        Grade_Chem: "เกรดเคมี.",
        Weight_F1: "น้ำหนักเคมี F1",
        Weight_F2: "น้ำหนักเคมี F2",
        Underlayer_Grade_Chem: "เกรดเคมี Underlayer",
        Weight_U1: "น้ำหนักเคมี U1",
        Weight_U2: "น้ำหนักเคมี U2",
        Formular: "สูตร",
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
                        { label: "Data Sheet No.:", value: data.Data_Sheet_No },
                        { label: "Compact No.:", value: data.Compact_No },
                        { label: "เกรดเคมี.:", value: data.Grade_Chem },
                        { label: "น้ำหนักเคมี F1:", value: data.Weight_F1 },
                        { label: "น้ำหนักเคมี F2:", value: data.Weight_F2 },
                        { label: "เกรดเคมี Underlayer:", value: data.Underlayer_Grade_Chem },
                        { label: "น้ำหนักเคมี U1:", value: data.Weight_U1 },
                        { label: "น้ำหนักเคมี U2:", value: data.Weight_U2 },
                        { label: "สูตร:", value: data.Formular },
                        { label: "กรอกโดย:", value: data.CreateBy },
                        { label: "กรอกเมื่อ:", value: convertToUTCPlus7(data.CreateAt) },
                    ].map((field, index) => (
                        <div key={index} className="col-md-4 mb-3"> {/* Changed col-md-6 to col-md-4 for 3 boxes in a row */}
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
