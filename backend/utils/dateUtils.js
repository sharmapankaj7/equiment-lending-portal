// Date utility functions for equipment lending

// Calculate days between two dates
const getDaysBetween = (date1, date2) => {
  const diffTime = Math.abs(date2 - date1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Check if date is overdue
const isOverdue = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

// Check if date is due soon (within specified days)
const isDueSoon = (dueDate, daysThreshold = 2) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  if (due < today) return false; // Already overdue
  
  const daysLeft = getDaysBetween(today, due);
  return daysLeft <= daysThreshold;
};

// Get days until due (positive) or days overdue (negative)
const getDaysUntilDue = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Format date for display
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format date and time for display
const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get status based on due date
const getStatusByDueDate = (dueDate, currentStatus) => {
  if (currentStatus === 'RETURNED' || currentStatus === 'REJECTED') {
    return currentStatus;
  }
  
  if (isOverdue(dueDate)) {
    return 'OVERDUE';
  }
  
  if (isDueSoon(dueDate)) {
    return 'DUE_SOON';
  }
  
  return currentStatus;
};

// Get status color for UI
const getStatusColor = (status) => {
  const colors = {
    PENDING: '#FFA726',
    APPROVED: '#66BB6A',
    REJECTED: '#EF5350',
    RETURNED: '#42A5F5',
    OVERDUE: '#D32F2F',
    DUE_SOON: '#FF9800'
  };
  return colors[status] || '#9E9E9E';
};

// Get status label for UI
const getStatusLabel = (status) => {
  const labels = {
    PENDING: 'Pending Approval',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    RETURNED: 'Returned',
    OVERDUE: 'Overdue',
    DUE_SOON: 'Due Soon'
  };
  return labels[status] || status;
};

// Add days to a date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Get start of day
const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Get end of day
const getEndOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

module.exports = {
  getDaysBetween,
  isOverdue,
  isDueSoon,
  getDaysUntilDue,
  formatDate,
  formatDateTime,
  getStatusByDueDate,
  getStatusColor,
  getStatusLabel,
  addDays,
  getStartOfDay,
  getEndOfDay
};
