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
        Schema::create('watering_history', function (Blueprint $table) {
            $table->id();
            $table->ulid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->ulid('plant_id');
            $table->foreign('plant_id')->references('id')->on('plants')->onDelete('cascade');
            $table->date('watered_date');
            $table->time('watered_time')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Index pour optimiser les requêtes
            $table->index(['user_id', 'plant_id']);
            $table->index('watered_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('watering_history');
    }
};
