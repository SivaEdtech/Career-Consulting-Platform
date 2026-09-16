import db from "../config/mysql.js"

async function connectDB() {
    try {
        await db.query("SELECT 1");
        console.log("MySQL connected");
    } catch (err) {
        console.error("DB connection failed ", err);
    }
}

export default connectDB;


