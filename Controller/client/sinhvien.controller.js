const index = (req,res)=>{
    res.render("client/pages/SinhVien/sinhvien.pug",{
        PageTitle : "Sinh Vien"
    });
}
 export default {index};