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
            $table->text('description')->nullable()->after('watering_frequency');
            $table->string('origin')->nullable()->after('description');
            $table->string('image')->nullable()->after('origin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_plants', function (Blueprint $table) {
            $table->dropColumn(['description', 'origin', 'image']);
        });
    }
};
