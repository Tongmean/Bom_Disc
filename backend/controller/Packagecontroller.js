const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');
//Get all record
const getPackages = (req, res) =>{
    try {
        dbconnect.query(`SELECT * FROM "Package" `, (err, result) => {
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
}
//Get Single record by id
const getPackage = async (req,res) =>{
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "Package" WHERE id = $1' , [id],(err, result) =>{
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
//Post Package
const postPackage = async (req, res) =>{
    const userEmail = req.user.email; // This email comes from requireAuth
    const {Display_Box_id, Display_Box_Erp_Id, Name_Display_Box_Erp, Num_Display_Box, Display_Box_Group, CreateBy} = req.body;
    try {
        // Check for duplicate Code_Fg
        const sqlCheck = `SELECT * FROM "Package" WHERE "Display_Box_id" = $1`;
        const checkResult = await dbconnect.query(sqlCheck, [Display_Box_id]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkResult.rows,
                msg: `รหัสกล่อง: ${Display_Box_id} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }
        //Insert New Record
        const sqlCommand = `INSERT INTO "Package" ("Display_Box_id", "Display_Box_Erp_Id", "Name_Display_Box_Erp", "Num_Display_Box", "Display_Box_Group", "CreateBy")
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`
        const values = [Display_Box_id, Display_Box_Erp_Id, Name_Display_Box_Erp, Num_Display_Box, Display_Box_Group, userEmail];
        
        const insertResult = await dbconnect.query(sqlCommand, values);

        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `รหัสกล่อง: ${Display_Box_id} บันทึกได้สำเร็จ ครับ`
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}

//update package
const updatePackage = async (req, res) => {
    const id = req.params.id;
    const userEmail = req.user.email; // Authenticated user email
    const {Display_Box_id, Display_Box_Erp_Id, Name_Display_Box_Erp, Num_Display_Box, Display_Box_Group, CreateBy} = req.body;
    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Package" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];

        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลที่มีรหัส: `,
            });
        }
        //Update Record
        const updateSql = `UPDATE "Package" SET "Display_Box_id" = $1, "Display_Box_Erp_Id" = $2, "Name_Display_Box_Erp" = $3, "Num_Display_Box" = $4, "Display_Box_Group" = $5, "CreateBy" = $6 WHERE id = $7 RETURNING *;`;
        const values = [Display_Box_id, Display_Box_Erp_Id, Name_Display_Box_Erp, Num_Display_Box, Display_Box_Group, CreateBy, id];
        const updateResult = await dbconnect.query(updateSql, values);
        const updatedRecord = updateResult.rows[0];

        const columns = [
            "Display_Box_id", "Display_Box_Erp_Id", "Name_Display_Box_Erp", "Num_Display_Box", "Display_Box_Group", "CreateBy"
        ];

        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("Package", column, id, oldValue, newValue, "updated" , userEmail);
            }
        }

        // Response
        res.status(200).json({
            success: true,
            data: updatedRecord,
            msg: `อัปเดตข้อมูล: ${Display_Box_id} สำเร็จ`,
        });       

       
    } catch (error) {
        console.error("Error updating BOM:", error);
        res.status(500).json({
            success: false,
            msg: `เกิดข้อผิดพลาดขณะอัปเดตข้อมูล:  กรุณาลองอีกครั้ง.`,
            data: error.message,
        });
    }
}

module.exports ={
    getPackages,
    getPackage,
    postPackage,
    updatePackage
  
}