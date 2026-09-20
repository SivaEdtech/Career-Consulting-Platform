import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import {
  createSlot
  
} from "../controllers/slot.controller.js";

const router = express.Router();

// // Get all slots for the logged-in professional
// router.get("/slots/me", authUser, getMySlots);

// Create a new slot for the professional
router.post("/slots", authUser, createSlot);

// // Update a slot by slot ID (only for the slot owner)
// router.put("/slots/:slotId", authUser, updateSlot);

// // Delete a slot by slot ID (only for the slot owner)
// router.delete("/slots/:slotId", authUser, deleteSlot);

// // (Optional) Get all slots of specific professional by professionalId (for learners to view)
// router.get("/slots/professional/:professionalId", authUser, getSlotsByProfessional);

export default router;