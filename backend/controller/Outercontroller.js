//call database connection
const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');

//Get all record
const getOuters = async (req, res) => {
    const sqlCommand = `
        SELECT 
            "Outer"."id", 
            "Outer"."Outer_Id", 
            "Outer"."Name_Erp_Outer", 
            "Outer"."Num_Outer",
            "Outer"."Erp_Id_Inner", 
            "Outer"."Name_Erp_Inner", 
            "Outer"."Die_Cut", 
            "Outer"."Set_Per_Outer", 
            "Outer"."Outer_Per_pallet", 
            "Outer"."Set_Per_Pallet",
            "Outer"."CreateAt",
            "Outer"."CreateBy",
            "Outer_Package"."Erp_Id" AS "Erp_Id_Outer", 
            "Inner_Package"."Erp_Id" AS "Erp_Id_Inner"
        FROM 
            "Outer"
        LEFT JOIN 
            "Package" AS "Outer_Package"
        ON 
            "Outer"."Erp_Id_Outer" = "Outer_Package"."Rm_Pk_Id"
        LEFT JOIN 
            "Package" AS "Inner_Package"
        ON 
            "Outer"."Erp_Id_Inner" = "Inner_Package"."Rm_Pk_Id";
    `
    try {
        dbconnect.query(sqlCommand, (err, result) => {
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
    const { Outer_Id, Erp_Id_Outer, Name_Erp_Outer, Num_Outer, Erp_Id_Inner, Name_Erp_Inner, Die_Cut, Set_Per_Outer, Outer_Per_pallet, Set_Per_Pallet, CreateBy,} = req.body;
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
        const sqlCommand = `INSERT INTO "Outer" ("Outer_Id", "Erp_Id_Outer", "Name_Erp_Outer", "Num_Outer", "Erp_Id_Inner", "Name_Erp_Inner", "Die_Cut", "Set_Per_Outer", "Outer_Per_pallet", "Set_Per_Pallet", "CreateBy")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
        `;
        const values = [Outer_Id, Erp_Id_Outer, Name_Erp_Outer, Num_Outer, Erp_Id_Inner, Name_Erp_Inner, Die_Cut ,Set_Per_Outer, Outer_Per_pallet, Set_Per_Pallet, userEmail];

        const insertResult = await dbconnect.query(sqlCommand, values);

        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `รหัสกล่อง: ${Outer_Id} บันทึกได้สำเร็จ ครับ`
        });
    } catch (error) {
        console.log('Outer post', error)
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
    const { Outer_Id, Erp_Id_Outer, Name_Erp_Outer, Num_Outer, Erp_Id_Inner, Name_Erp_Inner, Die_Cut, Set_Per_Outer, Outer_Per_pallet, Set_Per_Pallet, CreateBy,} = req.body;
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
        const updateSql = `UPDATE "Outer" SET "Outer_Id" = $1, "Erp_Id_Outer" = $2, "Name_Erp_Outer" = $3, "Num_Outer" = $4, "Erp_Id_Inner" = $5, "Name_Erp_Inner" = $6, "Die_Cut" = $7, "Set_Per_Outer" = $8, "Outer_Per_pallet" = $9, "Set_Per_Pallet" = $10, "CreateBy" = $11 WHERE "id" = $12 RETURNING *`;
        const values = [Outer_Id, Erp_Id_Outer, Name_Erp_Outer, Num_Outer, Erp_Id_Inner, Name_Erp_Inner, Die_Cut, Set_Per_Outer, Outer_Per_pallet, Set_Per_Pallet, CreateBy, id];

        const updateResult = await dbconnect.query(updateSql, values);
        const updatedRecord = updateResult.rows[0];

        const columns = [
            "Outer_Id", "Erp_Id_Outer", "Name_Erp_Outer", "Num_Outer", "Erp_Id_Inner", "Name_Erp_Inner", "Die_Cut", "Set_Per_Outer", "Outer_Per_pallet", "Set_Per_Pallet", "CreateBy"
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