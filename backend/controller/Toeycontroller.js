const dbconnect = require('../middleware/Dbconnect');
const Qcgetmethod = async (req, res) => {
    const sqlCommand = 
    `
    SELECT 
        "bom"."Code_Fg", "bom"."Part_No", "bom"."Drawing_No", "bom"."Product_Spec_No", "bom"."Num", "bom"."Sale_Code_Bom",
        "drawingfile"."path" AS "drawingfile", "productspecfile"."path" AS "productspecfile",
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
const Qcpostmethod = async (req, res) => {
    const {Code_Fg} = req.body;
    const sqlCommand = 
    `
    SELECT 
        "bom"."Code_Fg", "bom"."Part_No", "bom"."Drawing_No", "bom"."Product_Spec_No", "bom"."Num", "bom"."Sale_Code_Bom",
        "drawingfile"."path" AS "drawingfile", "productspecfile"."path" AS "productspecfile",
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
    WHERE 
        "bom"."Code_Fg" = $1

    `
    try {
        dbconnect.query(sqlCommand,[Code_Fg], (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    msg: "ดึงข้อมูลไม่สำเร็จ",
                    data: err // 'result' would be undefined in case of error
                });
            } else {
                if(result.rows.length > 0){
                    res.status(200).json({
                        success: true,
                        msg: "ดึงข้อมูลทั้งหมดได้สำเร็จ",
                        data: result.rows // PostgreSQL returns data in 'rows'
                    });
                }else{
                    res.status(200).json({
                        success: true,
                        msg: "ไม่พบข้อมูลที่ทานเรียก ครับ",
                        data: result.rows // PostgreSQL returns data in 'rows'
                    });
                }
                
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
    Qcgetmethod,
    Qcpostmethod

}