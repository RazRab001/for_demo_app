import passport from "passport"
import googlePassport from "passport-google-oauth20"
import dotenv from "dotenv"
import { userModel } from "../models/user.model";
dotenv.config();

const GoogleStrategy = googlePassport.Strategy;

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: "/auth/google/redirect",
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await userModel.findOne({ googleId: profile.id });
  
        // If user doesn't exist creates a new user. (similar to sign up)
        if (!user) {
          const newUser = await userModel.create({
            googleId: profile.id,
            login: profile.displayName,
            email: profile.emails?.[0].value,
          });
          if (newUser) {
            console.log('New user created')
            done(null, newUser);
          }
        } else {
            console.log("User with this google id already exist")
          done(null, user);
        }
      }
    )
)