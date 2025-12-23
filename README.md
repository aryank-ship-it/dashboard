# Dashboard Application - MongoDB Edition

A modern, feature-rich dashboard application built with React, TypeScript, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)

### Installation

1. **Clone and Install**
```bash
npm install
```

2. **Setup MongoDB**

**Option A - Local MongoDB:**
```bash
# Install MongoDB
sudo apt-get install mongodb  # Ubuntu/Debian
brew install mongodb-community  # macOS

# Start MongoDB
sudo systemctl start mongodb  # Linux
brew services start mongodb-community  # macOS
```

**Option B - MongoDB Atlas (Cloud):**
- Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string
- Update `.env` file

3. **Configure Environment**

The `.env` file is already configured for local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/dashboard
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
CLIENT_URL=http://localhost:5173
VITE_API_URL=https://dashboard-pink-three-71.vercel.app/api
```

**⚠️ IMPORTANT**: Change `JWT_SECRET` before deploying to production!

4. **Start the Application**

```bash
# Start both frontend and backend
npm start

# OR start separately:
npm run dev      # Frontend only (port 5173)
npm run server   # Backend only (port 5000)
```

5. **Create Your Account**
- Open http://localhost:5173
- Click "Sign Up"
- Register with email and password

6. **Make Yourself Admin**

```bash
# Connect to MongoDB
mongosh

# Switch to dashboard database
use dashboard

# Update your user to admin
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Now you can add team members! 🎉

---

## 📋 Features

### ✅ **Authentication**
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (admin/member)

### ✅ **Team Members Management**
- **Search Users**: Find registered users by name or email
- **Add Members**: Admins can add users to the team
- **Remove Members**: Admins can remove team members
- **View Team**: See all team members with their details
- **Real-time Search**: Debounced search with instant results
- **Smart Filtering**: Excludes users already in the team

### ✅ **Tasks Management**
- Create, update, and delete tasks
- Task status: Todo, In Progress, Done
- Priority levels: Low, Medium, High
- Due dates
- User-specific tasks

### ✅ **Calendar Events**
- Create and manage events
- Color-coded events
- Date-based organization
- Event descriptions

### ✅ **User Profile**
- View and edit profile
- Avatar support
- Full name management

---

## 🏗️ Architecture

### **Frontend**
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Routing**: React Router v6

### **Backend**
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcrypt for password hashing, CORS enabled

---

## 📁 Project Structure

```
/
├── server/                 # Backend (Express + MongoDB)
│   ├── config/
│   │   └── database.ts     # MongoDB connection
│   ├── models/             # Mongoose schemas
│   │   ├── User.model.ts
│   │   ├── TeamMember.model.ts
│   │   ├── Task.model.ts
│   │   └── Event.model.ts
│   ├── routes/             # API endpoints
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── team.routes.ts
│   │   ├── task.routes.ts
│   │   └── event.routes.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   └── index.ts            # Server entry point
│
├── src/                    # Frontend (React)
│   ├── components/         # UI components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── lib/
│   │   └── api.ts          # API client
│   ├── pages/              # Page components
│   └── main.tsx            # App entry point
│
├── .env                    # Environment variables
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `GET /api/users/search?q=query` - Search users

### Team Members (Admin Only)
- `GET /api/team-members` - List team members
- `POST /api/team-members` - Add team member
- `DELETE /api/team-members/:id` - Remove team member

### Tasks
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Events
- `GET /api/events` - Get user's events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

---

## 🔐 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token authentication
- ✅ Protected routes with middleware
- ✅ Role-based access control
- ✅ CORS configuration
- ✅ Input validation
- ✅ Unique constraints on database

---

## 🧪 Testing

### Manual API Testing

```bash
# Register
curl -X POST https://dashboard-pink-three-71.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}'

# Login
curl -X POST https://dashboard-pink-three-71.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get team members (replace TOKEN)
curl https://dashboard-pink-three-71.vercel.app/api/team-members \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start frontend (Vite dev server)
npm run server       # Start backend (Express server with hot reload)
npm start            # Start both frontend and backend
npm run build        # Build frontend for production
npm run lint         # Run ESLint
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/dashboard` |
| `JWT_SECRET` | Secret key for JWT tokens | (change in production!) |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:5173` |
| `VITE_API_URL` | API URL for frontend | `https://dashboard-pink-three-71.vercel.app/api` |

---

## 📚 Documentation

- **[MONGODB_MIGRATION.md](./MONGODB_MIGRATION.md)** - Complete migration guide from Supabase
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Detailed API documentation
- **[TEAM_MEMBERS_IMPLEMENTATION.md](./TEAM_MEMBERS_IMPLEMENTATION.md)** - Team feature docs

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
sudo systemctl status mongodb  # Check status
sudo systemctl start mongodb   # Start MongoDB
```

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Change port in `.env` or kill the process
```bash
lsof -ti:5000 | xargs kill -9
```

### JWT Token Invalid
**Solution**: Clear browser storage and login again
```javascript
// In browser console
localStorage.clear();
```

---

## 🚀 Deployment

### Backend (Express + MongoDB)
- Deploy to: Heroku, Railway, Render, DigitalOcean
- Use MongoDB Atlas for database
- Set environment variables
- Change `JWT_SECRET` to secure random string

### Frontend (React)
- Deploy to: Vercel, Netlify, Cloudflare Pages
- Update `VITE_API_URL` to production API URL
- Build with `npm run build`

---

## 📝 License

MIT

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, MongoDB, and Express.js**
