import express, { query } from 'express'; 
import cors from 'cors';
import 'dotenv/config'
import route from "./routes/client/index.route.js";
import {connection,conn} from "./Config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT;
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.set("views","./views");
app.set("view engine","pug");
app.set("view engine","ejs");


route(app);

connection();




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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });