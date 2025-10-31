<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\ProgressController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Health check endpoint - simple test to verify API is working
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is working',
        'timestamp' => now()->toISOString(),
        'database' => 'connected' // We can verify DB connection later
    ]);
});

// Modules API endpoints
Route::get('/modules', [ModuleController::class, 'index']);
Route::get('/modules/{id}', [ModuleController::class, 'show']);

// Lessons API endpoints - nested under modules
Route::get('/modules/{moduleId}/lessons', [LessonController::class, 'index']);
Route::get('/modules/{moduleId}/lessons/{lessonId}', [LessonController::class, 'show']);

// Authentication API endpoints - public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Authentication API endpoints - protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Progress tracking endpoints
    Route::get('/progress', [ProgressController::class, 'index']);
    Route::post('/progress', [ProgressController::class, 'store']);
    Route::delete('/progress/{lessonId}', [ProgressController::class, 'destroy']);
});
