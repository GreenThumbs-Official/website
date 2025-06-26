<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Plant;
use App\Models\Intrest;
use App\Models\Favorite;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test que le modèle User peut être créé avec des données valides
     */
    public function test_user_can_be_created_with_valid_data()
    {
        $userData = [
            'name' => 'Jean Dupont',
            'email' => 'jean.dupont@example.com',
            'password' => 'password123',
            'role' => 'user',
            'ville' => 'Paris',
            'pays' => 'France',
            'onboarding_completed' => true,
            'bio' => 'Passionné de jardinage'
        ];

        $user = User::create($userData);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('Jean Dupont', $user->name);
        $this->assertEquals('jean.dupont@example.com', $user->email);
        $this->assertEquals('user', $user->role);
        $this->assertEquals('Paris', $user->ville);
        $this->assertEquals('France', $user->pays);
        $this->assertTrue($user->onboarding_completed);
        $this->assertEquals('Passionné de jardinage', $user->bio);
        $this->assertTrue(Hash::check('password123', $user->password));
        $this->assertDatabaseHas('users', [
            'name' => 'Jean Dupont',
            'email' => 'jean.dupont@example.com',
            'role' => 'user',
            'ville' => 'Paris',
            'pays' => 'France'
        ]);
    }

    /**
     * Test que le modèle User utilise des ULIDs
     */
    public function test_user_uses_ulids()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'role' => 'user',
            'ville' => 'Test City',
            'pays' => 'Test Country',
            'onboarding_completed' => false
        ]);

        $this->assertIsString($user->id);
        $this->assertEquals(26, strlen($user->id)); // ULID length
        $this->assertFalse($user->incrementing);
        $this->assertEquals('string', $user->getKeyType());
    }

    /**
     * Test de la méthode isAdmin
     */
    public function test_is_admin_method()
    {
        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role' => 'admin',
            'ville' => 'Admin City',
            'pays' => 'Admin Country',
            'onboarding_completed' => true
        ]);

        $regularUser = User::create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => 'password',
            'role' => 'user',
            'ville' => 'User City',
            'pays' => 'User Country',
            'onboarding_completed' => false
        ]);

        $this->assertTrue($adminUser->isAdmin());
        $this->assertFalse($regularUser->isAdmin());
    }

    /**
     * Test de la relation avec les plantes (plants)
     */
    public function test_user_belongs_to_many_plants()
    {
        $user = User::create([
            'name' => 'Plant Lover',
            'email' => 'plantlover@example.com',
            'password' => 'password',
            'role' => 'user',
            'ville' => 'Garden City',
            'pays' => 'Green Country',
            'onboarding_completed' => true
        ]);

        $plant = Plant::create([
            'name' => 'Tomate',
            'description' => 'Délicieuse tomate',
            'image' => 'tomate.jpg',
            'origin' => 'Amérique du Sud',
            'length' => '1.5m',
            'max_temp' => 30,
            'min_temp' => 15
        ]);

        // Attacher la plante à l'utilisateur avec des données pivot
        $user->plants()->attach($plant->id, [
            'last_watered' => now(),
            'watering_frequency' => 3,
            'custom_name' => 'Ma Tomate',
            'description' => 'Ma tomate personnelle',
            'origin' => 'Mon jardin',
            'image' => 'ma_tomate.jpg',
            'planted_date' => now()->subDays(30),
            'growth_progress' => 75
        ]);

        $this->assertTrue($user->plants()->exists());
        $this->assertEquals(1, $user->plants()->count());
        $this->assertEquals($plant->id, $user->plants()->first()->id);
        
        // Vérifier les données pivot
        $pivotData = $user->plants()->first()->pivot;
        $this->assertEquals(3, $pivotData->watering_frequency);
        $this->assertEquals('Ma Tomate', $pivotData->custom_name);
        $this->assertEquals(75, $pivotData->growth_progress);
    }

    /**
     * Test de la relation favoritePlants
     */
    public function test_user_has_favorite_plants_relation()
    {
        $user = User::create([
            'name' => 'Plant Enthusiast',
            'email' => 'enthusiast@example.com',
            'password' => 'password',
            'role' => 'user',
            'ville' => 'Plant City',
            'pays' => 'Flora Country',
            'onboarding_completed' => true
        ]);

        $plant1 = Plant::create([
            'name' => 'Basilic',
            'description' => 'Herbe aromatique',
            'image' => 'basilic.jpg',
            'origin' => 'Inde',
            'length' => '30cm',
            'max_temp' => 25,
            'min_temp' => 15
        ]);

        $plant2 = Plant::create([
            'name' => 'Menthe',
            'description' => 'Herbe rafraîchissante',
            'image' => 'menthe.jpg',
            'origin' => 'Europe',
            'length' => '40cm',
            'max_temp' => 22,
            'min_temp' => 10
        ]);

        $user->favoritePlants()->attach([$plant1->id, $plant2->id]);

        $this->assertEquals(2, $user->favoritePlants()->count());
        $this->assertTrue($user->favoritePlants->contains($plant1));
        $this->assertTrue($user->favoritePlants->contains($plant2));
    }

    /**
     * Test des attributs fillable
     */
    public function test_user_fillable_attributes()
    {
        $user = new User();
        $expectedFillable = [
            'name',
            'email',
            'password',
            'role',
            'ville',
            'pays',
            'onboarding_completed',
            'bio'
        ];

        $this->assertEquals($expectedFillable, $user->getFillable());
    }

    /**
     * Test des attributs cachés
     */
    public function test_user_hidden_attributes()
    {
        $user = User::create([
            'name' => 'Hidden Test',
            'email' => 'hidden@example.com',
            'password' => 'secret123',
            'role' => 'user',
            'ville' => 'Secret City',
            'pays' => 'Hidden Country',
            'onboarding_completed' => false
        ]);

        $userArray = $user->toArray();
        
        $this->assertArrayNotHasKey('password', $userArray);
        $this->assertArrayNotHasKey('remember_token', $userArray);
        $this->assertArrayHasKey('name', $userArray);
        $this->assertArrayHasKey('email', $userArray);
    }

    /**
     * Test du hachage automatique du mot de passe
     */
    public function test_password_is_automatically_hashed()
    {
        $plainPassword = 'plaintext123';
        
        $user = User::create([
            'name' => 'Hash Test',
            'email' => 'hash@example.com',
            'password' => $plainPassword,
            'role' => 'user',
            'ville' => 'Hash City',
            'pays' => 'Crypto Country',
            'onboarding_completed' => true
        ]);

        $this->assertNotEquals($plainPassword, $user->password);
        $this->assertTrue(Hash::check($plainPassword, $user->password));
    }

    /**
     * Test de validation des données requises
     */
    public function test_user_requires_name_and_email()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);
        
        User::create([
            'password' => 'password',
            'role' => 'user',
            'ville' => 'Test City',
            'pays' => 'Test Country',
            'onboarding_completed' => false
        ]);
    }

    /**
     * Test de l'unicité de l'email
     */
    public function test_email_must_be_unique()
    {
        User::create([
            'name' => 'First User',
            'email' => 'unique@example.com',
            'password' => 'password',
            'role' => 'user',
            'ville' => 'First City',
            'pays' => 'First Country',
            'onboarding_completed' => false
        ]);

        $this->expectException(\Illuminate\Database\QueryException::class);
        
        User::create([
            'name' => 'Second User',
            'email' => 'unique@example.com', // Email dupliqué
            'password' => 'password',
            'role' => 'user',
            'ville' => 'Second City',
            'pays' => 'Second Country',
            'onboarding_completed' => true
        ]);
    }

    /**
     * Test de mise à jour d'un utilisateur
     */
    public function test_user_can_be_updated()
    {
        $user = User::create([
            'name' => 'Original Name',
            'email' => 'original@example.com',
            'password' => 'password',
            'role' => 'user',
            'ville' => 'Original City',
            'pays' => 'Original Country',
            'onboarding_completed' => false,
            'bio' => 'Original bio'
        ]);

        $user->update([
            'name' => 'Updated Name',
            'ville' => 'Updated City',
            'onboarding_completed' => true,
            'bio' => 'Updated bio'
        ]);

        $this->assertEquals('Updated Name', $user->fresh()->name);
        $this->assertEquals('Updated City', $user->fresh()->ville);
        $this->assertEquals(1, $user->fresh()->onboarding_completed); // Stocké comme entier en base
        $this->assertEquals('Updated bio', $user->fresh()->bio);
        $this->assertEquals('original@example.com', $user->fresh()->email); // Inchangé
    }

    /**
     * Test de suppression d'un utilisateur
     */
    public function test_user_can_be_deleted()
    {
        $user = User::create([
            'name' => 'User to Delete',
            'email' => 'delete@example.com',
            'password' => 'password',
            'role' => 'user',
            'ville' => 'Delete City',
            'pays' => 'Delete Country',
            'onboarding_completed' => false
        ]);

        $userId = $user->id;
        $user->delete();

        $this->assertDatabaseMissing('users', ['id' => $userId]);
        $this->assertNull(User::find($userId));
    }

    /**
     * Test des casts de dates
     */
    public function test_user_casts_email_verified_at_to_datetime()
    {
        $user = User::create([
            'name' => 'Cast Test',
            'email' => 'cast@example.com',
            'password' => 'password',
            'role' => 'user',
            'ville' => 'Cast City',
            'pays' => 'Cast Country',
            'onboarding_completed' => true
        ]);

        // Mettre à jour manuellement email_verified_at car ce n'est pas fillable
        $user->email_verified_at = now();
        $user->save();
        $user->refresh();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $user->email_verified_at);
    }
}