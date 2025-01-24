<?php

use App\Http\Controllers\HallOfFameController;
use App\Http\Controllers\PreguntasController;
use App\Http\Controllers\RespuestasController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/preguntas', [PreguntasController::class, "index"]);
Route::get('/preguntas/admin', [PreguntasController::class, "indexAdmin"]);
Route::post('/preguntas', [PreguntasController::class, "store"]);
Route::put('/preguntas/{id}', [PreguntasController::class, "update"]);
Route::delete('/preguntas/{id}', [PreguntasController::class, "destroy"]);


Route::post('/respuesta/{id_pregunta}', [RespuestasController::class, "storeOne"]);
Route::post('/respuestas', [RespuestasController::class, "store"]);
Route::put('/respuestas/{id}', [RespuestasController::class, "update"]);
Route::delete('/respuestas/{id}', [RespuestasController::class, "destroy"]);


Route::get('/hall_of_fame',[HallOfFameController::class,"index"]);
Route::post('/hall_of_fame',[HallOfFameController::class,"insert"]);
Route::delete('/hall_of_fame/to/{id}',[HallOfFameController::class,"delete"]);
Route::delete('/hall_of_fame/all',[HallOfFameController::class,"deleteAll"]);

