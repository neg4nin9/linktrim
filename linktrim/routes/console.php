<?php

use App\Models\ShortUrl;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    ShortUrl::where(function ($q) {
        $q->whereNull('last_used_at')->where('created_at', '<', now()->subYear());
    })->orWhere('last_used_at', '<', now()->subYear())->delete();
})->daily();
