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
//E-mark
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
    { label: 'Product Register', value: 'productregister' },
    { label: 'Data Sheet', value: 'datasheet' },
    { label: 'Shim', value: 'shim' },
    { label: 'Drawing', value: 'drawing' },
    { label: 'Product Spec.', value: 'productspec' },
    { label: 'Prackage', value: 'prackage' },
    { label: 'E-mark', value: 'emark' },
]
