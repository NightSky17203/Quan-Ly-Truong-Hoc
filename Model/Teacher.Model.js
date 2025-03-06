import { connection, conn } from '../Config/database.js';

const teacherModel = {
    async GetallTeacher(SearchValue,Limit,Offset){
        const SeachCondition = SearchValue.length > 0
        ? 'WHERE magiaovien = ? OR tengiaovien = ? OR email = ? OR sdt = ?'
        : '';
        const sql = `SELECT * FROM quanlygiaovien ${SeachCondition} LIMIT ? OFFSET ?`;
        const params = SearchValue.length > 0 ? [SearchValue,SearchValue,SearchValue,SearchValue,Limit,Offset] : [Limit,Offset];
        return await conn.promise().query(sql,params);
    },

    async CountTeacher(SearchValue){
        const SeachCondition = SearchValue.length > 0
        ? 'WHERE magiaovien = ? OR tengiaovien = ? OR email = ? OR sdt = ?'
        : '';
        const sql = `SELECT COUNT(*) as total FROM quanlygiaovien ${SeachCondition}`;
        const params = SearchValue.length > 0 ? [SearchValue,SearchValue,SearchValue,SearchValue] : [];
        return await conn.promise().query(sql,params);
    },

    async checkTeacher(magiaovien){
        const sql = `select * from quanlygiaovien where magiaovien = ?`;
        return await conn.promise().query(sql,[magiaovien]);  
    },
    
    async checkFaculty(tenkhoa){
        const sql = `select * from quanlykhoa where tenkhoa = ?`;
        return await conn.promise().query(sql,[tenkhoa]);  
    },
    async CheckTeacherPhone(sdt){
        const sql = `select * from quanlygiaovien where sdt = ?`;
        return await conn.promise().query(sql,[sdt]);  
    },
    async CheckTeacherEmail(email){
        const sql = `select * from quanlygiaovien where email = ?`;
        return await conn.promise().query(sql,[email]);  
    },
    async InsertTeacher(id_giaovien,magiaovien,tengiaovien,tenkhoa,gioitinh,email,sdt,ngaysinh,status){
        const sql = `insert into quanlygiaovien (id_giaovien,magiaovien,tengiaovien,tenkhoa,gioitinh,email,sdt,ngaysinh,status) value (?,?,?,?,?,?,?,?,?)`;
        return await conn.promise().query(sql,[id_giaovien,magiaovien,tengiaovien,tenkhoa,gioitinh,email,sdt,ngaysinh,status]);  
    },
    async updateTeacher(tengiaovien,tenkhoa,gioitinh,email,sdt,ngaysinh,status,magiaovien){
        const sql = `update quanlygiaovien set tengiaovien =?, tenkhoa=?,gioitinh =?,email=?,sdt=?,ngaysinh=?,status=? where magiaovien = ?`;
        return await conn.promise().query(sql,[tengiaovien,tenkhoa,gioitinh,email,sdt,ngaysinh,status,magiaovien]);  
    },
    async updateTeacherStatus(magiaovien,status){
        const sql = `update quanlygiaovien set status = ? where magiaovien = ?`;
        return await conn.promise().query(sql,[status,magiaovien]);  
    },
    async deleteTeacher(magiaovien){
        const sql = `delete from quanlygiaovien where magiaovien=?`;
        return await conn.promise().query(sql,[magiaovien]);  
    }
};

export default { teacherModel };

export { teacherModel };