import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAZw0uW0Xg2rNNB9ctYnwlImVmdEytO3fQ",
  authDomain: "technova-384ce.firebaseapp.com",
  projectId: "technova-384ce",
  storageBucket: "technova-384ce.firebasestorage.app",
  messagingSenderId: "395949378600",
  appId: "1:395949378600:web:3c984794bbb06e4656b91d",
  measurementId: "G-WSBWSWR0WX"
};

// For development, we'll use a mock authentication system
const isDevelopment = process.env.NODE_ENV === 'development';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Debug Firebase connection
console.log('🔥 Firebase initialized successfully!');
console.log('📊 Project ID:', firebaseConfig.projectId);
console.log('🔐 Auth Domain:', firebaseConfig.authDomain);
console.log('💾 Storage Bucket:', firebaseConfig.storageBucket);

export default app; 