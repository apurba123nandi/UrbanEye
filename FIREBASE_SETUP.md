# Firebase Setup Guide for UrbanEye

## 🔥 Setting Up Firebase for Real Data Storage

### Step 1: Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create New Project**: Click "Add project"
3. **Project Name**: `UrbanEye-hyderabad` (or your preferred name)
4. **Enable Google Analytics**: Optional (recommended)
5. **Create Project**: Click "Create project"

### Step 2: Enable Authentication

1. **Go to Authentication**: In Firebase console, click "Authentication"
2. **Get Started**: Click "Get started"
3. **Sign-in method**: Enable "Email/Password"
4. **Save**: Click "Save"

### Step 3: Create Firestore Database

1. **Go to Firestore**: In Firebase console, click "Firestore Database"
2. **Create Database**: Click "Create database"
3. **Security Rules**: Choose "Start in test mode" (for development)
4. **Location**: Choose a location close to Hyderabad (e.g., asia-south1)

### Step 4: Enable Storage

1. **Go to Storage**: In Firebase console, click "Storage"
2. **Get Started**: Click "Get started"
3. **Security Rules**: Choose "Start in test mode" (for development)
4. **Location**: Choose same location as Firestore

### Step 5: Get Configuration

1. **Project Settings**: Click the gear icon → "Project settings"
2. **General Tab**: Scroll down to "Your apps"
3. **Add Web App**: Click the web icon (</>)
4. **App Nickname**: `UrbanEye-web`
5. **Register App**: Click "Register app"
6. **Copy Config**: Copy the firebaseConfig object

### Step 6: Update Firebase Config

Replace the placeholder values in `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Step 7: Set Up Firestore Rules

In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for all users (for development)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Step 8: Set Up Storage Rules

In Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read/write for all users (for development)
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### Step 9: Environment Variables (Optional)

Create `.env.local` file in project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Then update `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## 🚀 Testing with Real Firebase

### 1. Switch to Production Mode

Update `src/config/firebase.ts`:

```typescript
// Change this line:
const isDevelopment = false; // or process.env.NODE_ENV === 'production'
```

### 2. Test Features

1. **Sign Up/Login**: Create real accounts
2. **Report Issues**: Submit reports with images
3. **View Data**: Check Firebase Console → Firestore to see stored issues
4. **View Images**: Check Firebase Console → Storage to see uploaded images
5. **Real-time Updates**: Data will sync across all users

### 3. Monitor Data

- **Firestore**: View all submitted issues
- **Storage**: View uploaded images
- **Authentication**: View registered users
- **Analytics**: Track app usage (if enabled)

## 🔧 Development vs Production

### Development Mode (Current)
- Uses mock backend
- No real data storage
- Faster for testing UI

### Production Mode (With Firebase)
- Real data storage
- User authentication
- Image upload to Firebase Storage
- Real-time database updates

## 📊 Data Structure

### Issues Collection
```javascript
{
  id: "auto-generated",
  title: "Pothole on Main Street",
  description: "Large pothole causing traffic issues",
  type: "pothole",
  severity: "high",
  severityScore: 8,
  status: "approved",
  location: {
    lat: 17.3850,
    lng: 78.4867,
    address: "Hyderabad, Telangana"
  },
  images: {
    angle1: "firebase-storage-url-1",
    angle2: "firebase-storage-url-2"
  },
  reportedBy: "user-email@example.com",
  reportedAt: "2024-01-01T00:00:00.000Z",
  aiPrediction: {
    type: "Pothole",
    confidence: 0.95,
    authenticity: 0.98,
    estimatedDepth: 12.5,
    damageRiskScore: 8.5,
    humanHarmRisk: "high"
  },
  publicVoting: {
    enabled: true,
    yesVotes: 15,
    noVotes: 2,
    threshold: 50,
    emailSent: false
  }
}
```

## 🛡️ Security Considerations

For production, update Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /issues/{issueId} {
      allow read: if true; // Anyone can read issues
      allow create: if request.auth != null; // Only authenticated users can create
      allow update: if request.auth != null; // Only authenticated users can update
    }
  }
}
```

## 🎯 Next Steps

1. **Set up Firebase project** following the steps above
2. **Update configuration** with real credentials
3. **Test real data storage** by submitting reports
4. **Monitor Firebase Console** to see stored data
5. **Deploy to production** when ready

This will give you a fully functional civic reporting platform with real data persistence! 🚀 