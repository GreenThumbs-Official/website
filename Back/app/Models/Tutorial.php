<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Tutorial extends Model
{
    use HasUlids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'tutorial',
        'plant_id'
    ];

    public function plant()
    {
        return $this->belongsTo(Plant::class);
    }

}
