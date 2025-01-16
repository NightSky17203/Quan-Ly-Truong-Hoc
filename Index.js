import { createServer } from "node:http";
import express, { query } from 'express'; 
import cors from 'cors';
import mysql from "mysql2";
import Router from "./routes/client/index.route.js";
import 'dotenv/config'
import axios, {isCancel, AxiosError} from 'axios';
import route from "./routes/client/index.route.js";
import { stat } from "node:fs";
import { console } from "node:inspector";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.set("views","./views");
app.set("view engine","pug");

route(app);

const conn = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "quanly_schema",
    authPlugins: {
        default: 'mysql_native_password'
    }
});

//---------------------- Faculty Management----------------------




// Insert
app.post("/api/v1/faculty/insert", async(req,res)=>{
    const {
        id_khoa,
        makhoa,
        tenkhoa
    } = req.body
    try{
        const [checkkhoa] = await conn.promise().query('select * from quanlykhoa where makhoa = ?',[makhoa]);
            if(checkkhoa.length > 0)
                return res.status(404).send({
                    status: 404,
                    Message:"Faculties aleady exists",
                })
        await conn.promise().query('insert into quanlykhoa (id_khoa,makhoa,tenkhoa) value (?,?,?)',[id_khoa,makhoa,tenkhoa]);
                res.status(200).send({
                    status: 200 ,
                    Message:"Faculties inserted",
                    data: "1"
                })
    }catch(err){
        console.log(err);
        return res.status(500).send({
            status: 500,
            Message:"Internal Server Error",
            error: err.message
        })
    }
})

// GET Faculty list with pagination and search
app.get("/api/v1/faculty/list", async(req,res)=>{ 
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        const searchCondition = search 
            ? 'WHERE makhoa LIKE ? OR tenkhoa LIKE ?' 
            : '';
        const searchValue = search 
            ? [`%${search}%`, `%${search}%`] 
            : [];

        const [countResult] = await conn.promise().query(
            `SELECT COUNT(*) as total FROM quanlykhoa ${searchCondition}`,
            searchValue
        );
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

            const [rows] = await conn.promise().query(
            `SELECT * FROM quanlykhoa ${searchCondition} LIMIT ? OFFSET ?`,
            [...searchValue, limit, offset]
        );

        const result = rows.map(row => ({
            id: row.id_khoa,
            facultyCode: row.makhoa,
            facultyName: row.tenkhoa
        }));

        res.json({
            status: 200,
            message: "Faculties found",
            data: result,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalRecords: totalRecords,
                limit: limit
            }
        });
    } catch(err) {
        console.log(err);
        return res.status(500).send({
            status: 500,
            message: "Internal Server Error",
            error: err.message
        });
    }
})

//Delete
app.delete("/api/v1/faculty/delete",async(req,res)=>{
    const makhoa = req.body.makhoa;
    try{
        const [checkkhoa] = await conn.promise().query('select * from quanlykhoa where makhoa = ?',[makhoa]);
            if(checkkhoa.length === 0)
                return res.status(404).send({
                    status: 404,
                    Message:"Faculties not found",
                }
            );
        const tenkhoa = req.body.tenkhoa = checkkhoa[0].tenkhoa;
                const checkQuery = `
                SELECT 
                    (SELECT COUNT(*) FROM quanlygiaovien WHERE tenkhoa = ?) AS teacherCount,
                    (SELECT COUNT(*) FROM quanlysinhvien WHERE tenkhoa = ?) AS studentCount
                `;
            const [result] = await conn.promise().query(checkQuery, [tenkhoa, tenkhoa]);
                console.log(result);
                const teacherCount = result[0].teacherCount;
                const studentCount = result[0].studentCount;
                if(teacherCount > 0 || studentCount > 0){
                    return res.status(404).send({
                        status: 400,
                        Message:"Faculties already in use",
                    })
                }
        await conn.promise().query('delete from quanlykhoa where makhoa=?',makhoa)
            res.send({
                status: 200,
                Message:"Faculties deleted",
                data: null
            });
    }catch(err){
        console.log(err);
        return res.status(500).send({
            status: 500,
            Message:"Internal Server Error",
            error: err.message
        })
    }
})

