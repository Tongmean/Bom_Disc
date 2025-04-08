const dbconnect = require('../middleware/Dbconnect');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { logUpdate } = require('../utility/updateLog');

const getShimfiles = async (req, res) => {
    try {
        dbconnect.query(`SELECT * FROM "shimfile"`, (err, result) => {
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


const getShimfile = async (req, res) => {
    const id = req.params.id;
    try {
        dbconnect.query(`SELECT * FROM "shimfile" WHERE id = $1`,[id] , (err, result) => {
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
const uploadDir = path.join(__dirname, '../Assets/Shim');
fs.mkdirSync(uploadDir, { recursive: true });

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save files to 'Assets/Drawing' folder
    },
    filename: (req, file, cb) => {
        const sanitizedFilename = Buffer.from(file.originalname, 'latin1').toString('utf8').replace(/\s+/g, '_').replace(/[^\w\-_.ก-๙]/g, '');        
        // const uniqueSuffix = `${Date.now()}`;
        cb(null, `${sanitizedFilename}`);
    }
});


// Multer configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
}).single('file');

// Middleware for handling single file upload
// const uploadShimMiddleware = upload.single('file');
const uploadShimMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ msg: 'File size exceeds 5MB limit.' });
            }
            return res.status(400).json({ msg: 'File upload failed.', error: err.message });
        }
        next(); // Proceed to the next middleware or route handler
    });
};

const createShimfile = async (req, res) => {
    const { Compact_No_Modify } = req.body;
    const userEmail = req.user?.email || 'anonymous'; // Fallback for user email
    const file = req.file;
    // console.log('file', file)
    // console.log('Drawing_No', Drawing_No)
    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded.' });
    }
    const { filename, originalname, path: filePath } = file;
    // Encoding the originalname to UTF-8
    const encodedOriginalName = Buffer.from(originalname, 'latin1').toString('utf8').replace(/\s+/g, '_').replace(/[^\w\-_.ก-๙]/g, '');
    //relative path
    const relativeFilePath = `Shim/${filename}`;
    const sqlCheck = `SELECT * FROM "shimfile" WHERE "shim_no" = $1`;
    const checkResult = await dbconnect.query(sqlCheck, [Compact_No_Modify]);
    //Check if file exist
    // Fetch the old file details
    const fetchOldFileQuery = `SELECT path, unqiuename FROM "shimfile" WHERE unqiuename = $1`;
    const oldFileResult = await dbconnect.query(fetchOldFileQuery, [filename]);
    if (oldFileResult.rows.length > 0){
        // console.log('oldFileResult.rows.length', oldFileResult.rows.length)
        return res.status(400).json({
            success: false,
            msg: `กรุณาลองใหม่ไฟล์ที่คุณ Submit มี ${filename} อยู่ในฐานข้อมูลอยู่แล้ว ... ครับ`
        })
    }
    //check if database exist
    if (checkResult.rows.length > 0) {
        fs.unlinkSync(filePath);
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
            msg: `รหัส: ${Compact_No_Modify} มีไฟล์อยู่แล้ว กรุณาลองรหัสใหม่!`
        });
    }

    try {
        const sqlCommand = `
            INSERT INTO "shimfile" 
            (shim_no, unqiuename, originalname, path, create_by) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`;
        const values = [Compact_No_Modify, filename, encodedOriginalName, relativeFilePath, userEmail];

        const result = await dbconnect.query(sqlCommand, values);
        res.status(200).json({ msg: `บันทึกไฟล์ Shim: ${Compact_No_Modify} สำเร็จแล้ว `, data: result.rows[0] , success: true});
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ msg: `บันทึกไฟล์ Shim: ${Compact_No_Modify} ไม่สำเร็จแล้ว กรุณาตรวจสอบอีกรอบ !!` , success: false});
    }
};


const updateShimFile = async (req, res) => {
    const { Compact_No_Modify } = req.body;
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
    // Encoding the originalname to UTF-8
    const encodedOriginalName = Buffer.from(originalname, 'latin1').toString('utf8').replace(/\s+/g, '_').replace(/[^\w\-_.ก-๙]/g, '');
    //relative path
    const relativeFilePath = `Shim/${filename}`;
    try {
        // Fetch the old file details
        const fetchOldFileQuery = `SELECT path, unqiuename FROM "shimfile" WHERE id = $1`;
        const oldFileResult = await dbconnect.query(fetchOldFileQuery, [id]);

        if (oldFileResult.rows.length === 0) {
            return res.status(404).json({ msg: 'Record not found.', success: false });
        }
        // console.log('oldFileResult.rows[0]', oldFileResult.rows[0])
        // console.log('filename', filename)
        if (oldFileResult.rows[0].unqiuename === filename){
            // console.log('old file', oldFileResult.rows[0].unqiuename)
            // console.log('New file', filename)
            return res.status(400).json({
                success: false,
                msg: 'กรุณาระบุ Version ของการแก้ไขโดยการเพิ่ม Version ไปกับชื่อไฟล์ Ex: _V1, _V2, ... ครับ'
            })
        }

        const oldFilePathquery = oldFileResult.rows[0].path;
        const currentValueResult = await dbconnect.query(`SELECT * FROM "shimfile" WHERE id = $1`, [id]);
        // //Full path
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
            UPDATE "shimfile" 
            SET shim_no = $1, unqiuename = $2, originalname = $3, path = $4, create_by = $5 
            WHERE id = $6 
            RETURNING *`;
        const values = [Compact_No_Modify, filename, encodedOriginalName, relativeFilePath, userEmail, id];

        const updateResult = await dbconnect.query(updateQuery, values);

        //log History
        const columns = [
            "shim_no", "unqiuename", "originalname", "path", "create_by"
        ];

        
        const currentValue = currentValueResult.rows[0];
        const updatedRecord = updateResult.rows[0];
        // const action = updated;
        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = updatedRecord[column];

            if (oldValue !== newValue) {
                await logUpdate("shimfile", column, id, oldValue, newValue, "updated" , userEmail);
            }
        }

        res.status(200).json({
            msg: `อัปเดตไฟล์ Shim: ${Compact_No_Modify} สำเร็จแล้ว`,
            data: updateResult.rows[0],
            success: true
        });

    } catch (error) {
        console.error('Database or file operation error:', error.message);
        res.status(500).json({
            msg: `อัปเดตไฟล์ Shim: ${Compact_No_Modify} ไม่สำเร็จ กรุณาตรวจสอบอีกรอบ !!`,
            success: false
        });
    }
};
module.exports = {
    getShimfiles,
    getShimfile,
    uploadShimMiddleware,
    createShimfile,
    updateShimFile

}