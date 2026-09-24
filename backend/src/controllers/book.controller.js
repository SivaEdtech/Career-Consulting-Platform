import pool from "../config/mysql.js";

const createBooking = async (req, res) => {
  try {
    const { slot_id } = req.body;
    const learner_id = req.user?.account_id;

    console.log(learner_id)

    if (!slot_id || !learner_id) {
      return res.status(400).json({ message: "Missing slot_id or learner_id" });
    }

    // Check if the slot is already booked
    const [statusRows] = await pool.query(
      "SELECT status FROM slots WHERE slot_id = ?",
      [slot_id]
    );
    if (!statusRows.length) {
      return res.status(404).json({ message: "Slot not found" });
    }
    if (statusRows[0].status === "Booked") {
      return res.status(409).json({ message: "Slot is already booked" });
    }

    // Find the professional ID associated with the slot
    const [slotRows] = await pool.query(
      "SELECT professional_id FROM slots WHERE slot_id = ?",
      [slot_id]
    );
    if (!slotRows.length) {
      return res.status(404).json({ message: "Slot not found" });
    }

    const professional_id = slotRows[0].professional_id;

    // Insert the booking into the booking table
    const [result] = await pool.query(
      "INSERT INTO bookings (professional_id, learner_id, slot_id ) VALUES (?, ?, ?)",
      [professional_id, learner_id, slot_id ]
    );

    await pool.query(
      "UPDATE slots SET status = 'Booked' WHERE slot_id = ?",
      [slot_id]
    );

    return res.status(201).json({
      message: "Booking created successfully",
      bookingId: result.insertId,
      professional_id,
      learner_id,
      slot_id
    });

  } catch (err) {
    console.error("createBooking error:", err);
    return res.status(500).json({ message: "Server error during booking" });
  }
};

export{createBooking}