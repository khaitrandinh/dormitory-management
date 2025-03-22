<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_code', // ✅ Thêm dòng này để cho phép tạo room_code
        'building',
        'floor',
        'bed_count',
        'room_type',
        'status',
        'price',
    ];
    public function students()
    {
        return $this->hasMany(Student::class, 'room_code', 'room_code');
    }
    
    public function contracts()
{
    return $this->hasMany(Contract::class);
}


}
