<?php

use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\GeminiController;
use App\Http\Controllers\IntrestController;
use App\Http\Controllers\PlantController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;


/**
 * Routes used for authentification
 */
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/**
 * Test route for API tokens
 */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user-profile', function (Request $request) {
        return $request->user();
    });
    Route::post('/complete-onboarding', [AuthController::class, 'completeOnboarding']);
});

/**
 * Default route used to get all plants
 */
Route::get('/plants', [PlantController::class, 'index']);

Route::get('/intrests', [IntrestController::class, 'index']);

Route::get('/favorites', [FavoriteController::class, 'index']);
Route::middleware(['auth:sanctum', 'can:isAdmin'])->group(function () {
    Route::post('/plants', [PlantController::class, 'store']);
    Route::put('/plants/{plant}', [PlantController::class, 'update']);
    Route::delete('/plants/{plant}', [PlantController::class, 'destroy']);
});

Route::post('/handle-prompt', [GeminiController::class, 'handlePrompt']);




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
