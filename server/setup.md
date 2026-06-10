# Server Setup Guide

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Firebase Configuration
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=UrbanEye-hyderabad
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@UrbanEye-hyderabad.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40UrbanEye-hyderabad.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=UrbanEye-hyderabad.appspot.com

# Server Configuration
PORT=3001
```

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database
3. Enable Storage
4. Create a service account and download the JSON key
5. Update the Firebase configuration in the `.env` file

## Email Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Update EMAIL_USER and EMAIL_PASS in the `.env` file

## Running the Server

```bash
cd server
npm install
npm run dev
```

The server will start on http://localhost:3001 