//Darawing, Shim, Data-sheet, Product Spec
export const fetchStatus = [
    { label: 'Master', value: 'Master' },
    { label: 'Intensive', value: 'Intensive' },
    { label: 'Obsolete', value: 'Obsolete' },
]
//Product Register
export const fetchStatusproduct = [
    { label: 'พร้อมจำหน่าย', value: 'พร้อมจำหน่าย' },
    { label: 'ประเมินราคา', value: 'ประเมินราคา' },
    { label: 'ทดลองผลิต APQP', value: 'ทดลองผลิต APQP' },
    { label: 'Obsolete', value: 'Obsolete' },
]
//Product Register
export const fetchtypecustomerproduct = [
    { label: 'After-Market', value: 'After-Market' },
    { label: 'Customer-Specific-Requirement', value: 'Customer-Specific-Requirement' },
    { label: 'APQP', value: 'APQP' },
]
export const fetchOuterproduct = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },

]

//Product spec
export const fetchStatusslot = [
    { label: 'N', value: 'N' },
    { label: 'Y', value: 'Y' },
    { label: 'I', value: 'I' },
]
export const fetchStatuschamfer = [
    { label: 'N', value: 'N' },
    { label: 'J', value: 'J' },
    { label: 'I', value: 'I' },
    { label: 'V', value: 'V' },
]
export const fetchStatuscolorid = [
    { label: 'BLM', value: 'BLM' },
    { label: 'BRM', value: 'BRM' },
    { label: 'BRL', value: 'BRL' },
    { label: 'GRL', value: 'GRL' },
    { label: 'NON', value: 'NON' },
]
export const fetchStatuscoatingscorching = [
    { label: 'N', value: 'N' },
    { label: 'S', value: 'S' },
    { label: 'SR', value: 'SR' },
    { label: 'R', value: 'R' },
    { label: 'G', value: 'G' },
    { label: 'B', value: 'B' },
    { label: 'O', value: 'O' },
]
//E-mark & Pk Rm
export const fetchStatusemark = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
]

