const dbconnect = require('../middleware/Dbconnect');


const Homedisplay = async (req, res) => {
    const sqlCommand =
    `   SELECT 
            "bom"."Code_Fg", "bom"."Customer_Name", "bom"."Sale_Code_Bom", "bom"."Part_No", "bom"."Num", "bom"."Pcs_Per_Set", "bom"."Status",
            "Data_Sheet"."Formular", "Data_Sheet"."Weight_F1", "Data_Sheet"."Weight_F2", "Data_Sheet"."Underlayer_Grade_Chem", "Data_Sheet"."Weight_U1", "Data_Sheet"."Weight_U2",
            "Drawing"."Erp_Id_BP1", "Drawing"."Name_BP1", "Drawing"."Id_BP1", "Drawing"."Quantity_BP1",
            "Drawing"."Erp_Id_BP2", "Drawing"."Name_BP2", "Drawing"."Id_BP2", "Drawing"."Quantity_BP2",
            "Drawing"."Erp_Id_BP3", "Drawing"."Name_BP3", "Drawing"."Id_BP3", "Drawing"."Quantity_BP3",
            "Drawing"."Erp_Id_BP4", "Drawing"."Name_BP4", "Drawing"."Id_BP4", "Drawing"."Quantity_BP4",
            "Drawing"."Erp_Id_BP4", "Drawing"."Name_BP4", "Drawing"."Id_BP4", "Drawing"."Quantity_BP4",
            "Drawing"."Erp_Id_WD1", "Drawing"."Name_WD1", "Drawing"."Id_WD1", "Drawing"."Quantity_WD1",
            "Drawing"."Erp_Id_WD2", "Drawing"."Name_WD2", "Drawing"."Id_WD2", "Drawing"."Quantity_WD2",
            "Drawing"."Erp_Id_WD3", "Drawing"."Name_WD3", "Drawing"."Id_WD3", "Drawing"."Quantity_WD3",
            "bom"."Shim_Attach", "Product_Spec"."Product_Spec_Id",
            "Shim"."Erp_Id_SP1", "Shim"."Name_SP1", "Shim"."Id_SP1", "Shim"."Quantity_SP1",
            "Shim"."Erp_Id_SP2", "Shim"."Name_SP2", "Shim"."Id_SP2", "Shim"."Quantity_SP2",
            "Shim"."Erp_Id_SP3", "Shim"."Name_SP3", "Shim"."Id_SP3", "Shim"."Quantity_SP3",
            "Product_Spec"."Slot", "Product_Spec"."Chamfer", "Product_Spec"."Color", "Product_Spec"."Coating", "Product_Spec"."Scoarching",
            "Product_Spec"."Attach_Paper_Erp_Id_1", "Product_Spec"."Name_Attach_Paper_1", "Product_Spec"."Num_Attach_1",
            "Product_Spec"."Attach_Paper_Erp_Id_2", "Product_Spec"."Name_Attach_Paper_2", "Product_Spec"."Num_Attach_2",
            "Product_Spec"."Attach_Paper_Erp_Id_3", "Product_Spec"."Name_Attach_Paper_3", "Product_Spec"."Num_Attach_3",
            "Product_Spec"."Attach_Paper_Erp_Id_4", "Product_Spec"."Name_Attach_Paper_4", "Product_Spec"."Num_Attach_4",
            "Product_Spec"."Additional_Tool_Erp_Id", "Product_Spec"."Name_Erp_Additional_Tool", "Product_Spec"."Num_Additional_Tool",
            "Product_Spec"."Sticker_Erp_Id_1", "Product_Spec"."Sticker_Name_1", "Product_Spec"."Num_Sticker_1",
            "Product_Spec"."Sticker_Erp_Id_2", "Product_Spec"."Sticker_Name_2", "Product_Spec"."Num_Sticker_2",
            "Product_Spec"."Sticker_Erp_Id_3", "Product_Spec"."Sticker_Name_3", "Product_Spec"."Num_Sticker_3",
            "Additional_Package"."Additional_Tool_Erp_Id_1", "Additional_Package"."Name_Additional_Tool_1","Additional_Package"."Quantity_Additional_Tool_1",
            "Additional_Package"."Additional_Tool_Erp_Id_2", "Additional_Package"."Name_Additional_Tool_2","Additional_Package"."Quantity_Additional_Tool_2",
            "Package"."Display_Box_id", "Package"."Display_Box_Erp_Id", "Package"."Name_Display_Box_Erp", 
            "bom"."Quantity_Display_Box", "bom"."Outer_Package", "Outer"."Num_Outer", "Outer"."Outer_Erp_Id", "Outer"."Name_Outer_Erp",
            "Outer"."Set_Per_Outer", "Outer"."Outer_Erp_Sticker","Outer"."Name_Outer_Erp_Sticker","Outer"."Num_Sticker", "Outer"."Outer_Per_pallet"	
        FROM 
            "bom"
        LEFT JOIN 
            "Package" 
        ON 
            "bom"."Display_Box_Id" = "Package"."Display_Box_id"
        LEFT JOIN 
            "Outer" 
        ON 
            "Outer"."Outer_Id" = "bom"."Outer_Id"
        LEFT JOIN 
            "Data_Sheet" 
        ON 
            "Data_Sheet"."Data_Sheet_No" = "bom"."Data_Sheet_No"
        LEFT JOIN 
            "Product_Spec" 
        ON 
            "Product_Spec"."Product_Spec_Id" = "bom"."Product_Spec_No"
        LEFT JOIN 
            "Additional_Package" 
        ON 
            "Additional_Package"."Additional_Package_Id" = "bom"."Additional_Package_Id"
        LEFT JOIN 
            "Shim" 
        ON 
            "Shim"."Compact_No_Modify" = "bom"."Shim_No"
        LEFT JOIN
            "Drawing" 
        ON 
            "bom"."Drawing_No" = "Drawing"."Compact_No_Modify_Drawing";
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


const Wipdisplay = async (req, res) => {
    const sqlCommand = 
    `
        SELECT 
            "bom"."Code_Fg",
            "Data_Sheet"."Formular",
            "Drawing"."Id_BP1", "Drawing"."Quantity_BP1", "Drawing"."Thickness_Pad1",
            "Drawing"."Id_BP2", "Drawing"."Quantity_BP2", "Drawing"."Thickness_Pad2",
            "Drawing"."Id_BP3", "Drawing"."Quantity_BP3", "Drawing"."Thickness_Pad3",
            "Drawing"."Id_BP4", "Drawing"."Quantity_BP4", "Drawing"."Thickness_Pad4",
            "Product_Spec"."Slot", "Product_Spec"."Chamfer", "Product_Spec"."Color_Id", 
            "Product_Spec"."Coating", "Product_Spec"."Scoarching", "Product_Spec"."Scoarching_Coating_Id"
        FROM 
            "bom"
        LEFT JOIN 
            "Data_Sheet" 
        ON 
            "Data_Sheet"."Data_Sheet_No" = "bom"."Data_Sheet_No"
        LEFT JOIN 
            "Product_Spec" 
        ON 
            "Product_Spec"."Product_Spec_Id" = "bom"."Product_Spec_No"
        LEFT JOIN
            "Drawing" 
        ON 
            "bom"."Drawing_No" = "Drawing"."Compact_No_Modify_Drawing";
    
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

module.exports = {
    Homedisplay,
    Wipdisplay


}

