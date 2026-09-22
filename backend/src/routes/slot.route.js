import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import {createSlot, getSlots , deleteSlot} from "../controllers/slot.controller.js";

const router = express.Router();


router.get("/slots/me", authUser, getSlots);
router.post("/slots", authUser, createSlot);

// // Update a slot by slot ID (only for the slot owner)
// router.put("/slots/:slotId", authUser, updateSlot);

// Delete a slot by slot ID (only for the slot owner)
router.delete("/slots/:slotId", authUser, deleteSlot);

// // (Optional) Get all slots of specific professional by professionalId (for learners to view)
// router.get("/slots/professional/:professionalId", authUser, getSlotsByProfessional);

export default router;