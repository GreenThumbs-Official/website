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
        Schema::table('favorites', function (Blueprint $table) {
            $table->text('description')->nullable()->after('name');
            $table->string('image')->nullable()->after('description');
            $table->string('origin')->nullable()->after('image');
            $table->string('length')->nullable()->after('origin');
            $table->string('fruit_production_month')->nullable()->after('length');
            $table->integer('max_temp')->nullable()->after('fruit_production_month');
            $table->integer('min_temp')->nullable()->after('max_temp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('favorites', function (Blueprint $table) {
            $table->dropColumn([
                'description',
                'image',
                'origin',
                'length',
                'fruit_production_month',
                'max_temp',
                'min_temp'
            ]);
        });
    }
};
