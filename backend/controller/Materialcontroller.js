const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');
//Get all record
const getMaterials = (req, res) =>{
    try {
        dbconnect.query(`SELECT * FROM "Material" ORDER BY id ASC `, (err, result) => {
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
const getMaterial = async (req,res) =>{
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "Material" WHERE id = $1' , [id],(err, result) =>{
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
const postMaterial = async (req, res) =>{
    const userEmail = req.user.email; // This email comes from requireAuth
    const {
        Compact_No_Modify, Compact_No_Catalog, Drawing_no, Type_Drawing, Num, Sheet, 
        Data_Approve, Edion, Cabinet_Id, Remark, Document_Id, Type1, Type2, Type3, 
        ID, Width, Length, Thick, Shim_Thick, Height, Hole_Scale, Quantity_Shim, 
        Option, Area, Drill, Type_Shim, Working_Duration
    } = req.body;
    try {
        //Insert New Record RETURNING *
        const sqlCommand = `
            INSERT INTO "Material" (
                "Compact_No_Modify", "Compact_No_Catalog", "Drawing_no", "Type_Drawing", "Num", "Sheet", 
                "Data_Approve", "Edion", "Cabinet_Id", "Remark", "Document_Id", "Type1", "Type2", "Type3", 
                "ID", "Width", "Length", "Thick", "Shim_Thick", "Height", "Hole_Scale", "Quantity_Shim", 
                "Option", "Area", "Drill", "Type_Shim", create_by, "Working_Duration"
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
                $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28
            ) RETURNING *
        `;
        const values = [
            Compact_No_Modify, Compact_No_Catalog, Drawing_no, Type_Drawing, Num, Sheet, 
            Data_Approve, Edion, Cabinet_Id, Remark, Document_Id, Type1, Type2, Type3, 
            ID, Width, Length, Thick, Shim_Thick, Height, Hole_Scale, Quantity_Shim, 
            Option, Area, Drill, Type_Shim, userEmail, Working_Duration
        ];
        const insertResult = await dbconnect.query(sqlCommand, values);

        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `บันทึกได้สำเร็จ ครับ`
        });

    } catch (error) {
        console.log('error materil',error)
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}



//update package
const updateMaterial = async (req, res) => {
    const id = req.params.id;
    const userEmail = req.user.email; // Authenticated user email
    const {
        Compact_No_Modify, Compact_No_Catalog, Drawing_no, Type_Drawing, Num, Sheet, 
        Data_Approve, Edion, Cabinet_Id, Remark, Document_Id, Type1, Type2, Type3, 
        ID, Width, Length, Thick, Shim_Thick, Height, Hole_Scale, Quantity_Shim, 
        Option, Area, Drill, Type_Shim, Working_Duration
    } = req.body;
    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Material" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];

        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลที่มีรหัส: `,
            });
        }
        //Update Record
        const updateSql = `
            UPDATE "Material" 
            SET 
                "Compact_No_Modify" = $1, 
                "Compact_No_Catalog" = $2, 
                "Drawing_no" = $3, 
                "Type_Drawing" = $4, 
                "Num" = $5, 
                "Sheet" = $6, 
                "Data_Approve" = $7, 
                "Edion" = $8, 
                "Cabinet_Id" = $9, 
                "Remark" = $10, 
                "Document_Id" = $11, 
                "Type1" = $12, 
                "Type2" = $13, 
                "Type3" = $14, 
                "ID" = $15, 
                "Width" = $16, 
                "Length" = $17, 
                "Thick" = $18, 
                "Shim_Thick" = $19, 
                "Height" = $20, 
                "Hole_Scale" = $21, 
                "Quantity_Shim" = $22, 
                "Option" = $23, 
                "Area" = $24, 
                "Drill" = $25, 
                "Type_Shim" = $26, 
                create_by = $27,
                "Working_Duration" = $28
            WHERE id = $29
            RETURNING *;
        `;
        const values = [
            Compact_No_Modify, Compact_No_Catalog, Drawing_no, Type_Drawing, Num, Sheet, 
            Data_Approve, Edion, Cabinet_Id, Remark, Document_Id, Type1, Type2, Type3, 
            ID, Width, Length, Thick, Shim_Thick, Height, Hole_Scale, Quantity_Shim, 
            Option, Area, Drill, Type_Shim, userEmail, Working_Duration , id
        ];
        const updateResult = await dbconnect.query(updateSql, values);
        const updatedRecord = updateResult.rows[0];

        const columns = [
            "Compact_No_Modify", "Compact_No_Catalog", "Drawing_no", "Type_Drawing", "Num", "Sheet", 
            "Data_Approve", "Edion", "Cabinet_Id", "Remark", "Document_Id", "Type1", "Type2", "Type3", 
            "ID", "Width", "Length", "Thick", "Shim_Thick", "Height", "Hole_Scale", "Quantity_Shim", 
            "Option", "Area", "Drill", "Type_Shim", "Working_Duration"
        ]; 

        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("Material", column, id, oldValue, newValue, "updated" , userEmail);
            }
        }

        // Response
        res.status(200).json({
            success: true,
            data: updatedRecord,
            msg: `อัปเดตข้อมูล:สำเร็จแล้ว ครับ`,
        });       

       
    } catch (error) {
        console.error("Error updating: Material", error);
        res.status(500).json({
            success: false,
            msg: `เกิดข้อผิดพลาดขณะอัปเดตข้อมูล: กรุณาลองอีกครั้ง.`,
            data: error.message,
        });
    }
}



module.exports ={
    getMaterials,
    getMaterial,
    postMaterial,
    updateMaterial



}