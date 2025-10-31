# CONTEXT — user-progress-tracking

## System Overview

User Progress Tracking sits on top of the existing Modules/Lessons system in the Crypto Path learning platform. It tracks which lessons users have completed and displays this information in the UI.

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
├─────────────────────────────────────────────────────────────┤
│  Navigation  │  AuthContext (token, user, loading)          │
│──────────────┼──────────────────────────────────────────────│
│  Login Page  │  Register Page  │  Protected Routes          │
│──────────────┴──────────────────┴──────────────────────────│
│  Modules Page        │  ModuleView Page                     │
│  (progress bars)     │  (lessons + "Mark Complete" button)  │
└──────────────────────┴──────────────────────────────────────┘
                          │
                    Bearer Token
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                Backend (Laravel 12 + Sanctum)               │
├─────────────────────────────────────────────────────────────┤
│  Auth Endpoints:     /api/register, /api/login              │
│                      /api/logout, /api/user                 │
│──────────────────────────────────────────────────────────────│
│  Progress Endpoints: GET /api/progress                       │
│  (Phase 3)           POST /api/progress                      │
│                      DELETE /api/progress/{lessonId}         │
└─────────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              Supabase PostgreSQL Database                   │
├─────────────────────────────────────────────────────────────┤
│  users  ←─────┐                                             │
│  lessons ←────┼─── user_progress (pivot table)              │
│               └─── (user_id, lesson_id, completed, ...)     │
│                                                              │
│  personal_access_tokens (Sanctum tokens)                    │
└─────────────────────────────────────────────────────────────┘
```

**Current State:** ✅ ALL PHASES COMPLETE (Phase 1-4)

## Session Progress

### ✅ COMPLETED: Phase 1 - Backend Authentication (Oct 29, 2025)
**What was done:**
- Installed Laravel Sanctum v4.2.0 (`composer require laravel/sanctum`)
- Published Sanctum migration and config (`php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`)
- Created `AuthController.php` with 4 methods:
  - `register()` - Validates, creates user, issues token
  - `login()` - Authenticates credentials, issues token
  - `logout()` - Revokes current access token
  - `user()` - Returns authenticated user data
- Added routes in `routes/api.php`:
  - `POST /api/register` (public)
  - `POST /api/login` (public)
  - `POST /api/logout` (protected by `auth:sanctum`)
  - `GET /api/user` (protected by `auth:sanctum`)
- Ran migration: `php artisan migrate` (created `personal_access_tokens` table)
- Tested all endpoints with curl (all working correctly)

**Key achievements:**
- Token-based authentication functional
- Users can register and receive tokens
- Protected endpoints validate tokens correctly
- Foundation ready for progress tracking

### ✅ COMPLETED: Phase 2 - Frontend Authentication (Oct 29, 2025)
**What was done:**
- Created `AuthContext.tsx` for global auth state:
  - Manages user, token, loading state
  - `useAuth()` hook for consuming auth state
  - Auto-loads token from localStorage on mount
  - Auto-fetches user data if token exists
- Created `authService.ts` API client:
  - `register()`, `login()`, `logout()`, `getUser()`, `checkAuth()`
  - Fetch API with Bearer token headers
  - Base URL: `http://localhost:8000/api`
- Created `Login.tsx` page:
  - Email/password form with validation
  - Loading states during API calls
  - Error message display
  - Redirects to `/modules` on success
- Created `Register.tsx` page:
  - Full registration form (name, email, password, password confirmation)
  - Client-side validation (name min 2, email valid, password min 8)
  - Real-time password match indicator
  - Password strength indicator
- Created `ProtectedRoute.tsx` wrapper:
  - Shows loading spinner while checking auth
  - Redirects to `/login` if not authenticated
  - Renders children if authenticated
- Updated `Navigation.tsx`:
  - Shows "Login | Register" when logged out
  - Shows "Logout" button when logged in
- Frontend build successful: **378.84 kB** bundle size

**Key achievements:**
- Complete authentication UI flow
- Token persistence across sessions
- Protected route functionality
- Ready to build progress tracking on top

### ✅ COMPLETED: Phase 3 - Backend Progress Tracking (Oct 30, 2025)
**What was done:**
- ✅ Created and ran migration: `2025_10_29_143205_create_user_progress_table.php`
  - Schema: `id`, `user_id`, `lesson_id`, `completed`, `completed_at`, `timestamps`
  - Foreign keys with CASCADE delete
  - Unique constraint on `(user_id, lesson_id)`
  - Index on `(user_id, completed)` for query performance
