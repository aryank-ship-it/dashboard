# MongoDB Migration Guide

## ✅ Migration Complete!

Your dashboard application has been successfully migrated from Supabase to MongoDB with Express.js backend.

---

## 🗄️ **What Changed**

### **Database: Supabase PostgreSQL → MongoDB**
- Removed all Supabase dependencies
- Created MongoDB schemas with Mongoose
- Implemented JWT authentication instead of Supabase Auth

### **Backend: Created Express.js Server**
- **Location**: `/server` directory
- **Port**: 5000 (configurable in `.env`)
- **Features**:
  - RESTful API endpoints
  - JWT authentication
  - Password hashing with bcrypt
  - CORS enabled
  - Error handling middleware

### **Frontend: Updated to use REST API**
- Replaced Supabase client with Axios
- Updated AuthContext to use JWT tokens
- Modified all hooks to call MongoDB API
- Token stored in localStorage

---

## 📁 **New File Structure**

```
/server
  /config
    database.ts          # MongoDB connection
  /models
    User.model.ts        # User schema
    TeamMember.model.ts  # Team member schema
    Task.model.ts        # Task schema
    Event.model.ts       # Event schema
  /routes
    auth.routes.ts       # Register/Login
    user.routes.ts       # User profile & search
    team.routes.ts       # Team members CRUD
    task.routes.ts       # Tasks CRUD
    event.routes.ts      # Events CRUD
  /middleware
    auth.middleware.ts   # JWT authentication
  index.ts               # Express server

/src/lib
  api.ts                 # Axios API client

.env                     # MongoDB URI & JWT secret
```

---

## 🚀 **How to Run**

### **1. Install MongoDB**

#### **Option A: Local MongoDB**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongodb  # Linux
brew services start mongodb-community  # macOS
```

#### **Option B: MongoDB Atlas (Cloud)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Update `.env` with your connection string

### **2. Update Environment Variables**

Edit `.env` file:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/dashboard
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dashboard

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=5000
NODE_ENV=development

# Client
CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000/api
```

### **3. Start the Application**

#### **Option A: Start Both (Recommended)**
```bash
npm start
```
This runs both frontend (Vite) and backend (Express) concurrently.

#### **Option B: Start Separately**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

---

## 🔐 **Authentication Flow**

### **Registration**
1. User submits email, password, fullName
2. Backend hashes password with bcrypt
3. User created in MongoDB
4. JWT token generated and returned
5. Token stored in localStorage
6. User redirected to dashboard

### **Login**
1. User submits email, password
2. Backend verifies credentials
3. JWT token generated and returned
4. Token stored in localStorage
5. User redirected to dashboard

### **Authenticated Requests**
- Token sent in `Authorization: Bearer <token>` header
- Backend middleware verifies token
- User object attached to request
- Protected routes check admin role

---

## 📊 **Database Schema**

### **Users Collection**
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (hashed),
  fullName: String,
  avatarUrl: String (optional),
  role: 'admin' | 'member',
  createdAt: Date,
  updatedAt: Date
}
```

### **TeamMembers Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, unique),
  addedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### **Tasks Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  status: 'todo' | 'in-progress' | 'done',
  priority: 'low' | 'medium' | 'high',
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### **Events Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  date: Date,
  color: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### **Users**
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users/search?q=query` - Search users (authenticated)

### **Team Members**
- `GET /api/team-members` - List all team members
- `POST /api/team-members` - Add team member (admin only)
- `DELETE /api/team-members/:id` - Remove team member (admin only)

### **Tasks**
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### **Events**
- `GET /api/events` - Get user's events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

---

## 👤 **Creating an Admin User**

### **Method 1: MongoDB Shell**
```bash
mongosh

use dashboard

db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### **Method 2: MongoDB Compass**
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select `dashboard` database
4. Open `users` collection
5. Find your user
6. Edit `role` field to `"admin"`
7. Save

---

## 🧪 **Testing the Migration**

### **1. Test Authentication**
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### **2. Test Team Members (with token)**
```bash
# Get team members
curl http://localhost:5000/api/team-members \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Search users
curl "http://localhost:5000/api/users/search?q=test" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔧 **Troubleshooting**

### **MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service
```bash
sudo systemctl start mongodb  # Linux
brew services start mongodb-community  # macOS
```

### **JWT Token Invalid**
**Solution**: Clear localStorage and login again
```javascript
localStorage.clear();
```

### **CORS Error**
**Solution**: Check `CLIENT_URL` in `.env` matches your frontend URL

### **Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change `PORT` in `.env` or kill process on port 5000
```bash
lsof -ti:5000 | xargs kill -9
```

---

## 📦 **Dependencies Added**

### **Backend**
- `mongodb` - MongoDB driver
- `mongoose` - MongoDB ODM
- `express` - Web framework
- `cors` - CORS middleware
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `dotenv` - Environment variables
- `tsx` - TypeScript execution
- `concurrently` - Run multiple commands

### **Frontend**
- `axios` - HTTP client

---

## 🗑️ **What Was Removed**

- ❌ `@supabase/supabase-js` dependency
- ❌ `/supabase` directory (migrations, config)
- ❌ `/src/integrations/supabase` directory
- ❌ Supabase client initialization
- ❌ Supabase auth hooks

**Note**: Old Supabase files are still in the project but not used. You can safely delete them:
```bash
rm -rf supabase/
rm -rf src/integrations/supabase/
```

---

## 🎯 **Next Steps**

1. ✅ Start MongoDB
2. ✅ Update `.env` with your MongoDB URI
3. ✅ Run `npm start`
4. ✅ Register a new user
5. ✅ Set user role to "admin" in MongoDB
6. ✅ Test team member features

---

## 🚨 **Important Security Notes**

### **Production Deployment**
1. **Change JWT_SECRET** to a strong random string
2. **Use HTTPS** for all API calls
3. **Enable MongoDB authentication**
4. **Use environment variables** for sensitive data
5. **Implement rate limiting** on auth endpoints
6. **Add input validation** with libraries like Joi or Zod
7. **Enable MongoDB Atlas IP whitelist**

### **Password Security**
- Passwords are hashed with bcrypt (10 rounds)
- Never log passwords
- Enforce strong password policies

---

## 📚 **Additional Resources**

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [Express.js Documentation](https://expressjs.com/)
- [JWT.io](https://jwt.io/)

---

**Migration completed successfully!** 🎉

Your application now uses MongoDB instead of Supabase.
