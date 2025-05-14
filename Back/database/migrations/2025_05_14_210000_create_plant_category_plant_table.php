<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plant_category_plant', function (Blueprint $table) {
            $table->ulid('plant_id');
            $table->ulid('plant_category_id');
            $table->foreign('plant_id')->references('id')->on('plants')->onDelete('cascade');
            $table->foreign('plant_category_id')->references('id')->on('plant_categories')->onDelete('cascade');
            $table->primary(['plant_id', 'plant_category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plant_category_plant');
    }
};
