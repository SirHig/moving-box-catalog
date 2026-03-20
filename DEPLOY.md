# Deployment Quick Reference

## Option 1: Firebase Hosting (Recommended)

```bash
# One-time setup
npm install -g firebase-tools
firebase login

# Initialize (first time only)
firebase init hosting
# Answer:
# - Select your project
# - Public directory: dist
# - Single-page app: Yes
# - GitHub auto-deploys: No

# Deploy
npm run build
firebase deploy
```

Your app will be at: `https://YOUR-PROJECT-ID.web.app`

## Option 2: Netlify (Easiest)

### Method A: Drag & Drop
1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder
4. Add environment variables in Site Settings → Environment

### Method B: GitHub
1. Push code to GitHub
2. Go to https://app.netlify.com
3. Click "Add new site" → "Import from Git"
4. Select repository
5. Settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables
7. Deploy

## Option 3: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
# Follow prompts to link project

# Or connect to GitHub
# 1. Push to GitHub
# 2. Go to vercel.com
# 3. Import repository
# 4. Add environment variables
```

## Option 4: GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

Then enable GitHub Pages in repo settings.

## Testing Locally

```bash
# Development
npm run dev
# Open http://localhost:5173

# Production build preview
npm run build
npm run preview
# Open http://localhost:4173
```

## Environment Variables

All platforms need these env vars:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_OPENAI_API_KEY=...
```

## Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Camera/file input works
- [ ] Images upload to Firebase Storage
- [ ] AI description generates
- [ ] Box saves to Firestore
- [ ] Search works
- [ ] QR code prints
- [ ] PWA installs on phone
- [ ] Works on mobile Safari (iOS)
- [ ] Works on mobile Chrome (Android)

## Custom Domain (Firebase)

```bash
firebase hosting:sites:create your-custom-name
# Add custom domain in Firebase Console
```

## Monitoring

### Firebase Console
- Storage usage: Build → Storage
- Database reads/writes: Build → Firestore → Usage
- Hosting bandwidth: Build → Hosting

### OpenAI Dashboard
- API usage: https://platform.openai.com/usage
- Set spending limits to avoid surprises

## Troubleshooting Deployment

### Build fails
- Check all files have correct imports
- Run `npm run build` locally first
- Check Node version matches (18+)

### App loads but features don't work
- Verify all env vars are set on platform
- Check browser console for errors
- Ensure Firebase rules are set (see SETUP.md)

### Camera doesn't work
- Camera API requires HTTPS
- localhost works for dev
- All deployment platforms provide HTTPS

### Images won't upload
- Check Firebase Storage security rules
- Verify storage bucket name in env
- Check Firebase quota hasn't been exceeded
