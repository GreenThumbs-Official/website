<?php

namespace Database\Seeders;

use App\Models\Plant;
use Illuminate\Database\Seeder;

class PlantSeeder extends Seeder
{
    public function run()
    {
        Plant::create([
            'name' => 'Tomato',
            'description' => 'A popular garden vegetable known for its red fruit.',
            'image' => 'tomato.jpg',
            'origin' => 'South America',
            'length' => 120,
            'fruit_production_month' => 'July',
            'max_temp' => 35,
            'min_temp' => 10
        ]);
        Plant::create([
            'name' => 'Basil',
            'description' => 'A fragrant herb used in many dishes.',
            'image' => 'basil.jpg',
            'origin' => 'India',
            'length' => 40,
            'fruit_production_month' => 'August',
            'max_temp' => 30,
            'min_temp' => 12
        ]);
        Plant::create([
            'name' => 'Strawberry',
            'description' => 'A sweet red fruit enjoyed worldwide.',
            'image' => 'strawberry.jpg',
            'origin' => 'Europe',
            'length' => 25,
            'fruit_production_month' => 'June',
            'max_temp' => 28,
            'min_temp' => 5
        ]);
    }
}