//Update
app.post("/api/v1/faculty/update",async(req, res)=>{
    // res.setHeader("Content-Type: application/json");

    const {id_khoa, makhoa,tenkhoa} = req.body;
    console.log(`id: ${id_khoa}, makhoa: ${makhoa}, tenkhoa: ${tenkhoa}`)
    try{
        const [checkkhoa] = await conn.promise().query('select * from quanlykhoa where makhoa = ?',[makhoa]);   
            if(checkkhoa.length === 0)
                return res.status(404).send({
                    status: 404,
                    Message:"Faculties not found",
                });
        await conn.promise().query('update quanlykhoa set tenkhoa=? where makhoa=?',[tenkhoa,makhoa]);
            res.status(200).send({
                status: 200,
                Message:"Faculties updated",
                data: null
            });
    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            status: 500,
            Message:"Internal Server Error",
            error: err.message
        })
    }   
})


//---------------------- Student Management----------------------

// GET
app.get("/api/v1/student/list",async(req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    const  searchCondition = search
        ? 'WHERE msv = ? OR tensinhvien = ? OR sdt = ? OR email = ?'
        : '';

    const searchValue = search 
    ? [search,search,search,search]
    : [];

    const [countResult] = await conn.promise().query(
        `SELECT COUNT(*) as total FROM quanlysinhvien ${searchCondition}`,
        searchValue
    );
    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    const [rows] = await conn.promise().query(
        `SELECT * FROM quanlysinhvien ${searchCondition} LIMIT ? OFFSET ?`,
        [...searchValue, limit, offset]
    );
    if(rows.length === 0)
                    return res.status(404).send({
                        status: 404,
                        Message:"Student not found",
                    })
        const result = rows.map(row => ({
            id: row.id_sinhvien,
            studentCode: row.msv,
            studentName: row.tensinhvien,
            gender: row.gioitinh === 1 ? 'Nam' : row.gioitinh === 2 ? 'Nữ' : 'Khác',
            dateOfBirth: row.ngaySinh,
            phoneNumber: row.sdt,
            email: row.email,
            academicYear: row.nienkhoa,
            facultyName: row.tenkhoa,
            status: row.status === 1 ? 'Đang Học' : row.status === 2 ? 'Đình Chỉ' : 'Tốt Nghiệp'
        }))
        console.log(result);
        res.json({
            status: 200,
            Message: "Students found",
            data: result,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalRecords: totalRecords,
                limit: limit
            }
        });
    })


