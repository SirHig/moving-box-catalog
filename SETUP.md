# Quick Setup Guide

## Get Your API Keys

### 1. OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Paste into `.env` as `VITE_OPENAI_API_KEY`

**Cost**: ~$0.01 per box image analysis (GPT-4o Vision)

### 2. Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project" or select existing
3. Enter project name (e.g., "moving-boxes-2026")
4. Disable Google Analytics (optional)
5. Click "Create project"

### 3. Enable Firestore
1. In Firebase Console, go to "Build" → "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (change later for production)
4. Select your region (choose closest to you)
5. Click "Enable"

### 4. Enable Storage
1. Go to "Build" → "Storage"
2. Click "Get started"
3. Choose "Start in test mode"
4. Click "Next" → "Done"

### 5. Get Firebase Config
1. Go to Project Settings (⚙️ icon)
2. Scroll to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Enter nickname (e.g., "Box Catalog Web")
5. Click "Register app"
6. Copy all the config values:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // Copy this to VITE_FIREBASE_API_KEY
  authDomain: "project.firebaseapp.com",  // Copy to VITE_FIREBASE_AUTH_DOMAIN
  projectId: "project-id",        // Copy to VITE_FIREBASE_PROJECT_ID
  storageBucket: "project.appspot.com",   // Copy to VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456",    // Copy to VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123:web:abc"          // Copy to VITE_FIREBASE_APP_ID
};
```

### 6. Create .env File
Create a file named `.env` in the project root:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

VITE_OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 7. Test It!
```bash
npm run dev
```

Open http://localhost:5173 and try adding a box!

## Firestore Security Rules (Test Mode)

If you chose "test mode", your rules expire in 30 days. To extend:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /boxes/{boxId} {
      allow read, write: if true;
    }
  }
}
```

## Storage Security Rules (Test Mode)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /boxes/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

**Note**: These are permissive rules for testing. For production, add authentication!

## Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting
# Choose your project
# Public directory: dist
# Single-page app: Yes
# Automatic builds with GitHub: No

# Build and deploy
npm run build
firebase deploy

# Your app is live at: https://your-project.web.app
```

## Testing on Your Phone

### Development (Local Network)
1. Find your computer's IP address:
   - Mac/Linux: `ifconfig | grep inet`
   - Windows: `ipconfig`
2. Start dev server: `npm run dev`
3. On your phone, open: `http://YOUR_IP:5173`
4. Note: Camera access requires HTTPS (deploy to test camera)

### Production (After Deploy)
1. Deploy to Firebase Hosting (see above)
2. Open the URL on your phone
3. Install as PWA (Add to Home Screen)
4. Camera will work because Firebase uses HTTPS

## Troubleshooting

### "Failed to load boxes"
- Check `.env` file exists and has correct values
- Verify Firebase project ID matches
- Check Firestore is enabled in Firebase Console

### "OpenAI API error"
- Verify API key starts with `sk-`
- Check you have credits in OpenAI account
- Ensure no extra spaces in `.env` file

### Camera button does nothing
- Camera API requires HTTPS
- Deploy to Firebase Hosting or another HTTPS host
- Or test file upload on localhost (will work without HTTPS)

### Images not saving
- Check Storage is enabled in Firebase Console
- Verify storage bucket name in `.env`
- Check browser console for specific errors
