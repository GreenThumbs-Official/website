<?php

namespace App\Http\Controllers;

use App\Models\Plant;
use Illuminate\Http\Request;

class PlantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $plants = Plant::with(['categories', 'types'])->get();

        return response()->json($plants);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Exemple de données à envoyer dans le corps de la requête
        //        {
        //            "name": "Tulipe",
        //            "description": "Une belle tulipe colorée",
        //            "image": "tulipe.jpg",
        //            "categories": ["01jv888wdxeys7rvx56xga3ger", "01jv888wdzkr6bpgzfzaj2q1jd"],
        //            "types": ["01jv888we16thndv73yhjef0nj"]
        //        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'categories' => 'array|exists:plant_categories,id',
                'types' => 'array|exists:plant_types,id',
            ]);

            $plant = Plant::create([
                'name' => $request->name,
                'description' => $request->description,
                'image' => $request->image,
            ]);

            if ($request->has('categories')) {
                $plant->categories()->sync($request->categories);
            }

            if ($request->has('types')) {
                $plant->types()->sync($request->types);
            }

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
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Plant $plant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Plant $plant)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Plant $plant)
    {
        //
    }
}
