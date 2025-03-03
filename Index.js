import { createServer } from "node:http";
import express, { query } from 'express'; 
import cors from 'cors';
import 'dotenv/config'
import route from "./routes/client/index.route.js";
import { stat } from "node:fs";
import faculty from "./Controller/client/faculty.controller.js";
import {connection,conn} from "./Config/database.js";
import student from "./Controller/client/Student.controller.js";
import teacher from "./Controller/client/teacher.controller.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dot } from "node:test/reporters";
import RegisterController from "./Controller/client/Register.controller.js";

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.set("views","./views");
app.set("view engine","pug");

route(app);
faculty(app);
student(app);
connection();
teacher(app);
RegisterController(app);

const verifytoken = (req,res,next) => {
    const bearerHeader = req.headers['authorization'];
    const token = bearerHeader && bearerHeader.split(' ')[1];   
    const decode = jwt.verify(token,'secretkey');

    req.user = decode;
    next();
}


app.post("/api/v1/login",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    try{
        const [user] = await conn.promise().query('select * from users where username = ?',[username]);
        console.log(user);  
        if(user.length === 0){
            return res.send({
                status: 400,
                Message: "No user with that username",
                data: null
            });
        }
        const checkpassword = bcrypt.compareSync(password,user[0].password);
        if(!checkpassword){
            return res.send({
                status: 400,
                Message: "Password incorrect",
                data: null
            });
        }
        const accessToken = jwt.sign({user: user[0].username},'secretkey',{expiresIn: '30m'});
        if (!accessToken) {
            return res
                .status(401)
                .send('Đăng nhập không thành công, vui lòng thử lại.');
        }
        let refreshToken = jwt.sign({user: user[0].username},'secretkey',{expiresIn: '7d'});
            
        if(!user.refreshToken) {
            await conn.promise().query('update users set refreshToken = ? where username = ?',[refreshToken,username]);
        }else{
            refreshToken = user.refreshToken;
        }
        return res.send({
            status: 200,
            Message: "Login success",
            data: accessToken
        });

    } catch (error) {
        return res.send({
            status: 500,
            Message: "Internal server error",
            error: error.message
        });
    }

});


// function init(passport) {
//     const authenticateUser = async (username,password,done) => {
//         const [checkuser] = await conn.promise().query('select * from users where username = ?',[username]);
//         if(checkuser.length === 0){
//             return done(null,false,{message: "No user with that username"});
//         }
//         try{
//             if(await bcrypt.compare(password,checkuser[0].password)){
//                 return done(null,checkuser[0]);
//             } else {
//                 return done(null,false,{message: "Password incorrect"});
//             }
//         } catch (e) {
//             return done(e);
//         }
//     }
//     passport.use(new LocalStrategy({usernameField: 'username'},authenticateUser));
//     passport.serializeUser((user,done) => done(null,user.id));
//     passport.deserializeUser((id,done) => {
//         return done(null,checkuser[0]);
//     });
// }



app.get("/api/v1/user",verifytoken,(req,res)=>{
    res.send({
        status: 200,
        Message: "Success",
        data: req.user
    });
});
app.get("/api/v1/refreshToken",(req,res)=>{
    const refreshToken = req.body;
    if(refreshToken === null) return res.send({
        status: 401,
        Message: "Unauthorized",
        data: null
    });
    const [user] = jwt.verify(refreshToken,'secretkey');
    const accessToken = jwt.sign({user: user.username},'secretkey',{expiresIn: '30p'});
    res.send({
        status: 200,
        Message: "Success",
        data: accessToken
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });