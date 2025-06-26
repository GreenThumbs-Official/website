<?php

namespace Database\Seeders;

use App\Models\Plant;
use Illuminate\Database\Seeder;

class PlantSeeder extends Seeder
{
    public function run()
    {
        Plant::query()->delete();
        
        Plant::create([
            'name' => 'Monstera Deliciosa',
            'description' => 'Une plante d\'intérieur populaire avec des feuilles perforées distinctives.',
            'image' => 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80',
            'origin' => 'Amérique centrale',
            'length' => 200,
            'fruit_production_month' => 6,
            'max_temp' => 30,
            'min_temp' => 15
        ]);
        Plant::create([
            'name' => 'Ficus Lyrata',
            'description' => 'Également connu sous le nom de figuier à feuilles de violon, c\'est une plante d\'intérieur populaire.',
            'image' => 'https://images.unsplash.com/photo-1616690710400-a16d146927c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80',
            'origin' => 'Afrique de l\'Ouest',
            'length' => 300,
            'fruit_production_month' => 6,
            'max_temp' => 30,
            'min_temp' => 16
        ]);
        Plant::create([
            'name' => 'Pothos Doré',
            'description' => 'Une plante d\'intérieur facile à entretenir avec des feuilles en forme de cœur.',
            'image' => 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80',
            'origin' => 'Asie du Sud-Est',
            'length' => 150,
            'fruit_production_month' => 6,
            'max_temp' => 32,
            'min_temp' => 12
        ]);
        Plant::create([
            'name' => 'Sansevière',
            'description' => 'Également connue sous le nom de langue de belle-mère, c\'est une plante d\'intérieur robuste.',
            'image' => 'https://images.unsplash.com/photo-1593482892290-f54927ae2b7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80',
            'origin' => 'Afrique',
            'length' => 120,
            'fruit_production_month' => 6,
            'max_temp' => 35,
            'min_temp' => 10
        ]);
        Plant::create([
            'name' => 'Calathea Orbifolia',
            'description' => 'Une plante d\'intérieur avec de belles feuilles rayées.',
            'image' => 'https://images.unsplash.com/photo-1602923668104-8d8f8b9bc7f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80',
            'origin' => 'Amérique du Sud',
            'length' => 80,
            'fruit_production_month' => 6,
            'max_temp' => 28,
            'min_temp' => 18
        ]);
        Plant::create([
            'name' => 'Plante ZZ',
            'description' => 'Une plante d\'intérieur robuste et facile à entretenir.',
            'image' => 'https://images.unsplash.com/photo-1632207691143-7ee8c82f6e9f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80',
            'origin' => 'Afrique de l\'Est',
            'length' => 90,
            'fruit_production_month' => 6,
            'max_temp' => 30,
            'min_temp' => 15
        ]);
    }
}