//Insert
app.post("/api/v1/student/insert", async (req, res) => {
    const {
        id_sinhvien,
        msv,
        tensinhvien,
        gioitinh,
        ngaysinh,
        sdt,
        email,
        nienkhoa,
        tenkhoa,
        status,
    } = req.body;
    if (![1, 2, 3].includes(gioitinh)) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid gender value. Use 1 (Nam), 2 (Nữ), or 3 (Khác).',
        });
    }
    if (![1, 2, 3].includes(status)) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid status value. Use 1 (Đang Học), 2 (Đình Chỉ), or 3 (Tốt Nghiệp).',
        });
    }
    try{
        const [checkKhoa] = await conn.promise().query('SELECT * FROM quanlykhoa WHERE tenkhoa = ?', [tenkhoa]);
            if (checkKhoa.length === 0) {
                return res.status(404).send({
                    status: 404,
                    Message:"Faculty not found",
                });
            }
        const[checkstudent] = await conn.promise().query('select * from quanlysinhvien where msv = ?',[msv]);
            if(checkstudent.length > 0)
                return res.status(404).send({
                    status: 404,
                    Message:"Student already exists",
            });    
        const[checkstudentPhone] = await conn.promise().query('select * from quanlysinhvien where sdt = ?',[sdt]);
        const[checkstudentEmail] = await conn.promise().query('select * from quanlysinhvien where email = ?',[email]);
            if(checkstudentEmail.length > 0 || checkstudentPhone.length > 0){
                return res.status(404).send({
                    status: 404,
                    Message:"Email  or Phone Number already exists",
                });
            }
        await conn.promise().query('insert into quanlysinhvien (id_sinhvien,msv,Tensinhvien,GioiTinh,NgaySinh,SDT,Email,nienkhoa,tenkhoa,status) value (?,?,?,?,?,?,?,?,?,?)', 
            [   id_sinhvien,
                msv,
                tensinhvien,
                gioitinh,
                ngaysinh,
                sdt,
                email,
                nienkhoa,
                tenkhoa,
                status,]);
            res.send({
                status: 200,
                Message:"Student inserted",
                data: null
            });
        }
    catch(err){
        console.log(err);
        return res.status(500).send({
            status: 500,
            Message:"Internal Server Error",
            error: err.message
        })
    }
})

//Update
app.post("/api/v1/student/update", async (req, res) => {
    const {
        id_sinhvien,
        msv,
        tensinhvien,
        gioitinh,
        ngaysinh,
        sdt,
        email,
        nienkhoa,
        tenkhoa,
        status,
    } = req.body;
    console.log(req.body);
    if (![1, 2, 3].includes(gioitinh)) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid gender value. Use 1 (Nam), 2 (Nữ), or 3 (Khác).',
        });
    }   
    if (![1, 2, 3].includes(status)) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid status value. Use 1 (Đang Học), 2 (Đình Chỉ), or 3 (Tốt Nghiệp).',
        });
    }
    try{
        const [checkKhoa] = await conn.promise().query('SELECT * FROM quanlykhoa WHERE tenkhoa = ?', [tenkhoa]);
            if (checkKhoa.length === 0) {
                return res.status(404).send({
                    status: 404,
                    Message:"Faculty not found",
                });
            }
        const[checkstudent] = await conn.promise().query('select * from quanlysinhvien where msv = ?',[msv]);
            if(checkstudent.length === 0)
                return res.status(404).send({
                    status: 404,
                    Message:"Student not found",
           })

        console.log(req.body);
        await conn.promise().query('update quanlysinhvien set tensinhvien =?, gioitinh=?,ngaysinh =?,sdt=?,email=?,nienkhoa=?,tenkhoa=?,status=? where msv = ?', 
            [   tensinhvien,
                gioitinh,
                ngaysinh,
                sdt,
                email,
                nienkhoa,
                tenkhoa,
                status,
                msv,]);
                res.send({
                    status: 200,
                    Message:"Student updated",
                    data: null
                });
    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            status: 500,
            Message:"Internal Server Error",
            error: err.message
        })
    }
    
})

//Status
app.post("/api/v1/student/update/status", async (req, res) => {
    const {
        msv,
        status,
    } = req.body;
    if (![1, 2, 3].includes(status)) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid status value. Use 1 (Đang Học), 2 (Đình Chỉ), or 3 (Tốt Nghiệp).',
        });
    }
    try{
        const[checkstudent] = await conn.promise().query('select * from quanlysinhvien where msv = ?',[msv]);
            if(checkstudent.length === 0)
                return res.status(404).send({
                    status: 404,
                    Message:"Student not found",
                })

        await conn.promise().query('update quanlysinhvien set status = ? where msv = ?' , 
            [status,msv]);
            res.send({
                status: 200,
                Message:"Student status updated",
                data: null
            });
    }
    catch(err){
        console.log(err);
        return res.status(500).send('Loi server')
    }
})

