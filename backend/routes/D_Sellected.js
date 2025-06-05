const express = require('express');
const router = express.Router();
const { 
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
} =  require("../controller/D_Sellected");

router.get('/mold', getselectD_Molds);
router.get('/moldmachine', getselectD_Machines);
router.get('/chemgrade', getselectD_Chemgrades);
router.get('/partno', getselectD_partnos);
router.get('/volunme/:part_no', getVolunme);
router.get('/sgvalue/:SG_Value', getSG);

router.get('/dweight', getselectedD_Weight);
router.get('/dmoldmachine', getselectedD_Moldmachine);
router.post('/bydweight', getselectedbyD_weight);
router.post('/bymoldmachine', getselectedbymoldmachine);



module.exports = router;