<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HallOfFame extends Model
{
    use HasFactory;
    protected $fillable = ['UserName', 'TiempoEnSegundos','Puntaje'];


    

}
