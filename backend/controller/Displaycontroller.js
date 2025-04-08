const dbconnect = require('../middleware/Dbconnect');


const Homedisplay = async (req, res) => {
    const sqlCommand = `
        SELECT DISTINCT 
            "bom"."Code_Fg", "bom"."Customer_Name", "bom"."Sale_Code_Bom", "bom"."Part_No", "bom"."Num", "bom"."Pcs_Per_Set", "bom"."Status",
            "bom"."Weight","bom"."Emark_Id",
            "Data_Sheet"."Formular", "Data_Sheet"."Weight_F1", "Data_Sheet"."Weight_F2", "Data_Sheet"."Underlayer_Grade_Chem", "Data_Sheet"."Weight_U1", "Data_Sheet"."Weight_U2", "Data_Sheet"."Grade_Chem",
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
            "Product_Spec"."Additional_Tool_Erp_Id_1", "Product_Spec"."Name_Erp_Additional_Tool_1", "Product_Spec"."Num_Additional_Tool_1",
            "Product_Spec"."Additional_Tool_Erp_Id_2", "Product_Spec"."Name_Erp_Additional_Tool_2", "Product_Spec"."Num_Additional_Tool_2",
            "Product_Spec"."Additional_Tool_Erp_Id_3", "Product_Spec"."Name_Erp_Additional_Tool_3", "Product_Spec"."Num_Additional_Tool_3",
            "Product_Spec"."Sticker_Erp_Id_1", "Product_Spec"."Sticker_Name_1", "Product_Spec"."Num_Sticker_1",
            "Product_Spec"."Sticker_Erp_Id_2", "Product_Spec"."Sticker_Name_2", "Product_Spec"."Num_Sticker_2",
            "Product_Spec"."Sticker_Erp_Id_3", "Product_Spec"."Sticker_Name_3", "Product_Spec"."Num_Sticker_3",
            "Additional_Package"."Additional_Tool_Erp_Id_1", "Additional_Package"."Name_Additional_Tool_1","Additional_Package"."Quantity_Additional_Tool_1",
            "Additional_Package"."Additional_Tool_Erp_Id_2", "Additional_Package"."Name_Additional_Tool_2","Additional_Package"."Quantity_Additional_Tool_2",
            "Package"."Rm_Pk_Id", "Package"."Erp_Id", "Package"."Name_Erp", "Package"."Erp_Id",
            "bom"."Quantity_Display_Box", "bom"."Outer_Package",
            "Outer"."Num_Outer", "Outer"."Outer_Id", "Outer"."Name_Erp_Outer","Outer"."Erp_Id_Outer",
            "Outer"."Set_Per_Outer", "Outer"."Outer_Per_pallet", "Outer"."Set_Per_Pallet"
            
        FROM 
            "bom"
        LEFT JOIN 
            "Package" 
        ON 
            "bom"."Display_Box_Id" = "Package"."Rm_Pk_Id"
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


// const Wipdisplay = async (req, res) => {
//     const sqlCommand = 
//     `
//         SELECT 
//             "bom"."Code_Fg", "bom"."Num","bom"."Part_No",
//             "Data_Sheet"."Formular", "Data_Sheet"."Grade_Chem",
//             "Drawing"."Id_BP1", "Drawing"."Quantity_BP1", "Drawing"."Thickness_Pad1",
//             "Drawing"."Id_BP2", "Drawing"."Quantity_BP2", "Drawing"."Thickness_Pad2",
//             "Drawing"."Id_BP3", "Drawing"."Quantity_BP3", "Drawing"."Thickness_Pad3",
//             "Drawing"."Id_BP4", "Drawing"."Quantity_BP4", "Drawing"."Thickness_Pad4",
//             "Product_Spec"."Slot", "Product_Spec"."Chamfer", "Product_Spec"."Color_Id", 
//             "Product_Spec"."Coating", "Product_Spec"."Scoarching", "Product_Spec"."Scoarching_Coating_Id"
//         FROM 
//             "bom"
//         LEFT JOIN 
//             "Data_Sheet" 
//         ON 
//             "Data_Sheet"."Data_Sheet_No" = "bom"."Data_Sheet_No"
//         LEFT JOIN 
//             "Product_Spec" 
//         ON 
//             "Product_Spec"."Product_Spec_Id" = "bom"."Product_Spec_No"
//         LEFT JOIN
//             "Drawing" 
//         ON 
//             "bom"."Drawing_No" = "Drawing"."Compact_No_Modify_Drawing";
    
//     `
//     try {
//         dbconnect.query(sqlCommand, (err, result) => {
//             if (err) {
//                 res.status(500).json({
//                     success: false,
//                     msg: "ดึงข้อมูลไม่สำเร็จ",
//                     data: err // 'result' would be undefined in case of error
//                 });
//             } else {
//                 res.status(200).json({
//                     success: true,
//                     msg: "ดึงข้อมูลทั้งหมดได้สำเร็จ",
//                     data: result.rows // PostgreSQL returns data in 'rows'
//                 });
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             msg: "มีปัญาเกิดขึ้นระว่างการดึงข้อมูล",
//             data: error
//         });
//     }
// };
const Wipdisplay = async (req, res) => {
    const sqlCommand = 
    `
        SELECT 
            "bom"."Code_Fg", "bom"."Num","bom"."Part_No",
            "Data_Sheet"."Formular", "Data_Sheet"."Grade_Chem",
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
        const mapToWIPs = (array) => {
            return array.map(item => {
                const pads = [
                    { Id_BP: item.Id_BP1, Thickness: item.Thickness_Pad1, Quantity: item.Quantity_BP1 },
                    { Id_BP: item.Id_BP2, Thickness: item.Thickness_Pad2, Quantity: item.Quantity_BP2 },
                    { Id_BP: item.Id_BP3, Thickness: item.Thickness_Pad3, Quantity: item.Quantity_BP3 },
                    { Id_BP: item.Id_BP4, Thickness: item.Thickness_Pad4, Quantity: item.Quantity_BP4 }
                ];
        
                const uniqueThicknesses = [...new Set(pads.filter(pad => pad.Thickness !== "-").map(pad => pad.Thickness))];
        
                const result = pads.reduce((acc, pad, index) => {
                    const padKey = `WIP${index + 1}`;
                    const includeThickness = uniqueThicknesses.length > 1;
        
                    if (!pad.Id_BP?.includes("BP")) {
                        acc[padKey] = "-";
                        acc[`WipHP${index + 1}`] = "-";
                        acc[`WipGRD${index + 1}`] = "-";
                        acc[`WipPow${index + 1}`] = "-";
                        acc[`WipTREAT${index + 1}`] = "-";
                    } else {
                        const baseWip = pad.Thickness === "-" && pad.Id_BP?.includes("BP")
                            ? `${pad.Id_BP}-${item.Formular}`
                            : (pad.Thickness === "-" || !pad.Id_BP?.includes("BP"))
                                ? "-"
                                : includeThickness
                                    ? `${pad.Id_BP}(${pad.Thickness})-${item.Formular}`
                                    : `${pad.Id_BP}-${item.Formular}`;
        
                        acc[padKey] = baseWip;
                        acc[`WipHP${index + 1}`] = baseWip;
                        acc[`WipGRD${index + 1}`] = `${baseWip}-${item.Slot}${item.Chamfer}`;
                        acc[`WipPow${index + 1}`] = `${baseWip}-${item.Slot}${item.Chamfer}-${item.Color_Id}`;
                        acc[`WipTREAT${index + 1}`] = `${baseWip}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`;
                    }
                    
                    acc[`Quantity_BP${index + 1}`] = pad.Quantity || "-";
                    return acc;
                }, {});
        
                return {
                    Code_Fg: item.Code_Fg,
                    Num: item.Num,
                    Part_No: item.Part_No,
                    ...result
                };
            });
        };
        const result = await dbconnect.query(sqlCommand);
        // console.log('result.rows', result.rows)
        const WipmappedReult = mapToWIPs(result.rows);
        res.status(200).json({
            success: true,
            msg: "ดึงข้อมูลทั้งหมดได้สำเร็จ",
            data: WipmappedReult // PostgreSQL returns data in 'rows'
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


const Qcdisplay = async (req, res) => {
    const sqlCommand = 
    `
    SELECT 
        "bom"."Code_Fg", "bom"."Part_No", "bom"."Drawing_No", "bom"."Product_Spec_No", "bom"."Num", "bom"."Sale_Code_Bom",
        "drawingfile"."unqiuename" AS "drawingfile", "productspecfile"."unqiuename" AS "productspecfile",
        "bom"."Customer_Name","bom"."Weight","bom"."Emark_Id",
        "Product_Spec"."Slot", "Product_Spec"."Chamfer", "Product_Spec"."Color", "Product_Spec"."Coating", "Product_Spec"."Scoarching",
        "Product_Spec"."Scoarching","Product_Spec"."Scoarching_Coating_Id", "Product_Spec"."Color_Id", "Product_Spec"."Shim" 
    FROM 
        "bom"
    LEFT JOIN 
        "drawingfile" 
    ON 
        "bom"."Drawing_No" = "drawingfile"."drawing_no"
    LEFT JOIN 
        "productspecfile" 
    ON 
        "bom"."Product_Spec_No" = "productspecfile"."productspec_no"
    LEFT JOIN 
        "Product_Spec" 
    ON 
        "Product_Spec"."Product_Spec_Id" = "bom"."Product_Spec_No"
    
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


const Saledisplay = async (req, res) => {
    const sqlCommand = 
    `
    SELECT 
  	   "bom"."Code_Fg", "bom"."Part_No", "bom"."Drawing_No", "bom"."Product_Spec_No", "bom"."Num",
	   "bom"."Sale_Code_Bom", "bom"."Shim_Attach", "bom"."Data_Sheet_No", "bom"."Display_Box_Id", "bom"."Pcs_Per_Set", "bom"."Outer_Package",
	   "bom"."Customer_Name","bom"."Weight","bom"."Emark_Id",
	   "drawingfile"."unqiuename" AS "drawingfile", "productspecfile"."unqiuename" AS "productspecfile"
        
    FROM 
        "bom"
    LEFT JOIN 
        "drawingfile" 
    ON 
        "bom"."Drawing_No" = "drawingfile"."drawing_no"
    LEFT JOIN 
        "productspecfile" 
    ON 
        "bom"."Product_Spec_No" = "productspecfile"."productspec_no"
    
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


const componentdisplay = async (req, res) => {
    const sqlCommand = 
    `
    SELECT 
        "bom"."Code_Fg", "bom"."Part_No", "bom"."Drawing_No", "bom"."Product_Spec_No", "bom"."Num", "bom"."Sale_Code_Bom", "bom"."Customer_Name","bom"."Weight","bom"."Emark_Id",
        "drawingfile"."unqiuename" AS "drawingfile", 
        "productspecfile"."unqiuename" AS "productspecfile",
        "Product_Spec"."Slot", "Product_Spec"."Chamfer", "Product_Spec"."Color", "Product_Spec"."Coating", "Product_Spec"."Scoarching",
        "Product_Spec"."Scoarching","Product_Spec"."Scoarching_Coating_Id", "Product_Spec"."Color_Id", "Product_Spec"."Shim" ,
        "Shim"."Compact_No_Modify", "shimfile"."unqiuename" AS "shimfile",
        "Material"."Type2","Material"."ID", "Material"."uniquename" AS "materialfile",
        "Package"."Rm_Pk_Id","Package"."unqiuename" AS "innerboxfile",
        "Outer"."Outer_Id", "Outer"."Erp_Id_Inner","Outer"."Erp_Id_Outer", "Outer"."Set_Per_Outer"
	
    FROM 
        "bom"
    LEFT JOIN 
        "drawingfile" 
    ON 
        "bom"."Drawing_No" = "drawingfile"."drawing_no"
    LEFT JOIN 
        "productspecfile" 
    ON 
        "bom"."Product_Spec_No" = "productspecfile"."productspec_no"
    LEFT JOIN 
        "Product_Spec" 
    ON 
        "Product_Spec"."Product_Spec_Id" = "bom"."Product_Spec_No"
    LEFT JOIN 
        "shimfile" 
    ON 
        "shimfile"."shim_no" = "bom"."Shim_No"
    LEFT JOIN 
        "Shim" 
    ON 
        "Shim"."Compact_No_Modify" = "bom"."Shim_No"
    LEFT JOIN 
        "Material" 
    ON 
        "Material"."Compact_No_Modify" = "bom"."Drawing_No"
    LEFT JOIN 
        "Package" 
    ON 
        "Package"."Rm_Pk_Id" = "bom"."Display_Box_Id"
    LEFT JOIN 
        "Outer" 
    ON 
        "Outer"."Outer_Id" = "bom"."Outer_Id"
    ORDER BY 
        CAST(NULLIF("bom"."Num", '') AS INTEGER) ASC;
    
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
    Wipdisplay,
    Qcdisplay,
    Saledisplay,
    componentdisplay

}

