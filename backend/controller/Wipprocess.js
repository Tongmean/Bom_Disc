const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');

const getWips = async (req, res) => {
    const mysql = `
        SELECT * FROM "Wipprocess"
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

const getWip = async (req, res) => {
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "Wipprocess" WHERE id = $1' , [id],(err, result) =>{
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

const postWip = async (req, res) =>{
    const userEmail = req.user.email;
    const {
        Code_Fg,
        Part_No,
        Grade,
        Hotpressing,
        Grinding,
        Powder,
        Treatment,
        Shim,
        Attachment,
        Quantity,
        CreateBy
    } = req.body;
    try {
        // Check for duplicate 
        // const sqlCheck = `SELECT * FROM "Wipprocess" WHERE "Code_Fg" = $1`;
        // const checkResult = await dbconnect.query(sqlCheck, [Code_Fg]);
        // if (checkResult.rows.length > 0) {
        //     return res.status(400).json({
        //         success: false,
        //         data: checkResult.rows,
        //         msg: `รหัส: ${Code_Fg} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
        //     });
        // }
        // Insert New Record
        const sqlCommand = `
            INSERT INTO "Wipprocess" 
            ("Code_Fg", "Part_No", "Grade", "Hotpressing", "Grinding", "Powder", "Treatment", "Shim", "Attachment", "Quantity", "CreateBy") 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;
        const values = [
            Code_Fg, Part_No, Grade, Hotpressing, Grinding, Powder, Treatment, Shim, Attachment, Quantity, 
            userEmail
        ]
        const insertResult = await dbconnect.query(sqlCommand, values);
        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `รหัส: ${Code_Fg} บันทึกได้สำเร็จ ครับ`
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


const updateWip = async (req, res) =>{
    const id = req.params.id;
    const userEmail = req.user.email;
    const {
        Code_Fg,
        Part_No,
        Grade,
        Hotpressing,
        Grinding,
        Powder,
        Treatment,
        Shim,
        Attachment,
        Quantity,
        CreateBy
    } = req.body;
    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Wipprocess" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];
        const currentValueCreateBy = currentValueResult.rows[0].CreateBy;
        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลที่มีรหัส: ${Code_Fg}`,
            });
        }
        // Update section
        const updateSql =  `
            UPDATE "Wipprocess" SET 
                "Code_Fg" = $1,
                "Part_No" = $2,
                "Grade" = $3,
                "Hotpressing" = $4,
                "Grinding" = $5,
                "Powder" = $6,
                "Treatment" = $7,
                "Shim" = $8,
                "Attachment" = $9,
                "Quantity" = $10,
                "CreateBy" = $11
            WHERE "id" = $12
            RETURNING *
        `;
        const values = [Code_Fg, Part_No, Grade, Hotpressing, Grinding, Powder, Treatment, Shim, Attachment, Quantity, currentValueCreateBy, id];
        //Update Query
        const updateResult = await dbconnect.query(updateSql, values);
        const updatedRecord = updateResult.rows[0];
        if(updatedRecord){
            res.status(200).json({
                success: true,
                data: updatedRecord,
                msg: `อัปเดตข้อมูล: ${Code_Fg} สำเร็จ`,
            });
        }
        // Log changes
        const columns = [
            "Code_Fg", "Part_No", "Grade", "Hotpressing", "Grinding", "Powder", "Treatment", "Shim", "Attachment", "Quantity"
        ];
        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("Wipprocess", column, id, oldValue, newValue, "updated" , userEmail);
            }
        }
    } catch (error) {
        console.log("Error updating BOM:", error);
        res.status(500).json({
            success: false,
            msg: `เกิดข้อผิดพลาดขณะอัปเดตข้อมูล: ${Code_Fg} กรุณาลองอีกครั้ง.`,
            data: error.message,
        });
    }
}

module.exports ={
    getWips,
    getWip,
    postWip,
    updateWip  
}