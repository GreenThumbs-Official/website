<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WateringHistory extends Model
{
    protected $table = 'watering_history';
    
    protected $fillable = [
        'user_id',
        'plant_id',
        'watered_date',
        'watered_time',
        'notes'
    ];
    
    protected $casts = [
        'watered_date' => 'date',
        'watered_time' => 'datetime:H:i:s'
    ];
    
    /**
     * Relation avec l'utilisateur
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Relation avec la plante
     */
    public function plant(): BelongsTo
    {
        return $this->belongsTo(Plant::class);
    }
    
    /**
     * Scope pour filtrer par utilisateur
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
    
    /**
     * Scope pour filtrer par plante
     */
    public function scopeForPlant($query, $plantId)
    {
        return $query->where('plant_id', $plantId);
    }
    
    /**
     * Scope pour filtrer par date
     */
    public function scopeForDate($query, $date)
    {
        return $query->whereDate('watered_date', $date);
    }
}
