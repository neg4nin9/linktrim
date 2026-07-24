<?php

use App\Http\Controllers\ShortUrlController;
use Illuminate\Support\Facades\Route;

Route::post('/shorten', [ShortUrlController::class, 'shorten']);
Route::get('/scheduler/run', [ShortUrlController::class, 'runScheduler']);
