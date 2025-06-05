const dbconnect = require('../middleware/Dbconnect');


const getselectD_Molds = async (req, res) => {
    const mysql = `
        SELECT DISTINCT "Mold_Code" FROM "Mold" ORDER BY "Mold_Code" ASC;
    `
    try {
        dbconnect.query(mysql, (err, result) => {
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
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "มีปัญาเกิดขึ้นระว่างการดึงข้อมูล",
            data: error
        });
    }
};
const getselectD_Machines = async (req, res) => {
    const mysql = `
        SELECT DISTINCT "Group", "Diameter" FROM "Machine" ORDER BY "Group" ASC;
    `
    try {
        dbconnect.query(mysql, (err, result) => {
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
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "มีปัญาเกิดขึ้นระว่างการดึงข้อมูล",
            data: error
        });
    }
};
const getselectD_Chemgrades = async (req, res) => {
    const mysql = `
        SELECT DISTINCT "Chem_Grade_Code" FROM "Chem_Grade" ORDER BY "Chem_Grade_Code" ASC;
    `
    try {
        dbconnect.query(mysql, (err, result) => {
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
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "มีปัญาเกิดขึ้นระว่างการดึงข้อมูล",
            data: error
        });
    }
};
const getselectD_partnos = async (req, res) => {
    const mysql = `
        SELECT DISTINCT "Num" FROM "Material" ORDER BY "Num" ASC;
    `
    try {
        dbconnect.query(mysql, (err, result) => {
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
                    data: result?.rows ?? 0 // PostgreSQL returns data in 'rows'
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "มีปัญาเกิดขึ้นระว่างการดึงข้อมูล",
            data: error
        });
    }
};

const getVolunme = async (req, res) => {
    // const {part_no} = req.body;
    const part_no = req.params.part_no
    const mysql = `
        WITH bp_data AS (
            SELECT "Num", "Type2", "Type3", "ID",
                REPLACE("Thick", ',', '')::double precision AS Thick,
                REPLACE("Area", ',', '')::double precision AS Area
            FROM public."Material"
            WHERE "Type2" = 'BP' AND "Num" = $1
            ORDER BY "Type3"
            LIMIT 4
        ),
        f_data AS (
            SELECT "Num", "Type2", "Type3", "ID",
                REPLACE("Thick", ',', '')::double precision AS Thick,
                REPLACE("Area", ',', '')::double precision AS Area
            FROM public."Material"
            WHERE "Type2" = 'F' AND "Num" = $1
            ORDER BY "Type3"
            LIMIT 2
        )
        SELECT
            MAX(bp_data.Thick) AS Max_Thick_Bp,
            MAX(bp_data.Area) AS Max_Area_Bp,
            MAX(f_data.Thick) AS Max_Thick_F,
            MAX(f_data.Area) AS Max_Area_F,
            
            MAX(bp_data.Thick) + MAX(f_data.Thick) AS "Sum_Max_Thick",
            
            MAX(f_data.Area) / 100 AS "Max_Area_F_div_100",
            MAX(f_data.Thick) / 10 AS "Max_Area_F_div_10",
            (MAX(f_data.Area) / 100) * (MAX(f_data.Thick) / 10) AS Volumne
        
        FROM bp_data, f_data
    `
    try {
        dbconnect.query(mysql, [part_no], (err, result) => {
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
                    data: result?.rows ?? 0 // PostgreSQL returns data in 'rows'
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "มีปัญาเกิดขึ้นระว่างการดึงข้อมูล",
            data: error
        });
    }
}
const getSG = async (req, res) => {
    // const {part_no} = req.body;
    const SG_Value = req.params.SG_Value
    const mysql = `
        SELECT "Chem_Grade_Code", "SG_Value" FROM "Chem_Grade" WHERE "Chem_Grade_Code" = $1
    `
    try {
        dbconnect.query(mysql, [SG_Value], (err, result) => {
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
                    data: result?.rows ?? 0 // PostgreSQL returns data in 'rows'
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "มีปัญาเกิดขึ้นระว่างการดึงข้อมูล",
            data: error
        });
    }
}

