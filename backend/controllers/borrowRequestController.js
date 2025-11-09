const BorrowRequest = require('../models/BorrowRequest');
const Equipment = require('../models/Equipment');

/**
 * @desc    Create a new borrow request
 * @route   POST /api/borrow-requests
 * @access  Private
 */
const createBorrowRequest = async (req, res) => {
  try {
    const { equipmentId, quantity, expectedReturnDate, purpose } = req.body;

    // Check if equipment exists and has sufficient quantity
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    if (equipment.available < quantity) {
      return res.status(400).json({ 
        message: `Only ${equipment.available} units available` 
      });
    }

    // Check for overlapping requests for same equipment
    const overlappingRequest = await BorrowRequest.findOne({
      equipment: equipmentId,
      user: req.user._id,
      status: { $in: ['pending', 'approved', 'borrowed'] }
    });

    if (overlappingRequest) {
      return res.status(400).json({ 
        message: 'You already have a pending/active request for this equipment' 
      });
    }

    const borrowRequest = await BorrowRequest.create({
      equipment: equipmentId,
      user: req.user._id,
      quantity,
      expectedReturnDate,
      purpose
    });

    const populatedRequest = await BorrowRequest.findById(borrowRequest._id)
      .populate('equipment', 'name category')
      .populate('user', 'name email');

    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Get all borrow requests (filtered by role)
 * @route   GET /api/borrow-requests
 * @access  Private
 */
const getAllBorrowRequests = async (req, res) => {
  try {
    let query = {};

    // Students can only see their own requests
    if (req.user.role === 'student') {
      query.user = req.user._id;
    }

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    const requests = await BorrowRequest.find(query)
      .populate('equipment', 'name category condition')
      .populate('user', 'name email studentId')
      .populate('approvedBy', 'name email')
      .sort({ requestDate: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single borrow request
 * @route   GET /api/borrow-requests/:id
 * @access  Private
 */
const getBorrowRequestById = async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id)
      .populate('equipment', 'name category condition')
      .populate('user', 'name email studentId')
      .populate('approvedBy', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Students can only view their own requests
    if (req.user.role === 'student' && request.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Approve borrow request
 * @route   PUT /api/borrow-requests/:id/approve
 * @access  Private (Staff/Admin)
 */
const approveBorrowRequest = async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    // Check equipment availability again
    const equipment = await Equipment.findById(request.equipment);
    if (equipment.available < request.quantity) {
      return res.status(400).json({ 
        message: 'Equipment no longer available in requested quantity' 
      });
    }

    // Update equipment availability
    equipment.available -= request.quantity;
    await equipment.save();

    // Update request status
    request.status = 'approved';
    request.approvedBy = req.user._id;
    request.borrowDate = new Date();

    await request.save();

    const populatedRequest = await BorrowRequest.findById(request._id)
      .populate('equipment', 'name category')
      .populate('user', 'name email')
      .populate('approvedBy', 'name email');

    res.json(populatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Reject borrow request
 * @route   PUT /api/borrow-requests/:id/reject
 * @access  Private (Staff/Admin)
 */
const rejectBorrowRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    const request = await BorrowRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    request.status = 'rejected';
    request.approvedBy = req.user._id;
    request.rejectionReason = reason;

    await request.save();

    const populatedRequest = await BorrowRequest.findById(request._id)
      .populate('equipment', 'name category')
      .populate('user', 'name email')
      .populate('approvedBy', 'name email');

    res.json(populatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Mark equipment as returned
 * @route   PUT /api/borrow-requests/:id/return
 * @access  Private (Staff/Admin)
 */
const markAsReturned = async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved requests can be marked as returned' });
    }

    // Update equipment availability
    const equipment = await Equipment.findById(request.equipment);
    equipment.available += request.quantity;
    await equipment.save();

    // Update request status
    request.status = 'returned';
    request.actualReturnDate = new Date();
    if (req.body.notes) {
      request.notes = req.body.notes;
    }

    await request.save();

    const populatedRequest = await BorrowRequest.findById(request._id)
      .populate('equipment', 'name category')
      .populate('user', 'name email')
      .populate('approvedBy', 'name email');

    res.json(populatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createBorrowRequest,
  getAllBorrowRequests,
  getBorrowRequestById,
  approveBorrowRequest,
  rejectBorrowRequest,
  markAsReturned
};
