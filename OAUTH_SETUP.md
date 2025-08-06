# OAuth Setup Guide

## 🎉 Status: Development Environment Running Successfully!

Your OAuth-enabled application is now running with:
- **Frontend**: http://localhost:3000 ✅
- **Backend API**: http://localhost:5001 ✅  
- **MongoDB**: mongodb://admin:password123@localhost:27017 ✅

## 🔧 What's Already Implemented

### Backend (Express.js + TypeScript)
- ✅ **Passport.js OAuth Configuration** (`/server/src/config/passport.ts`)
  - Google OAuth 2.0 strategy setup
  - User serialization/deserialization 
  - JWT token generation
  
- ✅ **Authentication Routes** (`/server/src/routes/auth.ts`)
  - `/auth/login` - Traditional login
  - `/auth/register` - Traditional registration
  - `/auth/google` - OAuth initiation
  - `/auth/google/callback` - OAuth callback handler
  - JWT token response handling

- ✅ **JWT Middleware** (`/server/src/middleware/auth.ts`)
  - Token validation
  - Protected route handling

### Frontend (React + TypeScript + Vite)
- ✅ **OAuth UI Components**
  - `OAuthButton.tsx` - Reusable OAuth buttons
  - `OAuthIcons.tsx` - Provider-specific icons
  
- ✅ **Authentication Pages**
  - `LoginPage.tsx` - Login with OAuth + traditional form
  - `RegisterPage.tsx` - Registration with OAuth + traditional form
  - `AuthCallbackPage.tsx` - OAuth redirect handling

- ✅ **Auth Service** (`/client/src/services/authService.ts`)
  - API integration
  - Token management
  - OAuth flow handling

- ✅ **State Management** (`/client/src/store/authStore.ts`)
  - Zustand-based auth state
  - User session management

### Database (MongoDB + Prisma)
- ✅ **Prisma Schema** (`/server/prisma/schema.prisma`)
  - OAuth-compatible User model
  - Provider fields (`googleId`, `provider`)
  - Optional password for hybrid auth

## 🚀 Next Steps to Complete OAuth Setup

### 1. Get Google OAuth Credentials

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**

2. **Create or Select a Project**
   ```
   - Click "Select Project" → "New Project"
   - Name: "OAuth Assignment App" (or your preferred name)
   - Click "Create"
   ```

3. **Enable Google+ API**
   ```
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"
   ```

4. **Create OAuth 2.0 Credentials**
   ```
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Name: "OAuth Assignment Client"
   
   Authorized JavaScript origins:
   - http://localhost:3000
   - http://localhost:5001
   
   Authorized redirect URIs:
   - http://localhost:5001/auth/google/callback
   ```

5. **Copy Your Credentials**
   ```
   You'll get:
   - Client ID (looks like: 123456789-abcdefg.apps.googleusercontent.com)
   - Client Secret (looks like: ABC-DEF123_secret)
   ```

### 2. Update Environment Variables

Create `/server/.env` file:
```env
# Database
DATABASE_URL="mongodb://admin:password123@mongodb:27017/assignment_dev?authSource=admin"

# JWT
JWT_SECRET="your-super-secure-jwt-secret-key"

# Google OAuth (Replace with your actual credentials)
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"

# Server Config
PORT=5001
NODE_ENV=development

# Session (for Passport)
SESSION_SECRET="your-session-secret-here"
```

### 3. Update Prisma Database Integration

Currently using mock users. To enable real database:

**Edit `/server/src/config/passport.ts`:**
```typescript
// Uncomment these lines (around line 25-40):
/*
const existingUser = await prisma.user.findUnique({
  where: { googleId: profile.id }
});

if (existingUser) {
  return done(null, existingUser);
}

const newUser = await prisma.user.create({
  data: {
    googleId: profile.id,
    email: profile.emails![0].value,
    name: profile.displayName,
    avatar: profile.photos![0].value,
    provider: 'google'
  }
});

return done(null, newUser);
*/

// And comment out the mock user section
```

```bash
# In the server container
docker exec -it assignment-server-dev bash
npx prisma generate
npx prisma db push
```

### 5. Test OAuth Flow

1. **Visit** http://localhost:3000/login
2. **Click "Continue with Google"**
3. **Authenticate** with your Google account
4. **Verify** successful login and token storage

## 🔍 Debugging & Logs

```bash
# View all container logs
./dev.sh logs

# View specific container logs
docker logs assignment-client-dev
docker logs assignment-server-dev
docker logs assignment-mongodb-dev

# Access server container for debugging
docker exec -it assignment-server-dev bash

# Check database
docker exec -it assignment-mongodb-dev mongosh -u admin -p password123
```

## 📝 Testing Checklist

- [ ] Google OAuth credentials configured
- [ ] Environment variables set
- [ ] Prisma database connected
- [ ] Traditional login works
- [ ] Traditional registration works  
- [ ] Google OAuth login works
- [ ] JWT tokens generated correctly
- [ ] Protected routes work
- [ ] User data stored in MongoDB

