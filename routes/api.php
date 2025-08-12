<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FreepikController;
use App\Http\Controllers\AssistantController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/freepik/saveImage', [FreepikController::class, 'saveImage'])->name('freepik.saveImage');
Route::post('/brand-identity', function (Request $request) {
    return response()->json([
        'message' => 'Chipostialo',
    ]);
    
});

Route::post('/chipostialo', function (Request $request) {
    return response()->json([
        'message' => 'Chipostialo',
    ]);
});
Route::post('/assistant', [AssistantController::class, 'generateContent'])->name('assistant.generateContent');
