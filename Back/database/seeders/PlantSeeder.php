<?php

namespace Database\Seeders;

use App\Models\Plant;
use App\Models\PlantCategory;
use App\Models\PlantType;
use Illuminate\Database\Seeder;

class PlantSeeder extends Seeder
{
    public function run()
    {
        // Créer des catégories
        $categories = [
            'Fleurs' => PlantCategory::create(['name' => 'Fleurs', 'description' => 'Catégorie de fleurs']),
            'Arbres' => PlantCategory::create(['name' => 'Arbres', 'description' => 'Catégorie d\'arbres']),
        ];

        // Créer des types
        $types = [
            'Vivace' => PlantType::create(['name' => 'Vivace', 'description' => 'Type vivace']),
            'Annuelle' => PlantType::create(['name' => 'Annuelle', 'description' => 'Type annuelle']),
        ];

        // Créer des plantes et les associer à des catégories et types
        $plant1 = Plant::create([
            'name' => 'Rose',
            'description' => 'Une belle rose',
            'image' => 'rose.jpg',
        ]);
        $plant1->categories()->attach($categories['Fleurs']->id);
        $plant1->types()->attach($types['Vivace']->id);

        $plant2 = Plant::create([
            'name' => 'Chêne',
            'description' => 'Un grand chêne',
            'image' => 'chene.jpg',
        ]);
        $plant2->categories()->attach($categories['Arbres']->id);
        $plant2->types()->attach($types['Annuelle']->id);
    }
}
