import axios from "axios";
import { env } from "../config/env.js";

export const createMeetingRoom = async (endDate) => {
    try {
        const response = await axios.post(
            "https://api.whereby.dev/v1/meetings",
            {
                endDate,
                fields: ["hostRoomUrl"]
            },
            {
                headers: {
                    Authorization: `Bearer ${env.whereby}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return {
            meetingId: response.data.meetingId,
            meetingLink: response.data.roomUrl,
            hostMeetingLink: response.data.hostRoomUrl
        };

    } catch (error) {
        console.error(
            "Whereby room creation error:",
            error.response?.data || error.message
        );

        throw new Error("Failed to create Whereby meeting");
    }
};