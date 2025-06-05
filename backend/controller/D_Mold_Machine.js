const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');

const getD_Machine_Molds = async (req, res) => {
    const mysql = `
        SELECT * FROM "Mold_Machine"
        ORDER BY id ASC 
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

//Get Single record by id
const getD_Machine_Mold = async (req, res) => {
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM "Mold_Machine" WHERE id = $1' , [id],(err, result) =>{
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



const postD_Machine_Mold = async (req, res) =>{
    const userEmail = req.user.email;
    const { Mold_Machine_Code, Mold_Code, Machine_Code, Description, CreateBy } = req.body;

    try {
        // Check for duplicate 
        const sqlCheck = `SELECT * FROM "Mold_Machine" WHERE "Mold_Machine_Code" = $1`;
        const checkResult = await dbconnect.query(sqlCheck, [Mold_Machine_Code]);
        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkResult.rows,
                msg: `รหัส Machine_no: ${Mold_Machine_Code} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }
        // Insert New Record
        const sqlCommand = `
            INSERT INTO "Mold_Machine" 
            ("Mold_Machine_Code", "Mold_Code", "Machine_Code", "Description", "CreateBy") 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *
        `;
        const values = [Mold_Machine_Code, Mold_Code, Machine_Code, Description, userEmail];
        const insertResult = await dbconnect.query(sqlCommand, values);
        return res.status(200).json({
            success: true,
            data: insertResult.rows,
            msg: `รหัส Machine_no: ${Mold_Machine_Code} บันทึกได้สำเร็จ ครับ`
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
const postmultipleD_Machine_Mold = async (req, res) =>{
    const userEmail = req.user.email;
    const entries = req.body;
    // console.log('req.body',req.body)
    if (!Array.isArray(entries)) {
        return res.status(400).json({ msg: 'Invalid input format' });
    }
    console.log('req.body',req.body)
    try {
        const codesToCheck = entries.map(e => e.Mold_Machine_Code);

        // 1. Check existing codes
        const { rows: existingRows } = await dbconnect.query(
            `SELECT "Mold_Machine_Code" FROM "Mold_Machine" WHERE "Mold_Machine_Code" = ANY($1)`,
            [codesToCheck]
        );
        const existingCodes = existingRows.map(r => r.Mold_Machine_Code);
        
        // if (existingCodes){
        //     res.status(400).json({
        //         msg: `มีอยู่แล้วมีอยู่ในฐานข้อมูลอยู่แล้ว ${existingCodes}`,
        //         success: false,
        //     });
        // }
        // 2. Filter new entries
        const newEntries = entries.filter(e => !existingCodes.includes(e.Mold_Machine_Code));

        // 3. Insert new entries
        if (newEntries.length > 0) {
            const insertPromises = newEntries.map(e =>
                dbconnect.query(
                  `INSERT INTO "Mold_Machine" 
                   ("Mold_Machine_Code", "Mold_Code", "Machine_Code", "Description", "CreateBy") 
                   VALUES ($1, $2, $3, $4, $5) 
                   RETURNING *`,
                  [e.Mold_Machine_Code, e.Mold_Code, e.Machine_Code, e.Description, userEmail]
                )
            );
            await Promise.all(insertPromises);
              
        }
        // 4. Return inserted & existing
        return res.status(200).json({
            msg: `บันทึกสำเร็จ ${ newEntries.map(e => e.Mold_Machine_Code)} และ มีอยู่แล้ว ${existingCodes}`,
            data:"ok",
            success: true,
            inserted: newEntries.map(e => e.Mold_Machine_Code),
            duplicates: existingCodes
        });

    } catch (err) {
        await dbconnect.query('ROLLBACK');
        console.error('Error saving mold-machine:', err);
        return res.status(500).json({ 
            msg: 'Server error',
            success: false,
        });
    }

}

const updateD_Machine_Mold = async (req, res) =>{
    const id = req.params.id;
    const userEmail = req.user.email;
    const { Mold_Machine_Code, Mold_Code, Machine_Code, Description, CreateBy } = req.body;
    try {
        // Retrieve current record before update
        const currentValueSql = `SELECT * FROM "Mold_Machine" WHERE id = $1`;
        const currentValueResult = await dbconnect.query(currentValueSql, [id]);
        const currentValue = currentValueResult.rows[0];
        const currentValueCreateBy = currentValueResult.rows[0].CreateBy;
        if (!currentValue) {
            return res.status(404).json({
                success: false,
                msg: `ไม่พบข้อมูลที่มีรหัส: ${Mold_Machine_Code}`,
            });
        }
        // Update section
        const updateSql =  `
            UPDATE "Mold_Machine" SET 
            "Mold_Machine_Code" = $1,
            "Mold_Code" = $2,
            "Machine_Code" = $3,
            "Description" = $4,
            "CreateBy" = $5
            WHERE "id" = $6
            RETURNING *
        `;
        const values = [Mold_Machine_Code, Mold_Code, Machine_Code, Description, currentValueCreateBy, id];
        //Update Query
        const updateResult = await dbconnect.query(updateSql, values);
        const updatedRecord = updateResult.rows[0];
        if(updatedRecord){
            res.status(200).json({
                success: true,
                data: updatedRecord,
                msg: `อัปเดตข้อมูล: ${Mold_Machine_Code} สำเร็จ`,
            });
        }
        // Log changes
        const columns = [
            "Mold_Machine_Code", "Mold_Code", "Machine_Code", "Description"
        ];
        for (const column of columns) {
            const oldValue = currentValue[column];
            const newValue = req.body[column];
            if (oldValue !== newValue) {
                await logUpdate("Mold_Machine", column, id, oldValue, newValue, "updated" , userEmail);
            }
        }
    } catch (error) {
        console.log("Error updating BOM:", error);
        res.status(500).json({
            success: false,
            msg: `เกิดข้อผิดพลาดขณะอัปเดตข้อมูล: ${Mold_Machine_Code} กรุณาลองอีกครั้ง.`,
            data: error.message,
        });
    }
}
module.exports ={
    getD_Machine_Molds,
    getD_Machine_Mold,
    postD_Machine_Mold,
    postmultipleD_Machine_Mold,
    updateD_Machine_Mold
  
}