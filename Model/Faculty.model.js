import { connection, conn } from '../Config/database.js';

const facultyModel = {
    async GetallFaculty(SearchValue,Limit,Offset){
        const sql = `SELECT * FROM quanlykhoa WHERE makhoa LIKE ? OR tenkhoa LIKE ? LIMIT ? OFFSET ?`;
        return await conn.promise().query(sql,[SearchValue,SearchValue,Limit,Offset]);  
    },
    async CountFaculty(SearchValue){
        const sql = `SELECT COUNT(*) as total FROM quanlykhoa WHERE makhoa LIKE ? OR tenkhoa LIKE ?`;
        return await conn.promise().query(sql,[SearchValue,SearchValue]);     
    },
    async checkFaculty(makhoa){
        const sql = `select * from quanlykhoa where makhoa = ?`;
        return await conn.promise().query(sql,[makhoa]);  
    },
    async InsertFaculty(idkhoa,makhoa,tenkhoa){
        const sql = `insert into quanlykhoa (id_khoa,makhoa,tenkhoa) value (?,?,?)`;
        return await conn.promise().query(sql,[idkhoa,makhoa,tenkhoa]);  
    },
    async checkQuery(tenkhoa){
        const checkQuery = `
                    SELECT 
                        (SELECT COUNT(*) FROM quanlygiaovien WHERE tenkhoa = ?) AS teacherCount,
                        (SELECT COUNT(*) FROM quanlysinhvien WHERE tenkhoa = ?) AS studentCount
                    `;
        return await conn.promise().query(checkQuery, [tenkhoa, tenkhoa]);
    },
    async deleteFaculty(makhoa){
        const sql = `delete from quanlykhoa where makhoa=?`;
        return await conn.promise().query(sql,[makhoa]);  
    },
    async updateFaculty(tenkhoa,makhoa){
        const sql = `update quanlykhoa set tenkhoa=? where makhoa=?`;
        return await conn.promise().query(sql,[tenkhoa,makhoa]);  
    }
}
export {facultyModel};

export default {facultyModel};      