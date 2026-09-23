import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import {createSlot, getSlots , deleteSlot , getSlotsByProfessional} from "../controllers/slot.controller.js";

const router = express.Router();


router.get("/slots/me", authUser, getSlots); //slots that a professional can see on its own dashboard
router.post("/slots", authUser, createSlot);

router.delete("/slots/:slotId", authUser, deleteSlot);

router.get("/professionals/:professionalId/slots", authUser, getSlotsByProfessional);

export default router;