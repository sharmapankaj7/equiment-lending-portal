# Equipment Lending Portal - Phase 1 & 2 Complete

A full-stack web application for managing school equipment loans, built with React (frontend) and Node.js/Express/MongoDB (backend).

**📊 Project Status:** Phase 2 Complete (AI-Assisted Enhancements)  
**🔀 Branches:** `main` (Phase 1 - Manual), `phase2-ai-assisted` (Phase 2 - Enhanced)

## 📋 Project Overview

This is a comprehensive equipment lending management system developed in two phases:

- **Phase 1 (Manual):** Core functionality built entirely without AI assistance
- **Phase 2 (AI-Assisted):** Enhanced version with notifications, analytics, and automation

## 🚀 Features Implemented

### Phase 1 - Core Features (Manual Development)

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

### Phase 2 - Enhanced Features (AI-Assisted) ⭐ NEW

1. **📧 Automated Email Notification System**
   - Request approval/rejection notifications
   - Due date reminders (2 days before)
   - Overdue alerts
   - Return confirmations
   - Professional HTML email templates

2. **⏰ Due Date Tracking & Overdue Management**
   - Automated daily checks for overdue equipment
   - Automatic status updates to OVERDUE
   - Scheduled cron jobs for monitoring
   - Visual overdue indicators

3. **📊 Analytics Dashboard**
   - Equipment usage statistics
   - Most borrowed items tracking
   - Category-wise distribution
   - Request trends over time
   - Overdue reports for admins

4. **🔔 Notification System**
   - In-app notification model
   - Email tracking and delivery status
   - Notification history
   - Read/unread status

5. **⚡ Performance Optimizations**
   - MongoDB indexes for faster queries
   - Optimized aggregation pipelines
   - Efficient date calculations
   - Reduced database calls

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **bcrypt.js** - Password hashing
- **Express Validator** - Input validation
- **NodeMailer** - Email service (Phase 2) ⭐
- **Node-Cron** - Task scheduling (Phase 2) ⭐

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
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/equipment-lending

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d

# Email Service (Phase 2) - Required for notifications
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=Equipment Portal <noreply@equipmentportal.com>

# Alternative SMTP Configuration
# SMTP_HOST=smtp.ethereal.email
# SMTP_PORT=587
```

**Note for Phase 2:** To enable email notifications:
1. Use a Gmail account with 2FA enabled
2. Generate an App Password (https://myaccount.google.com/apppasswords)
3. Add the App Password to `EMAIL_PASSWORD` in .env

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
| Student | pankaj@school.edu | student123 |
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

### Analytics (Phase 2) ⭐ NEW
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/equipment-usage` - Equipment usage analytics
- `GET /api/analytics/request-trends` - Request trends over time
- `GET /api/analytics/user-statistics` - User statistics (Admin only)
- `GET /api/analytics/overdue-report` - Overdue items report (Staff/Admin)

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

This project was developed in two phases as part of the FSAD course at BITS Pilani:

### Phase 1 - Manual Development (Branch: `main`)
Built entirely without AI assistance to establish baseline understanding of:
- Full-stack architecture
- MERN stack fundamentals
- Authentication and authorization
- RESTful API design
- React state management

**Completion Time:** ~25 hours  
**Files Created:** 30  
**Lines of Code:** ~1,500

### Phase 2 - AI-Assisted Development (Branch: `phase2-ai-assisted`)
Enhanced version using AI tools (GitHub Copilot / Claude) for:
- Automated notification system
- Analytics dashboard
- Performance optimization
- Enhanced error handling
- Professional email templates

**Completion Time:** ~15 hours (40% faster)  
**Files Created:** 50 (20 new files)  
**Lines of Code:** ~4,000  
**AI Contribution:** ~40% code generation, 60% manual customization

### Key Learnings
- AI significantly improves development speed
- Manual coding provides deeper understanding
- AI excels at boilerplate and patterns
- Human oversight critical for business logic
- Best approach: Combine both methodologies

### Documentation
- 📄 `AI_USAGE_LOG.md` - Detailed AI usage tracking
- 📄 `REFLECTION_REPORT.md` - Comparison of Phase 1 vs Phase 2
- 📄 `PHASE2_ENHANCEMENTS.md` - Technical enhancement details
- 📄 `PHASE1_COMPLETE.md` - Phase 1 summary

## 🔄 Branch Structure

```
main (Phase 1 - Manual)
  └── All core features, manually coded
  
phase2-ai-assisted (Phase 2 - Enhanced)
  └── Phase 1 features + AI-assisted enhancements
```

**To switch between versions:**
```bash
# View Phase 1 (Manual)
git checkout main

# View Phase 2 (AI-Assisted)
git checkout phase2-ai-assisted
```

## 📄 License

This project is part of an academic assignment for BITS Pilani.

## 👥 Contributors

- Pankaj Sharma

---

**Note**: This is an educational project for the FSAD course at BITS Pilani. The system demonstrates core concepts of full-stack web development including authentication, authorization, CRUD operations, and responsive UI design.
