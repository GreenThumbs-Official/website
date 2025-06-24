<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'onboarding_completed' => (bool) $user->onboarding_completed,
        ]);
    }

    public function register(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'in:admin,user', // optional, defaults to user
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'user',
        ]);

        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'onboarding_completed' => (bool) $user->onboarding_completed,
        ], 201);
    }

    public function completeOnboarding(Request $request) {
        $request->validate([
            'profile.ville' => 'required|string|max:255',
            'profile.pays' => 'required|string|max:255',
        ]);

        $profile = $request->input('profile');
        $interests = $request->input('interests');
        $favoritePlants = $request->input('favoritePlants');


        $user = Auth::user();
        $user->ville = $profile['ville'];
        $user->pays = $profile['pays'];

        // Sync interests and favorite plants
        if (is_array($interests)) {
            $user->interests()->sync($interests);
        }
        if (is_array($favoritePlants)) {
            $user->favoritePlants()->sync($favoritePlants);
        }

        $user->onboarding_completed = true;
        $user->save();
        return response()->json(['message' => 'Position updated successfully', 'user' => $user]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . Auth::id(),
            'bio' => 'nullable|string|max:500',
            'location' => 'nullable|string|max:100',
        ]);

        $user = Auth::user();

        $location = $request->location;
        $ville = $user->ville;
        $pays = $user->pays;

        if ($location) {
            $locationParts = explode(',', $location);
            if (count($locationParts) >= 2) {
                $ville = trim($locationParts[0]);
                $pays = trim($locationParts[1]);
            } elseif (count($locationParts) == 1) {
                $ville = trim($locationParts[0]);
            }
        }

        $user->name = $request->username;
        $user->email = $request->email;
        $user->bio = $request->bio;
        $user->ville = $ville;
        $user->pays = $pays;
        $user->save();

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user,
        ]);
    }
}
