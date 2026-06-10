# Email Setup Guide for UrbanEye

## 📧 Automated Email Notifications

UrbanEye automatically sends email notifications to local authorities when:
1. **Poll threshold reached** (50% community approval)
2. **Issue resolved** (status updated to resolved)

### 🔧 Email Configuration

#### **Current Setup:**
- **From Email**: `hem_writess@gmail.com`
- **To Email**: `apurbaofficial8097@gmail.com`
- **Subject**: `🚨 URGENT: Road Issue Requires Immediate Attention`

#### **Email Content Includes:**
- Issue details (title, type, severity, location)
- Community poll results
- AI analysis results
- Recommended actions
- Issue ID and reporting information

### 🚀 Production Email Setup Options

#### **Option 1: SendGrid (Recommended)**
```bash
npm install @sendgrid/mail
```

Create `.env.local`:
```env
SENDGRID_API_KEY=your_sendgrid_api_key
```

Update `src/services/emailService.ts`:
```typescript
// Uncomment SendGrid code in sendEmailViaService method
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
return await sgMail.send(emailData);
```

#### **Option 2: Gmail SMTP with Nodemailer**
```bash
npm install nodemailer
```

Create `.env.local`:
```env
GMAIL_APP_PASSWORD=your_gmail_app_password
```

Update `src/services/emailService.ts`:
```typescript
// Uncomment Nodemailer code in sendEmailViaService method
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'hem_writess@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  }
});
return await transporter.sendMail(emailData);
```

#### **Option 3: Firebase Functions**
Create Firebase Function in `functions/index.js`:
```javascript
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

exports.sendEmailNotification = functions.firestore
  .document('issues/{issueId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();
    
    // Check if poll threshold was just reached
    if (newData.publicVoting.emailSent && !previousData.publicVoting.emailSent) {
      // Send email logic here
    }
  });
```

### 📋 Gmail App Password Setup

To use Gmail SMTP, you need an App Password:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Go to Google Account Settings** → Security
3. **Generate App Password** for "Mail"
4. **Use the generated password** in your environment variables

### 🧪 Testing Email System

#### **Development Mode:**
- Emails are logged to console
- No actual emails sent
- Simulates email delays

#### **Production Mode:**
- Real emails sent to authorities
- Full email tracking
- Error handling and retries

### 📊 Email Templates

#### **Poll Threshold Email:**
- **Subject**: `🚨 URGENT: Road Issue Requires Immediate Attention`
- **Content**: Issue details, poll results, AI analysis, recommended actions

#### **Resolution Email:**
- **Subject**: `✅ RESOLVED: Road Issue Fixed`
- **Content**: Issue details, resolution confirmation

### 🔍 Monitoring Email Status

#### **In Firebase Console:**
- Check `emailSent` field in issues collection
- View `emailId` for tracking
- Monitor `emailSentAt` timestamp

#### **In Application:**
- Email status shown in issue details
- Console logs for email operations
- Error handling for failed emails

### ⚙️ Environment Variables

Add to `.env.local`:
```env
# Email Configuration
VITE_EMAIL_FROM=hem_writess@gmail.com
VITE_EMAIL_TO=apurbaofficial8097@gmail.com
VITE_EMAIL_SERVICE=sendgrid  # or 'gmail' or 'firebase'

# Service-specific keys
SENDGRID_API_KEY=your_key_here
GMAIL_APP_PASSWORD=your_app_password_here
```

### 🎯 Next Steps

1. **Choose email service** (SendGrid recommended)
2. **Set up API keys** and environment variables
3. **Test email functionality** in development
4. **Deploy to production** with real email service
5. **Monitor email delivery** and success rates

### 📞 Support

For email setup issues:
- Check console logs for errors
- Verify API keys and permissions
- Test with simple email first
- Contact: hem_writess@gmail.com

This automated email system ensures local authorities are immediately notified when community issues require attention! 🚀 