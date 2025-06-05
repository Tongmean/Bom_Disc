import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Timeline } from 'antd';
import 'antd/dist/reset.css';
import { convertToUTCPlus7 } from '../../Ultility/Moment-timezone';

const DetailModal = ({ show, onHide, data, Tablename, historyLog }) => {
    const [showHistoryLog, setShowHistoryLog] = useState(false); // ✅ this line must be here

    const columnNameLabels = {
        No: 'No',    
        Mold_Machine_Code: 'Mold+Machine',
        Mold_Code: 'รหัสแม่พิมพ์',
        Machine_Code: 'ประเภทเครื่องจักร',
        Description: 'ประเภท',
        
        CreateBy: 'กรอกโดย',
        CreateAt: 'กรอกเมื่อ',
    
    };

    if (!data) return null;

    return (
        <Modal show={show} onHide={onHide} centered size="xl">
            <Modal.Header closeButton>
                <Modal.Title>รายละเอียด: {Tablename}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Main Detail Section */}
                <h5 className="text-primary">Detail Information</h5>
                <div className="row">
                    {Object.entries(columnNameLabels).map(([field, label], index) => (
                        <div key={index} className="col-xl-3 col-lg-3 col-md-4 col-sm-6 mb-3">
                            <div className="p-2 border border-primary rounded bg-light h-100">
                                <h6 className="text-secondary mb-1">{label}</h6>
                                <p className="m-0">
                                    {field === "CreateAt"
                                        ? convertToUTCPlus7(data[field]) || "-"
                                        : data[field] ?? "-"
                                    }
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* History Log Section */}
                {showHistoryLog && (
                    <div className="mt-4">
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