//Dpressure
const getselectedD_Weight = async (req, res) => {
    // const {part_no} = req.body;
    // const SG_Value = req.params.SG_Value
    const mysql = `
        SELECT DISTINCT "Data_Sheet_No", "Compact_No" FROM "Data_Sheet_Weight" ORDER BY "Compact_No" ASC;
    `
    try {
        dbconnect.query(mysql, (err, result) => {
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
                    data: result?.rows ?? 0 // PostgreSQL returns data in 'rows'
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "มีปัญาเกิดขึ้นระว่างการดึงข้อมูล",
            data: error
        });
    }
}

const getselectedD_Moldmachine = async (req, res) => {
    // const {part_no} = req.body;
    // const SG_Value = req.params.SG_Value
    const mysql = `
        SELECT DISTINCT "Mold_Machine_Code", "Machine_Code" FROM "Mold_Machine" ORDER BY "Machine_Code" ASC;
    `
    try {
        dbconnect.query(mysql, (err, result) => {
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
                    data: result?.rows ?? 0 // PostgreSQL returns data in 'rows'
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "มีปัญาเกิดขึ้นระว่างการดึงข้อมูล",
            data: error
        });
    }
}

const getselectedbyD_weight = async (req, res) => {
    const {dweight} = req.body;
    // const dweight = req.params.dweight;
    const mysql = `
        SELECT "Compact_No", "Chem_Grade", "Pressure_Cold", "Pressure_Hot", MAX("Area") AS "Area"  FROM "Data_Sheet_Weight"
        LEFT JOIN 
            "Chem_Grade"
        ON 
            "Data_Sheet_Weight"."Chem_Grade" = "Chem_Grade"."Chem_Grade_Code"
        LEFT JOIN
            "Material"
        ON 
            "Material"."Num" = "Data_Sheet_Weight"."Compact_No"
        
        WHERE "Material"."Type2" = 'F' AND "Data_Sheet_Weight"."Data_Sheet_No" = $1
        GROUP BY
            "Compact_No", 
            "Chem_Grade", 
            "Pressure_Cold", 
            "Pressure_Hot";
    `;
    console.log('dweight', dweight)
    try {
        dbconnect.query(mysql,[dweight], (err, result) => {
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
                    data: result?.rows ?? 0 // PostgreSQL returns data in 'rows'
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "มีปัญาเกิดขึ้นระว่างการดึงข้อมูล",
            data: error
        });
    }
}

const getselectedbymoldmachine = async (req, res) => {
    const {moldmachine} = req.body;
    // const moldmachine = req.params.moldmachine;
    const mysql = `
        SELECT "Machine"."Type_Machine", MAX("Machine"."Diameter") AS "Diameter" ,"Mold"."Hole_Active_Quantity"
        FROM "Mold_Machine"
        LEFT JOIN 
            "Machine"
        ON 
            "Machine"."Group" = "Mold_Machine"."Machine_Code"
        LEFT JOIN 
            "Mold"
        ON 
            "Mold"."Mold_Code" = "Mold_Machine"."Mold_Code"
        WHERE "Mold_Machine_Code" = $1
        GROUP BY "Diameter", "Type_Machine", "Hole_Active_Quantity"
    `
    try {
        dbconnect.query(mysql,[moldmachine], (err, result) => {
            if (err) {
                console.log('err',err)
                res.status(500).json({
                    success: false,
                    msg: "ดึงข้อมูลไม่สำเร็จ",
                    data: err // 'result' would be undefined in case of error
                });
            } else {
                res.status(200).json({
                    success: true,
                    msg: "ดึงข้อมูลทั้งหมดได้สำเร็จ",
                    data: result?.rows ?? 0 // PostgreSQL returns data in 'rows'
                });
            }
        });
    } catch (error) {
        console.log(error,'fdg');
        res.status(500).json({
            success: false,
            msg: "มีปัญาเกิดขึ้นระว่างการดึงข้อมูล",
            data: error
        });
    }
}



module.exports ={
    getselectD_Molds,
    getselectD_Machines,
    getselectD_Chemgrades,
    getselectD_partnos,

    getVolunme,
    getSG,

    getselectedD_Weight,
    getselectedD_Moldmachine,
    getselectedbyD_weight,
    getselectedbymoldmachine



}