## 🛠️ Development Commands

```bash
# Start development environment
./dev.sh start

# Stop development environment  
./dev.sh stop

# Restart with fresh build
./dev.sh restart

# View system status
./dev.sh status
```

## 🎯 Current Architecture

```
Frontend (React + Vite)     Backend (Express + Prisma)     Database (MongoDB)
┌─────────────────────┐    ┌────────────────────────┐    ┌──────────────────┐
│ LoginPage.tsx       │    │ /auth/google           │    │ Users Collection │
│ ├─ OAuthButton      │────│ ├─ Passport OAuth      │────│ ├─ googleId      │
│ ├─ Traditional Form │    │ ├─ JWT Generation      │    │ ├─ email         │
│ └─ Auth Service     │    │ └─ User Creation       │    │ ├─ name          │
│                     │    │                        │    │ └─ provider      │
│ AuthCallbackPage    │    │ /auth/google/callback  │    │                  │
│ └─ Token Handling   │────│ └─ Redirect Handler    │    │                  │
└─────────────────────┘    └────────────────────────┘    └──────────────────┘
        │                           │                            │
        └───────────────────────────┼────────────────────────────┘
                                    │
                              JWT Tokens
                         (Secure HTTP-only cookies)
```

## 🎉 You're Almost Done!

The hard work is complete! Just add your Google OAuth credentials and uncomment the Prisma database code, and you'll have a fully functional OAuth + traditional authentication system.

**Happy coding! 🚀**

### Start the Backend
```bash
cd server
npm run dev
```

### Start the Frontend
```bash
cd client
npm run dev
```

## 5. Testing OAuth Flow

1. Navigate to `http://localhost:3000/login`
2. Click "Continue with Google"
3. You'll be redirected to Google's OAuth consent screen
4. After authorization, you'll be redirected back to your app
5. The user should be logged in automatically

## 6. Database Integration (Optional)

The current implementation uses mock users. To integrate with a real database:

1. **With Prisma (recommended):**
   ```typescript
   // In server/src/config/passport.ts
   const existingUser = await prisma.user.findUnique({
     where: { email: profile.emails?.[0]?.value }
   });
   
   if (existingUser) {
     return done(null, existingUser);
   }
   
   const newUser = await prisma.user.create({
     data: {
       email: profile.emails?.[0]?.value || '',
       name: profile.displayName || '',
       avatar: profile.photos?.[0]?.value || '',
       provider: 'google',
       providerId: profile.id,
       isActive: true,
       role: 'USER'
     }
   });
   ```

2. **Update the auth routes** in `server/src/routes/auth.ts` to use real database operations instead of mock data.

## 7. Adding More OAuth Providers

To add GitHub, Facebook, or other providers:

1. **Install the strategy:**
   ```bash
   npm install passport-github2 @types/passport-github2
   ```

2. **Configure the strategy** in `server/src/config/passport.ts`

3. **Add routes** in `server/src/routes/auth.ts`

4. **Update the frontend** with new OAuth buttons

## 8. Production Deployment

1. **Update redirect URIs** in Google Console to include your production domain
2. **Set environment variables** on your production server
3. **Use HTTPS** - OAuth requires secure connections in production
4. **Configure CORS** properly for your production domain

## 9. Security Considerations

1. **Never expose secrets** in client-side code
2. **Use HTTPS** in production
3. **Validate tokens** on protected routes
4. **Implement rate limiting** for auth endpoints
5. **Store JWT securely** (httpOnly cookies recommended for production)

## 10. Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch"**: Check that your callback URL in Google Console matches exactly
2. **CORS errors**: Ensure your CLIENT_URL environment variable is correct
3. **Token errors**: Verify JWT_SECRET is set and consistent
4. **Session issues**: Make sure SESSION_SECRET is set

### Debug Mode:
Set `NODE_ENV=development` and check console logs for detailed error messages.

## File Structure

```
server/
├── src/
│   ├── config/
│   │   └── passport.ts          # OAuth configuration
│   ├── routes/
│   │   └── auth.ts              # Auth routes
│   ├── middleware/
│   │   └── auth.ts              # JWT middleware
│   └── index.ts                 # Main server file
└── .env                         # Environment variables

client/
├── src/
│   ├── components/
│   │   ├── OAuthButton.tsx      # OAuth button component
│   │   └── OAuthIcons.tsx       # OAuth provider icons
│   ├── pages/
│   │   ├── LoginPage.tsx        # Login page with OAuth
│   │   ├── RegisterPage.tsx     # Register page with OAuth
│   │   └── AuthCallbackPage.tsx # OAuth callback handler
│   ├── services/
│   │   └── authService.ts       # Auth API calls
│   └── store/
│       └── authStore.ts         # Auth state management
└── .env                         # Environment variables (optional)
```

## Support

If you encounter issues, check:
1. Google Cloud Console configuration
2. Environment variables are set correctly
3. Server and client are running on correct ports
4. Network connectivity and firewall settings
