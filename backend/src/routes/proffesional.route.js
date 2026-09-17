import express from "express";
import { getProfessional, updateProfessional, getAllProfessionals, getProfessionalById } from "../controllers/proffesional.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", authUser, getProfessional);
router.post("/update", authUser, updateProfessional);


router.get("/proffesionals", authUser, getAllProfessionals);
router.get("/proffesionals/:proffesionalId", authUser, getProfessionalById);

export default router;