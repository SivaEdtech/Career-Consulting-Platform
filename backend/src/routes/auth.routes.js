import { Router } from "express";
import passport from "../config/passport.js";
import { register, login, googleCallback, logout} from "../controllers/auth.controller.js"
import {registerUserValidator, loginUserValidator} from "../middlewares/validator.middleware.js"
import {authUser} from "../middlewares/auth.middleware.js"

const router = Router();


router.post("/auth/register",registerUserValidator, register);
router.post("/auth/login",loginUserValidator, login);
router.post("/logout", logout);


// Google authentication
router.get("/google", (req, res, next) => {
  const { role } = req.query;

  if (role !== "learner" && role !== "professional") {
    return res.status(400).json({
      message: "Invalid role",
    });
  }

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: role,
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  googleCallback
);

export default router;
