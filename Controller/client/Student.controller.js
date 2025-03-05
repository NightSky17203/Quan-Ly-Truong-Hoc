import { connection, conn } from '../../Config/database.js';
import { studentModel } from '../../Model/Student.model.js';


    const listStudent = async(req,res)=>{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;
    
        // const  searchCondition = search
        //     ? 'WHERE msv = ? OR tensinhvien = ? OR sdt = ? OR email = ?'
        //     : '';
    
        const searchValue = search 
        ? [search]
        : [];
    
        const [countResult] = await studentModel.CountStudent(searchValue);
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);
    
        const [rows] = await studentModel.GetallStudent(searchValue,limit,offset);   
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
                dateOfBirth: row.ngaysinh,
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
        }
    
    
    //Insert
    const insertStudent = async (req, res) => {
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
            const [checkKhoa] = await studentModel.checkFaculty(tenkhoa);
                if (checkKhoa.length === 0) {
                    return res.status(404).send({
                        status: 404,
                        Message:"Faculty not found",
                    });
                }
            const[checkstudent] = await studentModel.checkStudent(msv);
                if(checkstudent.length > 0)
                    return res.status(404).send({
                        status: 404,
                        Message:"Student already exists",
                });    
            const[checkstudentPhone] = await studentModel.CheckStudentPhone(sdt);
            const[checkstudentEmail] = await studentModel.CheckStudentEmail(email);
                if(checkstudentEmail.length > 0 || checkstudentPhone.length > 0){
                    return res.status(404).send({
                        status: 404,
                        Message:"Email  or Phone Number already exists",
                    });
                }
            await studentModel.InsertStudent(id_sinhvien,msv,tensinhvien,gioitinh,ngaysinh,sdt,email,nienkhoa,tenkhoa,status);
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
    }
    
    //Update
    const updateStudent = async (req, res) => {
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
            const [checkKhoa] = await studentModel.checkFaculty(tenkhoa);
                if (checkKhoa.length === 0) {
                    return res.status(404).send({
                        status: 404,
                        Message:"Faculty not found",
                    });
                }
            const[checkstudent] = await studentModel.checkStudent(msv);
                if(checkstudent.length === 0)
                    return res.status(404).send({
                        status: 404,
                        Message:"Student not found",
               })
    
            console.log(req.body);
            await studentModel.updateStudent(tensinhvien,gioitinh,ngaysinh,sdt,email,nienkhoa,tenkhoa,status,msv);
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
        
    }
    
    //Status
    const updateStudentStatus = async (req, res) => {
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
            const[checkstudent] = await studentModel.checkStudent(msv);
                if(checkstudent.length === 0)
                    return res.status(404).send({
                        status: 404,
                        Message:"Student not found",
                    })
    
            await studentModel.updateStudentStatus(msv,status);
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
    }
    
    //Delete
    const deleteStudent = async (req, res) => {
        const msv = req.body.msv;
        try{
            const[rows]= await studentModel.checkStudent(msv);
                if(rows.length === 0)
                    return res.status(404).send({
                        status: 404,
                        Message:"Student not found",
                    });
            await studentModel.deleteStudent(msv);
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
    }
 export default {listStudent, insertStudent, updateStudent, updateStudentStatus, deleteStudent,};
