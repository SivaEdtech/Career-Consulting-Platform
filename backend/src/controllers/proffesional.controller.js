import pool from "../config/mysql.js";
// import { createGoogleMeet } from "../services/googleCalendar.service.js";


const getProfessional = async (req, res) => {
    try {
        const account_id = req.user?.account_id;
        console.log(account_id)

        if (!account_id) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        const [rows] = await pool.query(
            `SELECT name, profile_photo, bio, languages, role, number_of_consultations, consulting_price, 
            CASE
              WHEN refresh_token IS NOT NULL THEN true
              ELSE false
            END AS googleCalendarConnected
            FROM professionals WHERE account_id = ?`,
            [account_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Professional user not found." });
        }

        return res.status(200).json({
            message: "Professional user fetched successfully",
            professional: rows[0]
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error while fetching professional user info",
            error: err.message,
        });
    }
};

const updateProfessional = async (req, res) => {
    try {
        const account_id = req.user?.account_id;
        if (!account_id) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        const allowedUpdates = {
            name: req.body.name,
            profile_photo: req.body.profile_photo,
            bio: req.body.bio,
            languages: req.body.languages ? JSON.stringify(req.body.languages) : undefined,
            consulting_price: req.body.consulting_price,
        };

        // Generate a default profile photo if not supplied but name is updated
        if (req.body.name && !req.body.profile_photo) {
            const initials = encodeURIComponent(req.body.name);
            allowedUpdates.profile_photo = `https://api.dicebear.com/7.x/initials/svg?seed=${initials}`;
        }

        // Remove undefined fields
        Object.keys(allowedUpdates).forEach(
            (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
        );

        if (Object.keys(allowedUpdates).length === 0) {
            return res.status(400).json({ message: "No valid fields to update." });
        }

        // Prepare SET clause and values for parameterized query
        const setClause = Object.keys(allowedUpdates)
            .map((field) => `${field} = ?`)
            .join(", ");
        const values = Object.values(allowedUpdates);
        values.push(account_id);

        // Attempt the update in the professional table
        const [updateResult] = await pool.query(
            `UPDATE professionals SET ${setClause} WHERE account_id = ?`,
            values
        );

        if (!updateResult.affectedRows) {
            return res.status(404).json({ message: "Professional not found" });
        }

        // Fetch updated professional user
        const [rows] = await pool.query(
            `SELECT * FROM professionals WHERE account_id = ?`,
            [account_id]
        );

        if (!rows.length) {
            return res.status(404).json({ message: "Professional user not found after update." });
        }

        return res.status(200).json({
            message: "Professional user updated successfully",
            updatedProfessional: rows[0]
        });

    } catch (err) {
        return res.status(500).json({
            message: "Error while updating professional user info",
            error: err.message,
        });
    }
};


const getAllProfessionals = async (req, res) => {
    try {
        // Get all professionals from the table
        const [rows] = await pool.query(
            `SELECT * FROM professionals`
        );

        const professionals = rows.map((professional) => {
            if (professional.languages && typeof professional.languages === "string") {
                try { professional.languages = JSON.parse(professional.languages); }
                catch { professional.languages = []; }
            }
            return professional;
        });

        return res.status(200).json({
            message: "Fetched all professionals successfully",
            professionals
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error while fetching professionals",
            error: err.message,
        });
    }
};

const getProfessionalById = async (req, res) => {
    try {
        const professionalId = req.params.professionalId;
        if (!professionalId) {
            return res.status(400).json({
                message: "Professional ID is required"
            });
        }

        const [rows] = await pool.query(
            `SELECT * FROM professionals WHERE id = ?`,
            [professionalId]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                message: "Professional not found"
            });
        }

        const professional = rows[0];
        if (professional.languages && typeof professional.languages === "string") {
            try { professional.languages = JSON.parse(professional.languages); }
            catch { professional.languages = []; }
        }

        return res.status(200).json({
            message: "Fetched professional successfully",
            professional
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error while fetching professional",
            error: err.message,
        });
    }
};

// const startMeeting = async (req, res) => {
//     try {
//         const accountId = req.user?.account_id;

//         const role = req.user?.role;
//         const bookingId = req.params.bookingId;
// console.log("-------------------------------------")
//         console.log("accountId", accountId)
//         console.log("bbokingId", bookingId)
//         console.log("role", role)

//         if (!accountId || role !== "professional") {
//             return res.status(403).json({
//                 message: "Only professionals can start a meeting"
//             });
//         }

//         if (!bookingId) {
//             return res.status(400).json({
//                 message: "Booking ID is required"
//             });
//         }

//         // Find logged-in professional
//         const [professionalRows] = await pool.query(
//             `SELECT id, refresh_token
//              FROM professionals
//              WHERE account_id = ?`,
//             [accountId]
//         );

