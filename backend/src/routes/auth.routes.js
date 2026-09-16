import { Router } from "express";
import passport from "../config/passport.js";
import { register, login, googleCallback} from "../controllers/auth.controller.js"
import {registerUserValidator, loginUserValidator} from "../middlewares/validator.middleware.js"

const router = Router();

// Normal authentication
router.post("/auth/register",registerUserValidator, register);
router.post("/auth/login",loginUserValidator, login);

// Google authentication
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  googleCallback
);

export default router;
