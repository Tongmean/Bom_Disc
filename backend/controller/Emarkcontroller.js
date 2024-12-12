const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');
//Get all record
const getEmarks = (req, res) =>{
    try {
        dbconnect.query(`SELECT * FROM "Emark" `, (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    msg: "ดึงข้อมูลไม่สำเร็จ",
                    data: err // 'result' would be undefined in case of error
                });
            } else {
                res.status(200).json({
                    success: true,
                    msg: "ดึงข้อมูลทั้งหมดได้สำเร็จ",
                    data: result.rows // PostgreSQL returns data in 'rows'
                });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "มีปัญาเกิดขึ้นระว่างการดึงข้อมูล",
            data: error
        });
    }
}
//Get Single record by id
const getEmark = async (req,res) =>{
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "Emark" WHERE id = $1' , [id],(err, result) =>{
            if(err){
                console.log(err);
                res.status(500).json({
                    success: true,
                    msg: `ดึงข้อมูลไม่สำเร็จ`,
                    data: err
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: `ดึงข้อมูลทั้งหมดได้สำเร็จ`,
                    data: result.rows
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: true,
            msg: `มีปัญาเกิดขึ้นระว่างการดึงข้อมูล`,
            data: error
        })
    }

}

//Post emark
const postEmark = async (req, res) =>{
    const userEmail = req.user.email; // This email comes from requireAuth
    const { Emark_Id, Part_No, Brake_Pad, Material, Type_Emark, Approval_Code, Revision, Approved_Date, Status} = req.body;
    try {
        // Check for duplicate Code_Fg
        const sqlCheck = `SELECT * FROM "Emark" WHERE "Emark_Id" = $1`;
        const checkResult = await dbconnect.query(sqlCheck, [Emark_Id]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkResult.rows,
                msg: `รหัส: ${Emark_Id} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }
        //Insert New Record
        const sqlCommand = `
            INSERT INTO "Emark" 
            ("Emark_Id", "Part_No", "Brake_Pad", "Material", "Type_Emark", "Approval_Code", "Revision", "Approved_Date", "Status", "create_by")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *
        `;
        const values = [Emark_Id, Part_No, Brake_Pad, Material, Type_Emark, Approval_Code, Revision, Approved_Date, Status, userEmail];
        
        const insertResult = await dbconnect.query(sqlCommand, values);

        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `รหัส: ${Emark_Id} บันทึกได้สำเร็จ ครับ`
        });
        
    } catch (error) {
        console.log('erroremark', error)
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}
//Update emark
const updateEmark = async (req, res) =>{
    const id = req.params.id;
    const userEmail = req.user.email; // Authenticated user email
    const { Emark_Id, Part_No, Brake_Pad, Material, Type_Emark, Approval_Code, Revision, Approved_Date, Status} = req.body;
    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Emark" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];

        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลที่มีรหัส: `,
            });
        }
        //Update Record
        const updateSql = `UPDATE "Emark" SET 
            "Emark_Id" = $1,
            "Part_No" = $2, 
            "Brake_Pad" = $3, 
            "Material" = $4, 
            "Type_Emark" = $5, 
            "Approval_Code" = $6, 
            "Revision" = $7, 
            "Approved_Date" = $8, 
            "Status" = $9, 
            "create_by" = $10 
            WHERE "id" = $11 RETURNING *
        ;`;

        const values = [Emark_Id, Part_No, Brake_Pad, Material, Type_Emark, Approval_Code, Revision, Approved_Date, Status, userEmail, id];
        const updateResult = await dbconnect.query(updateSql, values);
        const updatedRecord = updateResult.rows[0];

        const columns = [
            "Emark_Id", "Part_No", "Brake_Pad", "Material", "Type_Emark", "Approval_Code", "Revision", "Approved_Date","Status"
        ];

        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("Emark", column, id, oldValue, newValue, "updated" , userEmail);
            }
        }

        // Response
        res.status(200).json({
            success: true,
            data: updatedRecord,
            msg: `อัปเดตข้อมูล: ${Emark_Id} สำเร็จ`,
        });       

    } catch (error) {
        console.error("Error updating BOM:", error);
        res.status(500).json({
            success: false,
            msg: `เกิดข้อผิดพลาดขณะอัปเดตข้อมูล: กรุณาลองอีกครั้ง.`,
            data: error.message,
        });
    }
}
module.exports = {
    getEmark,
    getEmarks,
    postEmark,
    updateEmark

}