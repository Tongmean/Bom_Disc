import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
// import { Timeline } from 'antd';
import 'antd/dist/reset.css';
// import { convertToUTCPlus7 } from '../../Ultility/Moment-timezone';

const DetailModal = ({ show, onHide, data, Tablename }) => {

    // console.log('data', data)
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
                    {[
                        { label: "Code_Fg:", value: data.Code_Fg },
                        { label: "รหัส Product Spec:", value: data.Product_Spec_No },
                        { label: "Code การขาย:", value: data.Sale_Code_Bom },
                        { label: "Coating:", value: data.Coating },
                        { label: "Scoarching:", value: data.Scoarching },
                        { label: "รหัสการ Scoarching/Coating:", value: data.Scoarching_Coating_Id },
                        { label: "ติดแผน Shim:", value: data.Shim },
                        { label: "Shim:", value: data.Compact_No_Modify },
                        { label: "Slot:", value: data.Slot },
                        { label: "Chamfer:", value: data.Chamfer },
                        { label: "พ่นสี:", value: data.Color },
                        { label: "รหัสสี:", value: data.Color_Id },
                        { label: "รูปแบบการบรรจุ Outer:", value: data.Outer_Id },
                        { label: "รหัส ERP (Inner):", value: data.Erp_Id_Inner },
                        { label: "รหัส ERP (Outer):", value: data.Erp_Id_Outer },
                        { label: "Set Per Outer:", value: data.Set_Per_Outer },
                    ].map((field, index) => (
                        <div key={index} className="col-md-4 mb-3">
                            <div className="p-2 border border-primary rounded bg-light">
                                <h6 className="text-secondary mb-1">{field.label}</h6>
                                <p className="m-0">{field.value || "-"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DetailModal;
