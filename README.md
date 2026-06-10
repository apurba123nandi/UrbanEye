# UrbanEye Hyderabad - Complete Civic Issue Reporting Platform

A comprehensive web application for citizens to report road issues in Hyderabad with AI-powered image verification, community voting, and automated authority notification.

## 🚀 Features

### 🔐 Authentication System
- **Firebase Authentication** with email/password
- **Secure Signup/Login** with username customization
- **Anonymized User Experience** - only usernames are displayed
- **User Dropdown** with "Edit Username" and "Logout" options only

### 📍 Hyderabad-Focused Mapping
- **Auto-location Detection** with permission handling
- **Hyderabad Center** as default map location
- **Distance Validation** - checks if user is within Hyderabad area
- **Real-time Location Updates** with user-friendly error messages

### 🤖 AI-Powered Image Verification
- **Real AI Image Analysis** using TensorFlow.js and Sharp
- **Comprehensive Detection** of fake, AI-generated, and manipulated images
- **Metadata Analysis** including GPS, camera info, and creation date
- **Compression Artifact Detection** for quality assessment
- **Noise Pattern Analysis** for authenticity verification
- **Automatic Rejection** of reports with suspicious images
- **Genuine Image Auto-Approval** with instant poll creation
- **Road Damage Detection** with severity assessment

### 🗳️ Community Voting System
- **Automatic Poll Creation** for verified genuine issues
- **Yes/No Voting** by community members
- **50% Threshold Monitoring** for authority notification
- **Real-time Poll Results** tracking

### 📧 Automated Authority Communication
- **Email Integration** with professional HTML templates
- **Automatic Email Trigger** when poll threshold is reached
- **Comprehensive Report Details** including:
  - Issue images and metadata
  - AI severity assessment
  - Community poll statistics
  - Location information
- **Email Delivery Confirmation** with timestamps

### 📊 Enhanced Reporting
- **Status Tracking** including "Reported to Authority"
- **Email Delivery Timestamps** in user reports
- **Progress Monitoring** from submission to authority action

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Leaflet** for maps
- **Lucide React** for icons
- **Firebase Auth** for authentication

### Backend
- **Node.js** with Express
- **Firebase Admin SDK** for database and storage
- **TensorFlow.js** for AI image analysis
- **Sharp** for image processing
- **Nodemailer** for email functionality
- **Multer** for file uploads
- **CORS** for cross-origin requests

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file with configuration
# See server/setup.md for detailed instructions
cp setup.md .env.example

# Start server
npm run dev
```

### Firebase Configuration
1. Create a Firebase project
2. Enable Authentication with Email/Password
3. Update `src/config/firebase.ts` with your Firebase config

## 🔧 Configuration

### Email Setup
The application sends emails to `apurbaofficial8097@gmail.com` when community polls reach 50% approval.

To configure email sending:
1. Set up Gmail App Password
2. Update `.env` file in server directory:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

### Firebase Setup
Update `src/config/firebase.ts` with your Firebase configuration:
```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 🎯 Usage Flow

### 1. User Registration/Login
- Users sign up with email, password, and username
- Only username is displayed in the UI (anonymized)
- Users can edit their username anytime

### 2. Issue Reporting
- User uploads two images from different angles
- System automatically verifies image authenticity
- If images are genuine:
  - Issue is auto-approved
  - Public poll is automatically created
  - Issue appears on the map immediately
- If images are fake/AI-generated:
  - Report is automatically rejected
  - User receives rejection notification

### 3. Community Voting
- Community members vote Yes/No on genuine issues
- Poll results are monitored in real-time
- When Yes votes reach 50%:
  - Email is automatically sent to authorities
  - Issue status updates to "Reported to Authority"
  - Email delivery timestamp is recorded

### 4. Authority Notification
- Professional HTML email with all issue details
- Includes both uploaded images as attachments
- Contains AI assessment and community poll results
- Sent to `apurbaofficial8097@gmail.com`

## 📱 Key Pages

- **Home** - Landing page with Hyderabad focus
- **Login/Signup** - Authentication pages
- **Report Issue** - Image upload with AI verification
- **Live Map** - Hyderabad-focused map with location detection
- **My Reports** - User's submitted reports with status tracking
- **Analytics** - Data visualization for Hyderabad areas
- **Leaderboard** - Community engagement metrics

## 🔒 Security Features

- **Firebase Authentication** for secure user management
- **No Personal Data Storage** - only usernames are displayed
- **Image Verification** to prevent fake reports
- **Community Validation** through voting system
- **Secure Email Delivery** with professional templates

## 🚧 Development Notes

### AI Image Verification
Currently uses mock AI verification with 20% fake detection rate. In production, integrate with:
- Google Cloud Vision API
- Azure Computer Vision
- AWS Rekognition
- Custom AI models

### Email Service
Uses Gmail SMTP for demo. For production, consider:
- SendGrid
- Mailgun
- AWS SES
- Custom SMTP server

### Database
Currently uses in-memory storage. For production, integrate:
- Firebase Firestore
- MongoDB
- PostgreSQL
- MySQL

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions, please contact the development team.

---

**UrbanEye Hyderabad** - Making Hyderabad better, one report at a time! 🚧✨ 