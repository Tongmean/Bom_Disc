const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');

const getD_Weights = async (req, res) => {
    const mysql = `
        SELECT * FROM "Data_Sheet_Weight"
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
const getD_Weight = async (req, res) => {
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "Data_Sheet_Weight" WHERE id = $1' , [id],(err, result) =>{
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



const postD_Weight = async (req, res) =>{
    const userEmail = req.user.email;
    const {
        Data_Sheet_No,
        Compact_No,
        Formulation,
        Chem_Grade,
        Mold_Code_Cold,
        Mold_Code_Hot,
        Weight_F,
        Weight_U,
        Chem_Grade_U,
        CreateBy,
      } = req.body;

    try {
        // Check for duplicate 
        const sqlCheck = `SELECT * FROM "Data_Sheet_Weight" WHERE "Data_Sheet_No" = $1`;
        const checkResult = await dbconnect.query(sqlCheck, [Data_Sheet_No]);
        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkResult.rows,
                msg: `Data-sheet no.(น้ำหนัก): ${Data_Sheet_No} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }
        // Insert New Record
        const sqlCommand = `
            INSERT INTO "Data_Sheet_Weight" (
                "Data_Sheet_No", "Compact_No", "Formulation", "Chem_Grade",
                "Mold_Code_Cold", "Mold_Code_Hot", "Weight_F", "Weight_U","Chem_Grade_U", "CreateBy"
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *
        `;
        const values = [
            Data_Sheet_No,
            Compact_No,
            Formulation,
            Chem_Grade,
            Mold_Code_Cold,
            Mold_Code_Hot,
            Weight_F,
            Weight_U,
            Chem_Grade_U,
            userEmail
        ]
        const insertResult = await dbconnect.query(sqlCommand, values);
        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `รหัส Data-sheet no.(น้ำหนัก): ${Data_Sheet_No} บันทึกได้สำเร็จ ครับ`
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

const updateD_Weight = async (req, res) =>{
    const id = req.params.id;
    const userEmail = req.user.email;
    const {
        Data_Sheet_No,
        Compact_No,
        Formulation,
        Chem_Grade,
        Mold_Code_Cold,
        Mold_Code_Hot,
        Weight_F,
        Weight_U,
        Chem_Grade_U,
        CreateBy,
    } = req.body;
    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Data_Sheet_Weight" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];
        const currentValueCreateBy = currentValueResult.rows[0].CreateBy;
        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลสูตร: ${Data_Sheet_No}`,
            });
        }
        // Update section
        const updateSql =  `
            UPDATE "Data_Sheet_Weight" SET
            "Data_Sheet_No" = $1,
            "Compact_No" = $2,
            "Formulation" = $3,
            "Chem_Grade" = $4,
            "Mold_Code_Cold" = $5,
            "Mold_Code_Hot" = $6,
            "Weight_F" = $7,
            "Weight_U" = $8,
            "Chem_Grade_U" = $9,
            "CreateBy" = $10
            WHERE "id" = $11 RETURNING *
        `;
        const values = [
            Data_Sheet_No,
            Compact_No,
            Formulation,
            Chem_Grade,
            Mold_Code_Cold,
            Mold_Code_Hot,
            Weight_F,
            Weight_U,
            Chem_Grade_U,
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
                msg: `อัปเดตข้อมูล Data_Sheet_No: ${Data_Sheet_No} สำเร็จ`,
            });
        }
        // Log changes
        const columns = [
            "Data_Sheet_No", "Compact_No", "Formulation", "Chem_Grade",
                "Mold_Code_Cold", "Mold_Code_Hot", "Weight_F", "Weight_U", "Chem_Grade_U"
        ];
        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("Data_Sheet_Weight", column, id, oldValue, newValue, "updated" , userEmail);
            }
        }
    } catch (error) {
        console.log("Error updating BOM:", error);
        res.status(500).json({
            success: false,
            msg: `เกิดข้อผิดพลาดขณะอัปเดตข้อมูล: ${Data_Sheet_No} กรุณาลองอีกครั้ง.`,
            data: error.message,
        });
    }
}
module.exports ={
    getD_Weights,
    getD_Weight,
    postD_Weight,
    updateD_Weight
}