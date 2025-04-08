import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
// import { Timeline } from 'antd';
import 'antd/dist/reset.css';
// import { convertToUTCPlus7 } from '../../Ultility/Moment-timezone';

const DetailModal = ({ show, onHide, data, Tablename, columnDefs }) => {

    if (!data) return null;
    // console.log('data', data)
    return (
        <Modal show={show} onHide={onHide} centered size="xl">
            <Modal.Header closeButton>
                <Modal.Title>รายละเอียด: {Tablename}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Main Detail Section */}
                <h5 className="text-primary">Detail Information</h5>
                <div className="row">
                    {/* {columnDefs.map((field, index) => (
                        <div key={index} className="col-xl-3 col-lg-3 col-md-3 col-sm-6 mb-3">
                            <div className="p-2 border border-primary rounded bg-light">
                                <h6 className="text-secondary mb-1">{field.headerName}</h6>
                                <p className="m-0">{data[field.field] || "-"}</p>
                            </div>
                        </div>
                    ))} */}
                    {columnDefs
                    .filter(field => field.field !== "Actions") // Exclude "Actions" field
                    .map((field, index) => (
                        <div key={index} className="col-xl-3 col-lg-3 col-md-3 col-sm-6 mb-3">
                            <div className="p-2 border border-primary rounded bg-light">
                                <h6 className="text-secondary mb-1">{field.headerName}</h6>
                                <p className="m-0">{data[field.field] || "-"}</p>
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
