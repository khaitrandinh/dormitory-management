<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_code', 
        'building',
        'floor',
        'bed_count',
        'room_type',
        'status',
        'price',
    ];
    public function students()
    {
        return $this->hasManyThrough(Student::class, Contract::class);
    }

    
    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    public function activeContracts()
    {
        return $this->hasMany(Contract::class)->where('status', 'active');
    }
    
}
