import oauth2Client from "../config/googleCalendar.js";
import { google } from "googleapis";
import {env} from "../config/env.js"
import pool from "../config/mysql.js"

// const googleCalendarAuth = (req, res) => {
//   const authUrl = oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     prompt: "consent",
//     scope: [
//       "https://www.googleapis.com/auth/calendar.events"
//     ]
//   });

//   res.redirect(authUrl);
// };

const googleCalendarCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({
        message: "Authorization code missing"
      });
    }

    const professionalId = Number(state);

    if (!professionalId) {
      return res.status(400).json({
        message: "Invalid professional ID"
      });
    }

    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      return res.status(400).json({
        message: "Google did not provide a refresh token"
      });
    }

    // console.log("GOOGLE TOKENS:", tokens);

    await pool.query(
      "UPDATE professionals SET refresh_token = ? WHERE id = ?",
      [tokens.refresh_token, professionalId]
    );


    return res.redirect(
      `${env.frontend_url}/dashboard`
    );

  } catch (error) {
    console.error("Google Calendar callback error:", error);

    res.status(500).json({
      message: "Google Calendar authorization failed"
    });
  }
};

const connectGoogleCalendar = async (req, res) => {
  try {
    const accountId = req.user?.account_id;

    if (!accountId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

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

    const state = String(professionalId);

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/calendar"
      ],
      state
    });

    return res.redirect(authUrl);

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Failed to connect Google Calendar"
    });
  }
};

// const testMeeting = async (req, res) => {
//   try {
//     const calendar = google.calendar({
//       version: "v3",
//       auth: oauth2Client,
//     });

//     const event = await calendar.events.insert({
//       calendarId: "primary",
//       conferenceDataVersion: 1,

//       requestBody: {
//         summary: "Test Career Consultation",

//         description: "Test Google Meet integration",

//         start: {
//           dateTime: "2026-09-20T17:00:00+05:30",
//           timeZone: "Asia/Kolkata",
//         },

//         end: {
//           dateTime: "2026-09-20T18:00:00+05:30",
//           timeZone: "Asia/Kolkata",
//         },

//         conferenceData: {
//           createRequest: {
//             requestId: `test-${Date.now()}`,

//             conferenceSolutionKey: {
//               type: "hangoutsMeet",
//             },
//           },
//         },
//       },
//     });

//     const meetingLink =
//       event.data.conferenceData?.entryPoints?.find(
//         (entry) => entry.entryPointType === "video"
//       )?.uri;

//     if (!meetingLink) {
//       return res.status(500).json({
//         message: "Meeting link was not generated",
//       });
//     }

//     return res.status(201).json({
//       message: "Test meeting created successfully",
//       meetingLink,
//       eventId: event.data.id,
//     });

//   } catch (err) {
//     console.error("Test meeting error:", err);

//     return res.status(500).json({
//       message: "Failed to create Google Meet",
//       error: err.message,
//     });
//   }
// };
export {
  googleCalendarCallback,
  connectGoogleCalendar
};