<?php

namespace App\Http\Controllers;

use App\Mappers\PreguntaMapper;
use App\Models\Pregunta;
use App\Models\Respuesta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\RespuestasController;
use Illuminate\Support\Facades\Log;

class PreguntasController extends Controller
{
    protected $respuestasController;

    public function __construct(RespuestasController $respuestasController)
    {
        $this->respuestasController = $respuestasController;
    }
    public function index()
    {

        try {
        // Obtener las preguntas con las respuestas mezcladas
        $Query = Pregunta::select('id', 'texto_pregunta', 'opciones_correctas')
            ->inRandomOrder()  // Aleatorio
            ->limit(10)        // Limitar a 10 preguntas
            ->get()
            ->map(function ($pregunta) {

                $preguntaId = $pregunta->id;

                // Obtener respuestas correctas (valor=1) mezcladas
                $consultaTrue = Respuesta::where("pregunta_id", $preguntaId)
                    ->where("valor", 1)
                    ->inRandomOrder()
                    ->limit($pregunta->opciones_correctas)
                    ->get();

                // Obtener respuestas falsas (valor=0) mezcladas con limite de dos
                $consultaFake = Respuesta::where("pregunta_id", $preguntaId)
                    ->where("valor", 0)
                    ->inRandomOrder()
                    ->limit(2)
                    ->get();

                $paquete = $consultaTrue->merge($consultaFake);

                $paquete = $paquete->shuffle();

                $pregunta->paquete_respuestas = $paquete;


                return $pregunta;
            });


        return response()->json([
            "statusCode" => 6001,
            "consulta" => $Query
        ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener preguntas y respuestas mezcladas:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);

            return response()->json([
                "statusCode" => 5000,
                "message" => "Error al obtener las preguntas y respuestas"
            ], 500);
        }
    }



    public function indexAdmin(Request $request)
    {
        $page = $request->query('page', 1); 

        $Query = Pregunta::with('respuestas') 
            ->paginate(10, ['*'], 'page', $page); 

        return response()->json([
            "statusCode" => 6001,
            "consulta" => $Query->items(), 
            "pagination" => [
                "current_page" => $Query->currentPage(),
                "total_pages" => $Query->lastPage(),
                "total_items" => $Query->total(),
                "per_page" => $Query->perPage(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {

            $data = $request->all();

            $preparedData = PreguntaMapper::prepareForSave($data);

            $question = Pregunta::create($preparedData);

            $answers = $data['respuestas'];

            $correctOptionsResponse = $this->respuestasController->store($answers, $question->id);
            if ($correctOptionsResponse->getStatusCode() !== 200) {

                throw new \Exception($correctOptionsResponse->getData()->error);
            }


            $question->opciones_correctas = $correctOptionsResponse->getData()->correctas;
            $question->save();
            Log::info('Updated pregunta with correct options: ' . $question->id);


            DB::commit();

            return response()->json([
                "statusCode" => 6001,
                "message" => "Pregunta guardada correctamente",
                "data" => $question,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                "statusCode" => 500,
                "message" => "Error al guardar la pregunta.",
                "error" => $e->getMessage(),
            ], 500);
        }
    }


    public function update($id, Request $request)
    {
        DB::beginTransaction();
        try {
            $question = Pregunta::find($id);
            if ($question) {
                $question->update($request->all());
            }
            DB::commit();
            return response()->json([
                'statusCode' => 6001,
                'message' => 'Respuesta actualizada correctamente.',
                'data' => $question,
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                "statusCode" => 500,
                "message" => "Error al actualizar la pregunta."
            ], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {

            $question = Pregunta::find($id);
            if ($question) {
                Respuesta::where('pregunta_id', $id)->delete();
                $question->delete();
                DB::commit();

                return response()->json([
                    "statusCode" => 6001,
                    "message" => "Pregunta eliminada correctamente"
                ]);
            } else {
                return response()->json([
                    "statusCode" => 404,
                    "message" => "Pregunta no encontrada."
                ], 404);
            }
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                "statusCode" => 500,
                "message" => "Error al eliminar la pregunta."
            ], 500);
        }
    }





}
