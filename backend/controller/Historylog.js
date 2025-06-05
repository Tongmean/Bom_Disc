//call database connection
const dbconnect = require('../middleware/Dbconnect');
//Get record which have been update
//bom
const getBomlog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'bom'`, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}
//Package
const getPackagelog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'Package'`, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}
//outer
const getOuterlog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'Outer'`, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}
//additional package
const getAdditionalpackagelog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'Additional_Package'`, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}
//data sheet
const getDatasheetlog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'Data_Sheet'`, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}
//Shim
const getShimlog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'Shim'`, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}
//Drawing
const getDrawinglog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'Drawing'`, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}
//product spec
const getProductspeclog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'Product_Spec'`, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}
//product spec
const getDrawingfilelog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'drawingfile' AND column_name != 'path' `, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}
//product spec
const getProductspecfilelog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'productspecfile' AND column_name != 'path' `, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}

const getEmarklog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'Emark' AND column_name != 'path' `, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}

const getShimfilelog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'shimfile' AND column_name != 'path' `, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}

const getMateriallog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'Material'`, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}

const getDatasheetfilelog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'datasheetfile'`, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}
const getD_Machinelog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'Machine'`, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}
const getD_Moldlog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'Mold'`, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}
const getD_Chemgradelog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'Chem_Grade'`, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}
const getD_Weightlog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'Data_Sheet_Weight'`, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}
const getD_Pressurelog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'Data_Sheet_Pressure'`, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}
const getD_Mold_Machinelog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'Mold_Machine'`, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}
const getWipprocesslog = async (req, res) => {
    const id = req.params.id;
    try {
        const Bomlog = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'Wipprocess'`, [id]);
        return res.status(200).json({
            success: true,
            data: Bomlog.rows,
            msg: `ดึงประวิติการแก้ไขสำเร็จแล้ว ครับ`
        });
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดเกิดขึ้นระหว่างการบันทึกข้อมูล กรุณาลองอีกครั้ง"
        });
    }
}

module.exports = {
    getBomlog,
    getPackagelog,
    getOuterlog,
    getAdditionalpackagelog,
    getDatasheetlog,
    getShimlog,
    getDrawinglog,
    getProductspeclog,
    getDrawingfilelog,
    getProductspecfilelog,
    getEmarklog,
    getShimfilelog,
    getMateriallog,
    getDatasheetfilelog,

    getD_Machinelog,
    getD_Moldlog,
    getD_Chemgradelog,
    getD_Weightlog,
    getD_Mold_Machinelog,
    getWipprocesslog,
    getD_Pressurelog



}