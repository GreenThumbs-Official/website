<?php

namespace App\Http\Controllers;

use App\Models\Plant;
use App\Models\User;
use App\Models\WateringHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class UserPlantController extends Controller
{
    /**
     * Display a listing of the user's plants.
     */
    public function index(Request $request)
    {   
        $user = Auth::user();
        $plants = $user->favoritePlants;
        
        // Transformer les données pour inclure les informations nécessaires
        $formattedPlants = $plants->map(function ($plant) {
            return [
                'id' => $plant->id,
                'name' => $plant->pivot->custom_name ?? $plant->name, 
                'type' => $plant->name, 
                'description' => $plant->pivot->description ?? $plant->description,
                'image' => $plant->pivot->image ?? $plant->image,
                'origin' => $plant->pivot->origin ?? $plant->origin,
                'length' => $plant->length,
                'fruit_production_month' => $plant->fruit_production_month,
                'max_temp' => $plant->max_temp,
                'min_temp' => $plant->min_temp,
                'last_watered' => $plant->pivot->last_watered ?? null,
                'planted_date' => $plant->pivot->planted_date ?? null,
                'watering_frequency' => $plant->pivot->watering_frequency ?? 7,
                'growth_progress' => $plant->pivot->growth_progress ?? 0,
            ];
        });
        
        return response()->json($formattedPlants);
    }

    /**
     * Store a newly created plant in the user's collection.
     */
    public function store(Request $request)
    {   
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'type' => 'required|string|max:255',
                'last_watered' => 'required|date',
                'planted_date' => 'required|date',
                'description' => 'required|string|max:500',
                'origin' => 'required|string|max:255',
                'watering_frequency' => 'required|integer|min:1|max:30',
                'image' => 'nullable|url|max:500',
            ]);
            
            $user = Auth::user();
            
            \Log::info('Données reçues pour l\'ajout d\'une plante:', $validated);
            
            // Rechercher la plante par son nom
            $plant = Plant::where('name', $validated['type'])->first();
            
            if (!$plant) {
                // Si la plante n'existe pas, créer une nouvelle plante
                \Log::info('Création d\'une nouvelle plante:', ['name' => $validated['type']]);
                
                $plant = Plant::create([
                    'name' => $validated['type'],
                    'description' => 'Plante ajoutée par l\'utilisateur',
                    'image' => null,
                    'origin' => null,
                    'length' => null,
                    'fruit_production_month' => null,
                    'max_temp' => null,
                    'min_temp' => null,
                ]);
            } else {
                \Log::info('Plante existante trouvée:', ['id' => $plant->id, 'name' => $plant->name]);
            }
            
            // Vérifier si la plante existe déjà dans la collection de l'utilisateur
            $exists = $user->favoritePlants()->where('plants.id', $plant->id)->exists();
            
            if ($exists) {
                \Log::info('La plante existe déjà dans la collection de l\'utilisateur');
                
                // Mettre à jour les données du pivot au lieu d'ajouter une nouvelle entrée
                $user->favoritePlants()->updateExistingPivot($plant->id, [
                    'last_watered' => $validated['last_watered'],
                    'planted_date' => $validated['planted_date'],
                    'description' => $validated['description'],
                    'origin' => $validated['origin'],
                    'watering_frequency' => $validated['watering_frequency'],
                    'image' => $validated['image'],
                    'custom_name' => $validated['name'], 
                ]);
            } else {
                \Log::info('Ajout de la plante à la collection de l\'utilisateur');
                
                // Ajouter la plante à la collection de l'utilisateur avec les données du pivot
                $user->favoritePlants()->attach($plant->id, [
                    'last_watered' => $validated['last_watered'],
                    'planted_date' => $validated['planted_date'],
                    'description' => $validated['description'],
                    'origin' => $validated['origin'],
                    'watering_frequency' => $validated['watering_frequency'],
                    'image' => $validated['image'],
                    'custom_name' => $validated['name'],
                ]);
            }
            
            // Récupérer la plante avec les données du pivot
            $userPlant = $user->favoritePlants()->where('plants.id', $plant->id)->first();
            
            return response()->json([
                'id' => $plant->id,
                'name' => $validated['name'],
                'type' => $plant->name,
                'last_watered' => $validated['last_watered'],
                'planted_date' => $validated['planted_date'],
                'watering_frequency' => $validated['watering_frequency'],
            ], 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Erreur de validation lors de l\'ajout d\'une plante:', ['errors' => $e->errors()]);
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de l\'ajout d\'une plante:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'An unexpected error occurred', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified plant in the user's collection.
     */
    public function update(Request $request, string $plantId)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'type' => 'required|string|max:255',
                'last_watered' => 'required|date',
                'planted_date' => 'required|date',
                'description' => 'required|string|max:500',
                'origin' => 'required|string|max:255',
                'watering_frequency' => 'required|integer|min:1|max:30',
                'image' => 'nullable|url|max:500',
            ]);
            
            $user = Auth::user();
            
            \Log::info('Données reçues pour la modification d\'une plante:', $validated);
            
            // Vérifier si la plante existe dans la collection de l'utilisateur
            $userPlant = $user->favoritePlants()->where('plants.id', $plantId)->first();
            
            if (!$userPlant) {
                return response()->json(['error' => 'Plant not found in user\'s collection'], 404);
            }
            
            // Rechercher la plante par son nom (type)
            $plant = Plant::where('name', $validated['type'])->first();
            
            if (!$plant) {
                // Si la plante n'existe pas, créer une nouvelle plante
                \Log::info('Création d\'une nouvelle plante:', ['name' => $validated['type']]);
                
                $plant = Plant::create([
                    'name' => $validated['type'],
                    'description' => 'Plante ajoutée par l\'utilisateur',
                    'image' => null,
                    'origin' => null,
                    'length' => null,
                    'fruit_production_month' => null,
                    'max_temp' => null,
                    'min_temp' => null,
                ]);
            }
            
            // Si le type de plante a changé, détacher l'ancienne et attacher la nouvelle
            if ($userPlant->id !== $plant->id) {
                // Détacher l'ancienne plante
                $user->favoritePlants()->detach($plantId);
                
                // Attacher la nouvelle plante avec les données mises à jour
                $user->favoritePlants()->attach($plant->id, [
                    'last_watered' => $validated['last_watered'],
                    'planted_date' => $validated['planted_date'],
                    'description' => $validated['description'],
                    'origin' => $validated['origin'],
                    'watering_frequency' => $validated['watering_frequency'],
                    'image' => $validated['image'],
                    'custom_name' => $validated['name'],
                    'growth_progress' => $userPlant->pivot->growth_progress ?? 0,
                ]);
                
                $plantId = $plant->id;
            } else {
                // Mettre à jour les données du pivot pour la même plante
                $user->favoritePlants()->updateExistingPivot($plantId, [
                    'last_watered' => $validated['last_watered'],
                    'planted_date' => $validated['planted_date'],
                    'description' => $validated['description'],
                    'origin' => $validated['origin'],
                    'watering_frequency' => $validated['watering_frequency'],
                    'image' => $validated['image'],
                    'custom_name' => $validated['name'],
                ]);
            }
            
            return response()->json([
                'id' => $plantId,
                'name' => $validated['name'],
                'type' => $plant->name,
                'last_watered' => $validated['last_watered'],
                'planted_date' => $validated['planted_date'],
                'description' => $validated['description'],
                'origin' => $validated['origin'],
                'watering_frequency' => $validated['watering_frequency'],
                'image' => $validated['image'],
            ], 200);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Erreur de validation lors de la modification d\'une plante:', ['errors' => $e->errors()]);
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la modification d\'une plante:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'An unexpected error occurred', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified plant from the user's collection.
     */
    public function destroy(string $plantId)
    {   
        try {
            $user = Auth::user();
            
            // Vérifier si la plante existe dans la collection de l'utilisateur
            $exists = $user->favoritePlants()->where('plants.id', $plantId)->exists();
            
            if (!$exists) {
                return response()->json(['error' => 'Plant not found in user\'s collection'], 404);
            }
            
            // Détacher la plante de la collection de l'utilisateur
            $user->favoritePlants()->detach($plantId);
            
            return response()->json(['message' => 'Plant removed from collection successfully']);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the watering date for a plant in the user's collection.
     */
    public function water(Request $request, string $plantId)
    {   
        try {
            $validated = $request->validate([
                'last_watered' => 'required|date|before_or_equal:today',
                'notes' => 'nullable|string|max:500',
            ]);
            
            $user = Auth::user();
            $wateredDate = Carbon::parse($validated['last_watered']);
            $today = Carbon::today();
            
            // Vérifier que la date n'est pas dans le futur
            if ($wateredDate->isAfter($today)) {
                return response()->json([
                    'error' => 'Impossible d\'arroser une plante dans le futur',
                    'message' => 'La date d\'arrosage ne peut pas être postérieure à aujourd\'hui'
                ], 422);
            }
            
            // Vérifier si la plante existe dans la collection de l'utilisateur
            $userPlant = $user->favoritePlants()->where('plants.id', $plantId)->first();
            
            if (!$userPlant) {
                return response()->json(['error' => 'Plant not found in user\'s collection'], 404);
            }
            
            // Vérifier si la plante a déjà été arrosée aujourd'hui
            $alreadyWateredToday = WateringHistory::forUser($user->id)
                ->forPlant($plantId)
                ->forDate($wateredDate)
                ->exists();
                
            if ($alreadyWateredToday) {
                return response()->json([
                    'error' => 'Plante déjà arrosée',
                    'message' => 'Cette plante a déjà été arrosée à cette date'
                ], 422);
            }
            
            // Enregistrer dans l'historique des arrosages
            WateringHistory::create([
                'user_id' => $user->id,
                'plant_id' => $plantId,
                'watered_date' => $wateredDate->format('Y-m-d'),
                'watered_time' => now()->format('H:i:s'),
                'notes' => $validated['notes'] ?? null,
            ]);
            
            // Calculer la nouvelle progression de croissance
            $currentProgress = $userPlant->pivot->growth_progress ?? 0;
            $newProgress = min($currentProgress + 5, 100);
            
            // Mettre à jour la date d'arrosage et la progression dans la table pivot
            $user->favoritePlants()->updateExistingPivot($plantId, [
                'last_watered' => $wateredDate->format('Y-m-d'),
                'growth_progress' => $newProgress,
            ]);
            
            return response()->json([
                'message' => 'Plant watering recorded successfully',
                'watered_date' => $wateredDate->format('Y-m-d'),
                'plant_name' => $userPlant->pivot->custom_name ?? $userPlant->name,
                'growth_progress' => $newProgress
            ]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Erreur de validation lors de l\'arrosage:', ['errors' => $e->errors()]);
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de l\'arrosage:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'An unexpected error occurred', 'message' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Get watering history for a specific plant
     */
    public function getWateringHistory(Request $request, string $plantId)
    {
        try {
            $user = Auth::user();
            
            // Vérifier si la plante existe dans la collection de l'utilisateur
            $exists = $user->favoritePlants()->where('plants.id', $plantId)->exists();
            
            if (!$exists) {
                return response()->json(['error' => 'Plant not found in user\'s collection'], 404);
            }
            
            $history = WateringHistory::forUser($user->id)
                ->forPlant($plantId)
                ->orderBy('watered_date', 'desc')
                ->orderBy('watered_time', 'desc')
                ->paginate(20);
                
            return response()->json($history);
            
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la récupération de l\'historique:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json(['error' => 'An unexpected error occurred'], 500);
        }
    }
    
    /**
     * Get watering statistics for the user
     */
    public function getWateringStats(Request $request)
    {
        try {
            $user = Auth::user();
            $today = Carbon::today();
            $weekAgo = $today->copy()->subDays(7);
            $monthAgo = $today->copy()->subDays(30);
            
            $weeklyWaterings = WateringHistory::forUser($user->id)
                ->where('watered_date', '>=', $weekAgo)
                ->count();
                
            $monthlyWaterings = WateringHistory::forUser($user->id)
                ->where('watered_date', '>=', $monthAgo)
                ->count();
                
            $totalPlants = $user->favoritePlants()->count();
            
            // Plantes nécessitant un arrosage (basé sur la fréquence)
            $plantsNeedingWater = $user->favoritePlants()->get()->filter(function ($plant) {
                $lastWatered = $plant->pivot->last_watered ? Carbon::parse($plant->pivot->last_watered) : null;
                $frequency = $plant->pivot->watering_frequency ?? 7;
                
                if (!$lastWatered) {
                    return true; // Jamais arrosée
                }
                
                return $lastWatered->addDays($frequency)->isPast();
            })->count();
            
            return response()->json([
                'weekly_waterings' => $weeklyWaterings,
                'monthly_waterings' => $monthlyWaterings,
                'total_plants' => $totalPlants,
                'plants_needing_water' => $plantsNeedingWater
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la récupération des statistiques:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json(['error' => 'An unexpected error occurred'], 500);
        }
    }
}