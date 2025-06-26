<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Plant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un compte admin
        $admin = User::create([
            'name' => 'Admin GreenThumbs',
            'email' => 'admin@greenthumb.com',
            'password' => Hash::make('Test123@'),
            'role' => 'admin',
            'ville' => 'Paris',
            'pays' => 'France',
            'onboarding_completed' => true,
            'bio' => 'Administrateur de la plateforme GreenThumbs. Passionné de jardinage et expert en plantes d\'intérieur.',
        ]);

        // Créer des utilisateurs de test
        $user1 = User::create([
            'name' => 'Marie Dupont',
            'email' => 'marie.dupont@example.com',
            'password' => Hash::make('Test123@'),
            'role' => 'user',
            'ville' => 'Lyon',
            'pays' => 'France',
            'onboarding_completed' => true,
            'bio' => 'Amatrice de plantes vertes, j\'adore créer un petit jardin d\'intérieur dans mon appartement.',
        ]);

        $user2 = User::create([
            'name' => 'Pierre Martin',
            'email' => 'pierre.martin@example.com',
            'password' => Hash::make('Test123@'),
            'role' => 'user',
            'ville' => 'Marseille',
            'pays' => 'France',
            'onboarding_completed' => true,
            'bio' => 'Débutant en jardinage, je cherche à apprendre les bases pour bien m\'occuper de mes premières plantes.',
        ]);

        $user3 = User::create([
            'name' => 'Sophie Bernard',
            'email' => 'sophie.bernard@example.com',
            'password' => Hash::make('Test123@'),
            'role' => 'user',
            'ville' => 'Toulouse',
            'pays' => 'France',
            'onboarding_completed' => true,
            'bio' => 'Experte en plantes tropicales, je collectionne les variétés rares et exotiques.',
        ]);

        // Récupérer les plantes existantes
        $plants = Plant::all();

        if ($plants->count() > 0) {
            // Associer des plantes à l'admin
            $admin->plants()->attach($plants->random(3)->pluck('id'), [
                'last_watered' => Carbon::now()->subDays(rand(1, 5)),
                'watering_frequency' => 7,
                'custom_name' => null,
                'description' => 'Plante bien entretenue par l\'administrateur.',
                'origin' => 'Collection personnelle',
                'image' => null,
                'planted_date' => Carbon::now()->subMonths(rand(1, 12)),
                'growth_progress' => rand(20, 90),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Associer des plantes à Marie (utilisatrice expérimentée)
            $marieePlants = $plants->random(4);
            foreach ($marieePlants as $plant) {
                $user1->plants()->attach($plant->id, [
                    'last_watered' => Carbon::now()->subDays(rand(1, 3)),
                    'watering_frequency' => rand(5, 10),
                    'custom_name' => 'Ma belle ' . $plant->name,
                    'description' => 'Cette plante pousse très bien dans mon salon ensoleillé.',
                    'origin' => 'Jardinerie locale',
                    'image' => null,
                    'planted_date' => Carbon::now()->subMonths(rand(2, 18)),
                    'growth_progress' => rand(40, 95),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Associer des plantes à Pierre (débutant)
            $pierrePlants = $plants->random(2);
            foreach ($pierrePlants as $plant) {
                $user2->plants()->attach($plant->id, [
                    'last_watered' => Carbon::now()->subDays(rand(3, 8)),
                    'watering_frequency' => rand(7, 14),
                    'custom_name' => null,
                    'description' => 'Ma première plante, j\'apprends encore à bien m\'en occuper.',
                    'origin' => 'Cadeau d\'un ami',
                    'image' => null,
                    'planted_date' => Carbon::now()->subMonths(rand(1, 6)),
                    'growth_progress' => rand(10, 50),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Associer des plantes à Sophie (experte)
            $sophiePlants = $plants->random(5);
            foreach ($sophiePlants as $plant) {
                $user3->plants()->attach($plant->id, [
                    'last_watered' => Carbon::now()->subDays(rand(1, 4)),
                    'watering_frequency' => rand(4, 8),
                    'custom_name' => 'Spécimen ' . $plant->name,
                    'description' => 'Variété rare de ma collection, nécessite des soins particuliers.',
                    'origin' => 'Import spécialisé',
                    'image' => null,
                    'planted_date' => Carbon::now()->subMonths(rand(6, 24)),
                    'growth_progress' => rand(60, 100),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}