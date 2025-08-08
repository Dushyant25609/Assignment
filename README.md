# Assignment Bookmark Manager

A modern full-stack bookmark management application with AI-powered summaries and OAuth authentication. Built with React, TypeScript, Express.js, and MongoDB Atlas.

## 🌟 Features

- **Smart Bookmarking**: Save and organize web bookmarks with automatic metadata extraction
- **AI-Powered Summaries**: Get full content summaries using Jina AI integration
- **OAuth Authentication**: Secure login with Google OAuth and traditional email/password
- **Dark/Light Mode**: Fully responsive design with theme switching
- **Search & Filter**: Title-based search for quick bookmark discovery
- **Real-time UI**: Scrollable summaries with responsive modal views

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** with dark mode support
- **React Router** for navigation
- **Zustand** for state management
- **React Hot Toast** for notifications

### Backend
- **Express.js** with TypeScript
- **Prisma ORM** with MongoDB Atlas
- **Passport.js** for OAuth authentication
- **JWT** for session management
- **Bcrypt** for password hashing
- **Winston** for logging
- **Joi** for validation

### External Services
- **MongoDB Atlas** for cloud database
- **Jina AI** for content summarization
- **Google OAuth 2.0** for authentication

### DevOps & Infrastructure
- **Native Development** (No Docker required)
- **Cloud-first architecture**
- **Environment-based configuration**

## 📁 Project Structure

```
Assignment/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # Base UI components (Button, Modal, etc.)
│   │   │   ├── AuthForm.tsx      # Authentication form component
│   │   │   ├── BookmarkCard.tsx  # Bookmark display component
│   │   │   ├── Header.tsx        # Application header
│   │   │   ├── OAuthButton.tsx   # OAuth authentication button
│   │   │   └── SearchBar.tsx     # Search functionality
│   │   ├── pages/         # Page components
│   │   │   ├── AuthPage.tsx         # Login/Register page
│   │   │   ├── AuthCallbackPage.tsx # OAuth callback handler
│   │   │   └── BookmarksPage.tsx    # Main bookmarks page (home)
│   │   ├── services/      # API services
│   │   │   ├── authService.ts      # Authentication API
│   │   │   ├── bookmarkService.ts  # Bookmark management API
│   │   │   └── jinaApi.ts          # Jina AI integration
│   │   ├── store/         # State management
│   │   │   └── authStore.ts        # Authentication state (Zustand)
│   │   └── types/         # TypeScript type definitions
│   └── public/            # Static assets
├── server/                # Express backend application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   │   └── passport.ts         # OAuth configuration
│   │   ├── controllers/   # Route controllers
│   │   │   └── authController.ts   # Authentication logic
│   │   ├── middleware/    # Express middleware
│   │   │   ├── auth.ts            # JWT authentication
│   │   │   ├── errorHandler.ts    # Error handling
│   │   │   ├── logger.ts          # Request logging
│   │   │   └── validation.ts      # Input validation
│   │   ├── routes/        # API routes
│   │   │   ├── auth.ts            # Authentication routes
│   │   │   └── bookmarks.ts       # Bookmark CRUD routes
│   │   ├── services/      # Business logic
│   │   │   └── bookmarkService.ts # Bookmark management
│   │   └── types/         # TypeScript types
│   ├── prisma/            # Database schema and client
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.ts               # Database seeding
│   └── .env              # Environment variables
└── README.md

## 🔧 Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Dushyant25609/Assignment.git
cd Assignment
```

### 2. Environment Setup

Create a `.env` file in the `server` directory:

```env
# Environment
NODE_ENV=development
PORT=5001
CLIENT_URL=http://localhost:3000

# Database (MongoDB Atlas)
DATABASE_URL=your-mongodb-atlas-connection-string

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Session Secret
SESSION_SECRET=your-super-secret-session-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Database Setup

```bash
# Generate Prisma client
cd server
npm run db:generate

# Push schema to database (for development)
npm run db:push
```

### 5. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:5001/api/auth/google/callback`
5. Update your `.env` file with the credentials

### 6. Start Development Servers

```bash
# Start backend server (from server directory)
cd server
npm run dev

# Start frontend server (from client directory, in new terminal)
cd client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Bookmark Endpoints
- `GET /api/bookmarks` - Get user bookmarks
- `POST /api/bookmarks` - Create new bookmark
- `PUT /api/bookmarks/:id` - Update bookmark
- `DELETE /api/bookmarks/:id` - Delete bookmark

## 🎯 Key Features

### Authentication
- **Traditional Auth**: Email/password registration and login
- **OAuth Integration**: Google OAuth with mode detection (login/signup)
- **JWT Tokens**: Secure session management
- **Protected Routes**: Middleware-based route protection

### Bookmark Management
- **Smart Saving**: Automatic metadata extraction from URLs
- **AI Summaries**: Full content summarization using Jina AI
- **Search & Filter**: Title-based search functionality
- **Responsive UI**: Scrollable summaries and modal views

### User Experience
- **Dark/Light Mode**: Full theme support with system preference detection
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Instant UI updates with optimistic rendering
- **Error Handling**: Comprehensive error handling with user feedback

## 🔒 Environment Variables

### Required Variables
```env
# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server Configuration
PORT=5001
CLIENT_URL=http://localhost:3000
SESSION_SECRET=your-session-secret
```

### Optional Variables
```env
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
NODE_ENV=development
```
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** installed
- **MongoDB** installed and running locally
- **Git** (for cloning)

### 1. Clone the repository
```bash
git clone https://github.com/Dushyant25609/Assignment.git
cd Assignment
```

### 2. Environment Setup

Create a `.env` file in the `server` directory with the configuration shown above.

### 3. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Database Setup

```bash
# Generate Prisma client
cd server
npm run db:generate

# Push schema to database (for development)
npm run db:push
```

### 5. Start Development Servers

```bash
# Start backend server (from server directory)
cd server
npm run dev

# Start frontend server (from client directory, in new terminal)
cd client
npm run dev
```

### 6. Access the application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001


## �️ Development Commands

### Server Commands
```bash
cd server

# Development
npm run dev              # Start development server with hot reload
npm run build           # Build for production
npm start               # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema changes to database
npm run db:studio       # Open Prisma Studio

# Testing & Quality
npm run lint            # Run ESLint
npm run test           # Run tests
```

### Client Commands
```bash
cd client

# Development
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build

# Testing & Quality
npm run lint           # Run ESLint
npm run type-check     # TypeScript type checking
```


## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB Atlas connection string in `.env`
   - Check network access and IP whitelist in MongoDB Atlas
   - Ensure database credentials are correct

2. **OAuth Not Working**
   - Verify Google OAuth credentials in `.env`
   - Check redirect URLs in Google Cloud Console
   - Ensure `CLIENT_URL` matches your frontend URL

3. **Port Already in Use**
   ```bash
   # Kill processes on ports 3000 and 5001
   npx kill-port 3000 5001
   ```

4. **Prisma Client Issues**
   ```bash
   cd server
   npm run db:generate
   ```

5. **Environment Variables Not Loading**
   - Check `.env` file exists in `server` directory
   - Verify all required variables are set
   - Restart the server after changes

### Reset Everything
```bash
# Stop all servers
# Delete node_modules in both client and server
rm -rf client/node_modules server/node_modules

# Reinstall dependencies
cd server && npm install
cd ../client && npm install

# Regenerate Prisma client
cd server && npm run db:generate
```



## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Verify environment variables are correctly set
3. Check server logs for detailed error messages
4. Create an issue in the GitHub repository

---

Built with ❤️ using React, TypeScript, Express.js, and MongoDB Atlas
