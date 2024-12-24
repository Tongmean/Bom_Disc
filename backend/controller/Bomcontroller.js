//call database connection
const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');
const nodemailer = require('nodemailer');
// Set up Nodemailer with Outlook SMTP
const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
      user: 'TEANG_T@su.ac.th',
      pass: 'King0965358947', // Use App password if 2FA is enabled
    },
});

//Get All record
const getBoms = async (req, res) => {
    try {
        dbconnect.query(`SELECT * FROM "bom" ORDER BY id ASC `, (err, result) => {
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
const getBom = async (req,res) =>{
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "bom" WHERE id = $1' , [id],(err, result) =>{
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

//createbom
const postBom = async (req, res) => {
    const userEmail = req.user.email; // This email comes from requireAuth
    const {
        Code_Fg, Num, Part_No, Sale_Code_Bom, Type_Customer, Customer_Name,
        Start_Sale_Date, Status, Drawing_No, Shim_Attach, Shim_No, Product_Spec_No,
        Data_Sheet_No, Display_Box_Id, Quantity_Display_Box, Outer_Package, Outer_Id,
        Pcs_Per_Set, Additional_Package_Id
    } = req.body;

    try {
        // Check for duplicate Code_Fg
        const sqlCheck = `SELECT * FROM "bom" WHERE "Code_Fg" = $1`;
        const checkResult = await dbconnect.query(sqlCheck, [Code_Fg]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkResult.rows,
                msg: `รหัสสินค้าสำเร็จรูป: ${Code_Fg} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }

        // Insert new BOM entry
        const sqlCommand = `
            INSERT INTO "bom" (
                "Code_Fg", "Num", "Part_No", "Sale_Code_Bom", "Type_Customer", "Customer_Name",
                "Start_Sale_Date", "Status", "Drawing_No", "Shim_Attach", "Shim_No", 
                "Product_Spec_No", "Data_Sheet_No", "Display_Box_Id", "Quantity_Display_Box",
                "Outer_Package","Outer_Id", "Pcs_Per_Set", "Additional_Package_Id", "CreateBy"
            ) 
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
            ) RETURNING *`;

        const values = [
            Code_Fg, Num, Part_No, Sale_Code_Bom, Type_Customer, Customer_Name,
            Start_Sale_Date, Status, Drawing_No, Shim_Attach, Shim_No, Product_Spec_No,
            Data_Sheet_No, Display_Box_Id, Quantity_Display_Box, Outer_Package, Outer_Id,
            Pcs_Per_Set, Additional_Package_Id, userEmail
        ];

        const insertResult = await dbconnect.query(sqlCommand, values);
        // Send email notification on success
        // const mailOptions = {
        //     from: 'TEANG_T@su.ac.th',
        //     to: 'tongmeanfc@gmail.com',
        //     subject: 'Notification from Express.js',
        //     text: `This is a success notification from your Express.js application. ${values}`,
        // };

        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //     console.log(error);
        //     return res.status(500).send('Error sending notification.');
        //     }
        //     console.log('Email sent: ' + info.response);
        //     res.status(200).send('Notification sent via Outlook!');
        // });

        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `รหัสสินค้าสำเร็จรูป: ${Code_Fg} บันทึกได้สำเร็จ ครับ`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
};

//update bom
const updateBom = async (req, res) => {
    const id = req.params.id;
    const userEmail = req.user.email; // Authenticated user email
    const {
        Code_Fg, Num, Part_No, Sale_Code_Bom, Type_Customer, Customer_Name,
        Start_Sale_Date, Status, Drawing_No, Shim_Attach, Shim_No, Product_Spec_No,
        Data_Sheet_No, Display_Box_Id, Quantity_Display_Box, Outer_Package,
        Pcs_Per_Set, Additional_Package_Id, CreateBy
    } = req.body;

    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "bom" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];

        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลที่มีรหัส: ${Code_Fg}`,
            });
        }

        // Update record
        const updateSql = `
            UPDATE "bom" 
            SET "Code_Fg" = $1, "Num" = $2, "Part_No" = $3, "Sale_Code_Bom" = $4, "Type_Customer" = $5, 
                "Customer_Name" = $6, "Start_Sale_Date" = $7, "Status" = $8, "Drawing_No" = $9, 
                "Shim_Attach" = $10, "Shim_No" = $11, "Product_Spec_No" = $12, "Data_Sheet_No" = $13, 
                "Display_Box_Id" = $14, "Quantity_Display_Box" = $15, "Outer_Package" = $16, 
                "Pcs_Per_Set" = $17, "Additional_Package_Id" = $18, "CreateBy" = $19 
            WHERE "id" = $20 RETURNING *`;

        const values = [
            Code_Fg, Num, Part_No, Sale_Code_Bom, Type_Customer, Customer_Name,
            Start_Sale_Date, Status, Drawing_No, Shim_Attach, Shim_No, Product_Spec_No,
            Data_Sheet_No, Display_Box_Id, Quantity_Display_Box, Outer_Package,
            Pcs_Per_Set, Additional_Package_Id, CreateBy, id
        ];

        const updateResult = await dbconnect.query(updateSql, values);
        const updatedRecord = updateResult.rows[0];

        // Log changes
        const columns = [
            "Code_Fg", "Num", "Part_No", "Sale_Code_Bom", "Type_Customer", "Customer_Name",
            "Start_Sale_Date", "Status", "Drawing_No", "Shim_Attach", "Shim_No", "Product_Spec_No",
            "Data_Sheet_No", "Display_Box_Id", "Quantity_Display_Box", "Outer_Package",
            "Pcs_Per_Set", "Additional_Package_Id", "CreateBy"
        ];

        // const action = updated;
        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("bom", column, id, oldValue, newValue, "updated" , userEmail);
            }
        }

        // Response
        res.status(200).json({
            success: true,
            data: updatedRecord,
            msg: `อัปเดตข้อมูล: ${Code_Fg} สำเร็จ`,
        });

    } catch (error) {
        console.error("Error updating :", error);
        res.status(500).json({
            success: false,
            msg: `เกิดข้อผิดพลาดขณะอัปเดตข้อมูล: ${Code_Fg} กรุณาลองอีกครั้ง.`,
            data: error.message,
        });
    }
};


module.exports ={
    getBoms,
    getBom,
    postBom,
    updateBom
  
}