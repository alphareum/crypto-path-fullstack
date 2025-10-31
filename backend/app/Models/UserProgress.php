<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProgress extends Model
{
    use HasFactory;

    protected $table = 'user_progress';

    protected $fillable = [
        'user_id',
        'lesson_id',
        'completed',
        'completed_at',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the user that owns this progress record
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the lesson that this progress record belongs to
     */
    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }
}
