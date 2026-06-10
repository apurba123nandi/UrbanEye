#!/bin/bash

echo "🤖 UrbanEye AI Integration Setup"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyAZw0uW0Xg2rNNB9ctYnwlImVmdEytO3fQ
VITE_FIREBASE_AUTH_DOMAIN=technova-384ce.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=technova-384ce
VITE_FIREBASE_STORAGE_BUCKET=technova-384ce.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=395949378600
VITE_FIREBASE_APP_ID=1:395949378600:web:3c984794bbb06e4656b91d

# Google Cloud Vision API (REPLACE WITH YOUR API KEY)
VITE_GOOGLE_CLOUD_VISION_API_KEY=YOUR_API_KEY_HERE

# Backend Configuration
VITE_USE_MOCK_BACKEND=false
EOF
    echo "✅ .env.local file created!"
else
    echo "✅ .env.local file already exists"
fi

echo ""
echo "🔑 Next Steps:"
echo "1. Go to: https://console.cloud.google.com/"
echo "2. Select your project: vision-api-labs"
echo "3. Enable Cloud Vision API"
echo "4. Create API Key"
echo "5. Replace 'YOUR_API_KEY_HERE' in .env.local with your actual API key"
echo ""
echo "🧪 Test the setup:"
echo "1. Run: npm run dev"
echo "2. Go to: http://localhost:5173/report"
echo "3. Upload an image and test AI analysis"
echo ""
echo "📚 For detailed instructions, see: GOOGLE_CLOUD_SETUP.md"
echo ""
echo "🎉 Your UrbanEye app is ready for AI integration!" 