<?php

namespace Database\Seeders;

use App\Models\Intrest;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IntrestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Intrest::create([
            'name' => 'Gardening',
        ]);
        Intrest::create([
            'name' => 'Botany',
        ]);
        Intrest::create([
            'name' => 'Horticulture',
        ]);
        Intrest::create([
            'name' => 'Plant Care',
        ]);
        Intrest::create([
            'name' => 'Sustainable Gardening',
        ]);
        Intrest::create([
            'name' => 'Organic Gardening',
        ]);
    }
}
