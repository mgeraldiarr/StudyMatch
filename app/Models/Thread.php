<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Thread extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'channel',
        'title',
        'body',
        'votes',
        'views',
        'is_solved',
        'is_pinned',
    ];

    protected $casts = [
        'votes' => 'integer',
        'views' => 'integer',
        'is_solved' => 'boolean',
        'is_pinned' => 'boolean',
    ];

    /**
     * Get the author of the thread.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get replies to this thread.
     */
    public function replies(): HasMany
    {
        return $this->hasMany(ThreadReply::class);
    }
}
