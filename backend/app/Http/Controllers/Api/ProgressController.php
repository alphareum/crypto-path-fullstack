<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProgressController extends Controller
{
    /**
     * Get all progress records for the authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        $progress = $request->user()->progress()->with('lesson')->get();

        return response()->json($progress);
    }

    /**
     * Mark a lesson as complete for the authenticated user
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'lesson_id' => ['required', 'integer', 'exists:lessons,id'],
        ]);

        try {
            $progress = DB::transaction(function () use ($request) {
                // Check if progress already exists
                $existing = UserProgress::where('user_id', $request->user()->id)
                    ->where('lesson_id', $request->lesson_id)
                    ->first();

                if ($existing) {
                    // Update existing progress
                    $existing->update([
                        'completed' => true,
                        'completed_at' => now(),
                    ]);
                    return $existing->load('lesson');
                }

                // Create new progress record
                return UserProgress::create([
                    'user_id' => $request->user()->id,
                    'lesson_id' => $request->lesson_id,
                    'completed' => true,
                    'completed_at' => now(),
                ]);
            });

            return response()->json($progress->load('lesson'), 201);

        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'lesson_id' => ['Failed to mark lesson as complete.'],
            ]);
        }
    }

    /**
     * Mark a lesson as incomplete (delete progress record)
     */
    public function destroy(Request $request, int $lessonId): JsonResponse
    {
        $progress = UserProgress::where('user_id', $request->user()->id)
            ->where('lesson_id', $lessonId)
            ->first();

        if (!$progress) {
            return response()->json([
                'message' => 'Progress not found'
            ], 404);
        }

        $progress->delete();

        return response()->json([
            'message' => 'Progress removed successfully'
        ]);
    }
}
