# Assignment Full-Stack Application

A comprehensive full-stack web application built with modern technologies including React, TypeScript, Express.js, MongoDB, and Docker.

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query (TanStack Query)** for data fetching
- **Zustand** for state management
- **React Hook Form** for form handling

### Backend
- **Express.js** with TypeScript
- **Prisma ORM** with MongoDB
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Winston** for logging
- **Joi** for validation

### Database
- **MongoDB** with Prisma ORM
- Optimized indexes and relationships

### DevOps
- **Docker** & **Docker Compose**
- **Nginx** reverse proxy
- Volume persistence for data
- Development and production configurations

## 📁 Project Structure

```
Assignment/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # Global styles
│   ├── public/            # Static assets
│   ├── Dockerfile         # Production Docker config
│   └── Dockerfile.dev     # Development Docker config
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── prisma/           # Database schema & migrations
│   ├── Dockerfile        # Production Docker config
│   └── Dockerfile.dev    # Development Docker config
├── docker/               # Docker configuration
├── docker-compose.yml    # Production compose
├── docker-compose.dev.yml # Development compose
├── dev.sh               # Development script
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git (for cloning)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Assignment
```

### 2. Make dev script executable
```bash
chmod +x dev.sh
```

### 3. Start development environment
```bash
./dev.sh start
```

This will:
- Build and start all services (MongoDB, Backend, Frontend)
- Set up the database with initial data
- Start the development servers with hot reload

### 4. Access the application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://admin:password123@localhost:27017

## 🛠️ Development Scripts

The `dev.sh` script provides convenient commands for managing the development environment:

```bash
# Start development environment
./dev.sh start

# Stop development environment
./dev.sh stop

# Restart development environment
./dev.sh restart

# Start production environment
./dev.sh prod-start

# View logs
./dev.sh logs [service]

# View development logs
./dev.sh logs dev [service]

# Install dependencies
./dev.sh install

# Database operations
./dev.sh db:seed [dev]     # Seed database
./dev.sh db:reset [dev]    # Reset database

# Git operations
./dev.sh pull              # Pull latest changes
./dev.sh push "message"    # Commit and push

# System status
./dev.sh status

# Clean up resources
./dev.sh cleanup

# Help
./dev.sh help
```

## 🗄️ Database

### Schema Overview
- **Users**: Authentication and profiles
- **Posts**: Blog posts/articles with rich content
- **Comments**: User comments on posts
- **Likes**: Post likes by users

### Sample Data
The database comes with sample data including:
- Admin and regular users
- Sample blog posts
- Comments and likes

### Database Operations
```bash
# Seed the database
./dev.sh db:seed dev

# Reset the database (careful - deletes all data!)
./dev.sh db:reset dev

# Access MongoDB directly
docker exec -it assignment-mongodb-dev mongosh -u admin -p password123
```

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://admin:password123@localhost:27017/assignment_db_dev?authSource=admin
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

#### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Docker Compose Services

#### Development (docker-compose.dev.yml)
- MongoDB with persistent volume
- Backend with hot reload
- Frontend with hot reload
- All services networked together

#### Production (docker-compose.yml)
- Optimized builds
- Nginx reverse proxy
- Production-ready configurations

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Posts Endpoints
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (auth required)
- `PUT /api/posts/:id` - Update post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)
- `POST /api/posts/:id/like` - Toggle like on post (auth required)

### Comments Endpoints
- `POST /api/comments` - Create comment (auth required)

### Users Endpoints
- `GET /api/users` - Get all users

## 🎨 Frontend Features

### Components
- Responsive design with Tailwind CSS
- Reusable UI components
- Loading states and error handling
- Form validation with React Hook Form

### State Management
- Zustand for global state
- React Query for server state
- Local storage persistence

### Routing
- Protected routes for authenticated users
- Dynamic routing for posts
- Navigation with React Router

## 🛡️ Security Features

- JWT authentication with secure storage
- Password hashing with bcrypt
- Input validation with Joi
- Rate limiting on API endpoints
- CORS configuration
- Security headers with Helmet

## 🚢 Deployment

### Production Deployment
```bash
# Start production environment
./dev.sh prod-start

# Access via Nginx proxy
# Frontend & API: http://localhost
```

### Docker Hub (Optional)
```bash
# Build and push images
docker build -t your-username/assignment-client ./client
docker build -t your-username/assignment-server ./server
docker push your-username/assignment-client
docker push your-username/assignment-server
```

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 📊 Monitoring & Logs

### View Application Logs
```bash
# All services
./dev.sh logs

# Specific service
./dev.sh logs server
./dev.sh logs client
./dev.sh logs mongodb
```

### System Status
```bash
./dev.sh status
```

## 🔧 Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 5000, 27017 are available
2. **Docker issues**: Restart Docker service
3. **Permission issues**: Make sure `dev.sh` is executable
4. **Database connection**: Check MongoDB is running

### Reset Everything
```bash
./dev.sh cleanup
./dev.sh start
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
1. Check the troubleshooting section
2. Review the logs: `./dev.sh logs`
3. Check Docker status: `./dev.sh status`
4. Create an issue in the repository

---

Built with ❤️ using React, TypeScript, Express, and MongoDB
