//call database connection
const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');

//Get All record
const getaddtionaltools = async (req, res) => {
    try {
        dbconnect.query(`SELECT * FROM "Additional_Package"`, (err, result) => {
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
const getaddtionaltool = async (req,res) =>{
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "Additional_Package" WHERE id = $1' , [id],(err, result) =>{
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

//post 
const postAdditionaltools = async (req, res) =>{
    const userEmail = req.user.email; // This email comes from requireAuth
    const {Additional_Package_Id, Additional_Tool_Erp_Id_1, Name_Additional_Tool_1, Quantity_Additional_Tool_1, Additional_Tool_Erp_Id_2, Name_Additional_Tool_2, Quantity_Additional_Tool_2, CreateBy} = req.body;
    try {
        // Check for duplicate Code_Fg
        const sqlCheck = `SELECT * FROM "Additional_Package" WHERE "Additional_Package_Id" = $1`;
        const checkResult = await dbconnect.query(sqlCheck, [Additional_Package_Id]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkResult.rows,
                msg: `รหัสการบรรจุที่ใส่อุปกรณ์เสริมเพิ่มเติมมา: ${Additional_Package_Id} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }
        //Insert Record
        const sqlCommand = `
            INSERT INTO "Additional_Package" ("Additional_Package_Id", "Additional_Tool_Erp_Id_1", "Name_Additional_Tool_1", "Quantity_Additional_Tool_1", "Additional_Tool_Erp_Id_2", "Name_Additional_Tool_2", "Quantity_Additional_Tool_2", "CreateBy")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
        `
        const values = [Additional_Package_Id, Additional_Tool_Erp_Id_1, Name_Additional_Tool_1, Quantity_Additional_Tool_1, Additional_Tool_Erp_Id_2, Name_Additional_Tool_2, Quantity_Additional_Tool_2, userEmail];
        const insertResult = await dbconnect.query(sqlCommand, values);

        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `รหัสการบรรจุที่ใส่อุปกรณ์เสริมเพิ่มเติมมา: ${Additional_Package_Id} บันทึกได้สำเร็จ ครับ`
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}

//update
const updateAdditionaltool = async (req, res) =>{
    const id = req.params.id;
    const userEmail = req.user.email; // This email comes from requireAuth
    const {Additional_Package_Id, Additional_Tool_Erp_Id_1, Name_Additional_Tool_1, Quantity_Additional_Tool_1, Additional_Tool_Erp_Id_2, Name_Additional_Tool_2, Quantity_Additional_Tool_2, CreateBy} = req.body;
    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Additional_Package" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];

        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลที่มีรหัส: ${Additional_Package_Id}`,
            });
        }
        //update-record
        const updateSql = `UPDATE "Additional_Package" SET "Additional_Package_Id" = $1, "Additional_Tool_Erp_Id_1" = $2, "Name_Additional_Tool_1" = $3, "Quantity_Additional_Tool_1" = $4, "Additional_Tool_Erp_Id_2" = $5, "Name_Additional_Tool_2" = $6, "Quantity_Additional_Tool_2" = $7, "CreateBy" = $8 WHERE id = $9 RETURNING *`;
        const values = [Additional_Package_Id, Additional_Tool_Erp_Id_1, Name_Additional_Tool_1, Quantity_Additional_Tool_1, Additional_Tool_Erp_Id_2, Name_Additional_Tool_2, Quantity_Additional_Tool_2, CreateBy, id];
        const updateResult = await dbconnect.query(updateSql, values);
        const updatedRecord = updateResult.rows[0];
        //Log change
        const columns = [
            "Additional_Package_Id", "Additional_Tool_Erp_Id_1", "Name_Additional_Tool_1", "Quantity_Additional_Tool_1", "Additional_Tool_Erp_Id_2", "Name_Additional_Tool_2", "Quantity_Additional_Tool_2", "CreateBy"
        ];

        // const action = updated;
        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("Additional_Package", column, id, oldValue, newValue, "updated" , userEmail);
            }
        }

        // Response
        res.status(200).json({
            success: true,
            data: updatedRecord,
            msg: `อัปเดตข้อมูล: ${Additional_Package_Id} สำเร็จ`,
        });        
        
    } catch (error) {
        console.error("Error updating:", error);
        res.status(500).json({
            success: false,
            msg: `เกิดข้อผิดพลาดขณะอัปเดตข้อมูล: ${Additional_Package_Id} กรุณาลองอีกครั้ง.`,
            data: error.message,
        });       
    }

}
module.exports ={
    getaddtionaltools,
    getaddtionaltool,
    postAdditionaltools,
    updateAdditionaltool

  
}