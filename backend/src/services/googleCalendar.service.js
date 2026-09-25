import { google } from "googleapis";
import oauth2Client from "../config/googleCalendar.js";

export const createGoogleMeet = async (date, startTime) => {
  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });

  const datePart = new Date(date).toISOString().split("T")[0];

  const startDateTime = new Date(
    `${datePart}T${startTime}`
  );

  const endDateTime = new Date(
    startDateTime.getTime() + 60 * 60 * 1000
  );

  console.log("Start:", startDateTime);
  console.log("End:", endDateTime);

  const event = await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,

    requestBody: {
      summary: "Career Consultation",

      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },

      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },

      conferenceData: {
        createRequest: {
          requestId: `booking-${Date.now()}`,

          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    },
  });

  const meetingLink =
    event.data.conferenceData?.entryPoints?.find(
      (entry) => entry.entryPointType === "video"
    )?.uri;

  if (!meetingLink) {
    throw new Error("Google Meet link was not generated");
  }

  return {
    meetingLink,
    eventId: event.data.id,
  };
};