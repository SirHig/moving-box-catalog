# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Deploy the App (Choose One)

**Easiest: Netlify** ⭐
```bash
# Create GitHub repo, push code, then:
# Visit https://app.netlify.com → Import from Git
# Add env vars → Deploy
```

**Alternative: Vercel**
```bash
npm install -g vercel
vercel
# Add env vars when prompted
```

**Alternative: Firebase**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### 2. Configure Firebase + OpenAI

**Firebase** (5 minutes):
1. https://console.firebase.google.com/ → Create project
2. Enable Firestore Database
3. Enable Storage
4. Copy config to `.env` or deployment platform

**OpenAI** (2 minutes):
1. https://platform.openai.com/api-keys → Create key
2. Add to `.env` or deployment platform

See SETUP.md for detailed instructions.

### 3. Start Cataloging!

1. **Generate labels**: App → "Generate Labels" → Download PDF
2. **Print labels**: Print on Avery 5163 or regular paper
3. **Pack & catalog**: Scan label → Photo → AI describes → Done!

## 📱 URLs

- **GitHub repo**: https://github.com/SirHig/moving-box-catalog
- **Firebase Console**: https://console.firebase.google.com/
- **OpenAI Dashboard**: https://platform.openai.com/
- **Netlify**: https://app.netlify.com
- **Vercel**: https://vercel.com

## 🔑 Environment Variables

Copy these to your deployment platform:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_OPENAI_API_KEY=
```

## 📦 Project Commands

```bash
npm install          # Install dependencies
npm run dev          # Development server (localhost:5173)
npm run build        # Production build
npm run preview      # Test production build
git push             # Deploy (if auto-deploy enabled)
```

## 📚 Documentation

- **README.md** - Full project overview
- **SETUP.md** - Step-by-step setup instructions
- **DEPLOY.md** - Deployment options
- **WORKFLOW.md** - Moving day workflow guide
- **DEPLOYMENT-CHECKLIST.md** - Pre-deployment checklist
- **GITHUB-SETUP.md** - GitHub repository setup

## 🆘 Common Issues

**Build fails**: 
```bash
rm -rf node_modules dist && npm install && npm run build
```

**Env vars not working**: Must start with `VITE_`

**Camera won't work**: Requires HTTPS (deploy to test)

**QR scanner fails**: Use manual entry fallback

## ✨ Features at a Glance

- 🏷️ Generate printable QR label sheets (Avery templates)
- 📱 QR scanner to identify boxes
- 📷 Camera integration for photos
- 🤖 AI describes box contents (GPT-4 Vision)
- 🔍 Search across all boxes
- ⚠️ Mark fragile/priority items
- ☁️ Cloud sync via Firebase
- 📱 Install as mobile app (PWA)
- 🔌 Works offline

## 💰 Cost Estimate

- **Firebase**: Free tier (sufficient for most moves)
- **OpenAI**: ~$0.01/box (~$1-5 for typical move)
- **Hosting**: Free (Netlify/Vercel/Firebase)
- **Total**: Under $10 for most moves

## 🎯 Next Steps

1. ✅ Code is in git
2. ⬜ Push to GitHub (see GITHUB-SETUP.md)
3. ⬜ Deploy to hosting platform (see DEPLOY.md)
4. ⬜ Configure Firebase + OpenAI (see SETUP.md)
5. ⬜ Generate test labels
6. ⬜ Start packing!

---

**You're all set!** 🚚📦

For detailed guides, check the other .md files in this project.
