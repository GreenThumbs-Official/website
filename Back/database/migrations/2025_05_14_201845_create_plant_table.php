<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plants', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('description');
            $table->string('image');
            $table->string('origin');
            $table->decimal('length', 8, 2); // in meters
            $table->unsignedTinyInteger('fruit_production_month')->nullable();
            $table->integer('max_temp');
            $table->integer('min_temp');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plants');
    }
};
