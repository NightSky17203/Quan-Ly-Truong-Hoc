import { connection, conn } from '../../Config/database.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import {create} from '../../Service/Register.service.js';

export default (app)=>{
    app.post("/api/v1/register", async(req,res)=>{
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        try{
            const hashPassword = await bcrypt.hash(password,10);
            const [checkuser] = await conn.promise().query('select * from users where username = ?',[username]);
            if(checkuser.length > 0){
                return res.send({
                    status: 400,
                    Message: "Username is already exist",
                    data: null
                });
            }
            await conn.promise().query('insert into users(username,password,email) values(?,?,?)',[username,hashPassword,email]);
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
                data: null
            });
            res.redirect("/register");
        }
        }
        
    );
}
const createRegister = async (req, res) => {
    try {
      // Render view với dữ liệu từ service
      res.render("client/pages/Register/register.pug", { 
        PageTitle : "Đăng Ký"
      });
    } catch (error) {
      res.status(500).render('error', { message: error.message });
    }
  };
  export { createRegister };