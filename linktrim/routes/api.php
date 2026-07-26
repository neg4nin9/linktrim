<?php

use App\Http\Controllers\ShortUrlController;
use App\Models\ShortUrl;
use Illuminate\Support\Facades\Route;

Route::post('/shorten', [ShortUrlController::class, 'shorten']);
Route::get('/scheduler/run', [ShortUrlController::class, 'runScheduler']);
Route::get('/ping', fn() => response()->json(['status' => 'ok', 'db' => ShortUrl::exists()]));