# Equipment Lending Portal - API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@school.edu",
  "password": "password123",
  "role": "student",
  "studentId": "STU001",
  "department": "Computer Science"
}
```

**Response:** `201 Created`
```json
{
  "_id": "64abc123...",
  "name": "John Doe",
  "email": "john@school.edu",
  "role": "student",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@school.edu",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "_id": "64abc123...",
  "name": "John Doe",
  "email": "john@school.edu",
  "role": "student",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response:** `401 Unauthorized`
```json
{
  "message": "Invalid credentials"
}
```

---

### Get Current User
**GET** `/auth/me`

Get logged-in user profile.

**Headers:** 
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "_id": "64abc123...",
  "name": "John Doe",
  "email": "john@school.edu",
  "role": "student",
  "studentId": "STU001",
  "department": "Computer Science",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Equipment Endpoints

### Get All Equipment
**GET** `/equipment`

Get list of all equipment with optional filters.

**Query Parameters:**
- `search` (string): Search by equipment name
- `category` (string): Filter by category
- `availability` (string): "available" to show only available items

**Example:**
```
GET /equipment?category=Lab Equipment&availability=available
```

**Response:** `200 OK`
```json
[
  {
    "_id": "64def456...",
    "name": "Microscope",
    "category": "Lab Equipment",
    "description": "Compound microscope for biology lab",
    "condition": "Excellent",
    "quantity": 8,
    "available": 6,
    "imageUrl": "",
    "addedBy": {
      "_id": "64abc123...",
      "name": "Admin User",
      "email": "admin@school.edu"
    },
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
]
```

---

### Get Equipment by ID
**GET** `/equipment/:id`

Get detailed information about a specific equipment.

**Response:** `200 OK`
```json
{
  "_id": "64def456...",
  "name": "Microscope",
  "category": "Lab Equipment",
  "description": "Compound microscope for biology lab",
  "condition": "Excellent",
  "quantity": 8,
  "available": 6,
  "imageUrl": "",
  "addedBy": {
    "_id": "64abc123...",
    "name": "Admin User",
    "email": "admin@school.edu"
  },
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "message": "Equipment not found"
}
```

---

### Create Equipment
**POST** `/equipment`

Create new equipment (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Arduino Kit",
  "category": "Project Materials",
  "description": "Arduino starter kit with sensors",
  "condition": "Excellent",
  "quantity": 10,
  "imageUrl": "https://example.com/arduino.jpg"
}
```

**Response:** `201 Created`
```json
{
  "_id": "64ghi789...",
  "name": "Arduino Kit",
  "category": "Project Materials",
  "description": "Arduino starter kit with sensors",
  "condition": "Excellent",
  "quantity": 10,
  "available": 10,
  "imageUrl": "https://example.com/arduino.jpg",
  "addedBy": "64abc123...",
  "createdAt": "2024-01-16T12:00:00.000Z",
  "updatedAt": "2024-01-16T12:00:00.000Z"
}
```

**Error Response:** `403 Forbidden`
```json
{
  "message": "User role 'student' is not authorized to access this route"
}
```

---

### Update Equipment
**PUT** `/equipment/:id`

Update equipment details (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:** (all fields optional)
```json
{
  "name": "Arduino Kit Pro",
  "description": "Updated description",
  "condition": "Good",
  "quantity": 12
}
```

**Response:** `200 OK`
```json
{
  "_id": "64ghi789...",
  "name": "Arduino Kit Pro",
  "category": "Project Materials",
  "description": "Updated description",
  "condition": "Good",
  "quantity": 12,
  "available": 12,
  ...
}
```

---

### Delete Equipment
**DELETE** `/equipment/:id`

Delete equipment (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`
```json
{
  "message": "Equipment removed"
}
```

---

## Borrow Request Endpoints

### Get All Borrow Requests
**GET** `/borrow-requests`

Get borrow requests (filtered by user role).
- Students see only their own requests
- Staff/Admin see all requests

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (string): Filter by status (pending, approved, rejected, returned)

**Response:** `200 OK`
```json
[
  {
    "_id": "64jkl012...",
    "equipment": {
      "_id": "64def456...",
      "name": "Microscope",
      "category": "Lab Equipment",
      "condition": "Excellent"
    },
    "user": {
      "_id": "64abc123...",
      "name": "John Doe",
      "email": "john@school.edu",
      "studentId": "STU001"
    },
    "quantity": 1,
    "status": "pending",
    "requestDate": "2024-01-16T14:00:00.000Z",
    "expectedReturnDate": "2024-01-23T00:00:00.000Z",
    "purpose": "Biology lab experiment",
    "approvedBy": null,
    "borrowDate": null,
    "actualReturnDate": null,
    "rejectionReason": "",
    "notes": ""
  }
]
```

---

### Get Borrow Request by ID
**GET** `/borrow-requests/:id`

Get detailed information about a specific borrow request.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "_id": "64jkl012...",
  "equipment": { ... },
  "user": { ... },
  "quantity": 1,
  "status": "approved",
  "requestDate": "2024-01-16T14:00:00.000Z",
  "borrowDate": "2024-01-16T15:00:00.000Z",
  "expectedReturnDate": "2024-01-23T00:00:00.000Z",
  "purpose": "Biology lab experiment",
  "approvedBy": {
    "_id": "64mno345...",
    "name": "Staff User",
    "email": "staff@school.edu"
  },
  "notes": ""
}
```

---

### Create Borrow Request
**POST** `/borrow-requests`

Create a new borrow request.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "equipmentId": "64def456...",
  "quantity": 1,
  "expectedReturnDate": "2024-01-23",
  "purpose": "Final year project demonstration"
}
```

