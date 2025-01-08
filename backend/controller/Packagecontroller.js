const dbconnect = require('../middleware/Dbconnect');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { logUpdate } = require('../utility/updateLog');
// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../Assets/Package');
fs.mkdirSync(uploadDir, { recursive: true });

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        const sanitizedFilename = Buffer.from(file.originalname, 'latin1').toString('utf8').replace(/\s+/g, '_').replace(/[^\w\-_.ก-๙]/g, '');        const uniqueSuffix = `${Date.now()}`;
        cb(null, `${uniqueSuffix}-${sanitizedFilename}`);
    }
});


// Multer configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// Middleware for handling single file upload
const uploadPackageMiddleware = upload.single('file');

//Get all record
const getPackages = (req, res) =>{
    try {
        dbconnect.query(`SELECT * FROM "Package" ORDER BY id ASC `, (err, result) => {
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
const getPackage = async (req,res) =>{
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "Package" WHERE id = $1' , [id],(err, result) =>{
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
const postPackage = async (req, res) =>{
    const file = req.file || {}; // Default to an empty object if no file is uploaded
    const userEmail = req.user.email; // This email comes from requireAuth
    const { Rm_Pk_Id, Mat_Cat, Group, Sub_Mat_Cat, Erp_Id, Name_Erp, Dimension, Weight, Spec, Unit,Status, CreateBy} = req.body;
    const { filename, originalname, path: filePath } = file;
    
    try {
        // Encoding the originalname to UTF-8 if it exists
        const encodedOriginalName = originalname
            ? Buffer.from(originalname, 'latin1').toString('utf8').replace(/\s+/g, '_').replace(/[^\w\-_.ก-๙]/g, '')
            : null;
        // Check for duplicate Code_Fg
        const sqlCheck = `SELECT * FROM "Package" WHERE "Rm_Pk_Id" = $1`;
        const checkResult = await dbconnect.query(sqlCheck, [Rm_Pk_Id]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkResult.rows,
                msg: `รหัส: ${Rm_Pk_Id} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }

        //Insert New Record
        const sqlCommand = `
        INSERT INTO "Package" (
          "Rm_Pk_Id", "Mat_Cat", "Group", "Sub_Mat_Cat", "Erp_Id", "Name_Erp", 
          "Dimension", "Weight", "Spec", "Unit", "originalname", "unqiuename", 
          "path","Status", "CreateBy"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *;
        `;
        const values = [Rm_Pk_Id, Mat_Cat, Group, Sub_Mat_Cat, Erp_Id, Name_Erp, Dimension, Weight, Spec, Unit, encodedOriginalName ,filename, filePath, Status, userEmail];
        
        const insertResult = await dbconnect.query(sqlCommand, values);

        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `รหัส: ${Rm_Pk_Id} บันทึกได้สำเร็จ ครับ`
        });

    } catch (error) {
        console.log('error', error)
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}

//update package
// const updatePackage = async (req, res) => {
//     const id = req.params.id;
//     const file = req.file || {}; // Default to an empty object if no file is uploaded
//     const userEmail = req.user.email; // This email comes from requireAuth
//     const { Rm_Pk_Id, Mat_Cat, Group, Sub_Mat_Cat, Erp_Id, Name_Erp, Dimension, Weight, Spec, Unit, CreateBy, Status} = req.body;
//     const { filename, originalname, path: filePath } = file;
//     // console.log('file', file)
//     // Encoding the originalname to UTF-8 if it exists
//     const encodedOriginalName = originalname
//     ? Buffer.from(originalname, 'latin1').toString('utf8').replace(/\s+/g, '_').replace(/[^\w\-_.ก-๙]/g, '')
//     : null;
//     try {
//         // Retrieve current record before update
//         const currentValueSql = `SELECT * FROM "Package" WHERE id = $1`;
//         const currentValueResult = await dbconnect.query(currentValueSql, [id]);
//         const currentValue = currentValueResult.rows[0];

//         if (!currentValue) {
//             return res.status(404).json({
//                 success: false,
//                 msg: `ไม่พบข้อมูลที่มีรหัส: `,
//             });
//         }
//         // const oldFilePath = currentValue.path;
//         // // Delete the old file
//         // if (fs.existsSync(oldFilePath)) {
//         //     fs.unlinkSync(oldFilePath);
//         // } else {
//         //     console.log(`Old file not found at path: ${oldFilePath}`);
//         // }
//         // Check if a new file is uploaded
//         if (filePath) {
//             const oldFilePath = currentValue.path;

//             // Delete the old file only if it exists
//             if (fs.existsSync(oldFilePath)) {
//                 try {
//                     fs.unlinkSync(oldFilePath);
//                 } catch (err) {
//                     console.error(`Error deleting old file at path: ${oldFilePath}`, err);
//                 }
//             } else {
//                 console.log(`Old file not found at path: ${oldFilePath}`);
//             }
//         }
//         // Update Existing Record
//         const updateSql = `
//         UPDATE "Package" 
//         SET 
//         "Rm_Pk_Id" = $1,
//         "Mat_Cat" = $2,
//         "Group" = $3,
//         "Sub_Mat_Cat" = $4,
//         "Erp_Id" = $5,
//         "Name_Erp" = $6,
//         "Dimension" = $7,
//         "Weight" = $8,
//         "Spec" = $9,
//         "Unit" = $10,
//         "originalname" = $11,
//         "unqiuename" = $12,
//         "path" = $13,
//         "Status" = $14,
//         "CreateBy" = $15
//         WHERE "id" = $16
//         RETURNING *;
//         `;
//         const values = [
//             Rm_Pk_Id,
//             Mat_Cat,
//             Group,
//             Sub_Mat_Cat,
//             Erp_Id,
//             Name_Erp,
//             Dimension,
//             Weight,
//             Spec,
//             Unit,
//             encodedOriginalName,
//             filename,
//             filePath,
//             Status,
//             userEmail,
//             id,
//         ];

//         const updateResult = await dbconnect.query(updateSql, values);
//         const updatedRecord = updateResult.rows[0];

//         const columns = [
//             "Rm_Pk_Id", "Mat_Cat", "Group", "Sub_Mat_Cat", "Erp_Id", "Name_Erp", 
//             "Dimension", "Weight", "Spec", "Unit", "originalname", "unqiuename", 
//             "path", "Status",
//         ];

//         for (const column of columns) {
//             const oldValue = currentValue[column];
//             const newValue = req.body[column];
//             if (oldValue !== newValue) {
//                 await logUpdate("Package", column, id, oldValue, newValue, "updated" , userEmail);
//             }
//         }

//         // Response
//         res.status(200).json({
//             success: true,
//             data: updatedRecord,
//             msg: `อัปเดตข้อมูล: ${Rm_Pk_Id} สำเร็จ`,
//         });       

       
//     } catch (error) {
//         console.error("Error updating package:", error);
//         res.status(500).json({
//             success: false,
//             msg: `เกิดข้อผิดพลาดขณะอัปเดตข้อมูล: กรุณาลองอีกครั้ง.`,
//             data: error.message,
//         });
//     }
// }


const updatePackage = async (req, res) => {
    const id = req.params.id;
    const file = req.file || {}; // Default to an empty object if no file is uploaded
    const userEmail = req.user.email; // This email comes from requireAuth
    const { Rm_Pk_Id, Mat_Cat, Group, Sub_Mat_Cat, Erp_Id, Name_Erp, Dimension, Weight, Spec, Unit, CreateBy, Status } = req.body;
    const { filename, originalname, path: filePath } = file;

    // Encoding the originalname to UTF-8 if it exists
    const encodedOriginalName = originalname
        ? Buffer.from(originalname, 'latin1').toString('utf8').replace(/\s+/g, '_').replace(/[^\w\-_.ก-๙]/g, '')
        : null;

    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Package" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];

        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลที่มีรหัส: `,
            });
        }

        // Handle file deletion if a new file is uploaded
        if (filePath) {
            const oldFilePath = currentValue.path;
            if (fs.existsSync(oldFilePath)) {
                try {
                    fs.unlinkSync(oldFilePath);
                } catch (err) {
                    console.error(`Error deleting old file at path: ${oldFilePath}`, err);
                }
            } else {
                console.log(`Old file not found at path: ${oldFilePath}`);
            }
        }

        // Update Existing Record
        const updateSql = `
        UPDATE "Package" 
        SET 
        "Rm_Pk_Id" = $1,
        "Mat_Cat" = $2,
        "Group" = $3,
        "Sub_Mat_Cat" = $4,
        "Erp_Id" = $5,
        "Name_Erp" = $6,
        "Dimension" = $7,
        "Weight" = $8,
        "Spec" = $9,
        "Unit" = $10,
        "originalname" = COALESCE($11, "originalname"),
        "unqiuename" = COALESCE($12, "unqiuename"),
        "path" = COALESCE($13, "path"),
        "Status" = $14,
        "CreateBy" = $15
        WHERE "id" = $16
        RETURNING *;
        `;

        const values = [
            Rm_Pk_Id,
            Mat_Cat,
            Group,
            Sub_Mat_Cat,
            Erp_Id,
            Name_Erp,
            Dimension,
            Weight,
            Spec,
            Unit,
            filePath ? encodedOriginalName : null, // Update only if a new file is uploaded
            filePath ? filename : null,          // Update only if a new file is uploaded
            filePath ? filePath : null,          // Update only if a new file is uploaded
            Status,
            userEmail,
            id,
        ];

        const updateResult = await dbconnect.query(updateSql, values);
        const updatedRecord = updateResult.rows[0];

        // Logging changes
        const columns = [
            "Rm_Pk_Id", "Mat_Cat", "Group", "Sub_Mat_Cat", "Erp_Id", "Name_Erp",
            "Dimension", "Weight", "Spec", "Unit", "originalname", "unqiuename",
            "path", "Status",
        ];

        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = column === "originalname" || column === "unqiuename" || column === "path"
                ? updatedRecord[column]
                : req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("Package", column, id, oldValue, newValue, "updated", userEmail);
            }
        }

        // Response
        res.status(200).json({
            success: true,
            data: updatedRecord,
            msg: `อัปเดตข้อมูล: ${Rm_Pk_Id} สำเร็จ`,
        });

    } catch (error) {
        console.error("Error updating package:", error);
        res.status(500).json({
            success: false,
            msg: `เกิดข้อผิดพลาดขณะอัปเดตข้อมูล: กรุณาลองอีกครั้ง.`,
            data: error.message,
        });
    }
};


module.exports ={
    getPackages,
    getPackage,
    postPackage,
    updatePackage,
    uploadPackageMiddleware
  
}