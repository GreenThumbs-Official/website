<?php

use App\Http\Controllers\PlantController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('plants', PlantController::class);

Route::fallback(function () {
    return response()->json([
        'error' => 'Route not found',
        'message' => 'The requested api endpoint does not exist',
        'status_code' => 404
    ], 404);
});
