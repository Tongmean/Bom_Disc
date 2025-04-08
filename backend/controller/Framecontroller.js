const dbconnect = require('../middleware/Dbconnect');
const path = require('path');
const fs = require('fs');

const Getdworwip = async (req, res) =>{
    const {erp, taget_type} =  req.body;
    if (taget_type === 'DW') {
        console.log('taget_type:', taget_type);
        const sqlCommand = `
            SELECT 
                "bom"."Code_Fg",
                "drawingfile"."unqiuename" AS "drawingfile",
                "drawingfile"."path"
            FROM 
                "bom"
            LEFT JOIN 
                "drawingfile" 
            ON 
                "bom"."Drawing_No" = "drawingfile"."drawing_no"
            WHERE "Code_Fg" = $1
        `
        const result = await dbconnect.query(sqlCommand, [erp]);
        // console.log('result',result)
        if(result.rows.length > 0){
            const exitpath = result.rows[0].path;
            const filename = result.rows[0].drawingfile;
            const filePath = path.join(__dirname, '../Assets', exitpath); 
            console.log('filePath',filePath)
            // Check if the file exists
            if (fs.existsSync(filePath)) {
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                fs.createReadStream(filePath).pipe(res);
            }else{
                res.status(400).json({
                    msg: 'File not found',
                    success: false,
                });
            }
        }else{
            res.status(400).json({
                msg: 'File not Exit',
                success: false,
            });
        }
    } else if (taget_type === 'WIP') { 
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
                "bom"."Drawing_No" = "Drawing"."Compact_No_Modify_Drawing"
                WHERE "Code_Fg" = $1
        
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
            
                    // Check if any two thicknesses are the same (excluding "-")
                    const uniqueThicknesses = [...new Set(pads.filter(pad => pad.Thickness !== "-").map(pad => pad.Thickness))];
            
                    const result = pads.reduce((acc, pad, index) => {
                        const padKey = `WIP${index + 1}`;
                        const includeThickness = uniqueThicknesses.length > 1; // If there are multiple unique thicknesses, include thickness
            
                        if (
                            pad.Thickness === pads[0].Thickness &&
                            (pad.Thickness === pads[1].Thickness || pad.Thickness === "-") &&
                            (pad.Thickness === pads[2].Thickness || pads[2].Thickness === "-") &&
                            (pad.Thickness === pads[3].Thickness || pads[3].Thickness === "-")
                        ) {
                            acc[padKey] =
                                pad.Thickness === "-" && pad.Id_BP?.includes("BP")
                                    ? `${pad.Id_BP}-${item.Formular}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`
                                    : (pad.Thickness === "-" || !pad.Id_BP?.includes("BP"))
                                        ? "-"
                                        : includeThickness
                                            ? `${pad.Id_BP}-${item.Formular}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`
                                            : `${pad.Id_BP}-${item.Formular}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`;
                        } else {
                            acc[padKey] =
                                pad.Thickness === "-" && pad.Id_BP?.includes("BP")
                                    ? `${pad.Id_BP}-${item.Formular}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`
                                    : (pad.Thickness === "-" || !pad.Id_BP?.includes("BP"))
                                        ? "-"
                                        : includeThickness
                                            ? `${pad.Id_BP}(${pad.Thickness})-${item.Formular}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`
                                            : `${pad.Id_BP}-${item.Formular}-${item.Slot}${item.Chamfer}-${item.Color_Id}-${item.Scoarching_Coating_Id}`;
                        }
            
                        // Add Quantity for each pad
                        acc[`Quantity_BP${index + 1}`] = pad.Quantity || "-";
                        return acc;
                    }, {});
            
                    // Include Code_Fg in the result
                    return {
                        Code_Fg: item.Code_Fg,
                        Num: item.Num,
                        Part_No: item.Part_No,
                        ...result
                    };
                });
            };
            const result = await dbconnect.query(sqlCommand, [erp]);
            console.log('result.rows',result.rows)
            console.log('result.rows[0]',result.rows)
            if(result.rows.length > 0){
                const WipmappedReult = mapToWIPs(result.rows);
                res.status(200).json({
                    success: true,
                    msg: "ดึงข้อมูลทั้งหมดได้สำเร็จ",
                    data: WipmappedReult // PostgreSQL returns data in 'rows'
                });
            }else{
                res.status(400).json({
                    success: false,
                    msg: "ไม่พบ WIP ในฐานข้อมูล ครับ",
                });
            }
        } catch (error) {
            // console.log(error);
            res.status(500).json({
                success: false,
                msg: "มีปัญาเกิดขึ้นระว่างการดึงข้อมูล",
                data: error
            });
        }
    } else {
        res.status(400).json({
            msg: `กรุณาส่ง ${taget_type} ใหม่`,
            success: false,
        });
    }
    
}


module.exports = {
    Getdworwip

}