<?php

namespace App\Http\Controllers;

use App\Models\Respuesta;
use Illuminate\Http\Request;
use App\Mappers\RespuestaMapper;
use App\Models\Pregunta;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RespuestasController extends Controller
{

    public function updateCorrectQuantity($idQuestion){
        $question=Pregunta::find($idQuestion);
        if ($question) {
            $correctAnswers = Respuesta::where('pregunta_id', $question->id)
                ->where('valor', 1)  
                ->count();

            $question->update([
                'opciones_correctas' => $correctAnswers
            ]);
        }
    }
    
    public function storeOne(Request $request,$idQuestion){
        
        DB::beginTransaction();
        try {
            $data=$request->all();

            $preparedData=RespuestaMapper::prepareForSave($data, $idQuestion);

            $answer=Respuesta::create($preparedData);    

            $this->updateCorrectQuantity($idQuestion);

            DB::commit();
            return response()->json([
                "statusCode" => 6001,
                "message" => "Respuesta guardada correctamente",
                "data" => $answer,
            ]);   
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                "statusCode" => 500,
                "message" => "Error al guardar la pregunta.",
                "error" => $th->getMessage(),
            ], 500);
        }
  

    }

    public function store($answers, $idQuestion)
    {
        try {
            Log::info("Storing respuestas for pregunta ID: {$idQuestion}");
    
            $correctOptions = 0;
    
            foreach ($answers as $answerData) {
                Log::info("Processing respuesta data: " . json_encode($answerData));
    
                $preparedData = RespuestaMapper::prepareForSave($answerData, $idQuestion);
                Log::info("Prepared data for respuesta: " . json_encode($preparedData));
    
                $answer = Respuesta::create($preparedData);
                Log::info("Respuesta created: " . $answer->id);
    
                if ($answer->valor === 1) {
                    $correctOptions++;
                }
            }
    
            Log::info("Total correct options: {$correctOptions}");
    
            return response()->json(['correctas' => $correctOptions], 200);
        } catch (\Throwable $th) {
            Log::error("Error storing respuestas: " . $th->getMessage());
    
            return response()->json(['error' => 'Error al guardar la respuesta'], 500);
        }
    }

    public function update($id,Request $request){
        DB::beginTransaction();
        try {
            $answer=Respuesta::find($id);
            if (!$answer) {
                return response()->json([
                    'statusCode' => 404,
                    'message' => 'Respuesta no encontrada.',
                ], 404);
            }
            $originalValue = $answer->getOriginal('valor');
            $answer->update($request->only('texto_respuesta', 'valor'));
            $newValue = $answer->valor;

            if ($originalValue != $newValue) {
                $this->updateCorrectQuantity($answer->pregunta_id);

            }
    
            DB::commit();
            return response()->json([
                'statusCode' => 6001,
                'message' => 'Respuesta actualizada correctamente.',
                'data' => $answer,
            ]);

        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'statusCode' => 500,
                'message' => 'Error al actualizar la respuesta.',
                'error' => $th->getMessage(),
            ], 500);        }
    }

    public function destroy($id){
        DB::beginTransaction();
        try {
            $answer=Respuesta::find($id);
            if (!$answer) {
                return response()->json([
                    'statusCode' => 404,
                   'message' => 'Respuesta no encontrada.',
                ], 404);
            }
            $answer->delete();
            $this->updateCorrectQuantity($answer->pregunta_id);
            DB::commit();
            return response()->json([
               'statusCode' => 6001,
               'message' => 'Respuesta eliminada correctamente.',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
               'statusCode' => 500,
               'message' => 'Error al eliminar la respuesta.',
                'error' => $th->getMessage(),
            ], 500);
        }
    }


}
