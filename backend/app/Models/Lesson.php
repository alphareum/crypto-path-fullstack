<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'module_id',
        'title',
        'slug',
        'description',
        'type',
        'duration',
        'order',
        'video_url',
        'pdf_url',
        'content',
        'is_published',
        'is_free',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'is_published' => 'boolean',
        'is_free' => 'boolean',
    ];

    /**
     * Get the module that owns the lesson.
     */
    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    /**
     * Get all progress records for this lesson
     */
    public function userProgress(): HasMany
    {
        return $this->hasMany(UserProgress::class);
    }
}
