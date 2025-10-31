---
name: backend-laravel-guidelines
description: Backend development guidelines for Laravel/PHP applications. Covers MVC architecture, Eloquent ORM, validation, middleware, Sanctum authentication, API resources, and testing. Use when creating controllers, models, routes, services, API endpoints, or working with backend code.
---

# Backend Development Guidelines (Laravel)

## Purpose

Comprehensive guide for Laravel backend development, emphasizing clean architecture, proper validation, security, and maintainability.

## When to Use This Skill

- Creating API endpoints and routes
- Building controllers and services
- Working with Eloquent models
- Database migrations and queries
- Validation with Form Requests
- Authentication with Sanctum
- Middleware implementation
- Exception handling
- API resource transformations
- Testing with PHPUnit

---

## Quick Start

### New API Endpoint Checklist

Creating an API endpoint? Follow this:

- [ ] Define route in `routes/api.php`
- [ ] Create/update Controller with typed methods
- [ ] Use Form Request for validation
- [ ] Delegate business logic to Service class
- [ ] Use Eloquent models for database operations
- [ ] Return API Resource for consistent responses
- [ ] Add middleware for auth/permissions
- [ ] Handle exceptions gracefully
- [ ] Write feature test for endpoint
- [ ] Document in API docs (if applicable)

### New Feature Checklist

Creating a feature? Set up this structure:

- [ ] Create migration: `php artisan make:migration`
- [ ] Create Model: `php artisan make:model -m`
- [ ] Create Controller: `php artisan make:controller Api/{Name}Controller`
- [ ] Create Form Request: `php artisan make:request`
- [ ] Create Service class in `app/Services/`
- [ ] Create API Resource: `php artisan make:resource`
- [ ] Define routes with proper grouping
- [ ] Add authentication middleware
- [ ] Write tests

---

## Common Imports Cheatsheet

```php
<?php

// Base
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

// Models
use App\Models\User;
use App\Models\Post;

// Form Requests
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;

// Resources
use App\Http\Resources\PostResource;
use App\Http\Resources\PostCollection;

// Services
use App\Services\PostService;

// Eloquent
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

// Validation
use Illuminate\Validation\ValidationException;

// Auth
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;
```

---

## Topic Guides

### 🛣️ Routes & Controllers

**Route Definition:**
```php
// routes/api.php
use App\Http\Controllers\Api\PostController;

// Public routes
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);
});

// Route model binding with specific column
Route::get('/posts/{post:slug}', [PostController::class, 'show']);
```

**Controller Pattern:**
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Services\PostService;
use App\Models\Post;
use Illuminate\Http\JsonResponse;

class PostController extends Controller
{
    public function __construct(
        private readonly PostService $postService
    ) {}

    public function index(): JsonResponse
    {
        $posts = $this->postService->getAllPosts();
        return response()->json(PostResource::collection($posts));
    }

    public function show(Post $post): JsonResponse
    {
        return response()->json(new PostResource($post));
    }

    public function store(StorePostRequest $request): JsonResponse
    {
        $post = $this->postService->createPost($request->validated());
        return response()->json(new PostResource($post), 201);
    }

    public function update(UpdatePostRequest $request, Post $post): JsonResponse
    {
        $updated = $this->postService->updatePost($post, $request->validated());
        return response()->json(new PostResource($updated));
    }

    public function destroy(Post $post): JsonResponse
    {
        $this->postService->deletePost($post);
        return response()->json(null, 204);
    }
}
```

**Key Principles:**
- Controllers are THIN - delegate to Services
- Use dependency injection for services
- Type-hint everything (parameters, return types)
- Use route model binding when possible
- Return JSON responses with proper status codes

---

### 🔧 Service Layer Pattern

**Purpose:** Business logic lives in Services, NOT Controllers

**Service Class:**
```php
<?php

