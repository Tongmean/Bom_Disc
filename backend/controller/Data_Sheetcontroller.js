const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');

const getDatasheets = async (req, res) => {
    try {
        dbconnect.query(`SELECT * FROM "Data_Sheet" `, (err, result) => {
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
    const {Data_Sheet_No, Compact_No, Grade_Chem, Weight_F1, Weight_F2, Underlayer_Grade_Chem, Weight_U1, Weight_U2, Formular, CreateBy, Status} = req.body;
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
        const sqlCommand = `INSERT INTO "Data_Sheet" ("Data_Sheet_No", "Compact_No", "Grade_Chem", "Weight_F1", "Weight_F2","Underlayer_Grade_Chem", "Weight_U1", "Weight_U2", "Formular", "CreateBy", "Status")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING*`;
        const values = [Data_Sheet_No, Compact_No, Grade_Chem, Weight_F1, Weight_F2, Underlayer_Grade_Chem, Weight_U1, Weight_U2, Formular, userEmail, Status];
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
    const {Data_Sheet_No, Compact_No, Grade_Chem, Weight_F1, Weight_F2, Underlayer_Grade_Chem, Weight_U1, Weight_U2, Formular, CreateBy, Status} = req.body;
    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Data_Sheet" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];

        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลที่มีรหัส: ${Data_Sheet_No}`,
            });
        }
        const updateSql = `UPDATE "Data_Sheet" SET "Data_Sheet_No" = $1, "Compact_No" = $2, "Grade_Chem" = $3, "Weight_F1" = $4, "Weight_F2" = $5, "Underlayer_Grade_Chem" = $6, "Weight_U1" = $7, "Weight_U2" = $8, "Formular" = $9, "CreateBy" = $10, "Status" =$11 WHERE "id" = $12 RETURNING *`;
        const values = [Data_Sheet_No, Compact_No, Grade_Chem, Weight_F1, Weight_F2, Underlayer_Grade_Chem, Weight_U1, Weight_U2, Formular, CreateBy, Status, id];
        //Update Query
        const updateResult = await dbconnect.query(updateSql, values);
        const updatedRecord = updateResult.rows[0];
        // Log changes
        const columns = [
            "Data_Sheet_No", "Compact_No", "Grade_Chem", "Weight_F1", "Weight_F2","Underlayer_Grade_Chem", "Weight_U1", "Weight_U2", "Formular", "CreateBy", "Status"
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