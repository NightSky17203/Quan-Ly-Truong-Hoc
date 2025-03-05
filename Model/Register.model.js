import { connection, conn } from '../Config/database.js';

const registerModel = {
    async checkUser(username){
        const sql = `select * from users where username = ?`;
        return await conn.promise().query(sql,[username]);  
    },
    async InsertUser(username,hashPassword,email){
        const sql = `insert into users(username,password,email) values(?,?,?)`;
        return await conn.promise().query(sql,[username,hashPassword,email]);  
    }
}
export {registerModel};
export default {registerModel};