<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Room;

class RoomSeeder extends Seeder
{
    public function run()
    {
        Room::create([
            'room_code' => 'A101',
            'building' => 'Tòa A',
            'floor' => 1,
            'bed_count' => 4,
            'room_type' => 'thường',
            'status' => 'đã thuê',
            'price' => 800000,
        ]);

        Room::create([
            'room_code' => 'B202',
            'building' => 'Tòa B',
            'floor' => 2,
            'bed_count' => 3,
            'room_type' => 'vip',
            'status' => 'trống',
            'price' => 1500000,
        ]);
    }
}
