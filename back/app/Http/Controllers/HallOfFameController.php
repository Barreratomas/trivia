<?php

namespace App\Http\Controllers;

use App\Models\HallOfFame;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class HallOfFameController extends Controller
{

    public function index()
    {
        DB::beginTransaction();
        try {
            $clasification = HallOfFame::orderBy('Puntaje', 'desc')
                ->orderBy('TiempoEnSegundos', 'asc')
                ->limit(10)
                ->get();

            DB::commit();

            return response()->json([
                "response" => $clasification
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                "error" => "Ocurrió un error al obtener la clasificación.",
                "mensaje" => $th->getMessage()
            ], 500);
        }
    }

    public function insert(Request $request)
    {
        DB::beginTransaction();
        try {
            HallOfFame::insert([
                "UserName" => $request->UserName,
                "Puntaje" => $request->Puntaje,
                "TiempoEnSegundos" => $request->TiempoTranscurrido
            ]);
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                "error" => "Ocurrió un error al insertar el registro.",
                "mensaje" => $th->getMessage()
            ], 500);

        }
    }

    public function delete($id)
    {
        DB::beginTransaction();

        try {
            $register = HallOfFame::find($id);
            if ($register) {
                $register->delete();
                DB::commit();
            } else {
                return response()->json([
                    "error" => "No se encontró el registro"
                ], 404);
            }
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                "error" => "Ocurrió un error al tratar de eliminar el registro.",
                "mensaje" => $th->getMessage()

            ], 500);
        }
    }
    public function deleteAll()
    {
        DB::beginTransaction();
        try {
            HallOfFame::truncate();
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                "error" => "Ocurrió un error al trata de eliminar todos los registros",
                "mensaje" => $th->getMessage()

            ], 500);
        }
    }
}
