import { connection, conn } from '../../Config/database.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {registerModel}  from '../../Model/Register.model.js';
// export default (app)=>{
    const Sign_up = async(req,res)=>{
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        if(!username || !password || !email){
            return res.send({
                status: 400,
                Message: "Thiếu thông tin",
                data: null
            });
        }
        if(typeof username !== 'string' || typeof password !== 'string' || typeof email !== 'string'){
            return res.send({
                status: 400,
                Message: "Kiểu dữ liệu không hợp lệ",
                data: null
            });
        }
        if(username.trim() === '' || password.trim() === '' || email.trim() === ''){
            return res.send({
                status: 400,
                Message: "Dữ liệu không được để trống",
                data: null
            });
        }
        console.log("received ",username,password,email);
        try{
            const hashPassword = await bcrypt.hash(password,10);
            const [checkuser] = await registerModel.checkUser(username);
            if(checkuser.length > 0){
                return res.send({
                    status: 400,
                    Message: "Username is already exist",
                    data: null
                });
            }
            await registerModel.InsertUser(username,hashPassword,email);
            res.send({
                status: 200,
                Message: "Register success",
                data: null
            });

            // res.redirect("/login");
        } catch (error) {
            res.status(500).send({
                status: 500,
                Message: "Internal server error",
                error: error.message
            });
            // res.redirect("/register");
        }
        }
export default {Sign_up,};
// }
