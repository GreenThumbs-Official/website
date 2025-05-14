<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plant_type_plant', function (Blueprint $table) {
            $table->ulid('plant_id');
            $table->ulid('plant_type_id');
            $table->foreign('plant_id')->references('id')->on('plants')->onDelete('cascade');
            $table->foreign('plant_type_id')->references('id')->on('plant_types')->onDelete('cascade');
            $table->primary(['plant_id', 'plant_type_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plant_type_plant');
    }
};
