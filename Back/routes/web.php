<?php


use Illuminate\Support\Facades\Route;


/**
 * Fallback route if resource isn't found
 */
Route::fallback(function () {
    return response()->json([
        'error' => 'Route not found',
        'message' => 'The request is not a possible API endpoint',
        'status_code' => 404
    ], 404);
});
