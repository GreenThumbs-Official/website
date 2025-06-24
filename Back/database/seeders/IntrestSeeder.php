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
        Intrest::query()->delete();
        
        Intrest::create([
            'name' => 'Plantes d\'intérieur',
        ]);
        Intrest::create([
            'name' => 'Plantes d\'extérieur',
        ]);
        Intrest::create([
            'name' => 'Succulentes',
        ]);
        Intrest::create([
            'name' => 'Fleurs',
        ]);
        Intrest::create([
            'name' => 'Légumes',
        ]);
        Intrest::create([
            'name' => 'Fruits',
        ]);
        Intrest::create([
            'name' => 'Herbes aromatiques',
        ]);
        Intrest::create([
            'name' => 'Plantes exotiques',
        ]);
    }
}
