<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    use HasUlids;

    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'ville',
        'pays',
        'onboarding_completed',
        'bio',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

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
        ];
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    /**
     * The interests that belong to the user.
     */
    public function interests()
    {
        return $this->belongsToMany(Intrest::class, 'user_intrests');
    }

    /**
     * The favorite plants that belong to the user (for profile management).
     */
    public function favoritePlants()
    {
        return $this->belongsToMany(Plant::class, 'user_plants')
                    ->withPivot('last_watered', 'watering_frequency', 'custom_name', 'description', 'origin', 'image', 'planted_date', 'growth_progress')
                    ->withTimestamps();
    }

    /**
     * The plants that belong to the user.
     */
    public function plants()
    {
        return $this->belongsToMany(Plant::class, 'user_plants')
                    ->withPivot('last_watered', 'watering_frequency', 'custom_name', 'description', 'origin', 'image', 'planted_date', 'growth_progress')
                    ->withTimestamps();
    }

    /**
     * The favorite plants from onboarding (stored in favorites table).
     */
    public function onboardingFavorites()
    {
        return $this->belongsToMany(Favorite::class, 'user_favorite');
    }
}
