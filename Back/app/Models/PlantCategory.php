<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class PlantCategory extends Model
{
    use HasUlids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['name', 'description'];

    public function plants()
    {
        return $this->belongsToMany(Plant::class, 'plant_category_plant');
    }
}
