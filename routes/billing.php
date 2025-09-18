<?php

use App\Http\Controllers\BillingController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/billing', [BillingController::class, 'show'])->name('billing.show');
    Route::post('/billing/pay', [BillingController::class, 'pay'])->name('billing.pay');
    Route::get('/billing/thanks', [BillingController::class, 'thanksPage'])->name('billing.thanksPage');
});