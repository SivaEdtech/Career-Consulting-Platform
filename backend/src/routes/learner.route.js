import express from "express";
import { getLearner, updateLearner } from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/learner/me", authUser, getLearner);      //view profile
router.post("/learner/update", authUser, updateLearner); //update profile

export default router;