import { Router } from "express";
import passport from "../config/passport.js";
import { register, login, googleCallback} from "../controllers/auth.controller.js"

const router = Router();

// Normal authentication
router.post("/auth/register", register);
router.post("/auth/login", login);

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