//         if (!professionalRows.length) {
//             return res.status(404).json({
//                 message: "Professional not found"
//             });
//         }

//         const professionalId = professionalRows[0].id;
//         const refreshToken = professionalRows[0].refresh_token;

//         if (!refreshToken) {
//             return res.status(400).json({
//                 message: "Google Calendar is not connected"
//             });
//         }

//         // Find the booking belonging to this professional
//         const [bookingRows] = await pool.query(
//             `SELECT
//                 b.id,
//                 b.slot_id,
//                 s.date,
//                 s.start_time
//              FROM bookings b
//              JOIN slots s
//                 ON b.slot_id = s.slot_id
//              WHERE b.id = ?
//                AND b.professional_id = ?`,
//             [bookingId, professionalId]
//         );

//         if (!bookingRows.length) {
//             return res.status(404).json({
//                 message: "Booking not found"
//             });
//         }

//         const booking = bookingRows[0];

//         // If meeting already exists, don't create another one
//         const [existingRows] = await pool.query(
//             `SELECT meet_link
//              FROM bookings
//              WHERE id = ?`,
//             [bookingId]
//         );

//         if (existingRows[0].meeting_link) {
//             return res.status(200).json({
//                 message: "Meeting already exists",
//                 meetingLink: existingRows[0].meeting_link
//             });
//         }

//         // Create Google Meet
//         const meetingLink = await createGoogleMeet(
//             refreshToken,
//             booking.date,
//             booking.start_time
//         );

//         if (!meetingLink) {
//             return res.status(500).json({
//                 message: "Failed to create Google Meet"
//             });
//         }

//         // Save Meet link in booking
//         await pool.query(
//             `UPDATE bookings
//              SET meet_link = ?
//              WHERE id = ?`,
//             [meetingLink, bookingId]
//         );

//         return res.status(200).json({
//             message: "Meeting started successfully",
//             meetingLink
//         });

//     } catch (err) {
//         console.error("startMeeting error:", err);

//         return res.status(500).json({
//             message: "Failed to start meeting"
//         });
//     }
// };

import { createMeetingRoom } from "../services/whereby.service.js";

const testWherebyMeeting = async (req, res) => {
    try {
        const endDate = new Date(
            Date.now() + 60 * 60 * 1000
        ).toISOString();

        const meeting = await createMeetingRoom(endDate);

        return res.status(201).json({
            message: "Whereby meeting created successfully",
            meeting,
        });

    } catch (error) {
        console.error("testWherebyMeeting error:", error);

        return res.status(500).json({
            message: error.message,
        });
    }
};


const startMeeting = async (req, res) => {
    try {
        const accountId = req.user?.account_id;
        const role = req.user?.role;
        const bookingId = req.params.bookingId;

        // Only professional can start the meeting
        if (!accountId || role !== "professional") {
            return res.status(403).json({
                message: "Only professionals can start a meeting"
            });
        }

        if (!bookingId) {
            return res.status(400).json({
                message: "Booking ID is required"
            });
        }

        // Find professional
        const [professionalRows] = await pool.query(
            `SELECT id
             FROM professionals
             WHERE account_id = ?`,
            [accountId]
        );

        if (!professionalRows.length) {
            return res.status(404).json({
                message: "Professional not found"
            });
        }

        const professionalId = professionalRows[0].id;

        // Find booking belonging to this professional
        const [bookingRows] = await pool.query(
            `SELECT id, meet_link, host_meeting_link, meeting_started
             FROM bookings
             WHERE id = ?
             AND professional_id = ?`,
            [bookingId, professionalId]
        );

        if (!bookingRows.length) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const booking = bookingRows[0];

        // Don't create another room if meeting already exists
        if (booking.meeting_started && booking.meet_link) {
            return res.status(200).json({
                message: "Meeting already started",
                meetingLink: booking.meet_link,
                hostMeetingLink: booking.host_meeting_link
            });
        }

        // Create Whereby meeting
        const endDate = new Date(
            Date.now() + 60 * 60 * 1000
        ).toISOString();

        const meeting = await createMeetingRoom(endDate);

        // Save meeting details
        await pool.query(
            `UPDATE bookings
             SET meet_link = ?,
                 host_meeting_link = ?,
                 meeting_started = TRUE
             WHERE id = ?`,
            [
                meeting.meetingLink,
                meeting.hostMeetingLink,
                bookingId
            ]
        );

        return res.status(200).json({
            message: "Meeting started successfully",
            hostMeetingLink: meeting.hostMeetingLink
        });

    } catch (error) {
        console.error("startMeeting error:", error);

        return res.status(500).json({
            message: "Failed to start meeting"
        });
    }
};

export { getProfessional, updateProfessional, getAllProfessionals, getProfessionalById, startMeeting, testWherebyMeeting }
