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

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('templates', TemplateController::class)->names('templates');
    Route::resource('brand-identities', BrandIdentityController::class)->names('brand-identities');
    Route::resource('schedules', ScheduleController::class);
    Route::post('scheduled-posts/{scheduled_post}/regenerate', [ScheduledPostController::class, 'regenerate'])->name('scheduled-posts.regenerate');
    Route::resource('scheduled-posts', ScheduledPostController::class);
    Route::post('/schedules/generate', [ScheduleController::class, 'generatePosts'])->name('schedules.generatePosts');
    Route::get('/freepik/get-image/{id}', [FreepikController::class,'getImage'])->name('freepik.getImage');
});

require __DIR__.'/auth.php';
