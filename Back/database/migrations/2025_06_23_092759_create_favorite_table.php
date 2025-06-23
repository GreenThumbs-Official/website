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
        Schema::create('favorites', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('user_favorite', function (Blueprint $table) {
            $table->ulid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->ulid('favorite_id');
            $table->foreign('favorite_id')->references('id')->on('favorites')->onDelete('cascade');
            $table->primary(['user_id', 'favorite_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorite');
    }
};
