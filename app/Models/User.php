<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable([
    'name',
    'email',
    'password',
    'avatar',
    'university',
    'major',
    'academic_year',
    'academic_status',
    'bio',
    'learning_style',
    'goals',
    'weekly_availability',
    'is_online',
    'last_active_at',
    'is_profile_completed',
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'goals' => 'array',
            'weekly_availability' => 'array',
            'is_online' => 'boolean',
            'is_profile_completed' => 'boolean',
            'last_active_at' => 'datetime',
        ];
    }

    /**
     * Courses the user is enrolled in.
     */
    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class)->withTimestamps();
    }

    /**
     * Match requests sent by this user.
     */
    public function sentMatchRequests(): HasMany
    {
        return $this->hasMany(MatchRequest::class, 'sender_id');
    }

    /**
     * Match requests received by this user.
     */
    public function receivedMatchRequests(): HasMany
    {
        return $this->hasMany(MatchRequest::class, 'receiver_id');
    }

    /**
     * Messages sent by this user.
     */
    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    /**
     * Messages received by this user.
     */
    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }
}
