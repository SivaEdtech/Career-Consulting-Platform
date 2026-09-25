import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5001,
  db_host : process.env.DB_HOST,
  db_user : process.env.DB_USER,
  db_password : process.env.DB_PASSWORD,
  googleClientId : process.env.GOOGLE_CLIENT_ID,
  googleClientSecret : process.env.GOOGLE_CLIENT_SECRET,
  jwt_secret : process.env.JWT_SECRET,
  frontend_url : process.env.FRONTEND_URL,
  googleRedirectUri:process.env.GOOGLE_REDIRECT_URI,
  googleRefreshToken:process.env.GOOGLE_REFRESH_TOKEN
};