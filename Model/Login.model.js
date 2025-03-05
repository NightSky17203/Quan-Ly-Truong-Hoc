import { connection, conn } from '../Config/database.js';

export const LoginModel = {
    async User(username){
        const sql = `select * from users where username = ?`;
        return await conn.promise().query(sql,[username]);  
    },
}
export default {LoginModel};