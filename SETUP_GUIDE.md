# Equipment Lending Portal - Setup Guide

## Quick Start Guide

This guide will help you set up and run the Equipment Lending Portal on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

### Verify Installation

```bash
node --version    # Should be v16 or higher
npm --version     # Should be 7 or higher
mongod --version  # Should show MongoDB version
```

## Step-by-Step Setup

### 1. Clone the Repository (if not already done)

```bash
git clone <your-repo-url>
cd equipment-lending-portal
```

### 2. Start MongoDB

#### On macOS:
```bash
# If installed via Homebrew
brew services start mongodb-community

# Or run manually
mongod --config /usr/local/etc/mongod.conf
```

#### On Windows:
```bash
# MongoDB should start automatically as a service
# Or run manually from MongoDB bin folder
mongod
```

#### On Linux:
```bash
sudo systemctl start mongod
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Verify .env file exists with correct settings
# If not, create it with the following content:
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/equipment-lending
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
EOF

# Seed the database with sample data
npm run seed

# Expected output:
# ✅ Database seeded successfully!
# Sample credentials will be displayed

# Start the backend server
npm start

# For development with auto-reload:
npm run dev
```

**Backend should now be running at:** http://localhost:5000

**Test it:** Open http://localhost:5000 in your browser. You should see:
```json
{
  "message": "Welcome to Equipment Lending Portal API",
  "version": "1.0.0",
  ...
}
```

### 4. Frontend Setup

Open a **NEW terminal window** (keep backend running), then:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the frontend development server
npm run dev
```

**Frontend should now be running at:** http://localhost:3000

## 5. Access the Application

1. Open your browser and go to: http://localhost:3000
2. You should see the login page
3. Use one of the demo credentials:

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@school.edu | admin123 |
| **Staff** | staff@school.edu | staff123 |
| **Student** | john@school.edu | student123 |

## Testing the Application

### As a Student:
1. Login with: john@school.edu / student123
2. Browse equipment on the dashboard
3. Click on any equipment to view details
4. Submit a borrow request
5. Go to Profile to see your request history

### As Staff:
1. Login with: staff@school.edu / staff123
2. Go to "Manage Requests"
3. Approve or reject pending requests
4. Mark approved equipment as returned

### As Admin:
1. Login with: admin@school.edu / admin123
2. Go to "Admin Panel"
3. Add new equipment
4. Edit or delete existing equipment
5. Also access "Manage Requests" like staff

## Common Issues & Solutions

### Issue 1: MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
- Make sure MongoDB is running
- Check MongoDB is running on port 27017
- Verify MONGODB_URI in .env file

### Issue 2: Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
- Kill the process using the port:
  ```bash
  # On macOS/Linux
  lsof -ti:5000 | xargs kill -9
  
  # On Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```
- Or change the PORT in backend/.env

### Issue 3: Module Not Found

**Error:** `Cannot find module 'xyz'`

**Solution:**
- Delete node_modules and package-lock.json
- Run `npm install` again
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Issue 4: CORS Error

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
- Make sure backend is running on port 5000
- Check frontend .env has correct API URL
- Restart both frontend and backend

### Issue 5: JWT Token Error

**Error:** `jwt malformed` or `invalid token`

**Solution:**
- Logout and login again
- Clear browser localStorage
- Check JWT_SECRET in backend .env

## Development Workflow

### Running Both Servers

Use two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Making Changes

- **Backend changes**: Automatically reload with nodemon (if using `npm run dev`)
- **Frontend changes**: Automatically reload with Vite's HMR

### Stopping the Application

Press `Ctrl + C` in each terminal window to stop the servers.

## Project URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## Database Management

### View Data in MongoDB

```bash
# Open MongoDB shell
mongosh

# Use the database
use equipment-lending

# View collections
show collections

# View all users
db.users.find().pretty()

# View all equipment
db.equipments.find().pretty()

# View all requests
db.borrowrequests.find().pretty()
```

### Reset Database

```bash
cd backend
npm run seed
```

This will clear all data and reseed with sample data.

## Building for Production

### Backend
```bash
cd backend
# Backend runs as-is with node
NODE_ENV=production node server.js
```

### Frontend
```bash
cd frontend
npm run build

# Preview production build
npm run preview
```

## Next Steps

1. Explore all features by logging in as different users
2. Test the borrow request workflow
3. Try adding, editing, and deleting equipment as admin
4. Check request management as staff
5. View your request history in the profile

## Need Help?

If you encounter any issues:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure MongoDB is running
4. Check that ports 3000 and 5000 are available
5. Review the error logs in terminal

## Documentation

- Backend API: See `backend/README.md` (if exists) or API endpoint comments
- Frontend: See `frontend/README.md`
- Main README: See root `README.md`

---

**Happy Coding! 🚀**
