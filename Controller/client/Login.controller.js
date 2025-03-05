import { connection, conn } from '../../Config/database.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {LoginModel}  from '../../Model/Login.model.js';
import dotenv from "dotenv";
dotenv.config();

const Login = async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    try{
        const [user] = await LoginModel.User(username);
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
        const accessToken = jwt.sign({user: user[0].username},process.env.JWT_SECRET,{expiresIn: '30m'});
        if (!accessToken) {
            return res
                .status(401)
                .send('Đăng nhập không thành công, vui lòng thử lại.');
        }
        let refreshToken = jwt.sign({user: user[0].username},process.env.JWT_SECRET,{expiresIn: '7d'});
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None', secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });
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

};

const refreshToken = async(req,res)=>{
    const refreshtoken = req.cookies.jwt;
    console.log(refreshtoken);
    if(refreshtoken == null) return res.send({
        status: 401,
        Message: "Unauthorized",
        data: null
    });
    try{
    const user = jwt.verify(refreshtoken,process.env.JWT_SECRET);
    const accessToken = jwt.sign({user: user.username},process.env.JWT_SECRET,{expiresIn: '30m'});
    res.send({
        status: 200,
        Message: "Success",
        data: accessToken
    });
} catch (error) {
    res.send({
        status: 500,
        Message: "Internal server error",
        error: error.message
    });
}
}
export default {Login,refreshToken};