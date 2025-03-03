import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

    const conn = mysql.createPool({
        host: process.env.Host,
        user: process.env.User,
        password: process.env.Password,
        database: process.env.Database,
        authPlugins: {
            default: 'mysql_native_password'
        }
    });

    const connection = () => {
        conn.getConnection((err) => {
            if (err) {
                console.log('Error connecting to database:', err);
                return;
            }
        });
    }

    export { connection, conn };

    export default { connection, conn };