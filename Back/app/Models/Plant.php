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
        'image'
    ];

    public function categories()
    {
        return $this->belongsToMany(PlantCategory::class, 'plant_category_plant');
    }

    public function types()
    {
        return $this->belongsToMany(PlantType::class, 'plant_type_plant');
    }
}

