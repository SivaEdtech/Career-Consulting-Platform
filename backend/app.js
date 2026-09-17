import express from "express";
import authRoutes from "./src/routes/auth.routes.js";
import proffesionalRoutes from "./src/routes/proffesional.route.js"
import cookieParser from "cookie-parser";


const app = express();

app.use(express.json());
app.use(cookieParser())


app.use("/api",authRoutes)
app.use("/api", proffesionalRoutes)


export default app;