import { Router } from "express";
import passport from "../config/passport.js";
import { register, login, googleCallback, logout, getLearner, updateUser} from "../controllers/auth.controller.js"
import {registerUserValidator, loginUserValidator} from "../middlewares/validator.middleware.js"
import {authUser} from "../middlewares/auth.middleware.js"

const router = Router();


router.post("/auth/register",registerUserValidator, register);
router.post("/auth/login",loginUserValidator, login);
router.post("/logout", logout);
router.get("/me" , getLearner)
router.post("/update",authUser, updateUser)


// Google authentication
router.get("/google",passport.authenticate("google", {
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