- ✅ Created `UserProgress` model (`app/Models/UserProgress.php`)
  - Fillable: user_id, lesson_id, completed, completed_at
  - Casts: completed (boolean), completed_at (datetime)
  - Relationships: belongsTo User, belongsTo Lesson
- ✅ Updated `User` model with `progress()` hasMany relationship
- ✅ Updated `Lesson` model with `userProgress()` hasMany relationship
- ✅ Created `ProgressController` (`app/Http/Controllers/Api/ProgressController.php`)
  - `index()` - Returns all progress for authenticated user with eager-loaded lesson data
  - `store()` - Creates/updates progress record, validates lesson_id, uses DB transaction
  - `destroy()` - Deletes progress record by lessonId for authenticated user
- ✅ Added progress routes in `routes/api.php` (all protected by `auth:sanctum`)
  - GET /api/progress
  - POST /api/progress
  - DELETE /api/progress/{lessonId}
- ✅ Tested all endpoints with curl (all working correctly)

**Key achievements:**
- Backend progress tracking API fully functional
- All endpoints tested and returning expected responses
- Database relationships working correctly
- Ready for frontend integration

### ✅ COMPLETED: Phase 4 - Frontend Progress Integration (Oct 31, 2025)
**What was done:**
- ✅ Created `progressService.ts` (`frontend/src/services/progressService.ts`)
  - API functions: `getProgress()`, `markLessonComplete()`, `markLessonIncomplete()`
  - Helper utilities: `isLessonCompleted()`, `getModuleProgress()`, `calculateModuleCompletion()`
  - Bearer token authentication with localStorage
  - Base URL: `http://localhost:8000/api`
- ✅ Updated `ModuleView.tsx` with progress tracking
  - Fetches user progress on mount when authenticated
  - Shows checkmarks on completed lessons in sidebar
  - "Mark as Complete" / "Mark Incomplete" toggle button
  - Optimistic UI updates (immediate state change)
  - Loading states during API operations
  - Progress percentage calculation: (completed / total) * 100
- ✅ Updated `Modules.tsx` with progress display
  - Fetches user progress on mount when authenticated
  - Shows "X lessons completed" on module cards
  - Updates button text to "Continue Learning" when progress exists
- ✅ Tested all functionality in browser
  - Mark lesson complete ✓
  - Mark lesson incomplete ✓
  - Progress persistence on page refresh ✓
  - Module card progress display ✓
- ✅ Committed to git: `c957d05` (3 files changed, 232 insertions, 34 deletions)

**Key achievements:**
- Complete progress tracking UI flow
- Real-time progress updates with optimistic UI
- Progress persistence across sessions
- All 4 phases of user progress tracking complete

## Affected Modules

### Backend Files Created:
- [app/Http/Controllers/Api/AuthController.php](../../backend/app/Http/Controllers/Api/AuthController.php) - Auth endpoints
- [app/Http/Controllers/Api/ProgressController.php](../../backend/app/Http/Controllers/Api/ProgressController.php) - Progress tracking endpoints
- [app/Models/UserProgress.php](../../backend/app/Models/UserProgress.php) - Progress model with relationships
- [database/migrations/2019_12_14_000001_create_personal_access_tokens_table.php](../../backend/database/migrations/2019_12_14_000001_create_personal_access_tokens_table.php) - Sanctum tokens
- [database/migrations/2025_10_29_143205_create_user_progress_table.php](../../backend/database/migrations/2025_10_29_143205_create_user_progress_table.php) - User progress

### Backend Files Modified:
- [app/Models/User.php](../../backend/app/Models/User.php) - Added HasApiTokens trait + progress() relationship
- [app/Models/Lesson.php](../../backend/app/Models/Lesson.php) - Added userProgress() relationship
- [routes/api.php](../../backend/routes/api.php) - Added auth routes + progress routes (GET, POST, DELETE)

### Frontend Files Created:
- [frontend/src/contexts/AuthContext.tsx](../../frontend/src/contexts/AuthContext.tsx) - Global auth state
- [frontend/src/services/authService.ts](../../frontend/src/services/authService.ts) - Auth API client
- [frontend/src/services/progressService.ts](../../frontend/src/services/progressService.ts) - Progress API client (Phase 4)
- [frontend/src/pages/Login.tsx](../../frontend/src/pages/Login.tsx) - Login page
- [frontend/src/pages/Register.tsx](../../frontend/src/pages/Register.tsx) - Registration page
- [frontend/src/components/ProtectedRoute.tsx](../../frontend/src/components/ProtectedRoute.tsx) - Route wrapper

