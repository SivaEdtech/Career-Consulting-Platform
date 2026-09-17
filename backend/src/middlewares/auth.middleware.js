import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import pool from "../config/mysql.js";


const authUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "User unauthenticated",
      });
    }

    
    let decoded;
    try {
      decoded = jwt.verify(token, env.jwt_secret);
    } catch (err) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

   
    const [rows] = await pool.query(
      "SELECT id, name as displayName, email, role FROM learner WHERE id = ?",
      [decoded.id]
    );
    const user = rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({
      message: "Error while verifying authentication",
      error: err.message,
    });
  }
};

export { authUser };