# Deployment Checklist

## ✅ Git Repository Status
- [x] Git initialized
- [x] Initial commit created
- [ ] Push to GitHub
- [ ] Create repository on GitHub

## 🔧 Configuration Needed

### 1. Environment Variables
Create `.env` file with:
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_OPENAI_API_KEY=
```

### 2. Firebase Setup
- [ ] Create Firebase project: https://console.firebase.google.com/
- [ ] Enable Firestore Database
- [ ] Enable Storage
- [ ] Copy config values to `.env`
- [ ] Set Firestore security rules (see SETUP.md)
- [ ] Set Storage security rules (see SETUP.md)

### 3. OpenAI Setup
- [ ] Create OpenAI account: https://platform.openai.com/
- [ ] Generate API key: https://platform.openai.com/api-keys
- [ ] Add to `.env` file
- [ ] (Optional) Set spending limits

## 🚀 Deployment Options

### Option A: Netlify (Easiest - Recommended for Quick Start)

1. **Push to GitHub**:
   ```bash
   # Create repo on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/moving-box-catalog.git
   git push -u origin main
   ```

2. **Deploy to Netlify**:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import from Git"
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables (all VITE_* variables)
   - Click "Deploy"

**Pros**: Free, automatic HTTPS, easy env var management
**Cons**: None really
**Time**: 5 minutes

---

### Option B: Vercel (Also Easy)

1. **Push to GitHub** (same as above)

2. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   # Follow prompts, add env vars when asked
   ```

   Or via web:
   - Go to https://vercel.com
   - Import GitHub repository
   - Add environment variables
   - Deploy

**Pros**: Free, excellent performance, auto-deploy on push
**Cons**: None
**Time**: 5 minutes

---

### Option C: Firebase Hosting (All-in-One)

Since you're using Firebase already, this keeps everything in one place:

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Hosting**:
   ```bash
   firebase init hosting
   # Select your Firebase project
   # Public directory: dist
   # Single-page app: Yes
   # GitHub auto-deploys: Optional
   ```

3. **Build and Deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

4. **Environment Variables**:
   - Create `.env.production` with your values
   - Or use Firebase App Hosting environment variables

**Pros**: All-in-one (database, storage, hosting)
**Cons**: Slightly more complex setup
**Time**: 10 minutes

---

### Option D: GitHub Pages (Free Static Hosting)

1. **Install gh-pages**:
   ```bash
   npm install -D gh-pages
   ```

2. **Add to package.json**:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Configure**:
   - GitHub repo → Settings → Pages
   - Source: gh-pages branch
   - Add env vars via GitHub Secrets (requires build action)

**Pros**: Free, simple
**Cons**: Env vars require GitHub Actions setup
**Time**: 10 minutes + Actions setup

---

## 📝 Post-Deployment Steps

After deploying to any platform:

1. **Test the App**:
   - [ ] App loads without errors
   - [ ] Generate labels works
   - [ ] Download PDF works
   - [ ] QR scanner works (needs HTTPS)
   - [ ] Camera/file upload works
   - [ ] AI analysis works
   - [ ] Boxes save to Firebase
   - [ ] Search works
   - [ ] Fragile/priority toggles work

2. **Mobile Testing**:
   - [ ] Test on iPhone (Safari)
   - [ ] Test on Android (Chrome)
   - [ ] Install as PWA
   - [ ] Test offline functionality

3. **Print Test Labels**:
   - [ ] Generate labels (1-10)
   - [ ] Print on paper to test alignment
   - [ ] Print on Avery labels
   - [ ] Test QR scanning

4. **Security** (Important!):
   - [ ] Update Firebase Firestore rules (restrict to authenticated users)
   - [ ] Update Firebase Storage rules
   - [ ] Set OpenAI spending limits
   - [ ] Review deployed env vars (make sure they're secure)

## 🎯 Quick Start Commands

### GitHub Setup
```bash
# Create repo on GitHub, then:
cd /home/tom/moving-box-catalog
git remote add origin https://github.com/SirHig/moving-box-catalog.git
git push -u origin main
```

### Build Test
```bash
npm run build
npm run preview
# Test at http://localhost:4173
```

### Deploy (Netlify CLI)
```bash
npm install -g netlify-cli
netlify deploy --prod
# Follow prompts
```

### Deploy (Vercel CLI)
```bash
npm install -g vercel
vercel --prod
```

### Deploy (Firebase)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 🔒 Security Notes

**Before going live**:

1. **Firebase Rules** - Replace test mode rules:
   ```javascript
   // Firestore
   match /boxes/{boxId} {
     allow read, write: if request.auth != null;  // Requires auth
   }
   
   // Storage
   match /boxes/{allPaths=**} {
     allow read, write: if request.auth != null;
   }
   ```

2. **API Keys** - For production:
   - Use Firebase App Check
   - Restrict OpenAI API key by domain
   - Set spending limits on OpenAI

3. **Environment Variables**:
   - Never commit `.env` to git
   - Use platform environment variable management
   - Different keys for dev/staging/prod

## 📊 Monitoring

After deployment:

- **Firebase Console**: Monitor database usage
- **OpenAI Dashboard**: Track API usage and costs
- **Hosting Platform**: Check build logs and analytics

## 🆘 Troubleshooting

### Build fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment variables not working
- Check variable names start with `VITE_`
- Restart dev server after changes
- Rebuild for production

### Camera doesn't work
- Must be deployed to HTTPS domain
- localhost works for dev
- Check browser permissions

## ✨ You're Ready!

Your app is now:
- ✅ Version controlled with git
- ✅ Production build tested
- ✅ Ready for deployment
- ✅ Documented with README, SETUP, DEPLOY, WORKFLOW guides

Choose a deployment platform above and follow the steps!
