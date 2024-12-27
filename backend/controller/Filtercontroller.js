//call database connection
const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');
//Bom Filter
//Get All record
const getFilterboms = async (req, res) => {
    try {
        dbconnect.query(`SELECT "Code_Fg", "Customer_Name", "Part_No", "Status" FROM "bom"`, (err, result) => {
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

const getFilterbomsbycodefg = async (req, res) => {
    const {Code_Fg} = req.body;
    try {
        dbconnect.query(`SELECT * FROM bom Where "Code_Fg" = $1`,[Code_Fg], (err, result) => {
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

//Drawing
const getFiltermaterialfordrawing = async (req, res) => {
    const sqlCommand = `
        SELECT 
        "Compact_No_Modify" AS "Compact_No_Modify_Drawing",
        "Num",
        -- BP Types (BP1-BP4)
        MAX(CASE WHEN "Type2" = 'BP' AND "Type3" = 'BP-1' THEN "ID" END) AS "Id_BP1",
        MAX(CASE WHEN "Type2" = 'BP' AND "Type3" = 'BP-1' THEN "Quantity_Shim" END) AS "Quantity_BP1",
        MAX(CASE WHEN "Type2" = 'BP' AND "Type3" = 'BP-2' THEN "ID" END) AS "Id_BP2",
        MAX(CASE WHEN "Type2" = 'BP' AND "Type3" = 'BP-2' THEN "Quantity_Shim" END) AS "Quantity_BP2",
        MAX(CASE WHEN "Type2" = 'BP' AND "Type3" = 'BP-3' THEN "ID" END) AS "Id_BP3",
        MAX(CASE WHEN "Type2" = 'BP' AND "Type3" = 'BP-3' THEN "Quantity_Shim" END) AS "Quantity_BP3",
        MAX(CASE WHEN "Type2" = 'BP' AND "Type3" = 'BP-4' THEN "ID" END) AS "Id_BP4",
        MAX(CASE WHEN "Type2" = 'BP' AND "Type3" = 'BP-4' THEN "Quantity_Shim" END) AS "Quantity_BP4",

        -- WD Types (WD1-WD2)
        MAX(CASE WHEN "Type2" = 'WD' AND ("Type3" = 'WD-1' OR "Type3" = 'WD' OR "Type3" = 'FC') THEN "ID" END) AS "Id_WD1",
        MAX(CASE WHEN "Type2" = 'WD' AND ("Type3" = 'WD-1' OR "Type3" = 'WD' OR "Type3" = 'FC') THEN "Quantity_Shim" END) AS "Quantity_WD1",
        MAX(CASE WHEN "Type2" = 'WD' AND "Type3" = 'WD-2' THEN "ID" END) AS "Id_WD2",
        MAX(CASE WHEN "Type2" = 'WD' AND "Type3" = 'WD-2' THEN "Quantity_Shim" END) AS "Quantity_WD2",
        
        MAX(CASE WHEN "Type2" = 'WD' AND "Type3" = 'WD-3' THEN "ID" END) AS "Id_WD3",
        MAX(CASE WHEN "Type2" = 'WD' AND "Type3" = 'WD-3' THEN "Quantity_Shim" END) AS "Quantity_WD3",
        MAX(CASE WHEN "Type2" = 'WD' AND "Type3" = 'WD-4' THEN "ID" END) AS "Id_WD4",
        MAX(CASE WHEN "Type2" = 'WD' AND "Type3" = 'WD-4' THEN "Quantity_Shim" END) AS "Quantity_WD4"
	
    FROM "Material"
    WHERE "Type2" = 'WD' OR "Type2" ='BP' 
    GROUP BY "Compact_No_Modify", "Num"
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

const getFiltermaterialbycompactnodrawing = async (req, res) => {
    const {Compact_No_Modify_Drawing} = req.body;
    const sqlCommand = `
    SELECT 
    "Compact_No_Modify" AS "Compact_No_Modify_Drawing", "Num" AS "Part_No",

    -- BP Types (BP1-BP4)
    COALESCE(MAX(CASE WHEN "Type2" = 'BP' AND "Type3" = 'BP-1' THEN "ID" END), '-') AS "Id_BP1",
    COALESCE(MAX(CASE WHEN "Type2" = 'BP' AND "Type3" = 'BP-1' THEN "Quantity_Shim" END), '-') AS "Quantity_BP1",
    COALESCE(MAX(CASE WHEN "Type2" = 'BP' AND "Type3" = 'BP-2' THEN "ID" END), '-') AS "Id_BP2",
    COALESCE(MAX(CASE WHEN "Type2" = 'BP' AND "Type3" = 'BP-2' THEN "Quantity_Shim" END), '-') AS "Quantity_BP2",
    COALESCE(MAX(CASE WHEN "Type2" = 'BP' AND "Type3" = 'BP-3' THEN "ID" END), '-') AS "Id_BP3",
    COALESCE(MAX(CASE WHEN "Type2" = 'BP' AND "Type3" = 'BP-3' THEN "Quantity_Shim" END), '-') AS "Quantity_BP3",
    COALESCE(MAX(CASE WHEN "Type2" = 'BP' AND "Type3" = 'BP-4' THEN "ID" END), '-') AS "Id_BP4",
    COALESCE(MAX(CASE WHEN "Type2" = 'BP' AND "Type3" = 'BP-4' THEN "Quantity_Shim" END), '-') AS "Quantity_BP4",

    -- WD Types (WD1-WD4)
    COALESCE(MAX(CASE WHEN "Type2" = 'WD' AND ("Type3" = 'WD-1' OR "Type3" = 'WD' OR "Type3" = 'FC') THEN "ID" END), '-') AS "Id_WD1",
    COALESCE(MAX(CASE WHEN "Type2" = 'WD' AND ("Type3" = 'WD-1' OR "Type3" = 'WD' OR "Type3" = 'FC') THEN "Quantity_Shim" END), '-') AS "Quantity_WD1",
    COALESCE(MAX(CASE WHEN "Type2" = 'WD' AND "Type3" = 'WD-2' THEN "ID" END), '-') AS "Id_WD2",
    COALESCE(MAX(CASE WHEN "Type2" = 'WD' AND "Type3" = 'WD-2' THEN "Quantity_Shim" END), '-') AS "Quantity_WD2",
    COALESCE(MAX(CASE WHEN "Type2" = 'WD' AND "Type3" = 'WD-3' THEN "ID" END), '-') AS "Id_WD3",
    COALESCE(MAX(CASE WHEN "Type2" = 'WD' AND "Type3" = 'WD-3' THEN "Quantity_Shim" END), '-') AS "Quantity_WD3",
    COALESCE(MAX(CASE WHEN "Type2" = 'WD' AND "Type3" = 'WD-4' THEN "ID" END), '-') AS "Id_WD4",
    COALESCE(MAX(CASE WHEN "Type2" = 'WD' AND "Type3" = 'WD-4' THEN "Quantity_Shim" END), '-') AS "Quantity_WD4"
	
    FROM "Material"
    WHERE ("Type2" = 'WD' OR "Type2" ='BP') AND "Compact_No_Modify" = $1
    GROUP BY "Compact_No_Modify", "Num"
    `
    try {
        dbconnect.query(sqlCommand, [Compact_No_Modify_Drawing], (err, result) => {
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
//Shim
const getFiltermaterialforshim = async (req, res) => {
    const sqlCommand = `
    SELECT "Compact_No_Modify", "Num" AS "Part_No",

        -- SP Types (SP1-SP3)
        COALESCE(MAX(CASE WHEN "Type2" = 'SP' AND ("Type3" = 'SP-1' OR "Type3" = 'SP') THEN "ID" END), '-') AS "Id_SP1",
        COALESCE(MAX(CASE WHEN "Type2" = 'SP' AND ("Type3" = 'SP-1' OR "Type3" = 'SP') THEN "Quantity_Shim" END), '-') AS "Quantity_SP1",
        COALESCE(MAX(CASE WHEN "Type2" = 'SP' AND "Type3" = 'SP-2' THEN "ID" END), '-') AS "Id_SP2",
        COALESCE(MAX(CASE WHEN "Type2" = 'SP' AND "Type3" = 'SP-2' THEN "Quantity_Shim" END), '-') AS "Quantity_SP2",
        COALESCE(MAX(CASE WHEN "Type2" = 'SP' AND "Type3" = 'SP-3' THEN "ID" END), '-') AS "Id_SP3",
        COALESCE(MAX(CASE WHEN "Type2" = 'SP' AND "Type3" = 'SP-3' THEN "Quantity_Shim" END), '-') AS "Quantity_SP3"

    FROM "Material"
    WHERE "Type2" = 'SP'
    GROUP BY "Compact_No_Modify", "Num";
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

const getFiltermaterialbycompactnoshim = async (req, res) => {
    const {Compact_No_Modify_Drawing} = req.body;
    const sqlCommand = `
    SELECT 
    "Compact_No_Modify", "Num" AS "Part_No",

        -- SP Types (SP1-SP3)
        COALESCE(MAX(CASE WHEN "Type2" = 'SP' AND ("Type3" = 'SP-1' OR "Type3" = 'SP') THEN "ID" END), '-') AS "Id_SP1",
        COALESCE(MAX(CASE WHEN "Type2" = 'SP' AND ("Type3" = 'SP-1' OR "Type3" = 'SP') THEN "Quantity_Shim" END), '-') AS "Quantity_SP1",
        COALESCE(MAX(CASE WHEN "Type2" = 'SP' AND "Type3" = 'SP-2' THEN "ID" END), '-') AS "Id_SP2",
        COALESCE(MAX(CASE WHEN "Type2" = 'SP' AND "Type3" = 'SP-2' THEN "Quantity_Shim" END), '-') AS "Quantity_SP2",
        COALESCE(MAX(CASE WHEN "Type2" = 'SP' AND "Type3" = 'SP-3' THEN "ID" END), '-') AS "Id_SP3",
        COALESCE(MAX(CASE WHEN "Type2" = 'SP' AND "Type3" = 'SP-3' THEN "Quantity_Shim" END), '-') AS "Quantity_SP3"
    
    FROM "Material"
    WHERE "Type2" = 'SP' AND "Compact_No_Modify" = $1
    GROUP BY "Compact_No_Modify", "Num";
    `
    try {
        dbconnect.query(sqlCommand, [Compact_No_Modify_Drawing], (err, result) => {
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




module.exports ={
    getFilterboms,
    getFilterbomsbycodefg,
    getFiltermaterialfordrawing,
    getFiltermaterialbycompactnodrawing,
    getFiltermaterialforshim,
    getFiltermaterialbycompactnoshim

}