<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudySession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'date',
        'time',
        'duration',
        'location',
        'meeting_link',
        'participants',
    ];

    protected $casts = [
        'date' => 'string',
        'duration' => 'integer',
        'participants' => 'array',
    ];

    /**
     * Get the host/creator of the study session.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
