const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  // For development, use Gmail (requires app-specific password)
  // For production, use a service like SendGrid, AWS SES, etc.
  
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  
  // Default to test account for development
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Email templates
const emailTemplates = {
  REQUEST_APPROVED: (userName, equipmentName, dueDate) => ({
    subject: '✅ Equipment Request Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h2 style="color: #4CAF50; margin-top: 0;">Request Approved!</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Good news! Your request for <strong>${equipmentName}</strong> has been approved.</p>
          <div style="background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Equipment:</strong> ${equipmentName}</p>
            <p style="margin: 5px 0;"><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
          </div>
          <p><strong>Important:</strong> Please return the equipment by the due date to avoid overdue penalties.</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            Equipment Lending Portal Team
          </p>
        </div>
      </div>
    `
  }),
  
  REQUEST_REJECTED: (userName, equipmentName, reason) => ({
    subject: '❌ Equipment Request Status',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h2 style="color: #f44336; margin-top: 0;">Request Status Update</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>We regret to inform you that your request for <strong>${equipmentName}</strong> could not be approved at this time.</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          <p>You can submit a new request for other available equipment or try again later.</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            Equipment Lending Portal Team
          </p>
        </div>
      </div>
    `
  }),
  
  DUE_REMINDER: (userName, equipmentName, dueDate, daysLeft) => ({
    subject: '⏰ Equipment Due Soon - Reminder',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h2 style="color: #FF9800; margin-top: 0;">⏰ Return Reminder</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>This is a friendly reminder that the following equipment is due for return soon:</p>
          <div style="background-color: #fff3e0; padding: 15px; border-left: 4px solid #FF9800; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Equipment:</strong> ${equipmentName}</p>
            <p style="margin: 5px 0;"><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
            <p style="margin: 5px 0; color: #F57C00;"><strong>Days Remaining:</strong> ${daysLeft}</p>
          </div>
          <p>Please plan to return the equipment on time to avoid overdue status.</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            Equipment Lending Portal Team
          </p>
        </div>
      </div>
    `
  }),
  
  OVERDUE_ALERT: (userName, equipmentName, dueDate, daysOverdue) => ({
    subject: '🚨 OVERDUE: Equipment Return Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h2 style="color: #D32F2F; margin-top: 0;">🚨 Equipment Overdue</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p><strong>URGENT:</strong> The following equipment is now overdue for return:</p>
          <div style="background-color: #ffebee; padding: 15px; border-left: 4px solid #D32F2F; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Equipment:</strong> ${equipmentName}</p>
            <p style="margin: 5px 0;"><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
            <p style="margin: 5px 0; color: #D32F2F;"><strong>Days Overdue:</strong> ${daysOverdue}</p>
          </div>
          <p><strong>Action Required:</strong> Please return the equipment immediately to avoid further penalties.</p>
          <p>Contact the equipment office if you need assistance or an extension.</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            Equipment Lending Portal Team
          </p>
        </div>
      </div>
    `
  }),
  
  RETURN_CONFIRMATION: (userName, equipmentName, returnDate) => ({
    subject: '✅ Equipment Return Confirmed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h2 style="color: #4CAF50; margin-top: 0;">Return Confirmed</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Thank you! We have successfully received the following equipment:</p>
          <div style="background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Equipment:</strong> ${equipmentName}</p>
            <p style="margin: 5px 0;"><strong>Return Date:</strong> ${new Date(returnDate).toLocaleDateString()}</p>
          </div>
          <p>The equipment has been checked and marked as returned in our system.</p>
          <p>Thank you for using our equipment lending service!</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            Equipment Lending Portal Team
          </p>
        </div>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, template, ...args) => {
  try {
    const transporter = createTransporter();
    const emailContent = emailTemplates[template](...args);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Equipment Lending Portal <noreply@equipmentportal.com>',
      to,
      subject: emailContent.subject,
      html: emailContent.html
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email service is configured correctly');
    return true;
  } catch (error) {
    console.error('❌ Email service configuration error:', error.message);
    return false;
  }
};

module.exports = {
  sendEmail,
  verifyEmailConfig,
  emailTemplates
};
