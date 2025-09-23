<?php

use App\Http\Controllers\BillingController;

//not subscription
Route::middleware(['auth', 'verified', 'no-subscription'])->group(function () {
    Route::get('/billing', [BillingController::class, 'show'])->name('billing.show');
    Route::post('/billing/pay', [BillingController::class, 'pay'])->name('billing.pay');
    Route::get('/billing/thanks', [BillingController::class, 'thanksPage'])->name('billing.thanksPage');
});