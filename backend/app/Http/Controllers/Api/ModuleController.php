<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get all published modules from database
        $modules = Module::where('is_published', true)
                        ->orderBy('id')
                        ->get();

        // Return as JSON response
        return response()->json($modules);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Find published module by ID with lessons, return 404 if not found
        $module = Module::where('is_published', true)
            ->with('lessons')
            ->findOrFail($id);

        // Return as JSON response
        return response()->json($module);
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
