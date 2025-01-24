<?php

namespace App\Mappers;

class RespuestaMapper
{

    

    public static function prepareForSave(array $answerData, int $idQuestion): array
    {
        return [
            'texto_respuesta' => $answerData['texto_respuesta'],
            'valor' => $answerData['valor'], 
            'pregunta_id' => $idQuestion,
        ];
    }
}
