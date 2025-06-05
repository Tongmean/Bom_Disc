import { Link } from 'react-router-dom';
import { Button, Modal, Collapse } from 'react-bootstrap';
import { useState } from 'react';
// import powerQueryscript from '../../Asset/Power-Query-Script.xlsx'
// import env from "react-dotenv";

const HomeDescription = () => {
  return (
    <div>
      <div className="card mb-2">
        <h5 className="card-header">
          ***ขอแนะนำการใช้ระบบการจัดการข้อมูลผลิตภัณฑ์ดิสเบรก
        </h5>
        <div className="card-body">
          <h5 className="card-title">ฐานข้อมูลแบ่งเป็นหลายส่วนที่ผ้กเข้าด้วยกัน เพื่อขึ้นทะเบียนรหัสสินค้าใหม่ (New Product Registration)</h5>  
          <p className="card-text">
            ซึ่งประกอบไปด้วย:
          </p>
          <p className="card-text">
            Product Register:
          </p>
          <p className="card-text">
            Product Spec:    
          </p>
          <p className="card-text">
            Drawing:
          </p>
          <p className="card-text">
            Shim:
          </p>
          <p className="card-text">
            RM/PK:
          </p>
          <p className="card-text">
            Data-sheet:
          </p>
          <p className="card-text">
            Component Part:
          </p>
          <p className="card-text">
            E-mark:
          </p>
          <p className="card-text">
           รูปแบบ Outer:
          </p>
          <p className="card-text">
           โฟมสำเร็จรูปอุปกรณ์เสริม:
          </p>
        </div>
      </div>

      
    </div>
  );
};

export default HomeDescription;