**Response:** `201 Created`
```json
{
  "_id": "64pqr678...",
  "equipment": { ... },
  "user": { ... },
  "quantity": 1,
  "status": "pending",
  "requestDate": "2024-01-16T16:00:00.000Z",
  "expectedReturnDate": "2024-01-23T00:00:00.000Z",
  "purpose": "Final year project demonstration"
}
```

**Error Responses:**

`400 Bad Request` - Insufficient quantity
```json
{
  "message": "Only 2 units available"
}
```

`400 Bad Request` - Overlapping request
```json
{
  "message": "You already have a pending/active request for this equipment"
}
```

---

### Approve Borrow Request
**PUT** `/borrow-requests/:id/approve`

Approve a pending borrow request (Staff/Admin only).

**Headers:**
```
Authorization: Bearer <staff_or_admin_token>
```

**Response:** `200 OK`
```json
{
  "_id": "64jkl012...",
  "status": "approved",
  "borrowDate": "2024-01-16T17:00:00.000Z",
  "approvedBy": {
    "_id": "64mno345...",
    "name": "Staff User",
    "email": "staff@school.edu"
  },
  ...
}
```

**Error Response:** `400 Bad Request`
```json
{
  "message": "Request already processed"
}
```

---

### Reject Borrow Request
**PUT** `/borrow-requests/:id/reject`

Reject a pending borrow request (Staff/Admin only).

**Headers:**
```
Authorization: Bearer <staff_or_admin_token>
```

**Request Body:**
```json
{
  "reason": "Equipment is currently under maintenance"
}
```

**Response:** `200 OK`
```json
{
  "_id": "64jkl012...",
  "status": "rejected",
  "rejectionReason": "Equipment is currently under maintenance",
  "approvedBy": { ... },
  ...
}
```

---

### Mark as Returned
**PUT** `/borrow-requests/:id/return`

Mark equipment as returned (Staff/Admin only).

**Headers:**
```
Authorization: Bearer <staff_or_admin_token>
```

**Request Body:** (optional)
```json
{
  "notes": "Equipment returned in good condition"
}
```

**Response:** `200 OK`
```json
{
  "_id": "64jkl012...",
  "status": "returned",
  "actualReturnDate": "2024-01-22T10:00:00.000Z",
  "notes": "Equipment returned in good condition",
  ...
}
```

---

## Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Equipment Categories

Valid equipment categories:
- `Sports Equipment`
- `Lab Equipment`
- `Cameras/Electronics`
- `Musical Instruments`
- `Project Materials`
- `Other`

## Equipment Conditions

Valid equipment conditions:
- `Excellent`
- `Good`
- `Fair`
- `Poor`

## User Roles

- `student` - Can browse equipment and create borrow requests
- `staff` - Can approve/reject requests and mark as returned
- `admin` - Full access to all features including equipment management

## Request Status Flow

```
pending → approved → returned
   ↓
rejected
```

---

## Error Handling

All errors return a JSON object with a `message` field:

```json
{
  "message": "Error description here"
}
```

For validation errors, the message includes details about the invalid field.

---

## Testing the API

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@school.edu","password":"student123"}'

# Get equipment (with token)
curl -X GET http://localhost:5000/api/equipment \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Create a new request
2. Set method and URL
3. Add headers: `Authorization: Bearer <token>`
4. Add request body (if needed)
5. Send request

---

**Note**: Replace `YOUR_TOKEN_HERE` and IDs with actual values from your application.
