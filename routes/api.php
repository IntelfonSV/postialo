<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FreepikController;
use App\Http\Controllers\AssistantController;
use App\Http\Controllers\CallEvaluator;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\Api\PasarelaController;
use App\Http\Controllers\ScheduledPostController;

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


Route::match(
    ['get', 'post'],
    '/completition/{prompt}/{systemPrompt}/{model?}',
    [AssistantController::class, 'generateContentWithChat']
)->name('assistant.completition');

Route::post('/call-evaluator', [CallEvaluator::class, 'evaluateCall'])->name('call-evaluator.evaluateCall');


Route::post('/wh-11labs', [CallEvaluator::class, 'whCall11Lab'])->name('call-evaluator.whCall11Lab');
Route::post('/user-confirm', function (Request $request) {
    Log::info($request->all());
    return $request->all();
})->name('call-evaluator.userConfirm');



Route::post('/webhook-gateway', [PasarelaController::class, 'webhook'])
->name('pagadito.webhook');

Route::put('/scheduledPost', [ScheduledPostController::class, 'publishPost'])->name('post.publish');

Route::get('/schedules/publish', [ScheduleController::class, 'publishSchedules'])->name('schedules.publish');
Route::get('/schedules/{user}', [ScheduleController::class, 'getSchedules'])->name('getSchedules');
