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
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const existingUser = await User.findOne({ email: profile.emails?.[0].value });
          if (existingUser) {
            existingUser.googleId = profile.id;
            await existingUser.save();
            user = existingUser;
          } else {
            user = await User.create({
              googleId: profile.id,
              email: profile.emails?.[0].value,
              username: profile.displayName || 'GoogleUser',
            });
          }
        }

        // Instead of passing user object, pass a lightweight payload
        return done(null, {
          id: user._id,
          username: user.username,
          email: user.email,
        });

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
