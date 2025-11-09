# Database Schema & Architecture Documentation

## Database: MongoDB (equipment-lending)

---

## Collections Overview

1. **users** - Stores user accounts (students, staff, admins)
2. **equipments** - Stores equipment inventory
3. **borrowrequests** - Stores borrow request records

---

## 1. User Model

### Collection: `users`

| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| _id | ObjectId | Yes | Yes | Auto | MongoDB ID |
| name | String | Yes | No | - | Full name |
| email | String | Yes | Yes | - | Email address (lowercase) |
| password | String | Yes | No | - | Hashed password (bcrypt) |
| role | String | Yes | No | 'student' | Role: student/staff/admin |
| studentId | String | No | No | - | Student ID (for students) |
| department | String | No | No | '' | Department name |
| createdAt | Date | Yes | No | Date.now() | Account creation date |

### Validation Rules:
- **Email:** Must be valid email format
- **Password:** Minimum 6 characters, hashed before storage
- **Role:** Must be one of: 'student', 'staff', 'admin'

### Indexes:
- `email` (unique)

### Methods:
- `matchPassword(enteredPassword)` - Compare entered password with hashed password

---

## 2. Equipment Model

### Collection: `equipments`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| _id | ObjectId | Yes | Auto | MongoDB ID |
| name | String | Yes | - | Equipment name |
| category | String | Yes | - | Equipment category |
| description | String | No | '' | Detailed description |
| condition | String | Yes | 'Good' | Equipment condition |
| quantity | Number | Yes | - | Total quantity |
| available | Number | Yes | - | Available quantity |
| imageUrl | String | No | '' | Image URL |
| addedBy | ObjectId | Yes | - | Reference to User (admin) |
| createdAt | Date | Yes | Date.now() | Creation timestamp |
| updatedAt | Date | Yes | Date.now() | Last update timestamp |

### Validation Rules:
- **Category:** Must be one of:
  - 'Sports Equipment'
  - 'Lab Equipment'
  - 'Cameras/Electronics'
  - 'Musical Instruments'
  - 'Project Materials'
  - 'Other'
- **Condition:** Must be one of: 'Excellent', 'Good', 'Fair', 'Poor'
- **Quantity:** Minimum 0
- **Available:** Minimum 0, cannot exceed quantity

### Relationships:
- `addedBy` → References `users._id`

### Pre-Save Hook:
- Automatically updates `updatedAt` field before saving

---

## 3. BorrowRequest Model

### Collection: `borrowrequests`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| _id | ObjectId | Yes | Auto | MongoDB ID |
| equipment | ObjectId | Yes | - | Reference to Equipment |
| user | ObjectId | Yes | - | Reference to User (requester) |
| quantity | Number | Yes | - | Quantity requested |
| status | String | Yes | 'pending' | Request status |
| requestDate | Date | Yes | Date.now() | Request submission date |
| borrowDate | Date | No | - | Approval date |
| expectedReturnDate | Date | Yes | - | Expected return date |
| actualReturnDate | Date | No | - | Actual return date |
| purpose | String | Yes | - | Purpose for borrowing |
| approvedBy | ObjectId | No | - | Reference to User (staff/admin) |
| rejectionReason | String | No | - | Reason for rejection |
| notes | String | No | '' | Additional notes |

### Validation Rules:
- **Quantity:** Minimum 1
- **Status:** Must be one of:
  - 'pending' - Initial state
  - 'approved' - Approved by staff/admin
  - 'rejected' - Rejected by staff/admin
  - 'borrowed' - Equipment borrowed (same as approved)
  - 'returned' - Equipment returned

### Relationships:
- `equipment` → References `equipments._id`
- `user` → References `users._id` (student/staff)
- `approvedBy` → References `users._id` (staff/admin)

### Business Logic:
- Cannot request more than available quantity
- Cannot have multiple active requests for same equipment
- Available quantity updates when approved/returned

---

## Entity Relationship Diagram (Text Format)

```
┌─────────────────┐
│     USER        │
│─────────────────│
│ _id (PK)        │
│ name            │
│ email (UK)      │
│ password        │
│ role            │
│ studentId       │
│ department      │
│ createdAt       │
└─────────────────┘
        │
        │ 1:N (addedBy)
        │
        ▼
┌─────────────────┐
│   EQUIPMENT     │
│─────────────────│
│ _id (PK)        │
│ name            │
│ category        │
│ description     │
│ condition       │
│ quantity        │
│ available       │
│ imageUrl        │
│ addedBy (FK)    │◄───┐
│ createdAt       │    │
│ updatedAt       │    │
└─────────────────┘    │
        │              │
        │ 1:N          │
        │              │
        ▼              │
┌─────────────────┐    │
│ BORROWREQUEST   │    │
│─────────────────│    │
│ _id (PK)        │    │
│ equipment (FK)  │────┘
│ user (FK)       │────┐
│ quantity        │    │
│ status          │    │
│ requestDate     │    │
│ borrowDate      │    │
│ expectedReturn  │    │
│ actualReturn    │    │
│ purpose         │    │
│ approvedBy (FK) │────┤
│ rejectionReason │    │
│ notes           │    │
└─────────────────┘    │
                       │
                       │ N:1
                       ▼
        ┌──────────────────────┐
        │  (back to USER)      │
        └──────────────────────┘
```

---

