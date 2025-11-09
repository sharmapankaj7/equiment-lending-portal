const cron = require('node-cron');
const BorrowRequest = require('../models/BorrowRequest');
const Notification = require('../models/Notification');
const { sendEmail } = require('./emailService');

// Calculate days difference
const getDaysDifference = (date1, date2) => {
  const diffTime = date1 - date2;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Check for upcoming due dates and send reminders
const checkDueReminders = async () => {
  try {
    console.log('🔍 Checking for equipment due reminders...');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 2); // Check 2 days ahead
    
    // Find approved requests that are due within 2 days
    const upcomingDue = await BorrowRequest.find({
      status: 'APPROVED',
      dueDate: {
        $gte: today,
        $lte: tomorrow
      }
    })
    .populate('user', 'name email')
    .populate('equipment', 'name');
    
    console.log(`Found ${upcomingDue.length} equipment items due soon`);
    
    for (const request of upcomingDue) {
      const daysLeft = getDaysDifference(new Date(request.dueDate), today);
      
      // Check if reminder already sent today
      const existingNotification = await Notification.findOne({
        user: request.user._id,
        borrowRequest: request._id,
        type: 'DUE_REMINDER',
        createdAt: { $gte: today }
      });
      
      if (!existingNotification) {
        // Create notification
        const notification = await Notification.create({
          user: request.user._id,
          type: 'DUE_REMINDER',
          title: 'Equipment Due Soon',
          message: `${request.equipment.name} is due for return in ${daysLeft} day(s)`,
          borrowRequest: request._id,
          equipment: request.equipment._id
        });
        
        // Send email
        const emailResult = await sendEmail(
          request.user.email,
          'DUE_REMINDER',
          request.user.name,
          request.equipment.name,
          request.dueDate,
          daysLeft
        );
        
        if (emailResult.success) {
          notification.emailSent = true;
          notification.emailSentAt = new Date();
          await notification.save();
          console.log(`✅ Reminder sent to ${request.user.email} for ${request.equipment.name}`);
        }
      }
    }
  } catch (error) {
    console.error('Error checking due reminders:', error);
  }
};

// Check for overdue items and send alerts
const checkOverdueItems = async () => {
  try {
    console.log('🚨 Checking for overdue equipment...');
    
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    // Find approved requests that are overdue
    const overdueItems = await BorrowRequest.find({
      status: 'APPROVED',
      dueDate: { $lt: today }
    })
    .populate('user', 'name email')
    .populate('equipment', 'name');
    
    console.log(`Found ${overdueItems.length} overdue items`);
    
    for (const request of overdueItems) {
      const daysOverdue = getDaysDifference(today, new Date(request.dueDate));
      
      // Update status to overdue if not already
      if (request.status !== 'OVERDUE') {
        request.status = 'OVERDUE';
        await request.save();
      }
      
      // Check if alert already sent today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const existingNotification = await Notification.findOne({
        user: request.user._id,
        borrowRequest: request._id,
        type: 'OVERDUE_ALERT',
        createdAt: { $gte: todayStart }
      });
      
      if (!existingNotification) {
        // Create notification
        const notification = await Notification.create({
          user: request.user._id,
          type: 'OVERDUE_ALERT',
          title: 'Equipment Overdue',
          message: `${request.equipment.name} is ${daysOverdue} day(s) overdue`,
          borrowRequest: request._id,
          equipment: request.equipment._id
        });
        
        // Send email alert
        const emailResult = await sendEmail(
          request.user.email,
          'OVERDUE_ALERT',
          request.user.name,
          request.equipment.name,
          request.dueDate,
          daysOverdue
        );
        
        if (emailResult.success) {
          notification.emailSent = true;
          notification.emailSentAt = new Date();
          await notification.save();
          console.log(`🚨 Overdue alert sent to ${request.user.email} for ${request.equipment.name}`);
        }
      }
    }
  } catch (error) {
    console.error('Error checking overdue items:', error);
  }
};

// Initialize cron jobs
const initializeNotificationScheduler = () => {
  // Check for due reminders every day at 8 AM
  cron.schedule('0 8 * * *', () => {
    console.log('⏰ Running scheduled due date reminder check...');
    checkDueReminders();
  });
  
  // Check for overdue items every day at 9 AM
  cron.schedule('0 9 * * *', () => {
    console.log('⏰ Running scheduled overdue check...');
    checkOverdueItems();
  });
  
  console.log('✅ Notification scheduler initialized');
  console.log('  - Due reminders: Daily at 8:00 AM');
  console.log('  - Overdue checks: Daily at 9:00 AM');
};

// Manual trigger functions for testing
const triggerDueReminders = async () => {
  console.log('🔧 Manually triggering due reminders...');
  await checkDueReminders();
};

const triggerOverdueCheck = async () => {
  console.log('🔧 Manually triggering overdue check...');
  await checkOverdueItems();
};

module.exports = {
  initializeNotificationScheduler,
  checkDueReminders,
  checkOverdueItems,
  triggerDueReminders,
  triggerOverdueCheck
};
