import { connection, conn } from '../Config/database.js';

const studentModel = {
    async GetallStudent(SearchValue,Limit,Offset){
        const searchCondition = SearchValue.length >0
        ? 'WHERE msv = ? OR tensinhvien = ? OR sdt = ? OR email = ?'
        : '';
        const sql = `SELECT * FROM quanlysinhvien ${searchCondition} LIMIT ? OFFSET ?`;
        const params = SearchValue.length > 0 ? [SearchValue,SearchValue,SearchValue,SearchValue,Limit,Offset] : [Limit,Offset];
        return await conn.promise().query(sql,params);  
    },
    async CountStudent(SearchValue){
        const searchCondition = SearchValue.length >0
        ? 'WHERE msv = ? OR tensinhvien = ? OR sdt = ? OR email = ?'
        : '';
        const sql = `SELECT COUNT(*) as total FROM quanlysinhvien ${searchCondition}`;
        const params = SearchValue.length > 0 ? [SearchValue,SearchValue,SearchValue,SearchValue] : [];
        return await conn.promise().query(sql,params);     
    },
    async checkStudent(msv){
        const sql = `select * from quanlysinhvien where msv = ?`;
        return await conn.promise().query(sql,[msv]);  
    },
    async checkFaculty(makhoa){
        const sql = `select * from quanlykhoa where makhoa = ?`;
        return await conn.promise().query(sql,[makhoa]);  
    },
    async CheckStudentPhone(sdt){
        const sql = `select * from quanlysinhvien where sdt = ?`;
        return await conn.promise().query(sql,[sdt]);  
    },
    async CheckStudentEmail(email){
        const sql = `select * from quanlysinhvien where email = ?`;
        return await conn.promise().query(sql,[email]);  
    },
    async InsertStudent(id_sinhvien,msv,tensinhvien,gioitinh,ngaysinh,sdt,email,nienkhoa,tenkhoa,status){
        const sql = `insert into quanlysinhvien (id_sinhvien,msv,Tensinhvien,GioiTinh,NgaySinh,SDT,Email,nienkhoa,tenkhoa,status) value (?,?,?,?,?,?,?,?,?,?)`;
        return await conn.promise().query(sql,[id_sinhvien,msv,tensinhvien,gioitinh,ngaysinh,sdt,email,nienkhoa,tenkhoa,status]);  
    },
    async updateStudent(tensinhvien,gioitinh,ngaysinh,sdt,email,nienkhoa,tenkhoa,status,msv){
        const sql = `update quanlysinhvien set tensinhvien=?,gioitinh=?,ngaysinh=?,sdt=?,email=?,nienkhoa=?,tenkhoa=?,status=? where msv=?`;
        return await conn.promise().query(sql,[tensinhvien,gioitinh,ngaysinh,sdt,email,nienkhoa,tenkhoa,status,msv]);  
    },
    async updateStudentStatus(msv,status){
        const sql = `update quanlysinhvien set status = ? where msv = ?`;
        return await conn.promise().query(sql,[status,msv]);  
    },
    async deleteStudent(msv){
        const sql = `delete from quanlysinhvien where msv=?`;
        return await conn.promise().query(sql,[msv]);  
    }
};

export default { studentModel };
export { studentModel };