import { google } from "googleapis";
import { env } from "./env.js";

const oauth2Client = new google.auth.OAuth2(
  env.googleClientId,
  env.googleClientSecret,
  env.googleRedirectUri
);

oauth2Client.setCredentials({
    refresh_token: env.googleRefreshToken
  });


export default oauth2Client;