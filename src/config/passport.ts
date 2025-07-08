import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/userModel';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists by googleId
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Check if user exists by email
          const existingUser = await User.findOne({ email: profile.emails?.[0].value });

          if (existingUser) {
            // Update existing user's googleId
            existingUser.googleId = profile.id;
            await existingUser.save();
            user = existingUser;
          } else {
            const generatedUsername =
              profile.displayName ||
              profile.emails?.[0].value.split('@')[0] ||
              `user_${Math.floor(Math.random() * 100000)}`; // final fallback

            user = await User.create({
              googleId: profile.id,
              email: profile.emails?.[0].value,
              username: generatedUsername,
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error, false);
      }
    }
  )
);
// Serialize user to session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err as Error, null);
  }
});
