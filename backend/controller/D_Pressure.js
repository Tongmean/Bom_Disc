const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');


const getD_Pressures = async (req, res) => {
    const mysql = `
        SELECT * FROM "Data_Sheet_Pressure"
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
const getD_Pressure = async (req, res) => {
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "Data_Sheet_Pressure" WHERE id = $1' , [id],(err, result) =>{
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

const postD_Pressure = async (req, res) =>{
    const userEmail = req.user.email;
    const {
        Data_Sheet_No_Pressure,
        Data_Sheet_No,
        Mold_Machine_Cold_Code,
        Pcs_Per_Mold_Cold,
        Presure_Cold,
        Mold_Machine_Cold_Hot,
        Pcs_Per_Mold_Hot,
        Presure_Hot,
        CreateBy
    } = req.body;

    try {
        // Check for duplicate 
        const sqlCheck = `SELECT * FROM "Data_Sheet_Pressure" WHERE "Data_Sheet_No_Pressure" = $1`;
        const checkResult = await dbconnect.query(sqlCheck, [Data_Sheet_No_Pressure]);
        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkResult.rows,
                msg: `Data-sheet no.(แรงดัน): ${Data_Sheet_No_Pressure} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }
        // Insert New Record
        const sqlCommand = `
            INSERT INTO "Data_Sheet_Pressure" 
            (
            "Data_Sheet_No_Pressure",
            "Data_Sheet_No",
            "Mold_Machine_Cold_Code",
            "Pcs_Per_Mold_Cold",
            "Presure_Cold",
            "Mold_Machine_Cold_Hot",
            "Pcs_Per_Mold_Hot",
            "Presure_Hot",
            "CreateBy"
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const values = [
            Data_Sheet_No_Pressure,
            Data_Sheet_No,
            Mold_Machine_Cold_Code,
            Pcs_Per_Mold_Cold,
            Presure_Cold,
            Mold_Machine_Cold_Hot,
            Pcs_Per_Mold_Hot,
            Presure_Hot,
            userEmail
        ]
        const insertResult = await dbconnect.query(sqlCommand, values);
        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `รหัส Data-sheet no.(แรงดัน): ${Data_Sheet_No_Pressure} บันทึกได้สำเร็จ ครับ`
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


const updateD_Pressure = async (req, res) =>{
    const id = req.params.id;
    const userEmail = req.user.email;
    const {
        Data_Sheet_No_Pressure,
        Data_Sheet_No,
        Mold_Machine_Cold_Code,
        Pcs_Per_Mold_Cold,
        Presure_Cold,
        Mold_Machine_Cold_Hot,
        Pcs_Per_Mold_Hot,
        Presure_Hot,
        CreateBy
      } = req.body;
      console.log('req.body',req.body)
      console.log('id',id)
    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Data_Sheet_Pressure" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];
        const currentValueCreateBy = currentValueResult.rows[0].CreateBy;
        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลสูตร: ${Data_Sheet_No_Pressure}`,
            });
        }
        // Update section
        const updateSql =  `
            UPDATE "Data_Sheet_Pressure" SET
                "Data_Sheet_No_Pressure" = $1,
                "Data_Sheet_No" = $2,
                "Mold_Machine_Cold_Code" = $3,
                "Pcs_Per_Mold_Cold" = $4,
                "Presure_Cold" = $5,
                "Mold_Machine_Cold_Hot" = $6,
                "Pcs_Per_Mold_Hot" = $7,
                "Presure_Hot" = $8,
                "CreateBy" = $9
            WHERE "id" = $10
            RETURNING *
        `;
        const values = [
            Data_Sheet_No_Pressure,
            Data_Sheet_No,
            Mold_Machine_Cold_Code,
            Pcs_Per_Mold_Cold,
            Presure_Cold,
            Mold_Machine_Cold_Hot,
            Pcs_Per_Mold_Hot,
            Presure_Hot,
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
                msg: `อัปเดตข้อมูล Data_Sheet_No (แรงดัน): ${Data_Sheet_No_Pressure} สำเร็จ`,
            });
        }
        // Log changes
        const columns = [
            "Data_Sheet_No_Pressure",
            "Data_Sheet_No",
            "Mold_Machine_Cold_Code",
            "Pcs_Per_Mold_Cold",
            "Presure_Cold",
            "Mold_Machine_Cold_Hot",
            "Pcs_Per_Mold_Hot",
            "Presure_Hot",
        ];
        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("Data_Sheet_Pressure", column, id, oldValue, newValue, "updated" , userEmail);
            }
        }
    } catch (error) {
        console.log("Error updating BOM:", error);
        res.status(500).json({
            success: false,
            msg: `เกิดข้อผิดพลาดขณะอัปเดตข้อมูล: ${Data_Sheet_No_Pressure} กรุณาลองอีกครั้ง.`,
            data: error.message,
        });
    }
}
module.exports ={
    getD_Pressures,
    getD_Pressure,
    postD_Pressure,
    updateD_Pressure
}