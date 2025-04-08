const dbconnect = require('../middleware/Dbconnect');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { logUpdate } = require('../utility/updateLog');

const getProductspecfiles = async (req, res) => {
    try {
        dbconnect.query(`SELECT * FROM "productspecfile"`, (err, result) => {
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


const getProductspecfile = async (req, res) => {
    const id = req.params.id;
    try {
        dbconnect.query(`SELECT * FROM "productspecfile" WHERE id = $1`,[id] , (err, result) => {
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

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../Assets/Productspec');
fs.mkdirSync(uploadDir, { recursive: true });

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save files to 'Assets/Drawing' folder
    },
    filename: (req, file, cb) => {
        // Sanitize the filename to replace spaces and unsafe characters
        const sanitizedFilename = Buffer.from(file.originalname, 'latin1').toString('utf8').replace(/\s+/g, '_').replace(/[^\w\-_.ก-๙]/g, '');
        // const uniqueSuffix = `${Date.now()}`;
        cb(null, `${sanitizedFilename}`);
    }
});


// Multer configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
}).single('file');;

// Middleware for handling single file upload
// const uploadProductspecMiddleware = upload.single('file');
// Controller for creating a drawing file
const uploadProductspecMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ msg: 'File size exceeds 10MB limit.' });
            }
            return res.status(400).json({ msg: 'File upload failed.', error: err.message });
        }
        next(); // Proceed to the next middleware or route handler
    });
};
const updateProductspecFile = async (req, res) => {
    const { Product_Spec_Id } = req.body;
    const userEmail = req.user?.email ; 
    const file = req.file;
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ msg: 'ID is required to update the file.', success: false });
    }

    if (!file) {
        return res.status(400).json({ msg: 'No file uploaded.', success: false });
    }

    const { filename, originalname, path: filePath } = file;
    const encodedOriginalName = Buffer.from(originalname, 'latin1').toString('utf8').replace(/\s+/g, '_').replace(/[^\w\-_.ก-๙]/g, '');
    //Relative path
    const relativeFilePath = `Productspec/${filename}`;
    try {
        // Fetch the old file details
        const fetchOldFileQuery = `SELECT path, unqiuename FROM "productspecfile" WHERE id = $1`;
        const oldFileResult = await dbconnect.query(fetchOldFileQuery, [id]);

        if (oldFileResult.rows.length === 0) {
            return res.status(404).json({ msg: 'Record not found.', success: false });
        }
        if (oldFileResult.rows[0].unqiuename === filename){
            return res.status(400).json({
                success: false,
                msg: 'กรุณาระบุ Version ของการแก้ไขโดยการเพิ่ม Version ไปกับชื่อไฟล์ Ex: _V1, _V2, ... ครับ'
            })
        }
        const oldFilePathquery = oldFileResult.rows[0].path;
        const currentValueResult = await dbconnect.query(`SELECT * FROM "productspecfile" WHERE id = $1`, [id]);

        // //full path
        // const oldFilePath = path.join(__dirname, '../Assets', oldFilePathquery);
        // // Delete the old file
        // if (fs.existsSync(oldFilePath)) {
        //     fs.unlinkSync(oldFilePath);
        // } else {
        //     console.warn(`Old file not found at path: ${oldFilePath}`);
        // }

        if (oldFilePathquery && typeof oldFilePathquery === 'string' && file) {
            const oldFilePath = path.join(__dirname, '../Assets', oldFilePathquery);
            // **Check if file exists before deleting**
            if (fs.existsSync(oldFilePath)) {
                try {
                    fs.unlinkSync(oldFilePath);
                    console.log('✅ Deleted old file:', oldFilePath);
                } catch (err) {
                    console.log(`❌ Error deleting old file: ${oldFilePath}`, err);
                }
            }
        }
        // Update the database with the new file details
        const updateQuery = `
            UPDATE "productspecfile" 
            SET productspec_no = $1, unqiuename = $2, originalname = $3, path = $4, create_by = $5 
            WHERE id = $6 
            RETURNING *`;
        const values = [Product_Spec_Id, filename, encodedOriginalName, relativeFilePath, userEmail, id];

        const updateResult = await dbconnect.query(updateQuery, values);

        //log History
        const columns = [
            "Product_Spec_Id", "unqiuename", "originalname", "path", "create_by"
        ];

        
        const currentValue = currentValueResult.rows[0];
        const updatedRecord = updateResult.rows[0];
        // const action = updated;
        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = updatedRecord[column];

            if (oldValue !== newValue) {
                await logUpdate("productspecfile", column, id, oldValue, newValue, "updated" , userEmail);
            }
        }

        res.status(200).json({
            msg: `อัปเดตไฟล์ Product spec: ${Product_Spec_Id} สำเร็จแล้ว`,
            data: updateResult.rows[0],
            success: true
        });

    } catch (error) {
        console.error('Database or file operation error:', error.message);
        res.status(500).json({
            msg: `อัปเดตไฟล์ Product spec: ${Product_Spec_Id} ไม่สำเร็จ กรุณาตรวจสอบอีกรอบ !!`,
            success: false
        });
    }
};


