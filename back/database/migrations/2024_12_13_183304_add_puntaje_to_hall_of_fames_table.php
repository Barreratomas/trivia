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
        Schema::table('hall_of_fames', function (Blueprint $table) {
            $table->integer('Puntaje')->default(0); // Agregar columna Puntaje

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hall_of_fames', function (Blueprint $table) {
            $table->dropColumn('Puntaje'); // Eliminar columna Puntaje

        });
    }
};