## Application Architecture

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│              React Application                   │
│                (Port: 3000)                      │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  Components & Pages                       │  │
│  │  - Login/Register                         │  │
│  │  - Dashboard                              │  │
│  │  - Equipment Detail                       │  │
│  │  - Admin Panel                            │  │
│  │  - Request Management                     │  │
│  │  - User Profile                           │  │
│  └──────────────────────────────────────────┘  │
│                     │                            │
│  ┌──────────────────▼──────────────────────┐   │
│  │    Context & Services                    │   │
│  │    - AuthContext                         │   │
│  │    - API Service (Axios)                 │   │
│  └──────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────┘
                   │
                   │ HTTP/HTTPS
                   │ REST API Calls
                   │ JSON Data
                   │
┌──────────────────▼──────────────────────────────┐
│                   BACKEND                        │
│            Node.js + Express.js                  │
│                (Port: 5000)                      │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │           Routes Layer                    │  │
│  │  - /api/auth/*                            │  │
│  │  - /api/equipment/*                       │  │
│  │  - /api/borrow-requests/*                 │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                                │
│  ┌──────────────▼───────────────────────────┐  │
│  │         Middleware Layer                  │  │
│  │  - Authentication (JWT verify)            │  │
│  │  - Authorization (Role check)             │  │
│  │  - Error Handler                          │  │
│  │  - CORS                                   │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                                │
│  ┌──────────────▼───────────────────────────┐  │
│  │         Controllers Layer                 │  │
│  │  - authController                         │  │
│  │  - equipmentController                    │  │
│  │  - borrowRequestController                │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                                │
│  ┌──────────────▼───────────────────────────┐  │
│  │          Models Layer                     │  │
│  │  - User (Mongoose Schema)                 │  │
│  │  - Equipment (Mongoose Schema)            │  │
│  │  - BorrowRequest (Mongoose Schema)        │  │
│  └──────────────┬───────────────────────────┘  │
└─────────────────┼────────────────────────────────┘
                  │
                  │ Mongoose ODM
                  │ MongoDB Driver
                  │
┌─────────────────▼────────────────────────────────┐
│               DATABASE                           │
│          MongoDB (Port: 27017)                   │
│      Database: equipment-lending                 │
│                                                  │
│  Collections:                                    │
│  - users                                         │
│  - equipments                                    │
│  - borrowrequests                                │
└──────────────────────────────────────────────────┘
```

---

## Data Flow Examples

### 1. User Login Flow
```
User (Browser)
    │
    │ POST /api/auth/login
    │ { email, password }
    ▼
Express Routes (authRoutes)
    │
    ▼
authController.login()
    │
    │ Find user by email
    │ Compare password
    ▼
MongoDB (users collection)
    │
    │ User found
    ▼
Generate JWT Token
    │
    │ Return { user, token }
    ▼
Frontend stores token
    │
    └─► All subsequent requests include token
```

### 2. Borrow Request Approval Flow
```
Staff/Admin
    │
    │ PUT /api/borrow-requests/:id/approve
    │ Header: Authorization: Bearer <token>
    ▼
Auth Middleware
    │ Verify JWT
    │ Check role (staff/admin)
    ▼
borrowRequestController.approveBorrowRequest()
    │
    │ 1. Find request
    │ 2. Check equipment availability
    │ 3. Update request status
    │ 4. Decrease equipment.available
    ▼
MongoDB
    │ Update borrowrequests collection
    │ Update equipments collection
    ▼
Return updated request
    │
    ▼
Frontend updates UI
```

### 3. Equipment Search Flow
```
User
    │
    │ GET /api/equipment?category=Lab&search=micro
    ▼
equipmentController.getAllEquipment()
    │
    │ Build query from params
    │ { category: 'Lab', name: /micro/i }
    ▼
MongoDB (equipments collection)
    │
    │ Find matching documents
    │ Populate addedBy field
    ▼
Return equipment array
    │
    ▼
Frontend displays filtered results
```

---

## Security Implementation

### Password Security
- **Hashing:** bcrypt with salt rounds = 10
- **Storage:** Only hashed passwords stored in database
- **Comparison:** bcrypt.compare() for verification

### Authentication
- **Method:** JWT (JSON Web Tokens)
- **Storage:** localStorage in browser
- **Transmission:** Authorization header: `Bearer <token>`
- **Expiry:** 7 days (configurable)

### Authorization
- **Middleware:** `protect` - Verifies JWT token
- **Middleware:** `authorize(...roles)` - Checks user role
- **Implementation:** Role-based route protection

### Input Validation
- **Server-side:** express-validator for all inputs
- **Client-side:** HTML5 validation + React form validation
- **Database:** Mongoose schema validation

---

## API Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Success message (optional)"
}
```

### Error Response
```json
{
  "message": "Error description"
}
```

### Paginated Response (if implemented)
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

---

## Database Indexing Strategy

### Current Indexes
- `users.email` - Unique index for fast lookup
- All `_id` fields - Auto-indexed by MongoDB

### Recommended for Production
- `equipments.category` - For category filtering
- `equipments.available` - For availability queries
- `borrowrequests.status` - For status filtering
- `borrowrequests.user` - For user's request lookup

---

## Backup & Data Management

### Sample Data (from seedData.js)
- 4 Users (1 admin, 1 staff, 2 students)
- 8 Equipment items across all categories
- 2 Sample borrow requests

### Reset Database
```bash
cd backend
npm run seed
```

### Backup (Manual)
```bash
mongodump --db equipment-lending --out ./backup
```

### Restore (Manual)
```bash
mongorestore --db equipment-lending ./backup/equipment-lending
```

---

This schema supports the complete equipment lending workflow with proper data relationships, validation, and security.