//Delete
app.delete("/api/v1/student/delete", async (req, res) => {
    const msv = req.body.msv;
    try{
        const[rows]= await conn.promise().query('select * from quanlysinhvien where msv = ?',msv);
            if(rows.length === 0)
                return res.status(404).send({
                    status: 404,
                    Message:"Student not found",
                });
        await conn.promise().query('delete from quanlysinhvien where msv=?', msv);
            res.send({
                status: 200,
                Message:"Student deleted",
                data: null
            });
    }catch(err){
        console.log(err);
        return res.status(500).send({
            status: 500,
            Message:"Internal Server Error",    
            error: err.message
        })
    }
})


//------------------------ Teacher Management----------------------

// GET
app.get("/api/v1/teacher/list",async(req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    const  searchCondition = search
        ? 'WHERE magiaovien = ? OR tengiaovien = ? OR email = ? OR sdt = ?'
        : '';
    const searchValue = search
        ? [search,search,search,search]
        : [];

    const [countResult] = await conn.promise().query(
            `SELECT COUNT(*) as total FROM quanlygiaovien ${searchCondition}`,
            searchValue
        );
    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

        const [rows] = await conn.promise().query(
            `SELECT * FROM quanlygiaovien ${searchCondition} LIMIT ? OFFSET ?`,[...searchValue, limit, offset]);
        if(rows.length === 0)
                        return res.status(404).send({
                            status: 404,
                            Message:"Teacher not found",
                        })
        const result = rows.map(row => ({   
            id: row.id_giaovien,
            teacherCode: row.magiaovien,
            teacherName: row.tengiaovien,
            facultyName: row.tenkhoa,
            gender: row.gioitinh === 1 ? 'Nam' : row.gioitinh === 2 ? 'Nữ' : 'Khác',
            email: row.email,
            phoneNumber: row.sdt,
            dateOfBirth: row.ngaysinh,
            Status: row.status === 1 ? 'Đang Công Tác' : row.status === 2 ? 'Chuyển Trường' : 'Nghỉ Hưu'
        }))
        res.json({
            status: 200,
            Message: "Teachers found",
            data: result,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalRecords: totalRecords,
                limit: limit
            }
        });
    })




// Insert
app.post("/api/v1/teacher/insert", async (req, res) => {
    const {
        id_giaovien,
        magiaovien,
        tengiaovien,
        tenkhoa,
        gioitinh,
        email,
        sdt,
        ngaysinh,
        status,
    } = req.body;
    if (![1, 2, 3].includes(gioitinh)) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid gender value. Use 1 (Nam), 2 (Nữ), or 3 (Khác).',
        });
    }
    if (![1, 2, 3].includes(status)) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid status value. Use 1 (Đang Học), 2 (Đình Chỉ), or 3 (Tốt Nghiệp).',
        });
    }
    try{
        const [checkKhoa] = await conn.promise().query('SELECT * FROM quanlykhoa WHERE tenkhoa = ?', [tenkhoa]);
            if (checkKhoa.length === 0) {
                return res.status(404).send({
                    status: 404,
                    Message:"Faculty not found",
                });
            }
        const [checkgiaovien] = await conn.promise().query('select * from quanlygiaovien where magiaovien = ?',magiaovien);
            if(checkgiaovien.length > 0)
                return res.status(404).send({
                    status: 404,
                    Message:"Teacher already exists",
                });
        //check teacher tenkhoa exists , check teacher phone and email exists
        const[checkteacherPhone] = await conn.promise().query('select * from quanlygiaovien where sdt = ?',[sdt]);
        const[checkteacherEmail] = await conn.promise().query('select * from quanlygiaovien where email = ?',[email]);
            if(checkteacherEmail.length > 0 || checkteacherPhone.length > 0){
                return res.status(404).send({
                    status: 404,
                    Message:"Email  or Phone Number already exists",
                });
            }
        await conn.promise().query('insert into quanlygiaovien (id_giaovien,magiaovien,tengiaovien,tenkhoa,gioitinh,email,sdt,ngaysinh,status) value (?,?,?,?,?,?,?,?,?)', 
            [   id_giaovien,
                magiaovien,
                tengiaovien,
                tenkhoa,
                gioitinh,
                email,
                sdt,
                ngaysinh,
                status]);
            res.send({
                status: 200,
                Message:"Teacher inserted",
                data: null
            });
    }catch(err){
        console.log(err);
        return res.status(500).send({
            status: 500,
            Message:"Internal Server Error",
            error: err.message
        })
    }
})

