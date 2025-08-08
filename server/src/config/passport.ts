import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists with this providerId
    const existingUser = await prisma.user.findFirst({
      where: { 
        providerId: profile.id,
        provider: 'google'
      }
    });

    if (existingUser) {
      return done(null, existingUser as any);
    }

    // Check if user exists with this email (for account linking)
    const existingEmailUser = await prisma.user.findUnique({
      where: { email: profile.emails![0].value }
    });

    if (existingEmailUser) {
      // Link the Google account to existing user
      const updatedUser = await prisma.user.update({
        where: { email: profile.emails![0].value },
        data: {
          providerId: profile.id,
          provider: 'google',
          avatar: profile.photos![0].value
        }
      });
      return done(null, updatedUser as any);
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        providerId: profile.id,
        email: profile.emails![0].value,
        name: profile.displayName,
        avatar: profile.photos![0].value,
        provider: 'google',
        // No password needed for OAuth users
        password: null
      }
    });

    return done(null, newUser as any);
  } catch (error) {
    console.error('OAuth Error:', error);
    return done(error, undefined);
  }
}));

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id }
    });
    done(null, user as any);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
