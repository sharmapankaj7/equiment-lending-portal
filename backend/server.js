const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');
const { initializeNotificationScheduler } = require('./utils/notificationService');
const { verifyEmailConfig } = require('./utils/emailService');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Initialize notification scheduler (Phase 2 Enhancement)
initializeNotificationScheduler();

// Verify email configuration (Phase 2 Enhancement)
verifyEmailConfig();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/equipment', require('./routes/equipmentRoutes'));
app.use('/api/borrow-requests', require('./routes/borrowRequestRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes')); // Phase 2 Enhancement

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Equipment Lending Portal API is running', status: 'OK' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Equipment Lending Portal API - Phase 2 Enhanced',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      equipment: '/api/equipment',
      borrowRequests: '/api/borrow-requests',
      analytics: '/api/analytics'
    },
    enhancements: {
      notifications: 'Automatic email notifications enabled',
      overdueTracking: 'Daily overdue equipment checks',
      analytics: 'Equipment usage and trend analytics'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
