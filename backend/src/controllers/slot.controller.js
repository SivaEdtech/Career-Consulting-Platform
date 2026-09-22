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

        const formattedDate = typeof date === 'string' ? date.split('T')[0] : date;

        // Insert the new slot into the slots table, status defaults to 1 (available)
        const [result] = await pool.query(
            `INSERT INTO slots (professional_id, date, start_time) VALUES (?, ?, ?)`,
            [professional_id, date, time]
        );

        // Retrieve the status of the newly created slot (in case status has a default value set)
        const [newSlotRows] = await pool.query(
            `SELECT status FROM slots WHERE slot_id = ?`,
            [result.insertId]
        );

        // Fallback to 1 if no status found (for some reason should not happen)
        const status = newSlotRows.length ? newSlotRows[0].status : 1;

        return res.status(201).json({
            message: "Slot created successfully",
            slot: {
                id: result.insertId,
                professional_id,
                date: formattedDate,
                time,
                status
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error while creating slot",
            error: err.message,
        });
    }
};



const getSlots = async (req, res) => {
    try {
        const account_id = req.user.account_id;

        if (!account_id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Get the professional's id using the account_id
        const [proRows] = await pool.query(
            `SELECT id FROM professionals WHERE account_id = ?`,
            [account_id]
        );

        if (!proRows.length) {
            return res.status(404).json({ message: "Professional user not found." });
        }   

        const professional_id = proRows[0].id;

        // Determine actual slot table column names for id
        // Replace 'id' by actual column name in your slots table, commonly 'slot_id'
        const [slots] = await pool.query(`SELECT * FROM slots where professional_id = ?`,[professional_id]);
   
        return res.status(200).json({
            slots
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error while fetching slots",
            error: err.message,
        });
    }
};

const deleteSlot = async (req, res) => {
    try {
        const account_id = req.user.account_id;
        const { slotId } = req.params;

        if (!account_id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Get the professional's id using the account_id
        const [proRows] = await pool.query(
            `SELECT id FROM professionals WHERE account_id = ?`,
            [account_id]
        );

        if (!proRows.length) {
            return res.status(404).json({ message: "Professional user not found." });
        }

        const professional_id = proRows[0].id;

        // // Check slot belongs to this professional
        // const [slotRows] = await pool.query(
        //     `SELECT * FROM slots WHERE id = ? AND professional_id = ?`,
        //     [slotId, professional_id]
        // );

        // if (!slotRows.length) {
        //     return res.status(404).json({ message: "Slot not found or you do not have permission to delete this slot." });
        // }

        // Delete the slot
        await pool.query(
            `DELETE FROM slots WHERE slot_id = ? AND professional_id = ?`,
            [slotId, professional_id]
        );

        return res.status(200).json({ message: "Slot deleted successfully" });
    } catch (err) {
        return res.status(500).json({
            message: "Error while deleting slot",
            error: err.message,
        });
    }
};




export {createSlot , getSlots, deleteSlot}