<?php

namespace Database\Seeders;

use App\Models\Favorite;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FavoriteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $favorites = [
            [
                'name' => 'Monstera Deliciosa',
                'description' => 'Une plante tropicale populaire avec de grandes feuilles perforées.',
                'image' => 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80',
                'origin' => 'Amérique centrale et du Sud',
                'length' => '2-3 mètres en intérieur',
                'fruit_production_month' => null,
                'max_temp' => 27,
                'min_temp' => 18
            ],
            [
                'name' => 'Ficus Lyrata',
                'description' => 'Aussi appelé figuier lyre, apprécié pour ses grandes feuilles en forme de violon.',
                'image' => 'https://images.unsplash.com/photo-1616690710400-a16d146927c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80',
                'origin' => 'Afrique de l\'Ouest',
                'length' => '1.5-3 mètres en intérieur',
                'fruit_production_month' => null,
                'max_temp' => 26,
                'min_temp' => 16
            ],
            [
                'name' => 'Pothos Doré',
                'description' => 'Une plante grimpante facile d\'entretien avec des feuilles panachées.',
                'image' => 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80',
                'origin' => 'Îles Salomon',
                'length' => '2-4 mètres en suspension',
                'fruit_production_month' => null,
                'max_temp' => 29,
                'min_temp' => 15
            ],
            [
                'name' => 'Sansevière',
                'description' => 'Aussi appelée langue de belle-mère, très résistante et purificatrice d\'air.',
                'image' => 'https://images.unsplash.com/photo-1593482892290-f54927ae2b7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80',
                'origin' => 'Afrique de l\'Ouest',
                'length' => '0.3-1.2 mètres',
                'fruit_production_month' => null,
                'max_temp' => 32,
                'min_temp' => 10
            ],
            [
                'name' => 'Calathea Orbifolia',
                'description' => 'Une plante aux feuilles rondes avec des motifs rayés distinctifs.',
                'image' => 'https://images.unsplash.com/photo-1602923668104-8d8f8b9bc7f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80',
                'origin' => 'Amérique du Sud',
                'length' => '0.6-1 mètre',
                'fruit_production_month' => null,
                'max_temp' => 25,
                'min_temp' => 18
            ],
            [
                'name' => 'Plante ZZ',
                'description' => 'Zamioculcas zamiifolia, une plante très résistante et facile d\'entretien.',
                'image' => 'https://images.unsplash.com/photo-1632207691143-7ee8c82f6e9f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80',
                'origin' => 'Afrique de l\'Est',
                'length' => '0.6-1 mètre',
                'fruit_production_month' => null,
                'max_temp' => 26,
                'min_temp' => 15
            ]
        ];

        foreach ($favorites as $favorite) {
            Favorite::create($favorite);
        }
    }
}