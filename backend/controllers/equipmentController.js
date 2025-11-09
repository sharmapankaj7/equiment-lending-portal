const Equipment = require('../models/Equipment');

/**
 * @desc    Get all equipment with optional filters
 * @route   GET /api/equipment
 * @access  Public
 */
const getAllEquipment = async (req, res) => {
  try {
    const { category, search, availability } = req.query;
    
    // Build query
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (availability === 'available') {
      query.available = { $gt: 0 };
    }
    
    const equipment = await Equipment.find(query)
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single equipment by ID
 * @route   GET /api/equipment/:id
 * @access  Public
 */
const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('addedBy', 'name email');
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create new equipment
 * @route   POST /api/equipment
 * @access  Private (Admin only)
 */
const createEquipment = async (req, res) => {
  try {
    const { name, category, description, condition, quantity, imageUrl } = req.body;
    
    const equipment = await Equipment.create({
      name,
      category,
      description,
      condition,
      quantity,
      available: quantity,
      imageUrl,
      addedBy: req.user._id
    });
    
    res.status(201).json(equipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Update equipment
 * @route   PUT /api/equipment/:id
 * @access  Private (Admin only)
 */
const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    const { name, category, description, condition, quantity, imageUrl } = req.body;
    
    // Update fields
    equipment.name = name || equipment.name;
    equipment.category = category || equipment.category;
    equipment.description = description !== undefined ? description : equipment.description;
    equipment.condition = condition || equipment.condition;
    equipment.imageUrl = imageUrl !== undefined ? imageUrl : equipment.imageUrl;
    
    // If quantity is updated, adjust available accordingly
    if (quantity !== undefined) {
      const difference = quantity - equipment.quantity;
      equipment.quantity = quantity;
      equipment.available = Math.max(0, equipment.available + difference);
    }
    
    const updatedEquipment = await equipment.save();
    res.json(updatedEquipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Delete equipment
 * @route   DELETE /api/equipment/:id
 * @access  Private (Admin only)
 */
const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    await equipment.deleteOne();
    res.json({ message: 'Equipment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
};
