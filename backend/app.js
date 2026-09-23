import express from "express";
import authRoutes from "./src/routes/auth.routes.js";
import proffesionalRoutes from "./src/routes/proffesional.route.js"
import learnerRoutes from "./src/routes/learner.route.js"
import slotRoutes from "./src/routes/slot.route.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import {env} from "./src/config/env.js"

const app = express();


app.use(cors({
    origin: env.frontend_url ||  "http://localhost:5173/", 
    credentials: true
  }));

app.use(express.json());
app.use(cookieParser())


app.use("/api",authRoutes)
app.use("/api",learnerRoutes)
app.use("/api", proffesionalRoutes)
app.use("/api",slotRoutes)


export default app;