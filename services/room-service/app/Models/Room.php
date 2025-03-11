<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

class Room extends Model
{
    use HasFactory;

    protected $table = 'rooms'; // Đổi thành bảng rooms

    protected $fillable = [
        'name',        // Tên phòng
        'floor',       // Tầng
        'building',    // Tòa nhà
        'bed_count',   // Số giường
        'type',        // Loại phòng
        'price',       // Giá thuê
        'status'       // Trạng thái phòng (available, occupied, maintenance)
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($room) {
            $room->name = strtoupper(trim($room->name));
        });

        static::updating(function ($room) {
            $room->name = strtoupper(trim($room->name));
        });
    }

    public static function validationRules($roomId = null)
    {
        return [
            'name' => [
                'required',
                'string',
                Rule::unique('rooms')->where(fn ($query) => $query->where('building', request('building')))->ignore($roomId)
            ],
            'floor' => 'required|integer',
            'building' => 'required|string',
            'bed_count' => 'required|integer',
            'type' => 'required|string',
            'price' => 'required|numeric',
            'status' => 'required|in:available,occupied,maintenance'
        ];
    }
}