namespace App\Services;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class PostService
{
    public function getAllPosts(array $filters = []): Collection
    {
        $query = Post::with('user')
            ->where('status', 'published');

        if (isset($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        return $query->latest()->get();
    }

    public function createPost(array $data): Post
    {
        return DB::transaction(function () use ($data) {
            $post = Post::create($data);

            // Additional business logic
            Cache::forget('posts:latest');

            return $post->load('user');
        });
    }

    public function updatePost(Post $post, array $data): Post
    {
        $post->update($data);
        return $post->fresh();
    }

    public function deletePost(Post $post): void
    {
        DB::transaction(function () use ($post) {
            $post->comments()->delete();
            $post->delete();
            Cache::forget('posts:latest');
        });
    }
}
```

**Best Practices:**
- One service per domain/model
- Use database transactions for multi-step operations
- Return Eloquent models/collections (not arrays)
- Handle cache invalidation here
- Keep methods focused and testable

---

### 🗃️ Eloquent Models & ORM

**Model Definition:**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'status',
        'user_id',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'metadata' => 'array',
    ];

    protected $hidden = [
        'user_id',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // Accessors
    public function getExcerptAttribute(): string
    {
        return substr($this->content, 0, 100) . '...';
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
}
```

**Query Best Practices:**
```php
// ✅ GOOD - Eager load relationships (prevent N+1)
$posts = Post::with('user', 'comments')->get();

// ✅ GOOD - Use query scopes
$posts = Post::published()->latest()->get();

// ✅ GOOD - Select specific columns
$posts = Post::select('id', 'title', 'created_at')->get();

// ✅ GOOD - Use transactions for multiple writes
DB::transaction(function () {
    $post = Post::create($data);
    $post->tags()->attach($tagIds);
});

// ❌ BAD - N+1 query problem
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->user->name; // N+1 queries!
}

// ❌ BAD - Using loops instead of bulk operations
foreach ($posts as $post) {
    $post->update(['status' => 'archived']);
}
// ✅ GOOD
Post::whereIn('id', $ids)->update(['status' => 'archived']);
```

---

### ✅ Validation with Form Requests

**Form Request Class:**
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Check if user is allowed to create posts
        return $this->user()?->can('create', Post::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'unique:posts,slug'],
            'content' => ['required', 'string', 'min:10'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'category' => ['required', 'exists:categories,id'],
            'tags' => ['array'],
            'tags.*' => ['exists:tags,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'A post title is required',
            'slug.unique' => 'This slug is already taken',
        ];
    }

    // Transform input before validation
    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => $this->slug ?? str($this->title)->slug(),
        ]);
    }
}
```

**Common Validation Rules:**
```php
[
    'email' => ['required', 'email', 'unique:users'],
    'password' => ['required', 'min:8', 'confirmed'],
    'age' => ['required', 'integer', 'min:18'],
    'url' => ['required', 'url'],
    'date' => ['required', 'date', 'after:today'],
    'file' => ['required', 'file', 'mimes:pdf,doc', 'max:2048'],
    'status' => ['required', Rule::in(['active', 'inactive'])],
]
```

---

### 🔐 Authentication with Sanctum

**Setup User Model:**
```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = ['name', 'email', 'password'];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = ['email_verified_at' => 'datetime'];
}
```

**Auth Controller:**
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(): JsonResponse
    {
        auth()->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function me(): JsonResponse
    {
        return response()->json(auth()->user());
    }
}
```

---

### 🎯 API Resources

**Resource Class:**
```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->when($request->routeIs('posts.show'), $this->content),
            'status' => $this->status,
            'author' => new UserResource($this->whenLoaded('user')),
            'comments_count' => $this->when($this->relationLoaded('comments'),
                $this->comments->count()
            ),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
```

**Collection Resource:**
```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PostCollection extends ResourceCollection
{
    public function toArray($request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total' => $this->total(),
                'current_page' => $this->currentPage(),
            ],
        ];
    }
}
```

---

### 🛡️ Middleware

**Creating Middleware:**
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckUserRole
{
    public function handle(Request $request, Closure $next, string $role)
    {
        if (!$request->user() || !$request->user()->hasRole($role)) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
```

**Register in routes:**
```php
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/admin/posts', [AdminPostController::class, 'store']);
});
```

---

### 🧪 Testing with PHPUnit

**Feature Test:**
```php
<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_post(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/posts', [
            'title' => 'Test Post',
            'content' => 'This is test content',
            'status' => 'published',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'title' => 'Test Post',
            ]);

        $this->assertDatabaseHas('posts', [
            'title' => 'Test Post',
            'user_id' => $user->id,
        ]);
    }

    public function test_guest_cannot_create_post(): void
    {
        $response = $this->postJson('/api/posts', [
            'title' => 'Test Post',
        ]);

        $response->assertStatus(401);
    }
}
```

---

## Core Principles

1. **Controllers are Thin**: Delegate business logic to Services
2. **Validate Everything**: Use Form Requests for all input validation
3. **Type Everything**: Use PHP type hints for parameters and returns
4. **Eager Load Relations**: Prevent N+1 queries with `with()`
5. **Use Transactions**: Wrap multi-step database operations in `DB::transaction()`
6. **API Resources**: Transform responses consistently
7. **Sanctum for Auth**: Use token-based authentication for APIs
8. **Test Everything**: Write feature tests for all endpoints
9. **Handle Exceptions**: Provide meaningful error messages
10. **Follow PSR Standards**: Use PHP coding standards

---

## Quick Reference: API Endpoint Template

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResourceRequest;
use App\Http\Resources\ResourceResource;
use App\Services\ResourceService;
use App\Models\Resource;
use Illuminate\Http\JsonResponse;

class ResourceController extends Controller
{
    public function __construct(
        private readonly ResourceService $resourceService
    ) {}

    public function index(): JsonResponse
    {
        $resources = $this->resourceService->getAll();
        return response()->json(ResourceResource::collection($resources));
    }

    public function store(StoreResourceRequest $request): JsonResponse
    {
        $resource = $this->resourceService->create($request->validated());
        return response()->json(new ResourceResource($resource), 201);
    }

    public function show(Resource $resource): JsonResponse
    {
        return response()->json(new ResourceResource($resource));
    }

    public function update(UpdateResourceRequest $request, Resource $resource): JsonResponse
    {
        $updated = $this->resourceService->update($resource, $request->validated());
        return response()->json(new ResourceResource($updated));
    }

    public function destroy(Resource $resource): JsonResponse
    {
        $this->resourceService->delete($resource);
        return response()->json(null, 204);
    }
}
```

---

## Related Skills

- **frontend-guidelines**: Frontend patterns that consume this API
- **testing**: Testing patterns for backend code

---

**Skill Status**: Adapted for Laravel 12 + Sanctum + Eloquent + PostgreSQL stack
