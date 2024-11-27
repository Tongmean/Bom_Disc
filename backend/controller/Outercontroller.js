//call database connection
const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');

//Get all record
const getOuters = async (req, res) => {
    try {
        dbconnect.query(`SELECT * FROM "Outer"`, (err, result) => {
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
const getOuter = async (req,res) =>{
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "Outer" WHERE id = $1' , [id],(err, result) =>{
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

//post outer
const postOuter = async (req, res) =>{
    const userEmail = req.user.email; // This email comes from requireAuth
    const {Outer_Id, Num_Display_Box, Type_Diecut, Num_Outer, Outer_Erp_Id, Name_Outer_Erp, Set_Per_Outer, Set_Per_Outer_1, Outer_Erp_Sticker, Name_Outer_Erp_Sticker, Num_Sticker, Outer_Per_pallet, CreateBy} = req.body;
    try {
        // Check for duplicate Outer_Id
        const sqlCheck = `SELECT * FROM "Outer" WHERE "Outer_Id" = $1`;
        const checkResult = await dbconnect.query(sqlCheck, [Outer_Id]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkResult.rows,
                msg: `รหัสสินค้าสำเร็จรูป: ${Outer_Id} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }
        //Insert New Record
        const sqlCommand = `INSERT INTO "Outer" ("Outer_Id", "Num_Display_Box", "Type_Diecut", "Num_Outer", "Outer_Erp_Id", "Name_Outer_Erp", "Set_Per_Outer", "Set_Per_Outer_1", "Outer_Erp_Sticker", "Name_Outer_Erp_Sticker", "Num_Sticker", "Outer_Per_pallet", "CreateBy")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`;
        const values = [Outer_Id, Num_Display_Box, Type_Diecut, Num_Outer, Outer_Erp_Id, Name_Outer_Erp, Set_Per_Outer, Set_Per_Outer_1, Outer_Erp_Sticker, Name_Outer_Erp_Sticker, Num_Sticker, Outer_Per_pallet, userEmail];
        const insertResult = await dbconnect.query(sqlCommand, values);

        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `รหัสกล่อง: ${Outer_Id} บันทึกได้สำเร็จ ครับ`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }

}

//update outer
const updateOuter = async (req, res) =>{
    const id = req.params.id;
    const userEmail = req.user.email; // Authenticated user email
    const {Outer_Id, Num_Display_Box, Type_Diecut, Num_Outer, Outer_Erp_Id, Name_Outer_Erp, Set_Per_Outer, Set_Per_Outer_1, Outer_Erp_Sticker, Name_Outer_Erp_Sticker, Num_Sticker, Outer_Per_pallet, CreateBy} = req.body;
    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Outer" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];
        //Check if currentValue Exist
        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลที่มีรหัส: ${Outer_Id}`,
            });
        }
        //Update Query
        const updateSql = `UPDATE "Outer" SET "Outer_Id" = $1 ,"Num_Display_Box" = $2, "Type_Diecut" = $3, "Num_Outer" = $4, "Outer_Erp_Id" = $5, "Name_Outer_Erp" = $6, "Set_Per_Outer" = $7, "Set_Per_Outer_1" = $8, "Outer_Erp_Sticker" = $9, "Name_Outer_Erp_Sticker" = $10, "Num_Sticker" = $11, "Outer_Per_pallet" = $12, "CreateBy" = $13 WHERE "id" = $14 RETURNING *`;
        const values = [Outer_Id, Num_Display_Box, Type_Diecut, Num_Outer, Outer_Erp_Id, Name_Outer_Erp, Set_Per_Outer, Set_Per_Outer_1, Outer_Erp_Sticker, Name_Outer_Erp_Sticker, Num_Sticker, Outer_Per_pallet, CreateBy, id];
        const updateResult = await dbconnect.query(updateSql, values);
        const updatedRecord = updateResult.rows[0];

        const columns = [
            "Outer_Id", "Num_Display_Box", "Type_Diecut", "Num_Outer", "Outer_Erp_Id", "Name_Outer_Erp", "Set_Per_Outer", "Set_Per_Outer_1", "Outer_Erp_Sticker", "Name_Outer_Erp_Sticker", "Num_Sticker", "Outer_Per_pallet", "CreateBy"
        ];
        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("Outer", column, id, oldValue, newValue, "updated" , userEmail);
            }
        }

        // Response
        res.status(200).json({
            success: true,
            data: updatedRecord,
            msg: `อัปเดตข้อมูล: ${Outer_Id} สำเร็จ`,
        });        

    } catch (error) {
        console.error("Error updating BOM:", error);
        res.status(500).json({
            success: false,
            msg: `เกิดข้อผิดพลาดขณะอัปเดตข้อมูล: ${Outer_Id} กรุณาลองอีกครั้ง.`,
            data: error.message,
        });
    }

}


module.exports = {
    getOuters,
    getOuter,
    postOuter,
    updateOuter

}