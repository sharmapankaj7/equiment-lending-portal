const express = require('express');
const router = express.Router();
const {
  createBorrowRequest,
  getAllBorrowRequests,
  getBorrowRequestById,
  approveBorrowRequest,
  rejectBorrowRequest,
  markAsReturned
} = require('../controllers/borrowRequestController');
const { protect, authorize } = require('../middleware/auth');

/**
 * Borrow Request Routes
 */

// All routes require authentication
router.use(protect);

// GET /api/borrow-requests - Get all requests
// POST /api/borrow-requests - Create new request
router.route('/')
  .get(getAllBorrowRequests)
  .post(createBorrowRequest);

// GET /api/borrow-requests/:id - Get single request
router.get('/:id', getBorrowRequestById);

// PUT /api/borrow-requests/:id/approve - Approve request (staff/admin)
router.put('/:id/approve', authorize('staff', 'admin'), approveBorrowRequest);

// PUT /api/borrow-requests/:id/reject - Reject request (staff/admin)
router.put('/:id/reject', authorize('staff', 'admin'), rejectBorrowRequest);

// PUT /api/borrow-requests/:id/return - Mark as returned (staff/admin)
router.put('/:id/return', authorize('staff', 'admin'), markAsReturned);

module.exports = router;
