# Equipment Lending Portal - Phase 1 (Manual Development)

A full-stack web application for managing school equipment loans, built with React (frontend) and Node.js/Express/MongoDB (backend).

## 📋 Project Overview

This is a comprehensive equipment lending management system that allows:
- **Students and teachers** to request or borrow equipment
- **Lab assistants/admins** to approve, issue, and track items
- **Administrators** to monitor usage and availability

## 🚀 Features Implemented

### Core Features

1. **User Authentication & Roles**
   - Login/signup for students, staff, and admins
   - Role-based access control (student, staff, admin)
   - JWT token-based authentication

2. **Equipment Management**
   - Add, edit, or delete items (by admin)
   - Equipment categorization and condition tracking
   - Quantity and availability management

3. **Borrowing & Return Requests**
   - Students can request equipment
   - Staff/admin can approve or reject requests
   - Mark equipment as returned
   - Prevent overlapping bookings for the same item

4. **Dashboard - Equipment Listing & Search**
   - Browse all available equipment
   - Search/filter by category or availability
   - Detailed equipment information

5. **Responsive UI & Navigation**
   - React frontend with clean, modern design
   - Mobile-responsive interface
   - Intuitive navigation

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **bcrypt.js** - Password hashing
- **Express Validator** - Input validation

### Frontend
- **React 18** - UI framework
- **React Router** - Routing
- **Axios** - HTTP client
- **Vite** - Build tool

## 📁 Project Structure

```
equipment-lending-portal/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── equipmentController.js
│   │   └── borrowRequestController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Equipment.js
│   │   └── BorrowRequest.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── equipmentRoutes.js
│   │   └── borrowRequestRoutes.js
│   ├── .env
│   ├── server.js
│   ├── seedData.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── EquipmentCard.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── EquipmentDetail.jsx
    │   │   ├── AdminPanel.jsx
    │   │   ├── RequestManagement.jsx
    │   │   └── UserProfile.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the backend directory with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/equipment-lending
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

Backend will run at: http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the frontend development server:
```bash
npm run dev
```

Frontend will run at: http://localhost:3000

## 👤 Default User Credentials

After seeding the database, use these credentials to login:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.edu | admin123 |
| Staff | staff@school.edu | staff123 |
| Student | john@school.edu | student123 |
| Student | jane@school.edu | student123 |

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Equipment
- `GET /api/equipment` - Get all equipment (with filters)
- `GET /api/equipment/:id` - Get single equipment
- `POST /api/equipment` - Create equipment (Admin only)
- `PUT /api/equipment/:id` - Update equipment (Admin only)
- `DELETE /api/equipment/:id` - Delete equipment (Admin only)

### Borrow Requests
- `GET /api/borrow-requests` - Get all requests (filtered by role)
- `GET /api/borrow-requests/:id` - Get single request
- `POST /api/borrow-requests` - Create new request
- `PUT /api/borrow-requests/:id/approve` - Approve request (Staff/Admin)
- `PUT /api/borrow-requests/:id/reject` - Reject request (Staff/Admin)
- `PUT /api/borrow-requests/:id/return` - Mark as returned (Staff/Admin)

## 🎯 User Workflows

### Student Workflow
1. Register/Login
2. Browse equipment dashboard
3. Search/filter equipment
4. View equipment details
5. Submit borrow request
6. Track request status in profile

### Staff/Admin Workflow
1. Login
2. View all borrow requests
3. Approve or reject pending requests
4. Mark equipment as returned
5. Monitor equipment usage

### Admin Workflow
1. All staff features, plus:
2. Add new equipment
3. Edit equipment details
4. Delete equipment
5. Manage inventory levels

## 🎨 Features Highlights

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Role-Based Access**: Different interfaces for students, staff, and admins
- **Real-time Validation**: Form validation and error handling
- **Availability Tracking**: Automatic equipment availability updates
- **Overlap Prevention**: Cannot request equipment already borrowed
- **Request History**: Complete audit trail of all requests
- **Search & Filter**: Find equipment quickly by category or availability

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes
- Role-based authorization
- Input validation and sanitization

## 📝 Development Notes

This is **Phase 1 - Manual Development** of the project, built entirely without AI assistance to establish a baseline understanding of the system architecture and implementation.

### Next Steps (Phase 2)
- AI-assisted development and refactoring
- Additional enhancements (notifications, analytics, damage logs)
- Performance optimizations
- Extended testing

## 📄 License

This project is part of an academic assignment for BITS Pilani.

## 👥 Contributors

- Pankaj Sharma

---

**Note**: This is an educational project for the FSAD course at BITS Pilani. The system demonstrates core concepts of full-stack web development including authentication, authorization, CRUD operations, and responsive UI design.
