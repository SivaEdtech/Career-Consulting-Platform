import pool from "../config/mysql.js";

// Controller to create a new slot
const createSlot = async (req, res) => {
    try {
        const professional_id = req.user?.account_id;
        const { date, time } = req.body;

        if (!professional_id) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        if (!date || !time) {
            return res.status(400).json({ message: "Missing required fields: date and time" });
        }

        // Optional: you may want to check for overlapping slots here

        // Insert the new slot into the slots table
        const [result] = await pool.query(
            `INSERT INTO slots (professional_id, date, time) VALUES (?, ?, ?)`,
            [professional_id, date, time]
        );

        return res.status(201).json({
            message: "Slot created successfully",
            slot: {
                id: result.insertId,
                professional_id,
                date,
                time
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error while creating slot",
            error: err.message,
        });
    }
};


export {createSlot}