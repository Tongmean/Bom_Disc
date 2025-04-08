const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');

const getDatasheets = async (req, res) => {
    const mysql = `
        SELECT  
            "Data_Sheet".*, "Material"."Area", "Material"."ID", "Material"."Thick", "Material"."Thick", "Material"."uniquename" AS "materialfile"

        FROM 
            "Data_Sheet"
        LEFT JOIN
            "Material"
        ON "Data_Sheet"."Compact_No" = "Material"."Num"
        WHERE "Material"."Type2" = 'D'
        ORDER BY "Data_Sheet"."id" ASC


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
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "มีปัญาเกิดขึ้นระว่างการดึงข้อมูล",
            data: error
        });
    }
};

//Get Single record by id
const getDatasheet = async (req,res) =>{
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "Data_Sheet" WHERE id = $1' , [id],(err, result) =>{
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

//post Data_Sheet
const postDatasheet = async (req, res) =>{
    const userEmail = req.user.email; // This email comes from requireAuth
    console.log('userEmail', userEmail)
    const {Data_Sheet_No, Compact_No, Grade_Chem, Weight_F1, Weight_F2, Underlayer_Grade_Chem, Weight_U1, Weight_U2, Formular, CreateBy, Status, Mold_Cold, Machine_Cold, Presure_Cold, Piece_Per_Mold_Cold, Mold_Hot, Temperature_Upper, Temperature_Lower, Machine_Hot, Presure_Hot, Piece_Per_Mold_Hot, Check_Status, Remark} = req.body;
    try {
        // Check for duplicate 
        const sqlCheck = `SELECT * FROM "Data_Sheet" WHERE "Data_Sheet_No" = $1`;
        const checkResult = await dbconnect.query(sqlCheck, [Data_Sheet_No]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkResult.rows,
                msg: `รหัส Data Sheet no: ${Data_Sheet_No} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }
        //Insert New         
        const sqlCommand = `INSERT INTO "Data_Sheet" ("Data_Sheet_No", "Compact_No", "Grade_Chem", "Weight_F1", "Weight_F2","Underlayer_Grade_Chem", "Weight_U1", "Weight_U2", "Formular", "CreateBy", "Status", "Mold_Cold", "Machine_Cold", "Presure_Cold", "Piece_Per_Mold_Cold", "Mold_Hot", "Temperature_Upper", "Temperature_Lower", "Machine_Hot", "Presure_Hot", "Piece_Per_Mold_Hot", "Check_Status", "Remark")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) RETURNING*`;
        const values = [Data_Sheet_No, Compact_No, Grade_Chem, Weight_F1, Weight_F2, Underlayer_Grade_Chem, Weight_U1, Weight_U2, Formular, userEmail, Status,Mold_Cold, Machine_Cold, Presure_Cold, Piece_Per_Mold_Cold, Mold_Hot, Temperature_Upper, Temperature_Lower, Machine_Hot, Presure_Hot, Piece_Per_Mold_Hot, Check_Status, Remark];
        //Insert Query

        const insertResult = await dbconnect.query(sqlCommand, values);

        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `รหัส Data Sheet: ${Data_Sheet_No} บันทึกได้สำเร็จ ครับ`
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

//update Data_Sheet
const updateDatasheet = async (req, res) =>{
    const id = req.params.id;
    const userEmail = req.user.email; // Authenticated user email
    const {Data_Sheet_No, Compact_No, Grade_Chem, Weight_F1, Weight_F2, Underlayer_Grade_Chem, Weight_U1, Weight_U2, Formular, CreateBy, Status, Mold_Cold, Machine_Cold, Presure_Cold, Piece_Per_Mold_Cold, Mold_Hot, Temperature_Upper, Temperature_Lower, Machine_Hot, Presure_Hot, Piece_Per_Mold_Hot, Check_Status, Remark} = req.body;
    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Data_Sheet" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];
        const currentValueCreateBy = currentValueResult.rows[0].CreateBy;

        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลที่มีรหัส: ${Data_Sheet_No}`,
            });
        }
        const updateSql = `UPDATE "Data_Sheet" SET "Data_Sheet_No" = $1, "Compact_No" = $2, "Grade_Chem" = $3, "Weight_F1" = $4, "Weight_F2" = $5, "Underlayer_Grade_Chem" = $6, "Weight_U1" = $7, "Weight_U2" = $8, "Formular" = $9, "CreateBy" = $10, "Status" =$11, "Mold_Cold" =$12, "Machine_Cold" =$13, "Presure_Cold"=$14, "Piece_Per_Mold_Cold"=$15, "Mold_Hot"=$16, "Temperature_Upper"=$17, "Temperature_Lower"=$18, "Machine_Hot"=$19, "Presure_Hot"=$20, "Piece_Per_Mold_Hot"= $21, "Check_Status" =$22, "Remark"=$23, "Check_By"= $24  WHERE "id" = $25 RETURNING *`;
        const values = [Data_Sheet_No, Compact_No, Grade_Chem, Weight_F1, Weight_F2, Underlayer_Grade_Chem, Weight_U1, Weight_U2, Formular, currentValueCreateBy, Status, Mold_Cold, Machine_Cold, Presure_Cold, Piece_Per_Mold_Cold, Mold_Hot, Temperature_Upper, Temperature_Lower, Machine_Hot, Presure_Hot, Piece_Per_Mold_Hot, Check_Status, Remark, userEmail, id];
        //Update Query
        const updateResult = await dbconnect.query(updateSql, values);
        const updatedRecord = updateResult.rows[0];
        // Log changes
        const columns = [
            "Data_Sheet_No", "Compact_No", "Grade_Chem", "Weight_F1", "Weight_F2","Underlayer_Grade_Chem", "Weight_U1", "Weight_U2", "Formular", "CreateBy", "Status", "Mold_Cold", "Machine_Cold", "Presure_Cold", "Piece_Per_Mold_Cold", "Mold_Hot", "Temperature_Upper", "Temperature_Lower", "Machine_Hot", "Presure_Hot", "Piece_Per_Mold_Hot", "Check_Status", "Remark"
        ];
        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("Data_Sheet", column, id, oldValue, newValue, "updated" , userEmail);
            }
        }

        // Response
        res.status(200).json({
            success: true,
            data: updatedRecord,
            msg: `อัปเดตข้อมูล: ${Data_Sheet_No} สำเร็จ`,
        });

    } catch (error) {
        console.error("Error updating BOM:", error);
        res.status(500).json({
            success: false,
            msg: `เกิดข้อผิดพลาดขณะอัปเดตข้อมูล: ${Data_Sheet_No} กรุณาลองอีกครั้ง.`,
            data: error.message,
        });
    }
}
module.exports ={
    getDatasheets,
    getDatasheet,
    postDatasheet,
    updateDatasheet

  
}