//Update
app.post("/api/v1/teacher/update", async (req, res) => {
    const {
        id_giaovien,
        magiaovien,
        tengiaovien,
        tenkhoa,
        gioitinh,
        email,
        sdt,
        ngaysinh,
        status,
    } = req.body;
    if (![1, 2, 3].includes(gioitinh)) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid gender value. Use 1 (Nam), 2 (Nữ), or 3 (Khác).',
        });
    }
    if (![1, 2, 3].includes(status)) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid status value. Use 1 (Đang Học), 2 (Đình Chỉ), or 3 (Tốt Nghiệp).',
        });
    }
    try{
        const [checkKhoa] = await conn.promise().query('SELECT * FROM quanlykhoa WHERE tenkhoa = ?', [tenkhoa]);
            if (checkKhoa.length === 0) {
                return res.status(404).send({
                    status: 404,
                    Message:"Faculty not found",
                });
            }
        const [checkgiaovien] = await conn.promise().query('select * from quanlygiaovien where magiaovien = ?',magiaovien);
            if(checkgiaovien.length === 0)
                return res.status(404).send({
                    status: 404,
                    Message:"Teacher not found",
                });
        await conn.promise().query('update quanlygiaovien set tengiaovien =?, tenkhoa=?,gioitinh =?,email=?,sdt=?,ngaysinh=?,status=? where magiaovien = ?', 
            [   
                
                tengiaovien,
                tenkhoa,
                gioitinh,
                email,
                sdt,
                ngaysinh,
                status,
                magiaovien,]);
            res.send({
                status: 200,
                Message:"Teacher updated",
                data: null
            });

    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            status: 500,
            Message:"Internal Server Error",
            error: err.message
        })
    }
})

//Delete
app.delete("/api/v1/teacher/delete", async (req, res) => {
    const magiaovien = req.body.magiaovien;
    try{
        const [checkgiaovien] = await conn.promise().query('select * from quanlygiaovien where magiaovien = ?',magiaovien);
            if(checkgiaovien.length === 0)
                return res.status(404).send({
                    status: 404,
                    Message:"Teacher not found",
                });
        await conn.promise().query('delete from quanlygiaovien where magiaovien=?', magiaovien);
            res.send({
                status: 200,
                Message:"Teacher deleted",
                data: null
            });
    }catch(err){
        console.log(err);
        return res.status(500).send({
            status: 500,
            Message:"Internal Server Error",
            error: err.message
        })
    }
})
//Status
app.post("/api/v1/teacher/update/status", async (req, res) => {
    const {
        magiaovien,
        status,
    } = req.body;
    if (![1, 2, 3].includes(status)) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid status value. Use 1 (Đang Học), 2 (Đình Chỉ), or 3 (Tốt Nghiệp).',
        });
    }
    try{
        const[checkteacher] = await conn.promise().query('select * from quanlygiaovien where magiaovien = ?',[magiaovien]);
            if(checkteacher.length === 0)
                return res.status(404).send({
                    status: 404,
                    Message:"Teacher not found",
                })

        await conn.promise().query('update quanlygiaovien set status = ? where magiaovien = ?' , 
            [status,magiaovien]);
            res.send({
                status: 200,
                Message:"Teacher status updated",
                data: null
            });
    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            status: 500,
            Message:"Internal Server Error",
            error: err.message
        })
    }
})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });