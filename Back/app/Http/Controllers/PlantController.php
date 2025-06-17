<?php

namespace App\Http\Controllers;

use App\Models\Plant;
use Illuminate\Http\Request;

class PlantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $plants = Plant::paginate($perPage);

        return response()->json($plants);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'image' => 'nullable|string',
                'origin' => 'nullable|string|max:255',
                'length' => 'nullable|numeric',
                'fruit_production_month' => 'required|integer|between:1,12',
                'max_temp' => 'nullable|numeric',
                'min_temp' => 'nullable|numeric',
            ]);
            $plant = Plant::create($validated);
            return response()->json($plant, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Plant $plant)
    {
        return response()->json($plant);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Plant $plant)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'image' => 'nullable|string',
                'origin' => 'nullable|string|max:255',
                'length' => 'nullable|numeric',
                'fruit_production_month' => 'sometimes|required|integer|between:1,12',
                'max_temp' => 'nullable|numeric',
                'min_temp' => 'nullable|numeric',
            ]);
            $plant->update($validated);
            return response()->json($plant);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Plant $plant)
    {
        $plant->delete();
        return response()->json(['message' => 'Plant deleted successfully']);
    }
}
