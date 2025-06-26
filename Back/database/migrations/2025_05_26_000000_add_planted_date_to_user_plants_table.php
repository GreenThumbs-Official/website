<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('user_plants', function (Blueprint $table) {
            $table->date('planted_date')->nullable()->after('last_watered');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_plants', function (Blueprint $table) {
            $table->dropColumn('planted_date');
        });
    }
};