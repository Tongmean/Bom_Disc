//call database connection
const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');

//Get All record
const getShims = async (req, res) => {
    try {
        dbconnect.query(`SELECT * FROM "Shim"`, (err, result) => {
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
};

//Get Single record by id
const getShim = async (req,res) =>{
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "Shim" WHERE id = $1' , [id],(err, result) =>{
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

//post shim
const postShim = async (req, res) =>{
    const userEmail = req.user.email; // This email comes from requireAuth
    const {Compact_No_Modify, Part_No, Name_SP1, Erp_Id_SP1, Id_SP1, Quantity_SP1, Name_SP2, Erp_Id_SP2, Id_SP2, Quantity_SP2, Name_SP3, Erp_Id_SP3, Id_SP3, Quantity_SP3, CreateBy, Status} = req.body;
    try {
        // Check for duplicate value
        const sqlCheck = `SELECT * FROM "Shim" WHERE "Compact_No_Modify" = $1`;
        const checkResult = await dbconnect.query(sqlCheck, [Compact_No_Modify]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkResult.rows,
                msg: `รหัส Compact No(ปรับ): ${Compact_No_Modify} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }
        //INsert New Shim
        const sqlCommand = `
            INSERT INTO "Shim" ("Compact_No_Modify", "Part_No", "Name_SP1", "Erp_Id_SP1", "Id_SP1","Quantity_SP1", "Name_SP2", "Erp_Id_SP2", "Id_SP2","Quantity_SP2", "Name_SP3", "Erp_Id_SP3", "Id_SP3","Quantity_SP3","CreateBy", "Status")
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING*
        `
        const values = [Compact_No_Modify, Part_No, Name_SP1, Erp_Id_SP1, Id_SP1, Quantity_SP1, Name_SP2, Erp_Id_SP2, Id_SP2, Quantity_SP2, Name_SP3, Erp_Id_SP3, Id_SP3, Quantity_SP3, userEmail, Status];
        const insertResult = await dbconnect.query(sqlCommand, values);

        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `รหัส Compact No (ปรับ): ${Compact_No_Modify} บันทึกได้สำเร็จ ครับ`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}

//update Shim
const updateShim = async (req, res) =>{
    const id = req.params.id;
    const userEmail = req.user.email; // Authenticated user email
    const {Compact_No_Modify, Part_No, Name_SP1, Erp_Id_SP1, Id_SP1, Quantity_SP1, Name_SP2, Erp_Id_SP2, Id_SP2, Quantity_SP2, Name_SP3, Erp_Id_SP3, Id_SP3, Quantity_SP3, CreateBy, Status} = req.body;
    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Shim" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];

        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลที่มีรหัส: ${Compact_No_Modify}`,
            });
        }
        //Update Record
        const updateSql = `
            UPDATE "Shim" SET "Compact_No_Modify" = $1, "Part_No" = $2, "Name_SP1" = $3, "Erp_Id_SP1" = $4, "Id_SP1" = $5, "Quantity_SP1" = $6, "Name_SP2" = $7, "Erp_Id_SP2" = $8, "Id_SP2" = $9, "Quantity_SP2" = $10, "Name_SP3" = $11, "Erp_Id_SP3" = $12, "Id_SP3" = $13, "Quantity_SP3" = $14, "CreateBy" = $15, "Status" = $16 WHERE "id" = $17

        `;
        const values = [Compact_No_Modify, Part_No, Name_SP1, Erp_Id_SP1, Id_SP1, Quantity_SP1, Name_SP2, Erp_Id_SP2, Id_SP2, Quantity_SP2, Name_SP3, Erp_Id_SP3, Id_SP3, Quantity_SP3, CreateBy,Status, id];
        const updateResult = await dbconnect.query(updateSql, values);
        const updatedRecord = updateResult.rows[0];
        // Log changes
        const columns = [
            "Compact_No_Modify", "Part_No", "Name_SP1", "Erp_Id_SP1", "Id_SP1","Quantity_SP1", "Name_SP2", "Erp_Id_SP2", "Id_SP2","Quantity_SP2", "Name_SP3", "Erp_Id_SP3", "Id_SP3","Quantity_SP3","CreateBy", "Status"
        ];

        // const action = updated;
        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("Shim", column, id, oldValue, newValue, "updated" , userEmail);
            }
        }

        // Response
        res.status(200).json({
            success: true,
            data: updatedRecord,
            msg: `อัปเดตข้อมูล: ${Compact_No_Modify} สำเร็จ`,
        });


    } catch (error) {
        console.error("Error updating BOM:", error);
        res.status(500).json({
            success: false,
            msg: `เกิดข้อผิดพลาดขณะอัปเดตข้อมูล: ${Compact_No_Modify} กรุณาลองอีกครั้ง.`,
            data: error.message,
        });
    }

}

module.exports = {
    getShims,
    getShim,
    postShim,
    updateShim
}