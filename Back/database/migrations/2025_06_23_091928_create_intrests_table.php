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
        Schema::create('intrests', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('user_intrest', function (Blueprint $table) {
            $table->ulid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->ulid('intrest_id');
            $table->foreign('intrest_id')->references('id')->on('intrests')->onDelete('cascade');
            $table->primary(['user_id', 'intrest_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('intrests');
    }
};
