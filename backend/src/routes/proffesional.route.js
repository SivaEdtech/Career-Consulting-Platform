import express from "express";
import { getProfessional, updateProfessional, getAllProfessionals, getProfessionalById } from "../controllers/proffesional.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/professional/me", authUser, getProfessional);   //view profile
router.post("/professional/update", authUser, updateProfessional); //update profile


router.get("/professionals", authUser, getAllProfessionals);
router.get("/professionals/:professionalId", authUser, getProfessionalById);

export default router;