### Frontend Files Modified:
- [frontend/src/components/Navigation.tsx](../../frontend/src/components/Navigation.tsx) - Added auth UI (Login/Register/Logout)
- [frontend/src/pages/ModuleView.tsx](../../frontend/src/pages/ModuleView.tsx) - Added progress tracking with Mark Complete button (Phase 4)
- [frontend/src/pages/Modules.tsx](../../frontend/src/pages/Modules.tsx) - Added progress display on module cards (Phase 4)

## Interfaces & Contracts

### API Endpoints (Auth - Phase 1)
All auth endpoints use JSON request/response format.

**POST /api/register** (public)
```json
Request: {
  "name": "string (min: 2)",
  "email": "string (valid email)",
  "password": "string (min: 8)"
}

Response 201: {
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-10-29T12:00:00.000000Z",
    "updated_at": "2025-10-29T12:00:00.000000Z"
  },
  "token": "1|abcdef123456..."
}

Response 422: {
  "message": "The email has already been taken.",
  "errors": { "email": ["The email has already been taken."] }
}
```

**POST /api/login** (public)
```json
Request: {
  "email": "string",
  "password": "string"
}

Response 200: {
  "user": { /* user object */ },
  "token": "2|xyz789..."
}

Response 401: {
  "message": "Invalid credentials"
}
```

**POST /api/logout** (protected: `auth:sanctum`)
```json
Request: (empty body, token in header)
Header: Authorization: Bearer {token}

Response 200: {
  "message": "Logged out successfully"
}

Response 401: {
  "message": "Unauthenticated"
}
```

**GET /api/user** (protected: `auth:sanctum`)
```json
Request: (no body, token in header)
Header: Authorization: Bearer {token}

Response 200: {
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "...",
  "updated_at": "..."
}
```

### API Endpoints (Progress - Phase 3, to be implemented)

**GET /api/progress** (protected: `auth:sanctum`)
Returns all progress records for authenticated user.
```json
Response 200: [
  {
    "id": 1,
    "user_id": 1,
    "lesson_id": 5,
    "completed": true,
    "completed_at": "2025-10-29T14:30:00.000000Z",
    "created_at": "...",
    "updated_at": "..."
  },
  ...
]
```

**POST /api/progress** (protected: `auth:sanctum`)
Mark a lesson as complete for authenticated user.
```json
Request: {
  "lesson_id": 5
}

Response 201: {
  "id": 1,
  "user_id": 1,
  "lesson_id": 5,
  "completed": true,
  "completed_at": "2025-10-29T14:30:00.000000Z",
  ...
}

Response 422: {
  "message": "Progress already exists for this lesson"
}
```

**DELETE /api/progress/{lessonId}** (protected: `auth:sanctum`)
Mark a lesson as incomplete (delete progress record).
```json
Response 200: {
  "message": "Progress removed successfully"
}

Response 404: {
  "message": "Progress not found"
}
```

### Database Schema

**users table** (existing)
```sql
id: bigint (PK)
name: varchar
email: varchar (unique)
password: varchar
created_at: timestamp
updated_at: timestamp
```

**lessons table** (existing)
```sql
id: bigint (PK)
module_id: bigint (FK → modules)
title: varchar
slug: varchar
content: text
order_index: int
created_at: timestamp
updated_at: timestamp
```

**user_progress table** (Phase 3 migration)
```sql
id: bigint (PK)
user_id: bigint (FK → users, CASCADE)
lesson_id: bigint (FK → lessons, CASCADE)
completed: boolean (default: false)
completed_at: timestamp (nullable)
created_at: timestamp
updated_at: timestamp

UNIQUE(user_id, lesson_id)
INDEX(user_id, completed)
```

**personal_access_tokens table** (Sanctum)
```sql
id: bigint (PK)
tokenable_type: varchar
tokenable_id: bigint
name: varchar
token: varchar (unique, hashed)
abilities: text
last_used_at: timestamp
expires_at: timestamp
created_at: timestamp
updated_at: timestamp
```

### Eloquent Relationships (to be implemented in Phase 3)

**User model:**
```php
public function progress(): HasMany
{
    return $this->hasMany(UserProgress::class);
}
```

**Lesson model:**
```php
public function userProgress(): HasMany
{
    return $this->hasMany(UserProgress::class);
}
```

**UserProgress model:**
```php
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}

public function lesson(): BelongsTo
{
    return $this->belongsTo(Lesson::class);
}
```

## Dependencies

### Backend Dependencies:
- **Laravel 12** - PHP framework
- **Laravel Sanctum v4.2.0** - API token authentication
- **Supabase PostgreSQL** - Database (via connection config in `.env`)
- **Eloquent ORM** - Database query builder