const createProductspecFile = async (req, res) => {
    const { Product_Spec_Id } = req.body;
    const userEmail = req.user?.email; // Fallback for user email
    const file = req.file;

    // Check if file is provided
    if (!file) {
        return res.status(400).json({ msg: 'No file uploaded.' });
    }
    const { filename, originalname, path: filePath } = file;

    // Encoding the originalname to UTF-8
    const encodedOriginalName = Buffer.from(originalname, 'latin1').toString('utf8').replace(/\s+/g, '_').replace(/[^\w\-_.ก-๙]/g, '');
    //relative path
    const relativeFilePath = `Productspec/${filename}`;

    console.log(encodedOriginalName); // This will log the UTF-8 encoded name
    // Check if Product_Spec_Id already exists in the database
    const sqlCheck = `SELECT * FROM "productspecfile" WHERE "productspec_no" = $1`;
    const checkResult = await dbconnect.query(sqlCheck, [Product_Spec_Id]);
    //Check if file exist
    // Fetch the old file details
    const fetchOldFileQuery = `SELECT path, unqiuename FROM "productspecfile" WHERE unqiuename = $1`;
    const oldFileResult = await dbconnect.query(fetchOldFileQuery, [filename]);
    if (oldFileResult.rows.length > 0){
        return res.status(400).json({
            success: false,
            msg: `กรุณาลองใหม่ไฟล์ที่คุณ Submit มี ${filename} อยู่ในฐานข้อมูลอยู่แล้ว ... ครับ`
        })
    }
    //check if database exist
    if (checkResult.rows.length > 0) {
        // If the ID already exists, delete the uploaded file to prevent saving
        // fs.unlinkSync(filePath);
        // console.log('checkResult.rows.length',checkResult.rows.length)
        // console.log('checkResult', checkResult)
        const FilePath = path.join(__dirname, '../Assets', relativeFilePath);
        // **Check if file exists before deleting**
        if (fs.existsSync(FilePath)) {
            try {
                fs.unlinkSync(FilePath);
                console.log('✅ Deleted old file:', FilePath);
            } catch (err) {
                console.log(`❌ Error deleting old file: ${FilePath}`, err);
            }
        }
        return res.status(400).json({
            success: false,
            data: checkResult.rows,
            msg: `รหัส: ${Product_Spec_Id} มีไฟล์อยู่แล้ว กรุณาลองรหัสใหม่!`
        });
    }

    try {
        // Insert new record into the database
        const sqlCommand = `
            INSERT INTO "productspecfile" 
            (productspec_no, unqiuename, originalname, path, create_by) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`;
        const values = [Product_Spec_Id, filename, encodedOriginalName, relativeFilePath, userEmail];

        const result = await dbconnect.query(sqlCommand, values);

        return res.status(200).json({
            msg: `บันทึกไฟล์ productspec: ${Product_Spec_Id} สำเร็จแล้ว`,
            data: result.rows[0],
            success: true
        });
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({
            msg: `บันทึกไฟล์ productspec: ${Product_Spec_Id} ไม่สำเร็จแล้ว กรุณาตรวจสอบอีกรอบ !!`,
            success: false
        });
    }
};





module.exports = {
    createProductspecFile,
    getProductspecfile,
    getProductspecfiles,
    uploadProductspecMiddleware,
    updateProductspecFile

};



