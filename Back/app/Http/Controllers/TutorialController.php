<?php

namespace App\Http\Controllers;

use App\Models\Tutorial;
use Illuminate\Http\Request;

class TutorialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'tutorial' => 'required|string',
            'plant_id' => 'required|exists:plants,id',
        ]);

        $tutorial = Tutorial::create([
            'tutorial' => $request->input('tutorial'),
            'plant_id' => $request->input('plant_id'),
        ]);

        return response()->json($tutorial, 201);
    }

    /**
     * Display the tutorial for a specific plant.
     */
    public function show($plant_id)
    {
        $tutorial = Tutorial::where('plant_id', $plant_id)->first();
        if (!$tutorial) {
            return response()->json(['message' => 'Tutorial not found for this plant'], 404);
        }
        return response()->json(json_decode( $tutorial['tutorial']) , 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tutorial $tutorial)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tutorial $tutorial)
    {
        //
    }
}