### Frontend Dependencies:
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Component library
- **React Router** - Client-side routing
- **React Query** (planned for Phase 4) - Data fetching and caching

### Environment Variables:
Backend `.env` requires:
```
DB_CONNECTION=pgsql
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_DATABASE=postgres
DB_USERNAME=postgres.{project-id}
DB_PASSWORD={password}

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DRIVER=cookie
```

Frontend `authService.ts` hardcodes:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

## Decision Log

**2025-10-29: Use Laravel Sanctum for API authentication**
- **Rationale:** Sanctum provides simple token-based auth perfect for SPAs. Lightweight alternative to OAuth/Passport. Well-documented and Laravel-native.
- **Impact:** All API endpoints require Bearer token in header. Frontend stores token in localStorage. Tokens don't expire automatically (could add expiration later).

**2025-10-29: Store token in localStorage (not cookies)**
- **Rationale:** Simplicity for development. SPA pattern (React) makes localStorage easier than CSRF-protected cookies. User explicitly logs out to revoke token.
- **Impact:** Token persists across browser sessions. No automatic expiration. Vulnerable to XSS (acceptable risk for learning platform). Easy to implement and debug.

**2025-10-29: Use unique constraint on (user_id, lesson_id) instead of separate "incomplete" records**
- **Rationale:** Binary state: lesson is either completed or not. If record exists with `completed=true`, lesson is complete. If record doesn't exist, lesson is incomplete. No need to store "incomplete" records.
- **Impact:** Marking incomplete = DELETE the record. Simpler queries. Less storage. Unique constraint prevents duplicate completions. Trade-off: lose historical "uncomplete" events (acceptable for MVP).

**2025-10-29: Split implementation into 4 phases instead of doing all at once**
- **Rationale:** Large feature with many moving parts. Authentication is prerequisite for progress tracking. Incremental testing reduces debugging complexity. Can deploy auth early while building progress.
- **Impact:** Longer total timeline. More context switching. But higher confidence in each piece. Easier to debug issues. Cleaner git history. Better documentation.

**2025-10-29: Use React Context for auth state instead of React Query**
- **Rationale:** Auth state is truly global (needed everywhere). Context provides simpler API than React Query for this use case. Token and user data don't need refetching/caching logic (loaded once on mount).
- **Impact:** AuthContext wraps entire app. `useAuth()` hook available everywhere. Manual localStorage management. Will use React Query for progress data (Phase 4) since that needs refetching/caching.

**2025-10-29: Create progress API endpoints as separate controller (not nested under user)**
- **Rationale:** Progress belongs to authenticated user implicitly (via Sanctum). No need for `/api/users/{id}/progress` nesting. Simpler routes: `/api/progress`. Controller gets user from `$request->user()`.
- **Impact:** Cleaner API surface. No need to pass user ID in frontend calls. Users can only access their own progress (automatic security). Consistent with auth endpoints pattern.

## Quick Resume Instructions

If you're resuming this task after context loss or `/compact`, read these 3 files to get up to speed:

1. **Read this file** ([user-progress-tracking-context.md](./.claude/devdocs/user-progress-tracking-context.md)) - Current state and decisions
2. **Read the plan** ([user-progress-tracking-plan.md](./.claude/devdocs/user-progress-tracking-plan.md)) - Full 4-phase roadmap with acceptance criteria
3. **Read the tasks** ([user-progress-tracking-tasks.md](./.claude/devdocs/user-progress-tracking-tasks.md)) - Detailed checklist with links

**✅ PROJECT COMPLETE - All 4 Phases Finished**

This user progress tracking implementation is complete. All backend API endpoints are working, frontend UI is integrated, and all functionality has been tested.

**Key files to reference:**
- [PHASE_1_2_AUTH_SUMMARY.md](../../docs/07-project-log/PHASE_1_2_AUTH_SUMMARY.md) - Complete Phase 1 & 2 details
- [Migration file](../../backend/database/migrations/2025_10_29_143205_create_user_progress_table.php) - Database schema
- [ProgressController](../../backend/app/Http/Controllers/Api/ProgressController.php) - Backend API implementation
- [progressService.ts](../../frontend/src/services/progressService.ts) - Frontend progress API client
- [ModuleView.tsx](../../frontend/src/pages/ModuleView.tsx) - Lesson completion UI
- [Modules.tsx](../../frontend/src/pages/Modules.tsx) - Module progress display

**Git Commits:**
- Backend Phase 3: `027e06a` - Backend progress tracking API
- Frontend Phase 4: `c957d05` - Frontend progress tracking UI

**Current status:** ✅ All 4 phases complete - User progress tracking fully implemented and tested.
