const Equipment = require('../models/Equipment');
const BorrowRequest = require('../models/BorrowRequest');
const User = require('../models/User');
const { isOverdue, getStartOfDay, getEndOfDay } = require('../utils/dateUtils');

// Get dashboard analytics
const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.role === 'student' ? req.user.userId : null;
    
    // Total equipment count
    const totalEquipment = await Equipment.countDocuments();
    
    // Available equipment
    const availableEquipment = await Equipment.countDocuments({ isAvailable: true });
    
    // Active borrows
    const activeBorrows = await BorrowRequest.countDocuments({
      status: 'APPROVED',
      ...(userId && { user: userId })
    });
    
    // Pending requests
    const pendingRequests = await BorrowRequest.countDocuments({
      status: 'PENDING',
      ...(userId && { user: userId })
    });
    
    // Overdue items
    const today = getEndOfDay();
    const overdueItems = await BorrowRequest.countDocuments({
      status: 'APPROVED',
      dueDate: { $lt: today },
      ...(userId && { user: userId })
    });
    
    // Total returns
    const totalReturns = await BorrowRequest.countDocuments({
      status: 'RETURNED',
      ...(userId && { user: userId })
    });
    
    res.json({
      success: true,
      analytics: {
        totalEquipment,
        availableEquipment,
        borrowedEquipment: totalEquipment - availableEquipment,
        activeBorrows,
        pendingRequests,
        overdueItems,
        totalReturns
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

// Get equipment usage statistics
const getEquipmentUsage = async (req, res) => {
  try {
    // Most borrowed equipment
    const mostBorrowed = await BorrowRequest.aggregate([
      {
        $match: {
          status: { $in: ['APPROVED', 'RETURNED'] }
        }
      },
      {
        $group: {
          _id: '$equipment',
          borrowCount: { $sum: 1 }
        }
      },
      {
        $sort: { borrowCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'equipments',
          localField: '_id',
          foreignField: '_id',
          as: 'equipmentDetails'
        }
      },
      {
        $unwind: '$equipmentDetails'
      },
      {
        $project: {
          name: '$equipmentDetails.name',
          category: '$equipmentDetails.category',
          borrowCount: 1
        }
      }
    ]);
    
    // Equipment by category
    const byCategory = await Equipment.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          available: {
            $sum: { $cond: ['$isAvailable', 1, 0] }
          }
        }
      },
      {
        $project: {
          category: '$_id',
          total: '$count',
          available: 1,
          borrowed: { $subtract: ['$count', '$available'] }
        }
      }
    ]);
    
    res.json({
      success: true,
      usage: {
        mostBorrowed,
        byCategory
      }
    });
  } catch (error) {
    console.error('Equipment usage error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching equipment usage',
      error: error.message
    });
  }
};

// Get request trends
const getRequestTrends = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    // Requests over time
    const requestsByDay = await BorrowRequest.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ['$status', 'APPROVED'] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$status', 'REJECTED'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Status distribution
    const statusDistribution = await BorrowRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      trends: {
        requestsByDay,
        statusDistribution
      }
    });
  } catch (error) {
    console.error('Request trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching request trends',
      error: error.message
    });
  }
};

// Get user statistics (admin only)
const getUserStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'student' });
    const staffCount = await User.countDocuments({ role: 'staff' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    // Top borrowers
    const topBorrowers = await BorrowRequest.aggregate([
      {
        $match: {
          status: { $in: ['APPROVED', 'RETURNED'] }
        }
      },
      {
        $group: {
          _id: '$user',
          borrowCount: { $sum: 1 }
        }
      },
      {
        $sort: { borrowCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          name: '$userDetails.name',
          email: '$userDetails.email',
          role: '$userDetails.role',
          borrowCount: 1
        }
      }
    ]);
    
    res.json({
      success: true,
      statistics: {
        totalUsers,
        studentCount,
        staffCount,
        adminCount,
        topBorrowers
      }
    });
  } catch (error) {
    console.error('User statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
};

// Get overdue report
const getOverdueReport = async (req, res) => {
  try {
    const today = getEndOfDay();
    
    const overdueRequests = await BorrowRequest.find({
      status: 'APPROVED',
      dueDate: { $lt: today }
    })
    .populate('user', 'name email role')
    .populate('equipment', 'name category')
    .sort({ dueDate: 1 });
    
    const overdueWithDetails = overdueRequests.map(request => {
      const daysOverdue = Math.ceil((today - new Date(request.dueDate)) / (1000 * 60 * 60 * 24));
      return {
        ...request.toObject(),
        daysOverdue
      };
    });
    
    res.json({
      success: true,
      count: overdueRequests.length,
      overdueItems: overdueWithDetails
    });
  } catch (error) {
    console.error('Overdue report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching overdue report',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  getEquipmentUsage,
  getRequestTrends,
  getUserStatistics,
  getOverdueReport
};
