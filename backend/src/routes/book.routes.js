import express from "express";
import { createBooking, getLearnerBookings, getProfessionalBookings} from "../controllers/book.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route to create a new booking (by a learner for a professional)
router.post("/bookings", authUser, createBooking);

// Route to get all bookings 
router.get("/learner/bookings", authUser, getLearnerBookings);
router.get("/professional/bookings", authUser, getProfessionalBookings);





export default router;