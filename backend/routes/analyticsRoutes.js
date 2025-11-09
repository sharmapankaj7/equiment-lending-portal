const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getEquipmentUsage,
  getRequestTrends,
  getUserStatistics,
  getOverdueReport
} = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Dashboard analytics - accessible to all authenticated users
router.get('/dashboard', getDashboardAnalytics);

// Equipment usage statistics - accessible to all
router.get('/equipment-usage', getEquipmentUsage);

// Request trends - accessible to all
router.get('/request-trends', getRequestTrends);

// User statistics - admin only
router.get('/user-statistics', authorize(['admin']), getUserStatistics);

// Overdue report - admin and staff
router.get('/overdue-report', authorize(['admin', 'staff']), getOverdueReport);

module.exports = router;
