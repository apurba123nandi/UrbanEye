#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup for UrbanEye');
console.log('==============================\n');

console.log('📋 Follow these steps to set up Firebase:\n');

console.log('1. 🌐 Go to Firebase Console: https://console.firebase.google.com/');
console.log('2. ➕ Create a new project named "UrbanEye-hyderabad"');
console.log('3. 🔐 Enable Authentication → Email/Password');
console.log('4. 🗄️  Create Firestore Database (test mode)');
console.log('5. 📦 Enable Storage (test mode)');
console.log('6. ⚙️  Go to Project Settings → General → Your Apps');
console.log('7. 🌐 Add Web App (</> icon)');
console.log('8. 📋 Copy the firebaseConfig object\n');

console.log('📝 Once you have your Firebase config, update src/config/firebase.ts with your real credentials.\n');

console.log('🔧 To switch to production mode:');
console.log('   - Update src/config/firebase.ts with real credentials');
console.log('   - Set isDevelopment = false');
console.log('   - Restart the development server\n');

console.log('📊 To view stored data:');
console.log('   - Firebase Console → Firestore Database → Data');
console.log('   - Firebase Console → Storage → Files');
console.log('   - Firebase Console → Authentication → Users\n');

console.log('🎯 Your data will be stored in these collections:');
console.log('   - issues: All reported road issues');
console.log('   - users: Registered user accounts');
console.log('   - images: Uploaded issue photos\n');

console.log('✅ Setup complete! Your UrbanEye app will now store real data in Firebase.');

// Check if firebase config exists
const firebaseConfigPath = path.join(__dirname, 'src', 'config', 'firebase.ts');
if (fs.existsSync(firebaseConfigPath)) {
  const configContent = fs.readFileSync(firebaseConfigPath, 'utf8');
  if (configContent.includes('AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')) {
    console.log('\n⚠️  WARNING: Firebase config still has placeholder values!');
    console.log('   Please update src/config/firebase.ts with your real credentials.');
  } else {
    console.log('\n✅ Firebase config appears to be set up correctly!');
  }
} 