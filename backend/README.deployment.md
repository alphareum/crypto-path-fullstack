# Railway Deployment Notes

## Important: Committed .env File

This repository contains a **committed** `.env` file at `backend/.env`.

### This is INTENTIONAL and SAFE

The committed `.env` file contains **ONLY safe build-time defaults**:
- ✅ Dummy `APP_KEY` (Railway overrides with real key)
- ✅ SQLite database (Railway uses PostgreSQL via env vars)
- ✅ File-based cache/sessions (Railway uses database)
- ✅ Dummy Supabase credentials (Railway overrides with real values)
- ✅ **NO REAL CREDENTIALS OR SECRETS**

### Why We Need This

**Railpack** (Railway's modern Laravel builder) has specific requirements:

1. Runs `composer install --no-scripts --optimize-autoloader`
   - The `--no-scripts` flag disables composer hooks like `pre-install-cmd`

2. Then runs Laravel artisan optimization commands:
   - `php artisan config:cache`
   - `php artisan route:cache`
   - `php artisan view:cache`
   - `php artisan event:cache`

3. These artisan commands **require** environment variables (especially `APP_ENV`) to execute

4. Railway provides environment variables at **runtime**, but Railpack needs them at **build time**

5. Solution: Commit a safe `.env` file for build phase → Railway env vars override at runtime

### How It Works

**Build Phase:**
```
1. Railpack clones repository
   └─ Finds backend/.env (committed with safe defaults)

2. Runs composer install --no-scripts
   └─ Installs dependencies

3. Runs artisan commands
   ├─ php artisan config:cache  ✅ Uses .env
   ├─ php artisan route:cache   ✅ Uses .env
   └─ php artisan view:cache    ✅ Uses .env

4. Creates Docker image
   └─ Serves from /app/public (fixes 403 error)
```

**Runtime Phase:**
```
1. Railway starts container
   └─ Injects REAL environment variables

2. Laravel boots
   ├─ Railway env vars OVERRIDE .env values ✅
   ├─ Uses real APP_KEY from Railway
   ├─ Connects to real PostgreSQL database
   └─ Uses real Supabase credentials
```

### Security

**Railway's environment variable precedence** (highest to lowest):
1. Railway dashboard environment variables (highest priority)
2. `railway.json` variables
3. `.env` file (lowest priority)

This means:
- Real credentials in Railway dashboard **always** override `.env`
- The committed `.env` is **only** used during build phase
- Runtime **always** uses Railway's secure environment variables

## Local Development

### Setup Instructions

Your real local credentials are stored in `.env.local` (ignored by git):

```bash
# Laravel automatically loads .env.local if it exists
# It takes precedence over .env

# To set up local development:
# 1. .env.local already exists with your credentials
# 2. Run: composer install
# 3. Run: npm install
# 4. Run: php artisan serve
```

### Environment File Priority (Local)

Laravel loads environment files in this order:
1. `.env.local` (highest priority - your real credentials)
2. `.env` (safe defaults - committed to git)

So your local development uses `.env.local` while Railway uses its dashboard variables.

## Deployment Checklist

Before deploying, ensure Railway has these environment variables:

```bash
# Required Production Variables
APP_NAME=CryptoPath
APP_ENV=production
APP_KEY=<generated-key>  # Generate with: php artisan key:generate --show
APP_DEBUG=false
APP_URL=<your-railway-url>

# Database (Supabase PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.ehrajyiqccbjumurxsac
DB_PASSWORD=<your-password>

# Cache & Sessions
SESSION_DRIVER=database
CACHE_STORE=database

# Supabase Storage
SUPABASE_URL=https://ehrajyiqccbjumurxsac.supabase.co
SUPABASE_KEY=<your-service-role-key>
```

## Troubleshooting

### Build Fails with "APP_ENV: not found"
- ✅ **Fixed**: Committed `.env` file provides `APP_ENV` during build

### 403 Forbidden on /admin Route
- ✅ **Fixed**: Railpack auto-serves from `/app/public` directory

### Local Development Not Working
- Check that `.env.local` exists with your real credentials
- Laravel loads `.env.local` first, then falls back to `.env`

### Railway Using Wrong Credentials
- Verify environment variables are set in Railway dashboard
- Railway env vars always override `.env` file at runtime

## Files Modified

- `backend/.gitignore` - Changed `.env` to `.env.local` (allows committing .env)
- `backend/.env` - Safe build-time defaults (committed to git)
- `backend/.env.local` - Your real local credentials (ignored by git)
- `backend/composer.json` - Removed `pre-install-cmd` (doesn't work with Railpack)

## References

- [Railpack Documentation](https://railpack.dev/)
- [Railway Environment Variables](https://docs.railway.app/guides/variables)
- [Laravel Configuration](https://laravel.com/docs/11.x/configuration)
