# Frontend Deployment to Vercel

**Status**: 🔄 In Progress
**Date**: October 31, 2025
**Track**: Parallel Track A (alongside Phase 6 admin development)

## Overview

Deploy the React frontend to Vercel for production testing while continuing admin panel development locally. This allows us to validate the frontend architecture in production and get the public-facing site live.

## Prerequisites Checklist

Before deploying to Vercel, ensure these are ready:

### ✅ Code & Repository
- [x] Checkpoint commit created (`0761a18`)
- [ ] Repository pushed to GitHub
- [ ] GitHub repository is public (or Vercel has access to private repos)

### ✅ Frontend Configuration
- [x] React app builds successfully locally (`npm run build` in frontend/)
- [x] Environment variables identified (.env.example exists)
- [x] API endpoints use `VITE_API_URL` environment variable
- [x] No hardcoded localhost URLs in production code

### ✅ Vercel Account
- [ ] Vercel account created (https://vercel.com)
- [ ] GitHub connected to Vercel

## Deployment Steps

### Step 1: Push to GitHub

```bash
# Add GitHub remote (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/crypto-path-fullstack.git

# Push to GitHub
git push -u origin master
```

**Expected Result**: Code visible on GitHub at your repository URL.

### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `crypto-path-fullstack` repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Configure Environment Variables

In Vercel project settings, add these environment variables:

```env
# Required for production
VITE_API_URL=http://127.0.0.1:8000
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

**Note**:
- `VITE_API_URL` currently points to localhost since backend isn't deployed yet
- API-dependent features (login, modules) won't work until backend is deployed
- Static pages (homepage, pricing) will work perfectly

### Step 4: Deploy

1. Click "Deploy" button in Vercel
2. Wait for build to complete (2-3 minutes)
3. Get production URL: `https://crypto-path-fullstack.vercel.app` (or custom domain)

### Step 5: Test Production Build

Test these pages:

**Should Work (Static Pages)**:
- [x] Homepage (`/`)
- [x] Pricing page
- [x] Login page (UI only, login won't work without backend)
- [x] Register page (UI only, registration won't work without backend)

**Won't Work Yet (Require Backend)**:
- [ ] Login functionality (needs Laravel backend)
- [ ] Module listing (needs API)
- [ ] User dashboard (needs auth + API)
- [ ] Progress tracking (needs auth + API)

### Step 6: Document Production URL

Once deployed, add production URL to:
- README.md
- Project status
- Vercel dashboard

## Environment Variables Reference

### Frontend (.env.production on Vercel)

```env
# Backend API (currently localhost, will update in Phase 7)
VITE_API_URL=http://127.0.0.1:8000

# Supabase (already configured)
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
```

### Backend (.env - stays local for now)

```env
# Will deploy in Phase 7
APP_URL=http://127.0.0.1:8000
DB_CONNECTION=pgsql
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_KEY=[anon-key]
```

## Expected Performance

### Vercel Frontend (Production)
- **Load Time**: 0.2-0.8s (instant)
- **First Contentful Paint**: <1s
- **Time to Interactive**: <2s
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)

### Current Limitations
- Login/Register won't work (backend not deployed)
- Modules page will show loading state (no API)
- User dashboard won't load (no auth)
- **This is expected** - backend deployment comes in Phase 7

## Troubleshooting

### Build Fails on Vercel

**Error**: `Module not found` or dependency errors
**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build  # Test locally first
```

### Environment Variables Not Working

**Error**: API calls go to undefined or wrong URL
**Solution**:
- Check Vercel → Project Settings → Environment Variables
- Redeploy after adding/changing variables
- Verify `import.meta.env.VITE_API_URL` is used (not `process.env`)

### Pages Show 404

**Error**: React Router routes return 404
**Solution**: Vercel should auto-detect Vite SPA. If not:
- Create `vercel.json` in frontend/:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### CORS Errors in Production

**Error**: API requests blocked by CORS when backend is deployed
**Solution**: Update Laravel `config/cors.php`:
```php
'allowed_origins' => [
    'https://crypto-path-fullstack.vercel.app',
    'http://localhost:5173',  // Keep for local dev
],
```

## Next Steps After Deployment

1. **Verify**: Static pages work perfectly
2. **Document**: Add production URL to README
3. **Continue**: Phase 6 (Supabase storage) in parallel
4. **Phase 7**: Deploy backend to Railway.app
5. **Connect**: Update `VITE_API_URL` to point to Railway backend
6. **Test**: Full end-to-end flow in production

## Deployment Architecture (Current)

```
┌─────────────────────────────────────────────────┐
│  FRONTEND (React)                               │
│  Deployed: Vercel ✅                            │
│  URL: https://crypto-path-fullstack.vercel.app  │
│  Status: Static pages working                   │
└─────────────────────────────────────────────────┘
                    │
                    │ API calls (currently fail)
                    ▼
┌─────────────────────────────────────────────────┐
│  BACKEND (Laravel + Admin)                      │
│  Deployed: Local only ⏸️                        │
│  URL: http://127.0.0.1:8000                     │
│  Status: Development, not accessible publicly   │
└─────────────────────────────────────────────────┘
                    │
                    │ Database connection
                    ▼
┌─────────────────────────────────────────────────┐
│  DATABASE (PostgreSQL)                          │
│  Deployed: Supabase ✅                          │
│  Status: Production ready                       │
└─────────────────────────────────────────────────┘
```

## Deployment Architecture (Phase 7 - Future)

```
┌─────────────────────────────────────────────────┐
│  FRONTEND (React)                               │
│  Deployed: Vercel ✅                            │
│  URL: https://cryptopath.com                    │
└─────────────────────────────────────────────────┘
                    │
                    │ HTTPS API calls
                    ▼
┌─────────────────────────────────────────────────┐
│  BACKEND (Laravel + Admin)                      │
│  Deployed: Railway.app ⏳                       │
│  URL: https://api.cryptopath.com                │
└─────────────────────────────────────────────────┘
                    │
                    │ Database connection
                    ▼
┌─────────────────────────────────────────────────┐
│  DATABASE (PostgreSQL)                          │
│  Deployed: Supabase ✅                          │
└─────────────────────────────────────────────────┘
```

## Related Documentation

- [Project Status](project-status.md) - Current phase and roadmap
- [Admin Panel Setup](admin-panel-filament-setup.md) - Backend admin panel docs
- Phase 7 Deployment Guide (to be created)

## Important Notes

- Vercel is **ONLY** for React frontend (static site + serverless functions)
- Vercel **CANNOT** host PHP/Laravel - need Railway/Domainesia/DigitalOcean for backend
- Frontend will work partially (static pages) without backend
- Full functionality requires Phase 7 (backend deployment)
- This deployment validates frontend architecture and gets public site live early
