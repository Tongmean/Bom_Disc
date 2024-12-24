import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Timeline } from 'antd';
import 'antd/dist/reset.css';
import { convertToUTCPlus7 } from '../../Ultility/Moment-timezone';

const DetailModal = ({ show, onHide, data, historyLog, Tablename }) => {
    const [showHistoryLog, setShowHistoryLog] = useState(false);

    if (!data) return null;

    // Define fields dynamically from the given headerName and field mapping
    const fields = [
        { label: 'ที่', value: 'id' },
        { label: 'Compact_No (ปรับ)', value: 'Compact_No_Modify' },
        { label: 'Compact_No (Catalog)', value: 'Compact_No_Catalog' },
        { label: 'Drawing Number', value: 'Drawing_no' },
        { label: 'Type Drawing', value: 'Type_Drawing' },
        { label: 'เบอร์', value: 'Num' },
        { label: 'Sheet', value: 'Sheet' },
        { label: 'Date Approve', value: 'Data_Approve' },
        { label: 'Edion', value: 'Edion' },
        { label: 'รหัสตู้', value: 'Cabinet_Id' },
        { label: 'หมายเหตุ', value: 'Remark' },
        { label: 'Document_Id', value: 'รหัสเอกสาร' },
        { label: 'Type1', value: 'Type1' },
        { label: 'Type2', value: 'Type2' },
        { label: 'Type3', value: 'Type3' },
        { label: 'ID', value: 'ID' },
        { label: 'กว้าง', value: 'Width' },
        { label: 'ยาว', value: 'Length' },
        { label: 'หนา', value: 'Thick' },
        { label: 'หนารวมชิม', value: 'Shim_Thick' },
        { label: 'สูง', value: 'Height' },
        { label: 'ระยะการใช้งาน', value: 'Working_Duration' },
        { label: 'ขนาดรู', value: 'Hole_Scale' },
        { label: 'จำนวนชิ้น', value: 'Quantity_Shim' },
        { label: 'Option', value: 'Option' },
        { label: 'Area', value: 'Area' },
        { label: 'เจาะรู', value: 'Drill' },
        { label: 'ลักษณะชิม', value: 'Type_Shim' },
        { label: 'กรอกเมื่อ', value: 'create_at', formatter: convertToUTCPlus7 },
        { label: 'กรอกโดย', value: 'create_by' },
    ];

    // Create a mapping of column names to their labels
    const columnLabelMap = fields.reduce((map, field) => {
        map[field.value] = field.label;
        return map;
    }, {});

    return (
        <Modal show={show} onHide={onHide} centered size="xl">
            <Modal.Header closeButton>
                <Modal.Title>รายละเอียด: {Tablename}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Main Detail Section */}
                <h5 className="text-primary">Detail Information</h5>
                <div className="row">
                    {fields.map((field, index) => (
                        <div key={index} className="col-xl-3 col-lg-3 col-md-3 col-sm-6 mb-3">
                            <div className="p-2 border border-primary rounded bg-light">
                                <h6 className="text-secondary mb-1">{field.label}</h6>
                                <p className="m-0">{field.formatter ? field.formatter(data[field.value]) : data[field.value] || "-"}</p>
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
                                                <span>Column: <strong>{columnLabelMap[log.column_name] || log.column_name}</strong> | </span>
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