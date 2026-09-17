import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import pool from "../config/mysql.js";

// Normal registration
const register = async (req, res) => {
  try {
    const { email, password, displayName, profile_photo, education_background, bio, interests } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({
        message: "Email, password, and displayName are required",
      });
    }

    // Check if learner already exists
    const [existingLearnerRows] = await pool.query(
      "SELECT * FROM learner WHERE email = ?",
      [email]
    );
    if (existingLearnerRows.length > 0) {
      return res.status(409).json({
        message: "Learner already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new learner
    const [result] = await pool.query(
      `INSERT INTO learner (email, password, name, role, profile_photo, education_background, bio, interests) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        email,
        hashedPassword,
        displayName,
        "learner",
        profile_photo || null,
        education_background || null,
        bio || null,
        interests ? JSON.stringify(interests) : null
      ]
    );

    // Retrieve the newly created learner
    const learnerId = result.insertId;
    const [rows] = await pool.query("SELECT * FROM learner WHERE id = ?", [learnerId]);
    const learner = rows[0];

    // Generate JWT token for user after registration
    const token = jwt.sign(
      {
        id: learner.id.toString(),
        displayName: learner.name,
        email: learner.email,
        role: learner.role,
      },
      env.jwt_secret,
      {
        expiresIn: "7d",
      }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: env.nodeEnv === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    return res.status(201).json({
      message: "Learner registered successfully",
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      message: "Server error during registration",
    });
  }
};

// Normal email/password login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const [rows] = await pool.query("SELECT * FROM learner WHERE email = ?", [email]);
    const learner = rows[0];

    if (!learner) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (!learner.password) {
      return res.status(400).json({
        message: "This account uses Google login. Please continue with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, learner.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: learner.id.toString(),
        displayName: learner.name,
        email: learner.email,
        role: learner.role,
      },
      env.jwt_secret,
      {
        expiresIn: "7d",
      }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: env.nodeEnv === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    return res.json({
      message: "learner logged in successfully"
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Server error during login",
    });
  }
};

// Google OAuth callback
const googleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Google authentication failed",
      });
    }

    const googleUser = req.user;
    console.log("Google user:", googleUser);

    const email = googleUser.emails?.[0]?.value;

    if (!email) {
      return res.status(400).json({
        message: "Google account email not available",
      });
    }

    // Find learner by email
    const [rows] = await pool.query("SELECT * FROM learner WHERE email = ?", [email]);
    let learner = rows[0];

    // If learner doesn't exist, create one
    if (!learner) {
      const [result] = await pool.query(
        `INSERT INTO learner (email, name, password, profile_photo, role) VALUES (?, ?, ?, ?, ?)`,
        [
          email,
          googleUser.displayName || null,
          "",
          googleUser.photos?.[0]?.value || null,
          "learner",
        ]
      );
      const learnerId = result.insertId;
      const [createdRows] = await pool.query("SELECT * FROM learner WHERE id = ?", [learnerId]);
      learner = createdRows[0];
    }

    // Create YOUR application's JWT
    const token = jwt.sign(
      {
        id: learner.id.toString(),
        displayName: learner.name,
        email: learner.email,
        role: learner.role,
      },
      env.jwt_secret,
      {
        expiresIn: "7d",
      }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: env.nodeEnv === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    return res.status(200).json({
      message: "Logged in Successfully"
    });
  } catch (err) {
    console.error("Google authentication error:", err);

    return res.status(500).json({
      message: "Server error during Google authentication",
    });
  }
};

const logout = (req, res) => {
  try {

    const token = req.cookies.token

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error during logout" });
  }
};


const getLearner = (req, res) => {
  try {
    // Assume JWT-based authentication middleware attaches user info to req.user
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

  
    const { id, displayName, email, role } = user;
    return res.status(200).json({
      id,
      displayName,
      email,
      role
    });
  } catch (err) {
    console.error("GetMe error:", err);
    return res.status(500).json({ message: "Server error during getLearner" });
  }
};


const updateUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const allowedUpdates = {
      name: req.body.displayName,
      profile_photo: req.body.profile_photo,
      education_background: req.body.education_background,
      bio: req.body.bio,
      interests: req.body.interests ? JSON.stringify(req.body.interests) : undefined
    };


    if (req.body.displayName && !req.body.profile_photo) {
      const initials = encodeURIComponent(req.body.displayName);
      allowedUpdates.profile_photo = `https://api.dicebear.com/7.x/initials/svg?seed=${initials}`;
    }

    
    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    if (Object.keys(allowedUpdates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update." });
    }

    // Prepare SET clause and values
    const setClause = Object.keys(allowedUpdates).map(field => `${field} = ?`).join(", ");
    const values = Object.values(allowedUpdates);
    values.push(userId);

    // Do the update
    const [updateResult] = await pool.query(
      `UPDATE learner SET ${setClause} WHERE id = ?`,
      values
    );

    if (!updateResult.affectedRows) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch updated user
    const [rows] = await pool.query(
      "SELECT id, email, name as displayName, profile_photo, education_background, bio, interests, role FROM learner WHERE id = ?",
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found after update." });
    }

    return res.status(200).json({
      message: "User updated successfully",
      updatedUser: rows[0]
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error while updating user info",
    });
  }
};




export { register, login, googleCallback, logout , getLearner, updateUser};
