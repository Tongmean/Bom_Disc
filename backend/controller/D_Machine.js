const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');

const getD_Machines = async (req, res) => {
    const mysql = `
        SELECT * FROM "Machine"
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
const getD_Machine = async (req, res) => {
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "Machine" WHERE id = $1' , [id],(err, result) =>{
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



const postD_Machine = async (req, res) =>{
    const userEmail = req.user.email;
    const {
        Machine_Code,
        Type_Machine,
        Diameter,
        Min_Pressure,
        Max_Pressure,
        Group,
        Status,
        CreateBy,
    } = req.body;

    try {
        // Check for duplicate 
        const sqlCheck = `SELECT * FROM "Machine" WHERE "Machine_Code" = $1`;
        const checkResult = await dbconnect.query(sqlCheck, [Machine_Code]);
        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkResult.rows,
                msg: `รหัส Machine_no: ${Machine_Code} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }
        // Insert New Record
        const sqlCommand = `
            INSERT INTO "Machine" (
                "Machine_Code", "Type_Machine", "Diameter", "Min_Pressure", 
                "Max_Pressure", "Group", "Status", "CreateBy"
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
        `;
        const values = [Machine_Code, Type_Machine, Diameter, Min_Pressure, Max_Pressure, Group, Status, userEmail]
        const insertResult = await dbconnect.query(sqlCommand, values);
        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `รหัส Machine_no: ${Machine_Code} บันทึกได้สำเร็จ ครับ`
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

const updateD_Machine = async (req, res) =>{
    const id = req.params.id;
    const userEmail = req.user.email;
    const {
        Machine_Code,
        Type_Machine,
        Diameter,
        Min_Pressure,
        Max_Pressure,
        Group,
        Status,
        CreateBy,
    } = req.body;
    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Machine" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];
        const currentValueCreateBy = currentValueResult.rows[0].CreateBy;
        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลที่มีรหัส: ${Machine_Code}`,
            });
        }
        // Update section
        const updateSql =  `
            UPDATE "Machine" SET
            "Machine_Code" = $1,
            "Type_Machine" = $2,
            "Diameter" = $3,
            "Min_Pressure" = $4,
            "Max_Pressure" = $5,
            "Group" = $6,
            "Status" = $7,
            "CreateBy" = $8
            WHERE "id" = $9 RETURNING *
        `;
        const values = [Machine_Code, Type_Machine, Diameter, Min_Pressure, Max_Pressure, Group, Status, currentValueCreateBy, id];
        //Update Query
        const updateResult = await dbconnect.query(updateSql, values);
        const updatedRecord = updateResult.rows[0];
        if(updatedRecord){
            res.status(200).json({
                success: true,
                data: updatedRecord,
                msg: `อัปเดตข้อมูล: ${Machine_Code} สำเร็จ`,
            });
        }
        // Log changes
        const columns = [
            "Machine_Code", "Type_Machine", "Diameter", "Min_Pressure", 
                "Max_Pressure", "Group", "Status"
        ];
        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("Machine", column, id, oldValue, newValue, "updated" , userEmail);
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
    getD_Machines,
    getD_Machine,
    postD_Machine,
    updateD_Machine

  
}