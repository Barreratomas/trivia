<?php

namespace App\Mappers;

class PreguntaMapper
{

    public static function prepareForSave($data) 
    {
        return [
            'texto_pregunta' => $data['texto_pregunta'],
            'cantidad_respuestas' => count($data['respuestas']),
            'opciones_correctas' => 0,
        ];
    }
}
