import {env} from "./src/config/env.js"
import app from "./app.js";
import connectDB from "./src/database/connection.js";

const PORT = env.port || 5001;


const startServer = async () => {
    try {
        await connectDB()

        console.log("Database connection successful");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${env.port}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

startServer();