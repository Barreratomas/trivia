<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pregunta extends Model
{
    use HasFactory;
    // Agrego el atributo 'paqueteRespuestas' al modelo para que se incluya en las conversiones a JSON o arreglo
    // protected $appends=['paqueteRespuestas'];
    

    protected $fillable = ['texto_pregunta','opciones_correctas','cantidad_respuestas'];


    function respuestas(){
        return $this->hasMany(Respuesta::class);
    }


    // Accesor para calcular el paquete de respuestas relacionadas con la pregunta
    // public function getPaqueteRespuestasAttribute(){ 
    //     $preguntaId=$this->id;

    //     $consultaTrue=Respuesta::where("pregunta_id",$preguntaId)->where("valor",1)->inRandomOrder()->limit($this->opciones_correctas)->get();

    //     $consultaFake=Respuesta::where("pregunta_id",$preguntaId)->where("valor",0)->inRandomOrder()->limit(2)->get();

    //       // Combinar todos en un solo array
    //     $paquete = $consultaTrue->merge($consultaFake);

    //         $paquete = $paquete->shuffle();
        

    //     return $paquete;
    
    // }

}
