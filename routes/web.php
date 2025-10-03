<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\BrandIdentityController;
use App\Http\Controllers\ScheduledPostController;
use App\Http\Controllers\FreepikController;
use App\Http\Controllers\ScheduledPostTextController;
use App\Http\Controllers\GenerateImageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DemoController;
use Spatie\Permission\Contracts\Role;
use App\Http\Controllers\LogoController;


Route::middleware(['auth', 'verified'])->group(function () {  
    Route::post('/users/demo', [UserController::class, 'demo'])->name('users.demo');
    Route::inertia('guides', 'Guides/FacebookAccessGuide')->name('guides');
    Route::get('/demos/guide', [DemoController::class, 'guide'])->name('demos.guide');
    Route::post('/logos/store', [LogoController::class, 'store'])->name('logos.store');
    Route::delete('/logos/{logo}', [LogoController::class, 'destroy'])->name('logos.destroy');
    Route::post('/demos/activate', [DemoController::class, 'activateDemo'])->name('demos.activate');
    Route::get('/', function () { return Inertia::render('Welcome');})->name('home');
});


Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return back()->with('message', 'Se ha enviado un nuevo correo de verificación.');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');

Route::middleware(['auth', 'verified', 'subscription'])->group(function () {
    Route::resource('brand-identities', BrandIdentityController::class)->names('brand-identities');
});

Route::middleware(['auth', 'verified', 'subscription', 'brand-identity'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('templates', TemplateController::class)->names('templates');
    Route::resource('schedules', ScheduleController::class);
    Route::post('schedules/{schedule}/update-template', [ScheduleController::class, 'updateTemplate'])->name('schedules.update-template');
    Route::post('scheduled-posts/{scheduled_post}/regenerate', [ScheduledPostController::class, 'regenerate'])->name('scheduled-posts.regenerate');
    Route::resource('scheduled-posts', ScheduledPostController::class);
    Route::post('/schedules/generate', [ScheduleController::class, 'generatePosts'])->name('schedules.generatePosts');
    Route::get('/freepik/get-image/{id}', [FreepikController::class,'getImage'])->name('freepik.getImage');
    Route::post('/schedules/regenerate-image/{schedule}', [ScheduleController::class, 'regenerateImage'])->name('schedules.regenerateImage');
    Route::post('/scheduled-posts/regenerate-text/{scheduled_post}', [ScheduledPostController::class, 'regenerateText'])->name('scheduled-posts.regenerate-text');
    Route::resource('scheduled-post-texts', ScheduledPostTextController::class);
    Route::put('/scheduled-post-texts/{scheduled_post_text}/update-content', [ScheduledPostTextController::class, 'updateContent'])->name('scheduled-post-texts.update-content');
    Route::put('/schedules/{schedule}/update-image', [ScheduleController::class, 'updateImage'])->name('schedules.update-image');
    Route::put('/scheduled-posts/{scheduled_post}/update-text', [ScheduledPostController::class, 'updateText'])->name('scheduled-posts.update-text');
    Route::put('/scheduled-posts/{scheduled_post}/update-status', [ScheduledPostController::class, 'updateStatus'])->name('scheduled-posts.update-status');
    Route::get('/generate-image/{schedule}', [GenerateImageController::class, 'generateImageFromHtml'])->name('generate-image');
    Route::put('/schedules/{schedule}/approve-texts', [ScheduleController::class, 'approveTexts'])->name('schedules.approve-texts');
    Route::put('/schedules/{schedule}/approve-image', [ScheduleController::class, 'approveImage'])->name('schedules.approve-image');
    Route::put('/schedules/send/{schedule}', [ScheduleController::class, 'sendSchedule'])->name('schedules.send');
    Route::put('/schedules/{schedule}/cancel', [ScheduleController::class, 'cancelSchedule'])->name('schedules.cancel');

});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('users', UserController::class)->names('users');
    Route::post('users/{user}/activate-demo', [UserController::class, 'activateDemo'])->name('users.activate-demo');
});


require __DIR__.'/auth.php';
require __DIR__.'/billing.php';

