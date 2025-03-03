import { connection, conn } from '../../Config/database.js';
import { facultyModel } from '../../Model/Faculty.model.js';
export default (app)=>{
    //Insert
    app.post("/api/v1/faculty/insert", async(req,res)=>{
        const {
            id_khoa,
            makhoa,
            tenkhoa
        } = req.body
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
    })
    
    // GET Faculty list with pagination and search
    app.get("/api/v1/faculty/list", async(req,res)=>{ 
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const offset = (page - 1) * limit;
    
            const searchValue = search ? [`%${search}%`] : [];
    
            const [countResult] = await facultyModel.CountFaculty(searchValue,searchValue);  

            const totalRecords = countResult[0].total;
            const totalPages = Math.ceil(totalRecords / limit); 
    
            const [rows] = await facultyModel.GetallFaculty(...searchValue, limit, offset);
    
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
            const [checkkhoa] = await facultyModel.checkFaculty(makhoa);
                if(checkkhoa.length === 0)
                    return res.status(404).send({
                        status: 404,
                        Message:"Faculties not found",
                    }
                );
            const tenkhoa = req.body.tenkhoa = checkkhoa[0].tenkhoa;
                    // const checkQuery = `
                    // SELECT 
                    //     (SELECT COUNT(*) FROM quanlygiaovien WHERE tenkhoa = ?) AS teacherCount,
                    //     (SELECT COUNT(*) FROM quanlysinhvien WHERE tenkhoa = ?) AS studentCount
                    // `;
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
    })
    
    //Update
    app.post("/api/v1/faculty/update",async(req, res)=>{
        // res.setHeader("Content-Type: application/json");
    
        const {id_khoa, makhoa,tenkhoa} = req.body;
        console.log(`id: ${id_khoa}, makhoa: ${makhoa}, tenkhoa: ${tenkhoa}`)
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
    })
}

