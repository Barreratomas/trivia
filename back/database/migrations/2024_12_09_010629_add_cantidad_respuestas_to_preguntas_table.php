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
        Schema::table('preguntas', function (Blueprint $table) {
            $table->integer('cantidad_respuestas')->default(2); // Agregar campo cantidad_respuestas
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('preguntas', function (Blueprint $table) {
            $table->dropColumn('cantidad_respuestas'); // Eliminar campo cantidad_respuestas
        });
    }
};
