//call database connection
const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');
//Get All record
const getDrawings = async (req, res) => {
    try {
        dbconnect.query(`SELECT * FROM "Drawing"`, (err, result) => {
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
const getDrawing = async (req,res) =>{
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "Drawing" WHERE id = $1' , [id],(err, result) =>{
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

//post drawing
const postDrawing = async (req, res) =>{
    const userEmail = req.user.email; // This email comes from requireAuth
    const {Compact_No_Modify_Drawing, Part_No, Erp_Id_BP1, Name_BP1, Id_BP1, Quantity_BP1, Erp_Id_BP2, Name_BP2, Id_BP2, Quantity_BP2, Erp_Id_BP3, Name_BP3, Id_BP3, Quantity_BP3, Erp_Id_BP4, Name_BP4, Id_BP4, Quantity_BP4, Erp_Id_WD1, Name_WD1, Id_WD1, Quantity_WD1, Erp_Id_WD2, Name_WD2, Id_WD2, Quantity_WD2, Erp_Id_WD3, Name_WD3, Id_WD3, Quantity_WD3, CreateBy} = req.body;
    try {
        // Check for duplicate Code_Fg
        const sqlCheck = `SELECT * FROM "Drawing" WHERE "Compact_No_Modify_Drawing" = $1`;
        const checkResult = await dbconnect.query(sqlCheck, [Compact_No_Modify_Drawing]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkResult.rows,
                msg: `รหัส Compact No (ปรับ): ${Compact_No_Modify_Drawing} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }
        //Insert New Record
        const sqlCommand = `
            INSERT INTO "Drawing" 
            ("Compact_No_Modify_Drawing", "Part_No", "Erp_Id_BP1", "Name_BP1", "Id_BP1", "Quantity_BP1", "Erp_Id_BP2", "Name_BP2", "Id_BP2", "Quantity_BP2", "Erp_Id_BP3", "Name_BP3", "Id_BP3", "Quantity_BP3", "Erp_Id_BP4", "Name_BP4", "Id_BP4", "Quantity_BP4", "Erp_Id_WD1", "Name_WD1", "Id_WD1", "Quantity_WD1", "Erp_Id_WD2", "Name_WD2", "Id_WD2", "Quantity_WD2", "Erp_Id_WD3", "Name_WD3", "Id_WD3", "Quantity_WD3", "CreateBy") 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31 ) RETURNING *
        `;
        const values = [Compact_No_Modify_Drawing, Part_No, Erp_Id_BP1, Name_BP1, Id_BP1, Quantity_BP1, Erp_Id_BP2, Name_BP2, Id_BP2, Quantity_BP2, Erp_Id_BP3, Name_BP3, Id_BP3, Quantity_BP3, Erp_Id_BP4, Name_BP4, Id_BP4, Quantity_BP4, Erp_Id_WD1, Name_WD1, Id_WD1, Quantity_WD1, Erp_Id_WD2, Name_WD2, Id_WD2, Quantity_WD2, Erp_Id_WD3, Name_WD3, Id_WD3, Quantity_WD3, userEmail];

        const insertResult = await dbconnect.query(sqlCommand, values);

        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `รหัส Compact No (ปรับ): ${Compact_No_Modify_Drawing} บันทึกได้สำเร็จ ครับ`
        });
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}


//update drawing
const updateDrawing = async (req, res) =>{
    const id = req.params.id;
    const userEmail = req.user.email; // This email comes from requireAuth
    const {Compact_No_Modify_Drawing, Part_No, Erp_Id_BP1, Name_BP1, Id_BP1, Quantity_BP1, Erp_Id_BP2, Name_BP2, Id_BP2, Quantity_BP2, Erp_Id_BP3, Name_BP3, Id_BP3, Quantity_BP3, Erp_Id_BP4, Name_BP4, Id_BP4, Quantity_BP4, Erp_Id_WD1, Name_WD1, Id_WD1, Quantity_WD1, Erp_Id_WD2, Name_WD2, Id_WD2, Quantity_WD2, Erp_Id_WD3, Name_WD3, Id_WD3, Quantity_WD3, CreateBy} = req.body;
    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Drawing" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];

        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลที่มีรหัส: ${Compact_No_Modify_Drawing}`,
            });
        }
        //update record
        const updateSql = `
            UPDATE "Drawing" SET "Compact_No_Modify_Drawing" = $1, "Part_No" = $2, "Erp_Id_BP1" = $3, "Name_BP1" = $4, "Id_BP1" = $5, "Quantity_BP1" = $6, "Erp_Id_BP2" = $7, "Name_BP2" = $8, "Id_BP2" = $9, "Quantity_BP2" = $10, "Erp_Id_BP3" = $11, "Name_BP3" = $12, "Id_BP3" = $13, "Quantity_BP3" = $14, "Erp_Id_BP4" = $15, "Name_BP4" = $16, "Id_BP4" = $17, "Quantity_BP4" = $18, "Erp_Id_WD1" = $19, "Name_WD1" = $20, "Id_WD1" = $21, "Quantity_WD1" = $22, "Erp_Id_WD2" = $23, "Name_WD2" = $24, "Id_WD2" = $25, "Quantity_WD2" = $26, "Erp_Id_WD3" = $27, "Name_WD3" = $28, "Id_WD3" = $29, "Quantity_WD3" = $30, "CreateBy" = $31 
            WHERE "id" = $32 RETURNING *
        `;
        const values = [Compact_No_Modify_Drawing, Part_No, Erp_Id_BP1, Name_BP1, Id_BP1, Quantity_BP1, Erp_Id_BP2, Name_BP2, Id_BP2, Quantity_BP2, Erp_Id_BP3, Name_BP3, Id_BP3, Quantity_BP3, Erp_Id_BP4, Name_BP4, Id_BP4, Quantity_BP4, Erp_Id_WD1, Name_WD1, Id_WD1, Quantity_WD1, Erp_Id_WD2, Name_WD2, Id_WD2, Quantity_WD2, Erp_Id_WD3, Name_WD3, Id_WD3, Quantity_WD3, CreateBy, id];
       
        const updateResult = await dbconnect.query(updateSql, values);
        const updatedRecord = updateResult.rows[0];

        // Log changes
        const columns = [
            "Compact_No_Modify_Drawing", "Part_No", "Erp_Id_BP1", "Name_BP1", "Id_BP1", "Quantity_BP1", "Erp_Id_BP2", "Name_BP2", "Id_BP2", "Quantity_BP2", "Erp_Id_BP3", "Name_BP3", "Id_BP3", "Quantity_BP3", "Erp_Id_BP4", "Name_BP4", "Id_BP4", "Quantity_BP4","Erp_Id_WD1", "Name_WD1", "Id_WD1", "Quantity_WD1","Erp_Id_WD2", "Name_WD2", "Id_WD2", "Quantity_WD2","Erp_Id_WD3", "Name_WD3", "Id_WD3", "Quantity_WD3","CreateBy"
        ];

        // const action = updated;
        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("Drawing", column, id, oldValue, newValue, "updated" , userEmail);
            }
        }

        // Response
        res.status(200).json({
            success: true,
            data: updatedRecord,
            msg: `อัปเดตข้อมูล: ${Compact_No_Modify_Drawing} สำเร็จแล้ว`,
        });        

    } catch (error) {
        console.error("Error updating BOM:", error);
        res.status(500).json({
            success: false,
            msg: `เกิดข้อผิดพลาดขณะอัปเดตข้อมูล: ${Compact_No_Modify_Drawing} กรุณาลองอีกครั้ง.`,
            data: error.message,
        });
    }
}

module.exports ={
    getDrawings,
    getDrawing,
    postDrawing,
    updateDrawing
}