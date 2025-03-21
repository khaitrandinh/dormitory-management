<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id', // ✅ Thêm dòng này để cho phép tạo user_id
        'student_code',
        'gender',
        'birth_date',
        'class',
        'faculty',
        'phone',
        'room_code',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function room()
    {
        return $this->belongsTo(Room::class, 'room_code', 'room_code');
    }

}
