import pool from "../config/mysql.js";

const createBooking = async (req, res) => {
  try {
    const { slot_id } = req.body;
    const userId = req.user?.account_id;

    console.log(userId)

    if (!slot_id || !userId) {
      return res.status(400).json({ message: "Missing slot_id or user_id" });
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


    const [learnerResult] = await pool.query(
      "SELECT id FROM learner WHERE account_id = ?",
      [userId]
    );

    if (!learnerResult.length) {
      return res.status(404).json({ message: "Learner not found" });
    }
    const learner_id = learnerResult[0].id;

    // Insert the booking into the booking table
    const [result] = await pool.query(
      "INSERT INTO bookings (professional_id, learner_id, slot_id ) VALUES (?, ?, ?)",
      [professional_id , learner_id, slot_id ]
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

// const getBooking = async (req, res) => {
//   try {
//     const accountId = req.user?.account_id;
//     const role = req.user?.role;

//     if (!accountId || !role) {
//       return res.status(401).json({
//         message: "Unauthorized"
//       });
//     }

//     let bookings;

//     if (role === "learner") {

//       // Get learner's actual profile ID
//       const [learnerRows] = await pool.query(
//         "SELECT id FROM learner WHERE account_id = ?",
//         [accountId]
//       );

//       console.log(learnerRows)

//       if (!learnerRows.length) {
//         return res.status(404).json({
//           message: "Learner profile not found"
//         });
//       }

//       const learnerId = learnerRows[0].id;

//       // Get learner bookings
//       [bookings] = await pool.query(
//         `SELECT
//             b.id AS booking_id,
//             b.slot_id,
//             b.learner_id,
//             b.professional_id,
//             b.booking_status,
//             b.created_at,

//             p.name AS professional_name,
//             p.profile_photo AS professional_profile_photo,
//             p.bio AS professional_bio,

//             l.name AS learner_name,
//             l.profile_photo AS learner_profile_photo,
//             l.education_background AS learner_education,
//             l.bio AS learner_bio,

//             s.date,
//             s.start_time

//          FROM bookings b

//          JOIN professionals p
//            ON b.professional_id = p.id

//          JOIN learner l
//            ON b.learner_id = l.id

//          JOIN slots s
//            ON b.slot_id = s.slot_id

//          WHERE b.learner_id = ?

//          ORDER BY s.date ASC, s.start_time ASC`,
//         [learnerId]
//       );

//     } else if (role === "professional") {

//       // Get professional's actual profile ID
//       const [professionalRows] = await pool.query(
//         "SELECT id FROM professionals WHERE account_id = ?",
//         [accountId]
//       );

//       if (!professionalRows.length) {
//         return res.status(404).json({
//           message: "Professional profile not found"
//         });
//       }

//       const professionalId = professionalRows[0].id;

//       // Get professional bookings
//       [bookings] = await pool.query(
//         `SELECT
//             b.id AS booking_id,
//             b.slot_id,
//             b.learner_id,
//             b.professional_id,
//             b.booking_status,
//             b.created_at,

//             p.name AS professional_name,
//             p.profile_photo AS professional_profile_photo,
//             p.bio AS professional_bio,

//             l.name AS learner_name,
//             l.profile_photo AS learner_profile_photo,
//             l.education_background AS learner_education,
//             l.bio AS learner_bio,

//             s.date,
//             s.start_time

//          FROM bookings b

//          JOIN professionals p
//            ON b.professional_id = p.id

//          JOIN learner l
//            ON b.learner_id = l.id

//          JOIN slots s
//            ON b.slot_id = s.slot_id

//          WHERE b.professional_id = ?

//          ORDER BY s.date ASC, s.start_time ASC`,
//         [professionalId]
//       );

//     } else {
//       return res.status(403).json({
//         message: "Invalid role"
//       });
//     }

//     return res.status(200).json({
//       bookings
//     });

//   } catch (err) {
//     console.error("getBooking error:", err);

//     return res.status(500).json({
//       message: "Server error during fetching bookings"
//     });
//   }
// };

const getLearnerBookings = async (req, res) => {
  try {
    const accountId = req.user?.account_id;
    
    console.log("Account" , accountId)

    const [learnerRows] = await pool.query(
      "SELECT id FROM learner WHERE account_id = ?",
      [accountId]
    );

    // console.log(learnerRows)

    if (!learnerRows.length) {
      return res.status(404).json({
        message: "Learner not found"
      });
    }

    const learnerId = learnerRows[0].id;

    const [testBookings] = await pool.query(
      "SELECT * FROM bookings WHERE learner_id = ?",
      [learnerId]
    );

    console.log("TEST BOOKINGS:", testBookings);

    console.log("learnerID", learnerId)

    const [bookings] = await pool.query(
      `SELECT
          b.id AS booking_id,
          b.slot_id,
          b.booking_status,
          b.created_at,

          p.id AS professional_id,
          p.name AS professional_name,
          p.profile_photo AS professional_profile_photo,
          p.bio AS professional_bio,

          s.date,
          s.start_time

       FROM bookings b

       JOIN professionals p
         ON b.professional_id = p.id

       JOIN slots s
         ON b.slot_id = s.slot_id

       WHERE b.learner_id = ?

       ORDER BY s.date ASC, s.start_time ASC`,
      [learnerId]
    );

    return res.status(200).json({ bookings });

  } catch (err) {
    console.error("getBooking error:", err);

    return res.status(500).json({
      message: "Server error during fetching bookings"
    });
  }
};
const getProfessionalBookings = async (req, res) => {
  try {
    const accountId = req.user?.account_id;

    const [professionalRows] = await pool.query(
      "SELECT id FROM professionals WHERE account_id = ?",
      [accountId]
    );

    if (!professionalRows.length) {
      return res.status(404).json({
        message: "Professional not found"
      });
    }

    const professionalId = professionalRows[0].id;

    const [bookings] = await pool.query(
      `SELECT
          b.id AS booking_id,
          b.slot_id,
          b.booking_status,
          b.created_at,

          l.id AS learner_id,
          l.name AS learner_name,
          l.profile_photo AS learner_profile_photo,
          l.education_background AS learner_education,
          l.bio AS learner_bio,

          s.date,
          s.start_time

       FROM bookings b

       JOIN learner l
         ON b.learner_id = l.id

       JOIN slots s
         ON b.slot_id = s.slot_id

       WHERE b.professional_id = ?

       ORDER BY s.date ASC, s.start_time ASC`,
      [professionalId]
    );

    return res.status(200).json({ bookings });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Error fetching professional bookings"
    });
  }
};
export { createBooking, getLearnerBookings, getProfessionalBookings };

