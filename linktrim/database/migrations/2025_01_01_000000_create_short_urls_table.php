<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('short_urls', function (Blueprint $table) {
            $table->id();
            $table->text('original_url');
            $table->string('short_code', 8)->unique();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();
        });

        DB::statement('ALTER TABLE short_urls ADD UNIQUE short_urls_original_url_unique (original_url(191))');
    }

    public function down(): void
    {
        Schema::dropIfExists('short_urls');
    }
};
