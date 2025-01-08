//call database connection
const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');
//Get All record
const getProductspecs = async (req, res) => {
    try {
        dbconnect.query(`SELECT * FROM "Product_Spec" ORDER BY id ASC `, (err, result) => {
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
const getProductspec = async (req,res) =>{
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "Product_Spec" WHERE id = $1' , [id],(err, result) =>{
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

//post product spec

const postProductspec = async (req, res) =>{
    const userEmail = req.user.email; // This email comes from requireAuth
    const {Product_Spec_Id, Sale_Code, Coating, Scoarching, Scoarching_Coating_Id, Shim, Slot, Chamfer, Color, Color_Id, Customer_Name_Product_Spec, Chem_Formular, Formula_Under_Layer, Sticker_Name_1, Sticker_Erp_Id_1, Num_Sticker_1, Sticker_Name_2, Sticker_Erp_Id_2, Num_Sticker_2, Sticker_Name_3, Sticker_Erp_Id_3, Num_Sticker_3, Name_Attach_Paper_1, Attach_Paper_Erp_Id_1, Num_Attach_1, Name_Attach_Paper_2, Attach_Paper_Erp_Id_2, Num_Attach_2, Name_Attach_Paper_3, Attach_Paper_Erp_Id_3, Num_Attach_3, Name_Attach_Paper_4, Attach_Paper_Erp_Id_4, Num_Attach_4, Name_Erp_Additional_Tool_1, Additional_Tool_Erp_Id_1, Num_Additional_Tool_1, CreateBy, Status, Customer_Code, Additional_Tool_Erp_Id_2, Name_Erp_Additional_Tool_2, Num_Additional_Tool_2, Additional_Tool_Erp_Id_3, Name_Erp_Additional_Tool_3, Num_Additional_Tool_3} = req.body;
    try {
        // Check for duplicate Code_Fg
        const sqlCheck = `SELECT * FROM "Product_Spec" WHERE "Product_Spec_Id" = $1`;
        const checkResult = await dbconnect.query(sqlCheck, [Product_Spec_Id]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkResult.rows,
                msg: `รหัส Product Spec.: ${Product_Spec_Id} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }     
        //Insert Record
        const sqlCommand = `
            INSERT INTO "Product_Spec" (
                "Product_Spec_Id", "Sale_Code", "Coating", "Scoarching", "Scoarching_Coating_Id", 
                "Shim", "Slot", "Chamfer", "Color", "Color_Id", "Customer_Name_Product_Spec", 
                "Chem_Formular", "Formula_Under_Layer", "Sticker_Name_1", "Sticker_Erp_Id_1", 
                "Num_Sticker_1", "Sticker_Name_2", "Sticker_Erp_Id_2", "Num_Sticker_2", 
                "Sticker_Name_3", "Sticker_Erp_Id_3", "Num_Sticker_3", "Name_Attach_Paper_1", 
                "Attach_Paper_Erp_Id_1", "Num_Attach_1", "Name_Attach_Paper_2", "Attach_Paper_Erp_Id_2", 
                "Num_Attach_2", "Name_Attach_Paper_3", "Attach_Paper_Erp_Id_3", "Num_Attach_3", 
                "Name_Attach_Paper_4", "Attach_Paper_Erp_Id_4", "Num_Attach_4", 
                "Name_Erp_Additional_Tool_1", "Additional_Tool_Erp_Id_1", "Num_Additional_Tool_1", 
                "CreateBy", "Status", "Customer_Code", "Additional_Tool_Erp_Id_2", 
                "Name_Erp_Additional_Tool_2", "Num_Additional_Tool_2", "Additional_Tool_Erp_Id_3", 
                "Name_Erp_Additional_Tool_3", "Num_Additional_Tool_3"
            ) 
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 
                $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36,$37, $38, $39, $40, 
                $41, $42, $43, $44, $45, $46
            ) RETURNING *
        `;
        const values = [Product_Spec_Id, Sale_Code, Coating, Scoarching, Scoarching_Coating_Id, Shim, Slot, Chamfer, Color, Color_Id, Customer_Name_Product_Spec, Chem_Formular, Formula_Under_Layer, Sticker_Name_1, Sticker_Erp_Id_1, Num_Sticker_1, Sticker_Name_2, Sticker_Erp_Id_2, Num_Sticker_2, Sticker_Name_3, Sticker_Erp_Id_3, Num_Sticker_3, Name_Attach_Paper_1, Attach_Paper_Erp_Id_1, Num_Attach_1, Name_Attach_Paper_2, Attach_Paper_Erp_Id_2, Num_Attach_2, Name_Attach_Paper_3, Attach_Paper_Erp_Id_3, Num_Attach_3, Name_Attach_Paper_4, Attach_Paper_Erp_Id_4, Num_Attach_4, Name_Erp_Additional_Tool_1, Additional_Tool_Erp_Id_1, Num_Additional_Tool_1, userEmail, Status, Customer_Code, Additional_Tool_Erp_Id_2, Name_Erp_Additional_Tool_2, Num_Additional_Tool_2, Additional_Tool_Erp_Id_3, Name_Erp_Additional_Tool_3, Num_Additional_Tool_3];
        const insertResult = await dbconnect.query(sqlCommand, values);

        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `รหัส Product Spec.: ${Product_Spec_Id} บันทึกได้สำเร็จ ครับ`
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

//update Product Spec
const updateProductspec = async (req, res) => {
    const id = req.params.id;
    const userEmail = req.user.email; // This email comes from requireAuth
    const {Product_Spec_Id, Sale_Code, Coating, Scoarching, Scoarching_Coating_Id, Shim, Slot, Chamfer, Color, Color_Id, Customer_Name_Product_Spec, Chem_Formular, Formula_Under_Layer, Sticker_Name_1, Sticker_Erp_Id_1, Num_Sticker_1, Sticker_Name_2, Sticker_Erp_Id_2, Num_Sticker_2, Sticker_Name_3, Sticker_Erp_Id_3, Num_Sticker_3, Name_Attach_Paper_1, Attach_Paper_Erp_Id_1, Num_Attach_1, Name_Attach_Paper_2, Attach_Paper_Erp_Id_2, Num_Attach_2, Name_Attach_Paper_3, Attach_Paper_Erp_Id_3, Num_Attach_3, Name_Attach_Paper_4, Attach_Paper_Erp_Id_4, Num_Attach_4, Name_Erp_Additional_Tool_1, Additional_Tool_Erp_Id_1, Num_Additional_Tool_1, CreateBy, Status, Customer_Code, Additional_Tool_Erp_Id_2, Name_Erp_Additional_Tool_2, Num_Additional_Tool_2, Additional_Tool_Erp_Id_3, Name_Erp_Additional_Tool_3, Num_Additional_Tool_3} = req.body;

    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Product_Spec" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];

        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลที่มีรหัส: ${Product_Spec_Id}`,
            });
        }
        // const updateSql = `
        //     UPDATE "Product_Spec" 
        //     SET "Product_Spec_Id" = $1, "Sale_Code" = $2, "Coating" = $3, "Scoarching" = $4, "Scoarching_Coating_Id" = $5,
        //         "Shim" = $6, "Slot" = $7, "Chamfer" = $8, "Color" = $9, "Color_Id" = $10, "Customer_Name_Product_Spec" = $11, 
        //         "Chem_Formular" = $12, "Formula_Under_Layer" = $13, "Sticker_Name_1" = $14, "Sticker_Erp_Id_1" = $15, 
        //         "Num_Sticker_1" = $16, "Sticker_Name_2" = $17, "Sticker_Erp_Id_2" = $18, "Num_Sticker_2" = $19, 
        //         "Sticker_Name_3" = $20, "Sticker_Erp_Id_3" = $21, "Num_Sticker_3" = $22, "Name_Attach_Paper_1" = $23, 
        //         "Attach_Paper_Erp_Id_1" = $24, "Num_Attach_1" = $25, "Name_Attach_Paper_2" = $26, "Attach_Paper_Erp_Id_2" = $27, 
        //         "Num_Attach_2" = $28, "Name_Attach_Paper_3" = $29, "Attach_Paper_Erp_Id_3" = $30, "Num_Attach_3" = $31, 
        //         "Name_Attach_Paper_4" = $32, "Attach_Paper_Erp_Id_4" = $33, "Num_Attach_4" = $34, 
        //         "Name_Erp_Additional_Tool" = $35, "Additional_Tool_Erp_Id" = $36, "Num_Additional_Tool" = $37, 
        //         "Column_36" = $38, "CreateBy" = $39, "Status" = $40
        //     WHERE "id" = $41 RETURNING *
        // `;

        // const values = [
        //     Product_Spec_Id, Sale_Code, Coating, Scoarching, Scoarching_Coating_Id,
        //     Shim, Slot, Chamfer, Color, Color_Id, Customer_Name_Product_Spec,
        //     Chem_Formular, Formula_Under_Layer, Sticker_Name_1, Sticker_Erp_Id_1, 
        //     Num_Sticker_1, Sticker_Name_2, Sticker_Erp_Id_2, Num_Sticker_2, 
        //     Sticker_Name_3, Sticker_Erp_Id_3, Num_Sticker_3, Name_Attach_Paper_1, 
        //     Attach_Paper_Erp_Id_1, Num_Attach_1, Name_Attach_Paper_2, Attach_Paper_Erp_Id_2, 
        //     Num_Attach_2, Name_Attach_Paper_3, Attach_Paper_Erp_Id_3, Num_Attach_3, 
        //     Name_Attach_Paper_4, Attach_Paper_Erp_Id_4, Num_Attach_4, 
        //     Name_Erp_Additional_Tool, Additional_Tool_Erp_Id, Num_Additional_Tool, 
        //     Column_36, CreateBy, Status, id
        // ];
        // //Update Query Script
        // const updateResult = await dbconnect.query(updateSql, values);
        // Update Record Using Product_Spec_Id
        const sqlCommand = `
        UPDATE "Product_Spec"
        SET 
            "Product_Spec_Id" = $1, "Sale_Code" = $2, "Coating" = $3, "Scoarching" = $4, "Scoarching_Coating_Id" = $5, 
            "Shim" = $6, "Slot" = $7, "Chamfer" = $8, "Color" = $9, "Color_Id" = $10, 
            "Customer_Name_Product_Spec" = $11, "Chem_Formular" = $12, "Formula_Under_Layer" = $13, 
            "Sticker_Name_1" = $14, "Sticker_Erp_Id_1" = $15, "Num_Sticker_1" = $16, 
            "Sticker_Name_2" = $17, "Sticker_Erp_Id_2" = $18, "Num_Sticker_2" = $19, 
            "Sticker_Name_3" = $20, "Sticker_Erp_Id_3" = $21, "Num_Sticker_3" = $22, 
            "Name_Attach_Paper_1" = $23, "Attach_Paper_Erp_Id_1" = $24, "Num_Attach_1" = $25, 
            "Name_Attach_Paper_2" = $26, "Attach_Paper_Erp_Id_2" = $27, "Num_Attach_2" = $28, 
            "Name_Attach_Paper_3" = $29, "Attach_Paper_Erp_Id_3" = $30, "Num_Attach_3" = $31, 
            "Name_Attach_Paper_4" = $32, "Attach_Paper_Erp_Id_4" = $33, "Num_Attach_4" = $34, 
            "Name_Erp_Additional_Tool_1" = $35, "Additional_Tool_Erp_Id_1" = $36, 
            "Num_Additional_Tool_1" = $37, "CreateBy" = $38, "Status" = $39, 
            "Customer_Code" = $40, "Additional_Tool_Erp_Id_2" = $41, "Name_Erp_Additional_Tool_2" = $42, 
            "Num_Additional_Tool_2" = $43, "Additional_Tool_Erp_Id_3" = $44, 
            "Name_Erp_Additional_Tool_3" = $45, "Num_Additional_Tool_3" = $46
        WHERE 
            "id" = $47
        RETURNING *;
        `;
        const values = [
            Product_Spec_Id, Sale_Code, Coating, Scoarching, Scoarching_Coating_Id, 
            Shim, Slot, Chamfer, Color, Color_Id, Customer_Name_Product_Spec, 
            Chem_Formular, Formula_Under_Layer, Sticker_Name_1, Sticker_Erp_Id_1, 
            Num_Sticker_1, Sticker_Name_2, Sticker_Erp_Id_2, Num_Sticker_2, 
            Sticker_Name_3, Sticker_Erp_Id_3, Num_Sticker_3, Name_Attach_Paper_1, 
            Attach_Paper_Erp_Id_1, Num_Attach_1, Name_Attach_Paper_2, Attach_Paper_Erp_Id_2, 
            Num_Attach_2, Name_Attach_Paper_3, Attach_Paper_Erp_Id_3, Num_Attach_3, 
            Name_Attach_Paper_4, Attach_Paper_Erp_Id_4, Num_Attach_4, 
            Name_Erp_Additional_Tool_1, Additional_Tool_Erp_Id_1, Num_Additional_Tool_1, 
            userEmail, Status, Customer_Code, Additional_Tool_Erp_Id_2, 
            Name_Erp_Additional_Tool_2, Num_Additional_Tool_2, Additional_Tool_Erp_Id_3, 
            Name_Erp_Additional_Tool_3, Num_Additional_Tool_3, id
        ];
        const updateResult = await dbconnect.query(sqlCommand, values);

        const updatedRecord = updateResult.rows[0];
        // Log changes
        const columns = [
            "Product_Spec_Id", "Sale_Code", "Coating", "Scoarching", "Scoarching_Coating_Id", 
            "Shim", "Slot", "Chamfer", "Color", "Color_Id", "Customer_Name_Product_Spec", 
            "Chem_Formular", "Formula_Under_Layer", "Sticker_Name_1", "Sticker_Erp_Id_1", 
            "Num_Sticker_1", "Sticker_Name_2", "Sticker_Erp_Id_2", "Num_Sticker_2", 
            "Sticker_Name_3", "Sticker_Erp_Id_3", "Num_Sticker_3", "Name_Attach_Paper_1", 
            "Attach_Paper_Erp_Id_1", "Num_Attach_1", "Name_Attach_Paper_2", "Attach_Paper_Erp_Id_2", 
            "Num_Attach_2", "Name_Attach_Paper_3", "Attach_Paper_Erp_Id_3", "Num_Attach_3", 
            "Name_Attach_Paper_4", "Attach_Paper_Erp_Id_4", "Num_Attach_4", 
            "Name_Erp_Additional_Tool", "Additional_Tool_Erp_Id", "Num_Additional_Tool", 
            "Column_36", "CreateBy" , "Status"
        ];

        // const action = updated;
        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("Product_Spec", column, id, oldValue, newValue, "updated" , userEmail);
            }
        }

        // Response
        res.status(200).json({
            success: true,
            data: updatedRecord,
            msg: `อัปเดตข้อมูล: ${Product_Spec_Id} สำเร็จ`,
        });

    } catch (error) {
        console.error("Error updating BOM:", error);
        res.status(500).json({
            success: false,
            msg: `เกิดข้อผิดพลาดขณะอัปเดตข้อมูล: ${Product_Spec_Id} กรุณาลองอีกครั้ง.`,
            data: error.message,
        });
    }
}



module.exports ={
    getProductspecs,
    getProductspec,
    postProductspec,
    updateProductspec
  
}