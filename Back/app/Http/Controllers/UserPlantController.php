<?php

namespace App\Http\Controllers;

use App\Models\Plant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
                'description' => $plant->description,
                'image' => $plant->image,
                'origin' => $plant->origin,
                'length' => $plant->length,
                'fruit_production_month' => $plant->fruit_production_month,
                'max_temp' => $plant->max_temp,
                'min_temp' => $plant->min_temp,
                'last_watered' => $plant->pivot->last_watered ?? null,
                'planted_date' => $plant->pivot->planted_date ?? null,
                'watering_frequency' => $plant->pivot->watering_frequency ?? 7,
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
                'watering_frequency' => 'required|integer|min:1|max:30',
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
                    'watering_frequency' => $validated['watering_frequency'],
                    'custom_name' => $validated['name'], 
                ]);
            } else {
                \Log::info('Ajout de la plante à la collection de l\'utilisateur');
                
                // Ajouter la plante à la collection de l'utilisateur avec les données du pivot
                $user->favoritePlants()->attach($plant->id, [
                    'last_watered' => $validated['last_watered'],
                    'planted_date' => $validated['planted_date'],
                    'watering_frequency' => $validated['watering_frequency'],
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
                'last_watered' => 'required|date',
            ]);
            
            $user = Auth::user();
            
            // Vérifier si la plante existe dans la collection de l'utilisateur
            $exists = $user->favoritePlants()->where('plants.id', $plantId)->exists();
            
            if (!$exists) {
                return response()->json(['error' => 'Plant not found in user\'s collection'], 404);
            }
            
            // Mettre à jour la date d'arrosage dans la table pivot
            $user->favoritePlants()->updateExistingPivot($plantId, [
                'last_watered' => $validated['last_watered'],
            ]);
            
            return response()->json(['message' => 'Plant watering date updated successfully']);
            
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
}