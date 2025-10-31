# PLAN — user-progress-tracking: User Progress Tracking System
- Owner: alpha
- Created: 2025-10-29
- Status: ✅ Complete (All 4 Phases Finished)

## Scope

**Problem:**
Crypto Path learning platform needs a system to track which lessons users have completed, persist their progress, and display completion status in the UI. Users should be able to:
- Mark lessons as complete/incomplete
- See their progress percentage per module
- Have progress persist across sessions
- View completion status (checkmarks on completed lessons)

**Solution:**
4-phase implementation adding user progress tracking to the existing modules/lessons system:
- Phase 1: Backend Authentication (Sanctum token-based API auth)
- Phase 2: Frontend Authentication (React Context + Login/Register UI)
- Phase 3: Backend Progress Tracking (UserProgress model + API endpoints)
- Phase 4: Frontend Progress Integration (Progress UI + state management)

**Out of scope:**
- Progress analytics/reporting (future feature)
- Progress sharing between users
- Progress export/import functionality
- Time-based progress metrics (focus on binary completed/not completed)
- Progress notifications/reminders

## Constraints & Assumptions

**Tech/infra:**
- Backend: Laravel 12 + Sanctum authentication
- Frontend: React 18 + Vite + TailwindCSS + shadcn/ui
- Database: Supabase PostgreSQL via Eloquent ORM
- API: RESTful JSON endpoints with Bearer token authentication
- State: React Context API for auth state, React Query for data fetching

**Non-functional:**
- **Performance:** Progress API calls must respond <200ms
- **Security:** All progress endpoints protected by Sanctum middleware, users can only access their own progress
- **UX:** Optimistic UI updates for marking complete/incomplete (instant feedback)
- **Data integrity:** Unique constraint prevents duplicate progress records per user-lesson pair
- **Cost:** No additional infrastructure costs (uses existing Supabase database)

## Acceptance Criteria (testable)

### Phase 1: Backend Authentication ✅ COMPLETE
- [x] Laravel Sanctum installed and configured
- [x] POST /api/register endpoint creates user and returns token
- [x] POST /api/login endpoint authenticates and returns token
- [x] POST /api/logout endpoint revokes current token
- [x] GET /api/user endpoint returns authenticated user data
- [x] personal_access_tokens migration run successfully
- [x] All endpoints tested with curl and return expected responses

### Phase 2: Frontend Authentication ✅ COMPLETE
- [x] AuthContext.tsx provides global auth state (user, token, loading)
- [x] authService.ts implements register, login, logout, getUser, checkAuth
- [x] Login.tsx page with email/password form and error handling
- [x] Register.tsx page with validation (name min 2, email valid, password min 8, passwords match)
- [x] ProtectedRoute.tsx wrapper redirects unauthenticated users to /login
- [x] Navigation.tsx shows conditional UI (Login/Register when logged out, Logout when logged in)
- [x] Token persists in localStorage across sessions
- [x] Frontend build succeeds (378.84 kB bundle)

### Phase 3: Backend Progress Tracking ✅ COMPLETE
- [x] Migration created: user_progress table with user_id, lesson_id, completed, completed_at
- [x] Unique constraint on (user_id, lesson_id)
- [x] Index on (user_id, completed) for query performance
- [x] UserProgress model created with relationships (belongsTo User, belongsTo Lesson)
- [x] User model updated with progress() hasMany relationship
- [x] Lesson model updated with userProgress() hasMany relationship
- [x] ProgressController created with index(), store(), destroy() methods
- [x] Routes added: GET /api/progress, POST /api/progress, DELETE /api/progress/{lessonId}
- [x] Sanctum auth middleware applied to all progress routes
- [x] API endpoints tested with curl (as authenticated user)

### Phase 4: Frontend Progress Integration ✅ COMPLETE
- [x] progressService.ts created with getProgress(), markComplete(), markIncomplete()
- [x] ModuleView.tsx updated with "Mark Complete" button per lesson
- [x] Modules.tsx updated with progress display per module
- [x] Completed lessons show checkmark icons
- [x] Module completion count displayed (X lessons completed)
- [x] Optimistic UI updates (instant feedback, rollback on error)
- [x] Loading states for progress operations
- [x] Error handling for API failures
- [x] All functionality tested in browser and working correctly

## Risks → Mitigations

**Risk 1: Race conditions on progress updates**
- Impact: Multiple simultaneous complete/incomplete toggles could cause inconsistent state
- Mitigation: Frontend debounces rapid clicks, backend uses unique constraint to prevent duplicates, optimistic UI with rollback on error

**Risk 2: Progress data loss**
- Impact: If user_progress table drops or corrupts, all user progress lost
- Mitigation: Foreign key constraints with CASCADE delete maintain referential integrity, regular Supabase backups

**Risk 3: Performance degradation with large datasets**
- Impact: Thousands of users with hundreds of lessons could slow progress queries
- Mitigation: Database indexes on (user_id, completed), pagination on frontend, cache module progress calculations

**Risk 4: Token expiration breaking progress updates**
- Impact: User marks lesson complete but token expired, request fails silently
- Mitigation: AuthContext refreshes token on mount, progress API returns 401 on token expiry (triggers re-login), error toast notifies user

**Risk 5: Inconsistent state between frontend and backend**
- Impact: UI shows completed but backend doesn't have record (or vice versa)
- Mitigation: React Query cache invalidation after mutations, periodic background sync, retry logic on network failures

## Milestones

**M0: Design sign-off** ✅ COMPLETE (Oct 29, 2025)
- 4-phase plan documented in PHASE_1_2_AUTH_SUMMARY.md
- Database schema designed (user_progress table)
- API contract defined (3 endpoints: GET /api/progress, POST /api/progress, DELETE /api/progress/{lessonId})
- UI mockups reviewed (progress bars, checkmarks, "Mark Complete" button)

**M1: First runnable** ✅ COMPLETE (Oct 29, 2025)
- Phase 1 & 2 complete: Full authentication system working
- Users can register, login, logout
- Protected routes functional
- Token persistence working
- Ready to build on top with progress tracking

**M2: E2E validated** ✅ COMPLETE (Oct 30, 2025)
- Phase 3 complete: Backend progress API functional
- Can mark lessons complete/incomplete via curl
- Progress persists in database
- Relationships working (user → progress ← lesson)
- Ready for frontend integration

**M3: Shipped + telemetry green** ✅ COMPLETE (Oct 31, 2025)
- Phase 4 complete: Full progress tracking UI integrated
- Users can mark lessons complete from UI
- Progress display shows completion count per module
- All acceptance criteria met
- No console errors, HMR working perfectly
- Tested and validated in browser
- Committed to git (c957d05)

## Links

**Documentation:**
- [PHASE_1_2_AUTH_SUMMARY.md](../../docs/07-project-log/PHASE_1_2_AUTH_SUMMARY.md) - Complete Phase 1 & 2 implementation details
- [PROJECT_JOURNEY.md](../../docs/07-project-log/PROJECT_JOURNEY.md) - Overall project history and context

**Database:**
- Migration: `database/migrations/2025_10_29_143205_create_user_progress_table.php`

**Key Files (to be created in Phase 3):**
- Backend: `app/Models/UserProgress.php`, `app/Http/Controllers/Api/ProgressController.php`
- Routes: `routes/api.php` (progress endpoints)

**Key Files (to be created in Phase 4):**
- Frontend: `frontend/src/services/progressService.ts`
- Components: `frontend/src/pages/ModuleView.tsx` (update), `frontend/src/pages/Modules.tsx` (update)
