const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = {
  type: process.env.FIREBASE_TYPE || "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID || "UrbanEye-hyderabad",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "your-private-key-id",
  private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : "your-private-key",
  client_email: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk@UrbanEye-hyderabad.iam.gserviceaccount.com",
  client_id: process.env.FIREBASE_CLIENT_ID || "your-client-id",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CERT_URL || "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40UrbanEye-hyderabad.iam.gserviceaccount.com"
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "UrbanEye-hyderabad.appspot.com"
});

// Get Firestore database
const db = admin.firestore();

// Get Storage bucket
const bucket = admin.storage().bucket();

module.exports = {
  admin,
  db,
  bucket
}; 