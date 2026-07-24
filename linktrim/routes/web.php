<?php

use App\Http\Controllers\ShortUrlController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/{short_code}', [ShortUrlController::class, 'redirect'])
    ->where('short_code', '[A-Za-z0-9]+');
