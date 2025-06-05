const dbconnect = require('../middleware/Dbconnect');


const Homedisplay = async (req, res) => {
    const sqlCommand = `
        SELECT DISTINCT 
            "bom"."Code_Fg", "bom"."Customer_Name", "bom"."Sale_Code_Bom", "bom"."Part_No", "bom"."Num", "bom"."Pcs_Per_Set", "bom"."Status",
            "bom"."Weight","bom"."Emark_Id",
            "Data_Sheet_Weight"."Formulation", "Data_Sheet_Weight"."Weight_F", "Data_Sheet_Weight"."Weight_U", "Data_Sheet_Weight"."Chem_Grade_U", "Data_Sheet_Weight"."Chem_Grade",
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
            "Data_Sheet_Weight" 
        ON 
            "Data_Sheet_Weight"."Data_Sheet_No" = "bom"."Data_Sheet_No"
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
            // function mergeAndSumBP(item) {
            //     // Collect all BP entries (1 to 4)
            //     const bpList = [];
            //     for (let i = 1; i <= 4; i++) {
            //       const erpId = item[`Erp_Id_BP${i}`];
            //       const name = item[`Name_BP${i}`];
            //       const quantityStr = item[`Quantity_BP${i}`];
              
            //       // Only consider valid entries (not "-" and not empty)
            //       if (erpId && erpId !== "-" && erpId.trim() !== "" &&
            //           name && name !== "-" && name.trim() !== "") {
            //         const quantity = parseFloat(quantityStr);
            //         // If quantity is invalid, consider 0
            //         bpList.push({
            //           erpId,
            //           name,
            //           quantity: isNaN(quantity) ? 0 : quantity,
            //         });
            //       }
            //     }
              
            //     // Group by erpId + name and sum quantities
            //     const grouped = {};
            //     bpList.forEach(({ erpId, name, quantity }) => {
            //       const key = `${erpId}||${name}`;
            //       if (!grouped[key]) {
            //         grouped[key] = { erpId, name, quantity: 0 };
            //       }
            //       grouped[key].quantity += quantity;
            //     });
              
            //     // Get array of grouped items
            //     const groupedArr = Object.values(grouped);
              
            //     // Fill back the results to BP1-BP4 fields, fill remaining with "-"
            //     for (let i = 1; i <= 4; i++) {
            //       if (groupedArr[i - 1]) {
            //         item[`Erp_Id_BP${i}`] = groupedArr[i - 1].erpId;
            //         item[`Name_BP${i}`] = groupedArr[i - 1].name;
            //         item[`Quantity_BP${i}`] = groupedArr[i - 1].quantity.toString();
            //       } else {
            //         item[`Erp_Id_BP${i}`] = "-";
            //         item[`Name_BP${i}`] = "-";
            //         item[`Quantity_BP${i}`] = "-";
            //       }
            //     }
              
            //     return item;
            // }

            
            function mergeAndSumBP(item) {
                // Collect all BP entries (1 to 4)
                const bpList = [];
                for (let i = 1; i <= 4; i++) {
                    const erpId = item[`Erp_Id_BP${i}`];
                    const name = item[`Name_BP${i}`];
                    const id = item[`Id_BP${i}`];
                    const quantityStr = item[`Quantity_BP${i}`];
            
                    // Only consider valid entries (not "-" and not empty)
                    if (erpId && erpId !== "-" && erpId.trim() !== "" &&
                        name && name !== "-" && name.trim() !== "") {
                        const quantity = parseFloat(quantityStr);
                        bpList.push({
                            erpId,
                            name,
                            id: id || "-", // fallback if missing
                            quantity: isNaN(quantity) ? 0 : quantity,
                        });
                    }
                }
            
                // Group by erpId + name and sum quantities
                const grouped = {};
                bpList.forEach(({ erpId, name, id, quantity }) => {
                    const key = `${erpId}||${name}`;
                    if (!grouped[key]) {
                        grouped[key] = { erpId, name, id, quantity: 0 };
                    }
                    grouped[key].quantity += quantity;
                });
            
                // Get array of grouped items
                const groupedArr = Object.values(grouped);
            
                // Fill back the results to BP1-BP4 fields, fill remaining with "-"
                for (let i = 1; i <= 4; i++) {
                    if (groupedArr[i - 1]) {
                        item[`Erp_Id_BP${i}`] = groupedArr[i - 1].erpId;
                        item[`Name_BP${i}`] = groupedArr[i - 1].name;
                        item[`Id_BP${i}`] = groupedArr[i - 1].id;
                        item[`Quantity_BP${i}`] = groupedArr[i - 1].quantity.toString();
                    } else {
                        item[`Erp_Id_BP${i}`] = "-";
                        item[`Name_BP${i}`] = "-";
                        item[`Id_BP${i}`] = "-";
                        item[`Quantity_BP${i}`] = "-";
                    }
                }
            
                return item;
            }


            function mergeAndSumBP(item) {
                const bpList = [];
            
                for (let i = 1; i <= 4; i++) {
                    const erpId = item[`Erp_Id_BP${i}`];
                    const name = item[`Name_BP${i}`];
                    const id = item[`Id_BP${i}`];
                    const quantityStr = item[`Quantity_BP${i}`];
            
                    const quantity = parseFloat(quantityStr);
                    const isValidErpName = (
                        erpId && erpId.trim() !== "-" && erpId.trim() !== "" &&
                        name && name.trim() !== "-" && name.trim() !== ""
                    );
            
                    // Add item if any value is relevant (especially ID)
                    if (isValidErpName || (id && id.trim() !== "-" && id.trim() !== "")) {
                        bpList.push({
                            erpId: isValidErpName ? erpId : "-",
                            name: isValidErpName ? name : "-",
                            id: id || "-",
                            quantity: isNaN(quantity) ? 0 : quantity,
                        });
                    }
                }
            
                // Group by erpId + name + id
                const grouped = {};
                bpList.forEach(({ erpId, name, id, quantity }) => {
                    const key = `${erpId}||${name}||${id}`;
                    if (!grouped[key]) {
                        grouped[key] = { erpId, name, id, quantity: 0 };
                    }
                    grouped[key].quantity += quantity;
                });
            
                const groupedArr = Object.values(grouped);
            
                for (let i = 1; i <= 4; i++) {
                    if (groupedArr[i - 1]) {
                        item[`Erp_Id_BP${i}`] = groupedArr[i - 1].erpId;
                        item[`Name_BP${i}`] = groupedArr[i - 1].name;
                        item[`Id_BP${i}`] = groupedArr[i - 1].id;
                        item[`Quantity_BP${i}`] = groupedArr[i - 1].quantity.toString();
                    } else {
                        item[`Erp_Id_BP${i}`] = "-";
                        item[`Name_BP${i}`] = "-";
                        item[`Id_BP${i}`] = "-";
                        item[`Quantity_BP${i}`] = "-";
                    }
                }
            
                return item;
            }
            
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
                    data: result.rows.map(mergeAndSumBP) // PostgreSQL returns data in 'rows'
                    // data: result.rows // PostgreSQL returns data in 'rows'
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
            "Data_Sheet_Weight"."Formulation", "Data_Sheet_Weight"."Chem_Grade",
            "Drawing"."Id_BP1", "Drawing"."Quantity_BP1", "Drawing"."Thickness_Pad1",
            "Drawing"."Id_BP2", "Drawing"."Quantity_BP2", "Drawing"."Thickness_Pad2",
            "Drawing"."Id_BP3", "Drawing"."Quantity_BP3", "Drawing"."Thickness_Pad3",
            "Drawing"."Id_BP4", "Drawing"."Quantity_BP4", "Drawing"."Thickness_Pad4",
            "Product_Spec"."Slot", "Product_Spec"."Chamfer", "Product_Spec"."Color_Id", 
            "Product_Spec"."Coating", "Product_Spec"."Scoarching", "Product_Spec"."Scoarching_Coating_Id",
            "Shim"."Compact_No_Modify",
            "Drawing"."Id_WD1",
            "Drawing"."Id_WD2",
            "Drawing"."Id_WD3"
        FROM 
            "bom"
        LEFT JOIN 
            "Data_Sheet_Weight" 
        ON 
            "Data_Sheet_Weight"."Data_Sheet_No" = "bom"."Data_Sheet_No"
        LEFT JOIN 
            "Product_Spec" 
        ON 
            "Product_Spec"."Product_Spec_Id" = "bom"."Product_Spec_No"
        LEFT JOIN
            "Drawing" 
        ON 
            "bom"."Drawing_No" = "Drawing"."Compact_No_Modify_Drawing"
        LEFT JOIN
            "Shim" 
        ON 
            "bom"."Shim_No" = "Shim"."Compact_No_Modify"
    
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
        
                // Extract text inside parentheses from Compact_No_Modify, default to 'N' if null or "-"
                let shimText = "N";
                if (item.Compact_No_Modify && item.Compact_No_Modify !== "-") {
                    const shimTextMatch = item.Compact_No_Modify.match(/\(([^)]+)\)/);
                    shimText = shimTextMatch ? shimTextMatch[1] : "N";
                }
        
                const result = pads.reduce((acc, pad, index) => {
                    const padKey = `WIP${index + 1}`;
                    const includeThickness = uniqueThicknesses.length > 1;
        
                    if (!pad.Id_BP?.includes("BP")) {
                        acc[padKey] = "-";
                        acc[`WipHP${index + 1}`] = "-";
                        acc[`WipGRD${index + 1}`] = "-";
                        acc[`WipPow${index + 1}`] = "-";
                        acc[`WipTREAT${index + 1}`] = "-";
                        acc[`WipShim${index + 1}`] = "-";
                        acc[`WipWD${index + 1}`] = "-";
                    } else {
                        const baseWip =
                            pad.Thickness === "-" && pad.Id_BP?.includes("BP")
                                ? `${pad.Id_BP}-${item.Formulation}`
                                : (pad.Thickness === "-" || !pad.Id_BP?.includes("BP"))
                                    ? "-"
                                    : includeThickness
                                        ? `${pad.Id_BP}(${pad.Thickness})-${item.Formulation}`
                                        : `${pad.Id_BP}-${item.Formulation}`;
        
                        const suffix = `${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`;
                        const addWD = !item.Id_WD1 || item.Id_WD1 === "-" ? "N" : "WD";
        
                        acc[padKey] = baseWip;
                        acc[`WipHP${index + 1}`] = baseWip;
                        acc[`WipGRD${index + 1}`] = `${baseWip}-${item.Slot}${item.Chamfer}`;
                        acc[`WipPow${index + 1}`] = `${baseWip}-${item.Slot}${item.Chamfer}-${item.Color_Id}`;
                        acc[`WipTREAT${index + 1}`] = `${baseWip}-${suffix}`;
                        acc[`WipShim${index + 1}`] = `${baseWip}-${suffix}-${shimText}`;
                        acc[`WipWD${index + 1}`] = `${baseWip}-${suffix}-${shimText}-${addWD}`;
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

const Wiptostoredisplay = async (req, res) => {
    const sqlCommand = 
    `
        SELECT 
            "bom"."Code_Fg", "bom"."Num","bom"."Part_No",
            "Data_Sheet_Weight"."Formulation", "Data_Sheet_Weight"."Chem_Grade",
            "Drawing"."Id_BP1", "Drawing"."Quantity_BP1", "Drawing"."Thickness_Pad1",
            "Drawing"."Id_BP2", "Drawing"."Quantity_BP2", "Drawing"."Thickness_Pad2",
            "Drawing"."Id_BP3", "Drawing"."Quantity_BP3", "Drawing"."Thickness_Pad3",
            "Drawing"."Id_BP4", "Drawing"."Quantity_BP4", "Drawing"."Thickness_Pad4",
            "Product_Spec"."Slot", "Product_Spec"."Chamfer", "Product_Spec"."Color_Id", 
            "Product_Spec"."Coating", "Product_Spec"."Scoarching", "Product_Spec"."Scoarching_Coating_Id"
        FROM 
            "bom"
        LEFT JOIN 
            "Data_Sheet_Weight" 
        ON 
            "Data_Sheet_Weight"."Data_Sheet_No" = "bom"."Data_Sheet_No"
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
        
                const treatMap = {};
        
                pads.forEach((pad, index) => {
                    const includeThickness = uniqueThicknesses.length > 1;
                    const quantity = parseFloat(pad.Quantity) || 0;
        
                    if (!pad.Id_BP?.includes("BP")) return;
        
                    const baseWip = pad.Thickness === "-" && pad.Id_BP?.includes("BP")
                        ? `${pad.Id_BP}-${item.Formulation}`
                        : (pad.Thickness === "-" || !pad.Id_BP?.includes("BP"))
                            ? "-"
                            : includeThickness
                                ? `${pad.Id_BP}(${pad.Thickness})-${item.Formulation}`
                                : `${pad.Id_BP}-${item.Formulation}`;
        
                    const treatKey = `${baseWip}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`;
        
                    if (treatMap[treatKey]) {
                        treatMap[treatKey].quantity += quantity;
                    } else {
                        treatMap[treatKey] = {
                            baseWip,
                            treat: treatKey,
                            quantity
                        };
                    }
                });
        
                // Convert treatMap back to output fields WIP1..WIP4
                const result = {};
                const entries = Object.values(treatMap);
        
                entries.forEach((entry, idx) => {
                    const i = idx + 1;
                    result[`WIP${i}`] = entry.baseWip;
                    result[`WipTREAT${i}`] = entry.treat;
                    result[`Quantity_BP${i}`] = entry.quantity.toString();
                });
        
                // Fill remaining fields with "-"
                for (let i = entries.length + 1; i <= 4; i++) {
                    result[`WIP${i}`] = "-";
                    result[`WipTREAT${i}`] = "-";
                    result[`Quantity_BP${i}`] = "-";
                }
        
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

const datasheetdisplay = async (req, res) => {
    const sqlCommand = 
    `
    WITH bp_data AS (
        SELECT "Num", "Type2", "Type3", "ID", "Compact_No_Modify",
            REPLACE("Thick", ',', '')::double precision AS Thick,
            REPLACE("Area", ',', '')::double precision AS Area
        FROM public."Material"
        WHERE "Type2" = 'BP'
          AND "Thick" ~ '^[0-9,.]+$'
          AND "Area" ~ '^[0-9,.]+$'
    ),
    f_data AS (
        SELECT "Num", "Type2", "Type3", "ID",
            REPLACE("Thick", ',', '')::double precision AS Thick,
            REPLACE("Area", ',', '')::double precision AS Area
        FROM public."Material"
        WHERE "Type2" = 'F'
          AND "Thick" ~ '^[0-9,.]+$'
          AND "Area" ~ '^[0-9,.]+$'
    ),
    material_summary AS (
        SELECT
            bp_data."Num", 
            bp_data."Compact_No_Modify", 
            MAX(bp_data.Thick) AS Max_Thick_Bp,
            MAX(bp_data.Area) AS Max_Area_Bp,
            MAX(f_data.Thick) AS Max_Thick_F,
            MAX(f_data.Area) AS Max_Area_F,
            MAX(bp_data.Thick) + MAX(f_data.Thick) AS Sum_Max_Thick,
            MAX(f_data.Area) / 100 AS Max_Area_F_div_100,
            MAX(f_data.Thick) / 10 AS Max_Thick_F_div_10,
            (MAX(f_data.Area) / 100) * (MAX(f_data.Thick) / 10) AS Volumne
        FROM bp_data
        JOIN f_data ON bp_data."Num" = f_data."Num"
        GROUP BY bp_data."Num", bp_data."Compact_No_Modify"
    ),
    final_data AS (
        SELECT 
          dsp."Data_Sheet_No_Pressure", 
          dsp."Data_Sheet_No", 
          dsp."Mold_Machine_Cold_Code",
          dsp."Pcs_Per_Mold_Cold", 
          dsp."Presure_Cold", 
          dsp."Mold_Machine_Cold_Hot",
          dsp."Pcs_Per_Mold_Hot",
          dsp."Presure_Hot",

          dsp."CreateBy",
          dsp."CreateAt",

          dsw."Compact_No",
          dsw."Formulation",
          dsw."Chem_Grade",
          dsw."Mold_Code_Cold",
          dsw."Mold_Code_Hot",
          dsw."Weight_F",
          dsw."Weight_U",
          dsw."Chem_Grade_U",
    
          cg."SG_Value",
          cg."Pressure_Cold" AS "Pressure_Cold_Per_pcs",
          cg."Pressure_Hot" AS Pressure_Hot_Per_pcs,
          cg."Temp_Above",
          cg."Temp_Bellow",
          cg."Total_Time",
          cg."Program_No",
    
          mmc."Machine_Code" AS "Machine_Group_Cold",
          mmc."Mold_Code" AS "Mold_Code_Cold",
          mmc."Description" AS "Description_Cold",
    
          mmh."Machine_Code" AS "Machine_Group_Hot",
          mmh."Mold_Code" AS "Mold_Code_Hot",
          mmh."Description" AS "Description_Hot",
          mc."Machine_Code" AS "Machine_Code_Cold",
          mc."Diameter" AS "Diameter_Machine_Code_Cold",
          mh."Machine_Code" AS "Machine_Code_Hot",
          mh."Diameter" AS "Diameter_Machine_Code_Hot",
          ms.Max_Area_F,
          ms.Max_Area_F_div_100,
          ms.Sum_Max_Thick,
          ms.Sum_Max_Thick + 0.5 AS Sum_Max_Thick_Plus_0_5,
          ms."Compact_No_Modify",
          df."unqiuename" AS "drawingfile"
        FROM 
          "Data_Sheet_Pressure" dsp
        LEFT JOIN 
          "Data_Sheet_Weight" dsw 
          ON dsw."Data_Sheet_No" = dsp."Data_Sheet_No"
        LEFT JOIN 
          "Chem_Grade" cg 
          ON cg."Chem_Grade_Code" = dsw."Chem_Grade"
        LEFT JOIN 
          "Mold_Machine" mmc 
          ON mmc."Mold_Machine_Code" = dsp."Mold_Machine_Cold_Code"
        LEFT JOIN 
          "Mold_Machine" mmh 
          ON mmh."Mold_Machine_Code" = dsp."Mold_Machine_Cold_Hot"
        LEFT JOIN 
          material_summary ms
          ON ms."Num" = dsw."Compact_No"
        LEFT JOIN
            "Machine" mc
            ON mc."Group" =  mmc."Machine_Code"
        LEFT JOIN
            "Machine" mh
            ON mh."Group" =  mmh."Machine_Code"
        LEFT JOIN
            "drawingfile" df
            ON df."drawing_no" =  ms."Compact_No_Modify"
    )
    
    SELECT 
      ROW_NUMBER() OVER (ORDER BY "Data_Sheet_No") AS running_no,
      *
    FROM final_data;
    
    
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
    componentdisplay,
    datasheetdisplay,
    Wiptostoredisplay

}

