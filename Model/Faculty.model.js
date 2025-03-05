import { connection, conn } from '../Config/database.js';




const facultyModel = {
    async GetallFaculty(SearchValue,Limit,Offset){
        const searchCondition = SearchValue.length >0
            ? 'WHERE makhoa LIKE ? OR tenkhoa LIKE ?' 
            : '';
        console.log(Offset)
        const sql = `SELECT * FROM quanlykhoa ${searchCondition} LIMIT ? OFFSET ?`;
        const params = SearchValue.length > 0 ? [SearchValue,SearchValue,Limit,Offset] : [Limit,Offset];
        return await conn.promise().query(sql,params);
    },
    async CountFaculty(SearchValue){
        const searchCondition = SearchValue.length >0
            ? 'WHERE makhoa LIKE ? OR tenkhoa LIKE ?' 
            : '';
        const sql = `SELECT COUNT(*) as total FROM quanlykhoa ${searchCondition}`;
        const params = SearchValue.length > 0 ? [SearchValue,SearchValue] : [];
        return await conn.promise().query(sql,params);     
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