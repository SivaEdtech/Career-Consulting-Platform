import pool from "../config/mysql.js";

// Controller to create a new slot
const createSlot = async (req, res) => {
    try {
        const account_id = req.user?.account_id;

        console.log(req.user);
        const { date, time } = req.body;

        if (!account_id) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        if (!date || !time) {
            return res.status(400).json({ message: "Missing required fields: date and time" });
        }

        // Fetch the professional's id using the account_id
        const [proRows] = await pool.query(
            `SELECT id FROM professionals WHERE account_id = ?`,
            [account_id]
        );

        if (!proRows.length) {
            return res.status(404).json({ message: "Professional user not found." });
        }

        const professional_id = proRows[0].id;

        // Check if the slot already exists for this professional, date, and time
            // const [slotRows] = await pool.query(
            //     `SELECT id FROM slots WHERE professional_id = ? AND date = ? AND start_time = ?`,
            //     [professional_id, date, time]
            // );

            // if (slotRows.length > 0) {
            //     return res.status(409).json({
            //         message: "A slot for this date and time already exists. Duplicate slots are not allowed."
            //     });
            // }

        // Insert the new slot into the slots table
        const [result] = await pool.query(
            `INSERT INTO slots (professional_id, date, start_time) VALUES (?, ?, ?)`,
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