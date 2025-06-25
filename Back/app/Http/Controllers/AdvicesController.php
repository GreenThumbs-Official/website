<?php

namespace App\Http\Controllers;

use App\Models\Advices;
use Illuminate\Http\Request;

class AdvicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $advices = Advices::paginate($perPage);

        return response()->json($advices);
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
            ]);
            $advices = Advices::create($validated);
            return response()->json($advices, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Advices $advices)
    {
        return response()->json($advices);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Advices $advices)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
            ]);
            $advices->update($validated);
            return response()->json($advices);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Advices $advices)
    {
        $advices->delete();
        return response()->json(['message' => 'Advice deleted successfully']);
    }
}
