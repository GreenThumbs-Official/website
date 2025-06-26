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
        $query = Plant::query();

        // Filtres disponibles
        if ($request->has('origin') && $request->origin) {
            $query->where('origin', 'like', '%' . $request->origin . '%');
        }

        if ($request->has('fruit_production_month') && $request->fruit_production_month) {
            $query->where('fruit_production_month', $request->fruit_production_month);
        }

        if ($request->has('min_temp') && $request->min_temp) {
            $query->where('min_temp', '>=', $request->min_temp);
        }

        if ($request->has('max_temp') && $request->max_temp) {
            $query->where('max_temp', '<=', $request->max_temp);
        }

        if ($request->has('length_min') && $request->length_min) {
            $query->where('length', '>=', $request->length_min);
        }

        if ($request->has('length_max') && $request->length_max) {
            $query->where('length', '<=', $request->length_max);
        }

        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $plants = $query->paginate($perPage);

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