export const fetchStatusetypemark = [
    { label: 'E1', value: 'E1' },
    { label: 'E9', value: 'E9' },
    { label: 'E11', value: 'E11' },
]
//User status
export const fetchUserrole = [
    { label: 'Super admin', value: 'superadmin' },  //Fully access System
    { label: 'admin', value: 'admin' },  // Partial access Read, Post, Put
    { label: 'user', value: 'user' }, // Read Only
]
export const fetchUserpermission = [
    { label: '-', value: '-' },
    { label: 'additionalpackage', value: 'additionalpackage' },
    { label: 'Product Register', value: 'productregister' },
    { label: 'Data Sheet', value: 'datasheet' },
    { label: 'Shim', value: 'shim' },
    { label: 'Drawing', value: 'drawing' },
    { label: 'Product Spec.', value: 'productspec' },
    { label: 'Rm&Pk', value: 'prackage' },
    { label: 'E-mark', value: 'emark' },
    { label: 'Component Part', value: 'componentpart' },
    { label: 'Rm&Pk', value: 'Rm&Pk' },
    { label: 'Outer', value: 'Outer' },
]
//Material
export const fetchMaterialtypedrawing = [
    { label: '-', value: '-' },
    { label: 'Intensive', value: 'Intensive' },
    { label: 'Intensive Hold', value: 'Intensive Hold' },
    { label: 'Intensive00', value: 'Intensive00' },
    { label: 'Master', value: 'Master' },
]
export const fetchMaterialcabinetid = [
    { label: '-', value: '-' },
    { label: 'DATA:D', value: 'DATA:D' },
    { label: 'PDS.01', value: 'PDS.01' },
    { label: 'PDS.02', value: 'PDS.02' },
    { label: 'PDS.03', value: 'PDS.03' },
    { label: 'PDS.04', value: 'PDS.04' },
    { label: 'PDS.08', value: 'PDS.08' },
]
export const fetchMaterialremark = [
    { label: '-', value: '-' },
    { label: 'After', value: 'After' },
    { label: 'EV', value: 'EV' },
]
export const fetchMaterialdocumentid = [
    { label: '-', value: '-' },
    { label: 'DDS', value: 'DDS' },
    { label: 'PDS', value: 'PDS' },
    { label: 'PSD', value: 'PSD' },
    { label: 'TE', value: 'TE' },
    { label: 'ลืมใส่', value: 'ลืมใส่' },
]
export const fetchMaterialtype1 = [
    { label: '-', value: '-' },
    { label: 'AC', value: 'AC' },
    { label: 'BP', value: 'BP' },
    { label: 'CC', value: 'CC' },
    { label: 'D', value: 'D' },
    { label: 'ER', value: 'ER' },
    { label: 'ES', value: 'ES' },
    { label: 'F', value: 'F' },
    { label: 'FC', value: 'FC' },
    { label: 'FP', value: 'FP' },
    { label: 'FW', value: 'FW' },
    { label: 'PP', value: 'PP' },
    { label: 'RR', value: 'RR' },
    { label: 'SD', value: 'SD' },
    { label: 'SI', value: 'SI' },
    { label: 'SP', value: 'SP' },
    { label: 'TS', value: 'TS' },
    { label: 'WD', value: 'WD' },
]
export const fetchMaterialtype2 = [
    { label: '-', value: '-' },
    { label: 'BP', value: 'BP' },
    { label: 'D', value: 'D' },
    { label: 'F', value: 'F' },
    { label: 'FP', value: 'FP' },
    { label: 'SD', value: 'SD' },
    { label: 'SP', value: 'SP' },
    { label: 'WD', value: 'WD' },
]
export const fetchMaterialtype3 = [
    { label: '-', value: '-' },
    { label: 'BP-1', value: 'BP-1' },
    { label: 'BP-2', value: 'BP-2' },
    { label: 'BP-3', value: 'BP-3' },
    { label: 'BP-4', value: 'BP-4' },
    { label: 'D', value: 'D' },
    { label: 'D-1', value: 'D-1' },
    { label: 'D-2', value: 'D-2' },
    { label: 'D-3', value: 'D-3' },
    { label: 'D-4', value: 'D-4' },
    { label: 'F', value: 'F' },
    { label: 'F-1', value: 'F-1' },
    { label: 'F-2', value: 'F-2' },
    { label: 'FC', value: 'FC' },
    { label: 'SD', value: 'SD' },
    { label: 'SD-1', value: 'SD-1' },
    { label: 'SP', value: 'SP' },
    { label: 'SP-1', value: 'SP-1' },
    { label: 'SP-2', value: 'SP-2' },
    { label: 'SP-3', value: 'SP-3' },
    { label: 'WD', value: 'WD' },
    { label: 'WD-1', value: 'WD-1' },
    { label: 'WD-2', value: 'WD-2' },
    { label: 'WD-3', value: 'WD-3' },
    { label: 'WD-4', value: 'WD4' },
]

export const fetchmatcat = [
    { label: 'RM', value: 'RM' },
    { label: 'PK', value: 'PK' },
]

export const fetchgroupoptions = [
    { label: 'BP', value: 'BP' },
    { label: 'Shim', value: 'Shim' },
    { label: 'WD', value: 'WD' },
    { label: 'Inner_Box', value: 'Inner_Box' },
    { label: 'Outer_Box', value: 'Outer_Box' },
    { label: 'Sticker', value: 'Sticker' },
    { label: 'Palete', value: 'Palete' },
    { label: 'ลังไม้', value: 'ลังไม้' },
    { label: 'Slip-Sheet', value: 'Slip-Sheet' },
    { label: 'ฟิล์มยืด', value: 'ฟิล์มยืด' },
    { label: 'ถุง', value: 'ถุง' },
    { label: 'อุปกรณ์เสริม', value: 'อุปกรณ์เสริม' },
]
export const fetchunitoptions = [
    { label: '-', value: '-' },
    { label: 'ชิ้น', value: 'ชิ้น' },
    { label: 'ใบ', value: 'ใบ' },
    { label: 'แผ่น', value: 'แผ่น' },
    { label: 'ดวง', value: 'ดวง' },
    { label: 'ตัว', value: 'ตัว' },
    { label: 'ม้วน', value: 'ม้วน' },
]
export const fetchcheckstatus = [
    { label: 'Approve', value: 'Approve' },
    { label: 'Review', value: 'Review' },
    { label: 'Reject', value: 'Reject' },
    { label: 'Wait', value: 'Wait' }
]
