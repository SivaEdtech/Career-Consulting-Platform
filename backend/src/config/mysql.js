import mysql from "mysql2/promise";
import { env } from "./env.js";

const pool = mysql.createPool({
    host: env.db_host,
    user: env.db_user,
    password: env.db_password,
    database: "consultation"
});

export default pool;