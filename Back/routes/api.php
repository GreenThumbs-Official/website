<?php

use App\Http\Controllers\TutorialController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\GeminiController;
use App\Http\Controllers\IntrestController;
use App\Http\Controllers\PlantController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;


/**
 * Routes used for authentification
 */
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

/**
 * Test route for API tokens
 */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user-profile', function (Request $request) {
        return $request->user();
    });
    Route::post('/complete-onboarding', [AuthController::class, 'completeOnboarding']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
});

/**
 * Default route used to get all plants
 */
Route::get('/plants', [PlantController::class, 'index']);
Route::get('/plants/{plant}', [PlantController::class, 'show']);

Route::get('/intrests', [IntrestController::class, 'index']);

Route::get('/favorites', [FavoriteController::class, 'index']);
Route::middleware(['auth:sanctum', 'can:isAdmin'])->group(function () {
    // Routes pour la gestion des plantes
    Route::post('/plants', [PlantController::class, 'store']);
    Route::put('/plants/{plant}', [PlantController::class, 'update']);
    Route::delete('/plants/{plant}', [PlantController::class, 'destroy']);

    // Routes pour la gestion des utilisateurs
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
});

Route::apiResource('tutorials', TutorialController::class)->only(['store', 'show']);

Route::post('/handle-prompt', [GeminiController::class, 'handlePrompt']);
Route::post('/handle-chat', [GeminiController::class, 'chat']);




/**
 * Fallback route if resource isn't found
 */
Route::fallback(function () {
    return response()->json([
        'error' => 'Route not found',
        'message' => 'The requested api endpoint does not exist',
        'status_code' => 404
    ], 404);
});
