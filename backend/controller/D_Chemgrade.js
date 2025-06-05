const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');

const getD_Chemgrades = async (req, res) => {
    const mysql = `
        SELECT * FROM "Chem_Grade"
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
const getD_Chemgrade = async (req, res) => {
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "Chem_Grade" WHERE id = $1' , [id],(err, result) =>{
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



const postD_Chemgrade = async (req, res) =>{
    const userEmail = req.user.email;
    const {
        Chem_Grade_Code,
        SG_Value,
        Pressure_Cold,
        Pressure_Hot,
        Temp_Above,
        Temp_Bellow,
        Total_Time,
        Program_No,
        CreateBy,
    } = req.body;

    try {
        // Check for duplicate 
        const sqlCheck = `SELECT * FROM "Chem_Grade" WHERE "Chem_Grade_Code" = $1`;
        const checkResult = await dbconnect.query(sqlCheck, [Chem_Grade_Code]);
        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkResult.rows,
                msg: `รหัสแม่พิมพ์: ${Chem_Grade_Code} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }
        // Insert New Record
        const sqlCommand = `
            INSERT INTO "Chem_Grade" (
                "Chem_Grade_Code", "SG_Value", "Pressure_Cold", "Pressure_Hot",
                "Temp_Above", "Temp_Bellow", "Total_Time", "Program_No", "CreateBy"
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *
        `;
        const values = [
            Chem_Grade_Code,
            SG_Value,
            Pressure_Cold,
            Pressure_Hot,
            Temp_Above,
            Temp_Bellow,
            Total_Time,
            Program_No,
            userEmail
        ]
        const insertResult = await dbconnect.query(sqlCommand, values);
        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `รหัสแม่พิมพ์: ${Chem_Grade_Code} บันทึกได้สำเร็จ ครับ`
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

const updateD_Chemgrade = async (req, res) =>{
    const id = req.params.id;
    const userEmail = req.user.email;
    const {
        Chem_Grade_Code,
        SG_Value,
        Pressure_Cold,
        Pressure_Hot,
        Temp_Above,
        Temp_Bellow,
        Total_Time,
        Program_No,
        CreateBy,
    } = req.body;
    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Chem_Grade" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];
        const currentValueCreateBy = currentValueResult.rows[0].CreateBy;
        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลสูตร: ${Chem_Grade}`,
            });
        }
        // Update section
        const updateSql =  `
            UPDATE "Chem_Grade" SET
            "Chem_Grade_Code" = $1,
            "SG_Value" = $2,
            "Pressure_Cold" = $3,
            "Pressure_Hot" = $4,
            "Temp_Above" = $5,
            "Temp_Bellow" = $6,
            "Total_Time" = $7,
            "Program_No" = $8,
            "CreateBy" = $9
            WHERE "id" = $10 RETURNING *
        `;
        const values = [
            Chem_Grade_Code,
            SG_Value,
            Pressure_Cold,
            Pressure_Hot,
            Temp_Above,
            Temp_Bellow,
            Total_Time,
            Program_No,
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
                msg: `อัปเดตข้อมูลสูตร: ${Chem_Grade_Code} สำเร็จ`,
            });
        }
        // Log changes
        const columns = [
            "Chem_Grade_Code", "SG_Value", "Pressure_Cold", "Pressure_Hot",
            "Temp_Above", "Temp_Bellow", "Total_Time", "Program_No"
        ];
        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("Chem_Grade", column, id, oldValue, newValue, "updated" , userEmail);
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
    getD_Chemgrades,
    getD_Chemgrade,
    postD_Chemgrade,
    updateD_Chemgrade
}