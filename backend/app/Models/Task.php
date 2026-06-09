<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'user_id',
        'course_id',
        'title',
        'description',
        'deadline',
        'difficulty',
        'estimated_hours',
        'progress',
        'status',
        'priority',
        'ai_priority_score',
        'ai_analysis',
        'ai_suggested_start',
        'completed_at',
    ];

    protected $casts = [
        'user_id'            => 'integer', 
        'course_id'          => 'integer', 
        'deadline'           => 'datetime',
        'difficulty'         => 'integer',
        'estimated_hours'    => 'float',
        'ai_suggested_start' => 'date',
        'progress'           => 'integer',
        'completed_at'       => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function getDaysRemainingAttribute(): int
    {
        return now()->diffInDays($this->deadline, false);
    }

    // Auto set status overdue kalau deadline sudah lewat
    public function checkAndUpdateOverdue(): void
    {
        if ($this->status !== 'completed' && $this->deadline->isPast()) {
            $this->update(['status' => 'overdue']);
        }
    }
}