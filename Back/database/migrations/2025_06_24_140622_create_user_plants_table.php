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
        Schema::create('user_plants', function (Blueprint $table) {
            $table->ulid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->ulid('plant_id');
            $table->foreign('plant_id')->references('id')->on('plants')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_plants');
    }
};
