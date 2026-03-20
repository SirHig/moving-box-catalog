# 📦 Moving Box Catalog

A Progressive Web App (PWA) to catalog your moving boxes using AI-powered image recognition. Pre-print QR code labels, scan them while packing, and let AI automatically catalog what's in each box.

## Features

- 🏷️ **Pre-print Labels**: Generate sheets of QR code labels (Avery 5160, 5161, 5163)
- 📱 **Scan & Catalog**: Scan box label → take photo → AI describes contents
- 🤖 **AI-Powered**: OpenAI GPT-4 Vision automatically describes box contents
- 🔍 **Search**: Find items quickly across all boxes
- 📷 **Mobile-First**: PWA that works like a native app on iOS & Android
- ⚠️ **Smart Tagging**: Mark boxes as fragile or priority
- ☁️ **Cloud Sync**: Firebase keeps your data synced across devices
- 🔌 **Works Offline**: Access your catalog even without internet

## How It Works

### Optimized Workflow

1. **Generate Labels**: Create a PDF sheet with QR codes (Box #1-50, etc.)
2. **Print**: Print on Avery label sheets or regular printer
3. **Apply Labels**: Stick labels on empty boxes before packing
4. **Pack & Catalog**: 
   - Scan the QR code on the box
   - Take a photo of the contents
   - AI automatically describes what's inside
5. **Search**: Later, search for "kitchen utensils" or "winter clothes" to find the right box

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **AI**: OpenAI GPT-4 Vision API
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **PWA**: vite-plugin-pwa with Workbox

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- OpenAI API account ([Get API key](https://platform.openai.com/api-keys))
- Firebase project ([Create project](https://console.firebase.google.com/))

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Firestore Database**:
   - Go to Build → Firestore Database
   - Click "Create database"
   - Start in production mode (or test mode for development)
   - Choose a region
4. Enable **Storage**:
   - Go to Build → Storage
   - Click "Get started"
   - Start in production mode (or test mode for development)
5. Get your Firebase config:
   - Go to Project Settings → General
   - Scroll to "Your apps" → Click web icon (</>)
   - Copy the config values

### 3. Install Dependencies

```bash
cd moving-box-catalog
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# OpenAI API Key
VITE_OPENAI_API_KEY=sk-your-openai-key-here
```

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 on your phone or desktop browser.

### 6. Build for Production

```bash
npm run build
npm run preview
```

### 7. Deploy

#### Option A: Firebase Hosting (Recommended)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select your project, set public directory to 'dist'
npm run build
firebase deploy
```

#### Option B: Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Netlify dashboard

#### Option C: Vercel

```bash
npm install -g vercel
vercel
# Follow prompts, add environment variables when prompted
```

## Usage

### Step 1: Generate Labels (Before Moving)

1. Open the app and tap **"🏷️ Generate Labels"**
2. Choose label template:
   - **Avery 5163**: 10 labels/sheet (2" x 4") - Recommended for boxes
   - **Avery 5161**: 20 labels/sheet (1" x 4") 
   - **Avery 5160**: 30 labels/sheet (1" x 2-5/8")
3. Set range (e.g., Box 1 to 50)
4. Download PDF
5. Print on label sheets or regular paper
6. Apply labels to empty boxes

### Step 2: Catalog Boxes (While Packing)

1. Tap the **"📷 Catalog Box"** button
2. **Scan the QR code** on the box label
   - Or manually enter the box number if scanner doesn't work
3. **Take a photo** of the items you just packed
4. AI automatically analyzes and describes the contents
5. Box is saved to your catalog

### Step 3: Find Items (After Moving)

- **Search**: Type "kitchen utensils" to find which box they're in
- **Filter**: View only fragile boxes or priority items
- **View Details**: See photos and AI descriptions of each box
- **Mark**: Tag boxes as fragile ⚠️ or priority ⭐
- **Delete**: Tap 🗑️ to remove a box from catalog

### Install as App

#### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"

#### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Tap "Install app" or "Add to Home Screen"

## Project Structure

```
moving-box-catalog/
├── src/
│   ├── App.tsx              # Main app logic & state
│   ├── App.css              # Mobile-first styles
│   ├── QRScanner.tsx        # QR code scanner component
│   ├── CameraCapture.tsx    # Camera/photo capture
│   ├── LabelGenerator.tsx   # PDF label generator
│   ├── BoxCard.tsx          # Box display card
│   ├── firebase.ts          # Firebase config
│   ├── services.ts          # API functions
│   └── types.ts             # TypeScript types
├── .env.example             # Environment template
├── README.md                # This file
├── SETUP.md                 # Detailed setup guide
├── DEPLOY.md                # Deployment guide
└── vite.config.ts           # Vite + PWA config
```

## Firestore Security Rules

Add these rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /boxes/{boxId} {
      allow read, write: if true;  // For MVP - restrict this in production!
    }
  }
}
```

## Storage Security Rules

Add these rules in Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /boxes/{allPaths=**} {
      allow read, write: if true;  // For MVP - restrict this in production!
    }
  }
}
```

**⚠️ IMPORTANT**: These rules allow public access. For production, implement authentication and restrict based on user IDs.

## Cost Estimate

- **Firebase**: Free tier includes:
  - 1 GB storage
  - 10 GB/month bandwidth
  - 50K reads, 20K writes per day
- **OpenAI GPT-4 Vision**: ~$0.01 per image analysis
  - 100 boxes = ~$1.00
  - 500 boxes = ~$5.00

## Troubleshooting

### Camera Not Working
- Ensure HTTPS is enabled (required for camera access)
- Check browser permissions for camera access
- On iOS, use Safari (Chrome iOS has limited camera API support)

### Images Not Uploading
- Verify Firebase Storage is enabled
- Check Storage security rules
- Ensure `.env` has correct `VITE_FIREBASE_STORAGE_BUCKET`

### AI Not Describing Images
- Verify OpenAI API key is correct
- Check API key has sufficient credits
- Ensure image is under 20MB

### PWA Not Installing
- PWA requires HTTPS (localhost works for development)
- Clear browser cache and try again
- Check console for manifest errors

## License

MIT

## Contributing

Pull requests welcome! This is a personal project but feel free to fork and customize for your own moving needs.

---

**Happy Moving!** 🚚📦
