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
        Schema::create('plants', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('description');
            $table->string('image');
            $table->ulid('category_id')->nullable();
            $table->foreign('category_id')->references('id')->on('plant_categories')->onDelete('cascade');
            $table->ulid('type_id')->nullable();
            $table->foreign('type_id')->references('id')->on('plant_types')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plants');
    }
};
