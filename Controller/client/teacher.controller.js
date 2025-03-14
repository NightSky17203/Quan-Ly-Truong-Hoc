import { connection, conn } from '../../Config/database.js';
import { teacherModel } from '../../Model/Teacher.Model.js';

    // GET
    const listTeacher = async(req,res)=>{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        const searchValue = search  
            ? [search]
            : [];
        
        const [countResult] = await teacherModel.CountTeacher(searchValue);
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

            const [rows] = await teacherModel.GetallTeacher(searchValue,limit,offset);
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
        }




    // Insert
    const insertTeacher = async (req, res) => {
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
        if (!magiaovien || !tengiaovien || !tenkhoa || !email || !sdt || !ngaysinh || !status) {
            return res.status(400).json({
                status: 400,
                message: 'Thiếu thông tin',
            });
        }
        if(typeof magiaovien !== 'string' || typeof tengiaovien !== 'string' || typeof tenkhoa !== 'string' || typeof email !== 'string' || typeof sdt !== 'string'){
            return res.status(400).json({   
                status: 400,
                message: 'Kiểu dữ liệu không hợp lệ',
            });
        }
        if (magiaovien.trim() === '' || tengiaovien.trim() === '' || tenkhoa.trim() === '' || email.trim() === '' || sdt.trim() === '' || ngaysinh.trim() === '' || status.trim() === '') {
            return res.status(400).json({
                status: 400,
                message: 'Dữ liệu không được để trống',
            });
        }
        try{
            const [checkKhoa] = await teacherModel.checkFaculty(tenkhoa);
                if (checkKhoa.length === 0) {
                    return res.status(404).send({
                        status: 404,
                        Message:"Faculty not found",
                    });
                }
            const [checkgiaovien] = await teacherModel.checkTeacher(magiaovien);
                if(checkgiaovien.length > 0)
                    return res.status(404).send({
                        status: 404,
                        Message:"Teacher already exists",
                    });
            //check teacher tenkhoa exists , check teacher phone and email exists
            const[checkteacherPhone] = await teacherModel.CheckTeacherPhone(sdt);
            const[checkteacherEmail] = await teacherModel.CheckTeacherEmail(email);
                if(checkteacherEmail.length > 0 || checkteacherPhone.length > 0){
                    return res.status(404).send({
                        status: 404,
                        Message:"Email  or Phone Number already exists",
                    });
                }
            await teacherModel.InsertTeacher(id_giaovien,magiaovien,tengiaovien,tenkhoa,gioitinh,email,sdt,ngaysinh,status);
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
    }

    //Update
    const updateTeacher = async (req, res) => {
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
        if(!magiaovien || !tengiaovien || !tenkhoa || !email || !sdt || !ngaysinh || !status){
            return res.status(400).send({
                status: 400,
                Message: "Thiếu thông tin"
            });
        }
        if(typeof magiaovien !== 'string' || typeof tengiaovien !== 'string' || typeof tenkhoa !== 'string' || typeof email !== 'string' || typeof sdt !== 'string'){
            return res.status(400).send({
                status: 400,
                Message: "Kiểu dữ liệu không hợp lệ"
            });
        }
        if(magiaovien.trim() === '' || tengiaovien.trim() === '' || tenkhoa.trim() === '' || email.trim() === '' || sdt.trim() === '' || ngaysinh.trim() === '' || status.trim() === ''){
            return res.status(400).send({
                status: 400,
                Message: "Dữ liệu không được để trống"
            });
        }
        try{
            const [checkKhoa] = await teacherModel.checkFaculty(tenkhoa);
                if (checkKhoa.length === 0) {
                    return res.status(404).send({
                        status: 404,
                        Message:"Faculty not found",
                    });
                }
            const [checkgiaovien] = await teacherModel.checkTeacher(magiaovien);
                if(checkgiaovien.length === 0)
                    return res.status(404).send({
                        status: 404,
                        Message:"Teacher not found",
                    });
            await teacherModel.updateTeacher(tengiaovien,tenkhoa,gioitinh,email,sdt,ngaysinh,status,magiaovien);
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
    }

    //Delete
    const deleteTeacher = async (req, res) => {
        const magiaovien = req.body.magiaovien;
        if(!magiaovien){
            return res.status(400).send({
                status: 400,
                Message: "Thiếu thông tin"
            });
        }
        if(typeof magiaovien !== 'string'){
            return res.status(400).send({
                status: 400,
                Message: "Kiểu dữ liệu không hợp lệ"
            });
        }
        if(magiaovien.trim() === ''){
            return res.status(400).send({
                status: 400,
                Message: "Dữ liệu không được để trống"
            });
        }
        try{
            const [checkgiaovien] = await teacherModel.checkTeacher(magiaovien);
                if(checkgiaovien.length === 0)
                    return res.status(404).send({
                        status: 404,
                        Message:"Teacher not found",
                    });
            await teacherModel.deleteTeacher(magiaovien);
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
    }
    //Status
    const updateTeacherStatus = async (req, res) => {
        const {
            magiaovien,
            status,
        } = req.body;
        if(!magiaovien || !status){
            return res.status(400).send({
                status: 400,
                Message: "Thiếu thông tin"
            });
        }
        if(typeof magiaovien !== 'string'){
            return res.status(400).send({
                status: 400,
                Message: "Kiểu dữ liệu không hợp lệ"
            });
        }
        if(magiaovien.trim() === '' || status.trim() === ''){
            return res.status(400).send({
                status: 400,
                Message: "Dữ liệu không được để trống"
            });
        }
        if (![1, 2, 3].includes(status)) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid status value. Use 1 (Đang Học), 2 (Đình Chỉ), or 3 (Tốt Nghiệp).',
            });
        }
        try{
            const[checkteacher] = await teacherModel.checkTeacher(magiaovien);
                if(checkteacher.length === 0)
                    return res.status(404).send({
                        status: 404,
                        Message:"Teacher not found",
                    })

            await teacherModel.updateTeacherStatus(magiaovien,status);
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
    }

export default {listTeacher, insertTeacher, updateTeacher, deleteTeacher, updateTeacherStatus,};
