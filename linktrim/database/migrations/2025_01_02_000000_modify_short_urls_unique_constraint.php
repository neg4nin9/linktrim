<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop the existing unique constraint with prefix length
        DB::statement('ALTER TABLE short_urls DROP INDEX short_urls_original_url_unique');
        
        // Add a new unique constraint with a more appropriate prefix length
        // Using 191 characters for utf8mb4 (191 * 4 = 764 bytes, within the 767 byte limit)
        DB::statement('ALTER TABLE short_urls ADD UNIQUE short_urls_original_url_unique (original_url(191))');
    }

    public function down(): void
    {
        // Drop the new constraint
        DB::statement('ALTER TABLE short_urls DROP INDEX short_urls_original_url_unique');
        
        // Recreate the original constraint with 768 prefix length
        DB::statement('ALTER TABLE short_urls ADD UNIQUE short_urls_original_url_unique (original_url(768))');
    }
};