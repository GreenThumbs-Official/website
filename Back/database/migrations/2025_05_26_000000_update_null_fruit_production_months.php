<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Mettre à jour les valeurs null du mois de production des fruits
        // Définir une valeur par défaut (par exemple, mois 6 = juin)
        DB::table('plants')
            ->whereNull('fruit_production_month')
            ->update(['fruit_production_month' => 6]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remettre les valeurs à null si nécessaire
        DB::table('plants')
            ->where('fruit_production_month', 6)
            ->update(['fruit_production_month' => null]);
    }
};