const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');

const getD_Molds = async (req, res) => {
    const mysql = `
        SELECT * FROM "Mold"
        ORDER BY id ASC 
    `
    try {
        dbconnect.query(mysql, (err, result) => {
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
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "มีปัญาเกิดขึ้นระว่างการดึงข้อมูล",
            data: error
        });
    }
};

//Get Single record by id
const getD_Mold = async (req, res) => {
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "Mold" WHERE id = $1' , [id],(err, result) =>{
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



const postD_Mold = async (req, res) =>{
    const userEmail = req.user.email;
    const {
        Mold_Code,
        Type_Mold,
        Area,
        Full_Hole_Quantity,
        Hole_Deformation_Quantity,
        Hole_Balance_Quantity,
        Hole_Active_Quantity,
        Hole_Deformation_Position,
        CreateBy,
    } = req.body;

    try {
        // Check for duplicate 
        const sqlCheck = `SELECT * FROM "Mold" WHERE "Mold_Code" = $1`;
        const checkResult = await dbconnect.query(sqlCheck, [Mold_Code]);
        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkResult.rows,
                msg: `รหัสแม่พิมพ์: ${Mold_Code} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }
        // Insert New Record
        const sqlCommand = `
            INSERT INTO "Mold" (
                "Mold_Code", "Type_Mold", "Area", "Full_Hole_Quantity",
                "Hole_Deformation_Quantity", "Hole_Balance_Quantity", "Hole_Active_Quantity",
                "Hole_Deformation_Position", "CreateBy"
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *
        `;
        const values = [
            Mold_Code,
            Type_Mold,
            Area,
            Full_Hole_Quantity,
            Hole_Deformation_Quantity,
            Hole_Balance_Quantity,
            Hole_Active_Quantity,
            Hole_Deformation_Position,
            userEmail
        ]
        const insertResult = await dbconnect.query(sqlCommand, values);
        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `รหัสแม่พิมพ์: ${Mold_Code} บันทึกได้สำเร็จ ครับ`
        });

    } catch (error) {
        console.log('error', error)
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}

const updateD_Mold = async (req, res) =>{
    const id = req.params.id;
    const userEmail = req.user.email;
    const {
        Mold_Code,
        Type_Mold,
        Area,
        Full_Hole_Quantity,
        Hole_Deformation_Quantity,
        Hole_Balance_Quantity,
        Hole_Active_Quantity,
        Hole_Deformation_Position,
        CreateBy,
    } = req.body;
    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Mold" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];
        const currentValueCreateBy = currentValueResult.rows[0].CreateBy;
        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลที่มีรหัส: ${Mold_Code}`,
            });
        }
        // Update section
        const updateSql =  `
            UPDATE "Mold" SET
            "Mold_Code" = $1,
            "Type_Mold" = $2,
            "Area" = $3,
            "Full_Hole_Quantity" = $4,
            "Hole_Deformation_Quantity" = $5,
            "Hole_Balance_Quantity" = $6,
            "Hole_Active_Quantity" = $7,
            "Hole_Deformation_Position" = $8,
            "CreateBy" = $9
            WHERE "id" = $10 RETURNING *
        `;
        const values = [
            Mold_Code,
            Type_Mold,
            Area,
            Full_Hole_Quantity,
            Hole_Deformation_Quantity,
            Hole_Balance_Quantity,
            Hole_Active_Quantity,
            Hole_Deformation_Position,
            currentValueCreateBy,
            id,
        ];
        //Update Query
        const updateResult = await dbconnect.query(updateSql, values);
        const updatedRecord = updateResult.rows[0];
        if(updatedRecord){
            res.status(200).json({
                success: true,
                data: updatedRecord,
                msg: `อัปเดตข้อมูล: ${Mold_Code} สำเร็จ`,
            });
        }
        // Log changes
        const columns = [
            "Mold_Code", "Type_Mold", "Area", "Full_Hole_Quantity",
            "Hole_Deformation_Quantity", "Hole_Balance_Quantity", "Hole_Active_Quantity",
            "Hole_Deformation_Position"
        ];
        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("Mold", column, id, oldValue, newValue, "updated" , userEmail);
            }
        }
    } catch (error) {
        console.log("Error updating BOM:", error);
        res.status(500).json({
            success: false,
            msg: `เกิดข้อผิดพลาดขณะอัปเดตข้อมูล: ${Machine_Code} กรุณาลองอีกครั้ง.`,
            data: error.message,
        });
    }
}
module.exports ={
    getD_Molds,
    getD_Mold,
    postD_Mold,
    updateD_Mold  
}