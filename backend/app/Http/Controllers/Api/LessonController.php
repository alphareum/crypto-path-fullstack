<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    /**
     * Display a listing of lessons for a specific module.
     */
    public function index(string $moduleId)
    {
        // Find the module or return 404
        $module = Module::findOrFail($moduleId);

        // Get all published lessons for this module, ordered by sequence
        $lessons = $module->lessons()
            ->where('is_published', true)
            ->orderBy('order')
            ->get();

        return response()->json($lessons);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified lesson for a specific module.
     */
    public function show(string $moduleId, string $lessonId)
    {
        // Find the lesson that belongs to the module and is published
        $lesson = Lesson::where('module_id', $moduleId)
            ->where('id', $lessonId)
            ->where('is_published', true)
            ->firstOrFail();

        return response()->json($lesson);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
