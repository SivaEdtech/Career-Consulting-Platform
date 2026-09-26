import express from "express";
import { getProfessional, updateProfessional, getAllProfessionals, getProfessionalById, startMeeting, testWherebyMeeting} from "../controllers/proffesional.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/whereby/test-meeting", testWherebyMeeting);

router.get("/professional/me", authUser, getProfessional);   //view profile
router.post("/professional/update", authUser, updateProfessional); //update profile


router.get("/professionals", authUser, getAllProfessionals);
router.get("/professionals/:professionalId", authUser, getProfessionalById);

router.post("/bookings/:bookingId/start-meeting", authUser, startMeeting) //professional start meeting




export default router;