<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Plant extends Model
{
    use HasUlids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'description',
        'image',
        'origin',
        'length',
        'fruit_production_month',
        'max_temp',
        'min_temp'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_plants')
                    ->withPivot('last_watered', 'watering_frequency', 'custom_name', 'description', 'origin', 'image', 'planted_date', 'growth_progress')
                    ->withTimestamps();
    }
}
