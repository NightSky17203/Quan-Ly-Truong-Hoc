import axios from "axios";
import {register} from "../public/JS/Script.js";
  async function create(form) {
    try{
    // var form = JSON.stringify(Object.fromEntries(new FormData(document.getElementById("register-form"))));
    const create = await axios.post("http://localhost:3000/api/v1/register",form);
    console.log(create);
    }catch(error){
      console.error("Lỗi khi gọi API:", error.message);
      res.status(500).send("Không thể lấy dữ liệu từ API");
    }
  }
export default {create};
export {create};