import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { env } from "./env.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.googleClientId,
      clientSecret: env.googleClientSecret,
      callbackURL: "/api/google/callback",
    },

    (accessToken, refreshToken, profile, done) => {
      console.log("Google Profile:");
      console.log(profile);

      console.log("Google ID:", profile.id);
      console.log("Name:", profile.displayName);
      console.log("Email:", profile.emails?.[0]?.value);

      // Pass Google profile to Passport
      return done(null, profile);
    }
  )
);

export default passport;
