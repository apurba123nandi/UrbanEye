# 🔧 Google Cloud Vision API Setup Guide

## Current Status
You have provided a **Service Account JSON** file, but for frontend applications, we need an **API Key** for security reasons.

## 🚨 Important Security Note
- **Service Account JSON** contains private keys and should NEVER be used in frontend code
- **API Key** is safe for frontend use and is what we need

## 🔑 How to Get Your API Key

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account
3. Select your project: **vision-api-labs**

### Step 2: Enable Cloud Vision API
1. Go to **"APIs & Services"** > **"Library"**
2. Search for **"Cloud Vision API"**
3. Click on it and press **"Enable"**

### Step 3: Create API Key
1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"Create Credentials"** > **"API Key"**
3. Copy the generated API key (it will look like: `AIzaSyC...`)

### Step 4: Restrict the API Key (Recommended)
1. Click on the API key you just created
2. Under **"Application restrictions"**, select **"HTTP referrers"**
3. Add your domain: `localhost:5173/*` (for development)
4. Under **"API restrictions"**, select **"Restrict key"**
5. Choose **"Cloud Vision API"**
6. Click **"Save"**

## 📝 Environment Setup

### Create `.env.local` file in your project root:
```bash
# Firebase Configuration (your existing config)
VITE_FIREBASE_API_KEY=AIzaSyAZw0uW0Xg2rNNB9ctYnwlImVmdEytO3fQ
VITE_FIREBASE_AUTH_DOMAIN=technova-384ce.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=technova-384ce
VITE_FIREBASE_STORAGE_BUCKET=technova-384ce.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=395949378600
VITE_FIREBASE_APP_ID=1:395949378600:web:3c984794bbb06e4656b91d

# Google Cloud Vision API (NEW - add your API key here)
VITE_GOOGLE_CLOUD_VISION_API_KEY=YOUR_API_KEY_HERE

# Backend Configuration
VITE_USE_MOCK_BACKEND=false
```

### Replace `YOUR_API_KEY_HERE` with your actual API key

## 🧪 Test the Setup

1. **Start your development server**:
```bash
npm run dev
```

2. **Go to Report Issue page**: `http://localhost:5173/report`

3. **Upload an image and submit** - You should see:
```
🤖 Starting real AI analysis with Google Cloud Vision...
✅ Real AI analysis completed: { isAuthentic: true, confidence: 0.85 }
```

## 🔒 Security Best Practices

### ✅ What to do:
- Use API keys in frontend (safe)
- Restrict API keys to specific domains
- Restrict API keys to specific APIs
- Monitor usage in Google Cloud Console

### ❌ What NOT to do:
- Never use service account JSON in frontend
- Never commit API keys to version control
- Never share API keys publicly

## 💰 Cost Monitoring

### Check your usage:
1. Go to Google Cloud Console
2. Navigate to **"Billing"**
3. Select your project
4. Monitor **"Cloud Vision API"** usage

### Pricing:
- **First 1,000 requests/month**: FREE
- **Additional requests**: $1.50 per 1,000 requests

## 🚨 Troubleshooting

### "API Key Invalid"
- Check if API key is correct
- Ensure Cloud Vision API is enabled
- Verify API key restrictions

### "Quota Exceeded"
- Check billing status
- Monitor usage in console
- Upgrade if needed

### "Analysis Failed"
- Check internet connection
- Verify image format (JPEG, PNG)
- Ensure image size < 10MB

## 📞 Need Help?

If you're having trouble:
1. Check Google Cloud Console for errors
2. Verify API key format (should start with `AIzaSy`)
3. Ensure Cloud Vision API is enabled
4. Check billing status

---

**Once you have your API key, add it to `.env.local` and test the AI integration!** 🎉 