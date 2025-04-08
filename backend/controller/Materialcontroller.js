const dbconnect = require('../middleware/Dbconnect');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { logUpdate } = require('../utility/updateLog');

const uploadDir = path.join(__dirname, '../Assets/Material');
fs.mkdirSync(uploadDir, { recursive: true });
// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        const sanitizedFilename = Buffer.from(file.originalname, 'latin1').toString('utf8').replace(/\s+/g, '_').replace(/[^\w\-_.ก-๙]/g, '');        
        cb(null, `${sanitizedFilename}`);
    }
});


// Multer configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
}).single('file');

// Middleware for handling single file upload
// const uploadPackageMiddleware = upload.single('file');
const uploadMaterialMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ msg: 'File size exceeds 5MB limit.' });
            }
            console.log('error', err)
            return res.status(400).json({ msg: 'File upload failed.', error: err.message });
            
        }
        next(); // Proceed to the next middleware or route handler
    });
};

//Get all record
const getMaterials = (req, res) =>{
    try {
        dbconnect.query(`SELECT * FROM "Material" ORDER BY id ASC `, (err, result) => {
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
const getMaterial = async (req,res) =>{
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "Material" WHERE id = $1' , [id],(err, result) =>{
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
const postMaterial = async (req, res) =>{
    const file = req.file || {};
    const { filename, originalname, path: filePath } = file;
    const userEmail = req.user.email; // This email comes from requireAuth
    const {
        Compact_No_Modify, Compact_No_Catalog, Drawing_no, Type_Drawing, Num, Sheet, 
        Data_Approve, Edion, Cabinet_Id, Remark, Document_Id, Type1, Type2, Type3, 
        ID, Width, Length, Thick, Shim_Thick, Height, Hole_Scale, Quantity_Shim, 
        Option, Area, Drill, Type_Shim, Working_Duration
    } = req.body;
    // Encoding the originalname to UTF-8 if it exists
    const encodedOriginalName = originalname
    ? Buffer.from(originalname, 'latin1').toString('utf8').replace(/\s+/g, '_').replace(/[^\w\-_.ก-๙]/g, '')
    : null;
    //relative path
    const relativeFilePath = `Material/${filename}`;
    //Check if file exist
    // Fetch the old file details
    const fetchOldFileQuery = `SELECT path, uniquename FROM "Material" WHERE uniquename = $1`;
    const oldFileResult = await dbconnect.query(fetchOldFileQuery, [filename]);
    if (oldFileResult.rows.length > 0){
        // console.log('oldFileResult.rows.length', oldFileResult.rows.length)
        return res.status(400).json({
            success: false,
            msg: `กรุณาลองใหม่ไฟล์ที่คุณ Submit มี ${filename} อยู่ในฐานข้อมูลอยู่แล้ว ... ครับ`
        })
    }
    // //check if databse exist
    // const FilePath = path.join(__dirname, '../Assets', relativeFilePath);
    // // **Check if file exists before deleting**
    // if (fs.existsSync(FilePath)) {
    //     try {
    //         fs.unlinkSync(FilePath);
    //         console.log('✅ Deleted old file:', FilePath);
    //     } catch (err) {
    //         console.log(`❌ Error deleting old file: ${FilePath}`, err);
    //     }
    // }
    console.log('req.file',req.file)
    try {
        //Insert New Record RETURNING *
        const sqlCommand = `
            INSERT INTO "Material" (
                "Compact_No_Modify", "Compact_No_Catalog", "Drawing_no", "Type_Drawing", "Num", "Sheet", 
                "Data_Approve", "Edion", "Cabinet_Id", "Remark", "Document_Id", "Type1", "Type2", "Type3", 
                "ID", "Width", "Length", "Thick", "Shim_Thick", "Height", "Hole_Scale", "Quantity_Shim", 
                "Option", "Area", "Drill", "Type_Shim", create_by, "Working_Duration","originalname", "uniquename", 
                "path"
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
                $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31
            ) RETURNING *
        `;
        const values = [
            Compact_No_Modify, Compact_No_Catalog, Drawing_no, Type_Drawing, Num, Sheet, 
            Data_Approve, Edion, Cabinet_Id, Remark, Document_Id, Type1, Type2, Type3, 
            ID, Width, Length, Thick, Shim_Thick, Height, Hole_Scale, Quantity_Shim, 
            Option, Area, Drill, Type_Shim, userEmail, Working_Duration, encodedOriginalName ,filename, relativeFilePath
        ];
        const insertResult = await dbconnect.query(sqlCommand, values);

        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `บันทึกได้สำเร็จ ครับ`
        });

    } catch (error) {
        console.log('error materil',error)
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}



//update package
const updateMaterial = async (req, res) => {
    const id = req.params.id;
    const userEmail = req.user.email; // Authenticated user email
    const file = req.file || {};
    const { filename, originalname, path: filePath } = file;
    const {
        Compact_No_Modify, Compact_No_Catalog, Drawing_no, Type_Drawing, Num, Sheet, 
        Data_Approve, Edion, Cabinet_Id, Remark, Document_Id, Type1, Type2, Type3, 
        ID, Width, Length, Thick, Shim_Thick, Height, Hole_Scale, Quantity_Shim, 
        Option, Area, Drill, Type_Shim, Working_Duration
    } = req.body;
    // Encode and sanitize the filename
    const encodedOriginalName = originalname
    ? Buffer.from(originalname, 'latin1').toString('utf8').replace(/\s+/g, '_').replace(/[^\w\-_.ก-๙]/g, '')
    : null;

    // Define new file path if a file is uploaded
    const relativeFilePath = filename ? `Material/${filename}` : null;
    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Material" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];
        // console.log('currentValue', currentValue)
        // console.log('req.file ', req.file )

        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลที่มีรหัส: `,
            });
        }
        if (currentValue.uniquename === filename){
            console.log('currentValue.unqiuename === filename',filename,currentValue.unqiuename)
            return res.status(400).json({
                success: false,
                msg: 'กรุณาระบุ Version ของการแก้ไขโดยการเพิ่ม Version ไปกับชื่อไฟล์ Ex: _V1, _V2, ... ครับ'
            })
        }
        // **✅ FIX: Ensure currentValue.path is a string before using path.join()**
        if (currentValue.path && typeof currentValue.path === 'string' && file) {
            const oldFilePath = path.join(__dirname, '../Assets', currentValue.path);

            // **Check if file exists before deleting**
            if (fs.existsSync(oldFilePath)) {
                try {
                    fs.unlinkSync(oldFilePath);
                    console.log('✅ Deleted old file:', oldFilePath);
                } catch (err) {
                    console.error(`❌ Error deleting old file: ${oldFilePath}`, err);
                }
            }
        }

        //Update Record
        const updateSql = `
            UPDATE "Material" 
            SET 
                "Compact_No_Modify" = $1, 
                "Compact_No_Catalog" = $2, 
                "Drawing_no" = $3, 
                "Type_Drawing" = $4, 
                "Num" = $5, 
                "Sheet" = $6, 
                "Data_Approve" = $7, 
                "Edion" = $8, 
                "Cabinet_Id" = $9, 
                "Remark" = $10, 
                "Document_Id" = $11, 
                "Type1" = $12, 
                "Type2" = $13, 
                "Type3" = $14, 
                "ID" = $15, 
                "Width" = $16, 
                "Length" = $17, 
                "Thick" = $18, 
                "Shim_Thick" = $19, 
                "Height" = $20, 
                "Hole_Scale" = $21, 
                "Quantity_Shim" = $22, 
                "Option" = $23, 
                "Area" = $24, 
                "Drill" = $25, 
                "Type_Shim" = $26, 
                create_by = $27,
                "Working_Duration" = $28,
                "originalname" = COALESCE($29, null),
                "uniquename" = COALESCE($30, null),
                "path" = COALESCE($31, null)
            WHERE id = $32
            RETURNING *;
        `;
        const values = [
            Compact_No_Modify, Compact_No_Catalog, Drawing_no, Type_Drawing, Num, Sheet, 
            Data_Approve, Edion, Cabinet_Id, Remark, Document_Id, Type1, Type2, Type3, 
            ID, Width, Length, Thick, Shim_Thick, Height, Hole_Scale, Quantity_Shim, 
            Option, Area, Drill, Type_Shim, userEmail, Working_Duration ,
            relativeFilePath ? encodedOriginalName : null,
            relativeFilePath ? filename : null,
            relativeFilePath ? relativeFilePath : null,
            id
        ];
        const updateResult = await dbconnect.query(updateSql, values);
        const updatedRecord = updateResult.rows[0];

        const columns = [
            "Compact_No_Modify", "Compact_No_Catalog", "Drawing_no", "Type_Drawing", "Num", "Sheet", 
            "Data_Approve", "Edion", "Cabinet_Id", "Remark", "Document_Id", "Type1", "Type2", "Type3", 
            "ID", "Width", "Length", "Thick", "Shim_Thick", "Height", "Hole_Scale", "Quantity_Shim", 
            "Option", "Area", "Drill", "Type_Shim", "Working_Duration"
        ]; 

        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("Material", column, id, oldValue, newValue, "updated" , userEmail);
            }
        }

        // Response
        res.status(200).json({
            success: true,
            data: updatedRecord,
            msg: `อัปเดตข้อมูล:สำเร็จแล้ว ครับ`,
        });       

       
    } catch (error) {
        console.error("Error updating: Material", error);
        res.status(500).json({
            success: false,
            msg: `เกิดข้อผิดพลาดขณะอัปเดตข้อมูล: กรุณาลองอีกครั้ง.`,
            data: error.message,
        });
    }
}



module.exports ={
    getMaterials,
    getMaterial,
    postMaterial,
    updateMaterial,
    uploadMaterialMiddleware

}