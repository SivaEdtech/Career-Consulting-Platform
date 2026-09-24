import express from "express";
import { 
    createBooking, 

} from "../controllers/book.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route to create a new booking (by a learner for a professional)
router.post("/bookings", authUser, createBooking);



export default router;