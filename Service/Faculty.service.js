// import axios from "axios";
// const index = async(req,res)=>{
//     try {
//       // Gọi API để lấy dữ liệu
//       const response = await axios.get("http://localhost:3000/api/v1/Faculty");
//         console.log(response);
//       // Lấy dữ liệu từ API
//       const data = response.data || []; // Đảm bảo `data` luôn là một mảng
      
//       // Kiểm tra dữ liệu từ API
//       console.log("Dữ liệu từ API:", data);
  
//       // Render giao diện Pug và truyền dữ liệu
//       res.render("client/pages/home/index.pug", { 
//         data: data ,
//         PageTitle : "Quản Lý Khoa"
//       });
//     } catch (error) {
//       console.error("Lỗi khi gọi API:", error.message);
//       res.status(500).send("Không thể lấy dữ liệu từ API");
//     }
//   };
//   const create = async(req,res)=>{
//     console.log("Đã nhận request tạo mới");
//     try{
//     const response = await axios.post('http://localhost:3000/api/quanlykhoa/them', { 
//         makhoa: 'IT707702',
//         tenkhoa: 'CNTT47' });
//     console.log(response);
//     res.render("hello");
//     }
//     catch(error) {
//       console.error("Lỗi khi thêm:", error);
//     };
//   }

//  export default {index,create};    