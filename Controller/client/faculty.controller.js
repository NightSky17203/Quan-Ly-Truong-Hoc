import { connection, conn } from '../../Config/database.js';
import { facultyModel } from '../../Model/Faculty.model.js';
//Insert
    const insert = async(req,res)=>{
    const {
        id_khoa,
        makhoa,
        tenkhoa
        } = req.body
        if (!makhoa || !tenkhoa) {
            return res.status(400).send({
                status: 400,
                Message: "Thiếu thông tin"
            });
        }
        if(typeof makhoa !== 'string' || typeof tenkhoa !== 'string') {
            return res.status(400).send({
                status: 400,
                Message: "Kiểu dữ liệu không hợp lệ"
            });
        }
        if(makhoa.trim() === '' || tenkhoa.trim() === '') {
            return res.status(400).send({
                status: 400,
                Message: "Dữ liệu không được để trống"
            });
        }
        try{
            const [checkkhoa] = await facultyModel.checkFaculty(makhoa);
                if(checkkhoa.length > 0)
                    return res.status(404).send({
                        status: 404,
                        Message:"Faculties aleady exists",
                    })
            await facultyModel.InsertFaculty(id_khoa,makhoa,tenkhoa);
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
    }
    
    // GET Faculty list with pagination and search
    const listFaculty = async(req,res)=>{ 
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const offset = (page - 1) * limit;

    
            const searchValue = search 
            ? [`%${search}%`] : [];

            
            const [countResult] = await facultyModel.CountFaculty(searchValue);  
            

            const totalRecords = countResult[0].total;  
            const totalPages = Math.ceil(totalRecords / limit); 
    
            const [rows] = await facultyModel.GetallFaculty(searchValue,limit, offset);
    
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
    }
    
    //Delete
    const deleteFaculty = async(req,res)=>{
        const makhoa = req.body.makhoa;
        if(!makhoa){
            return res.status(400).send({
                status: 400,
                Message: "Thiếu thông tin"
            });
        }
        if(typeof makhoa !== 'string'){
            return res.status(400).send({
                status: 400,
                Message: "Kiểu dữ liệu không hợp lệ"
            });
        }
        if(makhoa.trim() === ''){
            return res.status(400).send({
                status: 400,
                Message: "Dữ liệu không được để trống"
            });
        }
        try{
            const [checkkhoa] = await facultyModel.checkFaculty(makhoa);
                if(checkkhoa.length === 0)
                    return res.status(404).send({
                        status: 404,
                        Message:"Faculties not found",
                    }
                );
            const tenkhoa = req.body.tenkhoa = checkkhoa[0].tenkhoa;
                const [result] = await facultyModel.checkQuery(tenkhoa);
                    console.log(result);
                    const teacherCount = result[0].teacherCount;
                    const studentCount = result[0].studentCount;
                    if(teacherCount > 0 || studentCount > 0){
                        return res.status(404).send({
                            status: 400,
                            Message:"Faculties already in use",
                        })
                    }
            await facultyModel.deleteFaculty(makhoa);
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
    }
    
    //Update
   const updateFaculty = async(req, res)=>{
        // res.setHeader("Content-Type: application/json");
    
        const {id_khoa, makhoa,tenkhoa} = req.body;
        console.log(`id: ${id_khoa}, makhoa: ${makhoa}, tenkhoa: ${tenkhoa}`)
        if(!makhoa || !tenkhoa){
            return res.status(400).send({
                status: 400,
                Message: "Thiếu thông tin"
            });
        }   
        if(typeof makhoa !== 'string' || typeof tenkhoa !== 'string'){
            return res.status(400).send({
                status: 400,
                Message: "Kiểu dữ liệu không hợp lệ"
            });
        }
        if(makhoa.trim() === '' || tenkhoa.trim() === ''){
            return res.status(400).send({
                status: 400,
                Message: "Dữ liệu không được để trống"
            });
        }
        try{
            const [checkkhoa] = await facultyModel.checkFaculty(makhoa);   
                if(checkkhoa.length === 0)
                    return res.status(404).send({
                        status: 404,
                        Message:"Faculties not found",
                    });
            await facultyModel.updateFaculty(tenkhoa,makhoa);
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
    }


export default {insert, listFaculty, deleteFaculty, updateFaculty,};

