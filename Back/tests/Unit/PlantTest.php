<?php

namespace Tests\Unit;

use App\Models\Plant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlantTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test que le modèle Plant peut être créé avec des données valides
     */
    public function test_plant_can_be_created_with_valid_data()
    {
        $plantData = [
            'name' => 'Tomate',
            'description' => 'Une plante de tomate délicieuse',
            'image' => 'tomate.jpg',
            'origin' => 'Amérique du Sud',
            'length' => '1.5m',
            'fruit_production_month' => 'Juillet-Septembre',
            'max_temp' => 30,
            'min_temp' => 15
        ];

        $plant = Plant::create($plantData);

        $this->assertInstanceOf(Plant::class, $plant);
        $this->assertEquals('Tomate', $plant->name);
        $this->assertEquals('Une plante de tomate délicieuse', $plant->description);
        $this->assertEquals('tomate.jpg', $plant->image);
        $this->assertEquals('Amérique du Sud', $plant->origin);
        $this->assertEquals('1.5m', $plant->length);
        $this->assertEquals('Juillet-Septembre', $plant->fruit_production_month);
        $this->assertEquals(30, $plant->max_temp);
        $this->assertEquals(15, $plant->min_temp);
        $this->assertDatabaseHas('plants', $plantData);
    }

    /**
     * Test que le modèle Plant utilise des ULIDs
     */
    public function test_plant_uses_ulids()
    {
        $plant = Plant::create([
            'name' => 'Test Plant',
            'description' => 'Test description',
            'image' => 'test.jpg',
            'origin' => 'Test Origin',
            'length' => '1m',
            'max_temp' => 25,
            'min_temp' => 10
        ]);

        $this->assertIsString($plant->id);
        $this->assertEquals(26, strlen($plant->id)); // ULID length
        $this->assertFalse($plant->incrementing);
        $this->assertEquals('string', $plant->getKeyType());
    }

    /**
     * Test de la relation many-to-many avec User
     */
    public function test_plant_belongs_to_many_users()
    {
        $plant = Plant::create([
            'name' => 'Basilic',
            'description' => 'Herbe aromatique',
            'image' => 'basilic.jpg',
            'origin' => 'Inde',
            'length' => '30cm',
            'max_temp' => 25,
            'min_temp' => 15
        ]);

        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'role' => 'user',
            'ville' => 'Paris',
            'pays' => 'France',
            'onboarding_completed' => true
        ]);

        // Attacher l'utilisateur à la plante avec des données pivot
        $plant->users()->attach($user->id, [
            'last_watered' => now(),
            'watering_frequency' => 3,
            'custom_name' => 'Mon Basilic',
            'description' => 'Mon basilic personnel',
            'origin' => 'Jardin',
            'image' => 'mon_basilic.jpg',
            'planted_date' => now()->subDays(30),
            'growth_progress' => 50
        ]);

        $this->assertTrue($plant->users()->exists());
        $this->assertEquals(1, $plant->users()->count());
        $this->assertEquals($user->id, $plant->users()->first()->id);
        
        // Vérifier les données pivot
        $pivotData = $plant->users()->first()->pivot;
        $this->assertEquals(3, $pivotData->watering_frequency);
        $this->assertEquals('Mon Basilic', $pivotData->custom_name);
        $this->assertEquals(50, $pivotData->growth_progress);
    }

    /**
     * Test des attributs fillable
     */
    public function test_plant_fillable_attributes()
    {
        $plant = new Plant();
        $expectedFillable = [
            'name',
            'description',
            'image',
            'origin',
            'length',
            'fruit_production_month',
            'max_temp',
            'min_temp'
        ];

        $this->assertEquals($expectedFillable, $plant->getFillable());
    }

    /**
     * Test de validation des données requises
     */
    public function test_plant_requires_name()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);
        
        Plant::create([
            'description' => 'Test description',
            'image' => 'test.jpg',
            'origin' => 'Test Origin',
            'length' => '1m',
            'max_temp' => 25,
            'min_temp' => 10
        ]);
    }

    /**
     * Test de mise à jour d'une plante
     */
    public function test_plant_can_be_updated()
    {
        $plant = Plant::create([
            'name' => 'Tomate',
            'description' => 'Ancienne description',
            'image' => 'old_image.jpg',
            'origin' => 'Ancien origine',
            'length' => '1m',
            'max_temp' => 25,
            'min_temp' => 10
        ]);

        $plant->update([
            'description' => 'Nouvelle description',
            'image' => 'new_image.jpg',
            'max_temp' => 30
        ]);

        $this->assertEquals('Nouvelle description', $plant->fresh()->description);
        $this->assertEquals('new_image.jpg', $plant->fresh()->image);
        $this->assertEquals(30, $plant->fresh()->max_temp);
        $this->assertEquals('Tomate', $plant->fresh()->name); // Inchangé
    }

    /**
     * Test de suppression d'une plante
     */
    public function test_plant_can_be_deleted()
    {
        $plant = Plant::create([
            'name' => 'Plante à supprimer',
            'description' => 'Test description',
            'image' => 'test.jpg',
            'origin' => 'Test Origin',
            'length' => '1m',
            'max_temp' => 25,
            'min_temp' => 10
        ]);

        $plantId = $plant->id;
        $plant->delete();

        $this->assertDatabaseMissing('plants', ['id' => $plantId]);
        $this->assertNull(Plant::find($plantId));
    }
}