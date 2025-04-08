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
            Compact_No_Modify_Drawing: "Compact No (ปรับ)",
            Part_No: "Part No.",
            Erp_Id_BP1: "รหัส ERP BP1",
            Name_BP1: "ชื่อ ERP BP1",
            Id_BP1: "ID BP1",
            Quantity_BP1: "จำนวน BP1",
            Thickness_Pad1: "ความหนาผ้า 1",
            Erp_Id_BP2: "รหัส ERP BP2",
            Name_BP2: "ชื่อ ERP BP2",
            Id_BP2: "ID BP2",
            Quantity_BP2: "จำนวน BP2",
            Thickness_Pad2: "ความหนาผ้า 2",
            Erp_Id_BP3: "รหัส ERP BP3",
            Name_BP3: "ชื่อ ERP BP3",
            Id_BP3: "ID BP3",
            Quantity_BP3: "จำนวน BP3",
            Thickness_Pad3: "ความหนาผ้า 3",
            Erp_Id_BP4: "รหัส ERP BP4",
            Name_BP4: "ชื่อ ERP BP4",
            Id_BP4: "ID BP4",
            Quantity_BP4: "จำนวน BP4",
            Thickness_Pad4: "ความหนาผ้า 4",
            Erp_Id_WD1: "รหัส ERP WD1",
            Name_WD1: "ชื่อ ERP WD1",
            Id_WD1: "ID WD1",
            Quantity_WD1: "จำนวน WD1",
            Erp_Id_WD2: "รหัส ERP WD2",
            Name_WD2: "ชื่อ ERP WD2",
            Id_WD2: "ID WD2",
            Quantity_WD2: "จำนวน WD2",
            Erp_Id_WD3: "รหัส ERP WD3",
            Name_WD3: "ชื่อ ERP WD3",
            Id_WD3: "ID WD3",
            Quantity_WD3: "จำนวน WD3",
            Status: "Status",
            CreateBy: "กรอกโดย",
            CreateAt: "กรอกเมื่อ",
            Check_Status: "Check Status",
            Remark: "Remark",
            Check_By: "ตรวจสอบโดย",
            Check_At: "ตรวจสอบเมื่อ"
        };
        // { headerName: 'Check Status', field: 'Check_Status' },
        // { headerName: 'Remark', field: 'Remark' },
    return (
        <Modal show={show} onHide={onHide} centered size="xl">
            <Modal.Header closeButton>
                <Modal.Title>รายละเอียด: {Tablename}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Main Detail Section */}
                <h5 className="text-primary">Detail Information</h5>
                <div className="row">
                    {Object.entries(columnNameLabels).map(([key, label], index) => (
                        <div key={index} className="col-xl-3 col-lg-3 col-md-3 col-sm-6 mb-3">
                            <div className="p-2 border border-primary rounded bg-light">
                                <h6 className="text-secondary mb-1">{label}</h6>
                                {/* <p className="m-0">{data[key]}</p> */}
                                <p className="m-0">
                                    {["Check_At", "CreateAt"].includes(key) ? convertToUTCPlus7(data[key]) : data[key]}
                                </p>
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
