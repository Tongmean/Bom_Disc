import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Timeline } from 'antd';
import 'antd/dist/reset.css';
import { convertToUTCPlus7 } from '../../Ultility/Moment-timezone';

const DetailModal = ({ show, onHide, data, Tablename, historyLog }) => {
    const [showHistoryLog, setShowHistoryLog] = useState(false); // ✅ this line must be here

    const columnNameLabels = {
        running_no: 'No.',
        Compact_No: 'Part No.',
        sum_max_thick: 'ขนาด STD.',
        sum_max_thick_plus_0_5: 'ขนาดต้องการ.',
        max_area_f_div_100: 'พื่นที่',

        Mold_Code_Cold: 'รหัสแม่พิมพ์เย็น.',
        Pcs_Per_Mold_Cold: 'ชิ้นต่อพิมพ์เย็น.',
        Machine_Code_Cold: 'รหัสเครื่องพิมพ์เย็น.',
        Diameter_Machine_Code_Cold: 'ขนาดกระบอกสูบเครื่องพิมพ์เย็น.',
        Pressure_Cold_Per_pcs: 'แรงดันต่อชิ้นงานพิมพ์เย็น.',
        Presure_Cold: 'แรงดันต่อแม่พิมพ์เย็น.',

        Mold_Code_Hot: 'รหัสแม่พิมพ์ร้อน.',
        Pcs_Per_Mold_Hot: 'ชิ้นต่อพิมพ์ร้อน.',
        Machine_Code_Hot: 'รหัสเครื่องพิมพ์ร้อน.',
        Diameter_Machine_Code_Hot: 'ขนาดกระบอกสูบเครื่องพิมพ์เย็น.',
        pressure_hot_per_pcs: 'แรงดันต่อชิ้นงานพิมพ์ร้อน.',
        Presure_Hot: 'แรงดันต่อพิมพ์แม่พิมพ์ร้อน.',

        Formulation: 'สูตรเคมี.',
        Chem_Grade: 'เกรดเคมี.',
        Weight_F: 'น้ำหนัก F.',
        Weight_U: 'น้ำหนัก U.',
        Program_No: 'Program_No.',
        Compact_No_Modify: 'Drawing No..',


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
                {/* <Button
                    variant={showHistoryLog ? "danger" : "primary"}
                    onClick={() => setShowHistoryLog(!showHistoryLog)}
                >
                    {showHistoryLog ? "Hide History Log" : "Show History Log"}
                </Button> */}
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DetailModal;
