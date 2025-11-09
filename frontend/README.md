# Equipment Lending Portal - Frontend

React-based frontend application for the School Equipment Lending Portal.

## Features

- **User Authentication**: Login and registration with role-based access
- **Dashboard**: Browse and search equipment catalog
- **Equipment Details**: View detailed information and submit borrow requests
- **Admin Panel**: Manage equipment (add, edit, delete)
- **Request Management**: Approve, reject, and track borrow requests (staff/admin)
- **User Profile**: View personal information and request history
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **React** 18.2.0
- **React Router** 6.20.0
- **Axios** for API calls
- **Vite** as build tool

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL (default is http://localhost:5000)

4. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

### Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/             # Static files
├── src/
│   ├── components/     # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── EquipmentCard.jsx
│   │   └── PrivateRoute.jsx
│   ├── pages/          # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EquipmentDetail.jsx
│   │   ├── AdminPanel.jsx
│   │   ├── RequestManagement.jsx
│   │   └── UserProfile.jsx
│   ├── context/        # React context
│   │   └── AuthContext.jsx
│   ├── services/       # API services
│   │   └── api.js
│   ├── App.jsx         # Main app component
│   ├── App.css         # App styles
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## User Roles

- **Student**: Can browse equipment and submit borrow requests
- **Staff**: Can approve/reject requests and manage returns
- **Admin**: Full access to equipment management and request handling

## Default Credentials

Use these credentials to test the application (after seeding the backend database):

- **Admin**: admin@school.edu / admin123
- **Staff**: staff@school.edu / staff123
- **Student**: john@school.edu / student123

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Integration

The frontend communicates with the backend API running on `http://localhost:5000` by default. The API base URL can be configured in the `.env` file.

### API Endpoints Used

- **Auth**: `/api/auth/login`, `/api/auth/register`, `/api/auth/me`
- **Equipment**: `/api/equipment`, `/api/equipment/:id`
- **Borrow Requests**: `/api/borrow-requests`, `/api/borrow-requests/:id/*`

## Features by Role

### Student Features
- Browse equipment catalog
- Search and filter equipment
- View equipment details
- Submit borrow requests
- View request history
- Track request status

### Staff/Admin Features
- All student features
- Approve/reject borrow requests
- Mark equipment as returned
- View all requests

### Admin Only Features
- Add new equipment
- Edit equipment details
- Delete equipment
- Manage inventory

## Styling

The application uses CSS custom properties (CSS variables) for theming and maintains a consistent design system with:

- Primary color: Blue (#2563eb)
- Success color: Green (#10b981)
- Warning color: Orange (#f59e0b)
- Danger color: Red (#ef4444)

All components are fully responsive and optimized for mobile devices.
