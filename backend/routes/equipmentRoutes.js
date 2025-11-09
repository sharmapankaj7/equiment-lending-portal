const express = require('express');
const router = express.Router();
const {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
} = require('../controllers/equipmentController');
const { protect, authorize } = require('../middleware/auth');

/**
 * Equipment Routes
 */

// GET /api/equipment - Get all equipment (public)
// POST /api/equipment - Create equipment (admin only)
router.route('/')
  .get(getAllEquipment)
  .post(protect, authorize('admin'), createEquipment);

// GET /api/equipment/:id - Get single equipment
// PUT /api/equipment/:id - Update equipment (admin only)
// DELETE /api/equipment/:id - Delete equipment (admin only)
router.route('/:id')
  .get(getEquipmentById)
  .put(protect, authorize('admin'), updateEquipment)
  .delete(protect, authorize('admin'), deleteEquipment);

module.exports = router;
