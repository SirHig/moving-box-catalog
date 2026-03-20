# GitHub Repository Setup

## Create Repository on GitHub

1. **Go to GitHub**: https://github.com/new

2. **Repository Details**:
   - **Name**: `moving-box-catalog`
   - **Description**: `AI-powered moving box catalog with QR code labels - PWA`
   - **Visibility**: 
     - ✅ **Public** (recommended - can share with others)
     - ⬜ **Private** (if you prefer)
   - **Initialize**: 
     - ⬜ Don't add README (we have one)
     - ⬜ Don't add .gitignore (we have one)
     - ⬜ Don't add license

3. **Click "Create repository"**

## Push Your Code

After creating the repository, GitHub will show you commands. Use these:

```bash
cd /home/tom/moving-box-catalog

# Add GitHub as remote
git remote add origin https://github.com/SirHig/moving-box-catalog.git

# Push to GitHub
git push -u origin main
```

### If using SSH instead of HTTPS:
```bash
git remote add origin git@github.com:SirHig/moving-box-catalog.git
git push -u origin main
```

## Verify

1. Refresh your GitHub repository page
2. You should see all files appear
3. README.md will be displayed on the main page

## Next Steps

Now you can:
- Deploy to Netlify/Vercel (they'll connect to this repo)
- Set up GitHub Actions for auto-deployment
- Share the repo with others
- Enable GitHub Pages

## Repository Settings (Optional)

### Add Topics
Add these topics to help others find your project:
- `moving`
- `pwa`
- `react`
- `typescript`
- `ai`
- `qr-code`
- `firebase`
- `inventory`

### Add Description
In repo settings, add:
```
AI-powered moving box catalog with pre-printable QR labels. PWA built with React, TypeScript, Firebase, and OpenAI GPT-4 Vision.
```

### Enable Discussions
If you want community feedback/questions

### Branch Protection (Optional)
For production deployments, protect the main branch

## Deployment Integration

### Netlify
1. Go to https://app.netlify.com
2. "Add new site" → "Import from Git"
3. Select GitHub → Authorize → Select this repo
4. Configure and deploy

### Vercel
1. Go to https://vercel.com
2. "New Project" → "Import Git Repository"
3. Select this repo → Configure → Deploy

Both will auto-deploy when you push to main!

## Keep Your Repo Updated

When you make changes:
```bash
git add .
git commit -m "Description of changes"
git push
```

Your deployment will automatically update (if connected)!
