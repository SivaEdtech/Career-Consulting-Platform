// import oauth2Client from "../config/googleCalendar.js";
// import { google } from "googleapis";
// import {env} from "../config/env.js"
// import pool from "../config/mysql.js"

// // const googleCalendarAuth = (req, res) => {
// //   const authUrl = oauth2Client.generateAuthUrl({
// //     access_type: "offline",
// //     prompt: "consent",
// //     scope: [
// //       "https://www.googleapis.com/auth/calendar.events"
// //     ]
// //   });

// //   res.redirect(authUrl);
// // };

// const googleCalendarCallback = async (req, res) => {
//   try {
//     const { code, state } = req.query;

//     if (!code) {
//       return res.status(400).json({
//         message: "Authorization code missing"
//       });
//     }

//     const professionalId = Number(state);

//     if (!professionalId) {
//       return res.status(400).json({
//         message: "Invalid professional ID"
//       });
//     }

//     const { tokens } = await oauth2Client.getToken(code);

//     if (!tokens.refresh_token) {
//       return res.status(400).json({
//         message: "Google did not provide a refresh token"
//       });
//     }

//     // console.log("GOOGLE TOKENS:", tokens);

//     await pool.query(
//       "UPDATE professionals SET refresh_token = ? WHERE id = ?",
//       [tokens.refresh_token, professionalId]
//     );


//     return res.redirect(
//       `${env.frontend_url}/dashboard`
//     );

//   } catch (error) {
//     console.error("Google Calendar callback error:", error);

//     res.status(500).json({
//       message: "Google Calendar authorization failed"
//     });
//   }
// };

// const connectGoogleCalendar = async (req, res) => {
//   try {
//     const accountId = req.user?.account_id;

//     if (!accountId) {
//       return res.status(401).json({
//         message: "Unauthorized"
//       });
//     }

//     const [professionalRows] = await pool.query(
//       "SELECT id FROM professionals WHERE account_id = ?",
//       [accountId]
//     );

//     if (!professionalRows.length) {
//       return res.status(404).json({
//         message: "Professional not found"
//       });
//     }

//     const professionalId = professionalRows[0].id;

//     const state = String(professionalId);

//     const authUrl = oauth2Client.generateAuthUrl({
//       access_type: "offline",
//       prompt: "consent",
//       scope: [
//         "https://www.googleapis.com/auth/calendar"
//       ],
//       state
//     });

//     return res.redirect(authUrl);

//   } catch (err) {
//     console.error(err);

//     return res.status(500).json({
//       message: "Failed to connect Google Calendar"
//     });
//   }
// };


// export {
//   googleCalendarCallback,
//   connectGoogleCalendar
// };